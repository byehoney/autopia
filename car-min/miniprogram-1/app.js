//app.js


import login from './utils/login.js';
// import {init} from "./utils/http.js"
App({
  onLaunch: function (option) {

    console.log("app.js",option);

    let that = this;

    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        wx.login({
          success: res => {
            // // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // userLogin(res.code).then((data) => {
            //   resolve(data)
            // })

            that.globalData.code = res.code
            // 获取code
            that.loginCodeUser(res.code)
          }
        })

      },
      fail: function () {
        //登录态过期
        wx.login({
          success: res => {
            // // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // userLogin(res.code).then((data) => {
            //   resolve(data)
            // })

            that.globalData.code = res.code
            // 获取code
            that.loginCodeUser(res.code)
          }
        })
      }
    })

    

  },
  onShow: function () {
    // console.log(123516723561524365124365)
    // init(this)
  },
  loginCodeUser: function (code) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // let param = { code: code, encrypte_data: res.encryptedData, iv: encodeURIComponent(res.iv)}
              let param = { code: code, encrypte_data: res.encryptedData, iv: res.iv }
              // 执行登陆获取token
              login(param).then((res) => {

                wx.setStorageSync("user", res.data.user);
                // wx.setStorageSync('token',"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlvbmlkIjoiIiwib3BlbmlkIjoibzNLMFI1ZU9hTTVCQTJUaEZyd1gtYkxwVS1jMCIsInBsYXRmb3JtIjoiQ1RCX1NIT1BfTUlOSVBSTyIsImV4cGlyZV9hdCI6MTU3ODkwOTI2OH0.u0Ws-oMAUJuhkKAYSEz_WSAw7nx8qydHLybw6Oc2duc")
                wx.setStorageSync('token',res.data.token)

                console.log("user", wx.getStorageSync("user"));
                // wx.setStorageSync('userMsg', res.data);
                this.globalData.myInviteCode = res.data.user.self_invite_code ? res.data.user.self_invite_code : ''// 个人邀请码
                this.globalData.otherInviteCode = res.data.user.invite_code//  绑定邀请码
                this.globalData.is_vip = res.data.user.is_vip
                
              })
            
              console.log("app=GlobalData==",this.globalData);
             
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    nickName: null,
    avatarUrl: null,
    code: null,
    backUrl: null,
    inviteCode: null,
    myInviteCode: "",
    otherInviteCode: "",//邀请者的邀请码
    is_vip: 0,
    cate_id:"",//二级分类列表
  },
})





// App({
//   onLaunch: function () {
//     // 展示本地存储能力
//     var logs = wx.getStorageSync('logs') || []
//     logs.unshift(Date.now())
//     wx.setStorageSync('logs', logs)

//     // 登录
//     wx.login({
//       success: res => {
//         // 发送 res.code 到后台换取 openId, sessionKey, unionId
//       }
//     })
//     // 获取用户信息
//     wx.getSetting({
//       success: res => {
//         if (res.authSetting['scope.userInfo']) {
//           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
//           wx.getUserInfo({
//             success: res => {

//               console.log("appjs",res.userInfo);
//               // 可以将 res 发送给后台解码出 unionId
//               this.globalData.userInfo = res.userInfo
              
//               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//               // 所以此处加入 callback 以防止这种情况
//               if (this.userInfoReadyCallback) {
//                 this.userInfoReadyCallback(res)
//               }
//             }
//           })
//         }
//       }
//     })
//   },
//   globalData: {
//     userInfo: null,
//     userMsg:null,
//     isVip:false,
//   }
// })
