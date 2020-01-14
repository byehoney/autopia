<template>
  <div id="starTeam">
    <div class="starTeamBox1" id="starTeamBox1" v-if="animateShow">
      <div id="container">
        <!--<div class="cheTuoBangStar"></div>
        <div class="chetuobang_text"></div>
        <div class="chetuobang_text"></div>-->
        <div class="introduction">
          <div class="intro_title">
            <!--<p class="el-icon-caret-left" @click="numclick"></p>-->
            <p class="title_TEXT">{{$t(titleText)}}</p>
            <!--<p class="el-icon-caret-right" @click="rightClick"></p>-->
          </div>
          <div class="intro_line"></div>
          <div class="intro_photoBorder">
            <img class="intro_photo" :src="imgPC" alt="">
          </div>
          <div class="intro_Name">
            <p class="chineseName">{{$t(chineseName)}}</p>
            <p class="englishName">{{$t(englishName)}}</p>
          </div>
          <div class="intro_text">
            <p>{{$t(text)}}</p>
            <p>{{$t(text2)}}</p>
            <p>{{$t(text3)}}</p>
            <p>{{$t(text4)}}</p>
            <p>{{$t(text5)}}</p>
            <p>{{$t(text6)}}</p>
            <p>{{$t(text7)}}</p>
            <p>{{$t(text8)}}</p>
            <p>{{$t(text9)}}</p>
            <p>{{$t(text10)}}</p>
            <p>{{$t(text11)}}</p>
            <p>{{$t(text12)}}</p>
            <p>{{$t(text13)}}</p>
            <p>{{$t(text14)}}</p>
            <p>{{$t(text15)}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="starTeamBox2">
      <img class="bigbig" src="../assets/img/xingqiu.png" alt="">
      <div class="mouseBox2">
          <div class="intro_title">
            <p class="el-icon-caret-left" @click="numclick"></p>
            <p class="title_TEXT">{{$t(titleText)}}</p>
            <p class="el-icon-caret-right" @click="rightClick"></p>
          </div>
          <div class="intro_line"></div>
          <div class="intro_photoBorder">
            <img class="intro_photos" :src="imgTouch" alt="">
          </div>
          <div class="intro_Name">
            <p class="chineseName2">{{$t(chineseName2)}}</p>
            <p class="englishName2">{{$t(englishName2)}}</p>
          </div>
          <div class="intro_text">
            <p>{{$t(inner)}}</p>
            <p>{{$t(inner2)}}</p>
            <p>{{$t(inner3)}}</p>
            <p>{{$t(inner4)}}</p>
            <p>{{$t(inner5)}}</p>
            <p>{{$t(inner6)}}</p>
            <p>{{$t(inner7)}}</p>
            <p>{{$t(inner8)}}</p>
            <p>{{$t(inner9)}}</p>
            <p>{{$t(inner10)}}</p>
            <p>{{$t(inner11)}}</p>
            <p>{{$t(inner12)}}</p>
            <p>{{$t(inner13)}}</p>
            <p>{{$t(inner14)}}</p>
            <p>{{$t(inner15)}}</p>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {init,animate,removeClear} from  "../../static/star";

  export default {
    name: "starTeam",
    data() {
      return{
        chineseName:"",
        englishName:"",
        titleText:"messages.chuangshiren",
        chineseName2:"",
        englishName2:"",
        text:"", text2:"", text3:"", text4:"", text5:"", text6:"",
        text7:"", text8:"", text9:"", text10:"",
        text11:"", text12:"", text13:"", text14:"", text15:"",
        inner:"", inner2:"", inner3:"", inner4:"", inner5:"", inner6:"",
        inner7:"", inner8:"", inner9:"", inner10:"",
        inner11:"", inner12:"", inner13:"", inner14:"", inner15:"",
        userData:[
          {
            imgUrl:require("../assets/img/5.png"),
            chineseName:"messages.chineseName1",
            englishName:"messages.englishName1",
            text:"messages.lvchunweiTEXT",
            text2:"messages.lvchunweiTEXT2",
            text3:"messages.lvchunweiTEXT3",
            text4:"messages.lvchunweiTEXT4",
            text5:"messages.lvchunweiTEXT5",
            text6:"messages.lvchunweiTEXT6",
            text7:"messages.lvchunweiTEXT7",
            text8:"messages.lvchunweiTEXT8",
            text9:"messages.lvchunweiTEXT9",
            text10:"messages.lvchunweiTEXT10",
            text11:"messages.lvchunweiTEXT11",
            text12:"messages.lvchunweiTEXT12",
            text13:"messages.lvchunweiTEXT13",
            text14:"messages.lvchunweiTEXT14",
            text15:"messages.lvchunweiTEXT15",
          },
          {
            imgUrl:require("../assets/img/3.png"),
            chineseName:"messages.chineseName2",
            englishName:"messages.englishName2",
            text:"messages.xuemanziTEXT",
            text2:"messages.xuemanziTEXT2",
            text3:"messages.xuemanziTEXT3",
            text4:"messages.xuemanziTEXT4",
            text5:"messages.xuemanziTEXT5",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
          {
            imgUrl:require("../assets/img/1.png"),
            chineseName:"messages.chineseName3",
            englishName:"messages.englishName3",
            text:"messages.tanchangwenTEXT",
            text2:"messages.tanchangwenTEXT2",
            text3:"messages.tanchangwenTEXT3",
            text4:"messages.tanchangwenTEXT4",
            text5:"",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
          {
            imgUrl:require("../assets/img/7.png"),
            chineseName:"messages.chineseName4",
            englishName:"messages.englishName4",
            text:"messages.wangchaoyongTEXT",
            text2:"messages.wangchaoyongTEXT2",
            text3:"messages.wangchaoyongTEXT3",
            text4:"messages.wangchaoyongTEXT4",
            text5:"",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
          {
            imgUrl:require("../assets/img/4.png"),
            chineseName:"messages.chineseName5",
            englishName:"messages.englishName5",
            text:"messages.yanyanTEXT",
            text2:"messages.yanyanTEXT2",
            text3:"messages.yanyanTEXT3",
            text4:"",
            text5:"",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
          {
            imgUrl:require("../assets/img/6.png"),
            chineseName:"messages.chineseName6",
            englishName:"messages.englishName6",
            text:"messages.jiangnanchunTEXT",
            text2:"messages.jiangnanchunTEXT2",
            text3:"",
            text4:"",
            text5:"",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
          {
            imgUrl:require("../assets/img/2.png"),
            chineseName:"messages.chineseName7",
            englishName:"messages.englishName7",
            text:"messages.beiweiTEXT",
            text2:"messages.beiweiTEXT2",
            text3:"",
            text4:"",
            text5:"",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
        ],
        userData2:[
          {
            img2:require("../assets/img/5.png"),
            chineseName:"messages.chineseName1",
            englishName:"messages.englishName1",
            text:"messages.lvchunweiTEXT",
            text2:"messages.lvchunweiTEXT2",
            text3:"messages.lvchunweiTEXT3",
            text4:"messages.lvchunweiTEXT4",
            text5:"messages.lvchunweiTEXT5",
            text6:"messages.lvchunweiTEXT6",
            text7:"messages.lvchunweiTEXT7",
            text8:"messages.lvchunweiTEXT8",
            text9:"messages.lvchunweiTEXT9",
            text10:"messages.lvchunweiTEXT10",
            text11:"messages.lvchunweiTEXT11",
            text12:"messages.lvchunweiTEXT12",
            text13:"messages.lvchunweiTEXT13",
            text14:"messages.lvchunweiTEXT14",
            text15:"messages.lvchunweiTEXT15",
          },
          {
            img2:require("../assets/img/3.png"),
            chineseName:"messages.chineseName2",
            englishName:"messages.englishName2",
            text:"messages.xuemanziTEXT",
            text2:"messages.xuemanziTEXT2",
            text3:"messages.xuemanziTEXT3",
            text4:"messages.xuemanziTEXT4",
            text5:"messages.xuemanziTEXT5",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
          {
            img2:require("../assets/img/1.png"),
            chineseName:"messages.chineseName3",
            englishName:"messages.englishName3",
            text:"messages.tanchangwenTEXT",
            text2:"messages.tanchangwenTEXT2",
            text3:"messages.tanchangwenTEXT3",
            text4:"messages.tanchangwenTEXT4",
            text5:"",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
          {
            img2:require("../assets/img/7.png"),
            chineseName:"messages.chineseName4",
            englishName:"messages.englishName4",
            text:"messages.wangchaoyongTEXT",
            text2:"messages.wangchaoyongTEXT2",
            text3:"messages.wangchaoyongTEXT3",
            text4:"messages.wangchaoyongTEXT4",
            text5:"",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
          {
            img2:require("../assets/img/4.png"),
            chineseName:"messages.chineseName5",
            englishName:"messages.englishName5",
            text:"messages.yanyanTEXT",
            text2:"messages.yanyanTEXT2",
            text3:"messages.yanyanTEXT3",
            text4:"",
            text5:"",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
          {
            img2:require("../assets/img/6.png"),
            chineseName:"messages.chineseName6",
            englishName:"messages.englishName6",
            text:"messages.jiangnanchunTEXT",
            text2:"messages.jiangnanchunTEXT2",
            text3:"",
            text4:"",
            text5:"",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
          {
            img2:require("../assets/img/2.png"),
            chineseName:"messages.chineseName7",
            englishName:"messages.englishName7",
            text:"messages.beiweiTEXT",
            text2:"messages.beiweiTEXT2",
            text3:"",
            text4:"",
            text5:"",
            text6:"",
            text7:"",
            text8:"",
            text9:"",
            text10:"",
            text11:"",
            text12:"",
            text13:"",
            text14:"",
            text15:"",
          },
        ],
        num:0,
        num2:0,
        imgPC:"",
        imgTouch:"",
        animateShow:true,
        chetuobangLOGO:require("../assets/img/chetuobangEN.png"),
        touzirenLOGO:require("../assets/img/touzirenEN.png"),
        lang:"",
        timer:"",
      }
    },
    watch:{
      "lang"(res){
        if(res == "en"){
          this.chetuobangLOGO = require("../assets/img/chetuobangEN.png");
          this.touzirenLOGO = require("../assets/img/touzirenEN.png");
        }else{
          this.chetuobangLOGO = require("../assets/img/chetuobangbiaoqian.png");
          this.touzirenLOGO = require("../assets/img/touzirenbiaoqian.png")
        }
      }
    },
    methods:{
      watchLang(){
        this.lang = localStorage.getItem("lang");
      },
      rightClick(){
        this.num2++;
        if(this.num2 == 7){
          this.num2 = 0
        }
        this.Data2();
      },
      numclick(){
        this.num2--;
        if(this.num2 == -1){
          this.num2 = 6
        }
        this.Data2();
      },
      Data(){
        var _this = this;
        _this.imgPC = _this.userData[this.num].imgUrl;
        _this.chineseName = _this.userData[this.num].chineseName;
        _this.englishName = _this.userData[this.num].englishName;
        _this.text = _this.userData[this.num].text;
        _this.text2 = _this.userData[this.num].text2;
        _this.text3 = _this.userData[this.num].text3;
        _this.text4 = _this.userData[this.num].text4;
        _this.text5 = _this.userData[this.num].text5;
        _this.text6 = _this.userData[this.num].text6;
        _this.text7 = _this.userData[this.num].text7;
        _this.text8 = _this.userData[this.num].text8;
        _this.text9 = _this.userData[this.num].text9;
        _this.text10 = _this.userData[this.num].text10;
        _this.text11 = _this.userData[this.num].text11;
        _this.text12 = _this.userData[this.num].text12;
        _this.text13 = _this.userData[this.num].text13;
        _this.text14 = _this.userData[this.num].text14;
        _this.text15 = _this.userData[this.num].text15;
      },
      /*移动端信息*/
      Data2(){
        this.imgTouch = this.userData2[this.num2].img2;
        this.chineseName2  = this.userData2[this.num2].chineseName;
        this.englishName2  = this.userData2[this.num2].englishName;
        this.inner = this.userData2[this.num2].text;
        this.inner2 = this.userData2[this.num2].text2;
        this.inner3 = this.userData2[this.num2].text3;
        this.inner4 = this.userData2[this.num2].text4;
        this.inner5 = this.userData2[this.num2].text5;
        this.inner6 = this.userData2[this.num2].text6;
        this.inner7 = this.userData2[this.num2].text7;
        this.inner8 = this.userData2[this.num2].text8;
        this.inner9 = this.userData2[this.num2].text9;
        this.inner10 = this.userData2[this.num2].text10;
        this.inner11 = this.userData2[this.num2].text11;
        this.inner12 = this.userData2[this.num2].text12;
        this.inner13 = this.userData2[this.num2].text13;
        this.inner14 = this.userData2[this.num2].text14;
        this.inner15 = this.userData2[this.num2].text15;
      },
      getStar(){
        this.num = localStorage.getItem("starNumber");
        this.Data();
      }
    },
    created(){

    },
    mounted(){
      localStorage.setItem("starNumber",0);
      this.Data2();
      this.Data();
      init(this.chetuobangLOGO,this.touzirenLOGO);
      animate();
      setInterval(this.getStar,1000);
      this.timer = setInterval(this.watchLang,1000);
    },
    beforeDestroy(){
      removeClear();
    },
    destroyed(){
      clearInterval(this.timer)
    }
  }
</script>

<style scoped>
  #container{
    display: none;
  }
</style>
