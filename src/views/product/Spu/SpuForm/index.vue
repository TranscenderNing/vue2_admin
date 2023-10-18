<template>
    <div>

        <el-form ref="form" label-width="80px" :model="spu">
            <el-form-item label="spu名称">
                <el-input placeholder="请输入spu名称" v-model="spu.spuName"></el-input>
            </el-form-item>

            <el-form-item label="品牌">
                <el-select placeholder="请选择品牌" v-model="spu.tmId">
                    <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in tradeMarkList"
                        :key="tm.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="spu的描述">
                <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
            </el-form-item>

            <el-form-item label="spu图片">
                <el-upload action="/api/admin/product/fileUpload" list-type="picture-card" :file-list="spuImgs"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleUploadImg">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>

            <el-form-item label="销售属性">
                <el-select :placeholder="`还有${unSelectAttr.length}未选择`" v-model="attrId">
                    <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectAttr" :key="unselect.id"> 
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" :disabled="!attrId" @click="addSaleAttr">添加销售属性</el-button>
                <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="width">
                    </el-table-column>
                    <el-table-column prop="prop" label="属性值名称列表" width="width">
                        <template slot-scope="{row,$index}">
                            
                            <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false"
                                @close="handleClose(row,index)">
                                {{ tag.saleAttrValueName }}
                            </el-tag>

                            <el-input 
                                class="input-new-tag" 
                                v-if="row.inputVisible" 
                                v-model="row.inputValue" 
                                ref="saveTagInput"
                                size="small" 
                                @keyup.enter.native="handleInputConfirm" 
                                @blur="handleInputConfirm(row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small"  @click="addAttrValue(row)">添加</el-button>
                        
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttr($index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="addOrUpdataSpu">保存</el-button>
                <el-button @click="handleCancelButton">取消</el-button>
            </el-form-item>



        </el-form>



    </div>
</template>
  
<script>
export default {
    data() {
        return {
            // 照片墙用到的数据
            dialogImageUrl: '',
            dialogVisible: false,
            // 存储spu 在修改 的时候会向服务器返回的信息 ， 添加的时候 不需要向服务器发送请求
            spu: {
                category3Id: 0,
                tmId: 0,
                description: "",
                spuName: "",
                spuImageList: [
                    {
                        id: 0,
                        imgName: "",
                        imgUrl: "",
                        spuId: 0
                    }
                ],

                spuSaleAttrList: [
                    {
                        baseSaleAttrId: 0,
                        id: 0,
                        saleAttrName: "",
                        spuId: 0,
                        spuSaleAttrValueList: [
                            {
                                baseSaleAttrId: 0,
                                id: 0,
                                isChecked: "",
                                saleAttrName: "",
                                saleAttrValueName: "",
                                spuId: 0
                            }
                        ]
                    }
                ],
            },
            // 品牌信息
            tradeMarkList: [],
            // spu图片信息
            spuImgs: [],
            // 销售属性
            saleAttrs: [],
            // 收集没有选择的销售属性的id
            attrId: ''


        }
    },

    methods: {
        // 添加属性值 按钮的回调
        addAttrValue(row){
            // button -> input
            this.$set(row,'inputVisible',true)
            this.$set(row,'inputValue','')
        },
        // 照片墙用到的回调
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.spuImgs = fileList
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleUploadImg(response,file,fileList){
            console.log(response,file,fileList)
            this.spuImgs = fileList
        },
        // 向服务器发送请求 获取要展示的数据
        async initSpuData(row) {
            console.log('发送请求', row)
            // 获取spu信息
            let spures = await this.$API.spu.getSpuById(row.id)
            if (spures.code === 200) {
                this.spu = spures.data
            }

            // 获取品牌的信息
            let tradeMarkRes = await this.$API.spu.getTradeMarkList()
            if (tradeMarkRes.code === 200) {
                this.tradeMarkList = tradeMarkRes.data
            }

            // 获取图片的内容
            let imgRes = await this.$API.spu.getSpuImgs(row.id)
            if (imgRes.code === 200) {
                let imgs = imgRes.data
                imgs.forEach(element => {
                    element.name = element.imgName
                    element.url = element.imgUrl
                });
                this.spuImgs = imgs
            }

            // 获取平台所有销售属性
            let saleRes = await this.$API.spu.getSaleAttrList()
            if (saleRes.code === 200) {
                this.saleAttrs = saleRes.data
            }
        },
        // 点击取消按钮
        handleCancelButton(){
            this.$emit('changeScene', 0)
            Object.assign(this._data,this.$options.data())
        },

        //添加  发送请求
        async initAddSpu(category3Id){
            console.log('添加发送请求',category3Id)
            this.spu.category3Id = category3Id
            // 获取品牌的信息
            let tradeMarkRes = await this.$API.spu.getTradeMarkList()
            if (tradeMarkRes.code === 200) {
                this.tradeMarkList = tradeMarkRes.data
            }
            // 获取平台所有销售属性
            let saleRes = await this.$API.spu.getSaleAttrList()
            if (saleRes.code === 200) {
                this.saleAttrs = saleRes.data
            }

        },

        // 属性框 tag 回调
        handleClose(row,index) {
        //  this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            row.spuSaleAttrValueList.splice(index,1)

        },

        deleteAttr(index){
            this.spu.spuSaleAttrList.splice(index,1)
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 失去焦点
        handleInputConfirm(row) {
            const {baseSaleAttrId,inputValue} = row
            // 属性值不能重复
            if(inputValue.trim() === ''){
                this.$message('属性值不能为空')
                return ;
            }
            // 属性值不能重复
            let isRepeat = row.spuSaleAttrValueList.some(item=>{
                console.log(item.saleAttrValueName,inputValue)
                return item.saleAttrValueName === inputValue
            })
            console.log(isRepeat)
            if(isRepeat){
                this.$message('属性值不能重复')
                return ;
            }

            let newAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
            row.spuSaleAttrValueList.push(newAttrValue)
            row.inputVisible = false
        },

        addSaleAttr(row){
            const [baseSaleAttrId, saleAttrName] = this.attrId.split(':')
            console.log(baseSaleAttrId, saleAttrName)
            let newAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
            this.spu.spuSaleAttrList.push(newAttr)
            this.attrId = ''
        },
        // 保存按钮的回调
        async addOrUpdataSpu(){

            this.spu.spuImageList = this.spuImgs.map(item=>{
                return {
                    imgName: item.name,
                    imgUrl: (item.response && item.response.data) || item.url
                }
            })
            let res = await this.$API.spu.addOrUpdateSpu(this.spu)
            console.log('save',res)
            if(res.code === 200){
                this.$message('保存成功')
            }else{
                this.$message('保存失败')
            }
        }


    
    },

    computed:{
        unSelectAttr(){
            let result = this.saleAttrs.filter(item=>{
                return this.spu.spuSaleAttrList.every(item1=>{
                    console.log(item.name,item1.saleAttrName)
                    return item.name != item1.saleAttrName
                })
            })
            console.log(result)
            return result
        }
    }

}
</script>
  
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>