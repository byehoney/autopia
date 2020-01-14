<template>
  <div class="content">
    <el-row>
      <el-col :span="24" class="top">
        <el-button-group>
          <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">待人工审核</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">自动审核结果</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==2?'active':'']" plain @click="changeType(2)">已 审 核</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-main v-if="actTab==0">
      <el-row class="mb2">共有{{total}}张图片待人工审核</el-row>
      <el-row :gutter="20" class="mb2" v-if="waiteImageList.length">
        <el-col class="imgCol" :span="8" v-for="(item,index) in waiteImageList"  :key="index">
          <el-row class="mb2">
              <img class="waitPic" :src="item.img" alt="" @click="previewImg(item.img)">
          </el-row>
          <el-row class="center" v-if="item.file_status == 1">
            <el-button class="mr2 danger" type="text">不通过</el-button>
            <el-button class="mr2"  @click="handleIsPass(index,item.id,0)">通过</el-button>
          </el-row>
          <el-row class="center" v-else>
            <el-button class="mr2"  @click="handleIsPass(index,item.id,1)">不通过</el-button>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="text-align:center;margin-bottom:50px" class="mb2" v-else>
        无可审核内容
      </el-row>
      <el-row class="center" v-if="waiteImageList.length">
        <el-button type="primary" @click="goNext">下 一 组</el-button>
      </el-row>
    </el-main>
    <el-main v-if="actTab==1">
      <el-row class="searchArea mb2">
        <el-col>共有{{total}}张图片未通过自动审核</el-col>
        <!-- <el-col :span="18" class="searchGroup">
          <el-row :gutter="20">
            <el-col :span="18">
              <el-input v-model="nickName" placeholder="按发布用户昵称查询"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary">查询</el-button>
            </el-col>
          </el-row>
        </el-col> -->
      </el-row>
      <el-row :gutter="20" class="mb2">
        <el-col :span="4" v-for="(item,index) in waiteImageList" :key="index" class="imgBox">
          <img :src="item.img" class="autoPic" alt="" @click="previewImg(item.img)">
          <el-button type="primary" circle class="passBtn" @click="handleIsPass(index,item.id,0)">通 过</el-button>
        </el-col>
      </el-row>
    </el-main>
    <el-main v-if="actTab==2">
      <el-row class="searchArea mb2">
        <el-col>有{{wCount}}条待人工审核，已审核{{hasCount}}条，通过{{passCount}}（{{passRate}}），不通过{{noPassCount}}（{{noPassRate}}）</el-col>
        <!-- <el-col :span="12" class="searchGroup">
          <el-row :gutter="20">
            <el-col :span="18">
              <el-input v-model="nickName" placeholder="按发布用户昵称查询"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary">查询</el-button>
            </el-col>
          </el-row>
        </el-col> -->
      </el-row>
      <el-row :gutter="20" class="mb2">
        <el-col :span="4" v-for="(item,index) in waiteImageList" :key="index" class="imgBox mb2">
          <img :src="item.img" class="autoPic" alt="" @click="previewImg(item.img)">
          <el-button type="primary" v-if="item.file_status==1" circle class="passBtn" @click="handleIsPass(index,item.id,0)">通 过</el-button>
          <el-button type="primary" v-else circle class="passBtn" @click="handleIsPass(index,item.id,1)">不通过</el-button>
        </el-col>
      </el-row>
    </el-main>
    <el-pagination
      v-if="actTab==1||actTab==2"
      class="pubPagation"
      @current-change="handleCurrentChange"
      :current-page.sync="curPage"
      :page-size="this.page_size"
      layout="prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog :visible.sync="dialogVisible" >
      <img width="100%" :src="origionPic" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { auditList ,aduitImageState,aduitMultiImageState} from '../../../api/getData.js'
export default {
  name: "imageAudit",
  data(){
      return{
        dialogVisible:false,//图片放大容器
        origionPic:'',//放大显示图片
        curPage:1,//当前页码
        page_size:3,
        lastPage:0,
        total:100,//数据总数
        actTab:0,
        nickName:'',
        waiteImageList:[],//待审核图片列表
        sh_type:0,//0待审核，1自动审核，2已审核
        wCount:0,//待审核
        hasCount:0,//已审核
        passCount:0,//通过
        noPassCount:0,//未通过
        passRate:0,//通过率
        noPassRate:0,//未通过率
      }
  },
  components: {

  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){ //type     0待审核，1自动审核，2已审核
      let res = await auditList({page:this.curPage,page_size:this.page_size,file_type:0,sh_type:this.sh_type});
      if(res.code == 0){
        this.waiteImageList = res.data.data;
        this.total = res.data.total;
        this.lastPage = res.data.last_page;
        if(this.sh_type==2){
          if(res.data.data.length){
            this.wCount = res.data.data[0].countNum;//待审核
            this.hasCount = res.data.data[0].shNum;//已审核
            this.passCount = res.data.data[0].passNum;//通过
            this.noPassCount = res.data.data[0].noPassNum;//未通过
            this.passRate = res.data.data[0].passingRate;//通过率
            this.noPassRate = res.data.data[0].noPassingRate;//未通过率
          }
        }
      }
    },
    previewImg(imgStr){
      this.dialogVisible = true;
      this.origionPic = imgStr;
    },
    changeType(index){
      this.actTab = index;
      this.sh_type = index;
      if(index==0){
        this.page_size = 3;
      }else{
        this.page_size = 30;
      }
      this.curPage = 1;
      this.getData(index);
    },
    handleCurrentChange(curPage){
      
      this.curPage = curPage;
      this.getData();
    },
    async handleIsPass(index,id,type){//单个图片审核
      let res = await aduitImageState({id:id,file_status:type,sh_type:2});
      if(res.code==0){
        this.getData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    async goNext(){//多图片审核 待人工审核
      if(this.curPage>this.lastPage+1){
        return;
      }
      let ids = [];
      let file_status = [];
      this.waiteImageList.forEach(item => {
        ids.push(item.id);
        file_status.push(item.file_status);
      });
      let res = await aduitMultiImageState({ids:ids.join(','),file_status:file_status.join(','),sh_type:2});
      if(res.code == 0){
        this.curPage++;
        this.getData();
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
.content .imgBox{
  position: relative;
}
.content .passBtn{
  position: absolute;
  right: 0;
  bottom: 0;
}
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
  text-align: center;
}
.danger{
  color: #F56C6C;
}
.content .mb2{
  margin-bottom: 20px;
}
.content .mr2{
  margin-right: 20px;
}

.content .waitPic{
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.content .autoPic{
  width: 100%;
  height: 200px;
  object-fit: cover;
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