<template>
  <div>
    <h2>新建栏目</h2>
    <div class="columnHd">
      <span> 栏目名称</span>
      <el-input class="title" v-model="title" placeholder="请输入内容"></el-input>
    </div>
    <div class="columnHd">
      <span>所属分类</span>
      <el-select v-model="columnType" placeholder="请选择" @change="columnTypeChange()">
        <el-option v-for="item in typeList" :key="item.id" :label="item.cate_name" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="upload">
      <el-upload name="file" :data="uploadDAta" class="avatar-uploader" :action="baseUrl+'/op/upload'" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="errupload" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div>封面图上传 <br> 建议尺寸122*122 </div>
    </div>

    <div class="columnHd">
      <h4>关联群ID:</h4>
      <span></span>
      <el-input class="title" placeholder="请输入群ID" v-model="pelpleID"></el-input>
      <el-button @click="addPelples()" type="text" size="small">添加</el-button>
      <el-tag class="peleplID" @close="handleClose(item)" closable v-for="(item,index) in pelpleidList" :key="index">{{item}}</el-tag>
    </div>
    <br>
    <div>
      <h4>栏目简介</h4>
      <br>
      <el-input type="textarea" :autosize="{ minRows: 10}" placeholder="请输入内容" v-model="columnCon"></el-input>
    </div>
    <div class="btn">
      <el-button type="primary" size="medium" @click="btnover">提交</el-button>
    </div>
  </div>
</template>
<script>
import { toast, err } from '../../utils/message.js'
import { baseUrl } from '../../config/env.js'
export default {
  data() {
    return {
      title: '',
      columnType: '',
      typeList: [],
      imageUrl: '',
      columnCon: '',
      pelpleidList: [],
      pelpleID: '',
      baseUrl: '',
      //   上传额外参数
      uploadDAta: { prefix: 'avatar', file_type: '0' },
      id: ''
    }
  },
  mounted() {
    let id = this.$route.params.id
    this.id = id
    if (id != 'add') {
      // 请求编辑的信息
      this.getColumnEdit(id)
    } else {
      // 请求分类列表
      this.getColumnList()
    }
    this.baseUrl = baseUrl
  },
  methods: {
    columnTypeChange() {},
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data.file_url
    },
    // 上传失败
    errupload() {
      err('上传失败', this)
    },
    // 查询上传图片数据
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || "'image/png'"
      const isLt2M = file.size / 1024 < 50

      if (!isJPG) {
        err('上传头像图片只能是 JPG/PNG 格式!', this)
      }
      // if (!isLt2M) {
      //   err('上传头像图片大小不能超过 50k!', this)
      // }
      // return isJPG && isLt2M
      return isJPG
    },
    // 添加群聊限制人数
    addPelples() {
      if (!this.pelpleID) {
        return
      }
      if (this.pelpleidList.length >= 2) {
        err('最多关联2个', this)
        return
      }
      this.pelpleidList.push(this.pelpleID)
      this.pelpleID = ''
    },
    // 移出群ID
    handleClose(tag) {
      this.pelpleidList.splice(this.pelpleidList.indexOf(tag), 1)
    },
    btnover() {
      if (!this.title) {
        err('请输入标题', this)
        return
      }
      if (!this.imageUrl) {
        err('请上传图片', this)
        return
      }
      // if (!this.pelpleidList.length) {
      //   err('请关联ID', this)
      //   return
      // }
      if (!this.columnCon) {
        err('请输入简介', this)
        return
      }
      //   执行添加和编辑接口
      this.addEditColumn()
    },
    // 请求待编辑信息
    getColumnEdit(id) {
      this.$get('/op/informationTheme/edit', { id }).then(res => {
        this.imageUrl = res.data.info.theme_img
        this.title = res.data.info.theme_name
        this.columnCon = res.data.info.theme_desc
        this.pelpleidList = res.data.info.group_ids.split(',')
        this.typeList = res.data.cate_list
        this.columnType = res.data.info.cate_id
      })
    },
    // 添加或编辑信息
    addEditColumn() {
      let data = {
        cate_id: this.columnType,
        theme_name: this.title,
        theme_img: this.imageUrl,
        group_ids: this.pelpleidList.join(','),
        desc: this.columnCon
      }
      let url = '/op/informationTheme/addData'
      if (this.id != 'add') {
        data.id = this.id
        url = '/op/informationTheme/saveData'
      }
      this.$post(url, data).then(() => {
        this.$router.push({ path: '/infomanage/infoColumn' })
      })
    },
    // 请求分类列表
    getColumnList() {
      this.$get('/op/informationTheme/add').then(res => {
        
        this.typeList = res.data.cate_info
        this.columnType = res.data.cate_info[0].id
      })
    }
  }
}
</script>
<style scoped>
.columnHd {
  display: flex;
  margin-top: 20px;
  align-items: center;
}
.title {
  width: 300px;
}
.columnHd span {
  display: block;
  margin-right: 15px;
}
.avatar-uploader {
  margin-top: 20px;
  display: inline-block;
  margin-right: 20px;
}
.video-uploader {
  margin-left: 30px;
}
.avatar-uploader .el-icon-plus {
  border: 1px dashed black !important;
  margin-top: 20rpx;
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
  width: 122px;
  height: 122px;
  line-height: 122px;
  text-align: center;
}
.avatar {
  width: 122px;
  height: 122px;
  display: block;
}
.upload {
  display: flex;
  align-items: center;
}
.btn {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.peleplID {
  margin-left: 20px;
}
</style>
