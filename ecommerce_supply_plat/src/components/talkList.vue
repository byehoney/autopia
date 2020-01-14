<template>
    <div class="recommend">
        <el-row class="mb2">
            <el-col :span="8"  class="searchArea mr2">
                <el-input v-model="actId" placeholder="请输入要添加的话题名称" class="mr2"></el-input>
                <el-button type="primary" @click="addTopic">添加话题</el-button>
            </el-col>
            <el-col :span="6"  class="searchArea">
                <el-input v-model="topic_name" placeholder="话题关键词" class="mr2"></el-input>
                <el-button type="primary" @click="findTopic">查 询</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            prop="topic_id"
            label="话题ID"
            >
            </el-table-column>
            <el-table-column
            prop="topic_name"
            label="话题名">
            </el-table-column>
             <el-table-column
            prop="feed_total_cnt"
            label="累计动态数"
            >
            </el-table-column>
            <el-table-column
            prop="feed_read_total_cnt"
            label="累计阅读数"
            >
            </el-table-column>
            <el-table-column
            prop="create_time"
            label="话题生成时间">
            </el-table-column>
            <el-table-column
            label="推荐状态">
              <template slot-scope="scope">
                <span>{{scope.row.recommend == 1?'推荐中':'不推荐'}}</span>
              </template>
            </el-table-column>
            <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
                <el-button
                v-if="scope.row.recommend == 1"
                @click.native.prevent="updateRow(scope.$index, scope.row,0)"
                type="text"
                size="small">
                撤消推荐
                </el-button>
                <el-button
                v-else
                @click.native.prevent="updateRow(scope.$index, scope.row,1)"
                type="text"
                size="small">
                推荐
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
import { getTopicList,updateRecommendState ,addTopic ,updateTopic} from '../api/getData.js'
export default {
  name: "recommendList",
  data(){
    return{
        actId:'',//活动id
        curPage:1,//当前页码
        page_size:10,
        total:100,//数据总数
        topic_name:'',//话题名称
        tableData: []
    }
  },
  methods: {
    showList(){
      this.curPage = 1;
      this.topic_name = '';
      this.getTalkListData();
    },
    async getTalkListData(){
      let res  = await getTopicList({page:this.curPage,page_size:this.page_size,topic_name:this.topic_name});
      this.topic_name = '';
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
    findTopic(){
      this.actId = '';
      this.curPage = 1;
      this.getTalkListData();
    },
    async addTopic(){
      if(!this.actId){
        this.$message({
          showClose: true,
          message: '请输入添加话题',
          type: 'warning'
        });
        return;
      }
      let res = await addTopic({topic_name:this.actId});
      this.actId = '';
      if(res.code == 0){
        this.getTalkListData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    async updateRow(index,row,type){
      let res = await updateTopic({id:row.topic_id,recommend:type});
      if(res.code == 0){
        this.getTalkListData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getTalkListData();
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