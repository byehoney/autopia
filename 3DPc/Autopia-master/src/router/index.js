import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router);
NProgress.configure({
  easing: 'ease',  // 动画方式
  speed: 500,  // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
});
const router =  new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(["@/components/home"],resolve),
      name: 'home',
      meta:{index:0},
    },
    {
      path: '/home',
      name: 'home',
      component: resolve => require(["@/components/home"],resolve),
      meta:{index:0},
    },
    {
      path: '/milestOne',
      name: 'milestOne',
      component: resolve => require(["@/components/milestOne"],resolve),
      meta:{index:2},
    },
    {
      path: '/ourProducts',
      name: 'ourProducts',
     component: resolve => require(["@/components/ourProducts"],resolve),
      meta:{index:3},
    },
    {
      path: '/usersPosition',
      name: 'usersPosition',
      component: resolve => require(["@/components/usersPosition"],resolve),
      meta:{index:4},
    },
    {
      path: '/starTeam',
      name: 'starTeam',
     component: resolve => require(["@/components/starTeam"],resolve),
      meta:{index:5},
    },
    {
      path: '/AboutUs',
      name: 'AboutUs',
     component: resolve => require(["@/components/AboutUs"],resolve),
      meta:{index:6},
    },
  ],
});
router.beforeEach((to,from,next) => {
  NProgress.start();
  next()
});

router.afterEach(() => {
  NProgress.done();
});
export default router;
