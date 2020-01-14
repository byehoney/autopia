<template>
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline mb2">
            <el-form-item label="订单号" class="mr2" label-width="120px">
                <el-input v-model="form.orderNum" placeholder="订单号"></el-input>
            </el-form-item>
            <el-form-item label="交易单号" class="mr2" label-width="120px">
                <el-input v-model="form.saleNum" placeholder="交易单号"></el-input>
            </el-form-item>
            <el-form-item label="订单类型" class="mr2" label-width="120px">
                <el-select v-model="form.orderType" placeholder="订单状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="普通订单" value="0"></el-option>
                    <el-option label="礼包订单" value="1"></el-option>
                    <!-- <el-option label="团购订单" value="2"></el-option> -->
                </el-select>
            </el-form-item>
            <el-form-item label="订单状态" class="mr2" label-width="120px">
                <el-select @change="selOrderType" v-model="form.orderStatus" placeholder="订单类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="待付款" value="0"></el-option>
                    <el-option label="待发货" value="10"></el-option>
                    <el-option label="待收货" value="20"></el-option>
                    <el-option label="已完成" value="30"></el-option>
                    <!-- <el-option label="部分退款" value="40"></el-option>
                    <el-option label="已退款" value="50"></el-option>
                    <el-option label="已取消" value="60"></el-option> -->
                    <el-option label="交易关闭" value="70"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户名" class="mr2" label-width="120px">
                <el-input v-model="form.nickname" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="用户手机号" class="mr2" label-width="120px">
                <el-input v-model="form.tel" placeholder="用户手机号"></el-input>
            </el-form-item>
            <el-form-item label="收货手机号" label-width="120px">
                <el-input v-model="form.receive_mobile" placeholder="收货手机号"></el-input>
            </el-form-item>
            <el-form-item label="下单时间" label-width="120px">
                <el-date-picker 
                    v-model="form.time" 
                    type="datetimerange" 
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="供应商" label-width="120px">
                <el-input v-model="form.spName" placeholder="供应商"></el-input>
            </el-form-item>
        </el-form>
        <el-row class="vFlex mb2">
            <el-button @click="doReset" class="mr2">重置</el-button>
            <el-button type="primary" @click="doSearch">查询</el-button>
        </el-row>
        <el-row class="mb2">
            <el-button type="primary" @click="doExport">导出</el-button>
        </el-row>
        <!-- 订单全部 -->
        <div v-cloak>
            <el-table
            v-if="actTab==''"
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="created_at"
                    label="下单时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="master_order_no"
                    label="交易单号"
                    >
                </el-table-column>
                <el-table-column
                    width="160px"
                    prop=""
                    label="订单编号"
                    >
                    <template slot-scope="scope">
                       <el-button type="text" @click="preOrder(scope.row.order_no)">{{scope.row.order_no}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="supplier_accout"
                    label="供应商"
                    >
                </el-table-column>
                <el-table-column
                    prop="order_type"
                    label="订单类型"
                    >

                </el-table-column>
                <el-table-column
                    prop="goods_type"
                    label="商品类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="quantity"
                    label="数量"
                    >
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号"
                    >
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="用户昵称"
                    >
                </el-table-column>
                <el-table-column
                    prop="price_type"
                    label="定价类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="pay_fee"
                    label="支付金额"
                    >
                </el-table-column>
                <el-table-column
                    prop="order_status"
                    label="订单状态"
                    >
                </el-table-column>
            </el-table>
        </div>
        <!-- 代付款 -->
        <div v-cloak>
            <el-table
            v-if="actTab==='0'"
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="created_at"
                    label="下单时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="master_order_no"
                    label="交易单号"
                    >
                </el-table-column>
                <el-table-column
                    width="160px"
                    prop="order_no"
                    label="订单编号"
                    >
                    <template slot-scope="scope">
                       <el-button type="text" @click="preOrder(scope.row.order_no)">{{scope.row.order_no}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="supplier_accout"
                    label="供应商"
                    >
                </el-table-column>
                <el-table-column
                    prop="order_type"
                    label="订单类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_type"
                    label="商品类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="quantity"
                    label="数量"
                    >
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号"
                    >
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="用户昵称"
                    >
                </el-table-column>
                <el-table-column
                    prop="price_type"
                    label="定价类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="pay_fee"
                    label="支付金额"
                    >
                </el-table-column>
                <el-table-column
                    prop="order_status"
                    label="订单状态"
                    >
                </el-table-column>
                <!-- <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                       <el-button type="text" @click="modiState(scope.row)">更改状态</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <!-- 待发货 -->
        <div v-cloak>
            <el-table
            v-if="actTab==10"
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="created_at"
                    label="下单时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="pay_at"
                    label="支付时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="master_order_no"
                    label="交易单号"
                    >
                </el-table-column>
                <el-table-column
                    width="160px"
                    prop="order_no"
                    label="订单编号"
                    >
                    <template slot-scope="scope">
                       <el-button type="text" @click="preOrder(scope.row.order_no)">{{scope.row.order_no}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="order_type"
                    label="订单类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_type"
                    label="商品类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="quantity"
                    label="数量"
                    >
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号"
                    >
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="用户昵称"
                    >
                </el-table-column>
                <el-table-column
                    prop="price_type"
                    label="定价类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="pay_fee"
                    label="支付金额"
                    >
                </el-table-column>
                <el-table-column
                    prop="order_status"
                    label="订单状态"
                    >
                </el-table-column>
                <!-- <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                       <el-button type="text" @click="modiState(scope.row)">更改状态</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <!-- 待收货 -->
        <div v-cloak>
            <el-table
            v-if="actTab==20"
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="created_at"
                    label="下单时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="delivery_at"
                    label="发货时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="master_order_no"
                    label="交易单号"
                    >
                </el-table-column>
                <el-table-column
                    prop="order_no"
                    width="160px"
                    label="订单编号"
                    >
                    <template slot-scope="scope">
                       <el-button type="text" @click="preOrder(scope.row.order_no)">{{scope.row.order_no}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="order_type"
                    label="订单类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_type"
                    label="商品类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="quantity"
                    label="数量"
                    >
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号"
                    >
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="用户昵称"
                    >
                </el-table-column>
                <el-table-column
                    prop="price_type"
                    label="定价类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="pay_fee"
                    label="支付金额"
                    >
                </el-table-column>
                <el-table-column
                    prop="order_status"
                    label="订单状态"
                    >
                </el-table-column>
                <!-- <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                       <el-button type="text" @click="modiState(scope.row)">更改状态</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <!-- 确认收货 -->
        <div v-cloak>
            <el-table
            v-if="actTab==30"
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="created_at"
                    label="下单时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="confirm_at"
                    label="确认收货时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="master_order_no"
                    label="交易单号"
                    >
                </el-table-column>
                <el-table-column
                    prop="order_no"
                    width="160px"
                    label="订单编号"
                    >
                    <template slot-scope="scope">
                       <el-button type="text" @click="preOrder(scope.row.order_no)">{{scope.row.order_no}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="order_type"
                    label="订单类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_type"
                    label="商品类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="quantity"
                    label="数量"
                    >
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号"
                    >
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="用户昵称"
                    >
                </el-table-column>
                <el-table-column
                    prop="price_type"
                    label="定价类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="pay_fee"
                    label="支付金额"
                    >
                </el-table-column>
                <el-table-column
                    prop="order_status"
                    label="订单状态"
                    >
                </el-table-column>
                <!-- <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                       <el-button type="text" @click="modiState(scope.row)">更改状态</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <!-- 订单 售后中 -->
        <div v-cloak>
            <el-table
            v-if="actTab==5"
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="date"
                    label="下单时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="发货时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="master_order_no"
                    label="交易单号"
                    >
                </el-table-column>
                <el-table-column
                    prop="订单编号"
                    width="160px"
                    label="订单编号"
                    >
                    <template slot-scope="scope">
                       <el-button type="text">{{scope.row.order_no}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="订单类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="商品类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="商品名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="数量"
                    >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="手机号"
                    >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="用户昵称"
                    >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="定价类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="支付金额"
                    >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="类型"
                    >
                </el-table-column>
                <!-- <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                       <el-button type="text">更改状态</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <!-- 交易关闭 -->
        <div v-cloak>
            <el-table
            v-if="actTab==70"
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="created_at"
                    label="下单时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="closed_at"
                    label="关闭时间"
                    >
                </el-table-column>
                <el-table-column
                    prop="master_order_no"
                    label="交易单号"
                    >
                </el-table-column>
                <el-table-column
                    width="160px"
                    prop="order_no"
                    label="订单编号"
                    >
                    <template slot-scope="scope">
                       <el-button type="text" @click="preOrder(scope.row.order_no)">{{scope.row.order_no}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="order_type"
                    label="订单类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_type"
                    label="商品类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="quantity"
                    label="数量"
                    >
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号"
                    >
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    label="用户昵称"
                    >
                </el-table-column>
                <el-table-column
                    prop="price_type"
                    label="定价类型"
                    >
                </el-table-column>
                <el-table-column
                    prop="pay_fee"
                    label="支付金额"
                    >
                </el-table-column>
                <el-table-column
                    prop="order_status"
                    label="类型"
                    >
                </el-table-column>
                <!-- <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                       <el-button type="text" @click="modiState(scope.row)">更改状态</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <el-dialog
            title="更改订单状态"
            :visible.sync="dialogVisible"
            width="30%"
            center
            >
            <el-row class="mb2">请选择变更后的订单状态：
                <el-select @change="selOrderTypeS" v-model="orderType" placeholder="订单类型">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="代付款" value="1"></el-option>
                    <el-option label="待发货" value="2"></el-option>
                    <el-option label="待收货" value="3"></el-option>
                    <el-option label="已完成" value="4"></el-option>
                    <el-option label="售后中" value="5"></el-option>
                    <el-option label="交易关闭" value="6"></el-option>
                </el-select>
            </el-row>
            <el-row>变更原因：<el-input style="width:300px" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  v-model="reason" minlength="1" maxlength="50" placeholder="最多可输入50个汉字"></el-input></el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确定更改</el-button>
            </span>
        </el-dialog>
        <el-pagination
            class="pubPagation"
            @current-change="handleCurrentChange"
            :current-page.sync="curPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <OrderDetail ref="orderDetail"></OrderDetail>
    </div>
</template>
<script>
import { baseUrl } from '../../config/env.js'
import { orderList,exportOrder,getToken } from '../../api/getData'
import OrderDetail from './components/OrderDetail'
export default {
    data(){
        return{
            actTab:'',
            curTab:'',
            tableData:[],
            curPage:1,
            page_size:10,
            total:0,
            dialogVisible:false,
            orderType:'0',
            reason:'',//变更原因
            form:{
                orderNum:'',
                saleNum:'',
                orderType:'0',
                orderStatus:'',
                nickname:'',
                tel:'',
                receive_mobile:'',
                time:'',
                spName:''
            }
        }
    },
    components:{
        OrderDetail
    },
    mounted(){
        this.baseUrl = baseUrl;
        this.form.time = [new Date(new Date(new Date().toLocaleDateString()).getTime()),new Date(new Date(this.formatTime()).getTime())];
        this.getData();
    },
    methods: {
        doSearch(){
            this.curPage = 1;
            this.actTab = this.curTab;
            this.getData();
        },
        doReset(){
            this.form = {
                orderNum:'',
                saleNum:'',
                orderType:'0',
                orderStatus:'',
                nickname:'',
                tel:'',
                receive_mobile:'',
                time:[new Date(new Date(new Date().toLocaleDateString()).getTime()),new Date(new Date(this.formatTime()).getTime())],
                spName:''
            }
            this.curPage = 1;
            this.getData();
        },
        async getData(){
            let res = await orderList({
                page:this.curPage,
                page_size:this.page_size,
                order_no:this.form.orderNum,
                master_order_no:this.form.saleNum,
                start:this.switchTimeFormat(this.form.time[0]),
                end:this.switchTimeFormat(this.form.time[1]),
                status:this.form.orderStatus,
                supplier_account:this.form.spName,
                mobile:this.form.tel,
                receive_mobile:this.form.receive_mobile,
                order_type:this.form.orderType,
                nickname:this.form.nickname,
            })
            if(res.code == 0){
                this.tableData = res.data.data;
                this.total = res.data.total;
            }else{
                this.$message.error(res.message);
            }
        },
        formatTime(){
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1<=9?'0'+(date.getMonth()+1):date.getMonth()+1;
            var day = date.getDate()<=9?'0'+date.getDate():date.getDate();
            var hour = date.getHours()<=9?'0'+date.getHours():date.getHours();
            var minute = date.getMinutes()<=9?'0'+date.getMinutes():date.getMinutes();
            return year+ '-'+ month + '-' + day + ' ' + hour + ':' + minute 
        },
        switchTimeFormat (time) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getMonth()+1<=9?'0'+(date.getMonth()+1):date.getMonth()+1;
            var day = date.getDate()<=9?'0'+date.getDate():date.getDate();
            var hour = date.getHours()<=9?'0'+date.getHours():date.getHours();
            var minute = date.getMinutes()<=9?'0'+date.getMinutes():date.getMinutes();
            return year+ '-'+ month + '-' + day + ' ' + hour + ':' + minute 
        },
        selOrderType(value){
            
            this.curTab = value;
            // this.actTab = value;
        },
        selOrderTypeS(value){

        },
        handleCurrentChange(curPage){
            this.curPage = curPage;
            this.getData();
        },
        preOrder(order_no){
            this.$refs.orderDetail.showDetail(order_no);
        },
        async doExport(){
            let res = await getToken();
            window.open(this.baseUrl+'/admin/order/export?token='+res.data.token+'&page='+this.curPage+'&page_size='+this.page_size+'&order_no='+this.form.orderNum+'&master_order_no='+this.form.saleNum+'&start='+this.switchTimeFormat(this.form.time[0])+'&end='+this.switchTimeFormat(this.form.time[1])+'&status='+this.form.orderStatus+'&supplier_account='+this.form.spName+'&mobile='+this.form.tel+'&receive_mobile='+this.form.receive_mobile+'&order_type='+this.form.orderType+'&nickname='+this.form.nickname)
            // let respon = await exportOrder({token:res.data.token});
        }
    },
}
</script>
<style lang="scss" scoped>
    .mb2{
        margin-bottom: 20px;
    }
    .mr2{
        margin-right:20px;
    }
    .vFlex{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .pubPagation{
        margin-top: 20px;
        float: right;
    }
</style>