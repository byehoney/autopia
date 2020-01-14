<template>
  <div class="box" :style="boxStyle">
      <div id="app" :style="styleObj">
          <div class="headerContainer">
            <div class="header">
              <img class="logo" src="./images/logo.png" alt="">
              <p>车托帮智能数据平台</p>
            </div>
          </div>
          <div class="appContainer">
            <LeftBar></LeftBar>
            <router-view :key="$route.path + $route.query.t" ></router-view>
          </div>
    </div>
  </div>
</template>
<script>
import LeftBar from './components/Left'
import {mapMutations} from 'vuex'
export default {
  data(){
    return{
      screenWidth:0,
      screenHeight:0,
      scaleValue:1,
      boxStyle:{},
      styleObj:{

      },
    }
  },
  components:{
    LeftBar,
  },
  mounted(){
    this.screenWidth = window.screen.width;
    this.screenHeight = window.screen.height;
    console.log(this.screenHeight)
    if(this.screenWidth>1920){
      document.getElementsByTagName('body')[0].style.height = window.innerHeight+'px';
      this.scaleValue = this.screenWidth/1920;
      this.saveZoom(this.scaleValue);
      this.styleObj={
        transform:'scale('+this.scaleValue+')',
        transformOrigin:`0 0`
      }
      this.boxStyle = {
        height:this.screenHeight+'px'
      }
      console.log(this.$store)
    }
  },
  methods:{
    ...mapMutations(['saveZoom'])
  }
}
</script>
<style lang="less">
  @import './style/font.css';
  @import './style/common.css';
  *{
    padding: 0;
    margin: 0;
  }
  body{
    width: 100%;
    // height: 1080px;
    background-color: #F6F8F9;
    // background: #1a1a1a url('./images/main_bg.png') no-repeat 0 0;
    font-family: 'Microsoft Yahei','SimSun','SimHei','KaiTi';
    padding-bottom: 40px;
  }
  .appContainer{
    width: 1080px;
    overflow: hidden;
    margin: 0 auto;
    // position: absolute;
  }
  .headerContainer{
    width: 100%;
    height: 62px;
    background-color: #fff;
    margin-bottom: 20px;
  }
  .header{
    width: 1050px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding-left: 30px;
    font-family: PingFangSC-Regular;
    font-size: 24px;
    color: #333333;
    letter-spacing: 2.67px;
  }
  .logo{
    width: 63px;
    height: 28px;
    margin-right: 10px;
  }
  #app{
    width: 100%;
    // height: 1080px;
    // padding-top: 18px;
  }
  .box{
    width: 100%;
    overflow: hidden;
  }
</style>
