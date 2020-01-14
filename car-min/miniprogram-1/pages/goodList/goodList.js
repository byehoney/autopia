// pages/goodList/goodList.js

const app = getApp()

import { classifyGood } from "../../utils/api.js"
import { goodsListAPI } from "../../utils/api.js"

import { getBindMobile } from "../../utils/userapi.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topIndex: 0,
    headType:[],
    goodsList:[],
    mobile:"",
    id:"",//商品ID
    curPage: 1,
    page_size: 10,
    list: [],
    total: 0,

    cate_id:"",//分类ID
    is_vip: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   
    let mobile = wx.getStorageSync("mobile");
    let user = wx.getStorageSync("user");

    // let userInfo = wx.getStorageSync("userMsg");
    // this.setData({
    //   is_vip: userInfo.is_vip,
    //   mobile: mobile,

    // })
    this.setData({
      mobile:mobile,
      // is_vip:app.globalData.is_vip,
      is_vip: user.is_vip,
    })
    
    console.log("mobile",this.data.mobile);
    console.log("globalData", app.globalData);
    
    //console.log("options", options);
    wx.setNavigationBarTitle({
      title: options.title,
      
    })

    this.setData({
      topIndex: options.idx,
      cate_id:options.id,
    })
    this.getSubCatagory(options.typeID);
    this.getGoodList(options);


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
    let mobile = wx.getStorageSync("mobile");
    this.setData({
      mobile:mobile,
    })
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

      let param = {
        page:curPage,
        page_size : 10,
        id : this.data.cate_id,
      }
      this.getGoodList(param);
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取商品二级分类
  getSubCatagory(res) {

    var param = { fid: res };

    //当不传fid(或fid=0)时为获取一级分类
    classifyGood(param).then((res) => {

      if (res.code == 0) {
        console.log("subtypelist==", res);
        this.setData({
          headType: res.data,
        });
        console.log("headtype",res.data);
      }

    })
  },
  //获取商品列表
  getGoodList(res){


    // wx.setStorageSync("cate_id", res.id);

    // app.globalData.cate_id = res.id;

    // console.log("listdadd");
    let goodsList = this.data.goodsList;
    var param = { cate_id:res.id, page:res.page,goods_name:'',page_size:this.data.page_size};

    goodsListAPI(param).then((res) => {
      console.log("goodlist==", res.data);
      var data = res.data;
      if (res.code == 0) {
        this.setData({
          goodsList:[...goodsList,...res.data.data],

          total:res.data.total,
        })
      }

    })
  },

  header_click(e) {

    console.log('headClick==',e.currentTarget.dataset.item);
    this.setData({
      topIndex: e.currentTarget.dataset.idx,
      goodsList: [],//清空历史数据，刷新数据，
    })

    this.getGoodList(e.currentTarget.dataset.item);

  },
  //价格排序
  priceSort(e) {
    this.setData({
      ascendingOrder: !this.data.ascendingOrder,
    })
  },
  
  //商品详情detail
  goodDetail(e) {

    // if(!this.data.mobile){
    //   return;
    // }
    // console.log(e);
    console.log('item', e.currentTarget.dataset.item);

 
    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.item.id
    })
  },

  //购买按钮
  purchseClick(e) {

    console.log('item', e.currentTarget.dataset.item);

    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.item.id + '&type=' +"immediate",
    })

    // console.log('purchse-idx', e.currentTarget.dataset.idx);
    // wx.navigateTo({
    //   url: '../submitOrder/submitOrder',
    // });
    
  },
  //获取绑定手机号
  // getPhoneNumber(e) {

  //   console.log('item===', e.currentTarget.dataset.idx);

  //   let item = this.data.goodsList[e.currentTarget.dataset.idx-1];
  //   this.setData({
  //     id: item.id,
  //   })
  //   let code = app.globalData.code;

  //   // console.log('e',e);
  //   // console.log("errmsg",e.detail.errMsg)
  //   // console.log("iv",e.detail.iv)
  //   // console.log("encryptedData",e.detail.encryptedData)

  //   let param = {
  //     "code" : code,
  //     "iv": e.detail.iv,
  //     "encryptedData":e.detail.encryptedData
  //   }
  //   this.getBindMobile(param);
    

    
  // },

  getBindMobile(res){
    var param = { code: res.code, encrypte_data: res.encryptedData, iv: res.iv };
    getBindMobile(param).then((res) => {

      var data = res.data;
      if (res.code == 0) {

        wx.setStorageSync("mobile", res.data.mobile);


        wx.navigateTo({
          url: '../goodDetail/goodDetail?id=' + this.data.id
        })
      }

    })
  },


})