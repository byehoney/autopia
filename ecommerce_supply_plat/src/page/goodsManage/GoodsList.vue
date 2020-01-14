<template>
    <div class="content">
      <el-row>
        <el-col :span="24" class="top lr">
          <el-button-group>
            <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">全部商品</el-button>
            <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">已上架</el-button>
            <el-button type="groupBtn" :class="['groupBtn',actTab==2?'active':'']" plain @click="changeType(2)">已下架</el-button>
          </el-button-group>
          <el-button type="primary" @click="$router.push('/goodsManage/addGoods')">添加商品</el-button>
        </el-col>
      </el-row>
      <el-row class="mb2 lr mt2">
        <el-col>共有{{total}}个商品，其中已上架{{status_up}}个，已下架{{status_down}}个</el-col>
        <el-col class="center">
          <el-radio-group v-model="type" class="mr2">
            <el-radio label="0">按商品名称</el-radio>
            <el-radio label="1">按编号</el-radio>
          </el-radio-group>
          <el-input v-model="keyWord" placeholder="关键词" class="mr2 sInput"></el-input>
          <el-button type="primary" @click="doSearch">查 询</el-button>
        </el-col>
      </el-row>
      <div v-cloak>
        <el-table
          v-if="actTab==0"
          :data="tableData"
          style="width: 100%">
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
            label="结算价(元)"
          >
            <template slot-scope="scope">
              <div>{{scope.row.settlement_price}}</div>
              <el-button type="text" @click="prePrice(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="市场价(元)"
          >
            <template slot-scope="scope">
              <div>{{scope.row.market_price}}</div>
              <el-button type="text" @click="preMarket(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="总库存"
          >
            <template slot-scope="scope">
              <div>{{scope.row.sum_stock}}</div>
              <el-button type="text" @click="preStock(scope.row)">调整</el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="created_at"
            label="创建时间"
          >
          </el-table-column>
          <el-table-column
            label="状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status==0||scope.row.status==2">已下架</span>
              <span v-if="scope.row.status==1">已上架</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-cloak>
        <el-table
          v-if="actTab==1"
          :data="tableData"
          style="width: 100%">
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
            label="结算价(元)"
          >
            <template slot-scope="scope">
              <div>{{scope.row.settlement_price}}</div>
              <el-button type="text" @click="prePrice(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="市场价(元)"
          >
            <template slot-scope="scope">
              <div>{{scope.row.market_price}}</div>
              <el-button type="text" @click="preMarket(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="总库存"
          >
            <template slot-scope="scope">
              <div>{{scope.row.sum_stock}}</div>
              <el-button type="text" @click="preStock(scope.row)">调整</el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="on_shelves_at"
            label="上架时间"
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
              <el-button type="text" @click="doUpDown(scope.row,0)">下架</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-cloak>
        <el-table
          v-if="actTab==2"
          :data="tableData"
          style="width: 100%">
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
            label="结算价(元)"
          >
            <template slot-scope="scope">
              <div>{{scope.row.settlement_price}}</div>
              <el-button type="text" @click="prePrice(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="市场价(元)"
          >
            <template slot-scope="scope">
              <div>{{scope.row.market_price}}</div>
              <el-button type="text" @click="preMarket(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="总库存"
          >
            <template slot-scope="scope">
              <div>{{scope.row.sum_stock}}</div>
              <el-button type="text" @click="preStock(scope.row)">调整</el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="off_shelves_at"
            label="下架时间"
          >
          </el-table-column>
          <el-table-column
            label="下架类型"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status_type==0">供应商</span>
              <span v-if="scope.row.status_type==1">平台</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
              <el-button type="text" @click="doUpDown(scope.row,1)">上架</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="pubPagation"
        @current-change="handleCurrentChange"
        :current-page.sync="curPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-dialog :visible.sync="dialogVisible" >
        <img width="100%" :src="origionPic" alt="">
      </el-dialog>
      <BalancePop ref="balancePop"></BalancePop>  
      <StockPop ref="stockPop"></StockPop>  
      <MarketPop ref="marketPop"></MarketPop>
    </div>
</template>
<script>
import { realGoodsList,opUpDown } from '../../api/getData';
import BalancePop from './components/BalancePop';
import StockPop from './components/StockPop';
import MarketPop from './components/MarketPop';
export default {
  data() {
    return {
      status:2,//2全部  1 商家  0 下架
      actTab:0,//当前激活tab
      curPage:1,//当前页码
      page_size:10,
      tableData:[],//table数据源
      type:'0',//查询类别 0 商品名称  1商品编号
      keyWord:'',//搜索关键字
      total:0,//数据总数
      dialogVisible:false,//大图预览器是否展示
      origionPic:'',//图片预览器展示图片路径
      status_up:0,
      status_down:0
    };
  },
  components:{
    BalancePop,
    StockPop,
    MarketPop
  },
  mounted() {
    this.getData();
  },
  methods: {
    editRow(row){
      this.$router.history.push({path:'/goodsManage/editGoods',query:{id:row.id,draft:0}})
    },
    changeType(index){
      
      this.actTab = index;
      this.curPage = 1;
      if(index == 0){
        this.status = 2;
      }else if(index == 1){
        this.status = 1;
      }else if(index == 2){
        this.status = 0;
      }
      this.getData();
    },
    async getData(){
      let res = await realGoodsList({page_size:this.page_size,page:this.curPage,keyword:this.keyWord,status:this.status,stype:this.type}) ;
      if(res.code == 0){
        this.tableData = res.data.data;
        this.total = res.data.total;
        this.status_down = res.data.status_down;
        this.status_up = res.data.status_up;
      }
    },

    doSearch(){
      this.curPage = 1;
      this.getData();
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getData();
    },
    previewImg(imgStr){
      this.dialogVisible = true;
      this.origionPic = imgStr;
    },
    prePrice(row){//查看结算价
      this.$refs.balancePop.showDetail(row,1);
    },
    preStock(row){//调整库存
      this.$refs.stockPop.showDetail(row,1);
    },
    preMarket(row){//调整市场价
      this.$refs.marketPop.showDetail(row,1);
    },
    async reqUpDown(row,status){
      let res = await opUpDown({goods_id:row.id,status});
      if(res.code == 0){
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.getData();
      }else{
        this.$message.error(res.message);
      }
    },
    doUpDown(row,status){
      if(status == 1){
        this.reqUpDown(row,status);
      }else{
        this.$confirm('此操作将下架该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.reqUpDown(row,status)
        }).catch(() => {
              
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .content  .el-button-group .el-button{
    border-bottom: none!important;
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
  .lr{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .mt2{
    margin-top: 20px;
  }
  .content .sInput{
    width: 200px;
  }
  .content  .center{
    display: flex;
    align-items: center;

  }
  .content .mr2{
    margin-right: 20px;
  }
  .content .mb2{
    margin-bottom: 20px;
  }
  .smallPic{
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }
</style>
