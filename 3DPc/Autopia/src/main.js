// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {Carousel,CarouselItem,Drawer} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import i18n from "./i18n/i18n";
import locale from 'element-ui/lib/locale/lang/en';
import VueAnimateNumber from 'vue-animate-number';
import "lib-flexible";
Vue.config.productionTip = false;
Vue.use(VueAnimateNumber);
Vue.use(locale);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Drawer);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
});
