<!--<template>
    <div>
        <el-dialog
            title="订单详情"
            :visible.sync="dialogVisible"
            width="60%"
            >
            <el-row>
                <el-col  class="bg-purple-dark" :span="5">订单号</el-col>
                <el-col  class="bg-purple-dark" :span="5">交易单号</el-col>
                <el-col  class="bg-purple-dark" :span="4">订单状态</el-col>
                <el-col  class="bg-purple-dark" :span="5">购买人手机</el-col>
                <el-col  class="bg-purple-dark" :span="5">购买人昵称</el-col>
            </el-row>
            <el-row>
                <el-col class="bg-purple" :span="5">23123</el-col>
                <el-col class="bg-purple" :span="5">23123123</el-col>
                <el-col class="bg-purple" :span="4">2312312</el-col>
                <el-col class="bg-purple" :span="5">312312</el-col>
                <el-col class="bg-purple" :span="5">3213123</el-col>
            </el-row>
            <el-row>
                <el-col class="bg-purple-dark" :span="5">创建时间</el-col>
                <el-col class="bg-purple-dark" :span="5">支付时间</el-col>
                <el-col class="bg-purple-dark" :span="4">发货时间</el-col>
                <el-col class="bg-purple-dark" :span="5">确认收货时间</el-col>
                <el-col class="bg-purple-dark" :span="5">关闭时间</el-col>
            </el-row>
            <el-row class="mb2">
                <el-col class="bg-purple" :span="5">23123</el-col>
                <el-col class="bg-purple" :span="5">23123123</el-col>
                <el-col class="bg-purple" :span="4">2312312</el-col>
                <el-col class="bg-purple" :span="5">312312</el-col>
                <el-col class="bg-purple" :span="5">3213123</el-col>
            </el-row>
            <el-row>
                <el-col :span="6" v-for="(o, index) in 4" :key="o" :offset="index%3==0 ? 0 : 1" class="mb2">
                    <el-card :body-style="{ padding: '0px' }">
                    <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
                    <div style="padding: 14px;">
                        <span>好吃的汉堡</span>
                        <div class="bottom clearfix">
                            <time class="time">购买数量：1 </time>
                            <time class="time">定价类型：</time>
                        </div>
                        <div class="bottom clearfix">
                            <time class="time">型号： </time>
                            <time class="time">单价： </time>
                            <time class="time">合计： </time>
                        </div>
                        <div class="bottom clearfix">
                            <time class="time">供应商： </time>
                        </div>
                    </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row class="mb2">
                <el-col  class="bg-purple-dark" :span="6">使用优惠券</el-col>
                <el-col  class="bg-purple-dark" :span="6">商品实付</el-col>
                <el-col  class="bg-purple-dark" :span="6">运费</el-col>
                <el-col  class="bg-purple-dark" :span="6">订单实付</el-col>
                <el-col  class="bg-purple" :span="6">订单号</el-col>
                <el-col  class="bg-purple" :span="6">交易单号</el-col>
                <el-col  class="bg-purple" :span="6">订单状态</el-col>
                <el-col  class="bg-purple" style="color:#e4393c" :span="6">购买人手机</el-col>
            </el-row>
            <el-row class="mb2">
                <el-col  style="padding:10px;font-weight:bold;font-size:16px;background-color:#f5f5f5;text-align:center" :span="24">支付信息</el-col>
                <el-col  class="bg-purple-dark" :span="6">支付渠道</el-col>
                <el-col  class="bg-purple-dark" :span="12">支付渠道交易号</el-col>
                <el-col  class="bg-purple-dark" :span="6">支付时间</el-col>
                <el-col  class="bg-purple" :span="6">订单号</el-col>
                <el-col  class="bg-purple" :span="12">交易单号</el-col>
                <el-col  class="bg-purple" :span="6">订单状态</el-col>
            </el-row>
            <el-row class="mb2">
                <el-col  style="padding:10px;font-weight:bold;font-size:16px;background-color:#f5f5f5;text-align:center" :span="24">
                    <span style="margin-right:20px">收货信息</span>  
                    <el-button type="text" @click="modiUserInfo">修改收货信息</el-button>  
                </el-col>
                <el-col  class="bg-purple-dark" :span="5">收件人</el-col>
                <el-col  class="bg-purple-dark" :span="5">联系电话</el-col>
                <el-col  class="bg-purple-dark" :span="14">通信地址</el-col>
                <el-col  class="bg-purple" :span="5">订单号</el-col>
                <el-col  class="bg-purple" :span="5">交易单号</el-col>
                <el-col  class="bg-purple" :span="14">订单状态</el-col>
            </el-row>
            <el-row>
                <el-col  style="padding:10px;font-weight:bold;font-size:16px;background-color:#f5f5f5;text-align:center" :span="24">备注信息</el-col>
                <el-col  class="bg-purple" :span="24">订单状态</el-col>
            </el-row>
            <el-row class="mb2">
                <el-col  style="padding:10px;font-weight:bold;font-size:16px;background-color:#f5f5f5;text-align:center" :span="24">物流信息</el-col>
                <el-col  class="bg-purple-dark" :span="6">快递公司</el-col>
                <el-col  class="bg-purple-dark" :span="12">运单号</el-col>
                <el-col  class="bg-purple-dark" :span="6">发货时间</el-col>
                <el-col  class="bg-purple" :span="6">订单号</el-col>
                <el-col  class="bg-purple" :span="12">
                    <span style="margin-right:20px">运单号</span>  
                    <el-button style="padding:0" type="text" v-clipboard:copy="2845737948924" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button> 
                </el-col>
                <el-col  class="bg-purple" :span="6">订单状态</el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">返 回</el-button>
            </span>
            <el-dialog
                title="收件信息"
                :visible.sync="dialogVisibleS"
                width="30%"
                append-to-body
                >
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="收件人：">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话：">
                        <el-input v-model="form.tel"></el-input>
                    </el-form-item>
                    <el-form-item label="通信地址：">
                        <el-input v-model="form.addr"></el-input>
                    </el-form-item>
                    <el-row class="mt2 center">
                        <el-button  type="primary" @click="onSubmit">保存收货信息</el-button>
                    </el-row>
                </el-form>
            </el-dialog>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dialogVisible:false,
            dialogVisibleS:false,
            form:{
                name:'',
                tel:'',
                addr:''
            }
        }
    },
    methods: {
        modiUserInfo(){
            this.dialogVisibleS = true;
        },
        onSubmit(){

        },
         // 复制成功时的回调函数
        onCopy (e) {
            this.$message.success("内容已复制到剪切板！")
        },
        // 复制失败时的回调函数
        onError (e) {
            this.$message.error("抱歉，复制失败！")
        }
    },
}
</script>
<style lang="scss" scoped>
    .mb2{
        margin-bottom: 20px;
    }
    .dialog-footer{
        display: flex;
        justify-content: center;
    }
    .bg-purple-dark {
        background: #99a9bf;
        padding: 10px 0;
        text-align: center;
    }
    .bg-purple {
        background: #d3dce6;
        padding: 10px 0;
        text-align: center;
    }
    .time {
        font-size: 13px;
        color: #999;
    }
    
    .bottom {
        margin-top: 13px;
        line-height: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }


    .image {
        width: 200px;
        height: 200px;
        margin: 0 auto;
        display: block;
        object-fit: contain;
    }
    .center{
        display: flex;
        justify-content: center;
    }
