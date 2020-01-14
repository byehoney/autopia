<template>
    <div class="content">
      <el-row>
        <el-col :span="24" class="top lr">
          <el-button-group>
            <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">草稿箱</el-button>
            <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">待审核</el-button>
            <el-button type="groupBtn" :class="['groupBtn',actTab==2?'active':'']" plain @click="changeType(2)">审核不通过</el-button>
          </el-button-group>
          <el-button type="primary" @click="$router.push('/goodsManage/addGoods')">添加商品</el-button>
        </el-col>
      </el-row>
      <el-row class="mb2 lr mt2">
        <el-col>共有837573个商品，其中已上架48353个，已下架3853个</el-col>
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
            label="编号"
          >
          </el-table-column>
          <el-table-column
            label="商品封面图"
          >
            <template slot-scope="scope">
              <img class="smallPic" 
                :src="imgSrc" alt="" 
                v-for="(imgSrc,index) in scope.row.picture" 
                :key="index"
                @click="previewImg(imgSrc)"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
          >
          </el-table-column>
          <el-table-column
            label="所属分类"
          >
          </el-table-column>
          <el-table-column
            label="商品类型"
          >
          </el-table-column>
          <el-table-column
            label="结算价(元)"
          >
            <template slot-scope="scope">
              <div>{{scope.row.price}}</div>
              <el-button type="text" @click="prePrice(scope.row.check)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="总库存"
          >
            <template slot-scope="scope">
              <div>{{scope.row.stock}}</div>
              <el-button type="text" @click="preStock(scope.row.check)">调整</el-button>
            </template>
          </el-table-column>

          <el-table-column
            label="创建时间"
          >
          </el-table-column>
          <el-table-column
            label="状态"
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
              <el-button type="text" @click="doSubmit(scope.row)">提交审核</el-button>
              <el-button type="text" @click="doDel(scope.row)">删除</el-button>
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
            label="编号"
          >
          </el-table-column>
          <el-table-column
            label="商品封面图"
          >
            <template slot-scope="scope">
              <img class="smallPic" 
                :src="imgSrc" alt="" 
                v-for="(imgSrc,index) in scope.row.picture" 
                :key="index"
                @click="previewImg(imgSrc)"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
          >
          </el-table-column>
          <el-table-column
            label="所属分类"
          >
          </el-table-column>
          <el-table-column
            label="商品类型"
          >
          </el-table-column>
          <el-table-column
            label="结算价(元)"
          >
            <template slot-scope="scope">
              <div>{{scope.row.price}}</div>
              <el-button type="text" @click="prePrice(scope.row.check)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="总库存"
          >
            <template slot-scope="scope">
              <div>{{scope.row.stock}}</div>
              <el-button type="text" @click="preStock(scope.row.check)">调整</el-button>
            </template>
          </el-table-column>

          <el-table-column
            label="提交时间"
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="doCancel(scope.row)">撤回</el-button>
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
            label="编号"
          >
          </el-table-column>
          <el-table-column
            label="商品封面图"
          >
            <template slot-scope="scope">
              <img class="smallPic" 
                :src="imgSrc" alt="" 
                v-for="(imgSrc,index) in scope.row.picture" 
                :key="index"
                @click="previewImg(imgSrc)"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
          >
          </el-table-column>
          <el-table-column
            label="所属分类"
          >
          </el-table-column>
          <el-table-column
            label="商品类型"
          >
          </el-table-column>
          <el-table-column
            label="结算价(元)"
          >
          </el-table-column>
          <el-table-column
            label="总库存"
          >
          </el-table-column>

          <el-table-column
            label="审核时间"
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
              <el-button type="text" @click="doDel(scope.row)">删除</el-button>
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
    </div>
</template>
<script>
import BalancePop from './components/BalancePop';
import StockPop from './components/StockPop';
export default {
  data() {
    return {
      actTab:0,//当前激活tab
      curPage:1,//当前页码
      tableData:[
        {
          price:'36-45',
          check:[{name:1,stock:20},{name:2,stock:30}],
          stock:60
        },{
          price:'30-40',
          check:[{name:3,stock:50},{name:5,stock:60}],
          stock:50
        }
      ],//table数据源
      type:'',//查询类别 0 商品名称  1商品编号
      keyWord:'',//搜索关键字
      total:0,//数据总数
      dialogVisible:false,//大图预览器是否展示
      origionPic:'',//图片预览器展示图片路径
    };
  },
  components:{
    BalancePop,
    StockPop
  },
  mounted() {

  },
  methods: {
    editRow(row){
      this.$router.history.push({path:'/goodsManage/editGoods',query:{id:row}})
    },
    doSubmit(row){

    },
    doDel(row){

    },
    doCancel(row){

    },
    changeType(index){

      this.actTab = index;
      this.curPage = 1;
      // this.tableData = [];
      if(index == 0){
        this.getData();
      }else{
        this.getData();
      }
      this.$forceUpdate();
    },
    getData(){
      this.tableData =this.tableData;
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
      this.$refs.balancePop.showDetail(row);
    },
    preStock(row){//调整库存
      this.$refs.stockPop.showDetail(row);
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
