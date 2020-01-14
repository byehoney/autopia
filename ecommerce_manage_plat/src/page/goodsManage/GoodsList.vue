<template>
    <div class="content">
      <el-row class="hFlex">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="商品名称">
            <el-input v-model="form.goodsName" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品编号">
            <el-input v-model="form.goodsCode" placeholder="商品编号"></el-input>
          </el-form-item>
          <el-form-item label="一级类目">
            <el-select v-model="form.mainClass" placeholder="一级类目" @change="selClass">
              <el-option v-for="(item,index) in mainOptions" :key="index" :label="item.cate_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级类目">
            <el-select v-model="form.sonClass" placeholder="二级类目">
              <el-option v-for="(item,index) in sonOptions" :key="index" :label="item.cate_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="hFlex mt2">
        <el-button @click="doReset">重置</el-button>
        <el-button @click="doSearch" type="primary">查询</el-button>
      </el-row>
      <el-row>
        <el-col :span="24" class="top lr">
          <el-button-group>
            <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">全部商品</el-button>
            <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">待审核</el-button>
            <el-button type="groupBtn" :class="['groupBtn',actTab==2?'active':'']" plain @click="changeType(2)">已上架</el-button>
            <el-button type="groupBtn" :class="['groupBtn',actTab==3?'active':'']" plain @click="changeType(3)">已下架</el-button>
            <el-button type="groupBtn" :class="['groupBtn',actTab==4?'active':'']" plain @click="changeType(4)">礼包商品</el-button>
          </el-button-group>
          <el-button type="primary" @click="doExport">导出</el-button>
        </el-col>
      </el-row>
      <!-- <el-row class="mb2 lr mt2">
        <el-col>共有837573个商品，其中已上架48353个，已下架3853个</el-col>
        <el-col class="center">
          <el-radio-group v-model="type" class="mr2">
            <el-radio label="0">按商品名称</el-radio>
            <el-radio label="1">按编号</el-radio>
          </el-radio-group>
          <el-input v-model="keyWord" placeholder="关键词" class="mr2 sInput"></el-input>
          <el-button type="primary" @click="doSearch">查 询</el-button>
        </el-col>
      </el-row> -->
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
            prop="supplier_company"
            label="供应商"
          >
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
              <el-button v-if="scope.row.gift==1&&scope.row.type==0" type="text" @click="setGift(scope.row,0)">取消礼包</el-button>
              <el-button v-if="scope.row.gift==0&&scope.row.type==0" @click="setGift(scope.row,1)" type="text">设为礼包</el-button>
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
            label="创建时间"
          >
          </el-table-column>
          <el-table-column
            prop="status_text"
            label="状态"
          >
          </el-table-column>
        </el-table>
        <el-row  v-if="actTab==0" style="float:left;margin-top:20px;color:#909399">
          共有{{total}}个商品，其中已上架{{status_up}}个，已下架{{status_down}}个
        </el-row>
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
            prop="supplier_company"
            label="供应商"
          >
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
              <el-button type="text" @click="prePrice(scope.row,1)">调整</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="返佣"
          >
            <template slot-scope="scope">
              <div>{{scope.row.vip_self_profit_ratio}}%</div>
              <div>{{scope.row.vip_higher_profit_ratio}}%</div>
              <div>{{scope.row.ordinary_user_profit_ratio}}%</div>
              <el-button type="text" @click="preRake(scope.row,1)">调整</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="库存"
          >
            <template slot-scope="scope">
              <div>{{scope.row.sum_stock}}</div>
              <el-button type="text" @click="preStock(scope.row,1)">调整</el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="created_at"
            label="提交时间"
          >
          </el-table-column>
          <el-table-column
            label="新上架"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.operate_status==0">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="preGoodsInfo(scope.row.id,scope.row.supplier_id)">查看</el-button>
              <el-button type="text" @click="opPass(scope.row,3)">通过</el-button>
              <el-button type="text" @click="opPass(scope.row,1)">不通过</el-button>
              <el-button v-if="scope.row.gift==1&&scope.row.type==0" type="text" @click="setGift(scope.row,0)">取消礼包</el-button>
              <el-button v-if="scope.row.gift==0&&scope.row.type==0" @click="setGift(scope.row,1)" type="text">设为礼包</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-cloak>
        <el-table
          @selection-change="handleSelectionChange"
          v-if="actTab==2"
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
            prop="supplier_company"
            label="供应商"
          >
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
              <el-button v-if="scope.row.gift==1&&scope.row.type==0" type="text" @click="setGift(scope.row,0)">取消礼包</el-button>
              <el-button v-if="scope.row.gift==0&&scope.row.type==0" @click="setGift(scope.row,1)" type="text">设为礼包</el-button>
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
            label="上架时间"
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="opStatus(scope.row,0)">下架</el-button>
              <el-button type="text" v-if="scope.row.is_recommend==0" @click="opSet(scope.row.id,'recommend',1)">推荐</el-button>
              <el-button type="text" v-if="scope.row.is_recommend==1" @click="opSet(scope.row.id,'recommend',0)">取消推荐</el-button>
              <el-button type="text" v-if="scope.row.is_top==0" @click="opSet(scope.row.id,'top',1)">置顶</el-button>
              <el-button type="text" v-if="scope.row.is_top==1" @click="opSet(scope.row.id,'top',0)">取消置顶</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row  v-if="actTab==2" style="float:left;margin-top:20px">
          <el-button @click="opAllSet('recommend',1)" type="text">推荐</el-button>
          <el-button @click="opAllSet('recommend',0)" type="text">取消推荐</el-button>
          <el-button @click="opAllSet('top',1)" type="text">置顶</el-button>
          <el-button @click="opAllSet('top',0)" type="text">取消置顶</el-button>
        </el-row>
      </div>
      <div v-cloak>
        <el-table
          v-if="actTab==3"
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
            prop="supplier_company"
            label="供应商"
          >
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
              <el-button v-if="scope.row.gift==1&&scope.row.type==0" type="text" @click="setGift(scope.row,0)">取消礼包</el-button>
              <el-button v-if="scope.row.gift==0&&scope.row.type==0" @click="setGift(scope.row,1)" type="text">设为礼包</el-button>
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
            label="下架时间"
          >
          </el-table-column>
          <el-table-column
            label="下架类型"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status_type==1">平台</span>
              <span v-if="scope.row.status_type==0">商家</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="editRow(scope.row.id,scope.row.supplier_id)">编辑</el-button>
              <el-button type="text" @click="opStatus(scope.row,1)">上架</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-cloak>
        <el-table
          v-if="actTab==4"
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
            prop="supplier_company"
            label="供应商"
          >
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
            <el-col>礼包</el-col>
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
            label="库存"
          >
            <template slot-scope="scope">
              <div>{{scope.row.sum_stock}}</div>
              <el-button type="text" @click="preStock(scope.row,0)">调整</el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="created_at"
            label="添加时间"
          >
          </el-table-column>
          <el-table-column
            label="状态"
          >
            <template slot-scope="scope">
              <el-button v-if="scope.row.status==1" disabled type="text">上架</el-button>
              <el-button v-if="scope.row.status==0" disabled type="text">下架</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="setGift(scope.row,0)">取消礼包</el-button>
              <el-button v-if="scope.row.status==1" type="text" @click="opStatus(scope.row,0)">下架</el-button>
              <el-button v-if="scope.row.status==0"  type="text" @click="opStatus(scope.row,1)">上架</el-button>
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
      <RakePop ref="rakePop"></RakePop>  
    </div>
