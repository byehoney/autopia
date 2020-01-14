var extConfig = wx.getExtConfigSync();
if (wx.getExtConfig) {
  wx.getExtConfig({
    success: function(res) {
      console.log(res)
      extConfig = res.extConfig;
    }
  })
}
//console.log(extConfig);
/**@author wangmu 2017-02-08**/
var common = {}; 
var requestDomain = extConfig.apiUrl;
var store_id = extConfig.token;
var types = extConfig.type;

common.is_fx = false; //是否是分销商
common.store_id = store_id;
common.Url = requestDomain;
common.types = types;
let ticket = '';

common.dev = (wx.getSystemInfoSync().platform.toLowerCase() === 'devtools');

common.log = function() {
  //小程序在手机模式打开请求的url以及返回log
  if (!common.dev) {
    return console.log.apply(null, arguments)
  } else {
    return false
  }
}

/**
 *
 * @param url
 * @param param
 * @param callFun
 * @param that
 * @param errCallBack
 * @returns {boolean}
 */

common.post = function(url, param, callFun, that, errCallBack) {
  let testUrl = url;
  var app = getApp();
  app.globalData.root_store_id = extConfig.token;
  try {
    store_id = app.globalData.store_id != '' && app.globalData.store_id != undefined ? app.globalData.store_id : store_id;
    let wx_ticket = wx.getStorageSync('ticket');
    if (wx_ticket) {
      ticket = wx_ticket;
    }
  } catch (e) {}
  if (that != '') {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 5000
    });
  }
  if (typeof(url) == 'undefined') {
    return false;
  }
  // console.log(url)
  var urlArr = url.split('?');
  var new_url = '';
  if (urlArr.length > 2) {
    new_url = urlArr[0] + '?store_id=' + store_id + '&' + urlArr[1] + '?' + urlArr[2];

  } else {
    new_url = urlArr[0] + '?store_id=' + store_id + '&' + urlArr[1];
  }

  //接口链接
  var postUrl = common.Url + new_url + '&request_from=app&wx_type=' + types + '&wxapp_ticket=' + ticket;
  // console.log(postUrl)
  if (!param) {
    param = {};
  }
  // 小程序加上请求的url打印，方便app内测试
  common.log('请求的url：', postUrl)
  common.log('请求的param：', param)
  wx.request({
    url: postUrl,
    data: param,
    header: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    success: function(res) {
      //没有登录或没有openID,需要重新授权
      if (res.data.err_code == 20000 || res.data.err_code == 10000) {
        if (ticket) {
          wx.setStorageSync('ticket', '');
          ticket = '';
        }
        //未登录参数赋值
        getApp().globalData.unlogin = true;
        wx.setStorageSync('unlogin', true);
        
        var config_data = common.getCurrentPages();
        console.log(config_data)
        app.getUserInfo({
          pageThat: that,
          refreshConfig: config_data,
          callback: '',
        });
      }

      //处理分销商被禁用
      if (res.data.err_code == 404) {

        wx.reLaunch({
          url: '/pages/index/index?store_id=' + extConfig.token
        })

        setTimeout(function() {
          wx.hideToast()
        }, 500)
      }

      //30001处理
      if (res.data.err_code == 30001) {
        that.setData({
          'textBoxShow': false,
        });
        if (res.data.err_dom == 1) {

          store_id = res.data.err_msg;
          common.store_id = store_id;
          app.globalData.store_id = store_id; // 改变全局变量
          common.is_fx = true; //个人中心前端判断是否是分销商(有隐患)
          wx.getStorage({
            key: 'navdata',
            success: function (res) {
              var currentPages = getCurrentPages()
              var currentPage = currentPages.pop()
              var currentRoute = currentPage.route
              var param = common.parseParams(currentPage.options)
              if (param) {
                currentRoute += ('?' + param)
              }
              let store_nav_list = JSON.parse(res.data);
              var store_nav_list_show = false
              store_nav_list = store_nav_list.filter(function (item) {
                return item.status == 1
              })
              store_nav_list.forEach(item => {
                item.pagePath = common.getType(item.pagePath, item).url
                // console.log("reset-value******", item.pagePath)
                if (item.pagePath.includes(currentRoute) || `/${currentRoute}`.includes(item.pagePath)) {
                  item.active = true
                  if (item.status == 1) {
                    store_nav_list_show = true
                  }
                } else {
                  item.active = false
                }
              })
              // console.log('重设过后的只', store_nav_list,store_nav_list_show)
              that.setData({
                store_nav_list,
              })
            },
          })
          url = common.changeURLArg(url, 'store_id', common.store_id);
          if (param.store_id && param.store_id!=common.store_id){
            param.store_id = common.store_id;
          }
          common.post(url, param, callFun, that);
        }
        if (res.data.err_dom == 2) {
          getApp().globalData.store_id = res.data.err_msg;
        }
      }

      //返回正常错误信息提示
      if ((res.data.err_code != 0 && res.data.err_code != 20000 && res.data.err_code != 10000) && res.data.err_code != 30001 && res.data.err_code != 1009 && res.data.err_code != 1010 && res.data.err_code != 404) {
        // 过滤err_msg中html标签
        let pattern = /<\/?.*?>/g;
        let msg = res.data.err_msg.replace(pattern, '');
        wx.hideLoading()
        wx.hideToast()
        let reg = RegExp(/app.php?c=wxapp&a=store_login/g);

        if (msg != '') {
          if (reg.test(testUrl)) {

          } else {
            wx.showModal({
              title: '提示信息',
              content: msg,
              confirmText: '知道了',
              showCancel: false,
              confirmColor: '#fe6b31',
              success: function(result) {
                wx.hideToast()
                if (typeof errCallBack !== 'undefined') {
                  if (that === '' && typeof errCallBack === 'function') {
                    errCallBack(res.data)
                  } else if (typeof that[errCallBack] === 'function') {
                    that[errCallBack](res.data)
                  }
                }
                if (res.data.err_msg.indexOf('history.back') >= 0) {
                  wx.navigateBack({})
                }
              }
            })
          }
        }

        // setTimeout(function () {
        wx.hideToast()
        // }, 500)
        try {
          wx.setStorageSync('url', '')
        } catch (e) {}
      } else {
        if (that == '') {
          wx.hideToast()
          return callFun(res.data)
        } else {
          that.setData({
            containerLayer: true
          })
        }

        that[callFun](res.data);
        // setTimeout(function() {
        wx.hideToast()
        // }, 500)
      }

    },
    fail: function(res) {
      console.log('request fail')
      wx.hideLoading()
      wx.hideToast()
      // console.log(postUrl)
      wx.showModal({
        title: '网络超时',
        content: '请关闭刷新',
        confirmText: '知道了',
        showCancel: false,
        confirmColor: '#fe6b31',
        success: function(res) {}
      })
    }
  });

};
//重设nav导航
common.parseParams = function (data) {
  try {
    var tempArr = [];
    for (var i in data) {
      var key = encodeURIComponent(i);
      var value = encodeURIComponent(data[i]);
      tempArr.push(key + '=' + value);
    }
    var urlParamsStr = tempArr.join('&');
    return urlParamsStr;
  } catch (err) {
    return '';
  }
}
common.getType = function (url,obj_nav) {
  var r = { url };
  if (url.includes('webapp/wapindex/#/intMall/')) {
    r.type = 'navigate'
    r.url = '/pages/webview/index?url=' + encodeURIComponent(publicFun.url_add_param(url, 'wxapp_ticket', wx.getStorageSync('ticket')))
  } else if (url.includes('wap/drp_register')) {
    r.type = 'navigate'
    if (common.is_fx) {
      r.url = '/pages/distribution/index'
    } else {
      r.url = '/pages/distribution/create_distribution'
    }
  } else if (url.includes('goods_category') || url.includes('goodsCategory')) {
    r.type = 'goods_category';
    r.id = 0;
    r.url = '/pages/goods_category/index'
  } else if (url.indexOf('wap/page.php') > 0) {
    r.type = 'page';
    var reTag = /.*wap\/page\.php\?id=(\d*).*/g;
    var id = url.replace(reTag, '$1');
    r.id = id;
    if (obj_nav && obj_nav.is_group1 == 1) {
      r.url = '/pages/CLIST/pages/group/groupLeft?page_id=' + r.id;
      if (obj_nav.title){
        wx.setStorage({
          key: 'groupName',
          data: obj_nav.title,
        })
      }
    } else {
      r.url = '/pages/index/page?page_id=' + r.id;
    }
  } else if (url.indexOf('equity') > 0) {
    r.id = 0;
    r.url = '/pages/giftMember/giftuser/user?showback=' + r.id;
  } 
   else if (url.indexOf('wap/good.php') > 0) {
    r.type = 'good';
    var reTag = /.*wap\/good\.php\?id=(\d*).*/g;
    var id = url.replace(reTag, '$1');
    r.id = id;
    r.url = '/pages/product/details?product_id=' + r.id;
  } else if (url.indexOf('wap/home.php') > 0) {
    r.type = 'switchTab';
    var reTag = /.*wap\/home\.php\?id=(\d*).*/g;
    var id = url.replace(reTag, '$1');
    r.id = id;
    r.url = '/pages/index/index';
  } else if (url.indexOf('wap/ucenter.php') > 0) {
    r.type = 'switchTab';
    r.id = 0;
    r.url = '/pages/user/index';
  } else if (url.indexOf('webapp/wapindex/#/shopProduct') > 0) {
    r.type = 'shopProduct';
    r.id = 0;
    r.url = '/pages/product/productList';
  } else if (url.indexOf('webapp/groupbuy') != -1) {
    r.type = 'groupbuy'
    var reTag = /.*groupbuy\/\#\/details\/(\d*).*/g;
    var id = url.replace(reTag, '$1');
    r.id = id;
    r.url = '/pages/details/index?tuan_id=' + r.id;
  } else if (url.indexOf('wap/bargain.php') != -1) {
    r.type = 'bargain'
    var id = '';
    var reTag = /.*wap\/bargain\.php\?action=detail&id=(\d*).*/g;
    id = url.replace(reTag, '$1');

    r.id = id;
    if (isNaN(id)) {
      r.url = 'pages/bargain/index';
    } else {
      r.url = '/pages/bargain/details?id=' + r.id;
    }
  } else if (url.indexOf('wap/seckill.php') != -1) {
    r.type = 'seckill'
    var reTag = /.*wap\/seckill\.php\?seckill_id=(\d*).*/g;
    var id = url.replace(reTag, '$1');
    if (isNaN(parseInt(id))) {
      var reTag2 = /.*wap\/seckill\.php\?id=(\d*).*/g;
      id = url.replace(reTag2, '$1');
    }

    r.id = id;
    r.url = '/pages/seckill/index?id=' + r.id;

  } else if (url.indexOf('wap/presale.php') != -1) {
    r.type = 'presale'
    var reTag = /.*wap\/presale\.php\?action=detail&id=(\d*).*/g;
    var id = url.replace(reTag, '$1');

    r.id = id;
    r.url = '/pages/presale/index?id=' + r.id;

  } else if (url.indexOf('wap/store_coupon.php') != -1) {
    r.type = 'store_coupon';
    var reTag = /.*wap\/store_coupon\.php\?couponid=(\d*).*/g;
    var id = url.replace(reTag, '$1');
    r.id = id;
    r.url = '/pages/index/coupons?coupon_id=' + r.id;
  } else if (url.indexOf('wap/new_user.php') > 0) {
    r.id = id;
    r.url = '/pages/new_user/index';
  } else if (url.indexOf('wap/membersDetails.php') > 0) {
    r.id = id;
    r.url = '/pages/user/vip/vip';
  }

  else {
    /*r.type = 'switchTab';
    r.url = '/pages/index/index';*/
  }
// -----------------
  //判断当前导航配置
  getApp().globalData.store_nav_list.forEach(item => {
    if (r.url && r.url.includes(item.pagePath)) {
      r.type = 'switchTab'
    }
  })

  return r;
}
common.changeURLArg = function(url, arg, arg_val) {
  var pattern = arg + '=([^&]*)';
  var replaceText = arg + '=' + arg_val;
  if (url.match(pattern)) {
    var tmp = /(store_id=)([^&]*)/ig;
    tmp = url.replace(tmp, replaceText);
    return tmp;
  } else {
    if (url.match('[\?]')) {
      return url + '&' + replaceText;
    } else {
      return url + '?' + replaceText;
    }
  }
  let uuu = url + '\n' + arg + '\n' + arg_val;

  return uuu
}

