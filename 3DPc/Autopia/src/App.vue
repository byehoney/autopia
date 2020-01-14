<template>
  <div id="app">
    <keep-alive></keep-alive>
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
    },
    mounted() {
      setInterval(this.shutDown, 5000);
      // chrome and ie（谷歌和IE）
      window.addEventListener('mousewheel',this.handleScroll,false);
      window.addEventListener('touchstart',this.TouchStart,false);
      window.addEventListener('touchmove',this.TouchMove,false);
      window.addEventListener('touchend',this.TouchEnd,false);
      //fireFox
      window.addEventListener('DOMMouseScroll',this.handleScroll,false);

    },
    created() {
    },
    beforeCreate(){
    }
  }
</script>

<style>

</style>
