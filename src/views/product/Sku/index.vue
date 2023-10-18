<template>
  <div>

    <!-- 表格 -->
    <el-table :data="skuList" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" style="height: 100px; width: 100px;">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.isSale == 0" @click="handleOnSale(row)" type="success" icon="el-icon-sort-down"
            size="mini"></el-button>
          <el-button v-else type="success" @click="handleCancleSale(row)" icon="el-icon-sort-up" size="mini"></el-button>
          <el-button @click="editSku" type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button @click="getSkuDetail(row)" type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination style="margin-top: 20px; textAlign:center" @size-change="handleSizeChange" @current-change="getSkuData"
      :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total">
    </el-pagination>

    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuDetail.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuDetail.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuDetail.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="(attr, index) in skuDetail.skuAttrValueList" :key="attr.id"
              style="margin-right: 10px;">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="image in skuDetail.skuImageList" :key="image.id">
              <img :src="image.imgUrl" style="height:100px;width:100px">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>

  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      limit: 3,
      skuList: [],
      total: '',
      skuDetail: {},
      // 抽屉的显示与隐藏
      drawer: false,
    }
  },
  mounted() {
    this.getSkuData()
  },
  methods: {
    // 查看sku详情按钮的回调
    async getSkuDetail(row) {
      this.drawer = true
      let res = await this.$API.sku.getSkuDetailById(row.id)
      console.log('detail', res)
      if (res.code === 200) {
        this.skuDetail = res.data
      }
    },
    // 上架产品的回调
    async handleOnSale(row) {
      let res = await this.$API.sku.skuOnSale(row.id)
      if (res.code === 200) {
        row.isSale = 1
        this.$message('上架产品成功')
      }
    },
    // 下架产品的回调
    async handleCancleSale(row) {
      let res = await this.$API.sku.skuCancelSale(row.id)
      if (res.code === 200) {
        row.isSale = 0
        this.$message('下架产品成功')
      }
    },
    // 编辑sku的回调
    editSku() {
      this.$message('正在开发中')
    },
    // 改变页容量的回调
    handleSizeChange(size) {
      this.limit = size
      this.getSkuData()
    },
    // 向服务器发送请求获取分页数据
    async getSkuData(page1 = 1) {
      this.page = page1
      let { page, limit } = this
      let res = await this.$API.sku.getSkuData(page, limit)
      console.log(res)
      if (res.code === 200) {
        this.skuList = res.data.records
        this.total = res.data.total
      }
    }
  },

}
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px 10px;
}
</style>


<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

  .el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }
</style>