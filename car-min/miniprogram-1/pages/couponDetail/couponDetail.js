// pages/couponDetail/couponDetail.js
const app = getApp()

import { getCouponDetail } from "../../utils/userapi.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    item:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("couponDetail",options);
    this.setData({
      id:options.id,
    })
    this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getData(res){
    let param = {
      id: this.data.id,
    }

    getCouponDetail(param).then(res => {
      if (res.code == 0) {
        console.log("getCouponDetail", res);
        this.setData({
          item:res.data,
        })
      }
    })
  }
})