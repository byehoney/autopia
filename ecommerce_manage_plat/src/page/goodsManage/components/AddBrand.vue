<template>
    <div>
        <el-dialog
            class="virForm"
            :title="title"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-row class="flex mb2">
                <el-input style="width:300px;"  v-model="brandName" placeholder="请输入品牌名称"></el-input>
            </el-row>
            <el-row class="flex ruleForm">
                <!-- <img v-if="logoPic" class="logo"  :src="logoPic" alt=""> -->
                <el-row class="vFlex">
                    <el-upload
                        class="avatar-uploader"
                        :before-upload="beforeAvatarUpload"
                        :action="baseUrl+'/admin/upload/img'"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-row class="mt2">格式：png、jpg；尺寸：M*N；200K以内</el-row>
                </el-row>
            </el-row>
            <el-row class="flex mt2">
                <el-button type="primary" @click="doSave">{{title=='新增品牌'?'新增品牌':'保存'}}</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import { baseUrl } from '../../../config/env'
import { opBrand } from '../../../api/getData'
export default {
    data(){
        return{
            dialogVisible:false,
            title:'新增品牌',
            brandName:"",
            logoPic:'',//已存在品牌logo
            baseUrl:'',
            imageUrl:'',//上传logo
            options:[],//下拉展示品牌
            loading:false,
            curBrandId:''
        }
    },
    props:['source'],
    mounted() {
        this.baseUrl = baseUrl;
        
    },
    methods:{
        async opSave(){
            let data = {};
            if(this.curBrandId){
                data ={
                    image_url:this.logoPic,
                    brand_name:this.brandName,
                    id:this.curBrandId
                }
            }else{
                data ={
                    image_url:this.logoPic,
                    brand_name:this.brandName,
                }
            }
            let res = await opBrand(data);
            if(res.code == 0){
                this.$message({
                    showClose: true,
                    message: '创建成功',
                    type: 'success'
                });
                this.$parent.getData();
                this.dialogVisible = false;
            }else{
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error'
                });
            }
        },
        doSave(){
            if(!this.brandName){
                this.$message({
                    showClose: true,
                    message: '请输入品牌名称',
                    type: 'warning'
                });
                return;
            }else if(!this.logoPic){
                this.$message({
                    showClose: true,
                    message: '请上传品牌图片',
                    type: 'warning'
                });
                return;
            }else{
                this.opSave();
            }
        },
        showBrandPop(row){
            this.dialogVisible = true;
            
            if(row){
                this.title = '编辑品牌';
                this.curBrandId = row.id;
                this.logoPic = row.image_url;
                this.brandName = row.brand_name; 
                this.imageUrl = row.image_url_full;
            }else{
                this.title = '新增品牌';
                this.curBrandId = '';
                this.logoPic = '';
                this.brandName = ''; 
                this.imageUrl = '';
            }
        },
        handleClose(){
            this.dialogVisible = false;
            this.brandName = '';
            this.logoPic = '';
            this.imageUrl = '';
        },
        beforeAvatarUpload(file){
            
            const isPic =  file.type === 'image/png' || file.type === 'image/jpg'|| file.type === 'image/jpeg';
            const isLt = file.size / 1024 / 1024 < 0.2;
            
            if (!isPic) {
                this.$message.error('上传图片格式有误!');
                return false;
            }
            if (!isLt) {
                this.$message.error('上传图片大小不能超过 200k!');
                return false
            }
            return true;
        },
        handleAvatarSuccess(res, file) {
            
            this.imageUrl = URL.createObjectURL(file.raw);
            this.logoPic = res.data.url;
            this.imgId = res.data.id;
        },
    }
}
</script>
<style lang="scss" scoped>
    .vFlex{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .flex{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .mb2{
        margin-bottom: 20px;
    }
    .mt2{
        margin-top: 20px;
    }
    .logo{
        width: 100px;
        height: 100px;
    }
    .virForm  .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9!important;
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