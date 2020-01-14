//index.js
//获取应用实例
const app = getApp()
import { commandGoodsList } from "../../utils/userapi.js"


Page({
  data: {
    page_size:10,
    curPage:1,
    total:0,
    list:[],
    is_vip: false,
    showlog:"",
  },
  onLoad: function () {

    this.setData({
      showlog: wx.getStorageSync("showlog")
    })
    if(this.data.showlog.length>0){
      console.log("cunzai");
    }else{
      wx.setStorageSync("showlog", "yes");
 
    }
  


    // let user = wx.getStorageSync("user");
    // this.setData({
    //   is_vip: user.is_vip,
    // })
    console.log("ONloadindexVip==", this.data.is_vip);
    // let userMsg = wx.getStorageSync("userMsg")

    // this.setData({
    //   mobile: userMsg.mobile,
    //   is_vip: userMsg.is_vip,
    // })

 
    this.recommanAPI();
  },
  /**
* 生命周期函数--监听页面显示
*/
  onShow: function () {


    let userMsg = wx.getStorageSync("userMsg");
    let user = wx.getStorageSync("user");
    
    this.setData({
      mobile: userMsg.mobile,
      is_vip: user.is_vip,
    })
    console.log("showindexVip==", this.data.is_vip);


  },
  //商品详情detail
  goodDetail(e) {
    console.log('item', e.currentTarget.dataset.item);

    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.item.id
    })
  },

  //购买按钮
  purchseClick(e) {


    console.log('item', e.currentTarget.dataset.item);

    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.item.id + '&type=' + "immediate",
    })



  },
  //首页推荐商品列表
  recommanAPI(res) {


    var param = { page: 1, page_size: 8 };

    commandGoodsList(param).then((res) => {
      // console.log("homelist==", res.data);
      var data = res.data;
      if (res.code == 0) {
        this.setData({
          list: res.data.data,

          total: res.data.total,
        })
      }

    })

  },

  //首页banner点击
  clickBanner(res){
    wx.navigateTo({
      url: '../timingAct/timingAct',
    })
    
  },
  //首页icon点击
  iconClick(res){
    console.log("iconres",res.currentTarget.dataset);
    wx.navigateTo({
      url: '../activity/activity',
    })
  },
  //关闭首次弹窗
  closeMaskLog(){
    console.log("close");
    wx.setStorageSync("showlog", "yes");

    this.setData({
      showlog:"yes",
    })

  },
  //首页弹窗跳转
  indexLogGo(){
    console.log("indexLogGo");
  }

  
})
