<template>
    <el-dialog 
        v-loading="loading"
        title="编辑"
        center 
        :visible.sync="dialogFormVisible"  
        v-if='dialogFormVisible'
        :close-on-click-modal="false" class="virForm" width="30%">
        <el-row class="mb2">
            <el-col :span="4">分类图：</el-col>
            <el-col :span="12">
                <el-upload
                    class="avatar-uploader"
                    :before-upload="beforeAvatarUpload"
                    :action="baseUrl+'/op/upload'"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="4">链接分类：</el-col>
            <el-col :span="12">
                <el-select v-model="classId" placeholder="请选择">
                    <el-option
                    v-for="item in typeIconList"
                    :key="item.id"
                    :label="item.cate_name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="4"> 排 序：</el-col>
            <el-col :span="12">
               <el-input v-model="order" placeholder="请输入序号"></el-input>
            </el-col>
        </el-row>
        <el-row class="btnArea">
            <el-button @click="handleConfirm" type="primary">保存</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
import { baseUrl } from '../config/env.js'
import { upDateClassIcon } from '../api/getData.js';
export default {
  name: "bannerForm",
  data(){
    return{
        baseUrl:'',//上传图片路径
        loading:false,
        dialogFormVisible:false,//表单弹框是否显示
        imageUrl:'',
        atvUrl:'',
        options: [],
        classId: '',//分类id
        order:'',//排序
        curId:'',
    }
  },
  props:['typeIconList'],
  mounted() {
    this.baseUrl = baseUrl;
  },
  methods: {
    showDialogForm(row){
      this.dialogFormVisible = true;
      if(row){
        this.classId = row.cate_id;
        this.imageUrl = row.cate_img_url;
        this.atvUrl = row.cate_img;
        this.order = row.sort;
        this.curId = row.id;
      }else{
        this.imageUrl = '';
        this.atvUrl = '';
        this.classId = '';
        this.order = '';
        this.curId = '';
      }
    },
    beforeAvatarUpload(file){
        const isPic = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/swf' || file.type === 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isPic) {
          this.$message.error('上传图片格式有误!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isPic && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.atvUrl = file.response.data.file_complete_url;
    },
    async handleConfirm(){
      if(!this.imageUrl){
        this.$message({
          showClose: true,
          message: '请上传分类图片',
          type: 'warning'
        });
        return;
      }else if(!this.classId){
        this.$message({
          showClose: true,
          message: '请选择关联分类',
          type: 'warning'
        });
        return;
      }else if(!this.order){
        this.$message({
          showClose: true,
          message: '请输入分类排序',
          type: 'warning'
        });
        return;
      }else{
        let res = await upDateClassIcon({
          pic_url:this.atvUrl,
          cate_id:this.classId,
          id:this.curId,
          sort:this.order
        })
        if(res.code == 0){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.$parent.getData();
        }else{
          this.$message.error(res.message);
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

   .virForm  .mood_icon{
       width: 50px;
       height: 50px;
       border-radius:50%; 
   }
  .virForm  .el-button.active{
      background-color: #E6A23C;
      color: #fff;
  }
  .virForm  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9!important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .virForm  .btnArea{
      display: flex;
      justify-content: center;
  }
  .virForm   .mb{
      margin-bottom: 10px;
  }
  .virForm   .mb2{
      margin-bottom: 20px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 145px;
    height: 145px;
    line-height: 145px;
    text-align: center;
  }
  .avatar {
    width: 145px;
    height: 145px;
    display: block;
  }
</style>