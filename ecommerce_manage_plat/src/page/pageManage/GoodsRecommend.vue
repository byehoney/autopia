<template>
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline mb2">
            <el-form-item label="商品编号" class="mr2" label-width="100px">
                <el-input v-model="form.goods_code" maxlength="11" placeholder="商品编号"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" class="mr2" label-width="100px">
                <el-input v-model="form.goods_name" maxlength="11" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="doReset" class="mr2">重置</el-button>
                <el-button type="primary" @click="doSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
          @selection-change="handleSelectionChange"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="goods_code"
            label="编号"
          >
          </el-table-column>
          <el-table-column
            label="商品封面图"
          >
            <template slot-scope="scope">
              <img class="smallPic" 
                :src="scope.row.picture" alt="" 
                @click="previewImg(scope.row.picture)"
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="goods_name"
            label="商品名称"
          >
          </el-table-column>
          <el-table-column
            prop="category_name"
            label="所属分类"
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
            label="定价(元)"
          >
            <template slot-scope="scope">
              <div>普通价：{{scope.row.ordinary_price}}</div>
              <div>VIP价：{{scope.row.vip_price}}</div>
              <div>平台成本：{{scope.row.platform_cost_price}}</div>
              <div>结算价：{{scope.row.settlement_price}}</div>
              <div>市场价：{{scope.row.market_price}}</div>
              <el-button type="text" @click="prePrice(scope.row,0)">调整</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="返佣"
          >
            <template slot-scope="scope">
              <div>{{scope.row.vip_self_profit_ratio}}%</div>
              <div>{{scope.row.vip_higher_profit_ratio}}%</div>
              <div>{{scope.row.ordinary_user_profit_ratio}}%</div>
              <el-button type="text" @click="preRake(scope.row,0)">调整</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="库存"
          >
            <template slot-scope="scope">
              <div>{{scope.row.sum_stock}}</div>
              <el-button type="text" @click="preStock(scope.row,0)">调整</el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="created_at"
            label="推荐时间"
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.is_recommend==0" @click="opSet(scope.row.id,'recommend',1)">推荐</el-button>
              <el-button type="text" v-if="scope.row.is_recommend==1" @click="opSet(scope.row.id,'recommend',0)">取消推荐</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row  style="float:left;margin-top:20px" v-if="tableData.length">
          <el-button @click="opAllSet('recommend',0)" type="text">取消推荐</el-button>
        </el-row>
        <el-dialog :visible.sync="dialogVisible" >
          <img width="100%" :src="origionPic" alt="">
        </el-dialog>
        <BalancePop ref="balancePop"></BalancePop>  
        <StockPop ref="stockPop"></StockPop>  
        <RakePop ref="rakePop"></RakePop>  
        <el-pagination
            class="pubPagation"
            @current-change="handleCurrentChange"
            :current-page.sync="curPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
import { recommendList,goodsSet } from '../../api/getData'
import BalancePop from './components/BalancePop';
import StockPop from './components/StockPop';
import RakePop from './components/RakeBack';
export default {
    data(){
        return{
            dialogVisible:false,
            origionPic:'',
            multipleSelection:[],
            tableData:[],
            curPage:1,
            page_size:10,
            total:0,
            form:{
                goods_code:'',
                goods_name:''
            }
        }
    },
    components:{
        BalancePop,
        StockPop,
        RakePop,
    },
    mounted(){
      this.getData();
    },
    methods: {
        doReset(){
            this.curPage = 1;
            this.form = {
                goods_code:'',
                goods_name:''
            }
            this.getData();
        },
        doSearch(){
            this.curPage = 1;
            this.getData()
        },
        async getData(){
          let res = await recommendList({page:this.curPage,page_size:this.page_size,goods_code:this.form.goods_code,goods_name:this.form.goods_name});
          if(res.code == 0){
            this.total = res.data.total;
            this.tableData = res.data.data;
          }
        },
        async opSet(id,type,status){
          let ids = [id];
          let res = await goodsSet({id:ids,type,status});
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.getData();
          }else{
            this.$message.error(res.message);
          }
        },
        async opAllSet(type,status){
          let ids = [];
          if(!this.multipleSelection.length){
            this.$message.error('请选择要操作的商品');
            return;
          }
          this.multipleSelection.forEach(item=>{
            ids.push(item.id)
          })
          let res = await goodsSet({id:ids,type,status});
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.getData();
          }else{
            this.$message.error(res.message);
          }
        },
        handleCurrentChange(curPage){
            this.curPage = curPage;
            this.getData();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        previewImg(imgStr){
            this.dialogVisible = true;
            this.origionPic = imgStr;
        },
        prePrice(row,draft){//调整定价
          this.$refs.balancePop.showDetail(row,draft);
        },
        preRake(row,draft){//调整返佣比例
          this.$refs.rakePop.showDetail(row,draft);
        },
        preStock(row,draft){//调整库存
          this.$refs.stockPop.showDetail(row,draft);
        },
    },
}
</script>
<style lang="scss" scoped>
    .mb2{
        margin-bottom: 20px;
    }
    .mr2{
        margin-right: 20px;
    }
    .pubPagation{
        margin-top: 20px;
        float: right;
    }
    .smallPic{
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
</style>