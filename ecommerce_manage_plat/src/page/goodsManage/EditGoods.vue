<template>
    <div class="goodsContainer">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="一级分类：">
                        <el-select v-model="ruleForm.mainClass" placeholder="请选择" @change="reqSonClass">
                            <el-option :label="item.cate_name" :value="item.id" v-for="(item,index) in mainOptions" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="二级分类：">
                        <el-select v-model="ruleForm.sonClass" placeholder="请选择">
                           <el-option :label="item.cate_name" :value="item.id" v-for="(item,index) in sonOptions" :key="index"></el-option>
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
                <el-select filterable v-model="ruleForm.brand" placeholder="请选择">
                   <el-option :label="item.brand_name" :value="item.id" v-for="(item,index) in brandOptions" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="商品名称：" prop="goodsName">
                        <el-input v-model="ruleForm.goodsName" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="封面图片：">
                <el-upload
                    :on-exceed="limitTip"
                    :limit="8"
                    multiple
                    class="upImg"
                    :file-list="fileLists"
                    :action="baseUrl+'/supplier/goods/upload/imgM'"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleSuccess"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-row class="grey">封面图尺寸750X750像素，不超过300K；点击+可添加多张封面图</el-row>
            </el-form-item>
            <el-form-item label="商品规格：" v-if="specification.length">
                <el-row class="sku_group mb2" v-for="(spec, index) in specification" :key="index">
                    <el-row class="mb2">
                        <el-col  style="width:60px;color:#606266">规格名：</el-col>
                        <el-col  style="width:180px">
                            <el-select
                                @change="selValues"
                                @focus="setCurMode(index)"
                                v-model="spec.value"
                                filterable
                                placeholder="请选择规格名">
                                <el-option
                                    v-for="item in options"
                                    :key="item.id"
                                    :label="item.spesc_name"
                                    :value="item.id+''">
                                </el-option>
                            </el-select>
                            <!-- <el-input placeholder="请输入规格名" v-model.trim="spec.value"></el-input> -->
                        </el-col>
                        <!-- <el-col class="del_icon" @click.native="delSepc(index)">X</el-col> -->
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
                                    <!-- <span class="remove_icon" @click.stop="delOption(index, option_index)">X</span> -->
                                </div>  
                            </el-popover>
                            <!-- <el-input
                                style="width:220px"
                                placeholder="多个产品属性以空格隔开"
                                suffix-icon="el-icon-plus"
                                v-model="addValues[index]"
                                @keyup.native.enter='addOption(index)'
                                @blur='addOption(index)'
                                >
                            </el-input> -->
                        </el-col>
                    </el-row>
                </el-row>
                <!-- <el-row>
                    <el-col>
                        <el-button type='primary' :disabled='disabled' @click='addSpec'>添加商品规格</el-button>
                    </el-col>
                </el-row> -->
            </el-form-item>
            <el-form-item label="总库存：" v-if="!this.specification.length">
                <el-input style="width:200px" v-model="ruleForm.allStock" placeholder="请输入总库存数量"></el-input>
            </el-form-item>
            <el-form-item label="总结算价：" v-if="!this.specification.length">
                <el-input style="width:200px" v-model="ruleForm.allPrice" placeholder="请输入总结算价"></el-input>
            </el-form-item>
            <el-form-item label="市场价：" v-if="!this.specification.length">
                <el-input style="width:200px" v-model="ruleForm.mPrice" placeholder="请输入市场价"></el-input>
            </el-form-item>
            <el-form-item label="库存管理：" v-if="this.specification.length">
                <SkuTable :skuNums="sku" :skusData="specificationFilter" :isEdit="edit" ref="skuInfo"></SkuTable>
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
                        <el-checkbox :label="item.id" border v-for="(item,index) in serviceList" :key="index" name="service">{{item.service_name}}</el-checkbox>
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
                <el-upload :file-list="quillImgList" ref="quillImg" multiple style="height:0" class="quill-upload" :action="baseUrl+'/supplier/goods/upload/imgM'" :show-file-list="false" :on-success="quillImgsuccess" :before-upload="quillImgBefore"></el-upload>
                <!--富文本编辑器组件-->
                <quill-editor style="height:300px" name="content" :options="editorOption" v-model="ruleForm.content" ref="myQuillEditor" @change="onEditorChange($event)"></quill-editor>
            </el-form-item>
            <el-form-item class="center">
                <el-button v-if="!isPre" @click="doSubmit">保存</el-button>
                <el-button v-else @click="goBack">返回</el-button>
            </el-form-item>
        </el-form>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
