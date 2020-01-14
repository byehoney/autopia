<template>
  <div id="titleMenu">
    <div class="titleMenu1">
      <div class="box">
        <div class="logo">
          <router-link to="/home"><img src="../assets/img/logo.png" alt="" @click="isShow = false"></router-link>
        </div>
        <div class="button-list">
          <ul>
            <li v-for="(item,i) in nav" :key="i" :class="navIndex===i?'lis is_active':'lis'"
                @click="routerLink(i, item.path)">{{$t(item.title)}}
            </li>
          </ul>
        </div>
        <div class="language">
          <div class="langChange-icon" @click="langChange">{{langValue}}</div>
        </div>
      </div>
      <div class="secondImg" v-if="isShow"></div>
      <div class="secondImg" v-if="isShow" @click="isShow = false">
        <div class="exView1">
          <img src="../assets/img/tanzhaodeng2.png" alt="">
        </div>
        <div class="exView2">
          <img src="../assets/img/tanzhaodeng2.png" alt="">
        </div>
        <div class="exView3">
          <img src="../assets/img/tanzhaodeng.png" alt="">
        </div>
        <div class="exView4">
          <img src="../assets/img/tanzhaodeng.png" alt="">
        </div>
        <div class="star">
          <img src="../assets/img/guangxian.png" alt="">
        </div>
        <div class="star">
          <img src="../assets/img/guangxian.png" alt="">
        </div>
        <div class="star">
          <img src="../assets/img/guangxian.png" alt="">
        </div>
        <div class="centerBox">
          <div class="scrollBox">
            <h3>{{$t(title)}}</h3><br>
            <hr style="width: 90%;margin-left: 5%">
            <br>
            <p>{{$t(homeText)}}</p>
            <p>{{$t(homeText2)}}</p>
            <p>{{$t(homeText3)}}</p>
            <p>{{$t(homeText4)}}</p>
            <p>{{$t(homeText5)}}</p>
            <p>{{$t(homeText6)}}</p>
            <p>{{$t(homeText7)}}</p>
            <p>{{$t(homeText8)}}</p>
          </div>
          <div class="scrollBox2">
            <h3>{{$t(title)}}</h3>
            <hr>
            <p>{{$t(homeText)}}</p>
            <p>{{$t(homeText2)}}</p>
            <p>{{$t(homeText3)}}</p>
            <p>{{$t(homeText4)}}</p>
            <p>{{$t(homeText5)}}</p>
            <p>{{$t(homeText6)}}</p>
            <p>{{$t(homeText7)}}</p>
            <p>{{$t(homeText8)}}</p>
          </div>
        </div>
      </div>
    </div>
    <!--手机端页面-->
    <div class="titleMenu2">
      <div class="secondImg" v-if="isShow33"></div>
      <div class="secondImg" v-if="isShow33" @click="isShow33 = false">
        <div class="centerBox">
          <div class="tanzhaodeng">
            <img src="../assets/m-img/zuodeng.png" alt="">
          </div>
          <div class="taiyangguang"><img src="../assets/img/guangxian.png" alt=""></div>
          <div class="taiyangguang"><img src="../assets/img/guangxian.png" alt=""></div>
          <div class="taiyangguang"><img src="../assets/img/guangxian.png" alt=""></div>
          <div class="scrollBox">
            <h3>{{$t(title)}}</h3><br>
            <hr style="width: 90%;margin-left: 5%">
            <br>
            <p>{{$t(homeText)}}</p>
            <p>{{$t(homeText2)}}</p>
            <p>{{$t(homeText3)}}</p>
            <p>{{$t(homeText4)}}</p>
            <p>{{$t(homeText5)}}</p>
            <p>{{$t(homeText6)}}</p>
            <p>{{$t(homeText7)}}</p>
            <p>{{$t(homeText8)}}</p>
          </div>
          <div class="scrollBox2">
            <h3>{{$t(title)}}</h3>
            <hr>
            <p>{{$t(homeText)}}</p>
            <p>{{$t(homeText2)}}</p>
            <p>{{$t(homeText3)}}</p>
            <p>{{$t(homeText4)}}</p>
            <p>{{$t(homeText5)}}</p>
            <p>{{$t(homeText6)}}</p>
            <p>{{$t(homeText7)}}</p>
            <p>{{$t(homeText8)}}</p>
          </div>
        </div>
      </div>
      <div class="box3">
        <div class="menu">
          <img src="../assets/m-img/caidan@3x.png" alt="" @click="titleClick">
        </div>
        <div class="logo">
          <router-link to="/home"><img src="../assets/img/logo.png" alt=""></router-link>
        </div>
        <div class="language">
          <div class="langChange-icon" @click="langChange">{{langValue}}</div>
        </div>
      </div>
      <el-drawer :visible.sync="drawer" :direction="direction" :show-close="false" :size="'45%'" :modal="false">
        <div class="button-list">
          <ul>
            <li v-for="(item,i) in nav2" :key="i" v-if="i==0" @click="whiteIcon1();routerLink(i, item.path)">
              <img style="width: 13%;" :src="item.whiteTrue == false?item.icon:item.whiteIcon"/>&nbsp;
              <p :style="{color:item.whiteTrue==false?'#919197':'#FFFFFF'}">{{$t(item.title)}}</p>
            </li>
            <li v-for="(item,i) in nav2" :key="i" v-if="i==1" @click="whiteIcon2();routerLink(i, item.path)">
              <img style="width: 13%;" :src="item.whiteTrue == false?item.icon:item.whiteIcon"/>&nbsp;
              <p :style="{color:item.whiteTrue==false?'#919197':'#FFFFFF'}">{{$t(item.title)}}</p>
            </li>
            <li v-for="(item,i) in nav2" :key="i" v-if="i==2" @click="whiteIcon3();routerLink(i, item.path)">
              <img style="width: 13%;" :src="item.whiteTrue == false?item.icon:item.whiteIcon"/>&nbsp;
              <p :style="{color:item.whiteTrue==false?'#919197':'#FFFFFF'}">{{$t(item.title)}}</p>
            </li>
            <li v-for="(item,i) in nav2" :key="i" v-if="i==3" @click="whiteIcon4();routerLink(i, item.path)">
              <img style="width: 13%;" :src="item.whiteTrue == false?item.icon:item.whiteIcon"/>&nbsp;
              <p :style="{color:item.whiteTrue==false?'#919197':'#FFFFFF'}">{{$t(item.title)}}</p>
            </li>
            <li v-for="(item,i) in nav2" :key="i" v-if="i==4" @click="whiteIcon5();routerLink(i, item.path)">
              <img style="width: 13%;" :src="item.whiteTrue == false?item.icon:item.whiteIcon"/>&nbsp;
              <p :style="{color:item.whiteTrue==false?'#919197':'#FFFFFF'}">{{$t(item.title)}}</p>
            </li>
            <li v-for="(item,i) in nav2" :key="i" v-if="i==5" @click="whiteIcon6();routerLink(i, item.path)">
              <img style="width: 13%;" :src="item.whiteTrue == false?item.icon:item.whiteIcon"/>&nbsp;
              <p :style="{color:item.whiteTrue==false?'#919197':'#FFFFFF'}">{{$t(item.title)}}</p>
            </li>
          </ul>
        </div>
      </el-drawer>
    </div>

  </div>
