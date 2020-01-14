<template>
    <div class="recommend">
        <el-row class="mb2">
            <el-col :span="8"  class="searchArea mr2">
                <el-input v-model="actId" placeholder="要加入默认关注的用户ID" class="mr2"></el-input>
                <el-button type="primary" @click="addToFllow">设为默认关注</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            prop="user_id"
            label="用户ID"
            >
            </el-table-column>
            <el-table-column
            prop="nickname"
            label="用户昵称"
            >
            </el-table-column>
             <el-table-column
            prop="u_auth_title"
            label="认证信息"
            >
            </el-table-column>
            <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
                <el-button
                @click.native.prevent="updateRow(scope.$index, scope.row)"
                type="text"
                size="small">
                撤消
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
import { followList ,updateRecommendState} from '../api/getData.js'
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
      this.getFllowListData();
    },
    async getFllowListData(){
      let res = await followList({page:this.curPage,page_size:this.page_size});
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
      let res = await updateRecommendState({id:row.user_id,type:3,status:0})
      if(res.code == 0){
        this.getFllowListData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    async addToFllow(){
      if(!this.actId){
        this.$message({
          showClose: true,
          message: '请输入要加入默认关注的用户ID',
          type: 'warning'
        });
        return;
      }
      let res = await updateRecommendState({id:this.actId,type:3,status:1});
      this.actId = '';
      if(res.code == 0){
        this.getFllowListData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getFllowListData();
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