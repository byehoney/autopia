<template>
    <div>
        <el-row >
            <el-col :span="24" class="top lr">
                <el-button-group>
                    <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">取消订单</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <el-table
          class="mt5"
          v-if="actTab==0"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="refund_no"
            label="售后单号"
          >
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="生成时间"
          >
          </el-table-column>
          <el-table-column
            width="160px"
            label="订单编号"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="preOrder(scope.row.order_no)">{{scope.row.order_no}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="order_created_at"
            label="下单时间"
          >
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
            prop="goods_type"
            label="商品类型"
          >
            <!-- <template slot-scope="scope">
              <span v-if="scope.row.type==0">实物</span>
              <span v-if="scope.row.type==1">虚拟</span>
            </template> -->
          </el-table-column>
          <el-table-column
            prop="refund_quantity"
            label="数量"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="购买人"
          >
          </el-table-column>
          <el-table-column
            prop="price_type"
            label="定价类型"
          >
          </el-table-column>
          <el-table-column
            prop="refund_fee"
            label="订单金额"
          >
          </el-table-column>
          <el-table-column
            prop="status_str"
            label="售后单状态"
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="doNote(scope.row)">备注</el-button>
              <el-button type="text" @click="opStatus(scope.row,2)" v-if="scope.row.status_str=='等待平台确认'">确认取消</el-button>
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
        <CancelPop ref="cancelPop"></CancelPop>
        <RemarkPop ref="remarkPop"></RemarkPop>
        <OrderDetail ref="orderDetail"></OrderDetail>
    </div>
</template>
<script>
import OrderDetail from './components/OrderDetail'
import CancelPop from './components/CancelPop'
import RemarkPop from './components/RemarkPop'
import { refundList } from '../../api/getData'
export default {
    data(){
        return{
            actTab:0,
            curPage:1,
            page_size:10,
            total:0,
            tableData:[],
        }
    },
    components:{
      CancelPop,
      RemarkPop,
      OrderDetail
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
            this.curPage = 1;
            this.getData();
        },
        async getData(){
          let res = await refundList({page_size:this.page_size,page:this.curPage,type:this.actTab});
          if(res.code == 0){
            this.total = res.data.total;
            this.tableData = res.data.data;
          }else{
            this.$message.error(res.message);
          }
        },
        preOrder(order_no){
          this.$refs.orderDetail.showDetail(order_no);
        },
        doNote(row){
          this.$refs.remarkPop.showDetail(row);
        },
        opStatus(row,status){
          this.$refs.cancelPop.showDetail(row,status);
        }
    }
}
</script>
<style lang="scss" scoped>
    .mt5{
        margin-top: 50px;
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
    .pubPagation{
        margin-top: 20px;
        float: right;
    }
</style>