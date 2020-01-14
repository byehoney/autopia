<template>
  <div class="homeContainer">
    <!-- 烟花头开始 -->
    <LocalHeader/>
    <!-- 烟花头结束 -->
    <!-- 轮播图 -->
    <div class="loop_pic">
      <!-- <div> -->
      <mt-swipe :auto="4000" :show-indicators="true">
        <mt-swipe-item class="item" v-for="(item,index) in bannerList" :key="index">
          <img :src="item" alt="">
        </mt-swipe-item>
        <!-- <mt-swipe-item class="item">
          <img src="../images/banner_02.png" alt="">
        </mt-swipe-item>
        <mt-swipe-item class="item">
          <img src="../images/banner_02.png" alt="">
        </mt-swipe-item> -->
      </mt-swipe>
      <!-- </div> -->
      <!-- 轮播图 -->

      <div class="classify">
        <div class="classify_header">
          <div class="classify_header_left">
            <span></span>
            <span>热门分类</span>
          </div>
          <div class="classify_header_right">
            <router-link to="/classify">
              <img src="../images/home_header_class.png">
            </router-link>
          </div>
        </div>
        <div class="classify_content">
          <ul>
            <li v-for="(item,index) in heatList" :key="index" @click="goMoreClass(item.kindCode,index)">
              <a href="javascript:void(0)">
                <img :src="item.kindImage">
                <span>{{item.kindName}}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 热门分类 -->
    <div class="recommond" v-if="boutique.length>0">
      <div class="recommond_header">
        <span></span>
        <span>团购新品</span>
      </div>
      <div class="recommond_content" @click="goChoose(2)">
        <div class="recommond_item" v-for="(item,index) in boutique" :key="index">
          <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
          <p class="tip_bg"></p>
        </div>
        <!-- <div class="recommond_item">
          <img :src="boutique[1].url?boutique[1].url:require('../images/default_logo.jpg')" alt="">
          <p class="tip_bg"></p>
        </div>
        <div class="recommond_item">
          <img :src="boutique[2].url?boutique[2].url:require('../images/default_logo.jpg')" alt="">
          <p class="tip_bg"></p>
        </div> -->
      </div>
    </div>
    <div class="act_area" v-if="showTc||showMz">
      <router-link to="/hotSuit" v-if="showTc">
        <img src="../images/suit_banner.png" alt="">
      </router-link>
      <router-link to="/bestGoods" v-if="showMz">
        <img src="../images/specil_banner.png" alt="">
      </router-link>
    </div>
    <!-- 限时秒杀 -->
    <div class="special" v-if="secKillList.length>0" @click="goChoose(3)">
      <div class="special_wrap">
        <div class="special_header">
          <span></span>
          <span>限时秒杀</span>
          <span>
            <div>{{H}}</div>:
            <div>{{M}}</div>:
            <div>{{S}}</div>
          </span>
        </div>
        <div class="special_content">
          <div
            :class="cx==index?'actives':''"
            class="special_content_left fix"
            v-for="(item,index) in secKillList"
            :key="index"
          >
            <img class="ms_icon" src="../images/ms_icon.png" alt="">
            <img :src="item.url?item.url:require('../images/default_logo.jpg')">
          </div>
        </div>
      </div>
    </div>
    <!-- special 结束 -->
    <div class="home_video" style="display:no-ne">
      <div class="home_video_list" v-for="(item,index) in videoList" :key="index">
        <div class="home_video_list_header">
          <h3>{{item.description}}</h3>
        </div>
        <div class="home_video_list_content detail_loop">
          <video-player   class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="item.source"
                @play="onPlayerPlay($event,index)"
            >
          </video-player>
          <!-- <video
            class="myVideo"
            playsinline="true"
            x-webkit-airplay="true" 
            x5-playsinline="true"
            webkit-playsinline="true" 
            x5-video-player-type="h5"
            poster="../images/banner_01.jpg"
            controls
          >
            <source src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" type="video/mp4">
          </video> -->
        </div>
      </div>
    </div>
    <!-- <DrawerLeft/> -->
    <TabBarBottom curTab="home"/>
  </div>
