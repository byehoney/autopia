// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store/'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {
  get,
  post
} from '@/config/http'
//解决低版本兼容问题
import "babel-polyfill";
import VueClipboard from 'vue-clipboard2'
import VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Egrid from 'egrid'
Vue.use(ElementUI);
Vue.use(Egrid)
Vue.use(VueQuillEditor)
Vue.use(VueClipboard)
// ————————————————
// 版权声明：本文为CSDN博主「webmxj」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/div_ma/article/details/79536634
// import '@/permission'//动态权限
// import '@/utils/global'//全局
// import '@/utils/btnPermission'//页面按钮权限

// 引入mockjs
// require('./mock/index.js')

Vue.config.productionTip = false



Vue.prototype.$get = get;
Vue.prototype.$post = post;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
