<template>
  <div class="hq_content content">
    <el-row>
      <el-col :span="24" class="top">
        <el-button-group>
          <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">轮 转 图</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">首页内容</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==2?'active':'']" plain @click="changeType(2)">达 人 榜</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==3?'active':'']" plain @click="changeType(3)">群 首 页</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==4?'active':'']" plain @click="changeType(4)">活动首页</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==5?'active':'']" plain @click="changeType(5)">话题管理</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==6?'active':'']" plain @click="changeType(6)">默认关注</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-main v-if="actTab==0">
      <el-row :gutter="10" v-for="(item,index) in swiperList" :key="index" class="center bb mb2 pb2">
        <el-col :span="2">位置{{index+1}}</el-col>
        <el-col :span="3">
          <el-button type="primary"  circle v-if="index>0" @click="updateOrder(item,0)">上</el-button>
          <el-button type="primary"  circle v-if="index<swiperList.length-1" @click="updateOrder(item,1)">下</el-button>
        </el-col>
        <el-col :span="4">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl+'/op/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            >
            <img :fit="fit" v-if="item.ab_icon_url" @click="setLoopIndex(index,item.ab_type)" :src="item.ab_icon_url" class="avatar">
            <i v-else  @click="setLoopIndex(index,item.ab_type)" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="2" class="center mid">
          <el-button type="danger" icon="el-icon-delete" circle @click="delLoop(item,index)" v-if="swiperList.length>1"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="delLoop(item,index)" disabled v-else></el-button>
        </el-col>
        <el-col :span="11">
          <el-col class="mb2">
            <el-button-group class="targetGroup">
              <!-- <el-button type="text">目标类型：</el-button> -->
              <el-button :class="[item.ab_type==tIndex+1?'targetActive':'']" @click="setTarget(index,tIndex)" v-for="(target,tIndex) in targetList" :key="tIndex" size="mini">{{target}}</el-button>
            </el-button-group>
          </el-col>
          <el-col>
            <el-input  v-model="item.ab_outsite_url" v-if="item.ab_type==1" placeholder="请输入网址" style="width:300px"></el-input>
            <el-input  v-model="item.ab_biz_id" v-if="item.ab_type==2" placeholder="活动id" style="width:200px"></el-input>
            <el-input  v-model="item.ab_biz_id" v-if="item.ab_type==3" placeholder="动态id" style="width:200px"></el-input>
            <el-input  v-model="item.ab_biz_id" v-if="item.ab_type==4" placeholder="用户id" style="width:200px"></el-input>
            <el-input  v-model="item.ab_biz_id" v-if="item.ab_type==5" placeholder="话题" style="width:200px"></el-input>
            <el-input  v-model="item.ab_biz_id" v-if="item.ab_type==6" placeholder="群id" style="width:200px"></el-input>

          </el-col>
        </el-col>
        <el-col :span="2" class="centerArea mt2"><el-button type="primary" @click="saveLoop(item)">保  存</el-button></el-col>
      </el-row>
      <el-row class="mt2">
        <el-col>
          <el-button @click="addNewLoop">新增轮转图</el-button>
        </el-col>
      </el-row>
    </el-main>
    <el-main v-if="actTab==1">
      <RecommendList ref ="recommendList" />
    </el-main>
    <el-main v-if="actTab==2">
      <TalentRank ref="talentRank"/>
    </el-main>
    <el-main v-if="actTab==3">
      <GroupList ref="groupList" />
    </el-main>
    <el-main v-if="actTab==4">
      <ActivityList ref="activityList"/>
    </el-main>
    <el-main v-if="actTab==5">
      <TalkList ref="talkList"/>
    </el-main>
    <el-main v-if="actTab==6">
      <FllowList ref="fllowList"/>
    </el-main>
  </div>
