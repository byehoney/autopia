<template>
    <el-dialog width="80%" :title="title" center v-if='dialogFormVisible' :visible.sync="dialogFormVisible" :destroy-on-close="true" :close-on-click-modal="false" class="pubForm">
        <el-form ref="form" :model="form"   label-width="150px">
            <el-form-item label="所属分类：">
                <el-select v-model="form.mainClass" placeholder="请选择一级分类" @change="setClass">
                    <el-option v-for="(item,index) in mainOption" :key="index" :label="item.cate_name" :value="item.id"></el-option>
                </el-select>
                <el-select v-model="form.sonClass" placeholder="请选择二级分类">
                    <el-option v-for="(item,index) in sonOption" :key="index" :label="item.cate_name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品名称：">
                <el-col :span="8">
                    <el-input v-model="form.goodsName" placeholder="请输入商品名称"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="商品简介：">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item label="封面图片：">
                <el-upload
                    class="upCoverImg"
                    :before-upload="beforeAvatarUpload"
                    :action="baseUrl+'/shop/upload/img'"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="产品图片：">
                <el-upload
                    class="upImg"
                    :file-list="fileLists"
                    :action="baseUrl+'/shop/upload/img'"
                    list-type="picture-card"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleSuccess"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="服务承诺：">
                <el-checkbox-group v-model="form.promise">
                    <el-checkbox :label="item.id" name="type" v-for="(item,index) in serviceOption" :key="index">{{item.service_name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <!-- <el-form-item label="售卖类型">
                <el-radio-group v-model="form.sellType">
                <el-radio label="0">普通商品</el-radio>
                <el-radio label="1">团购商品</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="多少人成团：">
                <el-col :span="8">
                    <el-input v-model="form.groupNum" placeholder="请输入成团人数"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="成团时间（小时）：">
                <el-col :span="8">
                    <el-input v-model="form.groupTime" placeholder="请输入成团时间"></el-input>
                </el-col>
            </el-form-item>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="成本价：" label-width="80px">
                        <el-col :span="18">
                            <el-input v-model="form.oPrice" placeholder="¥"></el-input>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="市场价：" label-width="80px">
                        <el-col :span="18">
                            <el-input v-model="form.sPrice" placeholder="¥"></el-input>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="会员价：" label-width="80px">
                        <el-col :span="18">
                            <el-input v-model="form.mPrice" placeholder="¥"></el-input>
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="vip 价格：" label-width="80px">
                        <el-col :span="18">
                            <el-input v-model="form.vPrice" placeholder="¥"></el-input>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="团购价格：" label-width="100px">
                        <el-col :span="18">
                            <el-input v-model="form.gPrice" placeholder="¥"></el-input>
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="运费：">
                <el-radio-group v-model="form.feeType">
                    <el-radio label="0">免运费</el-radio>
                    <el-radio label="1">固定金额</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="固定金额：" v-if="form.feeType==1">
                <el-col :span="8">
                    <el-input v-model="form.fee" placeholder="¥"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="库存：">
                <el-col :span="8">
                    <el-input v-model="form.stock" placeholder="请输入库存"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="供应商：">
                <el-select v-model="form.suply" placeholder="请选择供应商">
                    <el-option v-for="(item,index) in supplyOption" :key="index" :label="item.company" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图文编辑：">
                <!-- 图片上传组件辅助-->
                <el-upload class="quill-upload" :action="baseUrl+'/op/upload'" :show-file-list="false" :on-success="quillImgsuccess"></el-upload>
                <!--富文本编辑器组件-->
                <quill-editor name="content" :options="editorOption" v-model="form.content" ref="myQuillEditor" @change="onEditorChange($event)"></quill-editor>
            </el-form-item>
            <el-form-item>
                 <el-button type="primary" @click="onSubmit">立即提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
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
import { quillEditor } from 'vue-quill-editor'
import { err } from '../utils/message.js'
import { baseUrl } from '../config/env.js'
import { upDateGoods,sonClassList,classList ,supplyList ,serviceList,goodsDetail} from '../api/getData.js'
export default {
  name: "publishForm",
  props:['classOptionList'],
  data(){
    return{
        title:'商品添加',
        isEdit:false,//是否是编辑
        baseUrl:'',//上传图片路径
        dialogFormVisible:false,//表单弹框是否显示
        imgStrs:[],//动态图片路径
        imgIds:[],//动态图片id
        fileLists:[],//图片存贮
        imageUrl:'',
        mainOption:[],
        sonOption:[],
        supplyOption:[],
        curGoodsId:'',
        form:{
            mainClass:'',
            sonClass:'',
            goodsName:'',
            desc:'',
            promise:[],
            sellType:'',
            groupNum:'',
            groupTime:'',
            oPrice:'',
            sPrice:'',
            gPrice:'',
            mPrice:'',
            vPrice:'',
            feeType:'',
            fee:'',
            stock:'',
            suply:'',
            content:''
        },
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
  components: {

  },
  mounted() {
    this.baseUrl = baseUrl;
    this.getMainClass();
    this.getSupplyList();
    this.getServiceList();
  },
  methods: {
    async getServiceList(){
        let res = await serviceList({page:1,page_size:1000});
        if(res.code == 0){
            this.serviceOption = res.data;
        }
    },
    async getMainClass(){
        let res = await classList({page:1,page_size:1000});
        if(res.code == 0){
            this.mainOption = res.data.data;
        }
    },
    async setClass(val){
        let res = await sonClassList({id:val});
        if(res.code == 0){
            this.sonOption = res.data;
        }
    },
    async getSupplyList(){
        let res = await supplyList({page:1,page_size:1000});
        if(res.code == 0){
            this.supplyOption = res.data.data;
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
        this.imgId = res.id;
    },
    handleSuccess(response, file, fileList){
        this.imgStrs = fileList;
        let imgIds = [];
        fileList.map((item)=>{
            if(item.id){
                imgIds.push(item.id);
            }else{
                imgIds.push(item.response.id);
            }
        })
        this.imgIds = imgIds;
        if(fileList.length==12){
            document.querySelector('.el-upload--picture-card').style.display = 'none'
        }
    },
    handleRemove(file, fileList) {
        this.imgStrs = fileList;
        let imgIds = [];
        fileList.map((item)=>{
            imgIds.push(item.response.data.id);
        })
        this.imgIds = imgIds;
        if(fileList.length<12){
            document.querySelector('.el-upload--picture-card').style.display = 'inline-block'
        }
    },
    showDialogForm(params){
        this.dialogFormVisible = true;
        this.resetForm();
        this.fileLists = [];
        if(params){
            this.isEdit = true;
            this.title = '商品编辑';
            this.curGoodsId = params.id;
            this.getGoodsDetail(params.id);
        }else{
            this.isEdit = false;
            this.title = '商品添加';
            this.curGoodsId = '';
        }
        this.$nextTick(()=>{
            let quill = this.$refs.myQuillEditor.quill
            quill.container.style.minHeight = `${300}px`
        })
    },
    resetForm(){
        this.form = {
            mainClass:'',
            sonClass:'',
            goodsName:'',
            desc:'',
            promise:[],
            sellType:'',
            groupNum:'',
            groupTime:'',
            oPrice:'',
            sPrice:'',
            gPrice:'',
            mPrice:'',
            vPrice:'',
            feeType:'',
            fee:'',
            stock:'',
            suply:'',
            content:''
        };
        this.curGoodsId = '';
        this.imgId = '';
        this.imageUrl = '';
        this.imgIds = [];
        this.fileList = [];
    },
    async getGoodsDetail(id){
        let res = await goodsDetail({id:id});
        if(res.code == 0){
            let promise = [];
            res.data.service_promise_ids.split(',').map(item=>{
                promise.push(parseInt(item))
            })
            this.setClass(res.data.category_id_one);
            this.form = {
                mainClass:res.data.category_id_one,
                sonClass:res.data.category_id_two!=0?res.data.category_id_two:'',
                goodsName:res.data.goods_name,
                desc:res.data.desc,
                promise:promise,
                sellType:'',
                groupNum:res.data.group_num,
                groupTime:res.data.group_hour,
                oPrice:res.data.cost_price,
                sPrice:res.data.market_price,
                gPrice:res.data.group_price,
                mPrice:res.data.member_price,
                vPrice:res.data.vip_price,
                feeType:res.data.shipping.carriage_status+'',
                fee:res.data.shipping.fixed_amount,
                stock:res.data.stock,
                suply:res.data.supplier_id,
                content:res.data.content,
            }
            let ids = [];
            res.data.picture.map(item=>{
                item.url = item.pic_url;
                ids.push(item.id);
            })
            this.imgId = res.data.picture_main;
            this.fileLists =  res.data.picture;
            this.imgIds = ids;
            this.imageUrl = res.data.picture_main_url;
        }else{
            this.$message.error(res.message);
        }
    },
    myIsNaN(value) {//判断是否为数字
        return typeof value === 'number' && !isNaN(value);
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
    },
    checkInfos(){
        let result = true;
        if(!this.form.mainClass && !this.form.sunClass){
            this.$message({
                message: '请选择商品分类',
                type: 'warning'
            });
            result = false;
        }else if(!this.form.goodsName) {
            this.$message({
                message: '请输入商品名称',
                type: 'warning'
            });
            result = false;
        }else if(!this.form.desc) {
            this.$message({
                message: '请输入商品简介',
                type: 'warning'
            });
            result = false;
        }else if(!this.imageUrl) {
            this.$message({
                message: '请上传商品封面图片',
                type: 'warning'
            });
            result = false;
        }else if(!this.imgIds.length) {
            this.$message({
                message: '请上传商品图片',
                type: 'warning'
            });
            result = false;
        }
        // else if(!this.form.sellType) {
        //     this.$message({
        //         message: '请选择商品售卖类型',
        //         type: 'warning'
        //     });
        //     result = false;
        // }
        else if(!this.form.groupNum&&!this.myIsNaN()){
            this.$message({
                message: '请输入正确的团购人数',
                type: 'warning'
            });
            result = false;
        }else if(!this.form.groupTime&&!this.myIsNaN()){
            this.$message({
                message: '请输入正确的成团时间',
                type: 'warning'
            });
            result = false;
        }else if(!this.form.oPrice||!this.form.sPrice||!this.form.gPrice||!this.form.mPrice||!this.form.vPrice){
            this.$message({
                message: '请完善商品价格信息',
                type: 'warning'
            });
            result = false;
        }else if(!this.form.feeType){
            this.$message({
                message: '请选择运费类型',
                type: 'warning'
            });
            result = false;
        }else if(this.form.feeType==1&&!this.form.fee){
            this.$message({
                message: '请输入运费金额',
                type: 'warning'
            });
            result = false;
        }else if(!this.form.stock){
            this.$message({
                message: '请输入商品库存',
                type: 'warning'
            });
            result = false;
        }else if(!this.form.suply){
            this.$message({
                message: '请选择商品供应商',
                type: 'warning'
            });
            result = false;
        }else{
            result = true;
        }
        return result;
    },
    async onSubmit(){
        if(this.checkInfos()){
            let data = {
                goods_name:this.form.goodsName,
                category_id_one:this.form.mainClass,
                category_id_two:this.form.sonClass,
                desc:this.form.desc,
                group_price:this.form.gPrice,
                market_price:this.form.sPrice,
                member_price:this.form.mPrice,
                vip_price:this.form.vPrice,
                cost_price:this.form.oPrice,
                group_num:this.form.groupNum,
                group_hour:this.form.groupTime,
                stock:this.form.stock,
                supplier_id:this.form.suply,
                carriage_status:this.form.feeType,
                fixed_amount:this.form.feeType==1?this.form.fee:'',
                content:this.form.content,
                service_promise_ids:this.form.promise.join(','),
                pic_ids:this.imgIds.join(','),
                picture_main:this.imgId,
                id:this.curGoodsId//添加商品  为空 编辑商品为实际商品id
            }
            let res = await upDateGoods(data);
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
// @import '../style/reset.scss';
.pubForm  .formTip .el-form-item__label{
    opacity: 0;
}
.pubForm .upImg{
    margin-bottom: 20px;
}
.pubForm  .el-upload--picture-card,.pubForm   .el-upload-list--picture-card .el-upload-list__item{
    width: 80px;
    height: 80px;
    line-height: 80px;
    position: relative!important;
}
.pubForm  .el-upload__text{
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    line-height: 120px;
}
.pubPosition{
    display: flex;
    align-items: center;
}
.pubPosition  .el-form-item{
    display: flex;
    margin-right: 20px;
}
.pubForm  .formItem{
    display: flex!important;
    align-items: center!important;
}
.pubForm  .el-radio__input{
    display: none;
}
.pubForm .formItem  .el-form-item__label{
    flex-shrink: 0;
}
.ql-editor {
  min-height: 400px !important;
}
</style>