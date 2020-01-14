<template>
    <el-dialog 
        v-loading="loading"
        :title="title"
        center 
        :visible.sync="dialogFormVisible"  
        v-if='dialogFormVisible'
        :close-on-click-modal="false" class="virForm" width="30%">
        <el-row class="mb2">
            <el-col :span="4">封面图：</el-col>
            <el-col :span="12">
                <el-upload
                    class="avatar-uploader"
                    :before-upload="beforeAvatarUpload"
                    :action="baseUrl+'/shop/upload/img'"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="4">跳转链接：</el-col>
            <el-col :span="12">
                <el-input v-model="jumpUrl" placeholder="请输入跳转链接"></el-input>
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="4"> 排 序：</el-col>
            <el-col :span="12">
               <el-input v-model="order" placeholder="请输入序号"></el-input>
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="4">跳转类型：</el-col>
            <el-col :span="12">
               <el-radio-group v-model="jumpType">
                    <el-radio :label="1">H5链接</el-radio>
                </el-radio-group>
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="4"> 状 态：</el-col>
            <el-col :span="12">
               <el-radio-group v-model="state">
                    <el-radio :label="0">禁用</el-radio>
                    <el-radio :label="1">启用</el-radio>
                </el-radio-group>
            </el-col>
        </el-row>
        <el-row class="btnArea">
            <el-button @click="handleConfirm" type="primary">提交</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
import { baseUrl } from '../config/env.js'
import { upDateBanner} from '../api/getData.js';
export default {
  name: "bannerForm",
  data(){
    return{
        baseUrl:'',//上传图片路径
        title:'',
        loading:false,
        dialogFormVisible:false,//表单弹框是否显示
        imageUrl:'',
        imgUpUrl:'',
        options: [],
        order:'',//排序
        jumpType:1,//跳转类型
        jumpUrl:'',
        state:'',//状态
    }
  },
  mounted() {
    this.baseUrl = baseUrl;
  },
  methods: {
    // async getGoodsList(){
    //   let res = await goodsList({
    //     page_size:10000,
    //     page:1,
    //   })
    //   if(res.code == 0){
    //     this.options = res.data.data;
    //   }
    // },
    showDialogForm(row){
      this.dialogFormVisible = true;
      if(row){
        this.title = '编辑';
        this.imgUpUrl = row.pic_url;
        this.imageUrl = row.pic_full_url;
        this.jumpUrl = row.jump_url;
        this.jumpType = row.jump_type;
        this.state = row.status;
        this.order = row.sort;
        this.curBannerId = row.id;
      }else{
        this.title = '添加';
        this.imgUpUrl = '';
        this.imageUrl = '';
        this.jumpUrl = '';
        this.jumpType = 1;
        this.state = '';
        this.order = '';
        this.curBannerId = '';
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
      this.imgUpUrl = res.url+'';
      this.imgId = res.id;
    },
    async handleConfirm(){
      if(!this.imageUrl){
        this.$message({
          showClose: true,
          message: '请上传banner图片',
          type: 'warning'
        });
        return;
      }else if(!this.jumpUrl){
        this.$message({
          showClose: true,
          message: '请输入跳转链接',
          type: 'warning'
        });
        return;
      }else if(!this.order){
        this.$message({
          showClose: true,
          message: '请输入banner排序位置',
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
      }else if(this.state === ''){
        this.$message({
          showClose: true,
          message: '请选择banner状态',
          type: 'warning'
        });
        return;
      }else{
        let res = await upDateBanner({
          id:this.curBannerId,
          pic_url:this.imgUpUrl,
          jump_url:this.jumpUrl,
          jump_type:this.jumpType,
          status:this.state,
          sort:this.order
        })
        if(res.code ==0 ){
          this.$message({
              message: '操作成功',
              type: 'success'
          });
          this.dialogFormVisible = false;
          this.$parent.getData();
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