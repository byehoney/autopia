<template>
    <div class="recommend">
        <el-row class="mb2">
            <el-col :span="8"  class="searchArea">
                <el-input v-model="actId" placeholder="达人榜的用户ID" class="mr2"></el-input>
                <el-button type="primary" @click="addToTalentRank">加入达人榜</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            prop="id"
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
            width="180">
            </el-table-column>
            <el-table-column
            prop="recommend_time"
            label="推荐时间"
            >
            </el-table-column>
            <el-table-column
            label="排序"
            >
            <template slot-scope="scope">
                <el-button
                    @click.native.prevent="updateRankOrder(scope.$index, scope.row,0)"
                    size="small" 
                    v-if="scope.$index>0"
                >
                上移
                </el-button>
                <el-button
                    @click.native.prevent="updateRankOrder(scope.$index, scope.row,1)"
                    size="small"
                    v-if="scope.$index<tableData.length-1"
                >
                下移
                </el-button>
            </template>
            </el-table-column>
            <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
                <el-button
                    @click.native.prevent="updateRow(scope.$index, scope.row)"
                    size="small" 
                    type="text"
                >
                撤销推荐
                </el-button>
            </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { talentRankList,updateRecommendState ,opTalentRank} from '../api/getData.js'
export default {
  name: "recommendList",
  data(){
    return{
        actId:'',//活动id
        tableData: []
    }
  },
  methods: {
    async updateRankOrder(index,row,type){
      let res = await opTalentRank({user_id:row.id,type:type});
      if(res.code == 0){
        this.getTalentRankData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    async addToTalentRank(){
      if(!this.actId){
        this.$message({
          showClose: true,
          message: '请输入推荐用户ID',
          type: 'warning'
        });
        return;
      }
      let res = await updateRecommendState({id:this.actId,type:2,status:1});
      this.actId = '';
      if(res.code == 0){
        this.getTalentRankData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    async updateRow(index,row,type){
      let res = await updateRecommendState({id:row.id,type:2,status:0})
      if(res.code == 0){
        this.getTalentRankData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    showList(){
      this.curPage = 1;
      this.getTalentRankData();
    },
    async getTalentRankData(){
      let res = await talentRankList();
      if(res.code ==0 ){
        this.tableData = res.data;
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    }
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