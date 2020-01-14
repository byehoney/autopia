<template>
  <div id="AboutUs">
    <div class="AboutUsBox1">
      <div class="bigStar"></div>
      <div class="bigStar2">
        <div class="mouseYun_1"></div>
        <div class="mouseYun_3"></div>
        <div class="mouseYun_4"></div>
        <div class="mouseYun_5"></div>
        <div class="mouseYun_6"></div>
      </div>
      <div class="lineImg"></div>
      <div class="styleImg">
        <div :class="('styleImgChild' + i)" class="styleImgChild" v-for="(item,i) in array" :key="i" @mouseenter="clickImg(item)" @mouseleave="moveImg(item)">
          <div class="zhezhao_box" :class="'zhezhao'+i" v-if="item.isShow"></div>
          <img class="mousesImg" :class="{'active':item.isChoose}" :src="item.url" alt="">
          <p><span style="border-left: solid 2px #7164E2;padding-left: 10px">{{$t(item.downTitle)}}</span></p>
        </div>
      </div>
      <div class="addRess">
        <ul>
          <li>{{$t(address)}}</li>
          <li>{{$t(addPhone)}}</li>
          <li>{{$t(mail)}}</li>
        </ul>
      </div>
      <div class="bottomEnglish"></div>
    </div>
    <div class="AboutUsBox2">
      <div :class="('styleImg' + i)" v-for="(item,i) in array2" :key="i">
        <div :class="('styleImgChild' + i)" class="styleImgChild" @click="clickImg2(item)">
          <div class="zhezhao_box" :class="'zhezhao'+i"  :style="zhezhaocengHeight"></div>
          <img class="mousesImg" :src="item.url" alt="" :style="zhezhaocengHeight">
          <p><span style="border-left: solid 2px #7164E2;padding-left: 10px" >{{$t(item.downTitle)}}</span></p>
        </div>
      </div>
      <div class="addRess">
        <ul>
          <li>{{$t(address)}}</li>
          <li>{{$t(addPhone)}}</li>
          <li>{{$t(mail)}}</li>
        </ul>
      </div>
      <div class="m_yun1">
        <div class="m_yun2">
          <div class="m_yun3"></div>
          <div class="m_yun4"></div>
          <div class="m_yun5"></div>
          <div class="m_yun6"></div>
        </div>
      </div>
      <div class="superZhezhao" v-if="superOff" >
        <p class="superBorder" :style="borderWidth"><img :src="superImg" alt=""></p>
        <div class="icon" @click="closeCopy">
          <img src="../assets/m-img/closeCopy.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import 'viewerjs/dist/viewer.css';
  export default {
    name: "AboutUs",
    data() {
      return {
        borderWidth:{
          width:"",
          height:""
        },
        zhezhaocengHeight:{
          height:""
        },
        text: "messages.homeText",
        text2: "messages.homeText2",
        text3: "messages.homeText3",
        text4: "messages.homeText4",
        text5: "messages.homeText5",
        text6: "messages.homeText6",
        address: "messages.dizhi",
        addPhone: "messages.telephone",
        mail: "messages.email",
        superImg:"",
        superOff:false,
        guanyutuochebang: "messages.guanyutuochebang",
        showImg: false,
        array: [
          {url: require("../assets/img/1mouse.png"), downTitle: "messages.bangonghuanjing1", isChoose:false,isShow:true},
          {url: require("../assets/img/2mouse.png"), downTitle: "messages.bangonghuanjing2", isChoose:false,isShow:true},
          {url: require("../assets/img/3mouse.png"), downTitle: "messages.bangonghuanjing3", isChoose:false,isShow:true},
          {url: require("../assets/img/4mouse.png"), downTitle: "messages.bangonghuanjing4", isChoose:false,isShow:true}
        ],
        array2: [
          {url: require("../assets/m-img/sprite1.png"), downTitle: "messages.bangonghuanjing1", isChoose2:false,isShow2:true,super:require("../assets/img/1mouse.png")},
          {url: require("../assets/m-img/sprite2.png"), downTitle: "messages.bangonghuanjing2", isChoose2:false,isShow2:true,super:require("../assets/img/2mouse.png")},
          {url: require("../assets/m-img/sprite3.png"), downTitle: "messages.bangonghuanjing4", isChoose2:false,isShow2:true,super:require("../assets/img/4mouse.png")}
        ],
      }
    },
    methods: {
      clickImg(e) {
        e.isChoose = true;
        e.isShow = false
      },
      clickImg2(e) {
        e.isChoose2 = true;
        e.isShow2 = false;
        this.superImg = e.super;
        this.superOff = e.isChoose2;
      },
      closeCopy(){
        this.array2[0].isChoose2 = false;
        this.array2[1].isChoose2 = false;
        this.array2[2].isChoose2 = false;
        this.array2[0].isShow2 = true;
        this.array2[1].isShow2 = true;
        this.array2[2].isShow2 = true;
        this.superOff = false;
      },
      moveImg(e){
        e.isChoose = false;
        e.isShow = true
      },
      getWidth(){
        this.borderWidth.width = window.innerHeight/2.51 + "px";
      },
      getWidth2(){
        this.zhezhaocengHeight.height = window.innerHeight/5.5 + "px";
      },
    },
    created(){
      window.addEventListener("resize",this.getWidth);
      window.addEventListener("resize",this.getWidth2);
      this.getWidth();
      this.getWidth2();
    },
    mounted() {

    }
  }
</script>

<style scoped>
</style>
