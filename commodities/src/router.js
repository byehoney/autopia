import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from 'store/index'
Vue.use(Router)
const router = new Router({
    // mode:"hash",
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return { x: 0, y: savedPosition }
        }
        return { x: 0, y: 0 }
    },
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                title: '首页',
                auth: false, // 是否需要登录
                keepAlive: false // 是否缓存组件
            }
        }, {

            path: "/list",
            name: "list",
            component: () =>
                import(/* webpackChunkName: "list" */ './views/List.vue'),
            meta: {
                auth: true,
                keepAlive: false,
            }
        }, {
            path: "/detail",
            name: "detail",
            component: () =>
                import(/* webpackChunkName: "detail" */ './views/Detail.vue'),
            meta: {
                auth: true,
                keepAlive: false,
            }
        }, {
            path: "/flashdetail",
            name: "flashdetail",
            component: () =>
                import(/* webpackChunkName: "flashdetail" */ './views/FlashDetail.vue'),
            meta: {
                auth: true,
                keepAlive: false,
            }
        }, {
            path: "/watch",
            name: "watch",
            component: () =>
                import(/* webpackChunkName: "watch" */ './views/watch.vue')
        },
        {
            path: '/choose',
            name: 'choose',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "choose" */ './views/Choose.vue'),
            meta: {
                auth: true,
                keepAlive: true,
                canKeep: false
            }
        },
        {
            path: '/shopcar',
            name: 'shopcar',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "shopcar" */ './views/ShopCar.vue'),
            meta: {
                auth: true,
                keepAlive: false
            }
        },
        {
            path: "/choosegift",
            name: "choosegift",
            component: () =>
                import(/* webpackChunkName: "choosegift" */ "./views/ChooseGift.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '选择赠品'
            }
        },
        {
            path: "/public",
            name: "public",
            component: () =>
                import(/* webpackChunkName: "public" */ "./views/public.vue")
        },
        {
            path: '/my',
            name: 'my',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "my" */ './views/My.vue'),
            meta: {
                auth: true,
                keepAlive: false
            }
        },
        {
            path: '/search',
            name: 'search',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "search" */ './views/Search.vue'),
            meta: {
                auth: true,
                keepAlive: false
            }
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "about" */ './views/About.vue'),
            meta: {
                auth: true,
                keepAlive: false
            }
        },
        {
            path: '/baseInfo',
            name: 'baseInfo',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "baseInfo" */ './views/BaseInfo.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '个人中心',
            }
        },
        {
            path: '/address',
            name: 'address',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "address" */ './views/Address.vue'),
            meta: {
                auth: true,
                keepAlive: false
            }
        },
        {
            path: '/modiPass',
            name: 'modiPass',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "modiPass" */ './views/ModiPass.vue'),
            meta: {
                auth: false,
                keepAlive: false
            }
        },
        {
            path: '/modiTel',
            name: 'modiTel',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "modiTel" */ './views/ModiTel.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '更换手机号'
            }
        },
        {
            path: '/modiName',
            name: 'modiName',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "modiName" */ './views/ModiName.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '修改姓名'
            }
        },
        {
            path: '/register',
            name: 'register',
            component: () =>
                import(/* webpackChunkName: "register" */ './views/Register.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                title: '用户注册'
            }
        },
        {
            path: '/registerActor',
            name: 'registerActor',
            component: () =>
                import(/* webpackChunkName: "registerActor" */ './views/RegisterActor.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                title: '用户注册'
            }
        },
        {
            path: '/joinShop',
            name: 'joinShop',
            component: () =>
                import(/* webpackChunkName: "joinShop" */ './views/JoinShop.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                title: '加入门店'
            }
        },
        {
            path: '/creatNewShop',
            name: 'creatNewShop',
            component: () =>
                import(/* webpackChunkName: "creatNewShop" */ './views/CreatNewShop.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                title: '创建新门店'
            }
        },
        {
            path: '/salerInfo',
            name: 'salerInfo',
            component: () =>
                import(/* webpackChunkName: "salerInfo" */ './views/SalerInfo.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                title: '人员信息'
            }
        },
        {
            path: '/intelInfo',
            name: 'intelInfo',
            component: () =>
                import(/* webpackChunkName: "intelInfo" */ './views/IntelInfo.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                title: '资质信息'
            }
        },
        {
            path: '/businessScope',
            name: 'businessScope',
            component: () =>
                import(/* webpackChunkName: "businessScope" */ './views/BusinessScope.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                title: '经营范围'
            }
        },
        {
            path: '/pcLogin',
            name: 'pcLogin',
            component: () =>
                import(/* webpackChunkName: "pcLogin" */ './views/PcLogin.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                title: 'PC登录'
            }
        },
        {
            path: '/forgetPas',
            name: 'forgetPas',
            component: () =>
                import(/* webpackChunkName: "forgetPas" */ './views/ForgetPas.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                title: '忘记密码'
            }
        },
        {
            path: '/addNewAdr',
            name: 'addNewAdr',
            component: () =>
                import(/* webpackChunkName: "addNewAdr" */ './views/AddNewAdr.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '新增收货地址'
            }
        },
        {
            path: '/refuseList',
            name: 'refuseList',
            component: () =>
                import(/* webpackChunkName: "refuseList" */ './views/RefuseList.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '厂家拒开列表'
            }
        },
        {
            path: '/myOrders',
            name: 'myOrders',
            component: () =>
                import(/* webpackChunkName: "myOrders" */ './views/MyOrders.vue'),
            meta: {
                auth: true,
                keepAlive: true,
                title: '我的订单',
                canKeep: false
            }
        },
        {
            path: '/confirmOrders',
            name: 'confirmOrders',
            component: () =>
                import(/* webpackChunkName: "confirmOrders" */ './views/ConfirmOrders.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '确认订单',
                canKeep: false
            }
        },
        {
            path: '/hasEva',
            name: 'hasEva',
            component: () =>
                import(/* webpackChunkName: "hasEva" */ './views/HasEva.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '已评价'
            }
        },
        {
            path: '/evaForOrder',
            name: 'evaForOrder',
            component: () =>
                import(/* webpackChunkName: "evaForOrder" */ './views/EvaForOrder.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '评价晒单'
            }
        },
        {
            path: '/viewLogist',
            name: 'viewLogist',
            component: () =>
                import(/* webpackChunkName: "viewLogist" */ './views/ViewLogist.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '订单物流'
            }
        },
        {
            path: '/waiteGet',
            name: 'waiteGet',
            component: () =>
                import(/* webpackChunkName: "waiteGet" */ './views/WaiteGet.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '待收货'
            }
        },
        {
            path: '/waiteSend',
            name: 'waiteSend',
            component: () =>
                import(/* webpackChunkName: "waiteSend" */ './views/WaiteSend.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '待发货'
            }
        },
        {
            path: '/returnGoods',
            name: 'returnGoods',
            component: () =>
                import(/* webpackChunkName: "returnGoods" */ './views/ReturnGoods.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '退货'
            }
        },
        {
            path: '/applyReturn',
            name: 'applyReturn',
            component: () =>
                import(/* webpackChunkName: "applyReturn" */ './views/ApplyReturn.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '申请退货'
            }
        },
        {
            path: '/orderDetail',
            name: 'orderDetail',
            component: () =>
                import(/* webpackChunkName: "orderDetail" */ './views/OrderDetail.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '订单详情'
            }
        },
        {//空白页 做路由跳转
            path: '/blank',
            name: 'blank',
            component: () =>
                import(/* webpackChunkName: "blank" */ './views/Blank.vue'),
            meta: {
                auth: false,
                keepAlive: false,
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () =>
                import(/* webpackChunkName: "login" */ './views/login.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                title: '登录'
            }
        },
        {
            path: '/hotSuit',
            name: 'hotSuit',
            component: () =>
                import(/* webpackChunkName: "hotSuit" */ './views/HotSuit.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '人气套餐'
            }
        },
        {
            path: '/suitDetail',
            name: 'suitDetail',
            component: () =>
                import(/* webpackChunkName: "suitDetail" */ './views/SuitDetail.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '套餐详情'
            }
        },
        {
            path: '/bestGoods',
            name: 'bestGoods',
            component: () =>
                import(/* webpackChunkName: "bestGoods" */ './views/BestGoods.vue'),
            meta: {
                auth: true,
                keepAlive: true,
                canKeep: false,
                title: '精品买赠'
            }
        },
        {
            path: '/newShopCar',
            name: 'newShopCar',
            component: () =>
                import(/* webpackChunkName: "newShopCar" */ './views/NewShopCar.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                canKeep: false,
                title: '购物车'
            }
        },
        {
            path: '/productsList',
            name: 'productsList',
            component: () =>
                import(/* webpackChunkName: "productsList" */ './views/ProductsList.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '商品列表'
            }
        },
        {
            path: '/manageHome',
            name: 'manageHome',
            component: () =>
                import(/* webpackChunkName: "manageHome" */ './views/ManageHome.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '店铺'
            }
        },
        {
            path: '/kpiCheck',
            name: 'kpiCheck',
            component: () =>
                import(/* webpackChunkName: "kpiCheck" */ './views/KPIcheck.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '业绩查询'
            }
        },
        {
            path: '/kpiCheckList',
            name: 'kpiCheckList',
            component: () =>
                import(/* webpackChunkName: "kpiCheckList" */ './views/KPIcheckList.vue'),
            meta: {
                auth: true,
                keepAlive: true,
                canKeep: false,
                title: '业绩查询'
            }
        },
        {
            path: '/kpiCheckShop',
            name: 'kpiCheckShop',
            component: () =>
                import(/* webpackChunkName: "kpiCheckShop" */ './views/KPIcheckShop.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '门店详情'
            }
        },
        {
            path: '/manageWaitPass',
            name: 'manageWaitPass',
            component: () =>
                import(/* webpackChunkName: "manageWaitPass" */ './views/ManageWaitPass.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '待审核'
            }
        },
        {
            path: '/manageIntelPass',
            name: 'manageIntelPass',
            component: () =>
                import(/* webpackChunkName: "manageIntelPass" */ './views/ManageIntelPass.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '人员资质审核'
            }
        },
        {
            path: '/manageBusCover',
            name: 'manageBusCover',
            component: () =>
                import(/* webpackChunkName: "manageBusCover" */ './views/ManageBusCover.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '业务'
            }
        },
        {
            path: '/manageAdduser',//今日新增用户
            name: 'manageAddUser',
            component: () =>
                import(/* webpackChunkName: "manageCustomerRank" */ './views/ManageAddUser.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '店铺'
            }
        },
        {
            path: '/managestock',//库存不足7日商品
            name: 'managestock',
            component: () =>
                import(/* webpackChunkName: "manageCustomerRank" */ './views/ManageStock.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '店铺'
            }
        },
        {
            path: '/manageshortstock',//缺货商品
            name: 'manageshortstock',
            component: () =>
                import(/* webpackChunkName: "manageCustomerRank" */ './views/ManageShortStock.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '店铺'
            }
        },
        {
            path: '/managecamp',//缺货商品
            name: 'managecamp',
            component: () =>
                import(/* webpackChunkName: "manageCustomerRank" */ './views/ManageCamp.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '在营商品'
            }
        },
        {
            path: '/manageorderstatus',//缺货商品
            name: 'manageorderstatus',
            component: () =>
                import(/* webpackChunkName: "manageCustomerRank" */ './views/ManageOrderStatus.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '今日订单'
            }
        },
        {
            path: '/manageNoStock',//无库存商品
            name: 'manageNoStock',
            component: () =>
                import(/* webpackChunkName: "manageNoStock" */ './views/ManageNoStock.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '店铺'
            }
        },
        {
            path: '/manageuncelled',//库存不足7日商品
            name: 'manageuncelled',
            component: () =>
                import(/* webpackChunkName: "manageCustomerRank" */ './views/ManageUncelled.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '未动销查询'
            }
        },
        {
            path: '/manageshop',//未处理采购门店
            name: 'manageshop',
            component: () =>
                import(/* webpackChunkName: "manageCustomerRank" */ './views/ManageShop.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '店铺'
            }
        },
        {
            path: '/manageorder',//今日订单
            name: 'manageorder',
            component: () =>
                import(/* webpackChunkName: "manageCustomerRank" */ './views/ManageOrder.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '店铺'
            }
        },
        {
            path: '/manageOrderDetail',//今日订单详情
            name: 'manageOrderDetail',
            component: () =>
                import(/* webpackChunkName: "manageCustomerRank" */ './views/ManageOrderDetail.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '订单详情'
            }
        },
        {
            path: '/salesTrend',//销售走向图
            name: 'salesTrend',
            component: () =>
                import(/* webpackChunkName: "salesTrend" */ './views/SalesTrend.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '店铺'
            }
        },
        {
            path: '/manageSaleRank',//销售走向图
            name: 'manageSaleRank',
            component: () => import(/* webpackChunkName: "manageSaleRank" */ './views/ManageSaleRank.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '店铺'
            }
        },
        {
            path: '/manageCustomerRank',//销售客户排名
            name: 'manageCustomerRank',
            component: () =>
                import(/* webpackChunkName: "manageCustomerRank" */ './views/ManageCustomerRank.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '店铺'
            }
        },
        {
            path: '/manageProRank',//销售客户排名
            name: 'manageProRank',
            component: () =>
                import(/* webpackChunkName: "manageProRank" */ './views/ManageProRank.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '店铺'
            }
        },
        {
            path: '/manageSending',//配送中  
            name: 'manageSending',
            component: () =>
                import(/* webpackChunkName: "manageSending" */ './views/ManageSending.vue'),
            meta: {
                auth: true,
                keepAlive: true,
                canKeep:false,
                title: '配送中'
            }
        },
        {
            path: '/manageSendRoute',//配送中  运输路线
            name: 'manageSendRoute',
            component: () =>
                import(/* webpackChunkName: "manageSendRoute" */ './views/ManageSendRoute.vue'),
            meta: {
                auth: true,
                keepAlive: false,
                title: '配送详情'
            }
        },
        {
            path: '/agreement',
            name: 'agreement',
            component: () =>
                import(/* webpackChunkName: "agreement" */ './views/Agreement.vue'),
            meta: {
                auth: false,
                keepAlive: false,
                title: '人云科技软件服务及隐私协议'
            }
        },
        {
            path: "/classify",
            name: "classify",
            component: () =>
                import(/* webpackChunkName: "classify" */"./views/Classify.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '更多分类'
            }
        },
        {
            path: "/driverHome",
            name: "driverHome",
            component: () =>
                import(/* webpackChunkName: "driverHome" */"./views/DriverHome.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '司机端首页'
            }
        },
        {
            path: "/driverMoneyCheck",
            name: "driverMoneyCheck",
            component: () =>
                import(/* webpackChunkName: "driverMoneyCheck" */"./views/DriverMoneyCheck.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '费用查询'
            }
        },
        {//含待接单  待发货 未送达  已完成  已撤销
            path: "/driverWaiteAcept",
            name: "driverWaiteAcept",
            component: () =>
                import(/* webpackChunkName: "driverWaiteAcept" */"./views/DriverWaiteAcept.vue"),
            meta: {
                auth: true,
                keepAlive: true,
                canKeep:false,
                title: '待接单'
            }
        },
        {//待收货详情
            path: "/driverWaiteAceptDetail",
            name: "driverWaiteAceptDetail",
            component: () =>
                import(/* webpackChunkName: "driverWaiteAcept" */"./views/DriverWaiteAceptDetail.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '查看详情'
            }
        },
        {//待收货商品详情
            path: "/driverWaiteAceptGoods",
            name: "driverWaiteAceptGoods",
            component: () =>
                import(/* webpackChunkName: "driverWaiteAceptGoods" */"./views/DriverWaiteAceptGoods.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '商品详情'
            }
        },
        {//待发货商品详情
            path: "/driverWaiteSendDetail",
            name: "driverWaiteSendDetail",
            component: () =>
                import(/* webpackChunkName: "driverWaiteSendDetail" */"./views/DriverWaiteSendDetail.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '商品详情'
            }
        },
        {//待发货商品详情
            path: "/driverWaiteSendGoods",
            name: "driverWaiteSendGoods",
            component: () =>
                import(/* webpackChunkName: "driverWaiteSendGoods" */"./views/DriverWaiteSendGoods.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '商品详情'
            }
        },
        {//已完成详情
            path: "/driverFinishDetail",
            name: "driverFinishDetail",
            component: () =>
                import(/* webpackChunkName: "driverFinishDetail" */"./views/DriverFinishDetail.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '商品详情'
            }
        },
        {//已撤销详情
            path: "/driverRovokeDetail",
            name: "driverRovokeDetail",
            component: () =>
                import(/* webpackChunkName: "driverRovokeDetail" */"./views/DriverRovokeDetail.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '商品详情'
            }
        },
        {//未送达详情
            path: "/driverNoAriveDetail",
            name: "driverNoAriveDetail",
            component: () =>
                import(/* webpackChunkName: "driverNoAriveDetail" */"./views/DriverNoAriveDetail.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '商品详情'
            }
        },
        {//商品撤销
            path: "/driverGoodsRovoke",
            name: "driverGoodsRovoke",
            component: () =>
                import(/* webpackChunkName: "driverGoodsRovoke" */"./views/DriverGoodsRovoke.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '商品撤销'
            }
        },
        {//保管员首页
            path: "/keeperHome",
            name: "keeperHome",
            component: () =>
                import(/* webpackChunkName: "keeperHome" */"./views/KeeperHome.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '首页'
            }
        },
        {//保管员待备货
            path: "/keeperWaitReady",
            name: "keeperWaitReady",
            component: () =>
                import(/* webpackChunkName: "keeperWaitReady" */"./views/KeeperWaitReady.vue"),
            meta: {
                auth: true,
                keepAlive: true,
                canKeep:false,
                title: '待备货'
            }
        },
        {//保管员待备货详情
            path: "/keeperWaitReadyGoods",
            name: "keeperWaitReadyGoods",
            component: () =>
                import(/* webpackChunkName: "keeperWaitReadyGoods" */"./views/KeeperWaitReadyGoods.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '待备货详情'
            }
        },
        {//保管员已备货
            path: "/keeperHasReady",
            name: "keeperHasReady",
            component: () =>
                import(/* webpackChunkName: "keeperHasReady" */"./views/KeeperHasReady.vue"),
            meta: {
                auth: true,
                keepAlive: true,
                canKeep:false,
                title: '已备货'
            }
        },
        {//保管员已备货
            path: "/keeperHasReadyGoods",
            name: "keeperHasReadyGoods",
            component: () =>
                import(/* webpackChunkName: "keeperHasReadyGoods" */"./views/KeeperHasReadyGoods.vue"),
            meta: {
                auth: true,
                keepAlive: false,
                title: '已备货详情'
            }
        },
        {//批发公司选择
            path: "/wholeSelCompany",
            name: "wholeSelCompany",
            component: () =>
                import(/* webpackChunkName: "wholeSelCompany" */"./views/WholeSelCompany.vue"),
            meta: {
                auth: false,
                keepAlive: false,
                title: '公司岗位'
            }
        },
        {
            path: '*', // 未匹配到路由时重定向
            redirect: '/',
            meta: {
                // auth: true,
                // keepAlive: true
            }
        }
    ]
})

// 全局路由钩子函数 对全局有效
router.beforeEach((to, from, next) => {
    let auth = to.meta.auth
    let token = store.getters['login/token'];
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    if (auth) { // 需要登录
        if (token) {
            next()
        } else {
            next({
                path: '/login',
                query: {
                    redirect: '/'
                }
            })
        }
    } else {
        next()
    }
})
export default router
