<template>
  <div>
    <h2>
      <span v-if="id=='add'">新建资讯</span>
      <span v-else>编辑资讯</span>
    </h2>
    <br>
    <div class="newInfoHead">
      <el-select v-model="infoTypeValue" placeholder="请选择" @clearable="true" @change="infoTypeChange()">
        <el-option v-for="item in infoType" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="title" class="title" placeholder="请输入标题"></el-input>
    </div>
    <div class="type">
      所属栏目:
      <el-select v-model="typeinfo" placeholder="请选择" @clearable="true" @change="typeInfoChange()">
        <el-option v-for="item in types" :key="item.id" :label="item.theme_name" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="infoCon">
      <div>
        <el-upload class="avatar-uploader" :data="uploadimg" :action="baseUrl+'/op/upload'" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="errupload" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div>封面图上传 <br>建议尺寸360*750 </div>
      </div>

      <div v-if="infoTypeValue">
        <el-upload class="avatar-uploader" :data="uploadvideo" :action="baseUrl+'/op/upload'" :show-file-list="false" accept=".mp4" :on-success="handleVideoSuccess" :before-upload="beforeUploadVideo" :on-error="errupload">
          <video v-if="showVideoPath" :src="showVideoPath" class="avatar video-avatar" controls="controls">您的浏览器不支持视频播放</video>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div>视频上传<br> 大小限制20M</div>
      </div>

    </div>
    <div class="check">
      <span>推送：</span>
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="全部页面" disabled></el-checkbox>
        <el-checkbox label="关注页面" disabled></el-checkbox>
        <el-checkbox label="猜你喜欢" disabled></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="url">
      URL:
      <el-input v-model="url" class="urlInput" placeholder="请输入URL" disabled></el-input>
      <el-checkbox-group v-model="urlList">
        <el-checkbox label="是否外嵌" disabled></el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-if="!urlList.length&&!this.infoTypeValue">
      <div>图文编辑</div>
      <br>
      <!-- <vue-editor v-model="content"></vue-editor> -->
      <div>
        <!-- 图片上传组件辅助-->
        <el-upload class="quill-upload" :action="baseUrl+'/op/upload'" :show-file-list="false" :on-success="quillImgsuccess">
        </el-upload>
        <!--富文本编辑器组件-->
        <quill-editor name="content" :options="editorOption" v-model="content" ref="myQuillEditor" @change="onEditorChange($event)">
        </quill-editor>
      </div>
    </div>
    <div v-if="!urlList.length&&this.infoTypeValue">
      <div>视频介绍</div>
      <br>
      <el-input type="textarea" :autosize="{ minRows: 10}" placeholder="请输入内容" v-model="videoDetail"></el-input>
    </div>
    <div class="btn">
      <el-button type="primary" size="medium" @click="btnover()">提交</el-button>
    </div>
  </div>
