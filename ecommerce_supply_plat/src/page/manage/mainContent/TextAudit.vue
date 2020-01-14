<template>
  <div class="content">
    <el-row>
      <el-col :span="24" class="top">
        <el-button-group>
          <!-- <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">待人工审核</el-button> -->
          <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">自动审核结果</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">已 审 核</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <!-- <el-main v-show="actTab==0">
      <el-row>共有27375条文字信息待人工审核</el-row>
      <el-row class="center">
        <el-col :span="12">
          从北京飞往东京的CA183航班，在旅客登机过程中，发现飞机前货舱冒烟，机组迅速采取灭火措施并组织全部旅客安全撤离。  
        </el-col>  
      </el-row>
      <el-row :gutter="20" class="center">
        <el-col :span="3" class="center">
          <el-button>不通过</el-button>
        </el-col>
        <el-col :span="3" class="center">
          <el-button type="primary">通过</el-button>
        </el-col>
      </el-row>
    </el-main> -->
    <el-main v-show="actTab==0">
      <el-row class="searchArea">
        <el-col :span="6">共有{{total}}条被自动审核驳回</el-col>
        <el-col :span="18" class="searchGroup">
          <el-row :gutter="20">
            <el-col :span="18">
              <el-input v-model="keyword" placeholder="按发布用户昵称查询"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="doSearch">查询</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px;">
        <el-table-column
          prop="feed_publish_time"
          label="发布时间"
          >
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="发布用户">
        </el-table-column>
        <el-table-column
          prop="feed_type"
          label="来源">
        </el-table-column>
        <el-table-column
          prop="feed_content"
          label="文字">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.feed_status==1">通过</span>
            <span v-if="scope.row.feed_status==0">不通过</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editRow(scope.$index, scope.row,1)"
              type="text"
              size="small">
              改为通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-main v-show="actTab==1">
      <el-row class="searchArea">
        <el-col :span="12">有{{feed_d_count}}条待人工审核，已审核{{feed_sh_count}}条，通过{{feed_pass_count}}（{{feed_sh_pass_rate}}），不通过{{feed_noPass_count}}（{{feed_sh_np_rate}}）</el-col>
        <el-col :span="12" class="searchGroup">
          <el-row :gutter="20">
            <el-col :span="18">
              <el-input v-model="keyword" placeholder="按发布用户昵称查询"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="doSearch">查询</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px;">
        <el-table-column
          prop="feed_publish_time"
          label="发布时间"
          >
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="发布用户">
        </el-table-column>
        <el-table-column
          prop="feed_type"
          label="来源">
        </el-table-column>
        <el-table-column
          prop="feed_content"
          label="文字">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.feed_status==1">通过</span>
            <span v-if="scope.row.feed_status==0">不通过</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.feed_status==1"
              @click.native.prevent="editRow(scope.$index, scope.row,0)"
              type="text"
              size="small">
              改为不通过
            </el-button>
            <el-button
              v-if="scope.row.feed_status==0"
              @click.native.prevent="editRow(scope.$index, scope.row,1)"
              type="text"
              size="small">
              改为通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-pagination
      v-if="actTab==0||actTab==1"
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
import { textList,hasPassTextData,setPassText } from '../../../api/getData.js'
export default {
  name: "badWordsStock",
  data(){
      return{
        curPage:1,//当前页码
        page_size:10,
        total:0,//数据总数
        actTab:0,
        sh_type:0,
        keyword:'',
        tableData: [],
        feed_d_count: 0,
        feed_noPass_count: 0,
        feed_pass_count: 0,
        feed_sh_count: 0,
        feed_sh_np_rate: 0,
        feed_sh_pass_rate: 0,
      }
  },
  components: {

  },
  mounted() {
    this.getData();
  },
  methods: {
    changeType(index){
      this.actTab = index;
      this.sh_type = index;
      this.curPage = 1;
      this.getData();
      if(index==1){
        this.getCount();
      }
    },
    handleCurrentChange(curPage){
      
      this.curPage = curPage;
      this.getData();
    },
    async getCount(){
      let res = await hasPassTextData();
      if(res.code==0){
        this.feed_d_count = res.data.feed_d_count;
        this.feed_noPass_count = res.data.feed_noPass_count;
        this.feed_pass_count = res.data.feed_pass_count;
        this.feed_sh_count = res.data.feed_sh_count;
        this.feed_sh_np_rate =  res.data.feed_sh_np_rate;
        this.feed_sh_pass_rate = res.data.feed_sh_pass_rate;
      }
    },
    async getData(){
      let res = await textList({page:this.curPage,page_size:this.page_size,sh_type:this.sh_type,keyword:this.keyword});
      if(res.code==0){
        this.tableData = res.data.data;
        this.total = res.data.total;
      }
    },
    doSearch(){
      this.curPage =1;
      this.getData();
    },
    async editRow(index,row,type){
      let res = await setPassText({
        id:row.feed_id,
        feed_status:type
      })
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
.content  .pubPagation{
  margin-top: 20px;
  float: right;
}
.content  .searchGroup{
  display: flex;
  justify-content: flex-end;
}
.content .searchArea{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content  .center{
  display: flex!important;
  justify-content: center!important;
  margin-top: 50px;
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