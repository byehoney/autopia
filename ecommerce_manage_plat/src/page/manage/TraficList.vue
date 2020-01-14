<template>
  <div class="content">
    <el-row class="mb2">
      <el-col :span="12">共发布{{total}}条动态，其中虚拟用户发布{{false_count}}条，真实用户发布{{true_count}}条</el-col>
      <el-col :span="12" class="center">
        <el-input v-model="keyWord" placeholder="请输入发布者昵称" class="mr2 input"></el-input>
        <el-button type="primary" @click="doSearch">查 询</el-button>
      </el-col>
    </el-row>
    <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="pkid"
          label="路况ID"
        >
        </el-table-column>
        <el-table-column
          prop="publish_time"
          label="发布时间"
        >
        </el-table-column>
        <el-table-column
          prop="publish_status_str"
          label="发布状态"
        >
        </el-table-column>
        <el-table-column
          prop="date"
          label="审核状态"
        >
          <template slot-scope="scope">
            <span>{{scope.row.audit_status==0?'未通过':'通过'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="发布者">
        </el-table-column>
        <el-table-column
          label="发布方式">
          <template slot-scope="scope">
            <span v-if="scope.row.publish_type==1">快速发布</span>
            <span v-else-if="scope.row.publish_type==2">语音</span>
            <span v-else-if="scope.row.publish_type==3">拍照</span>
            <span v-else>拍照</span>
          </template>
        </el-table-column>
        <el-table-column
          label="内容">
          <template slot-scope="scope">
            <el-row v-if="scope.row.resource.image.length">
              <el-button type="text" v-for="(item,index) in scope.row.resource.image" :key="index" @click="previewImg(item)">{{index+1}}</el-button>
            </el-row>
            <el-row v-if="scope.row.resource.voice.length">
              <el-button type="text" v-for="(item,index) in scope.row.resource.voice" :key="index" @click="playAudio(scope.$index,item,scope.row.isplay?0:1)">{{scope.row.isplay==true?'暂停':'播放'}}</el-button>
            </el-row>
            <el-row v-if="!scope.row.resource.voice.length&&!scope.row.resource.image.length">
              <span>---</span>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          prop="position"
          label="位置">
        </el-table-column>
        <el-table-column
          label="准确"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small">
              {{scope.row.rights}}（{{(scope.row.rights+scope.row.wrongs)>0?(scope.row.rights/(scope.row.rights+scope.row.wrongs))*100:0}}%）
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="有误"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small">
              {{scope.row.wrongs}}（{{(scope.row.rights+scope.row.wrongs)>0?(scope.row.wrongs/(scope.row.rights+scope.row.wrongs))*100:0}}%）
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="readings"
          label="阅读">
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.publish_status==1"
              @click.native.prevent="updateRow(scope.$index, scope.row,0)"
              type="text"
              size="small">
              失效
            </el-button>
            <el-button
              v-if="scope.row.publish_status==0"
              @click.native.prevent="updateRow(scope.$index, scope.row,1)"
              type="text"
              size="small">
              生效
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
      <audio class="audioFile" controls="controls" ref='audio'>
        <source :src="musicUrl" type="audio/ogg">
        <source :src="musicUrl" type="audio/mpeg">
        <source :src="musicUrl" type="audio/mp3">
      </audio>
  </div>
</template>
<script>
import { traficListData,upDatatraficData } from '../../api/getData.js'
export default {
  name: "autoPublish",
  data(){
      return{
        musicUrl: '',
        type:'',//查询类型
        keyWord:'',//查询关键词
        curPage:1,//当前页码
        page_size:10,
        total:0,//数据总数
        false_count:0,//虚拟用户发布数
        true_count:0,//真实用户发布数
        dialogVisible:false,//图片放大容器
        origionPic:'',//放大显示图片
        tableData: []
      }
  },
  components: {

  },
  mounted() {
    this.getData();
  },
  methods: {
    playAudio(index,resource,type){//type: 0 暂停   1 播放
      
      this.$refs.audio.src = resource;
      if(type == 1){
        this.tableData.forEach((item,i)=>{
          this.$set(this.tableData[i],'isplay',false);
        })
        this.$set(this.tableData[index],'isplay',true);
        this.$refs.audio.play();
      }else{
        this.$set(this.tableData[index],'isplay',false)
        this.$refs.audio.pause();
      }
    },
    previewImg(imgStr){
      this.dialogVisible = true;
      this.origionPic = imgStr;
    },
    async getData(){
      this.$refs.audio.pause();
      let res = await traficListData({page:this.curPage,page_size:this.page_size,nickname:this.keyWord});
      if(res.code == 0){
        res.data.feed_list.data.forEach(item => {
          item.isplay = false;
        });
        this.tableData = res.data.feed_list.data;
        this.total = res.data.feed_list.total;
        this.false_count = res.data.false_count;
        this.true_count = res.data.true_count;
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
    async doUpData(row,type){
      let res = await upDatatraficData({id:row.pkid,status:type});
      if(res.code == 0){
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.getData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    async updateRow(index,row,type){
      if(type == 0){
        this.$confirm('删除该活动， 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doUpData(row,type);
        }).catch(() => {
          
        });
      }else{
        this.doUpData(row,type);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.content .audioFile{
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  z-index: -1;
  left: 0;
  right: 0;
}
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