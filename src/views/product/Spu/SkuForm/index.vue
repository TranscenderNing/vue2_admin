<template>
  <div>
    <el-form ref="form" label-width="80px">

      <el-form-item label="spu名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="sku名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格">
        <el-input placeholder="价格" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>

      <el-form-item label="重量">
        <el-input placeholder="重量" v-model="skuInfo.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"> </el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName"  v-for="(attr,index) in attrInfo" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in saleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.saleAttrAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="imgs" @selection-change="handleSelectionChange">
          <el-table-column  type="selection" prop="prop" label="label" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width: 100px; height: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault===0" @click="changeDefault(row)">设为默认</el-button>
              <el-button type="warning" v-else @click="row.isDefault=0">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>


      <el-form-item label="操作">
        <el-button type="primary" @click="savaSkuInfo">保存</el-button>
        <el-button @click="handleCancleButton">取消</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {

  data(){
    return {
      // 从服务器获取到的数据
      imgs: [],
      saleAttrList: [], // 销售属性
      attrInfo: [],    //平台属性

      // 收集sku数据的字段
      skuInfo: {
        // 第一类收集的数据 父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类收集的数据 v-model绑定用户输入到表单的数据
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 第三类收集的数据 写代码收集
        // 收集图片
        skuDefaultImg: "", //默认图片
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],

        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string"
          // }
        ],

        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
      },

      // 从父组件获得的全部参数
      spu:{},

      // 收集到不完整的 图片信息 缺少default字段，当点击 “设置默认按钮” 后 default字段已经有了
      incompleteImgs: []

      
    }
  },


  methods: {
    // 获取skuform 数据
    async getData(category1Id,category2Id,row){

      // 收集从父组件获得的数据
      this.skuInfo.category3Id = row.category3Id
      this.skuInfo.spuId = row.id
      this.skuInfo.tmId = row.tmId
      this.spu = row


      console.log('从服务器获取数据')
      let imgres = await this.$API.sku.getrImageList(row.id)
      if(imgres.code === 200){
        console.log('img',imgres)
        let list = imgres.data
        list.forEach(item =>{
          item.isDefault = 0
        })
        this.imgs = list
      }

      let saleres = await this.$API.sku.getSaleAttrList(row.id)
      if(saleres.code === 200){
        console.log('sale',saleres)
        this.saleAttrList = saleres.data
      }

      let attrres = await this.$API.sku.getAttrInfoList(category1Id,category2Id,row.category3Id)
      if(attrres.code === 200){
        console.log('attr',attrres)
        this.attrInfo = attrres.data
      }

    },

    // 点击取消按钮的回调 切换
    handleCancleButton(){
      this.$emit('changeScene',0)
    },

    // table 第一列 复选框 的回调
    handleSelectionChange(selection){
      console.log(selection)
      this.incompleteImgs = selection
    },

    // 点击 设置默认 按钮的回调, 排他操作
    changeDefault(row){
      this.imgs.forEach(item =>{
        item.isDefault = 0
      })
      row.isDefault = 1
      //收集默认图片的信息
      console.log(row.imgUrl)
      this.skuInfo.skuDefaultImg = row.imgUrl
      console.log(row.imgUrl,this.skuInfo.skuDefaultImg)
    },

    // 点击 保存按钮 整理给服务器发送的参数 发送请求
    async savaSkuInfo(){
      
      const {saleAttrList,attrInfo,skuInfo,incompleteImgs} = this

      skuInfo.skuAttrValueList = attrInfo.reduce((prev,item)=>{
        if(item.attrAndValueId){
          const [attrId,valueId] = item.attrAndValueId.split(':')
          prev.push({attrId,valueId})
        }
        return prev
      },[])

      
      skuInfo.skuSaleAttrValueList = saleAttrList.reduce((prev,item)=>{
        if(item.saleAttrAndValueId){
          const [saleAttrId,saleAttrValueId] = item.saleAttrAndValueId.split(':')
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])

      skuInfo.skuImageList = incompleteImgs.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      let res = await this.$API.sku.saveSkuInfo(skuInfo)
      if(res.code === 200){
        this.$message('保存成功')
        this.$emit('changeScene',0)
      }else{
        this.$message('保存失败')
      }
    }

  }

}
</script>

<style></style>