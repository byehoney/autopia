<template>
  <div class="content">
    <el-row class="mb2">
      <el-col :span="12">共发布{{total}}个活动</el-col>
      <el-col :span="12" class="center">
        <el-radio-group v-model="type" class="mr2">
          <el-radio label="0">用户昵称</el-radio>
          <el-radio label="1">标题</el-radio>
        </el-radio-group>
        <el-input v-model="keyWord" placeholder="关键词" class="mr2 input"></el-input>
        <el-button type="primary" @click="doSearch">查 询</el-button>
      </el-col>
    </el-row>
    <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="activity_id"
          label="活动ID"
          >
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="发布时间"
          >
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="发布者">
        </el-table-column>
        <el-table-column
          prop="activity_name"
          label="活动标题">
        </el-table-column>
        <el-table-column
          prop="activity_departure_place"
          label="出发地">
        </el-table-column>
        <el-table-column
          prop="activity_begintime"
          label="出发日期"
          >
        </el-table-column>
        <el-table-column
          prop="activity_enroll_endtime"
          label="报名截止日"
          >
        </el-table-column>
        <el-table-column
          prop="activity_enroll_limit"
          label="人数上限">
        </el-table-column>
        <el-table-column
          prop="comment_cnt"
          label="评论">
        </el-table-column>
        <el-table-column
          prop="forward_cnt"
          label="转发">
        </el-table-column>
        <el-table-column
          prop="praise_cnt"
          label="点赞">
        </el-table-column>
        <el-table-column
          prop="read_cnt"
          label="阅读">
        </el-table-column>
        <el-table-column
          label="审核">
          <template slot-scope="scope">
            <span v-if="scope.row.activity_status==0">未通过</span>
            <span v-if="scope.row.activity_status==1">通过</span>
            <span v-if="scope.row.activity_status==2">删除</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, scope.row)"
              type="text"
              size="small">
              删除
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
      <el-dialog :visible.sync="dialogVisible" >
        <img width="100%" :src="origionPic" alt="">
      </el-dialog>
  </div>
</template>
<script>
import { activityListData ,delActivity} from '../../api/getData.js'
export default {
  name: "autoPublish",
  data(){
      return{
        type:'',//查询类型
        keyWord:'',//查询关键词
        curPage:1,//当前页码
        page_size:10,
        total:0,//数据总数
        dialogVisible:false,//图片放大容器
        origionPic:'',//放大显示图片
        tableData: [],
        type:''
      }
  },
  components: {

  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){
      let res = await activityListData({page_size:this.page_size,page:this.curPage,type:this.type,keyword:this.keyWord});
      if(res.code==0){
        this.tableData = res.data.data;
        this.total = res.data.total;
      }
    },
    doSearch(){
      if(!this.type){
        return
      }
      this.curPage = 1;
      this.getData();
    },
    handleCurrentChange(curPage){
      
      this.curPage = curPage;
      this.getData();
    },
    async doDel(row){
      let res = await delActivity({activity_id:row.activity_id});
      if(res.code == 0){
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    deleteRow(index,row){
      this.$confirm('删除该活动， 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDel(row);
        }).catch(() => {
          
        });
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
</style>