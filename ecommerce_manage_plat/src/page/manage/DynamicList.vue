<template>
  <div class="content">
    <el-row class="mb2">
      <el-col :span="12">共发布{{total}}条动态，其中虚拟用户发布{{suppositional}}条，真实用户发布{{publish}}条</el-col>
      <el-col :span="12" class="center">
        <el-radio-group v-model="type" class="mr2">
          <el-radio label="0">用户昵称</el-radio>
          <el-radio label="1">内容</el-radio>
        </el-radio-group>
        <el-input v-model="keyWord" placeholder="关键词" class="mr2 input"></el-input>
        <el-button type="primary" @click="doSearch">查 询</el-button>
      </el-col>
    </el-row>
    <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="feed_id"
          label="动态ID"
        >
        </el-table-column>
        <el-table-column
          prop="feed_publish_time"
          label="发布时间"
        >
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="发布者">
        </el-table-column>
        <el-table-column
          prop="feed_content"
          label="内容">
        </el-table-column>
        <el-table-column
          label="图片"
          >
          <template slot-scope="scope">
            <el-button type="text" v-for="(item,index) in scope.row.picture" :key="index" @click="previewImg(item)">{{index+1}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="topic_name"
          label="关联话题">
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
import { dynamicListData,dataCount,delDynamic } from '../../api/getData.js'
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
        suppositional:0,
        publish:0,
      }
  },
  components: {

  },
  mounted() {
    this.getData();
    this.getCount();
  },
  methods: {
    doSearch(){
      if(!this.type){
        return
      }
      this.curPage = 1;
      this.getData();
    },
    async getData(){
      let res = await dynamicListData({page_size:this.page_size,page:this.curPage,type:this.type,keyword:this.keyWord});
      if(res.code==0){
        this.tableData = res.data.data;
        this.total = res.data.total;
      }
    },
    async getCount(){
      let res = await dataCount();
      if(res.code == 0){
        this.suppositional = res.data.suppositional;
        this.publish = res.data.publish;
      }
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getData();
    },
    previewImg(imgStr){
      this.dialogVisible = true;
      this.origionPic = imgStr;
    },
    async doDel(row){
      let res = await delDynamic({id:row.feed_id});
      if(res.code == 0){
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.getData();
        this.getCount();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },  
    deleteRow(index,row){
      this.$confirm('删除该动态， 是否继续?', '提示', {
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