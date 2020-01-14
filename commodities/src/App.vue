<template>
    <div id="app" style="opacity:1">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
export default {
    data () {
        return {
            theme: 'red'
        }
    },
     computed: {
        themeClass() {
            return `theme-${this.theme}`;
        }
    },
}
</script>
<style lang="scss">
@import "./node_modules/normalize.css/normalize";
@import "style/common.scss";
body{
    -webkit-overflow-scrolling: touch;
}
html{
    background:rgba(235,235,235,1);
}
#app{
    background: #ebebeb;
}
.mint-toast.is-placemiddle{
  z-index: 10000!important;
}
// .drawer-layout .drawer-wrap .drawer{
//     background:linear-gradient(180deg,rgba(0,122,255,1) 0%,rgba(24,152,247,1) 100%)!important;
// }
.highcharts-credits{
    display: none;
}
.video-js .vjs-control-bar{
    bottom: 20px!important;
    height: 80px!important;
}
.video-js .vjs-big-play-button{
    width: 100px!important;
  height: 100px!important;
  border-radius: 50%!important;
  top: 250px!important;
  left: 50%!important;
  margin-left: -50px!important;
}
.home_video_list_content .video-js .vjs-big-play-button{
    top: 180px!important;
}
.detail_loop .video-js .vjs-volume-panel,.detail_loop .vjs-playback-rate,.detail_loop .video-js .vjs-time-control{
    display: none!important;
}
.vjs-big-play-button .vjs-icon-placeholder:before{
    position: relative!important;
    // top: 5px!important;
}
.detail_loop .vjs-play-control,.detail_loop .vjs-fullscreen-control{
    position: relative!important;
    // top: 15px;
}

.vjs-icon-replay:before, .video-js .vjs-play-control.vjs-ended .vjs-icon-placeholder:before{
    font-size: 32px!important;
    line-height: 80px;
}
.vjs-icon-fullscreen-enter:before, .video-js .vjs-fullscreen-control .vjs-icon-placeholder:before{
    font-size: 32px!important;
    line-height: 80px;
}
.vjs-icon-pause:before, .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder:before{
    font-size: 32px!important;
    line-height: 80px;
}
.vjs-icon-play:before, .video-js .vjs-big-play-button .vjs-icon-placeholder:before, .video-js .vjs-play-control .vjs-icon-placeholder:before{
    font-size: 32px!important;
    line-height: 80px;
}
// }
// .mint-header.manageHeader{
//     background-color: #fff;
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     .mintui{
//         color: #333;
//     }
//     .mint-header-title{
//         font-size:30px;
//         color:rgba(51,51,51,1);
//         line-height:40px;
//     }
// }
 #map  .anchorBL{
    display: none!important;
}
#map .BMapLabel{
    border:1px solid #f6f6f6!important;
    padding: 5px 8px!important;
    border-radius: 10px;
    color: #888;
}
</style>
