var common = require('../../utils/common.js');
var publicFun = require('../../utils/public.js');
var app = getApp();
Page({
    data: {
        path_pid:""
    },
    onLoad: function(e) {
        var that = this;
        publicFun.setBarBgColor(app, that);// 设置导航条背景色
        let url = '/pages/index/index';
        let latitude = '';
        let longitude = '';
        let param = '';
        if (e != undefined && e != '' &&　e.pid) {
            param += '&product_id=' + e.pid;
            that.setData({
                path_pid: e.pid // 当前页面路径参数商品id
            })
        }
        if (e.rounter) {
          that.setData({ rounter: e.rounter })
        }
        try {
            latitude = wx.getStorageSync('latitude')
            longitude = wx.getStorageSync('longitude')
          console.log(`latitude---${latitude},longitude========${longitude}`)
            param += '&lat=' + latitude + '&lng=' + longitude;
        } catch (e) {

        }
        // console.log('param=====', param)
        common.post('app.php?c=lbs&a=substores' + param, '', "shopHomeData", that);
        publicFun.setUrl(url);
        publicFun.height(that);
        publicFun.barTitle('选择门店');

    },
    onReady: function(e) {

    },
    onShow: function() {
        //获取用户上次打开小程序距重新获取地理位置
        app.getTimeDifference();
        
        if (this.data.userData == '') {
            this.onReady(e);
        } else {
            publicFun.setUrl('')
        }
    },

    shopHomeData: function(result) {
        var that = this
        if (result.err_code == 0) {
            this.setData({
                shopHomeData: result.err_msg,
            })
            //console.log(publicFun.expressDistance('37.820587', '118.820587'));
            // publicFun.expressDistance(alats, alongs, lats, longs);

        }
    },

    wxSearchFn: function(e) {
        var that = this;
        var page = 'shopHome';
        publicFun.wxSearchFn(that, e, page);
    },
    wxSearchInput: function(e) {
        var that = this;
        publicFun.wxSearchInput(that, e)
    },
    cancelSearch: function(e) {
        var that = this;
        cancelSearch(that);
    },
  goShopList: function (e) {
    var that = this;
    // console.log(e)
    setTimeout(function () {
      let id = e.currentTarget.dataset.id;
      let status = e.currentTarget.dataset.status;
      if (status * 1 != 1) {
        return publicFun.warning('该门店已打烊', that);
      } else {
        let data = {
          physical_id: id
        }
        common.post('app.php?c=lbs&a=switch_substore&type=1', data, shopHomeData, '');

        function shopHomeData(result) {
          if (result.err_code == 0) {
            app.globalData.switch_store = true;
            if (that.data.path_pid != undefined && that.data.path_pid != '') {
              wx.navigateTo({
                url: '/pages/product/details?product_id=' + that.data.path_pid,
              })
            } else {
              if (that.data.rounter == 'shopcat') {
                wx.navigateTo({
                  url: '/pages/shoppingCat/index'
                })
              } else {
                var openType = "redirectTo";
                var nav_list = that.data.store_nav_list;
                for (var i = 0; i < nav_list.length; i++) {
                  var navListElement = nav_list[i];
                  if (navListElement.pagePath.indexOf('pages/index/index') > -1 && navListElement.status == 1) {
                    openType = "reLaunch"
                  }
                }
                wx[openType]({
                  url: '/pages/index/index?'
                })
              }

            }
          }
        }
      }
    }, 500)



  },
    getLocation: function() {
        var that = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                           console.log(res)
                var latitude = res.latitude
                var longitude = res.longitude
                wx.setStorage({
                    key: "latitude",
                    data: latitude
                });
                wx.setStorage({
                    key: "longitude",
                    data: longitude
                })

                let param = '';
                try {
                    latitude = wx.getStorageSync('latitude')
                    longitude = wx.getStorageSync('longitude')
                    param = '&lat=' + latitude + '&lng=' + longitude;
                } catch (e) {

                }
                common.post('app.php?c=lbs&a=substore_index' + param, '', "shopHomeData", that);

            },
            fail: function (res) {
                publicFun.warning('定位失败，请稍后重试', that);
            }
        })
    }

})