common.getCurrentPages = function(sid) {
  let pages = getCurrentPages() //获取加载的页面

  let currentPage = pages[pages.length - 1] //获取当前页面的对象

  let url = currentPage.route //当前页面url

  let options = currentPage.options //如果要获取url中所带的参数可以查看options

  let pageType = 'page';

  if (url.indexOf('pages/index/index') > 0 || url.indexOf('pages/product/recommend') > 0) pageType = 'tab';

  return {
    url: url,
    pageType: pageType,
    param: options,
  }
}

//拼团活动专用post公共方法
common.tuanPost = function(url, param, callFun, that) {
  var app = getApp();
  try {
    let wx_ticket = wx.getStorageSync('ticket')
    if (wx_ticket) {
      ticket = wx_ticket;
    }
  } catch (e) {
    // Do something when catch error
  }
  if (that != '') {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
  }
  if (typeof(url) == 'undefined') {
    return false;
  }

  var postUrl = common.Url + url + '&ticket=' + ticket + '&request_type=2';
  if (!param) {
    param = {};
  }

  // 定位
  var latitude = wx.getStorageSync('latitude');
  var longitude = wx.getStorageSync('longitude');
  if (latitude == undefined || latitude == '') {
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
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
      },
      fail: function(res) {
      }
    })
  }
  common.log('请求的url：', postUrl)

  wx.request({
    url: postUrl,
    data: param,
    header: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    success: function(res) {
      common.log('返回的数据', res)
      if (res.data.err_code === 20000 || res.data.err_code === 10000) {
        if (ticket) {
          wx.setStorageSync('ticket', '');
          ticket = '';
        }
        //未登录参数赋值
        getApp().globalData.unlogin = true;
        wx.setStorageSync('unlogin', true);

        var config_data = common.getCurrentPages();
        console.log(config_data)
        app.getUserInfo({
          pageThat: that,
          refreshConfig: config_data,
          callback: '',
        });

      }
      //处理分销商被禁用
      if (res.data.err_code == 404) {

        wx.reLaunch({
          url: '/pages/index/index?store_id=' + extConfig.token
        })

        setTimeout(function() {
          wx.hideToast()
        }, 500)
      }

      //30001处理
      if (res.data.err_code == 30001) {
        that.setData({
          'textBoxShow': false,
        });
        if (res.data.err_dom == 1) {
          store_id = res.data.err_msg;
          common.store_id = store_id;
          app.globalData.store_id = store_id; // 改变全局变量
          common.is_fx = true; //个人中心前端判断是否是分销商(有隐患)
          url = common.changeURLArg(url, 'store_id', common.store_id);
          common.tuanPost(url, param, callFun, that);
        }
        if (res.data.err_dom == 2) {
          // store_id = store_id;
        }
      }
      if ((res.data.err_code != 0 && res.data.err_code != 20000) && res.data.err_code != 1009 && res.data.err_code != 1010 && res.data.err_code != 404 && res.data.err_code != 30001) {
        wx.showModal({
          title: '提示信息',
          content: res.data.err_msg,
          confirmText: '知道了',
          showCancel: false,
          confirmColor: '#fe6b31',
          success: function(res) {}
        })
        try {
          wx.setStorageSync('url', '')
        } catch (e) {}
      } else {
        if (that == '') {
          return callFun(res.data)
        }
        that[callFun](res.data);
        setTimeout(function() {
          wx.hideToast()
        }, 500)
      }

    },
    fail: function(res) {
      console.log("数据请求失败");
      return {};
    }
  });

};

