// pages/inviteShip/inviteShip.js

import { inviteShip } from '../../utils/api.js'
import { wxcode } from "../../utils/userapi.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareSelect: false,
    drawSelect: false,
    //分享时制作图片
    painting: {
    },
    shareImage: "",
    invite_shipping:[],//邀请购物
    invite_user:[],//邀请会员
    reward_money_one:0,//会员返现
    reward_money_two:0,//购物返现
    my_inviter:'',//邀请我的人
    userMsg:{

    },
    codeMsg: "",//二维码信息

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.wxcode();

    this.setData({
      userMsg:wx.getStorageSync("userMsg"),
    })
    inviteShip().then((res)=>{
      if(res.code == 0){
        console.log("邀请关系",res);
        this.setData({
          invite_user: res.data.invite_user.list,
          invite_shipping: res.data.invite_shipping.list,
          reward_money_one: res.data.invite_user.total_reward_money,
          reward_money_two: res.data.invite_shipping.total_reward_money,
          my_inviter: res.data.my_inviter
        })
      }
    })
  },
  //阻断滚动穿透事件
  myCatchTouch: function () {
    // console.log('stop user scroll it!');
    return;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //分享弹窗选择
  shareSelect(e) {
    this.setData({
      shareSelect: true,
      drawSelect: false,
    })
  },
  cancelShare(e) {
    this.setData({
      shareSelect: false,
      drawSelect: false,
    })

  },
  //选择绘图
  eventDraw() {

    this.setData({
      drawSelect: true,
      shareSelect: false,
    });
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true,

    })
    this.setData({
      painting: {
        width: 375,
        height: 667,
        clear: true,
        views: [
          {//背景图片
            type: 'image',
            url: 'https://ctb-public-file.oss-cn-beijing.aliyuncs.com/shop/shareBG%402x.png',
            top: 0,
            left: 0,
            width: 375,
            height: 667
          },
          {//二维码图片
            type: 'image',
            url: this.data.codeMsg.url,
            top: 543,
            left: 143.5,
            width: 88,
            height: 88
          },

          {//对话框
            type: 'image',
            url: '/images/sayOutline@2x.png',
            top: 92,
            left: 115,
            width: 230,
            height: 60,
          },
          {//文字
            type: 'text',
            content: this.data.userMsg.nickname +"邀请您加入开车币用", 
            fontSize: 16,
            lineHeight: 21,
            color: '#383549',
            textAlign: 'left',
            top: 100,
            left: 123,
            width: 210,
            MaxLineNumber: 2,
            breakWord: true,
            bolder: true
          },
          {//头像
            type: 'image',
            url: this.data.userMsg.head_img,
            top: 90,
            left: 40,
            width: 65,
            height: 65,
            borderRadius:32.5,
          },
    
        ]
      },
    })
  },
  //保存到本地相册
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
    }
  },
  //获取二维码
  wxcode(res) {

    // var pages = getCurrentPages() //获取加载的页面
    // var currentPage = pages[pages.length - 1] //获取当前页面的对象
    // var url = "/" + currentPage.route; //当前页面url

    // console.log("pageUrl", url);
    let param = {
      page_url: "",
    }
    wxcode(param).then((res) => {
      console.log("wx.code==", res.data);
      var data = res.data;
      if (res.code == 0) {


        this.setData({
          codeMsg: res.data,
        })

      }

    })
  }

})