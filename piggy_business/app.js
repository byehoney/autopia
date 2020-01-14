//app.js
//wangmu 2017-02-08
var common = require('utils/common.js');
var publicFun = require('utils/public.js');
var callbackObj = null;
var pageThat = null;
var refreshConfig = null;

var extConfig = wx.getExtConfigSync();
if (wx.getExtConfig) {
    wx.getExtConfig({
        success: function (res) {
            extConfig = res.extConfig;
        }
    })
}
/*  blackTheme:#000000,
    redTheme:#FA0029,
    orangeTheme:#FF5C1C,
    blueTheme:#0098F8,
    pinkDarkTheme:#FF007C,
    purpleTheme:#7948FD,
    brownTheme:#B7A392*/
extConfig.themeColor = extConfig.themeColor ? extConfig.themeColor : '#FF5C1C';
extConfig.navigatorBarType = extConfig.navigatorBarType ? extConfig.navigatorBarType:0;

let dpr = 1;
let systemInfo = wx.getSystemInfo({
    success: function (res) {
        // 此处不用res里面本来就有的dpr返回值,安卓手机不准确
        // dpr = res.pixelRatio;
        dpr = 750 / res.windowWidth;
    },
});

App({
    setAddres() {
        return new Promise((resolve, reject) => {
            // 定位
            var latitude = wx.getStorageSync('latitude');
            var longitude = wx.getStorageSync('longitude');
            if (latitude == undefined || latitude == '') {
                wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        latitude = res.latitude;
                        longitude = res.longitude;
                        wx.setStorage({
                            key: "latitude",
                            data: latitude
                        });
                        wx.setStorage({
                            key: "longitude",
                            data: longitude
                        })
                        setTimeout(() => {
                            resolve(res);
                        }, 30);
                    },
                    fail: function (err) {
                        reject();
                    }
                })
            } else {
                resolve({latitude,longitude});
            }
        });
    },

    getUserInfo: function (param) {
        callbackObj = param.callback ? param.callback : null;
        refreshConfig = param.refreshConfig ? param.refreshConfig : null;
        pageThat = param.pageThat ? param.pageThat : null;
        var theApp = this;
        theApp.globalData.storge = { callbackObj, refreshConfig, pageThat };
        //var users   = JSON.parse(this.globalData.userInfo);
        if (theApp.globalData.userInfo) {
            if (theApp.globalData.userInfo.openId) {
                let sid = theApp.globalData.store_id ? theApp.globalData.store_id : common.store_id;
                let data = {
                    store_id: sid,
                    openId: theApp.globalData.userInfo.openId,
                    wxapp_ticket: '',
                };
                //多次重复刷新后停止刷新状态，登录状态设置为未登录
                if (theApp.globalData.fresh_count>3){
                  theApp.globalData.unlogin = true;
                  wx.setStorageSync('unlogin', true);
                  return;
                }
                common.post('app.php?c=wxapp&a=refresh_ticket', data, refUserInfo, '');

                function refUserInfo(result) {
                    try {
                        wx.setStorageSync('ticket', result.err_msg.wxapp_ticket)
                        theApp.globalData.fresh_count+=1;                        
                    } catch (e) {

                    }
      
                    refresh_page(refreshConfig);
                }
            }
            typeof callbackObj == "function" && callbackObj(this.globalData.userInfo)
        } else {
          if (pageThat){
               pageThat.userCall = function (res) {
                  publicFun.userCall(res, getApp(), pageThat)
               }

            }
          wx.login({
            success: function (res) {
              theApp.globalData.login = res;
              if (res) {
                let str_login = JSON.stringify(res);
                wx.setStorageSync('str_login', str_login)
              }
              // if (pageThat) {
                // pageThat.setData({
                //   showLoginModal: true
                // })
              // }
            }
          });
        }

        //登陆跳转到之前页面
        function refresh_page(refreshConfig) {
            var params = '';
            if (refreshConfig.param) {
                params = '?';
                for (var i in refreshConfig.param) {
                    if (i == 'equals') continue
                    params += i + '=' + refreshConfig.param[i] + '&';
                }
            }
            wx.reLaunch({
                url: '/' + refreshConfig.url + params
            })
            /*
            if (refreshConfig.pageType == 'page') {
                wx.navigateTo({
                    url: '/' + refreshConfig.url + params,
                })
            } else if (refreshConfig.pageType == 'tab') {
                wx.switchTab({
                    url: '/' + refreshConfig.url + params,
                })
            }*/
        }

        function openSetting() {
            wx.showModal({
                title: '警告',
                content: '拒绝授权，则无法使用本小程序，请手动退出!请确认授权进入小程序!',
                showCancel: true,
                cancelText: '不授权',
                confirmText: '授权',
                success: function (res) {
                    if (res.confirm) {
                        wx.openSetting({
                            success: function (data) {
                                if (data) {
                                    if (!data.authSetting["scope.userInfo"] || !data.authSetting["scope.userLocation"]) {
                                        wx.login({
                                            success: function (result) {
                                                wx.getUserInfo({
                                                    withCredentials: true,
                                                    success: function (res) {
                                                        var ticket = wx.getStorageSync('ticket');
                                                        let data = {
                                                            code: result.code,
                                                            encryptedData: res.encryptedData,
                                                            iv: res.iv,
                                                            wxapp_ticket: ticket,
                                                        };
                                                        common.post('app.php?c=wxapp&a=store_login', data, setUserInfo, '');

                                                        function setUserInfo(result) {
                                                            try {
                                                                wx.setStorageSync('ticket', result.err_msg.wxapp_ticket)
                                                            } catch (e) {
                                                            }
                                                            that.globalData.userInfo = result.err_msg.user
                                                            typeof callbackObj == "function" && callbackObj(that.globalData.userInfo)
                                                            // 分销商刷新页面
                                                            //common.post('app.php?c=store&a=index&store_id=' + that.globalData.store_id, '', 'shopHomeData', pageThat);
                                                            refresh_page(refreshConfig);
                                                        }
                                                    },
                                                    fail: function () {
                                                        openSetting();
                                                    }
                                                });
                                            }
                                        })

                                    }
                                }
                            },
                            fail: function () {

                            }
                        });
                    } else {
                        openSetting();
                    }
                }
            })

        }
    },

    //获取用户上次打开小程序距这次的时间差
    getTimeDifference:function(){
      try {
        //上一次打开时间
        let lastTime = wx.getStorageSync('savaTime') ? wx.getStorageSync('savaTime') : 0;
        //当前时间
        let currentTime = new Date().getTime();
        let distanceTime = currentTime - lastTime;
        //距上次打开页面时间小时间隔
        var disTime = Math.abs(distanceTime) / (1000 * 60 * 60);
        //超过半个小时，重新获取地理位置
        publicFun.getLocation()
        // if (disTime>0.5){
        //   publicFun.getLocation()
        // }
        // console.log("时间差=============", disTime*60+'分钟')
        wx.setStorageSync('savaTime', currentTime)
      } catch (e) { }
    },

    //分享是否添加图片分享
    shareWidthPic:function(that){
      common.post(`app.php?c=user&a=get_share_img`, ``, sharePicFun, '');
      function sharePicFun(result) {
        if (result.err_code==0){
          //show_share_img=>是否展示背景图
          //share_img=>背景图地址
          app.globalData.show_share_img = result.err_msg.show_share_img;
          app.globalData.share_img = result.err_msg.share_img

          if(that){
            that.setData({
              show_share_img: result.err_msg.show_share_img,
              share_img: result.err_msg.share_img
            })
          }
        }
      }
    },
    //分享锁粉
  shareGetFans: function (title, desc, path, shareType, imageUrl, other, leader_id){
    const { show_share_img, share_img }=app.globalData;
    let url = `${path}?store_id=${app.globalData.store_id}&share_uid=${app.globalData.my_uid}&leader_id=${leader_id}&shareType=${shareType}` ;
    if (other){
      url += other;
    }
    console.log("分享链接：",url)
      return {
        title: title,
        desc: desc || '这里发现一个好店铺，速度围观，点击进入',
        path: url,
        imageUrl: show_share_img == 1 ? (share_img):(imageUrl || '')
      }
    },

    //请求用户手机号接口
    getIphoneNum:function(that){
      common.post(`app.php?c=user&a=judge_user_has_phone`, ``, phoneNumData, '');
      function phoneNumData(result) {
        if (result.err_code==0){
          let result_data = result.err_msg;
          app.globalData.get_user_phone = result_data.get_user_phone; //是否强制获取手机号（0否)
          app.globalData.has_phone = result_data.has_phone//是否有手机号
          console.log("请求手机号=", app.globalData.has_phone)
          app.updatePhone(that);
        }
      }
    },
    //更新获取手机号
    updatePhone:function(that){
      if (that) {
        //获取用户手机号
        if (app.globalData.has_phone != undefined) {
          that.setData({
            has_phone: app.globalData.has_phone
          })
          console.log("app.globalData.has_phone,",app.globalData.has_phone)
        }
        if (app.globalData.get_user_phone != undefined) {
          that.setData({
            get_user_phone: app.globalData.get_user_phone
          })
        }
      }
    },
    //解析手机号
  analysisPhoneNum: function (e, that, nowCoed){
      console.log("e============", e)
      const { encryptedData, iv } = e.detail;
      console.log("encryptedData============",encryptedData)
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            let data = {
              encryptedData: encryptedData,
              iv: iv,
              code: nowCoed || res.code 
            }
            common.post(`app.php?c=wxapp&a=get_wx_phone`, data, phoneNumData, '');
            function phoneNumData(result) {
              //成功获取用户手机号
              if (result.err_code==0){
                const { phoneNumber } = result.err_msg;
                console.log("phoneNumber--------", phoneNumber)
                app.globalData.phoneNum = phoneNumber;
                app.globalData.has_phone = 1;
                that.setData({ phoneNumber})
                app.updatePhone(that);//更新手机号
                app.savaPhoneNumber(phoneNumber);
              }
            }
            
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
      //检测当前用户登录态是否有效，避免用户登录状态有效wx.login 登录，刷新登录态。
      //避免此时服务器使用 code 换取的 sessionKey 不是加密时使用的 sessionKey，导致解密失败

      // wx.checkSession({
      //   success() {
      //   let data={
      //     encryptedData: encryptedData,
      //     iv: iv,
      //     code: app.globalData.code
      //   }
      //   common.post(`app.php?c=wxapp&a=get_wx_phone`, data, phoneNumData, '');
      //     function phoneNumData(result){
      //       console.log("result--",result)
      //     }
      //   },
      //   fail() {
      //     wx.login() //重新登录
      //   }
      // })



      
      
    },
    //保存用户手机号
  savaPhoneNumber: function (phoneNo){
      let data={
        phone: phoneNo
      }
      common.post(`app.php?c=user&a=save_user_phone`, data, savaPhoneNumberFun, '');
      function savaPhoneNumberFun(result){
      }

    },
    //获取用户手机号
  getPhoneNumber: function (e, that, nowCoed){
      console.log("手机号获取：",e)
      if (e.detail.errMsg.indexOf("ok")<0) {
        //拒绝手机号授权
        that.setData({
          no_user_phone: true
        })
        return;
      } else {
        //允许获取手机号
        app.analysisPhoneNum(e, that,nowCoed)
      }
    },
    globalData: {
        my_uid:0,//用户id
        root_store_id: '',
        store_id: '',
        userInfo: null, //用户信息
        navigateBarBgColor: extConfig.themeColor, //顶部导航条背景色
        navigatorBarType: extConfig.navigatorBarType, //0 普通版 1 素雅版
        switch_store: false, //是否切换过门店
        dpr: dpr,
        storge: {
            callbackObj: null,
            refreshConfig: null,
            pageThat: null
        },
        login: {},
        store_nav_list: [
        ],
        BASE_IMG_URL: 'https://s.404.cn/applet/', //图片访问地址
        get_user_phone: 0, //是否强制获取手机号（0否)
        has_phone: 0,//是否有手机号
        code:'',//用户登录code
        SUB_PACKAGE_BACK:'../../',
        SUB_PACKAGE_USER_URL:'/pages/USERS',
        unlogin: true,
        fresh_count:0//刷新次数

    },
    updateThemeColor: function () {
        //每个生命周期获取去一次导航配置
        return new Promise((resolve, reject) => {
            if(app.globalData.get_theme_color === true){
                resolve({...app.globalData,themeColor: app.globalData.navigateBarBgColor})
            }else{
                common.post('app.php?c=wxapp&a=get_theme_color', '', res => {
                    if (res.err_code === 0) {
                        let app = getApp();
                        let ext_config = res.err_msg.ext_config
                        app.globalData.my_uid = res.err_msg.uid
                        app.globalData.navigateBarBgColor = ext_config.themeColor
                        app.globalData.navigatorBarType = ext_config.navigatorBarType
                        app.globalData.store_nav_list = ext_config.store_nav_list||[] //自定义导航信息会存在没有配置的情况，会报错
                        app.globalData.applet_guide_subscribe = ext_config.applet_guide_subscribe
                        //每个生命周期获取去一次导航配置
                        app.globalData.get_theme_color = true
                        publicFun.setBarBgColor(app)
                        resolve(ext_config)
                    } else {
                        reject(res.err_msg)
                    }
                }, '')
            }
        })
    },
    //判断用户是游客身份
    isLoginFun: function (that,type) {
      let _unlogin = true;
      let _value = wx.getStorageSync('unlogin');
      if ((_value !== undefined && _value !== "") || _value === false) {
        _unlogin = _value;
      } else {
        _unlogin = getApp().globalData.unlogin;
      }
    if (getApp().globalData.loginData){
      that.setData({
        modalTyepe: getApp().globalData.loginData,
        btntext: '获取验证码',
        coden: 'getCode'
      })
    }
      if (type && that){
        that.setData({
          _unlogin
        })
      }else{
        if (_unlogin == false) {
          return true;
        } else {
          that.setData({
            showLoginModal: true
        })
        return false;
      }
    }
  },

  getModalType: function() {
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          common.post('app.php?c=wxapp&a=get_login_config&code=' + res.code, '', res => {
            console.log(res, "wwwwwwwwwwwwwwwwww")
            if (res.err_code == 0) {
              let loginData = res.err_msg
              console.log(loginData, "wwwwwwwwwwwwwwwwaaaaaaaaaaaww")
              getApp().globalData.loginData = loginData
            }

          }, '')
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  onLaunch: function() {
    this.getModalType()
  }
});

let app = getApp();
app.updateThemeColor();