// 增加页面信息回执
common.setUserInfoFun=(that,app)=>{
  var config_data = common.getCurrentPages();
  console.log(config_data)
  app.getUserInfo({
    pageThat: that,
    refreshConfig: config_data,
    callback: '',
  });
}
common.uploadFile = (url, filePath, callFun, that) => {
  let testUrl = url;
  var app = getApp();
  app.globalData.root_store_id = extConfig.token;
  try {
    store_id = app.globalData.store_id != '' && app.globalData.store_id != undefined ? app.globalData.store_id : store_id;
    let wx_ticket = wx.getStorageSync('ticket');
    if (wx_ticket) {
      ticket = wx_ticket;
    }
  } catch (e) {}
  if (that != '') {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 5000
    });
  }
  if (typeof(url) == 'undefined') {
    return false;
  }
  // console.log(url)
  var urlArr = url.split('?');
  var new_url = '';
  if (urlArr.length > 2) {
    new_url = urlArr[0] + '?store_id=' + store_id + '&' + urlArr[1] + '?' + urlArr[2];

  } else {
    new_url = urlArr[0] + '?store_id=' + store_id + '&' + urlArr[1];
  }

  //接口链接
  var postUrl = common.Url + new_url + '&request_from=app&wx_type=' + types + '&wxapp_ticket=' + ticket;
  // console.log(postUrl)
  // 小程序加上请求的url打印，方便app内测试
  common.log('请求的url：', url)
  common.log('请求的param：', filePath)
  wx.uploadFile({
    url: postUrl,
    filePath,
    name: 'file',
    success: function(res) {
      res.data = JSON.parse(res.data)
      common.log('返回的数据', res.data)
      //没有登录或没有openID,需要重新授权
      if (res.data.err_code == 20000 || res.data.err_code == 10000) {
        if (ticket) {
          wx.setStorageSync('ticket', '');
          ticket = '';
        }
        //未登录参数赋值
        getApp().globalData.unlogin = true;
        wx.setStorageSync('unlogin', true);
        
        var config_data = common.getCurrentPages();
        app.getUserInfo({
          pageThat: that,
          refreshConfig: config_data,
          callback: '',
        });
      }

      //处理分销商被禁用
      if (res.data.err_code == 404) {

        wx.reLaunch({
          url: '/pages/index/index?store_id=' + extConfig.token
        })

        setTimeout(function() {
          wx.hideToast()
        }, 500)
      }

      //30001处理
      if (res.data.err_code == 30001) {
        that.setData({
          'textBoxShow': false,
        });
        if (res.data.err_dom == 1) {
          store_id = res.data.err_msg;
          common.store_id = store_id;
          app.globalData.store_id = store_id; // 改变全局变量
          common.is_fx = true; //个人中心前端判断是否是分销商(有隐患)
          url = common.changeURLArg(url, 'store_id', common.store_id);
          common.post(url, param, callFun, that);
        }
        if (res.data.err_dom == 2) {
          // store_id = store_id;
        }
      }

      //返回正常错误信息提示
      if ((res.data.err_code != 0 && res.data.err_code != 20000 && res.data.err_code != 10000) && res.data.err_code != 30001 && res.data.err_code != 1009 && res.data.err_code != 1010 && res.data.err_code != 404) {
        // 过滤err_msg中html标签
        let pattern = /<\/?.*?>/g;
        let msg = res.data.err_msg.replace(pattern, '');
        wx.hideLoading()
        wx.hideToast()
        let reg = RegExp(/app.php?c=wxapp&a=store_login/g);

        if (msg != '') {
          if (reg.test(testUrl)) {

          } else {
            wx.showModal({
              title: '提示信息',
              content: msg,
              confirmText: '知道了',
              showCancel: false,
              confirmColor: '#fe6b31',
              success: function(result) {
                if (res.data.err_msg.indexOf('history.back') >= 0) {
                  wx.navigateBack({})
                }
              }
            })
          }
        }

        // setTimeout(function () {
        wx.hideToast()
        // }, 500)
        try {
          wx.setStorageSync('url', '')
        } catch (e) {}
      } else {
        if (that == '') {
          return callFun(res.data)
        } else {
          that.setData({
            containerLayer: true
          })
        }

        that[callFun](res.data);
        // setTimeout(function() {
        wx.hideToast()
        // }, 500)
      }
    }
  })
}

//ajax方法封装
common.ajax = (params) => {
  var that = this;
  var methodType = params.type || 'get';
  var contentType = '';
  if (methodType == 'get') {
    contentType = 'application/json';
  } else {
    contentType = 'application/x-www-form-urlencoded';
  }
  wx.request({
    url: common.Url + params.url,
    method: methodType,
    header: {
      "content-type": contentType
    },
    data: params.data,
    dataType: params.dataType || 'json',
    success: function(res) {
      params.sCallback && params.sCallback(res.data);
      //  wx.hideLoading();
      wx.stopPullDownRefresh();
    },
    error: function(err) {
      console.log(err);
    },
    complete: function(event) {}
  })
};

module.exports = common