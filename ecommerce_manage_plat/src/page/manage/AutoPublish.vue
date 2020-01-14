<template>
  <div class="content">
    <el-row>
      <el-col :span="24" class="top">
        <el-button-group>
          <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">发布动态</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">上报路况</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-main v-show="actTab==0">
      <el-row class="topRow">
        <el-col :span="2">发布记录</el-col>
        <el-col :span="2">
          <el-button @click="addNewDynamic">添加动态</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          label="发布时间"
          >
          <template slot-scope="scope">
            {{scope.row.feed_status == 0?scope.row.feed_publish_time+'【预】':scope.row.feed_publish_time}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          >
          <template slot-scope="scope">
            {{scope.row.feed_status == 0?'待发布':'已发布'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="虚拟用户"
         >
        </el-table-column>
        <el-table-column
          label="正文内容"
          >
          <template slot-scope="scope">
            <span @click="showH5(scope.row)">{{scope.row.feed_content}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="照片">
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
          prop="place_name"
          label="地点">
        </el-table-column>
        <el-table-column
          prop="topic_name"
          label="话题">
        </el-table-column>
        <el-table-column
          label="操作"
         >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.feed_status==0"
              @click.native.prevent="editRow(scope.$index, scope.row)"
              type="text"
              size="small">
              编辑
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, scope.row)"
              type="text"
              size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-main v-show="actTab==1">
      <el-row class="topRow">
        <el-col :span="2">发布记录</el-col>
        <el-col :span="2">
          <el-button @click="addNewReport">新上报</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableDataTwo"
        style="width: 100%">
        <el-table-column
          prop="publish_time"
          label="上报时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="publish_status_str"
          label="状态"
          width="180">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="虚拟用户">
        </el-table-column>
        <el-table-column
          prop="rc_type_str"
          label="上报类型">
        </el-table-column>
        <el-table-column
          prop="content"
          label="上报内容">
        </el-table-column>
        <el-table-column
          prop="position_name"
          label="地点">
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="cancelPub(scope.$index, scope.row)"
              v-if="scope.row.publish_status==1"
              type="text"
              size="small">
              取消发布
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
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
    <PublishForm ref="publishForm" />
    <TraficForm  ref="traficForm"/>
  </div>
</template>
<script>
import { getAutoList ,getAutoTraficList ,delDynamic,cancelTrafic} from '../../api/getData.js'
import PublishForm from '../../components/publishForm.vue'
import TraficForm from '../../components/traficForm.vue'
export default {
  name: "autoPublish",
  data(){
      return{
        loading:false,
        curPage:1,//当前页码
        page_size:10,
        total:0,//数据总数
        actTab:0,//当前激活按钮
        dialogVisible:false,//图片放大容器
        origionPic:'',//放大显示图片
        tableData: [],
        tableDataTwo:[]
      }
  },
  components: {
    PublishForm,
    TraficForm
  },
  mounted() {
    this.getDynamicData();
  },
  methods: {
    showH5(row){
      
      window.open('https://www.baidu.com')
    },
    async getDynamicData(){
      this.loading = true;
      let res = await getAutoList({page_size:this.page_size,page:this.curPage});
      this.loading = false;
      if(res.code == 0){
        this.tableData = res.data.data;
        this.total = res.data.total;
      }else{
        this.$message.error(res.message);
      }
    },
    async getTraficData(){
      this.loading = true;
      let res = await getAutoTraficList({page_size:this.page_size,page:this.curPage});
      this.loading = false;
      if(res.code == 0){
        this.tableDataTwo = res.data.data;
        this.total = res.data.total;
      }else{
        this.$message.error(res.message);
      }
    },
    handleCurrentChange(curPage){
      if(curPage>Math.ceil(this.total/this.page_size)){
        return;
      }
      this.curPage = curPage;
      if(this.actTab == 0){
        this.getDynamicData();
      }else{
        this.getTraficData();
      }
    },
    previewImg(imgStr){
      this.dialogVisible = true;
      this.origionPic = imgStr;
    },
    changeType(index){
      this.actTab = index;
      this.curPage = 1;
      if(index == 0){
        this.tableData = [];
        this.getDynamicData();
      }else{
        this.tableDataTwo = [];
        this.getTraficData();
      }
    },
    addNewDynamic(){//添加动态
      this.$refs.publishForm.showDialogForm();
    },  
    editRow(index,row){//编辑动态
      this.$refs.publishForm.showDialogForm(row);
    },
    async deleteRow(index,row){
      let res = await delDynamic({id:row.feed_id});
      if(res.code==0){
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.getDynamicData();
      }else{
        this.$message.error(res.message);
      }
    },
    addNewReport(){
      this.$refs.traficForm.showDialogForm();
    },
    cancelPub(inde,row){
      
      this.$confirm('确定删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelTrafic({id:row.pkid}).then((res)=>{
          if(res.code  == 0){
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.getTraficData();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .smallPic{
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }
  .topRow{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
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
    .groupBtn{
      border-bottom: none!important;
    }
    .active{
      background-color: #409eff;
      color: #fff;
    }
  }
</style>