import { serviceList ,mainClassList,sonClassList,goodsBrandList,editGoods,addService ,saveGoodsInfo} from '../../api/getData';
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
            curNum:0,
            quillImgList:[],
            draft:0, //0  商品 1 为草稿
            dialogImageUrl: '',
            dialogVisible: false,
            isPre:false,//是否是查看来源
            edit:true,
            tableData:[],
            sku:[],
            baseUrl:'',
            fileLists:[],//封面图
            imgStrs:[],//动态图片路径
            imgIds:[],//动态图片id
            service:'',//服务承诺
            province: '',//选中省编码
            city: '',//选中市编码
            provinces: [],//省集合
            cities: [],//市集合
            curValue:'',//当前操作规格值
            mainOptions:[],//一级分类
            sonOptions:[],//二级分类
            brandOptions:[],//品牌
            ruleForm:{
                mainClass:'',
                sonClass:'',
                goodsType:'0',
                brand:'',
                goodsName:'',
                allStock:'',//总库存
                allPrice:'',//总结算价
                mPrice:'',
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
            serviceList:[],//服务列表
            // 用来存储要添加的规格属性
            addValues: [],
            options: [],
            curModeIndex:0,//当前操作规格序号
            specification: [
                // {
                //     id: 1,
                //     value: '颜色',
                //     leaf: [
                //         {
                //             id: 11,
                //             value: '白色',
                //         },
                //         {
                //             id: 12,
                //             value: '黑色',
                //         },
                //         {
                //             id: 13,
                //             value: '金色',
                //         },
                //     ],
                // },
                // {
                //     id: 2,
                //     value: '内存',
                //     leaf: [
                //         {
                //             id: 21,
                //             value: '128G',
                //         },
                //         {
                //             id: 22,
                //             value: '256G',
                //         },
                //         {
                //             id: 23,
                //             value: '512G',
                //         },
                //     ],
                // },
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
        if(this.$route.query.isPre){
            this.isPre = true;
            this.draft = 1;
        }else{
            this.isPre = false;
            this.draft = 0;
        }
        this.baseUrl = baseUrl;
        this.provinces = provinceCity.provinces;
        this.reqMainClass();
        this.reqBrands();
        this.getServiceList();
        // this.reqSpecificationList();
        this.reqGoodsInfo();
    },
    methods:{
        goBack(){
            this.$router.replace({
                path:'/goodsManage/goodsList',
                query:{
                    actTab:this.$route.query.actTab,
                    curPage:this.$route.query.curPage,
                    isPre:true,
                    goodsName:this.$route.query.goodsName,
                    goodsCode:this.$route.query.goodsCode,
                    mainClass:this.$route.query.mainClass,
                    sonClass:this.$route.query.sonClass,
                }
            })
        },
        async reqGoodsInfo(){
            let res = await editGoods({id:this.$route.query.id,draft:this.draft});
            if(res.code == 0){
                this.ruleForm.mainClass = res.data.category_id_one;
                this.reqSonClass();
                this.ruleForm.sonClass = res.data.category_id_two;
                let fileLists = [];
                let checkService = [];
                let bill = [];
                let specs_info = [];
                let imgIds = [];
                fileLists.push({id:res.data.picture_main,url:res.data.picture_mains});
                if(res.data.picture.length){
                    res.data.picture.map((item,index)=>{
                        res.data.pic_ids.split(',').map((ptem,pIndex)=>{
                            if(index == pIndex){
                                fileLists.push({id:ptem,url:item})
                            }
                        })
                    })
                }
                this.fileLists = fileLists;
                fileLists.forEach(item=>{
                    imgIds.push(item.id);
                })
                this.imgIds = imgIds;
                if(res.data.service_promise_ids){
                    res.data.service_promise_ids.split(',').map(item=>{
                        checkService.push(parseInt(item))
                    })    
                }
                if(res.data.invoices_type){
                    res.data.invoices_type.split(',').map(item=>{
                        bill.push(item)
                    })
                }
                if(res.data.place_delivery){
                    this.provinces.map(item=>{
                        if(item.ateaName == res.data.place_delivery.split(',')[0]){
                            this.cityChanged(item.areaCode)
                        }
                    })
                }
                let  allStock = 0;//总库存
                let  allPrice = 0;//总结算价
                let  mPrice = 0;
                if(res.data.specs_type==1){
                    allStock = res.data.sku[0]['stock'];
                    allPrice = res.data.sku[0]['settlement_price'];
                    mPrice   = res.data.sku[0]['market_price'];
                }
                this.ruleForm = {
                    mainClass:res.data.category_id_one,
                    sonClass:res.data.category_id_two,
                    goodsType:res.data.type+'',
                    brand:res.data.brand_id,
                    goodsName:res.data.goods_name,
                    allStock:allStock,//总库存
                    allPrice:allPrice,//总结算价
                    mPrice:mPrice,
                    checkService:checkService,//选中的服务承诺
                    bill:bill,//发票
                    guarantee:res.data.warranty_service?true:false,//是否有保修服务
                    details:res.data.warranty_service?res.data.warranty_service:'',//保修服务细节
                    content:res.data.content,//富文本编辑器内容
                }
                if(res.data.place_delivery){
                    this.province = res.data.place_delivery.split(',')[0];
                    this.city = res.data.place_delivery.split(',')[1];
                }
                if(res.data.specs_type==0){//多规格
                    res.data.specs_info.forEach(item => {
                        item.value = item.specs_name;
                        item.id = item.spec_ids;
                        if(item.left.length){
                            item.left.forEach(ptem=>{
                                ptem.value = ptem.name;
                                // item.leaf = item.left;
                            })
                            item.leaf = item.left;
                        }
                    
                    });
                    // 
                    // 
                    // res.data.sku.map((item,index)=>{
                        
                    // })
                    this.sku = res.data.sku;
                    this.specification = res.data.specs_info;
                    
                }
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
        async reqBrands(){
            let res = await goodsBrandList();
            if(res.code == 0){
                this.brandOptions = res.data;
            }
        },
        async getServiceList(){
            let res  = await serviceList({supplier_id:this.$route.query.sid});
            if(res.code == 0){
                this.serviceList = res.data;
            }
        },
        async reqSpecificationList(){
            let res = await specificationList();
            if(res.code == 0){
                res.data.forEach(item => {
                    if(item.left.length){
                        item.left.forEach(ptem=>{
                            ptem.value = ptem.name;
                        })
                    }
                   
                });
                
                this.options = res.data;
            }
        },
        setCurMode(index){
            
            this.curModeIndex = index;
        },
        selValues(value){
            this.specification.forEach((item,index)=>{
                if(item.id==value&&this.curModeIndex!=index){
                    this.$message({
                        message: '不能选择相同的规格名称',
                        type: 'warning'
                    });
                   this.delSepc(this.curModeIndex)
                }
            })
            
            let name = '';
            let left = [];
            this.options.map(item=>{
                if(item.id == value){
                    name = item.spesc_name;
                    left = item.left
                }
            })
            this.reqValues(value,name,left)
        },
        async reqValues(id,name,left){
            let res = await specificationValues({sid:id});
            if(res.code == 0){
                if(res.data.length){
                    
                    this.$set(this.specification[this.curModeIndex],'id',id);
                    this.$set(this.specification[this.curModeIndex],'value',name);
                    this.$set(this.specification[this.curModeIndex],'leaf',left);
                    this.$set(this.specification[this.curModeIndex],'left',left);
                    this.$set(this.specification[this.curModeIndex],'spesc_name',name);
                }
            }
            
        },
        onEditorChange(e) {

        },
        quillImgBefore(file){
            this.curNum = 0;
        },
        // 富文本上传图片
        quillImgsuccess(res, file, fileList) {
            this.curNum++;
            
            // 
            // res为图片服务器返回的数据
            // 获取富文本组件实例
            let quill = this.$refs.myQuillEditor.quill
            // 如果上传成功
            // 获取光标所在位置
            let length = quill.getSelection().index
            // 插入图片  res.info为服务器返回的图片地址
            // quill.insertEmbed(length, 'image', res.data.url)

            this.curNum==fileList.length&&fileList.reverse().forEach((item,index)=>{
                if(item.response){
                    quill.insertEmbed(length, 'image', item.response.data.url)
                    this.$refs.quillImg.clearFiles();
                }
            })
            // 调整光标到最后
           quill.setSelection(length + fileList.length);
          
        },
        async addService(){//添加服务承诺
            let res = await addService({service_name:this.service,supplier_id:this.$route.query.sid});
            if(res.code == 0){
                this.service = "";
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
                this.getServiceList();
            }else{
                this.$message.error(res.message);
            }
        },
        cityChanged(value) {
            if (value !== '') {
                for (var item of this.provinces) {
                if (item.areaCode === value) {
                    this.province = item.ateaName;
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
                    this.city = item.ateaName;
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
                left:[],
                spesc_name:[]
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
            
            // this.options.value.forEach(item=>{
            //     if(item.spesc_name==this.specification[index].value){
            //         this.$message.error('规格名称重复');
            //     }
            // })
            let spesc_info = [{spesc_name:'',left:[]}];
            spesc_info[0]['spesc_name'] = this.specification[index].value;
            spesc_info[0]['left'] = [];
            this.specification[index].leaf.forEach(item => {
                spesc_info[0]['left'].push({value:item.value});
            });
            addSpecification({spesc_info:spesc_info}).then((res)=>{
                if(res.code == 0){
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    })
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        delOption(spec_index, option_index) {
            this.specification[spec_index].leaf.splice(option_index, 1)
        },
        limitTip(){
            this.$message.error('最多上传8张图片!');
        },
        handlePictureCardPreview(file){
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        beforeAvatarUpload(file){
            const isPic = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/swf' || file.type === 'image/bmp';
            const isLt = file.size / 1024 / 1024 < 1;
            
            if (!isPic) {
                this.$message.error('上传图片格式有误!');
                return false;
            }
            if (!isLt) {
                this.$message.error('上传图片大小不能超过 1M!');
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
                }else if(item.response){
                    
                    imgIds.push(item.response.data.id);
                }
            })
            this.imgIds = imgIds;
            
            if(fileList.length>=8){
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
            }else if(!this.ruleForm.goodsName){
                this.$message({
                    message: '请输入商品名称',
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
            }else if(!this.specification.length && !this.myIsNaN(parseFloat(this.ruleForm.mPrice))){
                this.$message({
                    message: '请输入正确的市场价',
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
        async doSubmit(sh_status){
            
            
            if(!this.checkInfos()){
                return;
            }else{
                
                let data = {
                    id:this.$route.query.id,
                    goods_name:this.ruleForm.goodsName,
                    category_id_one:this.ruleForm.mainClass,
                    category_id_two:this.ruleForm.sonClass,
                    type:this.ruleForm.goodsType,
                    content:this.ruleForm.content,
                    service_promise_ids:this.ruleForm.checkService.join(','),
                    pic_ids:this.imgIds.filter((item,index)=>index!=0).join(','),
                    picture_main:this.imgIds[0],
                    sku:this.specification.length?this.$refs.skuInfo.data:[{stock:this.ruleForm.allStock,settlement_price:this.ruleForm.allPrice,market_price:this.ruleForm.mPrice}],
                    place_delivery:this.province+','+this.city,
                    warranty_service:this.ruleForm.details,
                    sh_status:sh_status,
                    brand_id:this.ruleForm.brand,
                    invoices_type:this.ruleForm.bill.join(',')
                }
                let res = await saveGoodsInfo(data);
                if(res.code == 0){
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    // this.$router.history.push({path:'/goodsManage/goodsList'});
                    this.$router.replace({
                        path:'/goodsManage/goodsList',
                        query:{
                            actTab:this.$route.query.actTab,
                            curPage:this.$route.query.curPage,
                            isPre:false,
                            goodsName:this.$route.query.goodsName,
                            goodsCode:this.$route.query.goodsCode,
                            mainClass:this.$route.query.mainClass,
                            sonClass:this.$route.query.sonClass,
                        }
                    })
                }else{
                    this.$message.error(res.message);
                }
            }

        },
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