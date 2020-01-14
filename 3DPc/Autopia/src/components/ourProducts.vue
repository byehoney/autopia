<template>
  <div id="ourProducts">
    <div class="ourProductsBox">
      <div class="big_star">
        <img class="xingguang" src="../assets/img/xingguang.png" alt="">
        <img class="guangyun1" src="../assets/img/guangyun1.png" alt="">
        <img class="guangyun2" src="../assets/img/guangyun2.png" alt="">
        <img class="guangyun3" src="../assets/img/guangyun3.png" alt="">
        <img class="guangyun4" src="../assets/img/guangyun4.png" alt="">
        <img class="guangyun5" src="../assets/img/guangyun5.png" alt="">
        <img class="guangyun6" src="../assets/img/guangyun6.png" alt="">
        <img class="guangyun7" src="../assets/img/guangyun7.png" alt="">
        <img class="guangyun8" src="../assets/img/guangyun8.png" alt="">
      </div>
      <div class="left-right">
        <img :src="imgs" alt="" :style="imgHeight">
      </div>
      <div class="num1">
        <p>{{numTween}}</p>
        <p style="font-size: 14px;font-weight: 100">MPH</p>
      </div>
      <div class="num2">
        <p>{{oilMass}}</p>
        <p style="font-size: 14px;font-weight: 100">RPM</p>
      </div>
      <div class="mouseWindow">
        <p style="font-size: 20px;">{{$t(title)}}</p><br>
        <p class="mouseP2">{{$t(text)}}</p>
      </div>
      <div class="mouseWindow_Menu">
        <ul>
          <li v-for="(item,i) in url" :key="i" class="imgs0" @click="mouseMenu1(0)" v-if="i==0">
            <img :src="item.white == false?item.img:item.whiteImg" alt="">
            <p>{{$t(item.text)}}</p>
          </li>
          <li v-for="(item,i) in url" :key="i" class="imgs1" @click="mouseMenu2(1)" v-if="i==1">
            <img :src="item.white == false?item.img:item.whiteImg" alt="">
            <p>{{$t(item.text)}}</p>
          </li>
          <li v-for="(item,i) in url" :key="i" class="imgs2" @click="mouseMenu3(2)" v-if="i==2">
            <img :src="item.white == false?item.img:item.whiteImg" alt="">
            <p>{{$t(item.text)}}</p>
          </li>
          <li v-for="(item,i) in url" :key="i" class="imgs3" @click="mouseMenu4(3)" v-if="i==3">
            <img :src="item.white == false?item.img:item.whiteImg" alt="">
            <p>{{$t(item.text)}}</p>
          </li>
        </ul>
      </div>
    </div>
    <!--手机端页面-->
    <div class="ourProductsBox2">
      <div class="big_star">
        <img class="xingguang" src="../assets/img/xingguang.png" alt="">
        <img class="guangyun1" src="../assets/img/guangyun1.png" alt="">
        <img class="guangyun2" src="../assets/img/guangyun2.png" alt="">
        <img class="guangyun3" src="../assets/img/guangyun3.png" alt="">
        <img class="guangyun4" src="../assets/img/guangyun4.png" alt="">
        <img class="guangyun5" src="../assets/img/guangyun5.png" alt="">
        <img class="guangyun6" src="../assets/img/guangyun6.png" alt="">
        <img class="guangyun7" src="../assets/img/guangyun7.png" alt="">
        <img class="guangyun8" src="../assets/img/guangyun8.png" alt="">
      </div>
      <div class="mousewindow2">
        <p class="mouseP" style="font-size: 0.5rem;margin-top: 20px">{{$t(title)}}</p><br>
        <hr>
        <p style="text-indent: 15px;font-size:0.3rem;margin-top: 20px;line-height: 30px;text-align: left">{{$t(text)}}</p>
      </div>
      <div class="xiaomenu">
        <ul>
          <li v-for="(item,i) in url" :key="i" @click="mouseMenu1(0)" v-if="i==0">
            <img :src="item.white == false?item.img:item.whiteImg" alt="">
            <p>{{$t(item.text)}}</p>
          </li>
          <li v-for="(item,i) in url" :key="i" @click="mouseMenu2(1)" v-if="i==1">
            <img :src="item.white == false?item.img:item.whiteImg" alt="">
            <p>{{$t(item.text)}}</p>
          </li>
          <li v-for="(item,i) in url" :key="i" @click="mouseMenu3(2)" v-if="i==2">
            <img :src="item.white == false?item.img:item.whiteImg" alt="">
            <p>{{$t(item.text)}}</p>
          </li>
          <li v-for="(item,i) in url" :key="i" @click="mouseMenu4(3)" v-if="i==3">
            <img :src="item.white == false?item.img:item.whiteImg" alt="">
            <p>{{$t(item.text)}}</p>
          </li>
        </ul>
      </div>
      <div class="num3">
        <p>{{numTween}}</p>
        <p style="font-size: 14px;font-weight: 100">MPH</p>
      </div>
      <div class="num4">
        <p>{{oilMass}}</p>
        <p style="font-size: 14px;font-weight: 100">RPM</p>
      </div>
      <div class="m_yibiaopan">
        <img :src="m_img" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import TWEEN from '@tweenjs/tween.js'

  export default {
    name: "ourProducts",
    data() {
      return {
        num: 0,
        numTween: 60,
        title:"messages.fiveWindowTitle1",
        text:"messages.fiveWindowtext1",
        imgHeight:{height:""},
        url: [
          {
            img:require("../assets/img/44.png"),
            whiteImg:require("../assets/m-img/momo@3x.png"),
            text:"messages.shejiao",
            kmh:60,oilMass:5,
            img2:require("../assets/img/60 4.png"),
            img3:require("../assets/m-img/60 4@3x.png"),
            white:false
          },
          {
            img:require("../assets/img/33.png"),
            whiteImg:require("../assets/m-img/qukuailian@3x.png"),
            text:"messages.qukuailian",
            kmh:80,oilMass:6,
            img2:require("../assets/img/80 5.png"),
            img3:require("../assets/m-img/80 5@3x.png"),
            white:false
          },
          {
            img:require("../assets/img/22.png"),
            whiteImg:require("../assets/m-img/shubiao@3x.png"),
            text:"messages.dianshang",
            kmh:100,oilMass:7,
            img2:require("../assets/img/100 6.png"),
            img3:require("../assets/m-img/100 6@3x.png"),
            white:false
          },
          {
            img:require("../assets/img/11.png"),
            whiteImg:require("../assets/m-img/daohang@3x.png"),
            text:"messages.UGC",
            kmh:120,oilMass:8,
            img2:require("../assets/img/120 7.png"),
            img3:require("../assets/m-img/120 7@3x.png"),
            white:false
          },
        ],
        kmh:"60",
        oilMass:"5",
        fiveWindow:[
          {title:"messages.fiveWindowTitle1",text:"messages.fiveWindowtext1"},
          {title:"messages.fiveWindowTitle2",text:"messages.fiveWindowtext2"},
          {title:"messages.fiveWindowTitle3",text:"messages.fiveWindowtext3"},
          {title:"messages.fiveWindowTitle4",text:"messages.fiveWindowtext4"},
        ],
        imgs:require("../assets/img/60 4.png"),
        m_img:require("../assets/m-img/60 4@3x.png")
      }
    },
    watch: {
      'num' (newValue, oldValue) {
        new TWEEN.Tween({
          number: oldValue
        }).to({number: newValue}, 1000).onUpdate(tween => {
            this.numTween = tween.number.toFixed(0)
          }).start();
        function animate() {
          if (TWEEN.update()) {
            requestAnimationFrame(animate);
          }
        }
        animate()
      }
    },
    methods:{
      mouseMenu1(){
        this.url[0].white = true;
        this.url[1].white = false;
        this.url[2].white = false;
        this.url[3].white = false;
        this.title = this.fiveWindow[0].title;
        this.text = this.fiveWindow[0].text;
        this.kmh = this.url[0].kmh;
        this.oilMass = this.url[0].oilMass;
        this.imgs = this.url[0].img2;
        this.m_img = this.url[0].img3;
        this.change(0);
      },
      mouseMenu2(){
        this.url[0].white = false;
        this.url[1].white = true;
        this.url[2].white = false;
        this.url[3].white = false;
        this.title = this.fiveWindow[1].title;
        this.text = this.fiveWindow[1].text;
        this.kmh = this.url[1].kmh;
        this.oilMass = this.url[1].oilMass;
        this.imgs = this.url[1].img2;
        this.m_img = this.url[1].img3;
        this.change(1);
      },
      mouseMenu3(){
        this.url[0].white = false;
        this.url[1].white = false;
        this.url[2].white = true;
        this.url[3].white = false;
        this.title = this.fiveWindow[2].title;
        this.text = this.fiveWindow[2].text;
        this.kmh = this.url[2].kmh;
        this.oilMass = this.url[2].oilMass;
        this.imgs = this.url[2].img2;
        this.m_img = this.url[2].img3;
        this.change(2);
      },
      mouseMenu4(){
        this.url[0].white = false;
        this.url[1].white = false;
        this.url[2].white = false;
        this.url[3].white = true;
        this.title = this.fiveWindow[3].title;
        this.text = this.fiveWindow[3].text;
        this.kmh = this.url[3].kmh;
        this.oilMass = this.url[3].oilMass;
        this.imgs = this.url[3].img2;
        this.m_img = this.url[3].img3;
        this.change(3);
      },
      change (num) {
        this.num = this.url[num].kmh
      },
      getHeight(){
        this.imgHeight.height = window.innerHeight/5.15 + "px";
      }
    },
    created(){
      window.addEventListener("resize",this.getHeight);
      this.getHeight()
    }
  }
</script>

<style scoped>

</style>