</style>
-->

<template>
    <div>
        <el-dialog
            title="订单详情"
            :visible.sync="dialogVisible"
            width="80%"
            >
            <el-row>
                <el-col :span="6">订单号：{{order_no}}</el-col>
                <el-col :span="6">交易单号：{{out_trade_no}}</el-col>
                <el-col :span="4">订单状态：{{status_str}}</el-col>
                <el-col :span="8" style="color:#e4393c;font-weight:bold">供应商：{{supplier_name}}</el-col>
            </el-row>
            <el-row class="mt2">
                <el-col :span="5" class="pd2 bg-purple">创建时间</el-col>
                <el-col :span="5" class="pd2 bg-purple">支付时间</el-col>
                <el-col :span="5" class="pd2 bg-purple">发货时间</el-col>
                <el-col :span="5" class="pd2 bg-purple">确认收货时间</el-col>
                <el-col :span="4" class="pd2 bg-purple">关闭时间</el-col>
                <el-col :span="5" class="pd2 bg-purple-light">{{created_at}}</el-col>
                <el-col :span="5" class="pd2 bg-purple-light">{{pay_at}}</el-col>
                <el-col :span="5" class="pd2 bg-purple-light">{{delivery_at}}</el-col>
                <el-col :span="5" class="pd2 bg-purple-light">{{confirm_at}}</el-col>
                <el-col :span="4" class="pd2 bg-purple-light">{{closed_at}}</el-col>
            </el-row>
            <el-row class="mt2 mb2">
                <el-col :span="12" class="pd2 bg-purple">购买人手机：{{receive_mobile}}</el-col>
                <el-col :span="12" class="pd2 bg-purple">购买人昵称：{{receive_name}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="8" v-for="(o, index) in order_goods" :key="index" :offset="index%2==0 ? 0 : 1" class="mb2">
                    <el-card :body-style="{ padding: '0px' }">
                    <img :src="o.pic_cover_small" class="image">
                    <div style="padding: 14px;">
                        <span>{{o.goods_name}}</span>
                        <div class="bottom clearfix">
                            <time class="time">购买数量：{{o.quantity}} </time>
                            <time class="time">定价类型：{{o.price_type}}</time>
                        </div>
                        <div class="bottom clearfix">
                            <time class="time">规格：{{o.sku_name}}</time>
                            <time class="time">单价：{{o.pay_fee}} 元</time>
                        </div>
                        <div class="bottom clearfix">
                            <time class="time">合计：{{o.total_fee}} 元</time>
                            <!-- <time class="time">结算总价： {{o.total_settlement_prices}}</time> -->
                        </div>
                        <!-- <div class="bottom clearfix">
                            <time class="time">供应商： </time>
                        </div> -->
                    </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row class="mt2">
                <el-col :span="8" class="pd2 bg-purple">商品实付</el-col>
                <el-col :span="8" class="pd2 bg-purple">运费</el-col>
                <el-col :span="8" class="pd2 bg-purple">订单实付</el-col>
                <el-col :span="8" class="pd2 bg-purple-light">{{goods_fee}} 元</el-col>
                <el-col :span="8" class="pd2 bg-purple-light">{{express_fee}} 元</el-col>
                <el-col :span="8" class="pd2 bg-purple-light">{{pay_fee}} 元</el-col>
            </el-row>
            <el-row class="title mt2">支付信息</el-row>
            <el-row class="mt2">
                <el-col :span="6" class="pd2 bg-purple">支付渠道</el-col>
                <el-col :span="12" class="pd2 bg-purple">支付渠道交易号</el-col>
                <el-col :span="6" class="pd2 bg-purple">支付时间</el-col>
                <el-col :span="6" class="pd2 bg-purple-light">{{pay_channel}}</el-col>
                <el-col :span="12" class="pd2 bg-purple-light">{{transaction_id}}</el-col>
                <el-col :span="6" class="pd2 bg-purple-light">{{pay_at}}</el-col>
            </el-row>
            <el-row class="mt2 hFlex">
                <el-col :span="12" class="title">收货信息</el-col>
                <el-col :span="12" v-if="status==10">
                    <el-button type="primary" @click="modiAddr">修改收货信息</el-button>
                </el-col>
            </el-row>
            <el-row class="mt2">
                <el-col :span="4" class="pd2 bg-purple">收件人</el-col>
                <el-col :span="4" class="pd2 bg-purple">联系电话</el-col>
                <el-col :span="16" class="pd2 bg-purple">通信地址</el-col>
                <el-col :span="4" class="pd2 bg-purple-light">{{receive_name}}</el-col>
                <el-col :span="4" class="pd2 bg-purple-light">{{receive_mobile}}</el-col>
                <el-col :span="16" class="pd2 bg-purple-light">{{receive_province}}{{receive_city}}{{receive_district}}{{receive_addr}}</el-col>
            </el-row>
            <el-row class="title mt2">备注信息</el-row>
            <el-row class="mt2">{{remark}}</el-row>
            <el-row class="title mt2">物流信息</el-row>
            <el-row class="mt2">
                <el-col :span="6" class="pd2 bg-purple">快递公司</el-col>
                <el-col :span="6" class="pd2 bg-purple">运单号</el-col>
                <el-col :span="12" class="pd2 bg-purple">发货时间</el-col>
                <el-col :span="6" class="pd2 bg-purple-light">{{express_company}}</el-col>
                <el-col :span="6" class="pd8 bg-purple-light">{{express_no}} <el-button  class="ml2" type="text" v-clipboard:copy="express_no=='——'?'':express_no" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button></el-col>
                <el-col :span="12" class="pd2 bg-purple-light">{{express_updated_at}}</el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doClose">返回</el-button>
            </span>
            <el-dialog
                title="收件信息"
                :visible.sync="dialogVisibleS"
                width="30%"
                append-to-body
                >
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="收件人：">
                        <el-input v-model="form.name" placeholder="收件人"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话：">
                        <el-input v-model="form.tel" placeholder="联系电话"></el-input>
                    </el-form-item>
                    <el-form-item label="省市区">
                        <div>{{receive_province}}{{receive_city}}{{receive_district}}</div>
                        <el-cascader
                            :props="{value:'label',label:'label'}"
                            :options="options"
                            v-model="form.area"
                            @change="handleChange" 
                            class="wd400">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址：">
                        <el-input v-model="form.addr" placeholder="详细地址"></el-input>
                    </el-form-item>
                    <el-row class="mt2 center">
                        <el-button  type="primary" @click="onSubmit">保存收货信息</el-button>
                    </el-row>
                </el-form>
            </el-dialog>
        </el-dialog>
    </div>
</template>
<script>
import areaJson from '../../../utils/uCity.json';
import { orderDetail,modiAddr } from '../../../api/getData'
export default {
    data(){
        return{
            dialogVisible:false,
            dialogVisibleS:false,
            order_no:'',
            out_trade_no:'',
            status_str:'',
            created_at:'',
            pay_at:'',
            confirm_at:'',
            updated_at:'',
            delivery_at:'',
            closed_at:'',
            order_goods:[],
            receive_mobile:'',
            receive_name:'',
            receive_addr:'',
            remark:'',
            express_company:'',
            express_no:'',
            express_updated_at:'',
            express_fee:'',
            cur_addr_id:'',
            cur_order_id:'',
            cur_order_no:'',
            status:'',
            total_settlement_prices:'',
            pay_fee:0,
            express_fee:0,
            goods_fee:0,
            pay_channel:'',
            transaction_id:'',
            supplier_name:'',
            options:[],
            receive_province:'',
            receive_city:'',
            receive_district:'',
            c_receive_province:'',
            c_receive_city:'',
            c_receive_district:'',
            form:{
                name:'',
                tel:'',
                area:[],
                addr:''
            }
        }
    },
    mounted(){
        this.options = areaJson.data;
        
    },
    methods:{
        handleChange(val){
            
            this.c_receive_province = val[0],
            this.c_receive_city = val[1],
            this.c_receive_district = val[2]
        },
        showDetail(order_no){
            this.dialogVisible = true;
            this.cur_order_no = order_no;
            this.orderInfo(order_no);
        },
        async orderInfo(order_no){
            let res = await orderDetail({order_no});
            if(res.code == 0){
                this.order_no = res.data.order_no;
                this.out_trade_no = res.data.master_order_no;
                this.status_str = res.data.status_str;
                this.created_at = res.data.created_at?res.data.created_at:'——';
                this.pay_at = res.data.pay_at?res.data.pay_at:'——';
                this.confirm_at = res.data.confirm_at?res.data.confirm_at:'——';
                this.updated_at = res.data.updated_at?res.data.updated_at:'——';
                this.delivery_at = res.data.delivery_at?res.data.delivery_at:'——';
                this.closed_at = res.data.closed_at?res.data.closed_at:'——';
                this.order_goods = res.data.order_goods;
                this.receive_mobile = res.data.order_addr.receive_mobile;
                this.receive_name = res.data.order_addr.receive_name;
                this.receive_addr = res.data.order_addr.receive_address;
                this.remark = res.data.remark?res.data.remark:'没有备注信息';
                this.express_company = res.data.order_package&&res.data.order_package.express_company?res.data.order_package.express_company:'——';
                this.express_no = res.data.order_package?res.data.order_package.express_no:'——';
                this.express_updated_at = res.data.delivery_at?res.data.delivery_at:'——';
                this.express_fee = res.data.express_fee;
                this.goods_fee = res.data.goods_fee;
                this.pay_fee = res.data.pay_fee;
                this.cur_addr_id = res.data.order_addr.id;
                this.cur_order_id = res.data.id;
                this.status = res.data.status;
                this.supplier_name = res.data.supplier_name;
                this.pay_channel = res.data.pay_channel?res.data.pay_channel:'——';
                this.transaction_id = res.data.transaction_id?res.data.transaction_id:'——';
                this.c_receive_province = res.data.order_addr.receive_province;
                this.c_receive_city = res.data.order_addr.receive_city;
                this.c_receive_district = res.data.order_addr.receive_district;
                this.receive_province = res.data.order_addr.receive_province;
                this.receive_city = res.data.order_addr.receive_city;
                this.receive_district = res.data.order_addr.receive_district;
            }else{
                this.$message.error(res.message);
            }
        },
        modiAddr(){
            this.dialogVisibleS = true;
            this.form.name = this.receive_name;
            this.form.tel = this.receive_mobile;
            this.form.addr = this.receive_addr;
            this.form.area = [this.c_receive_province,this.c_receive_city,this.c_receive_district];
            
        },
        async onSubmit(){
            let reg = /^[1]([3-9])[0-9]{9}$/;
            if(!this.form.name){
                this.$message.error("请输入收货人姓名");
                return;
            }else if(!this.form.tel){
                this.$message.error("请输入收货人联系方式");
                return;
            }else if(!reg.test(this.form.tel)){
                this.$message.error("请输入正确的联系方式");
                return;
            }else if(!this.form.addr){
                this.$message.error("请输入详细收货地址");
                return;
            }else{
                let res = await modiAddr({
                    order_id:this.cur_order_id,
                    receive_name:this.form.name,
                    receive_mobile:this.form.tel,
                    receive_province:this.c_receive_province,
                    receive_city:this.c_receive_city,
                    receive_district:this.c_receive_district,
                    receive_address:this.form.addr
                })
                if(res.code == 0){
                    this.$message.success("操作成功");
                    this.dialogVisibleS = false;
                    this.orderInfo(this.cur_order_no);
                }else{
                    this.$message.error(res.message)
                }
            }
        },
        doClose(){
            this.dialogVisible = false;
            this.$parent.getData();
        },
        // 复制成功时的回调函数
        onCopy (e) {
            this.$message.success("内容已复制到剪切板！")
        },
        // 复制失败时的回调函数
        onError (e) {
            this.$message.error("抱歉，复制失败！")
        }
    }
}
</script>
<style lang="scss" scoped>
    .mb2{
        margin-bottom: 20px;
    }
    .mt2{
        margin-top: 20px;
    }
    .ml2{
        margin-left: 20px;
    }
    .pd2{
        padding:20px 0;
    }
    .pd8{
        padding:10px 0;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .fl{
        float: left;
    }
    .fr{
        float:right;
    }
    .imgBox,.imgBox img{
        width: 150px;
        height: 150px;
    }
    .hFlex{
        display: flex;
        align-items: center;
    }
    .mr2{
        margin-right: 20px;
    }
    .title{
        font-size: 14px;
        font-weight: bold;
    }
    .center{
        display: flex;
        align-items: center;
        justify-content: center;
    }
     .time {
        font-size: 13px;
        color: #999;
    }
    
    .bottom {
        margin-top: 13px;
        line-height: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    // .button {
    //     padding: 0;
    //     float: right;
    // }

    .image {
        width: 200px;
        height: 200px;
        margin: 0 auto;
        display: block;
        object-fit: contain;
    }
</style>