</template>

<script>
  import {SwitchLanguaga} from "../../static/star";
  export default {
    name: "titleMenu",
    data() {
      return {
        screenWidth: '',
        screenHeight: '',
        isShow: false,
        isShow2: false,
        isShow3: true,
        isShow4: false,
        isShow33: false,
        drawer: false,
        direction: 'ltr',
        nav: [
          {title: 'messages.shouye', path: '/home'},
          {title: 'messages.lichengbei', path: '/milestOne'},
          {title: 'messages.womenchanpin', path: '/ourProducts'},
          {title: 'messages.yonghudingwei', path: '/usersPosition'},
          {title: 'messages.mingxingtyuandui', path: '/starTeam'},
          {title: 'messages.guanyuwomen', path: '/AboutUs'},
        ],
        nav2: [
          {title: 'messages.shouye2', path: '/home',
            icon:require("../assets/m-img/shouye@3x.png"),
            whiteIcon:require("../assets/m-img/shouyeClick.png"),whiteTrue:false},
          {title: 'messages.lichengbei2', path: '/milestOne',
            icon:require("../assets/m-img/lichengbei@3x.png"),
            whiteIcon:require("../assets/m-img/lichengbeiClick.png"),whiteTrue:false},
          {title: 'messages.womenchanpin2', path: '/ourProducts',
            icon:require("../assets/m-img/chanpin@3x.png"),
            whiteIcon:require("../assets/m-img/chanpinClick.png"),whiteTrue:false},
          {title: 'messages.yonghudingwei2', path: '/usersPosition',
            icon:require("../assets/m-img/dingwei@3x.png"),
            whiteIcon:require("../assets/m-img/dingweiClick.png"),whiteTrue:false},
          {title: 'messages.mingxingtyuandui2', path: '/starTeam',
            icon:require("../assets/m-img/mingxing@3x.png"),
            whiteIcon:require("../assets/m-img/mingxingClick.png"),whiteTrue:false},
          {title: 'messages.guanyuwomen2', path: '/AboutUs',
            icon:require("../assets/m-img/women@3x.png"),
            whiteIcon:require("../assets/m-img/womenClick.png"),whiteTrue:false},
        ],
        title: "messages.part03qukuailian",
        homeText: "messages.homeText",
        homeText2: "messages.homeText2",
        homeText3: "messages.homeText3",
        homeText4: "messages.homeText4",
        homeText5: "messages.homeText5",
        homeText6: "messages.homeText6",
        homeText7: "messages.homeText7",
        homeText8: "messages.homeText8",
        navIndex: "",
        navIndex2: "",
        options: [
          {value: 'cn', label: '中文'},
          {value: 'en', label: 'English'},
        ],
        value: 'en',
        langValue:"En",
        changeActive: 0,
        score:0,
        scrollNum:5
      }
    },
    methods: {
      //阻止鼠标滚轮事件
      disabledMouseWheel() {
        if(document.addEventListener) {
          document.addEventListener('DOMMouseScroll', this.scrollFunc, false);
        }//W3C
        window.onmousewheel = document.onmousewheel = this.scrollFunc;//IE/Opera/Chrome
      },
      scrollFunc(evt) {
        evt = evt || window.event;
        if(evt.preventDefault) {
          // Firefox
          evt.preventDefault();
          evt.stopPropagation();
        } else{
          // IE
          evt.cancelBubble=true;
          evt.returnValue = false;
        }
        return false;
      },
      routerLink(index, path) {
        // 点击哪个路由就赋值给自定义的下下标
        this.navIndex = index;
        if (index == 0) {
          this.isShow = true;
          this.isShow33 = true
        } else {
          this.isShow = false;
          this.isShow33 = false
        }
        // 路由跳转
        this.$router.push(path)
      },
      checkRouterLocal(path) {
        // 查找当前路由下标高亮
        this.navIndex = this.nav.findIndex(item => item.path === path);
      },
      //语言切换
      langChange() {
        if(this.value  == "en"){
          this.value = "cn";
          this.langValue = "中"
        }else{
          this.value = "en";
          this.langValue = "En"
        }
        localStorage.setItem('lang', this.value);
        this.$i18n.locale = this.value;
        SwitchLanguaga()
        //window.location.reload()
      },
      titleClick() {
        this.drawer = true
      },
      whiteIcon1(){
        this.nav2[0].whiteTrue = true;
        this.nav2[1].whiteTrue = false;
        this.nav2[2].whiteTrue = false;
        this.nav2[3].whiteTrue = false;
        this.nav2[4].whiteTrue = false;
        this.nav2[5].whiteTrue = false;
      },
      whiteIcon2(){
        this.nav2[0].whiteTrue = false;
        this.nav2[1].whiteTrue = true;
        this.nav2[2].whiteTrue = false;
        this.nav2[3].whiteTrue = false;
        this.nav2[4].whiteTrue = false;
        this.nav2[5].whiteTrue = false;
      },
      whiteIcon3(){
        this.nav2[0].whiteTrue = false;
        this.nav2[1].whiteTrue = false;
        this.nav2[2].whiteTrue = true;
        this.nav2[3].whiteTrue = false;
        this.nav2[4].whiteTrue = false;
        this.nav2[5].whiteTrue = false
      },
      whiteIcon4(){
        this.nav2[0].whiteTrue = false;
        this.nav2[1].whiteTrue = false;
        this.nav2[2].whiteTrue = false;
        this.nav2[3].whiteTrue = true;
        this.nav2[4].whiteTrue = false;
        this.nav2[5].whiteTrue = false
      },
      whiteIcon5(){
        this.nav2[0].whiteTrue = false;
        this.nav2[1].whiteTrue = false;
        this.nav2[2].whiteTrue = false;
        this.nav2[3].whiteTrue = false;
        this.nav2[4].whiteTrue = true;
        this.nav2[5].whiteTrue = false
      },
      whiteIcon6(){
        this.nav2[0].whiteTrue = false;
        this.nav2[1].whiteTrue = false;
        this.nav2[2].whiteTrue = false;
        this.nav2[3].whiteTrue = false;
        this.nav2[4].whiteTrue = false;
        this.nav2[5].whiteTrue = true
      }

    },
    watch: {
      "$route"() {
        // 获取当前路径
        let path = this.$route.path;
        // 检索当前路径
        this.checkRouterLocal(path);
      },
      isShow(){
        if(this.isShow == true){
          this.disabledMouseWheel()
          //window.onload = this.disabledMouseWheel;
        }else{
          window.onmousewheel = document.onmousewheel = null;
          window.addEventListener('mousewheel',this.handleScroll,false);
          window.addEventListener('DOMMouseScroll',this.handleScroll,false);
        }
      }
    },
    mounted() {}
  }
</script>
<style>

</style>

