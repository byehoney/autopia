<template>
    <el-dialog 
        title="查看"
        :visible.sync="dialogFormVisible"  
        v-if='dialogFormVisible'
        :close-on-click-modal="false" class="virForm">
        <el-row class="center mb2">订单详情</el-row>
        <el-row class="h4 bg">
            <el-col :span="6">订单号</el-col>
            <el-col :span="6">购买人</el-col>
            <el-col :span="6">订单状态</el-col>
            <el-col :span="6">下单时间</el-col>
        </el-row>  
        <el-row class="center h4 mb2">
            <el-col :span="6">{{order_no}}</el-col>
            <el-col :span="6">{{user_name}}</el-col>
            <el-col :span="6">{{status_str}}</el-col>
            <el-col :span="6">{{created_at}}</el-col>
        </el-row>
        <el-row class="center mb2">订单商品</el-row>
        <el-row class="h4 bg mb2">
            <el-col :span="5">图片</el-col>
            <el-col :span="5">商品名称</el-col>
            <el-col :span="5">购买数量</el-col>
            <el-col :span="5">商品单价</el-col>
            <el-col :span="4">总价</el-col>
        </el-row>  
        <el-row class="center h4 mb2">
            <el-col :span="5"><img style="width:30px;height:30px;" :src="pic_cover_small" alt=""></el-col>
            <el-col :span="5">{{goods_name}}</el-col>
            <el-col :span="5">{{quantity}}</el-col>
            <el-col :span="5">{{pay_fee}}</el-col>
            <el-col :span="4">{{goods_fee}}</el-col>
        </el-row>
        <el-row class="center mb2">支付信息</el-row>
        <el-row class="h4 bg">
            <el-col :span="8">商品实付</el-col>
            <el-col :span="8">运费</el-col>
            <el-col :span="8">订单实付</el-col>
        </el-row>  
        <el-row class="center h4 mb2">
            <el-col :span="8">{{g_goods_fee}}</el-col>
            <el-col :span="8">{{express_fee}}</el-col>
            <el-col :span="8">{{pay_fee}}</el-col>
        </el-row>
        <el-row class="center mb2">收件信息<el-button @click="modify" type="primary" class="ml2" v-if="status==10">修改收货人信息</el-button></el-row>
        <el-row class="h4 bg">
            <el-col :span="8">收件人</el-col>
            <el-col :span="8">电话</el-col>
            <el-col :span="8">通讯地址</el-col>
        </el-row>  
        <el-row class="center h4 mb2">
            <el-col :span="8">{{receive_name}}</el-col>
            <el-col :span="8">{{receive_mobile}}</el-col>
            <el-col :span="8">{{receive_province}}{{receive_city}}{{receive_district}}{{receive_address}}</el-col>
        </el-row>
        <el-row class="center mb2">物流信息</el-row>
        <el-row class="h4 bg">
            <el-col :span="12">快递公司</el-col>
            <el-col :span="12">运单号</el-col>
        </el-row>  
        <el-row class="center h4 mb2">
            <el-col :span="12">{{express_company}}</el-col>
            <el-col :span="12">{{express_no}}</el-col>
        </el-row>
        <el-dialog
            width="30%"
            title="编辑收货信息"
            :visible.sync="innerVisible"
            append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="收件人" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="tel">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="省份" prop="province">
                    <el-input v-model="form.province"></el-input>
                </el-form-item>
                <el-form-item label="市" prop="city">
                    <el-input v-model="form.city"></el-input>
                </el-form-item>
                <el-form-item label="区县" prop="area">
                    <el-input v-model="form.area"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="addr">
                    <el-input v-model="form.addr"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('form')">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-dialog>
</template>
<script>
import { baseUrl } from '../config/env.js'
import { orderDetailInfo ,modifyRecive } from '../api/getData.js';
export default {
  name: "bannerForm",
  data(){
    return{
        dialogFormVisible:false,//表单弹框是否显示
        innerVisible:false,
        curOrderId:'',
        order_no:'',
        user_name:'',
        status_str:'',
        created_at:'',
        pic_cover_small:'',
        goods_name:'',
        quantity:'',
        pay_fee:'',
        goods_fee:'',
        g_goods_fee:'',
        express_fee:'',
        receive_name:'',
        receive_mobile:'',
        receive_province:'',
        receive_city:'',
        receive_district:'',
        receive_address:'',
        express_company:'',
        express_no:'',
        status:'',
        form:{
            name:'',
            tel:'',
            province:'',
            city:'',
            area:'',
            addr:''
        },
        rules: {
          name: [
            { required: true, message: '请输入收件人', trigger: 'blur' },
          ],
          tel: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
          ],
          province: [
            { required: true, message: '请输入省份名称', trigger: 'blur' },
          ],
          city: [
            { required: true, message: '请输入城市名称', trigger: 'blur' },
          ],
          area: [
            { required: true, message: '请输入城区县名称', trigger: 'blur' },
          ],
          addr: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
          ],
        }
    }
  },
  mounted() {
    this.baseUrl = baseUrl;
  },
  methods: {
    async getDetail(order_no){
        let res = await orderDetailInfo({order_no:order_no});
        if(res.code == 0){
            this.order_no = res.data.order_no;
            this.user_name = res.data.user_name;
            this.status_str = res.data.status_str;
            this.created_at = res.data.created_at;
            this.pic_cover_small = res.data.order_goods.pic_cover_small;
            this.goods_name = res.data.order_goods.goods_name;
            this.quantity = res.data.order_goods.quantity;
            this.pay_fee = res.data.order_goods.pay_fee;
            this.goods_fee = res.data.goods_fee;
            this.g_goods_fee = res.data.order_goods.pay_fee;
            this.express_fee = res.data.express_fee;
            this.receive_name = res.data.order_addr.receive_name;
            this.receive_mobile = res.data.order_addr.receive_mobile;
            this.receive_province = res.data.order_addr.receive_province;
            this.receive_city = res.data.order_addr.receive_city;
            this.receive_district = res.data.order_addr.receive_district;
            this.receive_address = res.data.order_addr.receive_address;
            this.express_company = res.data.order_package?res.data.order_package.express_company:'';
            this.express_no = res.data.order_package?res.data.order_package.express_no:'';
            this.status = res.data.status;
            this.curOrderId = res.data.id;
        }
    },
    showDialogForm(row){
        this.dialogFormVisible = true;
        this.getDetail(row.order_no);
    },
    async modify(){
        this.innerVisible = true;
        this.form = {
            name:this.receive_name,
            tel:this.receive_mobile,
            province:this.receive_province,
            city:this.receive_city,
            area:this.receive_district,
            addr:this.receive_address
        }
    },
    async confirmInfo(){
        let res = await modifyRecive({
            order_id:this.curOrderId,
            receive_name:this.form.name,
            receive_mobile:this.form.tel,
            receive_province:this.form.province,
            receive_city:this.form.city,
            receive_district:this.form.area,
            receive_address:this.form.addr,
        })
        if(res.code == 0){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.innerVisible = false;
          this.getDetail(this.order_no);
        }else{
          this.$message.error(res.message);
        }
    },
    onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.confirmInfo();
          } else {
            return false;
          }
        });
    }
  },
};
</script>

<style lang="scss" scoped>
.virForm .center{
    display: flex;
    justify-content: center;
    align-items: center;
}
.virForm .h4{
    // height: 40px;
    line-height: 40px;
    text-align: center;
}
.virForm .bg{
    background-color: #e5e5e5;
}
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
.virForm   .mb4{
    margin-bottom: 40px;
}
.virForm   .ml2{
    margin-left: 20px;
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