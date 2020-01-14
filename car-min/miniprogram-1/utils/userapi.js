import {
  http
} from './http.js'
var url={
  
  
  
  orderDetail:"/api/v1/payment/profits/bill", //订单明细
  vipPrice:"/api/v1/vip/price",//vip价格
  sureShop:"/api/v1/order/confirm/receipt", //确认收货
  myAccount:"/api/v1/user/account",  //个人提现账户

  allevalList:"/api/v1/goods/comment", //全部评论
  payVip: "/api/v1/payment/charge/vip", //充值vip

 

  userCenter: "/api/v1/user", //个人用户信息
  updateName:"/api/v1/user/modify/nickname", //修改昵称
  headUpdate: "/api/v1/user/modify/avatar", //修改头像
  getBindMobile: "/api/v1/user/bind/mobile", //获取绑定手机号
  changeGender: "/api/v1/user/modify/identity", //修改性别
  changeBirthDay: "/api/v1/user/modify/birthday",//修改出生日期

  billWith: "/api/v1/payment/withdraw/bill",// 提现记录
  withApply: "/api/v1/payment/apply/withdraw", //申请提现
  orderList: "/api/v1/order/list",// 用户订单
  closeOrder:"/api/v1/order/close",//关闭订单 （未支付取消）
  cancelOrder:"/api/v1/order/cancel",//取消订单 (待发货取消)
  againPay:"/api/v1/order/againPay",//再次支付接口
  receiveOrder:"/api/v1/order/confirm/receipt", //确认收货

  commandGoodsList: "/api/v1/goods/recommend",//推荐商品列表
  wxcode: "/api/v1/user/wxcode", //二维码
  couponListApi:"/api/v1/user/coupon/list",//优惠券列表
  couponAndGoodList:"/api/v1/order/available/coupon",//商品列表下优惠券
  couponDetailApi:"/api/v1/coupon/detail",

}
module.exports={
    userMsg(){
      return http({
        method:"get",
        url: url.userCenter
      })
    },
    userOrder(data){
      return http({
        url:url.orderList+"?status="+data.status+"&page_size="+data.page_size+"&page="+data.page,
        method:"get",
      })
    },

  closeOrder(data){
    return http({
      url: url.closeOrder,
      data
    })
  },
  cancelOrder(data){
    return http({
      url: url.cancelOrder,
      data
    })
  },
  receiveOrder(data){
    return http({
      url: url.receiveOrder,
      data
    })
  },

  billWith(page_size, page){
    return http({
      url: url.billWith+"?page="+ page +"&page_size="+  page_size,
      method:"get"
    })
  },
  orderDetail(data){
    return http({
      url: url.orderDetail + "?page=" + data.page + "&page_size" + data.page_size,
      method: "get"
    })
  },
  vipPrice(){
    return http({
      url:url.vipPrice,
      method:"get"
    })
  },
  sureShop(data){
    return http({
      url: url.sureShop,
      data
    })
   
  },
  myAccount(){
    return http({
      url: url.myAccount,
      method: "get"
    })
    
  },
  withApply(data){
    return http({
      url: url.withApply,
      data
    })
  },
  allevalList(data){
    return http({
      url: url.allevalList+"?page="+data.page+"&page_size="+data.page_size+"&id="+data.id,
      method:"get"
    })
  },
  againPay(data){
    return http({
      url: url.againPay,
      data
    })
  },
  
  payVip() {
    return http({
      url: url.payVip
    })
  },

  wxcode(data){
    return http({
      url: url.wxcode + "?page_url=" + data.page_url,
      method:"get"
    })

    
  },
  updateName(data){
    return http({
      url: url.updateName,
      method: "POST",
      data
    })
  },
  updateHead(data) {
    return http({
      url: url.headUpdate,
      method: "POST",
      data
    })
  },
  getBindMobile(data) {
    return http({
      url: url.getBindMobile,
      method: "POST",
      data
    })
  },
  changeGender(data) {
    return http({
      url: url.changeGender,
      method: "POST",
      data
    })
  },
  changeBirthDay(data) {
    return http({
      url: url.changeBirthDay,
      method: "POST",
      data
    })
  },

  commandGoodsList(data){
    return http({
      url: url.commandGoodsList + "?page=" + data.page + "&page_size=" + data.page_size,
      method:"get"
    })
  },
  getCouponList(data) {
    return http({
      url: url.couponListApi + "?page_size=" + data.page_size + "&page=" + data.page,
      method: "get"
    })
  },
  getGoodCouponList(data) {
    return http({
      url: url.couponAndGoodList + "?page_size=" + data.page_size + "&page=" + data.page + "&goods_list=" + data.goods_list,
      method: "get"
    })
  },
  getCouponDetail(data) {
    return http({
      url: url.couponDetailApi + "?id=" + data.id,
      method: "get"
    })
  },



}