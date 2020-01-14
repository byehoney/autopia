<template>
  <div id="usersPosition">
    <div class="usersPosition1">
      <div class="model" v-if="isShow1">
        <img v-for="(item,i) in urlModel" :src="item.img" :key="i" v-if="i==0">
      </div>
      <div class="model" v-if="isShow2">
        <img v-for="(item,i) in urlModel" :src="item.img" :key="i" v-if="i==1">
      </div>
      <div class="model" v-if="isShow3">
        <img v-for="(item,i) in urlModel" :src="item.img" :key="i" v-if="i==2">
      </div>
      <div class="rebounding" v-if="isShow1">
        <p class="titleP">{{$t(userData)}}</p>
        <p class="lineImg"></p>
        <p class="lineImg"></p>
        <p class="lineImg"></p>
        <div :class="'upData'+i " v-for="(item,i) in upDatas" :key="i">
          <p style="margin-top: -7px">{{$t(item.title)}}</p><br>
          <p>
            <animate-number :from="0" :to="item.number" duration="1000" easing="easeOutQuad" :formatter="formatter"></animate-number>万+
          </p>
        </div>
        <div class="bar">
          <ul>
            <li v-for="(item,i) in urlList" :key="i" @click="qieHuan(i)">
              <img class="icon_list" :src="item.url" alt="">
              <span class="text_style">{{$t(item.text)}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="rebounding" v-if="isShow2">
        <p class="titleP">{{$t(userData)}}</p>
        <p class="lineImg"></p>
        <p class="lineImg"></p>
        <p class="lineImg"></p>
        <div class="data-div">
          <img :src="PcImg1" alt="">
        </div>
        <div class="bar">
          <ul>
            <li v-for="(item,i) in urlList" :key="i" @click="qieHuan(i)">
              <img class="icon_list" :src="item.url" alt="">
              <span class="text_style">{{$t(item.text)}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="rebounding" v-if="isShow3">
        <p class="titleP">{{$t(userData)}}</p>
        <p class="lineImg"></p>
        <p class="lineImg"></p>
        <p class="lineImg"></p>
        <div class="ditu-div">
          <img src="../assets/img/ditu.png" alt="">
        </div>
        <div class="bar">
          <ul>
            <li v-for="(item,i) in urlList" :key="i" @click="qieHuan(i)">
              <img class="icon_list" :src="item.url" alt="">
              <span class="text_style">{{$t(item.text)}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--手机端页面-->
    <div class="usersPosition2">
      <div class="userData2" v-if="isShow1">
        <div class="title">{{$t("messages.yonghuhuaxiang2")}}</div>
        <div class="line"><img src="../assets/m-img/hengxian@3x.png" alt=""></div>
        <div class="interiorBox">
          <p>
            <span class="leftSpan pinkImg" @click="interiorBox1">{{$t("messages.yonghubili")}}</span>|
            <span class="centerSpan" @click="interiorBox2">{{$t("messages.jiaoyubeijing")}}</span>|
            <span class="rightSpan" @click="interiorBox3">{{$t("messages.shourujieduan")}}</span>
          </p>
          <div class="imgList">
            <img :src="mouseImg1" alt="" v-if="interiorBoxShow1" :style="clockWidth">
            <img :src="mouseImg2" alt="" v-if="interiorBoxShow2" :style="clockWidth">
            <img :src="mouseImg3" alt="" v-if="interiorBoxShow3" :style="clockWidth">
          </div>
        </div>
        <div class="buttonBox2">
          <ul>
            <li v-for="(item,i) in urlList2" :key="i" @click="qieHuan(i)">
              <img class="icon_list" :src="item.url" alt="">
              <span class="text_style">{{$t(item.text)}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="userData2" v-if="isShow2">
        <div class="title">{{$t("messages.yonghushuju2")}}</div>
        <div class="line"><img src="../assets/m-img/hengxian@3x.png" alt=""></div>
        <div class="fourbox1">
          <div class="fourImg" v-for="(item,i) in upDatas" :key="i" v-if="i==0">
            <p>{{$t(item.title)}}</p>
            <p><animate-number :from="0" :to="item.number" duration="1000" easing="easeOutQuad" :formatter="formatter"></animate-number>万+</p>
          </div>
          <img class="leftImg" src="../assets/m-img/you@3x.png" alt="">
        </div>
        <div class="fourbox2">
          <img class="rightImg" src="../assets/m-img/zuo.png" alt="">
          <div class="fourImg" v-for="(item,i) in upDatas" :key="i" v-if="i==1">
            <p>{{$t(item.title)}}</p>
            <p><animate-number :from="0" :to="item.number" duration="1000" easing="easeOutQuad" :formatter="formatter"></animate-number>万+</p>
          </div>
        </div>
        <div class="fourbox3">
          <div class="fourImg" v-for="(item,i) in upDatas" :key="i" v-if="i==2">
            <p>{{$t(item.title)}}</p>
            <p><animate-number :from="0" :to="item.number" duration="1000" easing="easeOutQuad" :formatter="formatter"></animate-number>万+</p>
          </div>
          <img class="leftImg" src="../assets/m-img/you@3x.png" alt="">
        </div>
        <div class="fourbox4">
          <div class="fourImg" v-for="(item,i) in upDatas" :key="i" v-if="i==3">
            <p>{{$t(item.title)}}</p>
            <p><animate-number :from="0" :to="item.number" duration="1000" easing="easeOutQuad" :formatter="formatter"></animate-number>万+</p>
          </div>
        </div>
        <div class="buttonBox2">
          <ul>
            <li v-for="(item,i) in urlList3" :key="i" @click="qieHuan(i)">
              <img class="icon_list" :src="item.url" alt="">
              <span class="text_style">{{$t(item.text)}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="userData2" v-if="isShow3">
        <div class="title">{{$t("messages.yonghufenbu2")}}</div>
        <div class="line"><img src="../assets/m-img/hengxian@3x.png" alt=""></div>
        <div class="dituMouse-div"></div>
        <div class="buttonBox2">
          <ul>
            <li v-for="(item,i) in urlList4" :key="i" @click="qieHuan(i)">
              <img class="icon_list" :src="item.url" alt="">
              <span class="text_style">{{$t(item.text)}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "usersPosition",
    prop:["from","to"],
    data() {
      return {
        isShow1: true,
        isShow2: false,
        isShow3: false,
        interiorBoxShow1: true,
        interiorBoxShow2: false,
        interiorBoxShow3: false,
        userData: "messages.yonghuhuaxiang",
        urlList2: [
          {url: require("../assets/m-img/yixuanzehuaxiang@3x.png"), text: "messages.yonghuhuaxiang2"},
          {url: require("../assets/m-img/weixuanzeshuju@3x.png"), text: "messages.yonghushuju2"},
          {url: require("../assets/m-img/weixuanzefenbu@3x.png"), text: "messages.yonghufenbu2"},
        ],
        urlList3: [
          {url: require("../assets/m-img/weixuanzehuaxiang@3x.png"), text: "messages.yonghuhuaxiang2"},
          {url: require("../assets/m-img/yixuanzeshuju@3x.png"), text: "messages.yonghushuju2"},
          {url: require("../assets/m-img/weixuanzefenbu@3x.png"), text: "messages.yonghufenbu2"},
        ],
        urlList4: [
          {url: require("../assets/m-img/weixuanzehuaxiang@3x.png"), text: "messages.yonghuhuaxiang2"},
          {url: require("../assets/m-img/weixuanzeshuju@3x.png"), text: "messages.yonghushuju2"},
          {url: require("../assets/m-img/yixuanzefenbu@3x.png"), text: "messages.yonghufenbu2"},
        ],
        urlList: [
          {url: require("../assets/img/tonghuhuaxiang.png"), text: "messages.yonghuhuaxiang"},
          {url: require("../assets/img/yonghushuju.png"), text: "messages.yonghushuju"},
          {url: require("../assets/img/yonghufenbu.png"), text: "messages.yonghufenbu"},
        ],
        urlModel: [
          {img: require("../assets/img/showTime1.png")},
          {img: require("../assets/img/showTime2.png")},
          {img: require("../assets/img/showTime3.png")},
        ],
        upDatas: [
          {title: "messages.fugaichezhu", number: 10000},
          {title: "messages.leijiyonghuliang", number: 2500},
          {title: "messages.rijunyueduliang", number: 600},
          {title: "messages.DAU", number: 350},
        ],
        PcImg1:require("../assets/img/data2.png"),
        mouseImg1:require("../assets/m-img/yonghubili.png"),
        mouseImg2:require("../assets/m-img/jiaoyubeijing.png"),
        mouseImg3:require("../assets/m-img/shourujieduan.png"),
        lang:"",
        timer:"",
        clockWidth:{
          width:""
        },
      }
    },
    watch:{
      "lang"(res){
        if(res == "en"){
          this.PcImg1 = require("../assets/img/data2.png");
          this.mouseImg1 = require("../assets/m-img/yonghubili.png");
          this.mouseImg2 = require("../assets/m-img/jiaoyubeijing.png");
          this.mouseImg3 = require("../assets/m-img/shourujieduan.png");
        }else{
          this.PcImg1 = require("../assets/img/data.png");
          this.mouseImg1 = require("../assets/m-img/yonghubili@3x.png");
          this.mouseImg2 = require("../assets/m-img/jiaoyubeijing@3x.png");
          this.mouseImg3 = require("../assets/m-img/shourujieduan@3x.png");
        }
      }
    },
    methods: {
      watchData(){
        this.lang = localStorage.getItem("lang");
      },
      qieHuan(num) {
        this.userData = this.urlList[num].text;
        if (num == 0) {
          this.isShow1 = true;
          this.isShow2 = false;
          this.isShow3 = false;
        } else if (num == 1) {
          this.isShow1 = false;
          this.isShow2 = true;
          this.isShow3 = false;
        } else if (num == 2) {
          this.isShow1 = false;
          this.isShow2 = false;
          this.isShow3 = true;
        }
      },
      interiorBox1() {
        this.interiorBoxShow1 = true;
        this.interiorBoxShow2 = false;
        this.interiorBoxShow3 = false;
        var leftSpan = document.getElementsByClassName("leftSpan")[0];
        var centerSpan = document.getElementsByClassName("centerSpan")[0];
        var rightSpan = document.getElementsByClassName("rightSpan")[0];
        leftSpan.classList.add("class", "pinkImg");
        centerSpan.classList.remove("class", "pinkImg");
        rightSpan.classList.remove("class", "pinkImg")
      },
      interiorBox2() {
        this.interiorBoxShow1 = false;
        this.interiorBoxShow2 = true;
        this.interiorBoxShow3 = false;
        var leftSpan = document.getElementsByClassName("leftSpan")[0];
        var centerSpan = document.getElementsByClassName("centerSpan")[0];
        var rightSpan = document.getElementsByClassName("rightSpan")[0];
        leftSpan.classList.remove("class", "pinkImg");
        centerSpan.classList.add("class", "pinkImg");
        rightSpan.classList.remove("class", "pinkImg")
      },
      interiorBox3() {
        this.interiorBoxShow1 = false;
        this.interiorBoxShow2 = false;
        this.interiorBoxShow3 = true;
        var leftSpan = document.getElementsByClassName("leftSpan")[0];
        var centerSpan = document.getElementsByClassName("centerSpan")[0];
        var rightSpan = document.getElementsByClassName("rightSpan")[0];
        leftSpan.classList.remove("class", "pinkImg");
        centerSpan.classList.remove("class", "pinkImg");
        rightSpan.classList.add("class", "pinkImg")
      },
      formatter: function (num) {
        return num.toFixed(0)
      },
      getWidth(){
        this.clockWidth.width = window.innerHeight/2.4 + "px"
      },
    },
    created(){
      window.addEventListener("resize",this.getWidth);
      this.getWidth();
    },
    mounted() {
      this.timer = setInterval(this.watchData,100)
    },
    destroyed(){
      clearInterval(this.timer)
    }
  }
</script>

<style scoped>
</style>
