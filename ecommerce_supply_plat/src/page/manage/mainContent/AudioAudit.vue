<template>
  <div class="content">
    <el-row>
      <el-col :span="24" class="top">
        <el-button-group>
          <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">待人工审核</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">已 审 核 </el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-main v-show="actTab==0">
      <el-main v-if="!tableData.length">没有待审核信息</el-main>
      <el-main  v-for="(item,index) in tableData" :key="index">
        <el-row>共有{{total}}条音频信息待人工审核</el-row>
        <el-row type="flex" justfy="center" class="center mb">
          <el-col :span="12">
            {{nickName}} 发布{{audioType}}信息 {{timeStr}}
          </el-col>
        </el-row>
        <el-row type="flex" justfy="center" class="center mb">
          <el-col :span="12" class="center">
            <div class="audioBox">
              <!-- <audio class="audio"  controls="controls" ref='audio' @timeupdate="updateTime">
                <source type="audio/ogg">
                <source :src="musicUrl" type="audio/mpeg">
              </audio> -->
              <img src="../../../images/pause_icon.png" class="el-icon-video-pause" v-if="isPlay" @click="pauseAudio" alt="">
              <img src="../../../images/play_icon.png"  class="el-icon-video-play" v-if="!isPlay" @click="playAudio" alt="">
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="center mb2">
          <el-col :span="2" class="center">
            <el-button type="text" disabled>{{curTime}}</el-button>
          </el-col>
          <el-col :span="1" class="center">
            <el-button type="text" @click="rePlay">重播</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="center mb">
          <el-col :span="3" class="center">
            <el-button @click="auditVoice(item.pkid,0)">不通过</el-button>
          </el-col>
          <el-col :span="3" class="center">
            <el-button @click="auditVoice(item.pkid,1)" type="primary">通 过</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-main>
    <el-main v-show="actTab==1">
      <el-row class="searchArea">
        <el-col :span="6">有{{wCount}}条待人工审核，已审核{{total}}条</el-col>
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
      <el-table :data="tableData" style="width: 100%;margin-top:20px;">
        <el-table-column 
          prop="publish_time" 
          label="发布时间">
        </el-table-column>
        <el-table-column 
          prop="nickname" 
          label="发布用户">
        </el-table-column>
        <el-table-column 
          prop="rc_type" 
          label="来源">
        </el-table-column>
        <el-table-column 
          label="音频文件">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.playing" @click.native.prevent="handlePlay(scope.$index, scope.row)" type="text" size="small">
              播放
            </el-button>
            <el-button v-if="scope.row.playing" @click.native.prevent="handlePause(scope.$index, scope.row)" type="text" size="small">
              暂停
            </el-button>
          </template>
        </el-table-column>
        <el-table-column 
          prop="content" 
          label="发布状态">
          <template slot-scope="scope">
            <span v-if="scope.row.publish_status==1">有效中</span>
            <span v-else>已失效</span>
          </template>
        </el-table-column>
        <el-table-column 
          prop="status" 
          label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.audit_status==1">通过</span>
            <span v-else>未通过</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="scope.row.audit_status==1&&scope.row.publish_status==1" @click.native.prevent="editRow(scope.$index, scope.row,0)" type="text" size="small">
              改为不通过
            </el-button>
            <el-button v-if="scope.row.audit_status==0&&scope.row.publish_status==1" @click.native.prevent="editRow(scope.$index, scope.row,1)" type="text" size="small">
              改为通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-pagination v-if="actTab==1" class="pubPagation" @current-change="handleCurrentChange" :current-page.sync="curPage" :page-size="10" layout="prev, pager, next, jumper" :total="total">
    </el-pagination>
    <audio class="audioFile" id="audio" controls="controls" ref='audio' @timeupdate="updateTime">
      <source :src="musicUrl" type="audio/ogg">
      <source :src="musicUrl" type="audio/mpeg">
      <source :src="musicUrl" type="audio/mp3">
    </audio>
  </div>
