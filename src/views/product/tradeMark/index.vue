<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" style="margin: 10px 0px" @click="showDialog">添加</el-button>
    <!-- 表格 -->
    <el-table :data="list" :border="true" style="width: 100%">
      <el-table-column prop="" label="序号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="" label="品牌logo" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination style="margin-top: 20px; textAlign:center" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="1" :page-sizes="[5, 10, 15]" :page-size="5"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog :title="tradeMarkForm.id? '修改品牌':'添加品牌' " :visible.sync="dialogFormVisible">
      <el-form style="width: 80%;" :rules="rules"  :model="tradeMarkForm" ref="ruleform">
        <el-form-item label="品牌名称" :label-width="100 + 'px'" prop="tmName">
          <el-input autocomplete="off" v-model="tradeMarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" :label-width="100 + 'px'" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
            <img v-if="tradeMarkForm.logoUrl" :src="tradeMarkForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      list: [],
      dialogFormVisible: false,
      //收集品牌的信息
      tradeMarkForm:{
        tmName: '',
        logoUrl: ''
      },
      //表单验证规则
      rules: {
        tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
          ],
        logoUrl: [
            { required: true, message: '请选择logo',  }
          ],
      }
    }
  },

  methods: {
    handleSizeChange(limit) {
      this.limit = limit
      this.getData()
    },
    handleCurrentChange(page) {
      this.page = page
      this.getData()
    },
    // 从服务器获取数据
    async getData() {
      let res = await this.$API.tradeMark.getTradeMarkList(this.page, this.limit)
      console.log(res)
      if (res.code === 200) {
        console.log('200', res.total, res.records)
        this.total = res.data.total
        this.list = res.data.records
      } else {
        alert('获取品牌信息失败')
      }
    },
    // 添加 数据
    showDialog() {
      this.dialogFormVisible = true
      // 添加数据前清空 表单
      this.tradeMarkForm = {tmName:'',logoUrl:''}
    },
    // 修改 编辑数据
    updateTradeMark(row) {
      this.dialogFormVisible = true
      this.tradeMarkForm = {...row}
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
        // 从服务器
        this.tradeMarkForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    // 确认 添加 或 修改
     addOrUpdate(){
      this.$refs.ruleform.validate(async (valid) => {
          if (valid) {
            this.dialogFormVisible = false
            let res = await this.$API.tradeMark.addOrUpdateTradeMark(this.tradeMarkForm)
            console.log('confirm',res)
            if(res.code === 200){
              this.$message(this.tradeMarkForm.id? '修改成功':'添加成功')
              this.getData()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
    // 删除品牌
    deleteTradeMark(row){
      // 确认删除弹框
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          let res = await this.$API.tradeMark.deleteTradeMark(row.id)
          if(res.code === 200){
            // 弹出 删除成功 框
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            // 获取列表数据
            this.getData()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
    

  },

  mounted() {
    this.getData()
  }

}
</script>

<style>

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>