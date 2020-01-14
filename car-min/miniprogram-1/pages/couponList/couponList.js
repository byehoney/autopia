// pages/couponList/couponList.js
const app = getApp()
import { getCouponList } from "../../utils/userapi.js"
import { getGoodCouponList } from "../../utils/userapi.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curPage: 1,
    page_size: 20,
    list:[],
    total: 0,
    type:"",
    options:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      type: options.type,
      options:options,
    })
    if(options.type=="submit"){//提交订单页面选择优惠券列表
      this.getGoodCouponData(options);
    }else{
      this.getData();
    }

  

    // for(let idx in this.data.list){
    //   console.log("idx",idx);

    //   var strPrice = this.data.list[idx];

    //   console.log("strPrice", strPrice);
    //   var  arrItem = strPrice.split(".");
    //   this.data.list.splice(idx,1,arrItem);
    // }

    // console.log("newArr",this.data.list);

    // this.setData({
    //   list:this.data.list,
    // })
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
    let { curPage, page_size, total } = this.data;
    if (curPage >= total / page_size) {
      wx.showToast({
        title: '~已经到底了',
        icon: 'none'
      })
      return;
    }
    this.setData({
      curPage: ++curPage
    }, () => {

      if(this.options.type=="submit"){
        this.getGoodCouponData(this.data.options);
      }else{
        this.getData();
      }
   
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取优惠券列表数据
  getData(res){

    let param = {
      page:this.data.curPage,
      page_size:this.data.page_size,
    }
    let list = this.data.list;
    
    getCouponList(param).then(res => {
      if (res.code == 0) {
        console.log("res",res);
        this.setData({
          list: [...list, ...res.data.data],
          total: res.data.total
        })
      }
    })
  },
  //获取某些商品下的优惠券列表数据
  getGoodCouponData(res) {

    // var param = new Array;
    // param.push(res);

    // var strify = JSON.stringify(param);

    let dic = {
      page: this.data.curPage,
      page_size: this.data.page_size,
      goods_list: res.goods_list,

    }

    let list = this.data.list;

    getGoodCouponList(dic).then(res => {
      if (res.code == 0) {
        console.log("getGoodCouponList", res);
        this.setData({
          list: [...list, ...res.data],
          total: res.data.total
        })
      }
    })
  },

  couponSelect(res){


    if(this.data.type=="submit"){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        coupon: res.currentTarget.dataset.item,
      })

      wx.navigateBack({//返回
        delta: 1
      })
    }else{
      console.log("res",res.currentTarget.dataset);
      wx.navigateTo({
        url: '../couponDetail/couponDetail?id=' + res.currentTarget.dataset.item.id
      })
    }


  }


})