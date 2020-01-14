import {
  http
} from './http.js'

var url = {
  orderDetail:'/api/v1/order/detail',//订单详情
  inviteShip:'/api/v1/user/invite/info',//邀请关系
  myAccount:'/api/v1/user/account',//我的账户
  balanceList:'/api/v1/payment/balance/bill',//账单流水

  userLogin: "/api/wx/user/login",
  homeBanner:'/api/v1/banner',//首页banner
  homeCate:'/api/v1/cateimg',//首页分类
  homeList:'/api/v1/index/goods/list',//首页商品列表
  typeList:'/api/v1/category',//分类页面获取分类

 

  bindInvite:'/api/v1/user/bind/invite',//绑定邀请码
  groupDetail:'/api/v1/order/group/detail',//获取团购详情
  
  likeGoods:'/api/v1/goods/like',//获取团购详情喜欢商品推荐列表


 
  classifyGood:'/api/v1/category', //商品分类
  goodsList: '/api/v1/goods/list',//分类页面获取商品列表
  shopDetail: '/api/v1/goods/detail',//商品详情
  addressList:'/api/v1/address/my', //收货地址列表
  addressCreat:'/api/v1/address/save',//保存编辑收货地址
  addressDetail:'/api/v1/address/detail', //收货地址信息
  addressDelete: '/api/v1/address/del', //收货地址删除
  confirmOrder: '/api/v1/order/confirm',//确认订单(创建订单前确认)
  creatOrder: '/api/v1/order/create',//创建订单
  cancelOrder:'/api/v1/order/close', //取消订单(未付款)
  checkPayResult: '/api/v1/payment/query/pay/status',//查看支付结果
  benefitsApi:"/api/v1/vip/benefits",//普通会员vip图片立标


}
module.exports = {
  orderDetail(order_no){
    return http({
      url: url.orderDetail + '?order_no=' + order_no,
      method: 'GET'
    })
  },
  inviteShip(){
    return http({
      url: url.inviteShip,
      method: 'GET'
    })
  },
  myAccount(){
    return http({
      url: url.myAccount,
      method: 'GET'
    })
  },
  balanceList(page_size,page){
    return http({
      url: url.balanceList+'?page_size='+page_size+'&page='+page,
      method: 'GET'
    })
  },


  userLogin(code) {
    //发起网络请求
    return http({
      url: url.userLogin,
      data: { code:code }
    })
  },
  homeBanner(){
    return http({
      url: url.homeBanner,
      method:'GET'
    })
  },
  homeCate(){
    return http({
      url: url.homeCate,
      method: 'GET'
    })
  },
  homeList(params) {
    return http({
      url: url.homeList +'?page='+params.page+'&page_size='+params.page_size,
      method:'GET'
    })
  },
  typeList(){
    return http({
      url: url.typeList,
      method: 'GET'
    })
  },
  goodsListAPI(params){

    if ((params.cate_id == undefined) | (params.cate_id == null)) {
      return http({

        url: url.goodsList + '?page=' + params.page + "&page_size=" + params.page_size + "&goods_name=" + params.goods_name,
        method: 'GET'
      })
    } else {
      return http({

        url: url.goodsList + '?page=' + params.page +"&page_size=" + params.page_size + "&goods_name=" + params.goods_name + "&cate_id=" + params.cate_id,
        method: 'GET'
      })
    };


  },
  confirmOrder(data){
    return http({
      url: url.confirmOrder,
      data
    })
  },
  creatOrder(data){
    return http({
      url: url.creatOrder,
      method: 'post',
      data
    })
  },
  cancelOrder(data){
    return http({
      url: url.cancelOrder,
      method: 'post',
      data
    })
  },
  bindInvite(data){
    return http({
      url: url.bindInvite,
      method: 'post',
      data
    })
  },
  groupDetail(params){
    return http({
      url: url.groupDetail + '?order_no=' + params.order_no,
      method: 'GET'
    })
  },
  checkPayResult(data){
    return http({
      url: url.checkPayResult,
      data
    })
  },
  likeGoodsList(params) {
    return http({
      url: url.likeGoods,
      method: 'GET'
    })
  },
  shopDetail(data){
    return http({
      url: url.shopDetail+"?id="+data.id,
      method:"get"
    })
  },
  classifyGood(data){
    return http({
      url: url.classifyGood+"?fid="+data.fid,
      method: "get"

    })
  },
  addressList(data){
    return http({
      url: url.addressList + "?page=" + data.page,
      method: "get"

    })
  },

  addressCreat(data) {
    return http({
      url: url.addressCreat,
      method: "post",
      data

    })
  },
  addressDetail(data) {
    return http({
      url: url.addressDetail +"?id=" + data.id,
      method: "get",
    })
  },
  addressDelete(data) {
    return http({
      url: url.addressDelete,
      method: "post",
      data
    })
  },
  vipImageList(data) {
    return http({
      url: url.benefitsApi,
      method: "get",
    })
  },
}