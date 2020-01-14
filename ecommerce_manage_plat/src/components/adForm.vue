<template>
    <el-dialog 
        v-loading="loading"
        title="编辑"
        center 
        :visible.sync="dialogFormVisible"  
        v-if='dialogFormVisible'
        :close-on-click-modal="false" class="virForm" width="30%">
        <el-row class="mb2">
            <el-col :span="4">广告图：</el-col>
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
            <el-col :span="4">链接商品：</el-col>
            <el-col :span="12">
                <el-select v-model="goodsId" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="4">跳转类型：</el-col>
            <el-col :span="12">
               <el-radio-group v-model="jumpType">
                    <el-radio :label="3">默认商品链接</el-radio>
                    <el-radio :label="6">其他广告链接</el-radio>
                </el-radio-group>
            </el-col>
        </el-row>
        <el-row class="btnArea">
            <el-button @click="handleConfirm" type="primary">保存</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
import { baseUrl } from '../config/env.js'
import { saveVirtulUser ,addVirtulUser,getMoodIcons,getVirtulDetail} from '../api/getData.js';
export default {
  name: "bannerForm",
  data(){
    return{
        baseUrl:'',//上传图片路径
        loading:false,
        dialogFormVisible:false,//表单弹框是否显示
        imageUrl:'',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        goodsId: '',//商品id
        jumpType:'',//跳转类型

    }
  },
  mounted() {
    this.baseUrl = baseUrl;
  },
  methods: {
    showDialogForm(index,row){
        this.dialogFormVisible = true;
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
        this.imgId = res.data.id;
    },
    handleConfirm(){
      if(!this.imageUrl){
        this.$message({
          showClose: true,
          message: '请上传banner图片',
          type: 'warning'
        });
        return;
      }else if(!this.goodsId){
        this.$message({
          showClose: true,
          message: '请选择关联商品',
          type: 'warning'
        });
        return;
      }else if(!this.jumpType){
        this.$message({
          showClose: true,
          message: '请选择跳转类型',
          type: 'warning'
        });
        return;
      }else{
        
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