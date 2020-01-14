<template>
    <div class="recommend">
        <el-row class="mb2">
            <el-col :span="8"  class="searchArea">
                <el-input v-model="actId" placeholder="要推荐到首页的动态ID" class="mr2"></el-input>
                <el-button type="primary" @click="recommendToHome">推荐到首页</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            prop="feed_id"
            label="内容ID"
            >
            </el-table-column>
            <el-table-column
            prop="nickname"
    
            label="发布者">
            </el-table-column>
             <el-table-column
            prop="feed_publish_time"
            label="发布时间"
            >
            </el-table-column>
            <el-table-column
            prop="recommend_time"
            label="推荐时间"
            >
            </el-table-column>
            <el-table-column
            prop="talk"
         
            label="内容状态">
              <template slot-scope="scope">
                <span v-if="scope.row.feed_status==0">不通过</span>
                <span v-if="scope.row.feed_status==1">发布中</span>
                <span v-if="scope.row.feed_status==2">已删除</span>
              </template>
            </el-table-column>
            <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
                <el-button
                @click.native.prevent="updateRow(scope.$index, scope.row)"
                type="text"
                size="small">
                取消推荐
                </el-button>
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
    </div>
</template>
<script>
import { recommendDynamicList ,updateRecommendState} from '../api/getData.js'
export default {
  name: "recommendList",
  data(){
    return{
        actId:'',//活动id
        curPage:1,//当前页码
        page_size:10,
        total:100,//数据总数
        tableData: []
    }
  },
  methods: {
    showList(){
      this.curPage = 1;
      this.getRecommendListData();
    },
    async getRecommendListData(){
      let res  = await recommendDynamicList({page:this.curPage,page_size:this.page_size});
      if(res.code == 0){
        this.tableData = res.data.data;
        this.total = res.data.total;
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    async updateRow(index,row){
      let res = await updateRecommendState({id:row.feed_id,type:1,status:0})
      if(res.code == 0){
        this.getRecommendListData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    async recommendToHome(){
      if(!this.actId){
        this.$message({
          showClose: true,
          message: '请输入推荐动态ID',
          type: 'warning'
        });
        return;
      }
      let res = await updateRecommendState({id:this.actId,type:1,status:1});
      this.actId = '';
      if(res.code == 0){
        this.getRecommendListData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getRecommendListData();
    },
  },
};
</script>

<style lang="scss" scoped>
  .recommend  .pubPagation{
    margin-top: 20px;
    float: right;
  }
  .recommend .searchArea{
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .mr2{
      margin-right: 20px;
  }
  .mb2{
      margin-bottom: 20px;
  }
</style>