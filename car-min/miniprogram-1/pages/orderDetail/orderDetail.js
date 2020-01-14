// pages/orderDetail/orderDetail.js
const app = getApp();
import { orderDetail } from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status_str:'',//订单状态
    created_at:'',//订单创建时间
    order_package:'',//订单物流
    order_addr:'',//物流地址
    order_goods:[],//商品
    goods_fee:'',//商品总价
    express_fee:'',//运费
    discount_fee:'',//优惠活动
    total_fee:'',//订单总价
    pay_fee:'',//实付款
    order_no:'',//订单编号
    created_at:'',//创建时间
    delivery_at: '',//发货时间
    confirm_at:'',//确认时间
    pay_at:'',//支付时间
    master_order_no:'',//交易单号
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    orderDetail(options.order_no).then((res)=>{
      if(res.code == 0){
        this.setData({
          status_str: res.data.status_str,
          created_at: res.data.created_at,
          order_package: res.data.order_package,
          order_addr: res.data.order_addr,
          order_goods: res.data.order_goods,
          goods_fee: res.data.goods_fee,
          express_fee: res.data.express_fee,
          discount_fee: res.data.discount_fee,
          total_fee: res.data.total_fee,
          pay_fee: res.data.pay_fee,
          order_no: res.data.order_no,
          created_at: res.data.created_at,
          delivery_at: res.data.delivery_at,
          confirm_at: res.data.confirm_at,
          pay_at: res.data.pay_at,
          master_order_no: res.data.master_order_no
        })
      }
    })
  },
  doCopy(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.number,
      success(res) {
        wx.getClipboardData({
          success(res) {
            
          }
        })
      }
    })
  }
})