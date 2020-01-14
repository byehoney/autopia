import Vue from 'vue'
import Router from 'vue-router'
import Manage from '@/page/manage'

Vue.use(Router)
const error404 = r => require.ensure([], () => r(require('@/page/errorPage/404')), 'error404'); //404页面
const Login = r => require.ensure([], () => r(require('@/page/login/index')), 'login'); //登陆
const GoodsManage = r => require.ensure([], () => r(require('@/page/goodsManage/index')), 'goodsManage'); //商品管理
const GoodsList = r => require.ensure([], () => r(require('@/page/goodsManage/GoodsList')), 'goodsList'); //商品列表
const AddGoods = r => require.ensure([], () => r(require('@/page/goodsManage/AddGoods')), 'goodsList'); //添加商品
const EditGoods = r => require.ensure([], () => r(require('@/page/goodsManage/EditGoods')), 'editGoods'); //编辑商品
const GoodsStock = r => require.ensure([], () => r(require('@/page/goodsManage/GoodsStock')), 'goodsStock'); //草稿箱


const OrderManage = r => require.ensure([], () => r(require('@/page/orderManage/index')), 'orderManage'); //订单管理
const OrderList = r => require.ensure([], () => r(require('@/page/orderManage/OrderList')), 'orderManage'); //订单列表
const AfterSaleOrder = r => require.ensure([], () => r(require('@/page/orderManage/AfterSaleOrder')), 'afterSaleOrder'); //售后订单


const SettleManage = r => require.ensure([], () => r(require('@/page/settleManage/index')), 'settleManage'); //结算管理
const SettleAcount = r => require.ensure([], () => r(require('@/page/settleManage/SettleAcount')), 'settleAcount'); //结算账户管理
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
        redirect: 'goodsList'
      },{
        path: 'goodsList',
        name: '商品列表',
        component: GoodsList,
        meta: {
          title: '商品列表'
        }
      },{
        path: 'addGoods',
        name: '添加商品',
        component: AddGoods,
        meta: {
          title: '添加商品'
        }
      },{
        path: 'editGoods',
        name: '编辑商品',
        component: EditGoods,
        meta: {
          title: '编辑商品'
        }
      },{
        path:'goodsStock',
        name:'草稿箱',
        component:GoodsStock,
        meta:{
          title:'草稿箱'
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
        name:'订单管理',
        component:OrderList,
        meta:{
          title:'订单管理'
        }
      },{
        path:'afterSaleOrder',
        name:'售后管理',
        component:AfterSaleOrder,
        meta:{
          title:'售后管理'
        }
      }]
    },{
      path: "/settleManage",
      component: SettleManage,
      meta: {
        title: "结算管理"
      },
      children:[{
        path: '/',
        redirect: 'settleAcount'
      },{
        path:'settleAcount',
        name:'设置提现账户',
        component:SettleAcount,
        meta:{
          title:'设置提现账户'
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
