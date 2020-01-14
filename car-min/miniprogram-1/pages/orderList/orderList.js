// pages/orderList/orderList.js
const app = getApp()

import { userOrder } from "../../utils/userapi.js"
import { closeOrder } from "../../utils/userapi.js"
import { cancelOrder } from "../../utils/userapi.js"
import { againPay } from "../../utils/userapi.js"
import { receiveOrder } from "../../utils/userapi.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topIndex: 0,
    ascendingOrder: true,
    headType: ["全部", "待付款", "待发货", "待收货", "已完成"],

    orderList: [
    ],
    curPage: 1,//当前页码
    page_size: 10,
    total: 0,
    list: [],
    noData: false,
    isLoading: false,
    order_no:"",
    status:"",


    jssj: "2020-07-24 07:23:00",                                   //设置结束时间

    timer: "",                                                     //倒计时定时器名称
    timerArr:[],
    qgdjs_jo: { day: "00", hour: "00", min: "00", sec: "00" }      //抢购倒计时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {




    //let today = new Date().getTime();

    

    console.log(options);

    if (options.type==1){//待付款
   
        this.setData({
          status:0,
        });
    }else if(options.type==2){//待发货

      this.setData({
        status: 10,
      });
    }else if(options.type==3){//待收货

      this.setData({
        status:20,
      });
    }else if(options.type==4){//已完成
 
      this.setData({
        status: 30,
      });
    }else if(options.type==0){//全部订单

      this.setData({
        status:"",
      });
      
    };
    let param = {
      page:1,
    };

    this.userOrder(param);
   

    this.setData({
      topIndex:options.type,
    });


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

    // for(let idx in this.data.timerArr){


    //   clearInterval(this.data.timerArr[idx]);
    // }
    clearInterval(this.data.timer);
   
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
        page: curPage,
        page_size: 10,

      }
      this.userOrder(param);
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  header_click(e){

    console.log(e.currentTarget.dataset.idx);
    this.setData({
      topIndex: e.currentTarget.dataset.idx,
      orderList:[],
    })


    if (e.currentTarget.dataset.idx==0){//全部
      // param = {
      //   page: 1,
      //   page_size: 20,
      //   status:"",
      // }
      this.setData({
        status: "",
      });
    } else if (e.currentTarget.dataset.idx == 1){//待付款
 
      this.setData({
        status: 0,
      });
  
    } else if (e.currentTarget.dataset.idx == 2){
      this.setData({
        status: 10,
      });
    } else if (e.currentTarget.dataset.idx == 3){
      // param = {
      //   status: 20,
      //   page: 1,
      //   page_size: 20,
      // }
      this.setData({
        status: 20,
      });
    } else if (e.currentTarget.dataset.idx == 4){
      // param = {
      //   status: 30,
      //   page: 1,
      //   page_size: 20,
      // }
      this.setData({
        status: 30,
      });
    }
    let param = {
      page : 1,
    }
    this.userOrder(param);

    
 

  },

  userOrder(res){
    //console.log("res",res);
    // if (res == 'refresh') {
    //   wx.stopPullDownRefresh();
    // }
    // this.setData({
    //   isLoading: false
    // })
    // console.log("listdadd");

    clearInterval(this.data.timer);

    //0 代付款  10 待发货 20 待收货  30 已完成
    var that = this;

    let orderList = this.data.orderList;
    var param = { status: this.data.status, page: res.page, page_size: this.data.page_size };
    userOrder(param).then((res) => {
      
      var data = res.data;
      if (res.code == 0) {

   
        this.setData({
          orderList: [...orderList, ...res.data.data],

          total: res.data.total,
        })

        console.log("orderlistCount==c", this.data.orderList,this.data.orderList.length);


        // for(let idx in that.data.orderList){

        //   if(that.data.orderList[idx].status==0){
        //     that.countDown(idx);
        //   }
          
        // }
        that.countDown();


          
   
      }

    })
  },
  orderItemClick(e){
    console.log("order-itemIndex",e.currentTarget.dataset.idx);
    let idx = e.currentTarget.dataset.idx;
    let order_no = this.data.orderList[idx].order_no;

    wx.navigateTo({
      url: '../orderDetail/orderDetail?order_no=' + order_no
    })
  },

  // 关闭订单（未付款）
  closeClick(e){


    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消当前订单？～',
      success: function (res) {
        if (res.confirm) {

          console.log("canncelUnpay", e.currentTarget.dataset.idx);
          let idx = e.currentTarget.dataset.idx;
          let master_order_no = that.data.orderList[idx].master_order_no;
          let param = {
            order_no: master_order_no,
          };
          that.closeOrder(param);

        } else {
          console.log('用户点击取消')
        }

      }
    })





  },
  //取消订单(已付款)
  cancelClick(e){



    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消当前订单？～',
      success: function (res) {
        if (res.confirm) {

          console.log("canncelPay", e.currentTarget.dataset.idx);
          let idx = e.currentTarget.dataset.idx;
          let order_no = that.data.orderList[idx].order_no;
          let param = {
            order_no: order_no,
          };
          that.cancelOrder(param);

        } else {
          console.log('用户点击取消')
        }

      }
    })




  },
  //去付款
  payClick(e){

    let idx = e.currentTarget.dataset.idx;
    let master_order_no = this.data.orderList[idx].master_order_no;
    let param = {
      order_no: master_order_no,
    };
    this.againPay(param);

    console.log("lsit-purchse",e.currentTarget.dataset.idx);


  },
  //查看物流
  logisticClick(e){
    let idx = e.currentTarget.dataset.idx;
    let order_no = this.data.orderList[idx].order_no;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?order_no=' + order_no
    })
  },

  //确认收货
  receiveClick(e){


    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认收货？～',
      success: function (res) {
        if (res.confirm) {


          let idx = e.currentTarget.dataset.idx;
          let order_no = that.data.orderList[idx].order_no;
          let param = {
            order_no: order_no,
          };

          that.receiveOrder(param);

        } else {
          console.log('用户点击取消')
        }

      }
    })


  },
  receiveOrder(res){

    receiveOrder(res).then((res) => {
      console.log("closeOrder==", res);
      var data = res.data;
      if (res.code == 0) {

        wx.showToast({
          title: '确认收货成功',
          "icon": "none",
        });
        let param = {
          status: 20,
          page: 0,
          page_size: 20,
        }


        this.setData({
          
          orderList: [],
        })
        this.userOrder(param);


      }

    })
  },

  // //上拉刷新
  // onPullDownRefresh() {
  //   this.setData({
  //     isLoading: true,
  //     curPage: 1,
  //     list: [],
  //   })
  //   this.userOrder('refresh');
  // },
  // getGoodsList(type) {
  //   this.setData({
  //     isLoading: true
  //   })
  //   let { page_size, curPage, total } = this.data;
  //   goodsList({ page_size: page_size, page: curPage, cate_id: '', is_hot: 1 }).then((res) => {
  //     if (type == 'refresh') {
  //       wx.stopPullDownRefresh();
  //     }
  //     this.setData({
  //       isLoading: false
  //     })
  //     if (res.code == 0) {
  //       if (!res.data.data.length) {
  //         if (this.data.curPage == 1) {
  //           this.setData({
  //             noData: true
  //           })
  //         } else {
  //           this.setData({
  //             noData: false
  //           })
  //         }
  //         wx.showToast({
  //           title: '暂无更多数据...',
  //           icon: 'none'
  //         })
  //         return;
  //       }
  //       this.setData({
  //         total: res.data.total,
  //         list: [...this.data.list, ...res.data.data]
  //       })
  //     }
  //   })
  // },

  //关闭订单
  closeOrder(res){

    // var param = { status: res.status, page: this.data.curPage, page_size: this.data.page_size };
    closeOrder(res).then((res) => {
      console.log("closeOrder==", res);
      var data = res.data;
      if (res.code == 0) {
   
        wx.showToast({
          title: '关闭订单成功',
          "icon":"none",
        });
        let param = {
          status: 0,
          page: 1,
          page_size: 10,
        }
        this.setData({

          orderList: [],
        })
        this.userOrder(param);


      }

    })
  },

  //取消订单
  cancelOrder(res){
    // var param = { status: res.status, page: this.data.curPage, page_size: this.data.page_size };
    cancelOrder(res).then((res) => {
      
     
      if (res.code == 0) {

        var data = res.data;
        console.log("cancelPay+",data);
        wx.showToast({
          title: '取消订单成功',
          "icon": "none",
        });
        let param = {
          status: 10,
          page: 1,
          page_size: 10,
        }
        this.setData({

          orderList: [],
        })
        this.userOrder(param);

      }

    })

  },

  againPay(res){
    var param = { order_no: res.order_no};
    var that = this;
    againPay(param).then((res) => {

      var data = res.data;
      if (res.code == 0) {

        console.log("againPay==", res);

        that.setData({
          order_no: res.data.order_no,
        })

        let pay_params = res.data.pay_params;
        wx.requestPayment({
          timeStamp: pay_params.timeStamp,
          nonceStr: pay_params.nonceStr,
          package: pay_params.package,
          signType: pay_params.signType,
          paySign: pay_params.paySign,
          success(result) {

            wx.showToast({
              icon: 'none',
              title: "支付成功",
            });
            console.log("status")

            setTimeout(() => {
              console.log("setTimeout")
              wx.navigateTo({
                url: '../paySuccess/paySuccess?type=' + "success",

              });


            }, 1500)

            //该支付接口校验指纹支付有问题
            // checkPayResult({
            //   order_no: res.data.order_no
            // }).then((data) => {
            //   if (data.code == 0) {

            //     if (data.data[0].status == 1) {//status支付成功

            //       wx.showToast({
            //         icon: 'none',
            //         title: data.message,
            //       });
            //       console.log("status")

            //       // wx.navigateTo({
            //       //   url: '../paySuccess/paySuccess?type=' + "success",

            //       // });
            //       setTimeout(() => {
            //         console.log("setTimeout")
            //         wx.navigateTo({
            //           url: '../paySuccess/paySuccess?type=' + "success",

            //         });


            //       }, 1500)
            //     } else {

            //       console.log("status!!!=1")
            //       wx.showToast({
            //         icon: 'none',
            //         title: data.message,
            //       });
            //       wx.navigateTo({
            //         url: '../paySuccess/paySuccess?type=' + "fail" + "&pay_params=" + encodeURIComponent(JSON.stringify(pay_params)) + "&order_no=" + that.data.order_no,

            //       })

            //     }

            //   } else {//验证支付接口业务和支付成功与否无关
            //     console.log("code!===0")
            //     wx.showToast({
            //       icon: 'none',
            //       title: data.message,
            //     });


            //   }
            // })
          },
          fail(res) {

            console.log("wxpayFail")
            wx.navigateTo({
              url: '../paySuccess/paySuccess?type=' + "fail" + "&pay_params=" + encodeURIComponent(JSON.stringify(pay_params)) + "&order_no=" + that.data.order_no,

            })
          }

        })



        ///++
      }

    })

  },

  //倒计时
  countDown: function (idx) {

    let that = this;


        // let timer;

        // this.data.timerArr.push(timer);

    that.setData({
      timer: setInterval(function () {

        for (let idx in that.data.orderList) {
          let startTime = that.data.orderList[idx].created_at;

          let status = that.data.orderList[idx].status;
          if (status == 0) {

              let time = (new Date(startTime.replace(/-/g, "/")).getTime());
              let endInt = parseInt(time) + 30 * 60000;
              var lefttime = endInt - parseInt(new Date().getTime());

              if (lefttime <= 0) {
                that.setData({
                  qgdjs_jo: { day: "00", hour: "00", min: "00", sec: "00" }
                })
                clearInterval(that.data.timer);
                // clearInterval(timer);
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
              //取出历史选择记录
              var array = that.data.orderList;

              let param = array[idx];


              if (param.order_no.length < 6) {//判定为空则返回不对数组元素操作

                clearInterval(that.data.timer);
                return;
              }

              let dic = {
                ...param,
                qgdjs_jo: { day: d, hour: h, min: m, sec: s },
              }

              //在指定位置添加元素,第一个参数指定位置,第二个参数指定要删除的元素,如果为0,则追加 （如果为0则会一直追加数组有bug）
              array.splice(idx, 1, dic);

              that.setData({

                orderList: array,
              })

          }

        }

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
  } 


})