<template>
    <div class="content">
       <el-row class="center mb2">
            <el-date-picker
                class="mr2"
                value-format="yyyy-MM-dd"
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <el-select class="mr2" v-model="orderStatus" placeholder="订单状态">
                <el-option label="待发货" value="10"></el-option>
                <el-option label="待收货" value="20"></el-option>
                <el-option label="已完成" value="30"></el-option>
                <el-option label="退款完成" value="40"></el-option>
                <el-option label="部分退款" value="50"></el-option>
            </el-select>
            <el-select class="mr2" v-model="orderType" placeholder="订单类型">
                <el-option label="普通" value="0"></el-option>
                <el-option label="团购" value="1"></el-option>
            </el-select>
            <el-input  class="input mr2" v-model="orderNum" placeholder="请输入订单号"></el-input>
            <el-button type="primary" @click="doSearch">查询</el-button>
       </el-row>
       <el-row class="mb2">共有数据： {{total}} 条</el-row>
       <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            prop="created_at"
            label="下单时间"
            >
            </el-table-column>
            <el-table-column
            prop="order_no"
            label="订单编号"
            >
            </el-table-column>
            <el-table-column
            prop="goods_name"
            label="商品"
            >
            </el-table-column>
            <el-table-column
            prop="city"
            label="类型"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.order_type ==0">普通</span>
                    <span v-else>团购</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="quantity"
            label="数量"
            >
            </el-table-column>
            <el-table-column
            prop="nickname"
            label="购买人"
            >
            </el-table-column>
            <el-table-column
            label="定价类型"
            >   
                <template slot-scope="scope">
                    <span v-if="scope.row.buy_type ==1">vip 价格</span>
                    <span v-else-if="scope.row.buy_type ==2">会员价</span>
                    <span v-else-if="scope.row.buy_type ==3">团购价</span>
                </template>  
            </el-table-column>
            <el-table-column
            prop="pay_fee"
            label="订单金额"
            >
            </el-table-column>
            <el-table-column
            prop="order_status"
            label="订单状态"
            >
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            >
            <template slot-scope="scope">
                <el-button @click="upDateOrderState(scope.row)" v-if="scope.row.status==10||scope.row.status==20" type="text" size="small">更改状态</el-button>
                <el-button v-else-if="scope.row.status==30" type="text" size="small">已完成</el-button>
                <el-button v-else-if="scope.row.status==40" type="text" size="small">退款完成</el-button>
                <el-button v-else-if="scope.row.status==50" type="text" size="small">部分退款</el-button>
                <el-button @click="checkOrderDetail(scope.row)"  type="text" size="small">查看</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pubPagation"
            @current-change="handleCurrentChange"
            :current-page.sync="curPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-dialog
            title="更改状态"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="订单号：">
                    <el-input disabled v-model="form.orderNum"></el-input>
                </el-form-item>
                <el-form-item label="当前状态：">
                    <el-input disabled v-model="form.orderStatus"></el-input>
                </el-form-item>
                <el-form-item label="变更后状态：">
                    <el-select v-model="form.upDateStatus" placeholder="请选择">
                        <el-option v-for="(item,index) in stateOptions" :key="index" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.upDateStatus==20&&form.orderStatus=='待发货'" label="快递公司：">
                    <el-input v-model="form.company"></el-input>
                </el-form-item>
                <el-form-item v-if="form.upDateStatus==20&&form.orderStatus=='待发货'" label="物流单号：">
                    <el-input v-model="form.orderId"></el-input>
                </el-form-item>
                <el-form-item label="变更原因：">
                    <el-input v-model="form.reason"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <OrderDetailForm ref="orderDetailForm"></OrderDetailForm>
    </div>
</template>
<script>
import OrderDetailForm from '../../../components/orderDetailForm.vue'
import { marketOrderList ,orderStateInfo,upDateOrderState} from '../../../api/getData.js'
export default {
  name: "orderLsit",
  data(){
    return{
        page_size:10,
        total:0,
        curPage:1,
        centerDialogVisible:false,
        date:'',
        options: [],
        orderStatus:'',
        orderType:'',
        orderNum:'',
        tableData:[],
        stateOptions:[],
        curOrderId:'',
        form:{
            orderNum:'',
            orderStatus:'',
            upDateStatus:'',
            company:'',
            orderId:'',
            reason:''
        }
    }
  },
  components: {
    OrderDetailForm
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){
        let res = await marketOrderList({
            page_size:this.page_size,
            page:this.curPage,
            order_no:this.orderNum,
            start:this.date.length?this.date[0]:'',
            end:this.date.length?this.date[1]:'',
            order_type:this.orderType,
            status:this.orderStatus
        })
        if(res.code == 0){
            this.tableData = res.data.data;
            this.total = res.data.total;
        }
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getData();
    },
    doSearch(){
        this.curPage = 1;
        this.getData();
    },
    async upDateOrderState(row){
        this.centerDialogVisible = true;
        this.curOrderId = row.id;
        this.form.upDateStatus = '';
        this.form.company = '';
        this.form.orderId = '';
        this.form.reason = '';
        let res = await orderStateInfo({order_id:row.id});
        if(res.code == 0){
            this.stateOptions = res.data.status_list;
            this.form = {
                orderNum:res.data.order_info.order_no,
                orderStatus:res.data.order_info.status_str,
                upDateStatus:'',
                company:'',
                orderId:'',
                reason:''
            }
        }else{
            this.$message.error(res.message);
        }
    },
    async onSubmit(){
        if(!this.form.upDateStatus){
            this.$message({
                showClose: true,
                message: '请选择更改订单状态',
                type: 'warning'
            });
            return;
        }else if(this.form.orderStatus=='待发货'&&!this.form.company){
            this.$message({
                showClose: true,
                message: '请输入物流公司名称',
                type: 'warning'
            });
            return;
        }else if(this.form.orderStatus=='待发货'&&!this.form.orderId){
            this.$message({
                showClose: true,
                message: '请输入物流单号',
                type: 'warning'
            });
            return;
        }else{
            let res = await upDateOrderState({
                order_id:this.curOrderId,
                status:this.form.upDateStatus,
                express_company:this.form.company,
                express_no:this.form.orderId,
                remark:this.form.reason
            })
            if(res.code==0){
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
                this.centerDialogVisible = false;
                this.getData();
            }else{
                this.$message.error(res.message);
            }
        }
    },
    checkOrderDetail(row){
        this.$refs.orderDetailForm.showDialogForm(row);
    }
  },
};
</script>

<style lang="scss" scoped>
    .content  .pubPagation{
        margin-top: 20px;
        float: right;
    }
    .center{
        display: flex;
        align-items: center;
    }
    .input{
        width: 200px;
    }
    .mr2{
        margin-right: 20px;
    }
    .mb2{
        margin-bottom: 20px;
    }
</style>
