<template>
  <div class="app-container">
    <!-- 照片上传 -->
    <el-row>
      <el-col :span="12">
        <el-upload
          class="avatar-uploader"
          action="upp"
          :show-file-list="false"
          :http-request="UploadImage"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form ref="form" label-width="80px">
          <el-form-item label="产品名称">
            <el-input v-model="goods.title" />
          </el-form-item>
          <el-form-item label="产品描述">
            <el-input v-model="goods.desc" />
          </el-form-item>
          <el-form-item label="产品价格">
            <el-input v-model="goods.price" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button type="danger" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'CreateMovie',
  data() {
    return {
      goods: {
        title: null,
        desc: null,
        price: null,
      },
      imageUrl: '', // 图片地址
      list: null
    }
  },
  created() {
    
  },
  methods: {
    UploadImage(param) {
      // console.log(3)
      // console.log(param) // file
      const uploadData = new FormData()
      uploadData.append('avatar', param.file) // 上传图片的接口传上去后让后台返回一个地址
      axios.post('/upload', uploadData).then((res) => {
        this.imageUrl = res.data.path
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },

    beforeAvatarUpload(file) {
      console.log(1)
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 提交表单信息
    onSubmit() {
      var title = this.goods.title
      var desc = this.goods.desc
      var price = this.goods.price
      var img = this.imageUrl
      axios
        .post('/addgoods', {
          title,
          desc,
          price,
          img
        })
        .then((res) => {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.cancel()
        })
    },
    //
    cancel() {
      this.goods.title = ''
      this.goods.desc = ''
      this.goods.price = ''
      this.imageUrl = null
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
