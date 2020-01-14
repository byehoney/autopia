// pages/searchList/searchList.js

const app = getApp()

import { goodsListAPI } from "../../utils/api.js"
import { commandGoodsList } from "../../utils/userapi.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //控制是否显示搜索历史记录
    showGoods:false,

    //控制是否搜索到商品
    noGoods:false,
    ascendingOrder:true,
    historyList:[
     
    ],

    goodsList: [
     
    ],
    is_vip:false,
    curPage: 1,
    page_size: 8,
    list: [],
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var arr = new Array;

    arr = wx.getStorageSync("searchHistory");

    console.log('arr',arr);
    this.setData({
      historyList: arr,
      is_vip: app.globalData.is_vip,
    })

    
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
    let that = this;
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



      if(that.data.goodsList.length==0){

      }else{

        let param = {
          page: curPage,
          page_size: 10,
          id: that.data.cate_id,
        }

        that.getGoodList(param);
      }

    })
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取商品列表
  getGoodList(res) {

    let that = this;
    let goodsList = this.data.goodsList;
    var param = { cate_id: res.id, page: res.page, goods_name: res.name, page_size: this.data.page_size};
    goodsListAPI(param).then((res) => {
      console.log("goodlist==", res);
      var data = res.data;
      if (res.code == 0) {
        this.setData({
          goodsList: [...goodsList, ...res.data.data],

          total: res.data.total,
        })

        if(this.data.goodsList.length==0){
          // let param = {
          //   page : 1,
          //   page_size:10,
          // }
          // that.recommanAPI(param);
        }
        let param = {
          page: 1,
          page_size: 8,

        }
        that.recommanAPI(param);
      }

    })
  },

  bindconfirm(e){
    this.setData({
      showGoods: true,
      noGoods:true,
      goodsList:[],

    })

    let value = e.detail.value;

    console.log("value", value);

    var arr = new Array;  
    //赋值到新数组
    for(var obj in this.data.historyList){
      arr.push(this.data.historyList[obj]);
    }

    if ((value == null) | (value == undefined) | (value == " ") | (value.length == 0)){

    }else{
      arr.push(value);
    }
    
    this.setData({
      historyList:arr,
    })
    wx.setStorageSync('searchHistory', this.data.historyList);

    this.getGoodList({"name":value});

  },
  deleteAll(e){


    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定清空历史搜索数据',
      success: function (res) {
        if (res.confirm) {

            that.setData({
              historyList: [],
            })
            wx.setStorageSync('searchHistory', that.data.historyList);

        } else {
          console.log('用户点击取消')
        }

      }
    })


  },

  clickItem(e){
    
    console.log(e.currentTarget.dataset.idx);
    this.setData({
      showGoods: true,
      noGoods: false,
    })

    let name = this.data.historyList[e.currentTarget.dataset.idx];
    this.getGoodList({ "name": name });

  },
  priceSort(e){
    this.setData({
      ascendingOrder: !this.data.ascendingOrder,
    })
  },
  //商品详情detail
  goodDetail(e) {
    // console.log(e);
    console.log('item', e.currentTarget.dataset.item);

    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.item.id
    })
  },

  purchseClick(e){

    // console.log(e);
    console.log('purchse-idx', e.currentTarget.dataset.idx);

    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.item.id + '&type=' + "immediate",
    })

  },

  //首页推荐商品列表
  recommanAPI(res) {


    let goodsList = this.data.list;
    var param = { page: 1, page_size: 8 };

    commandGoodsList(param).then((res) => {
      console.log("goodlist==", res.data);
      var data = res.data;
      if (res.code == 0) {
        this.setData({
          list: res.data.data,

          total: res.data.total,
        })
      }

    })


  },

  
})