</template>
<script>
import { audioList,aduitAudioState } from '../../../api/getData.js'
export default {
  name: 'audioAudit',
  data() {
    return {
      isPlay: false, //当前音频是否正在播放
      curPage: 1, //当前页码
      total: 0, //数据总数
      page_size:1,
      actTab: 0,
      curTime: '00分00秒',
      musicUrl: '',
      nickName: '',
      keyword:'',
      sh_type:0,// 0 未处理 1 已处理
      timeStr:'',
      audioType:'',
      wCount:0,
      tableData: []
    }
  },
  components: {},
  mounted() {
    this.getData();
  },
  methods: {
    doSearch(){
      this.curPage = 1;
      this.getData();
    },
    async getData(){
      let res = await audioList({page:this.curPage,page_size:this.page_size,file_type:1,sh_type:this.sh_type,keyword:this.keyword});
      if(res.code == 0){
        res.data.data.forEach(item => {
          item.playing = false;
        });
        this.tableData = res.data.data;
        this.total = res.data.total;
        this.lastPage = res.data.last_page;
        if(this.sh_type == 0&&res.data.data.length){
          this.isPlay = false;
          this.$refs.audio.src = res.data.data[0].resource;
          this.nickName = res.data.data[0].nickname;
          this.audioType = res.data.data[0].rc_type;
          let leftTime = Math.floor((new Date().getTime() - new Date(res.data.data[0].publish_time).getTime())/1000);
          
          if(leftTime/60>10){
            this.timeStr = res.data.data[0].publish_time
          }else{
            this.timeStr = Math.floor(leftTime/60)+'分钟前'
          }
        }else if(this.sh_type == 1&&res.data.data.length){
          this.wCount = res.data.data[0].countNum;
        }
      }
    },
    changeType(index) {
      this.actTab = index;
      this.sh_type = index;
      this.curPage = 1;
      if(index==0){
        this.page_size = 1;
      }else{
        this.page_size = 10;
      }
      this.getData();
    },
    async auditVoice(id,type){
      let res = await aduitAudioState({id:id,audit_status:type,sh_type:1});
      if(res.code==0){
        this.curPage =1;
        this.getData();
      }else{
        this.$message.error(res.message);
      }
    },
    async editRow(index,row,type){
      let res = await aduitAudioState({id:row.pkid,audit_status:type,sh_type:1});
      if(res.code==0){
        this.getData();
      }else{
        this.$message.error(res.message);
      }
    },
    handleCurrentChange(curPage) {
      this.curPage = curPage;
      this.getData();
    },
    handlePlay(index, row) {
      
      this.$refs.audio.src = row.resource;
      this.$refs.audio.play();
      this.tableData.forEach((item,i)=>{
        this.$set(this.tableData[i],'playing',false);
      })
      this.$set(this.tableData[index],'playing',true);
    },
    handlePause(index, row) {
      this.$refs.audio.src = row.resource;
      this.$set(this.tableData[index],'playing',false);
    },
    playAudio() {
      this.$refs.audio.play();
      this.isPlay = true;
    },
    pauseAudio() {
      this.$refs.audio.pause();
      this.isPlay = false
    },
    rePlay() {
      this.$refs.audio.play()
      this.$refs.audio.currentTime = 0
      this.isPlay = true
    },
    updateTime(e) {
      // 
      this.curTime = this.format(e.target.currentTime)
    },
    format(time) {
      let interval = time || 0
      let minute =
        Math.floor(interval / 60) > 9
          ? Math.floor(interval / 60)
          : '0' + Math.floor(interval / 60) || 0
      let second = this._pad(Math.floor(interval % 60))
      return `${minute}分${second}秒`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    }
  }
}
</script>

<style lang="scss" scoped>
.content .pubPagation {
  margin-top: 20px;
  float: right;
}
.content .searchGroup {
  display: flex;
  justify-content: flex-end;
}
.content .searchArea {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content .center {
  display: flex !important;
  justify-content: center !important;
  text-align: center;
}
.content .audioBox {
  width: 40px;
  height: 40px;
  position: relative;
}
.content .audio {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 40px;
  height: 40px;
}
.content .audioFile {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}
.content .mb {
  margin-top: 50px;
}
.content .mb2 {
  margin-top: 20px;
}
.content .el-icon-video-pause,
.content .el-icon-video-play {
  color:#333;
  font-size: 40px;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 40px;
  height: 40px;
}
.top {
  border-bottom: 1px solid #e5e5e5;
  .groupBtn {
    border-bottom: none !important;
  }
  .active {
    background-color: #409eff;
    color: #fff;
  }

  
}
</style>