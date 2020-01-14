<template>
    <div>
        <el-dialog
            class="virForm"
            :title="title"
            center
            :visible.sync="dialogVisible"
            width="50%"
            >
            <el-form :model="form" ref="form" label-width="120px" class="demo-ruleForm">
                <el-form-item label="广告位名称：">
                    <el-select v-model="form.ad_location" placeholder="广告位名称" @change="handleChange">
                         <el-option :label="item.name" :value="item.id" v-for="(item,index) in adOptions" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述：" style="width:300px;">
                    <el-input v-model="form.ad_desc" placeholder="广告位描述"></el-input>
                </el-form-item>
                <el-form-item label="尺寸：" style="width:300px;">
                    <span>{{size}}</span>
                </el-form-item>
                <el-form-item label="广告缩略图：" ref="imgUp">
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
                </el-form-item>
                <el-form-item label="用户可见：" style="width:400px;">
                    <el-checkbox-group v-model="form.user_type">
                        <el-checkbox :label="2">普通用户</el-checkbox>
                        <el-checkbox :label="1"> &nbsp;&nbsp;&nbsp;vip&nbsp;&nbsp;&nbsp; </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="目标类型：">
                    <el-radio-group v-model="form.dump_type">
                        <el-radio :label="0">商品分类</el-radio>
                        <el-radio :label="1">商品单品</el-radio>
                        <el-radio :label="2">营销活动</el-radio>
                        <el-radio :label="3">网页</el-radio>
                        <el-radio :label="4">领取优惠券</el-radio>
                        <el-radio :label="5">小程序页面</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="目标地址：" style="width:300px;" v-if="form.dump_type==3">
                    <el-input v-model="form.dump_value" placeholder="请输入目标页面网址"></el-input>
                </el-form-item>
                <el-form-item label="商品编号：" style="width:300px;" v-if="form.dump_type==1">
                    <el-input v-model="form.dump_value" placeholder="请输入商品编号"></el-input>
                </el-form-item>
                <el-form-item label="优惠券编号：" style="width:300px;" v-if="form.dump_type==4">
                    <el-input v-model="form.dump_value" placeholder="请输入优惠券编号"></el-input>
                </el-form-item>
                <el-form-item label="营销活动编号：" style="width:300px;" v-if="form.dump_type==2">
                    <el-input v-model="form.dump_value" placeholder="请输入营销活动编号"></el-input>
                </el-form-item>
                <el-form-item label="一级分类："  v-if="form.dump_type==0">
                    <el-select v-model="form.mainClass" placeholder="一级分类" @change="reqSonClass">
                         <el-option :label="item.cate_name" :value="item.id" v-for="(item,index) in mainOptions" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类："  v-if="form.dump_type==0">
                    <el-select v-model="form.dump_value" placeholder="二级分类">
                        <el-option :label="item.cate_name" :value="item.id" v-for="(item,index) in sonOptions" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="小程序路径："  v-if="form.dump_type==5">
                    <el-select v-model="form.dump_value" placeholder="小程序页面路径">
                        <el-option label="成为会员宣传页" :value="0"></el-option>
                        <el-option label="黑卡会员权益页" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效时间：" >
                    <el-date-picker
                        :picker-options="pickerOptions1"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        v-model="form.start_at"
                        type="datetime"
                        placeholder="选择生效时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="下架时间：" >
                    <el-date-picker
                        :picker-options="pickerOptions1"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        v-model="form.end_at"
                        type="datetime"
                        placeholder="选择下架时间">
                    </el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="跳转类型：" prop="type">
                    <el-radio-group v-model="ruleForm.type" :disabled="isEdit">
                        <el-radio label="0">H5页</el-radio>
                        <el-radio label="1">商品分类</el-radio>
                        <el-radio label="2">商品详情</el-radio>
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
                </el-form-item> -->
            </el-form>   
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doSave">{{isEdit?'保 存':'确 定'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { baseUrl } from '../../../config/env'
import { mainClassList,sonClassList } from '../../../api/getData'
import { saveAd } from '../../../api/getData'
export default {
    data(){
        return{
            isEdit:false,
            dialogVisible:false,
            title:'添加广告内容',
            baseUrl:'',
            imageUrl:'',
            mainOptions:[],
            sonOptions:[],
            adOptions:[
                {id:1,name:'首页头图1',size:{width:700,height:350}},
                {id:2,name:'首页头图2',size:{width:700,height:350}},
                {id:3,name:'首页头图3',size:{width:700,height:350}},
                {id:4,name:'首页头图4',size:{width:700,height:350}},
                {id:5,name:'首页头图5',size:{width:700,height:350}},
                {id:6,name:'首页通栏1',size:{width:695,height:174}},
                {id:7,name:'首页会员权益1',size:{width:345,height:345}},
                {id:8,name:'首页会员权益2',size:{width:342,height:165}},
                {id:9,name:'首页会员权益3',size:{width:342,height:165}},
                {id:10,name:'首页通栏2',size:{width:695,height:161}},
                {id:11,name:'首页通栏3',size:{width:695,height:174}},
                {id:12,name:'首页通栏4',size:{width:700,height:229}},
                {id:13,name:'首页弹窗',size:{width:700,height:1020}},
                {id:14,name:'分类通栏1',size:{width:703,height:250}},
                {id:15,name:'分类通栏2',size:{width:700,height:350}},
            ],
            size:'',
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            },   
            curId:'', 
            form:{
                ad_location:'',
                ad_desc:'',
                ad_img:'',
                user_type:[],
                dump_type:0,
                dump_value:'',
                mainClass:'',
                start_at:'',
                time_type:0
            }
        }
    },
    mounted(){
        this.baseUrl = baseUrl;
        this.reqMainClass();
    },
    methods:{
        doReset(){
            this.curId = '';
            this.form = {
                ad_location:'',
                ad_desc:'',
                ad_img:'',
                user_type:[],
                dump_type:0,
                dump_value:'',
                mainClass:'',
                start_at:'',
                time_type:0
            }
        },
        async reqMainClass(){
            let res = await mainClassList();
            if(res.code == 0){
                this.mainOptions = res.data;
            }
        },
        async reqSonClass(){
            this.form.dump_value = '';
            let res = await sonClassList({ fid:this.form.mainClass});
            if(res.code == 0){
                this.sonOptions = res.data;
            }
        },
        showDetail(row){
            this.doReset();
            if(row){
                this.title = '编辑广告内容';
                this.isEdit = true;
                this.handleChange(row.ad_location);
                this.curId = row.id;
                this.form = {
                    ad_location:row.ad_location,
                    ad_desc:row.ad_desc,
                    ad_img:row.ad_img,
                    user_type:row.user_type==0?[1,2]:[row.user_type],
                    dump_type:parseInt(row.dump_type),
                    dump_value:row.dump_value,
                    mainClass:'',
                    start_at:row.start_at,
                    end_at:row.end_at
                }
            }else{
                this.title = '添加广告内容';
                this.isEdit = false;
            }
            this.dialogVisible = true;
        },
        handleChange(val){
            this.size = this.adOptions[parseInt(val)-1]['size']['width']+'*'+this.adOptions[parseInt(val)-1]['size']['height']
        },
        beforeAvatarUpload(file){
            
            const isPic =  file.type === 'image/png' || file.type === 'image/jpg'|| file.type === 'image/jpeg';
            const isLt = file.size / 1024 / 1024 < 2;
            
            if (!isPic) {
                this.$message.error('上传图片格式有误!');
                return false;
            }
            if (!isLt) {
                this.$message.error('上传图片大小不能超过 2M!');
                return false
            }
            return true;
        },
        handleAvatarSuccess(res, file) {
            
            this.$refs.imgUp.clearValidate()
            this.imageUrl = URL.createObjectURL(file.raw);
            this.form.ad_img = res.data.url;
            this.imgId = res.data.id;
        },
        checkInfos(){
            let result = false;
            let { ad_location,ad_desc,ad_img,user_type,dump_type,dump_value,start_at,end_at } = this.form;
            if(!ad_location){
                this.$message({
                    message: '请选择广告位名称',
                    type: 'warning'
                });
                result = false;
            }else if(!ad_img){
                this.$message({
                    message: '请上传广告图',
                    type: 'warning'
                });
                result = false;
            }else if(!user_type.length){
                this.$message({
                    message: '请选择用户可见类型',
                    type: 'warning'
                });
                result = false;
            }else if(!dump_value){
                this.$message({
                    message: '请完善目标类型配置项',
                    type: 'warning'
                });
                result = false;
            }else if(!start_at){
                this.$message({
                    message: '请选择生效时间',
                    type: 'warning'
                });
                result = false;
            }else if(!end_at){
                this.$message({
                    message: '请选择结束时间',
                    type: 'warning'
                });
                result = false;
            }else if(new Date(start_at).getTime()>= new Date(end_at).getTime()){
                this.$message({
                    message: '结束时间必须大于生效时间',
                    type: 'warning'
                });
                result = false;
            }else{
                result = true;
            }
            return result;
        },
        async doSave(){
            if(this.checkInfos()){
                this.form.user_type = this.form.user_type.length==2?0:this.form.user_type.join('');
                let data = {};
                if(this.isEdit){
                    data = {...this.form,id:this.curId};
                }else{
                    data = this.form;
                }
                let res = await saveAd(data);
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