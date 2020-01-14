import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import filters from './filters/index'
import wechat from '@/common/wechat/index'
// import VeLine from 'v-charts/lib/line.common'
import DrawerLayout from 'vue-drawer-layout'
import AwesomePicker from 'vue-awesome-picker';
import md5 from 'js-md5';
// import BaiduMap from 'vue-baidu-map'
// import VueVideoPlayer from 'vue-video-player'
// import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'
import "normalize.css"
import "@/style/reset.scss"
// Vue.use(BaiduMap, {
//     // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//     ak: 'CbvGZwjbrnWurzE8xAKUoaeFjZIcSClx'
// })
Vue.use(AwesomePicker);
Vue.use(DrawerLayout)
// Vue.use(VueVideoPlayer)
import {Header, Tabbar,Toast,Field, TabItem ,Picker,Cell,Popup,Button,InfiniteScroll,Swipe, SwipeItem,DatetimePicker} from 'mint-ui';
Vue.use(InfiniteScroll);
Vue.component(Field.name, Field);
// Vue.component(VeLine.name, VeLine)
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Picker.name, Picker);
Vue.component(Cell.name, Cell);
Vue.component(Popup.name, Popup);
Vue.component(Button.name, Button);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Popup.name, Popup);
Vue.component(Header.name, Header);
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.use(wechat);
Vue.prototype.$md5 = md5;
// 注入全局过滤器
Object.keys(filters).forEach(item => {
    Vue.filter(item, filters[item])
})
Vue.Cancel = [];
router.beforeEach((to, from, next) => {   
    while (Vue.Cancel.length > 0) {        
        Vue.Cancel.shift()('cancel');   
    }    
    next();
})
// const wx = Vue.wechat;
// wx.config({
//     appId: '',
//     nonceStr: '',
//     signature: '',
//     timestamp: '',
//     jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
// })
Vue.config.productionTip = false
Vue.config.devtools = true
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
