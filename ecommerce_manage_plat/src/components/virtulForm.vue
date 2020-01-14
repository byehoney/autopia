<template>
    <el-dialog 
        v-loading="loading"
        :title="title+'虚拟用户'"
        center 
        :visible.sync="dialogFormVisible"  
        v-if='dialogFormVisible'
        :close-on-click-modal="false" class="virForm" width="30%">
        <el-row class="mb2">
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
            <el-col :span="12">
                <el-row class="mb">
                    <el-input v-model="userName" placeholder="用户昵称"></el-input>
                </el-row>
                <el-row class="mb">
                    <el-button @click="selSex(index)" size="small" :class="[sexIndex==index?'active':'']" type="warning" plain v-for="(item,index) in sexList" :key="index">{{item}}</el-button>
                </el-row>
                <el-row class="mb">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="心情签名"
                        v-model="sign">
                    </el-input>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-radio-group v-model="mood">
                <el-col :span="24">
                    <el-radio :label="item.u_mood_icon" v-for="(item,index) in moodIcons" :key="index">
                        <img class="mood_icon" :src="item.file_url" alt="">
                    </el-radio>
                </el-col>
            </el-radio-group>
        </el-row>
        <el-row class="mb2">
            <el-col>
                <el-input v-model="info" placeholder="认证信息"></el-input>
            </el-col>
        </el-row>
        <el-row class="btnArea">
            <el-button @click="handleConfirm" type="primary">{{title=='添加'?'添 加':'保 存'}}</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
import { baseUrl } from '../config/env.js'
import { saveVirtulUser ,addVirtulUser,getMoodIcons,getVirtulDetail} from '../api/getData.js';
export default {
  name: "publishForm",
  data(){
    return{
        baseUrl:'',//上传图片路径
        isAdd:true,//是否新增
        loading:false,
        dialogFormVisible:false,//表单弹框是否显示
        title:'添加',
        imageUrl: '',
        sexList:['男','女','保密'],
        userName:'',
        sexIndex:0,//性别索引
        sign:'',//心情签名
        info:'',//认证信息
        userInfo:'',
        imgId:'',//头像id
        moodIcons:[],//心情icon
        mood:'',//心情icon
    }
  },
  mounted() {
    this.baseUrl = baseUrl;
  },
  methods: {
    showDialogForm(index,row){
        this.resetDialog();
        this.getMoodIconData();
        if(row){
            this.getVirtulDetailData(row.id);
        }else{
            this.title = '添加';
            this.isAdd = true;
        }
        this.dialogFormVisible = true;
    },
    async getMoodIconData(){
        let res = await getMoodIcons();
        this.moodIcons = res.data;
    },
    async getVirtulDetailData(id){
        let res = await getVirtulDetail({id:id});
        let row = res.data;
        this.title = '编辑'
        this.imageUrl = row.u_icon_url;
        this.userName = row.nickname;
        if(row.u_sex==1){
            this.sexIndex = 0;
        }else if(row.u_sex==2){
            this.sexIndex = 1;
        }else{
            this.sexIndex = 2;
        }
        this.sign = row.u_sign;
        this.info = row.u_auth_title;
        this.imgId = row.u_icon;
        this.mood = row.u_mood_icon;
        this.userInfo = row;
        this.isAdd = false;
    },
    resetDialog(){
        this.imageUrl = '';
        this.userName = '';
        this.sexIndex = 0;
        this.sign = '';
        this.info = '';
        this.imgId = '';
        this.userInfo = "";
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
    selSex(index){
        this.sexIndex = index;
    },
    async saveEdit(){
        this.loading = true;
        let u_sex = '';
        if(this.sexIndex==0){
            u_sex = 1;
        }else if(this.sexIndex == 1){
            u_sex = 2;
        }else{
            u_sex = -1;
        }
        let res = await saveVirtulUser({
            id:this.userInfo.id,
            u_icon:this.imgId,
            u_sex:u_sex,
            u_sign:this.sign,
            u_auth:this.info?'1':'0',
            u_auth_title:this.info,
            u_mood_icon:this.mood,
            nickname:this.userName
        });
        this.loading = false;
        if(res.code==0){
            this.$message({
                message: '保存成功',
                type: 'success'
            });
            this.dialogFormVisible = false;
            this.$parent.getData();
        }else{
            this.$message.error(res.message);
        }
    },
    async addUser(){
        this.loading = true;
        let u_sex = '';
        if(this.sexIndex==0){
            u_sex = 1;
        }else if(this.sexIndex == 1){
            u_sex = 2;
        }else{
            u_sex = -1;
        }
        let res = await addVirtulUser({
            u_icon:this.imgId,
            u_sex:u_sex,
            u_sign:this.sign,
            u_auth:this.info?'1':'0',
            u_auth_title:this.info,
            u_mood_icon:this.userInfo.u_mood_icon,
            nickname:this.userName,
            u_mood_icon:this.mood
        })
        this.loading = false;
        if(res.code==0){
            this.$message({
                message: '添加成功',
                type: 'success'
            });
            this.dialogFormVisible = false;
            this.$parent.getData();
        }else{
            this.$message.error(res.message);
        }
    },
    handleConfirm(){
        if(!this.imageUrl){
            this.$message({
                message: '请上传用户头像',
                type: 'warning'
            });
            return;
        }else if(!this.userName){
            this.$message({
                message: '请输入用户名',
                type: 'warning'
            });
            return;
        }else if(!this.userName){
            this.$message({
                message: '请输入用户名',
                type: 'warning'
            });
            return;
        }else if(!this.mood){
            this.$message({
                message: '请选择心情状态',
                type: 'warning'
            });
            return;
        }else if(!this.sign){
            this.$message({
                message: '请输入心情签名',
                type: 'warning'
            });
            return;
        }else{
            if(this.isAdd){
                this.addUser();
            }else{
                this.saveEdit();
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