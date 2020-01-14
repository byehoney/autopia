<template>
  <div class="left fl" id="left">
      <div class="tabs" id="tabs">
        <div :class="['tabItem',actIndex==0?'active':'']" @click="selTab(0)">
          <div class="tabBar">
            <img src="../images/shouye.png" v-if="actIndex==0" alt="" class="leftIcon fl">
            <img src="../images/shouye_grey.png" v-else alt="" class="leftIcon fl">
            <span class="fl">首页</span>
            <img src="../images/right_icon.png" alt="" class="rightIcon downAngel fr">
          </div>
          <div :class="['subMenu',animate?'animated slideInDown1':'']" v-if="actIndex==0&&showSub==0">
            <div :class="['menuItem',subIndex==0?'active':'']" @click.stop="subHome(0)">数据概况</div>
            <div :class="['menuItem',subIndex==1?'active':'']" @click.stop="subHome(1)">用户分析</div>
          </div>
        </div>
        <div :class="['tabItem',actIndex==1?'active':'']" @click="selTab(1)">
          <div class="tabBar active">
            <img src="../images/wlk.png" v-if="actIndex==1" alt="" class="leftIcon fl">
            <img src="../images/wlk_grey.png" v-else alt="" class="leftIcon fl">
            <span class="fl">微路况</span>
            <img src="../images/right_icon.png" alt="" class="rightIcon downAngel fr">
          </div>
          <div :class="['subMenu',animate?'animated slideInDown':'']" v-if="actIndex==1&&showSub==1">
            <div :class="['menuItem',subIndex==0?'active':'']" @click.stop="subTab(0)">用户数据</div>
            <div :class="['menuItem',subIndex==1?'active':'']" @click.stop="subTab(1)">用户分析</div>
            <div :class="['menuItem',subIndex==2?'active':'']" @click.stop="subTab(2)">图文数据</div>
            <div :class="['menuItem',subIndex==3?'active':'']" @click.stop="subTab(3)">图文分析</div>
          </div>
        </div>
        <!-- <div :class="['tabItem',actIndex==2?'active':'']" @click="selTab(2)">
          <div class="tabBar">
            <img src="../images/weifu_grey.png" v-if="actIndex==2" alt="" class="leftIcon fl">
            <img src="../images/weifu.png" v-else alt="" class="leftIcon fl">
            <span class="fl">微路况服务号</span>
            <img src="../images/right_icon.png" alt="" class="rightIcon downAngel fr">
          </div>
          <div :class="['subMenu',animate?'animated slideInDown':'']" v-if="actIndex==2&&showSub==2">
            <div :class="['menuItem',subIndex==0?'active':'']" @click.stop="subTab(0)">用户数据</div>
            <div :class="['menuItem',subIndex==1?'active':'']" @click.stop="subTab(1)">用户分析</div>
            <div :class="['menuItem',subIndex==2?'active':'']" @click.stop="subTab(2)">图文数据</div>
            <div :class="['menuItem',subIndex==3?'active':'']" @click.stop="subTab(3)">图文分析</div>
          </div>
        </div> -->
        <div :class="['tabItem',actIndex==3?'active':'']" @click="selTab(3)">
          <div class="tabBar">
            <img src="../images/chaweizhang.png" v-if="actIndex==3" alt="" class="leftIcon fl">
            <img src="../images/chaweizhang_grey.png" v-else alt="" class="leftIcon fl">
            <span class="fl">查违章</span>
            <img src="../images/right_icon.png" alt="" class="rightIcon downAngel fr">
          </div>
          <div :class="['subMenu',animate?'animated slideInDown':'']" v-if="actIndex==3&&showSub==3">
            <div :class="['menuItem',subIndex==0?'active':'']" @click.stop="subTab(0)">用户数据</div>
            <div :class="['menuItem',subIndex==1?'active':'']" @click.stop="subTab(1)">用户分析</div>
            <div :class="['menuItem',subIndex==2?'active':'']" @click.stop="subTab(2)">图文数据</div>
            <div :class="['menuItem',subIndex==3?'active':'']" @click.stop="subTab(3)">图文分析</div>
          </div>
        </div>
        <div :class="['tabItem',actIndex==4?'active':'']" @click="selTab(4)">
          <div class="tabBar">
            <img src="../images/wxst.png" v-if="actIndex==4" alt="" class="leftIcon fl">
            <img src="../images/wxst_grey.png" v-else alt="" class="leftIcon fl">
            <span class="fl">微信生态流量</span>
            <img src="../images/right_icon.png" alt="" class="rightIcon downAngel fr">
          </div>
          <div :class="['subMenu',animate?'animated slideInDown':'']" v-if="actIndex==4&&showSub==4">
            <div :class="['menuItem',subIndex==0?'active':'']" @click.stop="subTab(0)">用户数据</div>
            <div :class="['menuItem',subIndex==1?'active':'']" @click.stop="subTab(1)">用户分析</div>
            <div :class="['menuItem',subIndex==2?'active':'']" @click.stop="subTab(2)">图文数据</div>
            <div :class="['menuItem',subIndex==3?'active':'']" @click.stop="subTab(3)">图文分析</div>
          </div>
        </div>
        <div :class="['tabItem',actIndex==5?'active':'']" @click="selTab(5)">
          <div class="tabBar">
            <img src="../images/other.png" v-if="actIndex==5" alt="" class="leftIcon fl">
            <img src="../images/other_grey.png" v-else alt="" class="leftIcon fl">
            <span class="fl">其他矩阵流量</span>
            <img src="../images/right_icon.png" alt="" class="rightIcon downAngel fr">
          </div>
          <!-- <div :class="['subMenu',animate?'animated slideInDown':'']" v-if="actIndex==5&&showSub==5">
            <div :class="['menuItem',subIndex==0?'active':'']" @click.stop="subOther(0)">抖音</div>
            <div :class="['menuItem',subIndex==1?'active':'']" @click.stop="subOther(1)">微博微视</div>
            <div :class="['menuItem',subIndex==2?'active':'']" @click.stop="subOther(2)">其他</div>
          </div> -->
        </div>
      </div>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex';
