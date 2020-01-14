import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/chart',
      name: 'chart',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "chart" */ './views/Chart.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },{
      path: '/dataShowOne',
      name: 'dataShowOne',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "dataShowOne" */ './views/DataShowOne.vue')
    },{
      path: '/dataShowTwo',
      name: 'dataShowTwo',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "dataShowTwo" */ './views/DataShowTwo.vue')
    },{
      path: '/dataShowThree',
      name: 'dataShowThree',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "dataShowThress" */ './views/DataShowThree.vue')
    },{
      path: '/dataShowFour',
      name: 'dataShowFour',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "dataShowFour" */ './views/DataShowFour.vue')
    },{//抖音
      path: '/thrill',
      name: 'thrill',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "thrill" */ './views/Thrill.vue')
    },{//微博微视
      path: '/weibo',
      name: 'weibo',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "Weibo" */ './views/Weibo.vue')
    },{//其他矩阵其他
      path: '/otherOne',
      name: 'otherOne',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "otherOne" */ './views/OtherOne.vue')
    },{
      path: '*', // 未匹配到路由时重定向
      redirect: '/',
      meta: {
          // auth: true,
          // keepAlive: true
      }
    }
  ]
})
// router.beforeEach((to, from, next) => {
//   next();
// })
export default router
