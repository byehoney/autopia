import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import router from './router'
import store from './store'
// import './utils/resize.js'
import {  
  Loading,
  Select,
  Option,
  DatePicker,
} from 'element-ui'
Vue.use(Loading.directive)
Vue.use(Option)
Vue.component(Select.name, Select)
Vue.use(DatePicker)
Vue.prototype.$loading = Loading.service
Vue.config.productionTip = false
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