</template>
<script>
import { baseUrl } from '../../config/env.js'
import {upRecord,downRecord,getRecord} from '../../utils'
import RecommendList from '../../components/recommendList.vue'
import TalentRank from '../../components/talentRank.vue'
import ActivityList from '../../components/activityList.vue'
import TalkList from '../../components/talkList.vue'
import FllowList from '../../components/fllowList.vue'
import GroupList from '../../components/groupList.vue'
import { getBannerList ,addBanner ,delBanner ,moveBanner} from '../../api/getData.js';
export default {
  name: "autoPublish",
  data(){
      return{
        baseUrl:'',
        fit:'cover',
        curPage:1,//当前页码
        total:100,//数据总数
        actTab:0,
        curLoopIndex:0,//当前操作轮播的索引
        targetList:['链接','活动详情','动态详情','用户主页','话题','车友群','达人榜'],//目标列表
        swiperList:[]
      }
  },
  components: {
    RecommendList,
    TalentRank,
    ActivityList,
    TalkList,
    FllowList,
    GroupList
  },
  mounted() {
    this.baseUrl = baseUrl;
    this.getBannerData();
  },
  methods: {
    changeType(index){
      this.actTab = index;
      if(index == 0){//选择轮播栏目  直接刷新
        this.getBannerData();
      }else if(index == 1){
        
        this.$nextTick(()=>{
           this.$refs.recommendList.showList();
        })
      }else if(index == 2){
        this.$nextTick(()=>{
          this.$refs.talentRank.showList();
        })
      }else if(index == 4 ){
        this.$nextTick(()=>{
          this.$refs.activityList.showList();
        })
      }else if(index == 5 ){
        this.$nextTick(()=>{
          this.$refs.talkList.showList();
        })
      }else if(index == 6 ){
        this.$nextTick(()=>{
          this.$refs.fllowList.showList();
        })
      }
    },
    async  getBannerData(){
      let res = await getBannerList();
      if(!res.data.length){
        this.swiperList = [{
          ab_biz_id: null,
          ab_icon: "",
          ab_icon_url: "",
          ab_id: '',
          ab_outsite_url: '',
          ab_type: 1
        }]
      }else{
        this.swiperList = res.data;
      }
      
    },
    setLoopIndex(index,type){//设置当前操作轮播索引
      this.curLoopIndex = index;
    },
    handleAvatarSuccess(res, file) {
      
      this.$set(this.swiperList[this.curLoopIndex],'ab_icon_url', URL.createObjectURL(file.raw));
      this.$set(this.swiperList[this.curLoopIndex],'ab_icon', file.response.data.file_complete_url);
    },
    setTarget(index,tIndex){//设置当前操作轮播 目标类型 索引
      this.$set(this.swiperList[index],'ab_type',tIndex+1)
    },
    addNewLoop(){//新增轮播
      if(!this.checkIscan()){
        return;
      }
      this.swiperList = [
        ...this.swiperList,
      {
        ab_biz_id: null,
        ab_icon: "",
        ab_icon_url: "",
        ab_id: '',
        ab_outsite_url: '',
        ab_type: 1
      }];
    },
    async delLoop(row,order){//删除轮播
      if(!row.ab_id){
        // this.swiperList = this.swiperList.filter((item,index)=>index!=order)
        this.getBannerData();
      }else{
        let res = await delBanner({
          id:row.ab_id
        })
        if(res.code == 0){
          this.getBannerData();
        }else{
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      }
      // this.swiperList = this.swiperList.filter((item,index)=>index!=order)
    },
    async updateOrder(row,type){//更新轮播拍讯
      
      if(!this.checkIscan()){
        return;
      }
      let res = await moveBanner({
        id:row.ab_id,
        type:type
      })
      if(res.code==0){
        this.getBannerData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
      // if(type == 'up'){
      //   this.swiperList = upRecord(this.swiperList,index)
      // }else{
      //   this.swiperList = downRecord(this.swiperList,index)
      // }
    },
    async saveLoop(row){//保存轮播信息
      if(!this.checkIscan()){
        return;
      }
      let res  = await addBanner({
        ab_icon:row.ab_icon,
        ab_type:row.ab_type,
        ab_outsite_url:row.ab_type==1?row.ab_outsite_url:'',
        ab_biz_id:row.ab_type!=1?row.ab_biz_id:'',
        id:row.ab_id
      })
      if(res.code == 0){
        this.getBannerData();
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
    },
    checkIscan(){//检查轮播图添加信息是否添加完整
      let checkResult = false;
      this.swiperList.forEach((item,index) => {
        if(item.ab_icon_url==''){
          this.$message({
            message: '请完善轮播图片信息后再操作',
            type: 'warning'
          });
          checkResult = false;
        }else if((item.ab_type==1&&item.ab_outsite_url=='')||((item.ab_type==2||item.ab_type==3||item.ab_type==4||item.ab_type==5||item.ab_type==6)&&item.ab_biz_id=='')){
          this.$message({
            message: '请完善轮播目标类型信息后再操作',
            type: 'warning'
          });
          checkResult = false;
        }else{
          checkResult = true;
        }
      });
      return checkResult;
    }
  },
};
</script>

<style lang="scss" scoped>
.content .mb2{
  margin-bottom: 20px;
}
.content .mt2{
  margin-top: 20px;
}
.content .pb2{
  padding-bottom: 20px;
}
.content .bb{
  border-bottom: 1px solid #efefef;
}
.content .targetGroup{
  display: flex;
}
.content  .targetActive{
  background-color: #409eff;
  color: #fff;
}
.content .center{
  display: flex!important;
  align-items: center!important;
}
.content  .centerArea{
  display: flex!important;
  align-items: center!important;
  justify-content: center!important;
}
.content  .mid{
  justify-content: center;
}
.hq_content  .avatar-uploader {
  width: 150px;
  height: 150px;
}
.hq_content  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .hq_content  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .hq_content .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
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