</template>
<script>
import { baseUrl } from '../../config/env.js'
import { goodsList,mainClassList,sonClassList,setGoodsStatus,setGoodsGift ,setGoodsPass,goodsSet,exportOrder,getToken } from '../../api/getData';
import BalancePop from './components/BalancePop';
import StockPop from './components/StockPop';
import RakePop from './components/RakeBack';
export default {
  data() {
    return {
      actTab:0,//当前激活tab
      curPage:1,//当前页码
      page_size:10,
      tableData:[],//table数据源
      type:'',//查询类别 0 商品名称  1商品编号
      keyWord:'',//搜索关键字
      total:0,//数据总数
      dialogVisible:false,//大图预览器是否展示
      origionPic:'',//图片预览器展示图片路径
      mainOptions:[],
      sonOptions:[],
      selGoods:[],//选中商品
      status_up:0,//上架数
      status_down:0,//下架数
      form: {
        goodsName: '',
        goodsCode: '',
        mainClass:'',
        sonClass:''
      }
    };
  },
  components:{
    BalancePop,
    StockPop,
    RakePop,
  },
  mounted() {
    this.baseUrl = baseUrl;
    this.reqMainClass();
    if(this.$route.query.curPage&&this.$route.query.actTab){
      this.curPage = parseInt(this.$route.query.curPage);
      this.actTab = this.$route.query.actTab;
      this.selClass(this.$route.query.mainClass);
      this.form ={
        goodsName: this.$route.query.goodsName,
        goodsCode: this.$route.query.goodsCode,
        mainClass:this.$route.query.mainClass,
        sonClass:this.$route.query.sonClass
      };
    }
    this.getData();
  },
  methods: {
    handleSelectionChange(val) {
        this.selGoods = val;
        
    },
    doReset(){
      this.curPage = 1;
      this.form ={
        goodsName: '',
        goodsCode: '',
        mainClass:'',
        sonClass:''
      };
      this.getData();
    },
    async selClass(value){
      let res = await sonClassList({fid:value});
      if(res.code == 0){
        this.sonOptions = res.data;
      }
    },
    async reqMainClass(){
      let res = await mainClassList();
      if(res.code == 0){
        this.mainOptions = res.data;
      }
    },
    editRow(id,sid){
      this.$router.history.push({path:'/goodsManage/editGoods',query:{id:id,supplier_id:sid}})
    },
    preGoodsInfo(id,sid){
      this.$router.history.push({
        path:'/goodsManage/editGoods',
        query:{
          id:id,
          supplier_id:sid,
          isPre:true,
          curPage:this.curPage,
          actTab:this.actTab,
          goodsName:this.form.goodsName,
          goodsCode:this.form.goodsCode,
          mainClass:this.form.mainClass,
          sonClass:this.form.sonClass,
        }
      })
    },
    changeType(index){
      this.actTab = index;
      this.curPage = 1;
      this.getData();
    },
    async getData(){
      let res = await goodsList({
        page:this.curPage,
        page_size:this.page,
        keyword:this.form.goodsName,
        goods_code:this.form.goodsCode,
        category_id_one:this.form.mainClass,
        category_id_two:this.form.sonClass,
        type:this.actTab
      });
      if(res.code == 0){
        this.tableData = res.data.data;
        this.total = res.data.total;
        this.status_up = res.data.status_up;
        this.status_down = res.data.status_down
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
    prePrice(row,draft){//调整定价
      this.$refs.balancePop.showDetail(row,draft);
    },
    preRake(row,draft){//调整返佣比例
      this.$refs.rakePop.showDetail(row,draft);
    },
    preStock(row,draft){//调整库存
      this.$refs.stockPop.showDetail(row,draft);
    },
    async setStatus(id,status){//操作上下架
      let res = await setGoodsStatus({goods_id:id,status:status});
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
    opStatus(row,status){
      if(status == 1){
        this.setStatus(row.id,status);
      }else{
        this.$confirm('此操作将下架该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.setStatus(row.id,status);
        }).catch(() => {
          
        });
      }
    },
    async opGift(id,gift){
      let res = await setGoodsGift({goods_id:id,gift});
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
    setGift(row,gift){
      if(gift == 1){
        this.opGift(row.id,gift);
      }else{
        this.$confirm('此操作将取消该商品作为礼包商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.opGift(row.id,gift);
        }).catch(() => {
          
        });
      }
    },
    async doPass(id,sh_status){
      let res = await setGoodsPass({goods_id:id,sh_status});
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
    opPass(row,sh_status){
      if(sh_status == 3){
        this.doPass(row.id,sh_status);
      }else if(sh_status == 1){
        this.$confirm('此操作将该商品不通过审核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doPass(row.id,sh_status);
        }).catch(() => {
          
        });
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
      if(!this.selGoods.length){
        this.$message.error('请选择要操作的商品');
        return;
      }
      this.selGoods.forEach(item=>{
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
    async doExport(){
      let res = await getToken();
      window.open(this.baseUrl+'/admin/goods/export?token='+res.data.token+'&page='+this.curPage+'&page_size='+this.page_size+'&keyword='+this.form.goodsName+'&goods_code='+this.form.goodsCode+'&category_id_one='+this.form.mainClass+'&category_id_two='+this.form.sonClass+'&type='+this.actTab)
    }
  }
};
</script>
<style lang="scss" scoped>
  .hFlex{
    display: flex;
    justify-content: center;
  }
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
