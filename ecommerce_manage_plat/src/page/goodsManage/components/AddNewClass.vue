<template>
    <div>
        <el-dialog
            class="virForm"
            :title="title"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-row class="flex mb2">
                <el-input style="width:300px;" v-model="brandName" :placeholder="isMain?'请输入一级分类名称':'请输入二级分类名称'"></el-input>
            </el-row>
            <el-row class="flex ruleForm">
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
                <el-button type="primary" @click="doSave">{{isEdit?'保存':'新增'}}</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import { baseUrl } from '../../../config/env'
import { opClass } from '../../../api/getData'
export default {
    data(){
        return{
            isEdit:false,//是否编辑
            isMain:false,//是否操作一级分类
            dialogVisible:false,
            title:'新增一级分类',
            brandName:"",
            logoPic:'',//已存在品牌logo
            baseUrl:'',
            imageUrl:'',//上传logo
            fid:'',//父类id
            id:'',//当前操作id
        }
    },
    mounted() {
        this.baseUrl = baseUrl;
    },
    methods:{
        async doSave(){
            if(!this.brandName){
                this.$message({
                    showClose: true,
                    message: '请输入分类名称',
                    type: 'warning'
                });
                return;
            }else if(!this.logoPic){
                this.$message({
                    showClose: true,
                    message: '请上传分类图片',
                    type: 'warning'
                });
                return;
            }
            let data = {};
            if(!this.isEdit&&this.isMain){//新增一级分类
                data = {
                    cate_name:this.brandName,
                    image_url:this.logoPic,
                    fid:this.fid,
                }
            }else if(!this.isEdit&&!this.isMain){//新增二级分类
                data = {
                    cate_name:this.brandName,
                    image_url:this.logoPic,
                    fid:this.id,
                }
            }else if(this.isEdit) {
                data = {
                    cate_name:this.brandName,
                    image_url:this.logoPic,
                    fid:this.fid,
                    id:this.id
                }
            }
            let res = await opClass(data);
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
        showClassPop(type,row){
            this.dialogVisible = true;
            this.brandName = '';
            this.logoPic = '';
            this.imageUrl = '';
            if(type==0){
                this.title = '新增一级分类';
                this.isMain = true;
                this.isEdit = false;
                this.fid = 0;
                this.id = '';
            }else if(type==1){
                this.title = '新增二级分类';
                this.isMain = false;
                this.isEdit = false;
                this.fid = row.fid;
                this.id = row.id;
            }else if(type==2){
                this.title = '编辑分类';
                this.brandName = row.cate_name;
                this.logoPic = row.image_url;
                this.imageUrl = row.image_url_full;
                if(row.fid==0){
                    this.isMain = true;
                }else{
                    this.isMain = false;
                }
                this.fid = row.fid;
                this.id = row.id;
                this.isEdit = true;
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
                this.$message.error('上传图片大小不能超过 300k!');
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