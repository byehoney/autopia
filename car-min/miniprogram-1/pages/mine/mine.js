//--mine.js
//获取应用实例
const app = getApp()

import code from "../../utils/getcode.js"
import login from "../../utils/login.js"
import { userMsg } from "../../utils/userapi.js"
import { bindInvite } from "../../utils/api.js"


Page({
  data: {
    // avatarUrl: "../../images/morentouxiang@2x.png",
    motto: 'Hello World',
    userInfo: {
      "avatarUrl": "../../images/morentouxiang@2x.png",
    },
    hasUserInfo: false,
    isVip:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    bottomList: [{ "name": "我的账户", "url":"../../images/zhanghu@2x.png"}, 
      { "name": "我的优惠券", "url": "../../images/zhanghu@2x.png" }, 
      { "name": "收货地址", "url":"../../images/dizhi@2x.png"}, 
      // { "name": "我的售后", "url": "../../images/shouhou@2x.png"}, 
      {
        "name": "联系客服", "url": "../../images/kefu@2x.png"
    }],
    bottomNotVipList: [

    { "name": "我的优惠券", "url": "../../images/zhanghu@2x.png" }, 
    { "name": "收货地址", "url": "../../images/dizhi@2x.png" },
    // { "name": "我的售后", "url": "../../images/shouhou@2x.png"}, 
    {
      "name": "联系客服", "url": "../../images/kefu@2x.png"
    }],

    nickName: "",
    authShow: false,
    //avatarUrl: "../../images/defaultHead.png",
    encrypte_data: null,
    iv: null,
    userMsg: null,
    invite_code: null,
    code: null,
    detail: null


  },

  

  onLoad: function () {

    
    console.log("login==",app.globalData);
    var userMsg = wx.getStorageSync("userMsg")
    if (userMsg){
        this.setData({
          userMsg:userMsg
        });
    }


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        userMsg:app.globalData.userMsg,
        isVip:app.globalData.is_vip,
      })

    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          userMsg: app.globalData.userMsg,
          isVip: app.globalData.is_vip,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData
          ({
            userInfo: res.userInfo,
            hasUserInfo: true,
            userMsg: app.globalData.userMsg,
            isVip: app.globalData.is_vip,
          })
        }
      })
    }
  },
  
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    

    console.log("mineSHow");
    if(this.data.hasUserInfo){
      this.getUserOrder();
    }
    // var msg = 
    // this.setData({
    //   userMsg: wx.getStorageSync("userMsg"),
    // })



  },

  // getPhoneNumber(e) {
  //   //
  //   console.log(e.detail.errMsg)

  //   //加密算法的初始向量，详细见加密数据解密算法
  //   console.log(e.detail.iv)

  //   //包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法
  //   console.log(e.detail.encryptedData)
  // },
  // 主动点击调起授权信息

  //getUserInfo //agetUser
  getUserInfo(res) {

    // console.log(res)

    if (res.detail.errMsg == "getUserInfo:ok") {

      console.log("code", res.detail.userInfo);
      app.globalData.nickName = res.detail.userInfo.nickName
      app.globalData.avatarUrl = res.detail.userInfo.avatarUrl


      this.setData({
        encrypte_data: res.detail.encryptedData,
        iv: res.detail.iv,
        userInfo: res.detail.userInfo,
        hasUserInfo: true
      })
      wx.showLoading({
        title: '',
      })

      // console.log("code");
      // 获取code
      this.getCode()
      // 获取加密信息

      // console.log("code11");
    }
  },
  // 登录获取token
  getToken(code) {

    
    console.log("loginURL==", login);
    console.log("resToken",code);


    let { encrypte_data, iv } = this.data
    let param = { code: code, encrypte_data: encrypte_data, iv: iv }
    login(param).then((res) => {
      // 登陆成功头像名字赋值
      wx.hideLoading()

      console.log("successToken", res);
      this.setData({
        authShow: false,
        nickName: app.globalData.nickName,
        avatarUrl: app.globalData.avatarUrl,
      })
      app.globalData.myInviteCode = res.data.user.self_invite_code// 个人邀请码
      if (!app.globalData.otherInviteCode) {
        app.globalData.otherInviteCode = res.data.user.invite_code//  绑定邀请码
      }
      // console.log("res.data",res.data);
      wx.setStorageSync('token',res.data.token)

      // wx.setStorageSync('token', "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlvbmlkIjoiIiwib3BlbmlkIjoibzNLMFI1ZU9hTTVCQTJUaEZyd1gtYkxwVS1jMCIsInBsYXRmb3JtIjoiQ1RCX1NIT1BfTUlOSVBSTyIsImV4cGlyZV9hdCI6MTU3ODkwOTI2OH0.u0Ws-oMAUJuhkKAYSEz_WSAw7nx8qydHLybw6Oc2duc")
      this.getUserOrder()
      // 操作中断未登录跳转会原来路径
      if (wx.getStorageSync("backurl")) {
        wx.navigateTo({
          url: wx.getStorageSync("backurl"),
        })
      }

    })
  },
  // api获取code并执行登陆
  getCode() {

    // console.log('getcode',code().then);

    // 获取code
    code().then((res) => {

      // 传递code执行登陆
      this.getToken(res)
    })
  },

  // 获取用户信息
  getUserOrder() {


    userMsg().then((res) => {


      console.log("userInfo==",res);
     
      // 判断绑定邀请码
      if (res.data.invite_code.length == 0 && app.globalData.inviteCode) {
        // 执行绑定邀请码操作
        // this.bindCode()
      }
      this.setData({
        userMsg: res.data,
        invite_code: res.data.invite_code,
        isVip: res.data.is_vip,
        userMsg:res.data,
      })
      wx.setStorageSync('userMsg', res.data);
      app.globalData.is_vip = res.data.is_vip;
      app.globalData.userMsg = res.data;
      console.log("asdd", app.globalData.is_vip);
    })
  },

  //跳转我的信息页面
  mineInfo: function () {
    wx.navigateTo({
      url: '../mineEdit/mineEdit'
    })
  },
  openVip(e){
    console.log("VIP is GOOD!!!");
  },
  //待付款
  orderPay(e){
    // console.log(1);
    wx.navigateTo({
      url: '../orderList/orderList?type=1'
    })
  },
  //待发货
  orderSend(e){
    // console.log(2);
    wx.navigateTo({
      url: '../orderList/orderList?type=2'
    })
  },

  //待收货
  orderReceive(e){
    // console.log(3);
    wx.navigateTo({
      url: '../orderList/orderList?type=3'
    })

  },

  //已完成
  orderEnd(e){
    // console.log(4);
    wx.navigateTo({
      url: '../orderList/orderList?type=4'
    })
  },

  //查看全部订单
  clickAllOrder(e){
    console.log("all");
    wx.navigateTo({
      url: '../orderList/orderList?type=0'
    })
  },

  clickRelation(e){
    // console.log("relation");
    wx.navigateTo({
      url: '../inviteShip/inviteShip'
    })

  },
  bottomClick(e){
 
    if(this.data.isVip){
      if (e.currentTarget.dataset.idx == 0) {//
        console.log("我的账户");

        wx.navigateTo({
          url: '../myAccount/myAccount'
        })
      } else if (e.currentTarget.dataset.idx == 1) {
        wx.navigateTo({
          url: '/pages/couponList/couponList',

        })
 
        // this.address();

      } else if (e.currentTarget.dataset.idx == 2) {
        wx.navigateTo({
          url: '../addressList/addressList'
        })
      } else if (e.currentTarget.dataset.idx == 3) {
        console.log("客服");

      }
    }else{
      if (e.currentTarget.dataset.idx == 0) {
        wx.navigateTo({
          url: '/pages/couponList/couponList',

        })
        // this.address();

      } else if (e.currentTarget.dataset.idx == 1) {
        console.log("地址");
        wx.navigateTo({
          url: '../addressList/addressList'
        })
      } else if (e.currentTarget.dataset.idx == 2) {
        console.log("客服");

      }
    }
   

  },

  // 调起收货地址
  address() {
    // this.addressSeting()
    // wx.chooseAddress({

    // })

    // wx.chooseAddress({
    //   success(res) {
    //     console.log(res)
    //     that.setData({
    //       user: res.userName,
    //       tel: res.telNumber,
    //       provinceName: res.provinceName,
    //       cityName: res.cityName,
    //       countyName: res.countyName,
    //       detailInfo: res.detailInfo,
    //       addr: res.provinceName + res.cityName + res.countyName + res.detailInfo
    //     })
    //   }
    // })

  },
  // 获取用户收获地址授权状态
  addressSeting() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.address'] == false) {
          // 未授权打开设置进行手动授权
          wx.openSetting({

          })
        }
      }
    })
  },
})