export default {
  data(){
    return {
      animate:false,//是否展示下拉动画
      actIndex:'',
      showSub:'',
      subIndex:''
    }
  },
  computed:{
    ...mapState([
      'curIndex',
      'curShowSub',
      'curSubIndex',
      'size'
    ])
  },
  watch:{
    $route(to,from){
      console.log(to);
    }
  },
  mounted(){
    this.actIndex = this.curIndex;
    this.showSub = this.curShowSub;
    this.subIndex = this.curSubIndex;
  },
  methods:{
    ...mapMutations([
      'saveCurIndex',
      'saveCurSubIndex'
    ]),
    selTab(index){
      this.animate = true;
      this.actIndex = index;
      this.showSub = index;
      this.saveCurIndex(index);
      this.saveCurSubIndex(-1);
      if(index==0){
        this.subIndex = 0;
        this.saveCurSubIndex(0);
        this.$router.push('/');
      }else if(index==5){
        this.subIndex = 0;
        this.saveCurSubIndex(0);
        this.$router.push({name:'thrill',query:{t:Date.now()},params: {type: this.actIndex,subIndex:0}});
      }else{
        this.subIndex = 0;
        this.saveCurSubIndex(0);
        this.$router.push({name:'dataShowOne',query:{t:Date.now()},params: {type: this.actIndex,subIndex:0}});
      }
    },
    subHome(index){
      this.animate = false;
      this.subIndex = index;
      this.saveCurSubIndex(index);
      if(index==0){
        this.$router.replace('/')
      }else if(index==1){
        this.$router.push({name:'chart',query:{t:Date.now()},params: {type: this.actIndex,subIndex:index,t:Date.now()}})
      }
    },
    subOther(index){
      this.animate = false;
      this.subIndex = index;
      this.saveCurSubIndex(index);
      if(index==0){
        this.$router.push({name:'thrill',query:{t:Date.now()},params: {type: this.actIndex,subIndex:index,t:Date.now()}})
      }else if(index==1){
        this.$router.push({name:'weibo',query:{t:Date.now()},params: {type: this.actIndex,subIndex:index,t:Date.now()}})
      }else if(index==2){
        this.$router.push({name:'otherOne',query:{t:Date.now()},params: {type: this.actIndex,subIndex:index,t:Date.now()}})
      }
    },
    subTab(index){
      this.animate = false;
      this.subIndex = index;
      this.saveCurSubIndex(index);
      if(index==0){
        this.$router.push({name:'dataShowOne',query:{t:Date.now()},params: {type: this.actIndex,subIndex:index,t:Date.now()}})
      }else if(index==1){
        this.$router.push({name:'dataShowTwo',query:{t:Date.now()},params: {type: this.actIndex,subIndex:index,t:Date.now()}})
      }else if(index==2){
        this.$router.push({name:'dataShowThree',query:{t:Date.now()},params: {type: this.actIndex,subIndex:index,t:Date.now()}})
      }else if(index==3){
        this.$router.push({name:'dataShowFour',query:{t:Date.now()},params: {type: this.actIndex,subIndex:index,t:Date.now()}})
      }
    }
  }
}
</script>
<style scoped>
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .left{
    margin-right: 20px;
  }
  .left,.tabs{
    width: 200px;
    height: 1580px;
  }
  .tabs{
    padding-top: 32px;
    background: #fff;
  }
  .left .tabItem{
    margin: 0 auto 20px;
    cursor: pointer;
  }
  .left .tabItem .tabBar{
    position: relative;
    z-index: 100;
    margin: 0 auto;
    width: 200px;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    /* background: url('../images/left_bg.png') no-repeat 0 0; */
  }
  .left .tabItem.active .tabBar{
    /* background: url('../images/left_bg_act.png') no-repeat 0 0; */
  }
  .tabItem .leftIcon{
    width: 34px;
    height: 34px;
    margin: 8px 5px 0 16px;
  }
  .tabItem span{
    font-family: 'microsoft yahei';
    font-size: 16px;
    color: #333;
    /* font-weight: lighter; */
  }
  .left .tabItem.active span{
    color: #1BC787;
    /* font-weight: 300; */
  }
  .tabItem .rightIcon.angel{
    width:0;
    height:0;
    border-top:6px solid transparent;
    border-bottom:6px solid transparent;
    border-left:10px solid #B5B5B5;
    display: inline-block;
    margin-top: 20px;
    margin-right: 16px;
  }
  .tabItem.active .rightIcon.angel{
    border-left:10px solid  #1BC787;; 
  }
  .tabItem .rightIcon.downAngel{
    width:0;
    height:0;
    border-right:6px solid transparent;
    border-left:6px solid transparent;
    border-top:10px solid #B5B5B5;;
    display: inline-block;
    margin-top: 20px;
    margin-right: 16px;
    opacity: 0.5;
  }
  .tabItem.active .rightIcon.downAngel{
    width:0;
    height:0;
    border-right:6px solid transparent;
    border-left:6px solid transparent;
    border-top:10px solid #1BC787;
    display: inline-block;
    margin-top: 20px;
    margin-right: 10px;
    opacity: 0.5;
    transform: rotate(180deg);
  }
  .tabItem .subMenu{
    text-align: center;
    color:#fff;
    line-height: 40px;
    width: 190px;
    margin-left: 5px;
    padding:13px 0 27px;
    /* font-weight: lighter; */
  }
  .tabItem .subMenu .menuItem{
    width: 100%;
    height: 41px;
    line-height: 41px;
    text-align: center;
    letter-spacing: 1.56px;
    font-size: 14px;
    color: #2C2C2C;
  }
  .tabItem .subMenu .menuItem.active{
    background-color: rgba(0,0,0,0.05);
    font-size: 14px;
    color: #1BC787;
    letter-spacing: 1.56px;
    line-height: 41px;
    position: relative;
    /* font-weight: 500; */
  }
  .tabItem .subMenu .menuItem.active::before{
    content:' ';
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #333;
    position: absolute;
    top: 18px;
    left: 20px;
    /* font-weight: lighter; */
  }
  .animated {
    -webkit-animation-duration: 0.8s;
    animation-duration: 0.8s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  @-webkit-keyframes slideInDown {
  from {
    -webkit-transform: translate3d(0, -40px, 0);
    transform: translate3d(0, -40px, 0);
    height: 0;
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    height: 164px;
  }
}

@keyframes slideInDown {
  from {
    -webkit-transform: translate3d(0, -40px, 0);
    transform: translate3d(0, -40px, 0);
    visibility: visible;
    height: 0;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    height: 164px
  }
}

.slideInDown {
  -webkit-animation-name: slideInDown;
  animation-name: slideInDown;
}

@-webkit-keyframes slideInDown1 {
  from {
    -webkit-transform: translate3d(0, -40px, 0);
    transform: translate3d(0, -40px, 0);
    height: 0;
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    height: 84px;
  }
}

@keyframes slideInDown1 {
  from {
    -webkit-transform: translate3d(0, -40px, 0);
    transform: translate3d(0, -40px, 0);
    visibility: visible;
    height: 0;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    height: 84px
  }
}

.slideInDown1 {
  -webkit-animation-name: slideInDown1;
  animation-name: slideInDown1;
}
</style>

