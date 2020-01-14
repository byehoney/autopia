<template>
    <div class="content">
        <div class="search">
            <h3>查询</h3>
            <div class="searchItem hFlex">
                <div class="columnHd">
                    <span>订单号</span>
                    <el-input class="title" v-model="orderNum" placeholder="订单号"></el-input>
                </div>
                <div class="columnHd">
                    <span>审核日期</span>
                    <el-date-picker 
                      v-model="time" 
                      type="datetimerange" 
                      value-format="yyyy-MM-dd HH:mm:ss"
                      range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                    </el-date-picker>
                </div>
                <div class="columnHd">
                    <span>用户手机号</span>
                    <el-input :minlength="11" :maxlength="11" class="title" v-model="mobile" placeholder="用户手机号"></el-input>
                </div>
            </div>
        </div>
        <div class="search_auth mt5">
            <div class="searchItem">
                <el-button @click="doReset">重置</el-button>
                <el-button @click="doSearch" type="primary">查询</el-button>
            </div>                                                                                                                                                                                      
        </div>
        <el-row >
            <el-col :span="24" class="top lr">
                <el-button-group>
                    <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">全部订单</el-button>
                    <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">待发货</el-button>
                    <el-button type="groupBtn" :class="['groupBtn',actTab==2?'active':'']" plain @click="changeType(2)">已发货</el-button>
                    <el-button type="groupBtn" :class="['groupBtn',actTab==3?'active':'']" plain @click="changeType(3)">已完成</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <div v-cloak>
          <el-table
            class="mt5"
            v-if="actTab==0"
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="created_at"
              label="下单时间"
            >
            </el-table-column>
            <el-table-column
              width="160px"
              label="订单编号"
            >
              <template slot-scope="scope">
                <el-button class="sel" @click="preOrder(scope.row.order_no)" type="text">{{scope.row.order_no}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="goods_name"
              label="商品名称"
            >
            </el-table-column>
            <el-table-column
              prop="sku_name"
              label="规格"
            >
            </el-table-column>
            <el-table-column
              label="商品类型"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type==0">实物</span>
                <span v-if="scope.row.type==1">虚拟</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="数量"
            >
            </el-table-column>
            <el-table-column
              prop="receive_mobile"
              label="购买人"
            >
            </el-table-column>
            <el-table-column
              prop="receive_address"
              label="收货地址"
            >
            </el-table-column>
            <el-table-column
              prop="settlement_price"
              label="结算价"
            >
            </el-table-column>
            <el-table-column
              prop="order_status"
              label="订单状态"
            >
            </el-table-column>
          </el-table>
        </div>
        <div v-cloak>
          <el-table
            class="mt5"
            v-if="actTab==1"
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="created_at"
              label="下单时间"
            >
            </el-table-column>
            <el-table-column
              width="160px"
              label="订单编号"
            >
              <template slot-scope="scope">
                <el-button @click="preOrder(scope.row.order_no)" class="sel" type="text">{{scope.row.order_no}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="goods_name"
              label="商品名称"
            >
            </el-table-column>
            <el-table-column
              prop="sku_name"
              label="规格"
            >
            </el-table-column>
            <el-table-column
              label="商品类型"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type==0">实物</span>
                <span v-if="scope.row.type==1">虚拟</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="数量"
            >
            </el-table-column>
            <el-table-column
              prop="receive_mobile"
              label="购买人"
            >
            </el-table-column>
            <el-table-column
              prop="receive_address"
              label="收货地址"
            >
            </el-table-column>
            <el-table-column
              prop="settlement_price"
              label="结算价"
            >
            </el-table-column>
            <el-table-column
              prop="order_status"
              label="订单状态"
            >
            </el-table-column>
            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="opSend(scope.row.id,scope.row.type)">发货</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-cloak>
          <el-table
            class="mt5"
            v-if="actTab==2"
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
              width="160px"
              label="订单编号"
            >
              <template slot-scope="scope">
                <el-button @click="preOrder(scope.row.order_no)" class="sel" type="text">{{scope.row.order_no}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="goods_name"
              label="商品名称"
            >
            </el-table-column>
            <el-table-column
              prop="sku_name"
              label="规格"
            >
            </el-table-column>
            <el-table-column
              label="商品类型"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type==0">实物</span>
                <span v-if="scope.row.type==1">虚拟</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="数量"
            >
            </el-table-column>
            <el-table-column
              prop="receive_mobile"
              label="购买人"
            >
            </el-table-column>
            <el-table-column
              prop="receive_address"
              label="收货地址"
            >
            </el-table-column>
            <el-table-column
              prop="settlement_price"
              label="结算价"
            >
            </el-table-column>
            <el-table-column
              prop="order_status"
              label="订单状态"
            >
            </el-table-column>
          </el-table>
        </div>
        <div v-cloak>
          <el-table
            class="mt5"
            v-if="actTab==3"
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
              width="160px"
              label="订单编号"
            >
              <template slot-scope="scope">
                <el-button @click="preOrder(scope.row.order_no)" class="sel" type="text">{{scope.row.order_no}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="goods_name"
              label="商品名称"
            >
            </el-table-column>
            <el-table-column
              prop="sku_name"
              label="规格"
            >
            </el-table-column>
            <el-table-column
              label="商品类型"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type==0">实物</span>
                <span v-if="scope.row.type==1">虚拟</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="数量"
            >
            </el-table-column>
            <el-table-column
              prop="receive_mobile"
              label="购买人"
            >
            </el-table-column>
            <el-table-column
              prop="receive_address"
              label="收货地址"
            >
            </el-table-column>
            <el-table-column
              prop="settlement_price"
              label="结算价"
            >
            </el-table-column>
            <el-table-column
              prop="order_status"
              label="订单状态"
            >
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
            class="pubPagation"
            @current-change="handleCurrentChange"
            :current-page.sync="curPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="快递公司：" v-if="!isVir">
                    <el-select v-model="form.company" placeholder="请选择快递公司">
                        <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item"
                            :value="item"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递单号：" v-if="!isVir">
                    <el-input style="width:300px" v-model="form.nums" :maxlength="50" placeholder="请输入快递单号"></el-input>
                </el-form-item>
                <el-form-item label="发货内容：" v-if="isVir">
                    <el-input style="width:300px" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" maxlength="500" v-model="form.desc" placeholder="请输入发货内容"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doSend">确认发货</el-button>
            </span>
        </el-dialog>
        <OrderDetail ref="orderDetail"></OrderDetail>
    </div>
</template>
<script>
import { orderList,addPackage } from '../../api/getData'
import OrderDetail from './components/OrderDetail'
export default {
    data(){
        return {
            actTab:0,
            status:'',
            orderNum:'',
            mobile:'',
            curPage:1,
            page_size:10,
            total:0,
            time:'',
            dialogVisible:false,
            tableData:[],
            options:[
              '顺丰速运',
              '中通快递',
              '圆通速递',
              '申通快递',
              '邮政快递包裹',
              '韵达快递',
              '百世快递',
              '天天快递',
              '国通快递',
              '京东物流',
              '德邦物流'
            ],
            isVir:false,//是否是虚拟物品发货
            curId:'',//当前订单id
            title:'',
            form:{
              company:'顺丰速运',
              nums:'',
              des:''
            }
        }
    },
    components:{
      OrderDetail,
    },
    mounted(){
      this.getData();
    },
    methods:{
        handleCurrentChange(curPage){
            this.curPage = curPage;
            this.getData();
        },
        changeType(index){
            this.actTab = index;
            switch(index){
            case 0:
              this.status = '';
              break;
            case 1:
              this.status = 10;
              break;
            case 2:
              this.status = 20
              break;
            case 3:
              this.status = 30
              break;
            default:
              this.status = '';
              break;
            }
            this.curPage = 1;
            this.getData();
        },
        doReset(){
            this.orderNum = '';
            this.mobile = '';
            this.time = '';
            this.curPage = 1;
            this.getData();
        },
        doSearch(){
            this.curPage = 1;
            this.getData();
        },
        async getData(){
          let res = await orderList({
            page:this.curPage,
            page_size:this.page_size,
            order_no:this.orderNum,
            start_time:this.time[0],
            end_time:this.time[1],
            status:this.status,//空为全部 10 已付款 20 已发货 30 确认收货
            receive_mobile:this.mobile
          })
          if(res.code == 0){
            this.tableData = res.data.data;
            this.total = res.data.total
          }
        },
        handleClose(){
            this.dialogVisible = false;
        },
        opSend(id,type){
          this.form = {
            company:'顺丰速运',
            nums:'',
            des:''
          }
          this.curId = id;
          type==1?this.isVir = true:this.isVir = false;
          type==1?this.title = '确认发货（虚拟物品）':'确认发货';
          this.dialogVisible = true;
        },
        async doSend(){
          
          if(!this.isVir&&!this.form.company){
            this.$message.error('请选择快递公司');
            return;
          }else if(!this.isVir&&!this.form.nums){
            this.$message.error('请输入快递单号');
            return;
          }else{
            let data = {};
            if(this.isVir){
              data = {
                id:this.curId,
                type:1,
                content:this.form.des
              }
            }else{
              data = {
                id:this.curId,
                type:0,
                express_no:this.form.nums,
                express_company:this.form.company
              }
            }
            let res = await addPackage(data);
            if(res.code == 0){
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getData();
            }else{
              this.$message.error(res.message);
            }
          }
        },
        preOrder(order_no){
          this.$refs.orderDetail.showDetail(order_no);
        }
    }
}
</script>
<style lang="scss" scoped>
  .sel{
    user-select: auto;
  }
    .wt{
  font-weight: bold;
  font-size: 14px;
  color:#000
}
.msgTitle{
  display: flex;
  justify-content: center;
  align-items: center;
}
.msgSign{
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.content  .pubPagation{
    margin-top: 20px;
    float: right;
}
.searchItem {
  display: flex;
  margin-top: 20px;
}
.columnHd {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.columnHd span {
  margin-right: 5px;
}
.columnHd .title {
  width: 200px;
}
.search_auth .searchItem {
  display: flex;
  justify-content: center;
}
.block {
  text-align: right;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.mt2{
  margin-top: 10px;
}
.hFlex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.mt5{
    margin-top: 50px;
}
.content  .pubPagation{
    margin-top: 20px;
    float: right;
  }
  .top{
    border-bottom: 1px solid #e5e5e5;
    &.lr{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .groupBtn{
      border-bottom: none!important;
    }
    .active{
      background-color: #409eff;
      color: #fff;
    }
  }
</style>