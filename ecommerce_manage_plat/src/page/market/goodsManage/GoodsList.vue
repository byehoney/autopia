<template>
    <div class="content">
      <el-row class="mb2">
        <el-col :span="12" class="center mb2">
          <el-col :span="4">
              <el-button type="primary" @click="addNewGoods">添加商品</el-button>
          </el-col>
          <el-col :span="8">
              共有数据：{{total}}条
          </el-col>  
        </el-col>
        <el-col :span="12" class="center">
          <el-radio-group v-model="type" class="mr2">
            <el-radio label="0">商品名称</el-radio>
            <el-radio label="1">商品编号</el-radio>
          </el-radio-group>
          <el-input v-model="keyword" placeholder="关键词" class="mr2 input"></el-input>
          <el-button type="primary" @click="doSearch">查 询</el-button>
        </el-col>
      </el-row>
      <el-row class="mb2">
        <el-col :span="24" class="top">
          <el-button-group>
            <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">全部商品</el-button>
            <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">已上架</el-button>
            <el-button type="groupBtn" :class="['groupBtn',actTab==2?'active':'']" plain @click="changeType(2)">已下架</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="goods_code"
          label="编号"
          >
        </el-table-column>
        <el-table-column
          label="商品封面">
          <template slot-scope="scope">
            <img class="smallPic" 
              :src="scope.row.picture" alt="" 
              @click="previewImg(scope.row.picture)"
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称	"
          >
        </el-table-column>
        <el-table-column
          prop="category_name"
          label="所属分类	"
         >
        </el-table-column>
        <!-- <el-table-column
          label="售卖类型"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.sell_type==0">普通</span>
            <span v-if="scope.row.sell_type==1">团购</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="group_price"
          label="定价">
        </el-table-column>
        <el-table-column
          label="状态"
         >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==0"
              @click.native.prevent="upDateGoodsState(scope.$index, scope.row,1)"
              type="text"
              size="small">
              操作上架
            </el-button>
            <el-button
              v-if="scope.row.status==1"
              @click.native.prevent="upDateGoodsState(scope.$index, scope.row,0)"
              type="text"
              size="small">
              操作下架
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="stock"
          label="库存">
        </el-table-column>
        <el-table-column
          label="操作"
         >
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editRow(scope.row)"
              type="text"
              size="small">
              编辑
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.row)"
              type="text"
              size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogVisible" >
        <img width="100%" :src="origionPic" alt="">
      </el-dialog>
      <AddGoodsForm :classOptionList = "classList" ref="addGoodsForm"></AddGoodsForm>
      <el-pagination
        class="pubPagation"
        @current-change="handleCurrentChange"
        :current-page.sync="curPage"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>
</template>
<script>
import AddGoodsForm from '../../../components/addGoodsForm.vue'
import { goodsList,classList,opGoodsState ,delGoods} from '../../../api/getData.js'
export default {
  name: "goodsList",
  data(){
    return{
      curPage:1,
      page_size:10,
      total:0,
      classList:[],//分类list
      dialogVisible:false,
      origionPic:'',
      type:'',//查询类型
      keyword:'',//查询关键词
      actTab:0,//当前激活按钮
      tableData:[],
      status:2,
    }
  },
  components: {
    AddGoodsForm
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getClassList(){
        let res = await classList({page_size:1000,page:1});
        if(res.code==0){
          this.classList = res.data.data;
        }
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getData();
    },
    async getData(){
      let res = await goodsList({
        page_size:this.page_size,
        page:this.curPage,
        keyword:this.keyword,
        type:this.type,
        status:this.status,
      })
      if(res.code == 0){
        this.tableData = res.data.data;
        this.total = res.data.total;
      }
    },
    changeType(index){
      this.actTab = index;
      this.curPage = 1;
      if(index == 0){// ''全部 0 已下架  1 已上架
        this.status = 2;
      }else if(index == 1){
        this.status = 1;
      }else{
        this.status = 0;
      }
      this.getData();
    },
    previewImg(imgStr){
      this.dialogVisible = true;
      this.origionPic = imgStr;
    },
    addNewGoods(){
      this.$refs.addGoodsForm.showDialogForm();
    },
    doSearch(){
      if(!this.type){
        this.$message({
          message: '请选择查询类型',
          type: 'warning'
        });
        return;
      }
      this.curPage =1;
      this.getData(); 
    },
    async upDateGoodsState(index,row,type){
      let res = await opGoodsState({id:row.id,status:type});
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
    editRow(row){
      this.$refs.addGoodsForm.showDialogForm(row);
    },
    async deleteRow(row){
      let res = await delGoods({id:row.id});
      if(res.code == 0){
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.getData();
      }else{
        this.$message.error(res.message);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.smallPic{
  width: 60px;
  height: 60px;
  margin-right: 10px;
}
.content .input{
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
.content  .pubPagation{
  margin-top: 20px;
  float: right;
}
.top{
    border-bottom: 1px solid #e5e5e5;
    .groupBtn{
      border-bottom: none!important;
    }
    .active{
      background-color: #409eff;
      color: #fff;
    }
  }

</style>
