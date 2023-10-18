<template>
  <div>
    <el-card style="margin: 20px 0px;">
      <CatogorySelect @getCategoryId="getCategoryId" :show="!isShow" />
    </el-card>
    <el-card>

      <!-- 添加编辑删除操作 展示数据 -->
      <div v-show="isShow">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="handleAddAttr">添加属性</el-button>
        <!-- 表格 展示平台属性-->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag style="margin: 0px 20px;" type="success" v-for="(value, index) in row.attrValueList"
                :key="value.id">{{ value.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <!-- 修改按钮 -->
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" ></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加编辑界面 -->
      <div v-show="!isShow">

        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" @click="addAttr" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button type="primary">取消</el-button>

        <el-table border style="width: 100%; margin: 20px 0px;" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width" align="center">
            <template slot-scope="{row,$index}">
              <el-input :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.isEdit" 
              @blur="toLookMode(row)" @keyup.native.enter="toLookMode(row)"></el-input>
              <span v-else  @click="toEditMode(row,$index)">{{ row.valueName }} </span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template slot-scope="{row,$index}">
              <el-popconfirm title="确定删除该属性值吗？"  @onConfirm="confirmDeletAttrValue($index)">
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm> 
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="saveData" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShow=true" >取消</el-button>

      </div>
    </el-card>

  </div>
</template>

<script>
import { Row } from 'element-ui'
import cloneDeep from 'lodash/cloneDeep'
export default {
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      // 下方卡片两个 table 切换
      isShow: true,

      // 服务器接口 添加属性值 修改属性需要的参数
      attrInfo:{
          attrName : '',
          attrValueList: [
            // {
            //   attrId: 0,
            //   valueName: ''
            // }
          ],
          categoryId: '',   // 三级分类的id
          categoryLevel: 3,
      },

    }
  },
  methods: {
    getCategoryId({ id, level }) {
      console.log(id, level)
      if (level === 1) {
        this.category1Id = id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = id
        this.category3Id = ''
      } else {
        this.category3Id = id
        // 根据三个 分类id 向服务器发送请求 获取数据
        this.getAttrList()
      }
    },

    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this
      let res = await this.$API.attr.getAttrList(category1Id, category2Id, category3Id)
      console.log('attr list:', res)
      if (res.code === 200) {
        this.attrList = res.data
      }
    },

    // 每次点击 添加属性值按钮 需要向数组中加入一个元素
    addAttr(){
      this.attrInfo.attrValueList.push({
          attrId:this.attrInfo.id,  // 修改已有属性的时候，属性具有id, 添加新的属性时候，没有属性id，是undefined
          valueName:'',
          isEdit: true, // 编辑模式 和 查看模式 进行切换 输入框和span切换
        })

      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },

    // 添加属性按钮
    handleAddAttr(){
      this.isShow = false
        // 清除数据
      this.attrInfo = {
          attrName : '',
          attrValueList: [
          ],
          categoryId: this.category3Id,  
          categoryLevel: 3,
      }
    },

    // 修改某一个属性
    updateAttr(row){
      this.isShow = false
      this.attrInfo = cloneDeep(row)

      this.attrInfo.attrValueList.forEach(item=>{
        this.$set(item,'isEdit',false)
      })
    },

    // 从编辑模式切换到查看模式 input -》 span
    toLookMode(row){
      if(row.valueName.trim() === ''){
        this.$message('请你输入一个正常的属性值')
        return ;
      }
      // 新增的属性值不能和已有的重复

      let isRepeat = this.attrInfo.attrValueList.some(item => {
        if(row !== item){
          return row.valueName === item.valueName
        }
      })

      if(isRepeat){
        this.$message('请你输入一个不重复的属性值')
        return ;
      }

      row.isEdit=false
    },
    // 从查看模式切换到 编辑模式 span -> input
    toEditMode(row,index){
      row.isEdit=true
      // 获取input节点 自动聚焦
      this.$nextTick(()=>{
        this.$refs[index].focus()
      })


    },

    // 确认删除 某个属性值
    confirmDeletAttrValue(index){
      console.log('触发了')
      this.attrInfo.attrValueList.splice(index,1)
    },

    // 添加新的数据 或者  更新数据后  将修改后的数据提交到服务器进行保存
    async saveData(){

      // 校验数据  去除空的数据
      // 提交的数据中 要去掉 isEdit字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        if(item.valueName != ''){
          delete item.isEdit
          return true
        }
      })
      let res = await this.$API.attr.saveAttrInfo(this.attrInfo)
      console.log('保存数据',res)
      if(res.code === 200){
        this.$message({type:'success',message: '保存成功'})
        this.getAttrList()
        this.isShow = true
      }else{
        this.$message({type:'warning',message: '保存失败'})
      }
    }



  }

}
</script>

<style></style>