</template>
<script>
// @ is an alias to /src
import axios from 'axios'
import DrawerLeft from "@/components/DrawerLeft";
import TabBarBottom from "@/components/TabBarBottom";
import LocalHeader from "@/components/Header";
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'

//引入video样式
// import "video.js/dist/video-js.css";
// import "vue-video-player/src/custom-theme.css";
// //引入hls.js
// import "videojs-contrib-hls.js/src/videojs.hlsjs";

import { getHeatList,getIndexInfo, getSpecialList, secKill ,getActivityInfo,getBannerVideo} from "@/api/index";
import { mapState,mapGetters } from "vuex";
import { setInterval, setTimeout } from "timers";
export default {
  name: "home",
  data() {
    return {
      bannerList:[],
      videoList:[],
      showTc:false,//显示套餐活动入口
      showMz:false,//显示买赠活动入口
      timer: null,
      H: 0, //倒计时
      M: 0, //倒计分
      S: 0, //倒计秒
      msList: [[8, 12], [12, 16], [16, 20]], //秒杀时间段
      heatList: [],
      boutique: [],
      secKillList: [],
      cx: 0, //限时特价促销的判断条件
    };
  },

  components: {
    DrawerLeft,
    TabBarBottom,
    LocalHeader,
    videoPlayer
  },
  async mounted() {
    console.log(this.userRole)
    if(this.userRole&&this.userRole!='06'&&this.userRole!='07'&&this.userRole!='09'&&this.userRole!='10'){
      this.$router.replace('/manageHome');
    }else if(this.userRole&&this.userRole=='10'){
      this.$router.replace('/driverHome');
    }else if(this.userRole&&this.userRole=='09'){
      this.$router.replace('/keeperHome');
    }
    let data = {};
    axios.post('/index/get/operation.do',data).then((res)=>{
      console.log(res)
      let banners = [];
      let videoList = [];
      res.data.data.pictures.forEach((item,index)=>{
        banners.push('http://119.3.219.52:8080/platform/getImageStream.do?urlPath='+item);
      })
      res.data.data.videos.forEach((item,index)=>{
        let infos ={
          description:item.description,
          poster:'http://119.3.219.52:8080/platform/getImageStream.do?urlPath='+item.imageUrl,
          source:{
            playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
            autoplay: false, //如果true,浏览器准备好时开始回放。
            muted: false, // 默认情况下将会消除任何音频。
            loop: false, // 导致视频一结束就重新开始。
            preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            language: 'zh-CN',
            aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            sources: [{
              src: item.videoUrl,  // 路径
            }],
            poster: 'http://119.3.219.52:8080/platform/getImageStream.do?urlPath='+item.imageUrl, //你的封面地址
            notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
            controlBar: {
              fullscreenToggle: true  //全屏按钮
            }
          }
        }
        videoList.push(infos);
      })
      this.bannerList = banners;
      this.videoList = videoList;
    })
    let defaulParams = {
        token:this.token,
        userId:this.userId,
        corpCode:this.corpCode,
        companyId:this.companyId,
        userRole:this.userRole,
    } 
    let res = await getIndexInfo(defaulParams);
    if(res.code==0){
      this.heatList = res.data.rmList;
      this.boutique = res.data.tjList;
      this.secKillList = res.data.msList.splice(0,3);
      this.count();
      this.showTc = res.data.tcCount>0?true:false;
      this.showMz = res.data.mzCount>0?true:false;
    }
    // //热门分类
    // let { data } = await getHeatList(defaulParams);
    // this.heatList = data.list;
    // //精品推荐
    // let specialData = await getSpecialList({...defaulParams,pageSize:4});
    // this.boutique = specialData.data.list;
    // //限时秒杀
    // let killdata = await secKill({...defaulParams,pageSize: 3});
    // this.secKillList = killdata.data.list;
    // this.count();
    // // 是否显示精品买赠 套餐活动
    // let actInfo = await getActivityInfo(defaulParams);
    // this.showTc = actInfo.data.tcCount>0?true:false;
    // this.showMz = actInfo.data.mzCount>0?true:false;
  },
  methods: {
    onPlayerPlay(player,index){
      if(document.getElementsByClassName('vjs-play-control vjs-control vjs-button vjs-playing').length>1){
        this.videoList.forEach((item,jIndex)=>{
          if(index!=jIndex){
            document.getElementsByClassName('vjs-play-control vjs-control vjs-button vjs-playing')[jIndex].click();
          }
        })
      }
      // this.player[1].$listeners.play(false)
    },
    goChoose(index){
      this.$router.push({name:'choose',query:{showTab:index}})
    },
    goMoreClass(code,index){
      this.$router.push({name:'classify',query:{code:code,index:index}})
    },
    count() {
      this.timer = setInterval(() => {
        let nowH = new Date().getHours();
        let nowM = new Date().getMinutes();
        let nowS = new Date().getSeconds();
        let nowTime = new Date().getHours();
        let leftsecond = "";
        if (nowH >= this.msList[0][0] && nowH < this.msList[0][1]) {
          leftsecond =
            this.msList[0][1] * 60 * 60 - (nowH * 60 * 60 + nowM * 60 + nowS);
        } else if (nowH >= this.msList[1][0] && nowH < this.msList[1][1]) {
          leftsecond =
            this.msList[1][1] * 60 * 60 - (nowH * 60 * 60 + nowM * 60 + nowS);
        } else if (nowH >= this.msList[2][0] && nowH < this.msList[2][1]) {
          leftsecond =
            this.msList[2][1] * 60 * 60 - (nowH * 60 * 60 + nowM * 60 + nowS);
        }
        // leftsecond--;
        if (leftsecond >= 0) {
          this.H =
            parseInt((leftsecond / 3600) % 24) < 10
              ? "0" + parseInt((leftsecond / 3600) % 24)
              : parseInt((leftsecond / 3600) % 24);
          this.M =
            parseInt((leftsecond / 60) % 60) < 10
              ? "0" + parseInt((leftsecond / 60) % 60)
              : parseInt((leftsecond / 60) % 60);
          this.S =
            parseInt(leftsecond % 60) < 10
              ? "0" + parseInt(leftsecond % 60)
              : parseInt(leftsecond % 60);
        } else {
          this.H = "00";
          this.M = "00";
          this.S = "00";
          clearInterval(this.timer);
        }
      }, 1000);
    },
  },

  computed: {
    ...mapState("login", ["user"]),
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole']),
    player() {
      return this.$refs.videoPlayer;
    }
  }
};
</script>
<style lang="scss" scoped>
.mint-swipe .mint-swipe-indicator{
  background-color: #fff;
}
.classify_content ul{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.mint-swipe{
  position: relative;
  z-index: 10;
  height: 354px;
}
.home_video_list_content .myVideo{
  width: 100%;
  height: 500px;
}
.homeContainer {
  padding-bottom: 120px;
  opacity: 1;
  background-color: #fff;
}
.loop_pic {
  width: 750px;
  height: 703px;
  // margin-bottom: 15px;
  /* background: #ccc; */
  position: relative;
}
.recommond{
  background-color: #fff;
  // margin-bottom: 30px;
}
.recommond_content{
  padding: 16px;
  height: 254px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .recommond_item{
    width: 228px;
    height: 259px;
    position: relative;
    border: 2px solid #E32323;
    border-radius:6px;
    .tip_bg{
      width: 228px;
      height: 61px;
      background: url('../images/star_goods.png') no-repeat 0 0;
      background-size: 100% 100%;
      position: absolute;
      left: 0;
      bottom: 10px;
    }
    img{
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }
}
.act_area{
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  a{
    display: block;
    width: 347px;
    height: 229px;
    border-radius: 8px;
    img{
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }
}
.item {
  width: 100%;
  height: 613px;
}
// .item:nth-of-type(1) {
//   // background: #FF0304;
// }
// .item:nth-of-type(2) {
//   // background: #ccc;
// }
// .item:nth-of-type(3) {
//   // background: #FF0304;
// }
.loop_pic {
  margin-top: 80px;
}
.loop_pic img {
  width: 100%;
}
.classify {
  width: 100%;
  min-height: 344px;
  background: #fff;
  // margin-bottom: 15px;
  position: absolute;
  left: 0;
  bottom: 0;
  // border-radius: 10px;
}
.classify_header,
.recommond_header,
.special_header {
  height: 98px;
  line-height: 98px;
  font-size: 28px;
  color: #333;
  // margin-bottom: 32px;
  padding-left: 40px;
  border-bottom: 2px solid rgba(255, 37, 62, 0.1);
}
.classify_header{
  margin-bottom: 32px;
  border-bottom: none;
}
.classify_header span:nth-of-type(1),
.recommond_header span:nth-of-type(1),
.special_header span:nth-of-type(1) {
  background: url("../images/home/block.png") center 5px no-repeat;
  display: inline-block;
  width: 10px;
  height: 25px;
  margin-right: 8px;
}

.classify_header_left {
  width: 134px;
  float: left;
}
.classify_header_right {
  float: right;
  width: 41px;
  height: 9px;
  margin-right: 29px;
}
.classify_header_right img {
  width: 100%;
}
.classify_content ul li {
  width: 115px;
  height: 115px;
  border-radius: 50%;
  font-size: 26px;
  float: left;
  text-align: center;
  // margin-left: 40px;
}
.classify_content ul li:last-child {
  margin-right: 0;
}
.classify_content ul li img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  margin-bottom: 33px;
}
.classify_content ul li span {
  display: inline-block;
  width: 117px;
  height: 35px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 限时特价 */
.special {
  // width: 750px;
  min-height: 357px;
  // background: #fff;
  padding:0 16px 33px;
  margin-top: 16px;
}
.special_header {
  padding-left: 24px;
  margin-bottom: 0!important;
  border-bottom: 2px solid rgba(255,37,62,0.1);
  background: #fff;
}
.special_header span:nth-of-type(3) {
  color: #E32323;
  margin-left: 8px;
}
.special_header span:nth-of-type(3) div {
  display: inline-block;
  width: 33px;
  height: 33px;
  color: #fff;
  background: #E32323;
  text-align: center;
  line-height: 34px;
  font-size: 18px;
  margin-right: 8px;
  position: relative;
  top: -5px;
}
.special_content {
  background: #fff;
  padding: 12px 16px 9px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
}
.special_content_left {
  width: 224px;
  height: 229px;
  background: #fff;
  margin-right: 12px;
  border: 2px solid #E32323;
  border-radius: 8px;
  font-size: 18px;
  position: relative;
}
.cx_title {
  min-height: 46px;
  line-height: 46px;
}
// .special_content_left.actives {
//   // background: #fadfc5;
//   // border: 11px solid #fadfc5;
// }
.special_content_left img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}
.special_content_left .ms_icon{
  width: 45px;
  height: 47px;
  position: absolute;
  top: 0;
  left: 14px;
}
.special_content_left:nth-of-type(3) {
  margin-right: 0;
}
.home_video {
  padding-bottom: 100px;
}
.home_video_list {
  width: 750px;
  height: 420px;
  font-size: 24px;
  margin-bottom: 100px;
}
.home_video_list_header h3 {
  color: #666;
  margin-left: 35px;
  font-size: 24px;
}
.home_video_list_header {
  height: 92px;
  line-height: 92px;
}
.home_video_list_content video {
  width: 100%;
  height: 200px;
  margin-bottom: 100px;
}
.video-js .vjs-big-play-button{
     /*
      播放按钮换成圆形
     */
    height: 100px;
    width: 100px;
    line-height: 100px;
    border-radius: 50%;
}

.recommond_center_top img,
.recommond_center_bottom img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}
</style>
