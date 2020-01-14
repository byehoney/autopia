<template>
    <div>
        <el-dialog
            class="virForm"
            :title="isEdit?'编辑':'新增'"
            center
            :visible.sync="dialogVisible"
            width="40%"
            >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="跳转类型：" prop="type">
                    <el-radio-group v-model="ruleForm.type" :disabled="isEdit">
                        <el-radio label="0">H5页</el-radio>
                        <el-radio label="1">商品分类</el-radio>
                        <el-radio label="2">商品详情</el-radio>
                        <!-- <el-radio label="3">营销页面</el-radio> -->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称：" prop="title">
                    <el-input style="width:250px" v-model="ruleForm.title" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="ICON图：" prop="imgStr" ref="imgUp">
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
                    <el-row class="mt2">图片尺寸94*94像素</el-row>
                </el-form-item>
                <el-form-item label="链接地址：" prop="site" v-if="ruleForm.type==0">
                    <el-input style="width:250px" v-model="ruleForm.site" placeholder="链接地址"></el-input>
                </el-form-item>
                <el-form-item label="商品编号：" prop="goods_code" v-if="ruleForm.type==2">
                    <el-input style="width:250px" v-model="ruleForm.goods_code" placeholder="商品编号"></el-input>
                </el-form-item>
                <el-form-item label="一级分类：" prop="mainClass" v-if="ruleForm.type==1">
                    <el-select v-model="ruleForm.mainClass" placeholder="一级分类" @change="reqSonClass">
                         <el-option :label="item.cate_name" :value="item.id" v-for="(item,index) in mainOptions" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类：" prop="sonClass" v-if="ruleForm.type==1">
                    <el-select v-model="ruleForm.sonClass" placeholder="二级分类">
                        <el-option :label="item.cate_name" :value="item.id" v-for="(item,index) in sonOptions" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="营销活动：" prop="activity" v-if="ruleForm.type==3">
                    <el-select v-model="ruleForm.activity" placeholder="营销活动">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序：" prop="order">
                    <el-input style="width:250px" v-model="ruleForm.order" placeholder="请输入排序"></el-input>
                    <el-row class="mt2">请输入整数，数字越大icon位置越靠前</el-row>
                </el-form-item>
            </el-form>   
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doSave">{{isEdit?'保 存':'确 定'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { baseUrl } from '../../../config/env'
import { opIcon,mainClassList,sonClassList,iconDetail } from '../../../api/getData'
export default {
    data(){
        var validateImgId = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请上传图片'));
            } else {
                callback();
            }  
        };
        return{
            isEdit:false,
            dialogVisible:false,
            baseUrl:'',
            imageUrl:'',
            mainOptions:[],//一级分类
            sonOptions:[],//二级分类
            curId:'',
            rules:{
                type:[
                    { required:true }
                ],
                title:[
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                imgStr:[
                    { required: true, validator: validateImgId, trigger: 'blur' }
                ],
                site:[
                    { required: true, message: '链接地址', trigger: 'blur' },
                ],
                goods_code:[
                    { required: true, message: '商品编号', trigger: 'blur' },
                ],
                mainClass:[
                    { required: true, message: '选择一级分类', trigger: 'blur' },
                ],
                sonClass:[
                    { required: true, message: '选择二级分类', trigger: 'blur' },
                ],
                activity:[
                    { required: true, message: '选择营销活动', trigger: 'blur' },
                ],
                order:[
                    { required: true, message: '请输入排序', trigger: 'blur' },
                ],
            },
            ruleForm:{
                title:'',
                type:'0',
                imgStr:'',
                site:'',
                goods_code:'',
                mainClass:'',
                sonClass:'',
                activity:'',
                order:'',
            }
        }
    },
    mounted() {
        this.baseUrl = baseUrl;
        this.reqMainClass();
    },
    methods:{
        async getDetail(id){
            let res = await iconDetail({id});
            if(res.code == 0){
                this.curId = res.data.id;
                this.ruleForm.type = res.data.type+'';
                this.ruleForm.title = res.data.title;
                this.ruleForm.order = res.data.sort;
                this.imageUrl = res.data.image_url_full;
                this.ruleForm.imgStr = res.data.image_url;
                if(this.ruleForm.type==0){
                    this.ruleForm.site = res.data.type_value;
                }else if(this.ruleForm.type==1){
                    this.ruleForm.mainClass = res.data.cate_one;
                    this.reqSonClass();
                    this.ruleForm.sonClass = res.data.type_value;
                }else if(this.ruleForm.type==2){
                   this.ruleForm.goods_code = res.data.type_value;
                }else if(this.ruleForm.type==3){
                    this.ruleForm.activity = res.data.type_value;
                }
            }else{
                this.$message.error(res.message);
            }
        },
        doReset(){
            this.curId = '';
            this.imageUrl = '';
            this.ruleForm = {
                title:'',
                type:'0',
                imgStr:'',
                site:'',
                goods_code:'',
                mainClass:'',
                sonClass:'',
                activity:'',
                order:'',
            }
        },
        async reqMainClass(){
            let res = await mainClassList();
            if(res.code == 0){
                this.mainOptions = res.data;
            }
        },
        async reqSonClass(){
            this.ruleForm.sonClass = '';
            let res = await sonClassList({ fid:this.ruleForm.mainClass});
            if(res.code == 0){
                this.sonOptions = res.data;
            }
        },
        showDetail(id){
            this.dialogVisible = true;
            this.doReset();
            if(id){
                this.isEdit = true;
                this.getDetail(id);
            }else{
                this.isEdit = false;
            }
        },
        // handleClose(){
        //     this.dialogVisible = false;
        //     this.ruleForm = {
        //         name:'',
        //         type:'0',
        //         imgId:'',
        //         site:'',
        //         goods_code:'',
        //         mainClass:'',
        //         sonClass:'',
        //         activity:'',
        //         order:'',
        //     }
        // },
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
            
            this.$refs.imgUp.clearValidate()
            this.imageUrl = URL.createObjectURL(file.raw);
            this.ruleForm.imgStr = res.data.url;
            this.imgId = res.data.id;
        },
        checkInfo(){
            let result = true;
            if(!this.ruleForm.title){
                this.$message.error('请输入icon名称');
                result = false;
            }else if(!this.imageUrl){
                this.$message.error('请输入icon图片');
                result = false;
            }else if(this.ruleForm.type==0&&!this.ruleForm.site){
                this.$message.error('请输入链接地址');
                result = false;
            }else if((this.ruleForm.type==1&&!this.ruleForm.mainClass) || (this.ruleForm.type==1&&!this.ruleForm.sonClass)){
                this.$message.error('请选择商品分类');
                result = false;
            }else if(this.ruleForm.type==2&&!this.ruleForm.goods_code){
                this.$message.error('请输入商品编号');
                result = false;
            }else if(this.ruleForm.type==3&&!this.ruleForm.activity){
                this.$message.error('请选择营销活动');
                result = false;
            }else if(!this.ruleForm.order||(parseFloat(this.ruleForm.order)%parseInt(this.ruleForm.order))){
                this.$message.error('请输入正确的排序');
                result = false;
            }else{
                result = true;
            }
            return result;
        },
        async doSave(){
            if(!this.checkInfo()){
                return;
            }
            let type_value = '';
            let data = {};
            if(this.ruleForm.type==0){
                type_value = this.ruleForm.site;
            }else if(this.ruleForm.type==1){
                type_value = this.ruleForm.sonClass;
            }else if(this.ruleForm.type==2){
                type_value = this.ruleForm.goods_code;
            }else if(this.ruleForm.type==3){
                type_value = this.ruleForm.activity;
            }
            if(this.isEdit){
                data ={
                    id:this.curId,
                    title:this.ruleForm.title,
                    type:this.ruleForm.type,
                    type_value:type_value,
                    image_url:this.ruleForm.imgStr,
                    sort:this.ruleForm.order,
                }
            }else{
                data ={
                    title:this.ruleForm.title,
                    type:this.ruleForm.type,
                    type_value:type_value,
                    image_url:this.ruleForm.imgStr,
                    sort:this.ruleForm.order,
                }
            }
            let res = await opIcon(data);
            if(res.code == 0){
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.dialogVisible = false;
                this.$parent.getData();
            }else{
                this.$message.error(res.message);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
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