<template>
    <div class="goodsContainer">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="一级分类：">
                        <el-select v-model="ruleForm.mainClass" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="二级分类：">
                        <el-select v-model="ruleForm.sonClass" placeholder="请选择">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="商品类型：" prop="goodsType">
                <el-radio-group v-model="ruleForm.goodsType">
                    <el-radio label="0" border>实体商品</el-radio>
                    <el-radio label="1" border>虚拟商品</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="品牌：">
                <el-select v-model="ruleForm.brand" placeholder="请选择">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="商品名称：" prop="goodsName">
                        <el-input v-model="ruleForm.goodsName" placeholder="商品名称不超过30个汉字"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="封面图片：">
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
                <el-row class="grey">封面图尺寸300X300像素，不超过300K；点击+可添加多张封面图</el-row>
            </el-form-item>
            <el-form-item label="商品规格：">
                <el-row class="sku_group mb2" v-for="(spec, index) in specification" :key="index">
                    <el-row class="mb2">
                        <el-col  style="width:60px;color:#606266">规格名：</el-col>
                        <el-col  style="width:180px">
                            <el-input placeholder="请输入规格名" v-model.trim="spec.value"></el-input>
                        </el-col>
                        <el-col class="del_icon" @click.native="delSepc(index)">X</el-col>
                    </el-row>
                    <el-row class="mt2">
                        <el-col  style="width:60px;color:#606266">规格值：</el-col>
                        <el-col>
                            <el-popover
                                class="mr2"
                                placement="bottom"
                                width="120"
                                trigger="click"
                                v-for="(option, option_index) in spec.leaf" :key="option_index"
                            >
                                <el-input v-model.trim="option.value"></el-input>
                                <div class="sku_item" slot="reference">
                                    <el-button  >{{option.value}}</el-button>
                                    <span class="remove_icon" @click.stop="delOption(index, option_index)">X</span>
                                </div>  
                            </el-popover>
                            <el-input
                                style="width:220px"
                                placeholder="多个产品属性以空格隔开"
                                suffix-icon="el-icon-plus"
                                v-model="addValues[index]"
                                @keyup.native.enter='addOption(index)'
                                @blur='addOption(index)'
                                >
                            </el-input>
                        </el-col>
                    </el-row>
                </el-row>
                <el-row>
                    <el-col>
                        <el-button type='primary' :disabled='disabled' @click='addSpec'>添加商品规格</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="总库存：" v-if="!this.specification.length">
                <el-input style="width:200px" v-model="ruleForm.allStock" placeholder="请输入总库存数量"></el-input>
            </el-form-item>
            <el-form-item label="总结算价：" v-if="!this.specification.length">
                <el-input style="width:200px" v-model="ruleForm.allPrice" placeholder="请输入总结算价"></el-input>
            </el-form-item>
            <el-form-item label="库存管理：" v-if="this.specification.length">
                <SkuTable :skusData="specificationFilter" ref="skuInfo"></SkuTable>
            </el-form-item>
            <el-form-item label="运费：">
                <el-button type="text" disabled>免运费</el-button>
            </el-form-item>
            <el-form-item label="发货地：">
                <el-select 
                    v-model="province"
                    @change="cityChanged"
                    value-key="areaCode"
                    placeholder="请选择省">
                    <el-option
                    v-for="item in provinces"
                    :key="item.areaCode"
                    :label="item.ateaName"
                    :value="item.areaCode">
                    </el-option>
                </el-select>
                <el-select 
                    v-model="city"
                    @change="citySonChanged"
                    value-key="areaCode"
                    placeholder="请选择市">
                    <el-option
                    v-for="item in cities"
                    :key="item.areaCode"
                    :label="item.ateaName"
                    :value="item.areaCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务承诺：">
                <el-row>
                    <el-input v-model="service" placeholder="请输入承诺内容" style="width:200px;"></el-input>
                    <el-button type="primary" @click="addService">添加</el-button>
                </el-row>
                <el-row class="mt2">
                    <el-checkbox-group v-model="ruleForm.checkService" size="small">
                        <el-checkbox :label="item.name" border v-for="(item,index) in serviceList" :key="index" name="service"></el-checkbox>
                    </el-checkbox-group>
                </el-row>
            </el-form-item>
            <el-form-item label="发票：">
                <el-checkbox-group v-model="ruleForm.bill">
                    <el-checkbox label="0" name="type">普通发票</el-checkbox>
                    <el-checkbox label="1" name="type">增值税发票</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="保修：">
                <el-row>
                    <el-checkbox @change="ruleForm.details=''" v-model="ruleForm.guarantee">保修服务</el-checkbox>
                </el-row>
                <el-row class="mt2" v-if="ruleForm.guarantee">
                    <el-input
                        style="width:400px"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入保修服务细节"
                        v-model="ruleForm.details">
                    </el-input>
                </el-row>
            </el-form-item>
            <el-form-item label="图文介绍：" style="height:450px">
                 <!-- 图片上传组件辅助-->
                <el-upload style="height:0" class="quill-upload" :action="baseUrl+'/op/upload'" :show-file-list="false" :on-success="quillImgsuccess"></el-upload>
                <!--富文本编辑器组件-->
                <quill-editor style="height:300px" name="content" :options="editorOption" v-model="ruleForm.content" ref="myQuillEditor" @change="onEditorChange($event)"></quill-editor>
            </el-form-item>
            <el-form-item class="center">
                <el-button @click="doSubmit">提交审核</el-button>
                <el-button type="primary" @click="doSave">保存到草稿箱</el-button>
            </el-form-item>
        </el-form>
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
import { quillEditor } from 'vue-quill-editor'
import { baseUrl } from '../../config/env.js'
import { createUniqueString, uniqueArr } from '../../utils'
import provinceCity from '../../utils/newCity.json'
import SkuTable from './components/SkuTable'
// import { Sku, SkuTable } from 'element-vue-sku/lib/sku.umd.js'
export default {
    data(){
        return{
            baseUrl:'',
            fileLists:[],//封面图
            imgStrs:[],//动态图片路径
            imgIds:[],//动态图片id
            service:'',//服务承诺
            province: '',//选中省编码
            city: '',//选中市编码
            provinces: [],//省集合
            cities: [],//市集合
            ruleForm:{
                mainClass:'',
                sonClass:'',
                goodsType:'0',
                brand:'',
                goodsName:'',
                allStock:'',//总库存
                allPrice:'',//总结算价
                checkService:[],//选中的服务承诺
                bill:[],//发票
                guarantee:false,//是否有保修服务
                details:'',//保修服务细节
                content:'',//富文本编辑器内容
            },
            rules:{
                // goodsName: [
                //     { required: true, message: '请输入商品名称', trigger: 'blur' },
                //     { min: 1, max: 30, message: '商品名称不超过30个汉字', trigger: 'change'},
                //     { min: 1, max: 30, message: '商品名称不超过30个汉字', trigger: 'blur'}
                // ],
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
            },
            serviceList:[{id:0,name:'正品保证'},{id:1,name:'坏果包赔'},{id:2,name:'7天无理由退货'},{id:3,name:'15天包退'},{id:4,name:'终身质保'},{id:5,name:'不可退换'},{id:6,name:'30天包换'}],
            // 用来存储要添加的规格属性
            addValues: [],
            specification: [
                {
                    id: 1,
                    value: '颜色',
                    leaf: [
                        {
                            id: 11,
                            value: '白色',
                        },
                        {
                            id: 12,
                            value: '黑色',
                        },
                        {
                            id: 13,
                            value: '金色',
                        },
                    ],
                },
                {
                    id: 2,
                    value: '内存',
                    leaf: [
                        {
                            id: 21,
                            value: '128G',
                        },
                        {
                            id: 22,
                            value: '256G',
                        },
                        {
                            id: 23,
                            value: '512G',
                        },
                    ],
                },
            ]
        }
    },
    components:{
        SkuTable,
    },
    computed: {
        disabled() {
            return this.specification.length >= 3 || this.specification.some(item => !item.value)
        },

        // 过滤掉属性名和属性值为空的数据规格项目
        specificationFilter() {
        return this.specification.filter(item => item.value && item.leaf.length)
        },
    },
    mounted() {
        this.baseUrl = baseUrl;
        this.provinces = provinceCity.provinces;
    },
    methods:{
        onEditorChange(e) {

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
        addService(){//添加服务承诺

        },
        cityChanged(value) {
            if (value !== '') {
                for (var item of this.provinces) {
                if (item.areaCode === value) {
                    this.province = item.areaCode;
                    this.cities = item.childAreaCode
                    this.city = ''
                    break
                } else {
                    continue
                }
                }
            } else {
                this.cities = []
                this.city = ''
            }
            
        },
        citySonChanged(value){
            if (value !== '') {
                for (var item of this.cities) {
                if (item.areaCode === value) {
                    this.city = item.areaCode;
                    break
                } else {
                    continue
                }
                }
            } else {
                this.city = ''
            }              
        },
        addSpec() {
            this.specification.push({
                id: createUniqueString() + '_id',
                value: '',
                leaf: [],
            })
        },
        delSepc(index) {
            
            this.specification.splice(index, 1)
        },
        addOption(index) {
            let str = this.addValues[index] || ''
            str = str.trim()
            if (!str) return
            const oldArr = this.specification[index].leaf
            const arr = str
                            .split(/\s+/) // 使用空格分割成数组
                            .filter(value => !oldArr.some(option => option.value === value)) // 过滤掉 oldArr 已存在的 value
                            .map(value => ({ id: createUniqueString() + '_id', value })) // 把 value 转成对象，id 设置为 null
            this.specification[index].leaf = uniqueArr([...oldArr, ...arr])
            this.$set(this.addValues, index, '')
        },
        delOption(spec_index, option_index) {
            this.specification[spec_index].leaf.splice(option_index, 1)
        },
        beforeAvatarUpload(file){
            const isPic = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/swf' || file.type === 'image/bmp';
            const isLt = file.size / 1024 / 1024 < 0.3;
            
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
            if(fileList.length==8){
                document.querySelector('.el-upload--picture-card').style.display = 'none'
            }
        },
        handleRemove(file, fileList) {
            
            this.imgStrs = fileList;
            let imgIds = [];
            fileList.map((item)=>{
                imgIds.push(item.response.id);
            })
            this.imgIds = imgIds;
            if(fileList.length<8){
                document.querySelector('.el-upload--picture-card').style.display = 'inline-block'
            }
        },
        checkInfos(){
            let result = true;
            let nameReg = /^(?![A-Za-z0-9]+$)[\u4e00-\u9fa5A-Za-z0-9]{1,30}$/;
            if(!this.ruleForm.mainClass){
                this.$message({
                    message: '请选择商品一级分类',
                    type: 'warning'
                });
                result = false;
            }else if(!this.ruleForm.sonClass){
                this.$message({
                    message: '请选择商品二级分类',
                    type: 'warning'
                });
                result = false;
            }else if(!this.ruleForm.brand){
                this.$message({
                    message: '请选择商品品牌',
                    type: 'warning'
                });
                result = false;
            }else if(!this.ruleForm.goodsName||!nameReg.test(this.ruleForm.goodsName)){
                this.$message({
                    message: '请输入符合规则的商品名称',
                    type: 'warning'
                });
                result = false;
            }else if(!this.imgIds.length){
                this.$message({
                    message: '请上传商品相关图片',
                    type: 'warning'
                });
                result = false;
            }else if(!this.specification.length && (!this.myIsNaN(parseFloat(this.ruleForm.allStock)) || !this.isInteger(Number(this.ruleForm.allStock)))){
                this.$message({
                    message: '请输入正确的总商品库存',
                    type: 'warning'
                });
                result = false;
            }else if(!this.specification.length && !this.myIsNaN(parseFloat(this.ruleForm.allPrice))){
                this.$message({
                    message: '请输入正确的总结算价',
                    type: 'warning'
                });
                result = false;
            }else if(!this.ruleForm.content){
                this.$message({
                    message: '请输入商品图文信息',
                    type: 'warning'
                });
                result = false;
            }
            return result;
        },
        isInteger(number){
            return number >= 0 && String(number).split('.')[1] == undefined
        },
        myIsNaN(value) {//判断是否为数字
            return typeof value === 'number' && !isNaN(value);
        },
        doSubmit(){
            
            
            if(!this.checkInfos()){
                return;
            }else{
                alert(22)
            }
        },
        doSave(){

        }
    }
}
</script>
<style lang="scss" scoped>
    .center{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .mr2{
        margin-right: 20px;
    }
    .mb2{
        margin-bottom: 20px;
    }
    .mt2{
        margin-top: 20px;
    }
   .grey{
       color: #ccc;
   } 
   .sku_item {
        background-color: #f8f8f8;
        padding: 10px;
        display: inline-block;
        margin-right: 10px;
        vertical-align: middle;
        text-align: center;
        position: relative;
        border-radius: 2px;
        cursor: pointer;
    }
    .sku_item:hover .remove_icon{
        display: block;
    }
    .remove_icon {
        display: none;
        position: absolute;
        z-index: 2;
        width: 18px;
        height: 18px;
        font-size: 14px;
        line-height: 16px;
        color: #fff;
        text-align: center;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        top: -8px;
        right: -8px;
    }
   .del_icon{
       width:40px;
       height:40px;
       font-size:20px;
       line-height:40px;
       margin-left:20px;
       color:#606266;
       cursor: pointer;
   }
   .ql-editor {
     min-height: 400px !important;
    }
    
</style>