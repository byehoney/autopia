// pages/paySuccess/paySuccess.js
const app = getApp()
import { cancelOrder } from "../../utils/api.js"
import { goodsListAPI } from "../../utils/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess:false,
    pay_params:{},
    order_no:"",

    // goodsList:[],

    jssj: "2020-07-24 07:23:00",                                   //设置结束时间

    timer: "",                                                     //倒计时定时器名称

    qgdjs_jo: { day: "00", hour: "00", min: "00", sec: "00" },      //抢购倒计时

    curPage: 1,
    page_size: 10,
    list: [],
    randomList: [],//随机商品列表
    total: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.countDown();

    console.log("success+options",options);


    let cate_id = app.globalData.cate_id;

    //获取推荐商品列表
    let param = {
      page: 1,
      page_size:8,
      cate_id:cate_id,
    }

    console.log("cate_id",cate_id);
    this.getGoodList(param);


    if(options.type == "fail"){


      //只有失败时才传数据
      var str = decodeURIComponent(options.pay_params);

      var dic = JSON.parse(str);

      this.setData({
        pay_params: dic,
      })

      this.setData({
        isSuccess:false,
        // pay_params: options.pay_params,
        order_no: options.order_no,
      })

      console.log("payfail", options);
      wx.setNavigationBarTitle({
        title: '支付失败',
        
      })

      
    }else{

      this.setData({
        isSuccess: true,
        // pay_params: options.pay_params,
      })

      console.log("paySusccess", options);
      wx.setNavigationBarTitle({
        title: '支付成功',
      })


    }

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
    // let { curPage, page_size, total } = this.data;
    // if (curPage >= total / page_size) {
    //   wx.showToast({
    //     title: '~已经到底了',
    //     icon: 'none'
    //   })
    //   return;
    // }
    // this.setData({
    //   curPage: ++curPage
    // }, () => {

    //   let param = {
    //     page: curPage,
    //     page_size: 10,
    //   }
    //   this.recommanAPI(param);
    // })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  //立即支付
  payImmediate(e){


    console.log("立即支付");
    
    // var pay_params = this.data.pay_params;
    // console.log("pay_params",this.data.pay_params);

    // var dic = JSON.parse(this.data.pay_params);

    console.log("dic",this.data.pay_params);

    let that = this;

    var dic = this.data.pay_params;
    wx.requestPayment(
      {
        'timeStamp': this.data.pay_params.timeStamp,
        'nonceStr': this.data.pay_params.nonceStr,
        'package': this.data.pay_params.package,
        'signType': this.data.pay_params.signType,
        'paySign': this.data.pay_params.paySign,
        'success': function (res) {

          // wx.showToast({
          //   title: '支付成功',
          // })
          wx.redirectTo({
            url: '../paySuccess/paySuccess?type=' + "success",

          })

        },
        'fail': function (res) {
          // wx.showToast({
          //   title: '支付失败',
          // });

          console.log("fail", res);
          wx.redirectTo({
            url: '../paySuccess/paySuccess?type=' + "fail" + "&pay_params=" + encodeURIComponent(JSON.stringify(dic)) + "&order_no=" + that.data.order_no,

          })


        },
        // 'complete': function (res) { 
        //   wx.showToast({
        //     title: '完成',
        //   });
        //   console.log("complete", res);
        // }
    })

  },

  clickCancelOrder(e){
    console.log("cancel",this.data.order_no);

    this.cancelOrder(this.data.order_no);

  },
  //取消订单
  cancelOrder(res) {

    var param = { order_no: res};

    // var param = new Array;
    // param.push(res);

    cancelOrder(param).then((res) => {

      if (res.code == 0) {


      //  wx.showToast({
      //           title: '取消订单成功',
      //   });
        wx.switchTab({
          url: '/pages/classify/classify',
        })

      }

    })

  },
  goHome(e){

    wx.switchTab({
      url: '/pages/classify/classify',
    })
  },

  goMyOrder(e){
    //查看全部订单
    wx.navigateTo({
      url: '../orderList/orderList?type=0'
    })
  },



  //倒计时
  countDown: function () {
    let that = this;

    let startTime = that.formatDate(new Date());

      // console.log(d);

    console.log(startTime);
    that.setData({
      timer: setInterval(function () {

        
        let time = (new Date(startTime.replace(/-/g, "/")).getTime());
        let endInt = parseInt(time) + 30 * 60000;

        var lefttime = endInt - parseInt(new Date().getTime());





        if (lefttime <= 0) {
          that.setData({
            qgdjs_jo: { day: "00", hour: "00", min: "00", sec: "00" }
          })
          clearInterval(that.data.timer);
          return;
        }

        var d = parseInt(lefttime / 1000 / 3600 / 24);  //天数
        var h = parseInt(lefttime / 1000 / 3600 % 24); //小时
        var m = parseInt(lefttime / 1000 / 60 % 60);    //分钟
        var s = parseInt(lefttime / 1000 % 60);        //当前的秒

        d < 10 ? d = "0" + d : d;
        h < 10 ? h = "0" + h : h;
        m < 10 ? m = "0" + m : m;
        s < 10 ? s = "0" + s : s;



        // //取出历史选择记录
        // var array = that.data.orderList;


        // let param = array[idx];
        // let dic = {
        //   ...param,
        //   qgdjs_jo: { day: d, hour: h, min: m, sec: s },
        // }

        // //在指定位置添加元素,第一个参数指定位置,第二个参数指定要删除的元素,如果为0,则追加 （如果为0则会一直追加数组有bug）
        // array.splice(idx, 1, dic);


        that.setData({
          qgdjs_jo: { day: d, hour: h, min: m, sec: s },
       
        })

      }, 1000)
    })
  },

  formatDate(now) {
    var year = now.getFullYear();  //取得4位数的年份
    var month = now.getMonth() + 1;  //取得日期中的月份，其中0表示1月，11表示12月
    var date = now.getDate();      //返回日期月份中的天数（1到31）
    var hour = now.getHours();     //返回日期中的小时数（0到23）
    var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
    var second = now.getSeconds(); //返回日期中的秒数（0到59）
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  },

  //获取分类商品列表
  getGoodList(res) {
    // let cate_id = wx.getStorageSync("cate_id");
    let that = this;
    var param = { cate_id: res.cate_id, page: 1, goods_name: '', page_size:20};

    goodsListAPI(param).then((res) => {
      console.log("goodlist==", res.data);
      var data = res.data;
      if (res.code == 0) {
        this.setData({
          list: res.data.data,

          total: res.data.total,
        })       
        var count = res.data.data.length;
        var Arr = new Array; //原数组 
        //给原数组Arr赋值 
        for (var i = 0; i < count; i++) {
          Arr[i] = i;
        }
        Arr.sort(function () {
          return 0.5 - Math.random();
        });
        
        let mark = res.data.data.length;
        if (mark < 8) {

        } else {
          mark = 8
        }

        //取随机本类型商品
        for (let idx = 0; idx < mark; idx++) {
          //let index = Math.floor(Math.random() * res.data.data.length);
          let index = Arr[idx];

          console.log('idx', index);
          that.data.randomList.push(res.data.data[index]);
        }

        that.setData({
          randomList: that.data.randomList,
        })

      }

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


    // if (!this.data.mobile) {
    //   return;
    // }
    // console.log(e);

    console.log('item', e.currentTarget.dataset.item);

    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.item.id + '&type=' + "immediate",
    })

    // console.log('purchse-idx', e.currentTarget.dataset.idx);
    // wx.navigateTo({
    //   url: '../submitOrder/submitOrder',
    // });

  },
  

})