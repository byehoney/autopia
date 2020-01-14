<template>
  <div id="app">
    <div id="videoPlay" v-if="DOWN">
      <video id="video" autoplay muted>
        <source src="../static/videoPlay/Particle.mp4" type="video/mp4">
      </video>
    </div>
    <div class="classs" v-show="UP">
      <transition-group :name="transitionName" v-on:enter="enter" v-on:after-enter="afterEnter">
        <titleMenu :key="1"></titleMenu>
        <router-view :key="2"></router-view>
      </transition-group>
    </div>
  </div>
</template>
<script>
  import titleMenu from "./components/titleMenu"
  export default {
    name: 'App',
    components: {
      titleMenu,
    },
    data() {
      return {
        transitionName: '',
        UP: false,
        DOWN: true,
        changeActive: 0,
        startX:0,
        startY:0,
        x:0,
        y:0,
        xmlhttp:null,
        navList: [
          {title: 'messages.shouye', index: '/home'},
          {title: 'messages.lichengbei', index: '/milestOne'},
          {title: 'messages.womenchanpin', index: '/ourProducts'},
          {title: 'messages.yonghudingwei', index: '/usersPosition'},
          {title: 'messages.mingxingtyuandui', index: '/starTeam'},
          {title: 'messages.guanyuwomen', index: '/AboutUs'},
        ],
      }
    },
    watch: {//使用watch 监听$router的变化
      $route(to, from) {
        //如果to索引大于from索引,判断为前进状态,反之则为后退状态
        if (to.meta.index > from.meta.index) {
          //设置动画名称
          this.transitionName = 'slide-left';
        } else {
          this.transitionName = 'slide-right';
        }
      },

    },
    methods: {
      enter(el){
        this.disabledMouseWheel()
      },
      afterEnter(el){
        window.onmousewheel = document.onmousewheel = null;
        window.addEventListener('mousewheel',this.handleScroll,false);
        window.addEventListener('DOMMouseScroll',this.handleScroll,false);
      },
      onLoading() {
        const loading = this.$loading({           // 声明一个loading对象
          lock: true,                             // 是否锁屏
          text: '拼命加载中',                     // 加载动画的文字
          spinner: 'el-icon-loading',             // 引入的loading图标
          background: 'rgba(255, 255, 255, 1)',       // 背景颜色
          target: '#home',                        // 需要遮罩的区域
          body: true,
          customClass: 'mask'                     // 遮罩层新增类名
        });
        setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
          loading.close();                        // 关闭遮罩层
        }, 3000);
      },
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
      handleScroll(e) {
        //用来判断滚轮是向上滑动还是向下
        let direction = e.deltaY > 0 ? 'down' : 'up';
        let arrList = this.navList;
        //鼠标滚轮向下或后
        if (direction == 'down') {
          if (this.changeActive < arrList.length - 1) {
            this.changeActive = this.changeActive + 1;
            //跟随着选项卡而切换，以score作为下标实现路由的path的读取
            this.$router.push({path: arrList[this.changeActive].index})
          }
        } else {//向上或前
          if (this.changeActive > 0) {
            this.changeActive = this.changeActive - 1;
            this.$router.push({path: arrList[this.changeActive].index})
          }
        }
      },
      TouchStart(e){//触摸
        this.y = 0;
        e.preventDefault();
        var touch=e.touches[0];
        //this.startX = touch.pageX;   //刚触摸时的坐标   x
        this.startY = touch.pageY;   //刚触摸时的坐标   y
      },
      TouchMove(e){//滑动
        e.preventDefault();
        var  touch = e.touches[0];
        //this.startY = touch.pageY;
        //this.x = this.startX - touch.pageX;//滑动的距离 x
        this.y = this.startY - touch.pageY;//滑动的距离 y

      },
      TouchEnd(e) {
        //let direction = e.deltaY > 0 ? 'down' : 'up';
        let arrList = this.navList;
        //鼠标滚轮向下或后
        if (this.y > 200) {
          if (this.changeActive < arrList.length - 1) {
            this.changeActive = this.changeActive + 1;
            //跟随着选项卡而切换，以score作为下标实现路由的path的读取
            this.$router.push({path: arrList[this.changeActive].index})
          }
        } else if( this.y <-200){//向上或前
          if (this.changeActive > 0) {
            this.changeActive = this.changeActive - 1;
            this.$router.push({path: arrList[this.changeActive].index})
          }
        }
        this.y = 0
      },
      shutDown() {
        this.UP = true;
        this.DOWN = false;
      },
      xhr(){
        var xhr = new XMLHttpRequest();
        xhr.open("GET","../static/lensflare/1.jpg");
        xhr.onprogress = function(e){
          console.log(e.loaded);
        }
      }
    },
    mounted() {
      setInterval(this.shutDown, 12000);
      // chrome and ie（谷歌和IE）
      window.addEventListener('mousewheel',this.handleScroll,false);
      window.addEventListener('touchstart',this.TouchStart,false);
      window.addEventListener('touchmove',this.TouchMove,false);
      window.addEventListener('touchend',this.TouchEnd,false);
      //fireFox
      window.addEventListener('DOMMouseScroll',this.handleScroll,false);

    },
    created() {
      this.xhr()
    },
    beforeCreate(){
    }
  }
</script>

<style>
  @import "./common/font/font.css";
  @import "./common/style/media.css";
  @import "./common/style/375_style.css";

  * {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 悦黑;
    overflow: auto;
  }

  body::-webkit-scrollbar {
    display: none;
  }
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    will-change: transform;
    transition: all 0.8s;
    position: absolute;
  }

  .slide-right-enter {
    opacity: 1;
    transform: translateY(-100%);
  }

  .slide-right-leave-active {
    opacity: 1;
    transform: translateY(100%);
  }

  .slide-left-enter {
    opacity: 1;
    transform: translateY(100%);
  }

  .slide-left-leave-active {
    opacity: 1;
    transform: translateY(-100%);
  }
</style>
