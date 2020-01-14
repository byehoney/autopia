import Vue from 'vue'
import Router from 'vue-router'
import Manage from '@/page/manage'
import { Icon } from 'element-ui';

Vue.use(Router)
const error404 = r => require.ensure([], () => r(require('@/page/errorPage/404')), 'error404'); //404页面
const Login = r => require.ensure([], () => r(require('@/page/login/index')), 'login'); //登陆
const GoodsManage = r => require.ensure([], () => r(require('@/page/goodsManage/index')), 'goodsManage'); //商品管理
const BrandManage = r => require.ensure([], () => r(require('@/page/goodsManage/BrandManage')), 'brandManage'); //品牌管理
const ClassifyManage = r => require.ensure([], () => r(require('@/page/goodsManage/ClassifyManage')), 'classifyManage'); //分类管理
const GoodsList = r => require.ensure([], () => r(require('@/page/goodsManage/GoodsList')), 'goodsList'); //商品列表
const EditGoods = r => require.ensure([], () => r(require('@/page/goodsManage/EditGoods')), 'editGoods'); //编辑商品

const SystermManage = r => require.ensure([], () => r(require('@/page/systermManage/index')), 'systermManage'); //系统管理
const AdminCounts = r => require.ensure([], () => r(require('@/page/systermManage/AdminCounts')), 'adminCounts'); //管理员账号
const SupplierManage = r => require.ensure([], () => r(require('@/page/systermManage/SupplierManage')), 'supplierManage'); //供应商管理
const PlatPrice = r => require.ensure([], () => r(require('@/page/systermManage/PlatPrice')), 'platPrice'); //平台定价

const UserManage = r => require.ensure([], () => r(require('@/page/userManage/index')), 'userManage'); //用户管理
const UserList = r => require.ensure([], () => r(require('@/page/userManage/UserList')), 'userList'); //用户列表

const OrderManage = r => require.ensure([], () => r(require('@/page/orderManage/index')), 'orderManage'); //订单管理
const OrderList = r => require.ensure([], () => r(require('@/page/orderManage/OrderList')), 'orderList'); //订单列表
const AfterSaleOrder = r => require.ensure([], () => r(require('@/page/orderManage/AfterSaleOrder')), 'afterSaleOrder'); //售后订单

const SettleManage = r => require.ensure([], () => r(require('@/page/settleManage/index')), 'settleManage'); //结算管理
const WithDrawals = r => require.ensure([], () => r(require('@/page/settleManage/WithDrawals')), 'withDrawals'); //用户提现

const PageManage = r => require.ensure([], () => r(require('@/page/pageManage/index')), 'pageManage'); //页面管理
const GoodsRecommend = r => require.ensure([], () => r(require('@/page/pageManage/GoodsRecommend')), 'goodsRecommend'); //商品推荐管理
const IconManage = r => require.ensure([], () => r(require('@/page/pageManage/IconManage')), 'iconManage'); //icon管理
const AdManage = r => require.ensure([], () => r(require('@/page/pageManage/AdManage')), 'adManage'); //广告管理

const DataManage = r => require.ensure([], () => r(require('@/page/dataManage/index')), 'dataManage'); //数据管理
const DataBackLog = r => require.ensure([], () => r(require('@/page/dataManage/DataBackLog')), 'dataBackLog'); //数据看板
const vueRouter = new Router({
  routes: [{
      path: '/',
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      component: error404
    },
    {
      path: "/goodsManage",
      component: GoodsManage,
      meta: {
        title: "商品管理"
      },
      children:[{
        path: '/',
        redirect: 'brandManage'
      },{
        path: 'brandManage',
        name: '品牌管理',
        component: BrandManage,
        meta: {
          title: '品牌管理'
        }
      },{
        path: 'classifyManage',
        name: '分类管理',
        component: ClassifyManage,
        meta: {
          title: '分类管理'
        }
      },{
        path: 'goodsList',
        name: '商品列表',
        component: GoodsList,
        meta: {
          title: '商品列表'
        }
      },{
        path: 'editGoods',
        name: '编辑商品',
        component: EditGoods,
        meta: {
          title: '编辑商品'
        }
      }]
    },
    {
      path: "/systermManage",
      component: SystermManage,
      meta: {
        title: "系统管理"
      },
      children:[{
        path: '/',
        redirect: 'adminCounts'
      },{
        path:'adminCounts',
        name: '管理员账号',
        component: AdminCounts,
        meta: {
          title: '管理员账号'
        }
      },{
        path:'supplierManage',
        name: '供应商管理',
        component: SupplierManage,
        meta: {
          title: '供应商管理'
        }
      },{
        path:'platPrice',
        name: '平台定价',
        component: PlatPrice,
        meta: {
          title: '平台定价'
        }
      }]
    },{
      path: "/userManage",
      component: UserManage,
      meta: {
        title: "用户管理"
      },
      children:[{
        path: '/',
        redirect: 'userList'
      },{
        path:'userList',
        name: '用户列表',
        component: UserList,
        meta: {
          title: '用户列表'
        }
      }]
    },{
      path: "/orderManage",
      component: OrderManage,
      meta: {
        title: "订单管理"
      },
      children:[{
        path: '/',
        redirect: 'orderList'
      },{
        path:'orderList',
        name: '订单列表',
        component: OrderList,
        meta: {
          title: '订单列表'
        }
      },{
        path:'afterSaleOrder',
        name:'售后订单',
        component:AfterSaleOrder,
        meta:{
          title:'售后订单'
        }
      }]
    },
    {
      path: "/settleManage",
      component: SettleManage,
      meta: {
        title: "结算管理"
      },
      children:[{
        path: '/',
        redirect: 'withDrawals'
      },{
        path:'withDrawals',
        name: '用户提现',
        component: WithDrawals,
        meta: {
          title: '用户提现'
        }
      }]
    },{
      path: "/pageManage",
      component: PageManage,
      meta: {
        title: "页面管理"
      },
      children:[{
        path: '/',
        redirect: 'goodsRecommend'
      },{
        path:'goodsRecommend',
        name: '商品推荐',
        component: GoodsRecommend,
        meta: {
          title: '商品推荐'
        }
      },{
        path:'iconManage',
        name: 'Icon管理',
        component: IconManage,
        meta: {
          title: 'Icon管理'
        }
      },{
        path:'adManage',
        name: '广告管理',
        component: AdManage,
        meta: {
          title: '广告管理'
        }
      }]
    },
    {
      path:'/dataManage',
      component:DataManage,
      meta:{
        title:'数据管理'
      },
      children:[{
        path:'/',
        redirect:'dataBackLog'
      },{
        path:'dataBackLog',
        name:'数据看板',
        component:DataBackLog,
        meta:{
          title:'数据看板'
        }
      }]
    },
    {
      path: '/404',
      name: '出错了',
      component: error404
    }
  ]
  //路由样式
  // linkActiveClass: "active-router",
  // linkExactActiveClass: "exact-router"
})


// vueRouter.beforeEach(function (to, from, next) {
//   const nextRoute = [ 'account', 'order', 'course'];
//   const auth = store.state.auth;
//   //跳转至上述3个页面
//   if (nextRoute.indexOf(to.name) >= 0) {
//       //未登录
//       if (!store.state.auth.IsLogin) {
//           vueRouter.push({name: 'login'})
//       }
//   }
//   //已登录的情况再去登录页，跳转至首页
//   if (to.name === 'login') {
//       if (auth.IsLogin) {
//           vueRouter.push({name: 'home'});
//       }
//   }
//   next();
// });

export default vueRouter;
