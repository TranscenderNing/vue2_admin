<template>
  <div>

    <!-- 顶部 三级联动菜单 -->
    <el-card style="margin: 20px 0px">
      <CatogorySelect @getCategoryId="getCategoryId" :show="scene !== 0" />
    </el-card>

    <!-- 底部 三部分进行切换 -->
    <el-card>

      <!-- 1. 展示spu列表 -->
      <div v-show="scene === 0">
        <el-button type="primary" @click="addSpu" :disabled="!category3Id">添加SPU</el-button>
        <el-table style="width: 100%" :data="spuList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <HintButton type="success" size="mini" icon="el-icon-plus" title="添加sku" @click="addSku(row)"></HintButton>
              <HintButton type="warning" size="mini" icon="el-icon-edit" title="修改spu" @click="updateSpu(row)">
              </HintButton>
              <HintButton type="info" size="mini" icon="el-icon-info" title="查看spu全部sku列表" @click="lookupSkuList(row)"></HintButton>

              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpuItem(row)">
                <HintButton slot="reference" type="danger" size="mini" icon="el-icon-delete" title="删除spu"></HintButton>
              </el-popconfirm>


            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination style="margin-top: 20px; textAlign:center" @size-change="handleSizeChange"
          @current-change="getSpuList" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total" :total="total">
        </el-pagination>
      </div>

      <!-- 2. 修改 或者 编辑 -->
      <SpuForm v-show="scene === 1" @changeScene="changeScene" ref="spu" />


      <!-- 3. 展示 添加sku 结构-->
      <SkuForm v-show="scene === 2" @changeScene="changeScene" ref="skuForm" />

    </el-card>

    <!-- 对话框显示 sku信息 -->
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="closeDialog">
      <el-table :data="skuList"  v-loading="loading">
        <el-table-column property="skuName" label="名称" width="150"></el-table-column>
        <el-table-column property="price" label="价格" width="200"></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column property="address" label="默认图片">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


  </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
import { done } from 'nprogress'

export default {
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 控制三级联动的可操作性
      isShow: true,
      page: 1,
      limit: 3,
      total: 0,
      spuList: [],
      // 控制下方 可选的 3 种结构中展示 哪一个结构
      scene: 0,
      // 控制对话框的额显示隐藏 对话框用于展示sku列表
      dialogTableVisible: false,
      // 显示对话框用到的 spu数据
      spu: {},
      // 从服务器根据spuid 获得的sku列表
      skuList: [],
      // loading加载
      loading: true,

    }
  },
  components: {
    SkuForm,
    SpuForm
  },
  methods: {
    // 关闭对话框的回调
    closeDialog(done){
      this.loading = true
      this.skuList = []
      done()
    },
    // 查看sku列表的回调
    async lookupSkuList(row){
      this.dialogTableVisible = true
      this.spu = row
      console.log(this.spu)
      let res = await this.$API.sku.getSkuListBySpuId(row.id)
      console.log(res)
      if(res.code === 200){
        this.skuList = res.data
        this.loading = false
      }
    },
    // 添加sku
    addSku(row) {
      this.scene = 2
      // 父组件 调用子组件的方法  在子组件的方法中发送请求
      this.$refs.skuForm.getData(this.category1Id, this.category2Id, row)

    },
    // 删除spu
    async deleteSpuItem(row) {
      let res = await this.$API.spu.deleteSpu(row.id)
      if (res.code === 200) {
        this.$message('删除成功')
        this.getSpuList()
      }
    },
    // 从 子组件（三级联动菜单） 中获取 各个分类的id
    getCategoryId({ id, level }) {
      if (level === 1) {
        this.category1Id = id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = id
        this.category3Id = ''
      } else {
        this.category3Id = id
        this.getSpuList()
      }
    },
    // 从服务器获取spu数据
    async getSpuList(page1 = 1) {
      this.page = page1
      let { page, limit, category3Id } = this
      let res = await this.$API.spu.getSpuList(page, limit, category3Id)
      console.log('spulist', res)
      if (res.code === 200) {
        this.spuList = res.data.records
        this.total = res.data.total
      }
    },
    // 分页 的回调
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    addSpu() {
      this.scene = 1
      console.log(this.$refs.spu.initAddSpu)
      // this.$refs.spu.
      this.$refs.spu.initAddSpu(this.category3Id)
    },
    updateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)

    },
    // 自定义事件的回调函数 子组件点击取消触发该事件，传参，父组件接受参数执行该回调
    changeScene(scene) {
      this.scene = scene
      this.getSpuList(this.page)
    }


  }

}
</script>

<style></style>