</template>
<script>
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ['link', 'image', 'video'],
  ['clean'] // remove formatting button
]
import { VueEditor } from 'vue2-editor'
import { quillEditor } from 'vue-quill-editor'
import { baseUrl } from '../../config/env.js'
import { err } from '../../utils/message.js'
export default {
  components: {
    VueEditor
  },

  data() {
    return {
      infoType: [{ value: 0, label: '图文' }, { value: 1, label: '视频' }],
      infoTypeValue: 0, //资讯分类
      title: '',
      typeinfo: '', //所属分类
      types: [],
      imageUrl: '', //图片链接
      checkList: ['全部页面'],
      urlList: [],
      content: '', //图文
      url: '', //外链
      videoDetail: '', //视频介绍
      showVideoPath: '', //视频链接
      videoFlag: false, //是否显示进度条
      videoUploadPercent: '', //进度条的进度
      isShowUploadVideo: false, //显示上传按钮,
      id: null,
      baseUrl: '',
      uploadimg: { prefix: 'img', file_type: '0' },
      uploadvideo: { prefix: 'video', file_type: '2' },
      // 富文本编辑器配置
      editorOption: {
        placeholder: '',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector('.quill-upload input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    let quill = this.$refs.myQuillEditor.quill
    quill.container.style.minHeight = `${300}px`
    // let length = quill.getSelection().index
    // // 调整光标到最后
    // quill.setSelection(length + 1)
    let id = this.$route.params.id
    this.baseUrl = baseUrl
    this.id = id
    if (id != 'add') {
      this.getInfoDetail(id)
    } else {
      this.getColumnList()
    }
  },
  methods: {
    // 图文视频分类
    infoTypeChange() {
      this.urlList = []
    },
    // 请求栏目列表
    getColumnList() {
      this.$get('/op/information/add').then(res => {
        this.types = res.data.theme_list
        this.typeinfo = res.data.theme_list[0].id
      })
    },
    // 添加编辑资讯
    addEditInfo() {
      let url =
        this.id == 'add'
          ? '/op/information/addData'
          : '/op/information/saveData'
      let data = {
        type: this.infoTypeValue,
        theme_id: this.typeinfo,
        information_img: this.imageUrl,
        information_title: this.title,
        information_url: this.url,
        links_type: this.urlList.length,
        content: this.content,
        information_video: this.infoTypeValue ? this.showVideoPath : '',
        desc: this.videoDetail
      }
      if (this.id != 'add') {
        data.id = this.id
      }
      this.$post(url, data).then(res => {
        this.$router.push({ path: '/infomanage/infoCon' })
      })
    },
    // 查询带编辑资讯
    getInfoDetail(id) {
      this.$get('/op/information/edit', { id: id }).then(res => {
        
        this.types = res.data.theme_list
        this.typeinfo = res.data.info.theme_id
        this.infoTypeValue = res.data.info.type
        this.urlList = res.data.info.links_type ? ['是否外嵌'] : []
        this.title = res.data.info.information_title
        this.imageUrl = res.data.info.information_img
        this.url = res.data.info.information_url
        this.content = res.data.info.content
        this.showVideoPath = res.data.info.information_video
        this.videoDetail = res.data.info.information_desc
      })
    },
    // 分类管理
    typeInfoChange() {},
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
      const isLt2M = file.size / 1024 < 200

      if (!isJPG) {
        err('上传头像图片只能是 JPG/PNG 格式!', this)
      }
      // if (!isLt2M) {
      //   err('上传头像图片大小不能超过 200k!', this)
      // }
      // return isJPG && isLt2M
      return isJPG
    },
    //上传前回调
    beforeUploadVideo(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (['video/mp4'].indexOf(file.type) == -1) {
        //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
        err('请上传正确的视频格式', this)
        return false
      }
      if (!isLt20M) {
        err('上传视频大小不能超过20MB哦!', this)
        return false
      }
      this.isShowUploadVideo = false
    },
    // //进度条
    // uploadVideoProcess(event, file, fileList) {
    //   this.videoFlag = true;
    //   this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    // },
    //上传成功回调
    handleVideoSuccess(res, file) {
      this.isShowUploadVideo = true
      this.videoFlag = false
      this.videoUploadPercent = 0
      this.showVideoPath = res.data.file_url
    },
    btnover() {
      // 
      if (!this.title) {
        err('标题不能为空', this)
        return
      }
      if (!this.imageUrl) {
        err('请上传封面图', this)
        return
      }
      if (!this.showVideoPath && this.infoTypeValue) {
        err('请上传视频', this)
        return
      }
      if (this.urlList.length > 0 && !this.url) {
        err('外链不能为空', this)
        return
      }
      if (!this.content && !this.infoTypeValue && !this.url) {
        err('资讯详情不能为空', this)
        return
      }
      if (!this.videoDetail && this.infoTypeValue && !this.url) {
        err('视频介绍不能为空', this)
        return
      }
      this.addEditInfo()
    },
    // 富文本上传图片
    quillImgsuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      // 获取光标所在位置
      let length = quill.getSelection().index
      // 插入图片  res.info为服务器返回的图片地址
      quill.insertEmbed(length, 'image', res.data.file_url)
      // 调整光标到最后
      quill.setSelection(length + 1)
    },
    onEditorChange(e) {
      // let quill = this.$refs.myQuillEditor.quill
      // this.$refs.myQuillEditor.quill.enable(true)
      // this.$refs.myQuillEditor.quill.focus();
      // 
      // quill.root.innerHTML = this.content
    }
  }
}
</script>
<style scoped>
.newInfoHead {
  display: flex;
  width: 60%;
}
.title {
  margin-left: 50px;
}
.type {
  margin-top: 20px;
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
.infoCon {
  display: flex;
  align-items: center;
}
.infoCon > div {
  display: flex;
  align-items: center;
}
.check {
  display: flex;
  margin-top: 20px;
}
.url {
  display: flex;
  align-items: center;
}
.urlInput {
  width: 300px;
  margin: 20px;
}
.btn {
  display: flex;
  margin-top: 30px;
  justify-content: center;
}

.ql-editor {
  min-height: 400px !important;
}
</style>