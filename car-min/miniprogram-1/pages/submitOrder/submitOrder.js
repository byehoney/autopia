// pages/submitOrder/submitOrder.js
const app = getApp()
import { confirmOrder } from "../../utils/api.js"
import { addressList } from "../../utils/api.js"
import { creatOrder } from "../../utils/api.js"
import { checkPayResult } from "../../utils/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVip:false,
    orderInfo:{},
    goodsList:[],
    //选中地址信息
    addressInfo:{},
    //地址列表信息
    addressList: [
    ],
    
    creat_goodlist:[],
    order_no:"",
    otherInviteCode:"",
    invite_code:"",

    needSelectAddress:true,
    limitPrice:"",//满xx元
    disCountPrice:"",//减xx元
    options:"",
    couponID:"",//优惠券ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //console.log("submit+options",options);
    console.log("globalData",app.globalData);
    this.setData({
      isVip: app.globalData.is_vip,
      otherInviteCode: app.globalData.otherInviteCode,
      options:options,
    })

    this.data.creat_goodlist.push(options);
    this.confirmOrder(options);
    this.getAddressList();


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


   
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    let jsonAddress = currPage.data.mydata;//地址列表数据
    let jsonCoupon = currPage.data.coupon;
    if ((jsonAddress) && (jsonAddress != "undefined")) {//若为空则对addressInfo不做操作
      console.log('showJson', jsonAddress)//为传过来的值

      this.setData({
        addressInfo: jsonAddress,
        needSelectAddress:false,
      })
    }
    if ((jsonCoupon) && (jsonCoupon != "undefined")) {//若为空则对addressInfo不做操作
      console.log('showCoupon', jsonCoupon)//为传过来的值
      this.setData({
        limitPrice: jsonCoupon.c_limit_price,
        disCountPrice: jsonCoupon.c_reduction_price,
        couponID:jsonCoupon.id,
      })


      this.confirmOrder(this.data.options);


    }

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  selectAddress(res){
    wx.navigateTo({
      url: '../addressList/addressList?subbmit=true'
    })
  },
  //确认订单数据
  confirmOrder(res) {
    // var param = { id:res.id};

    // var param = { id: 5 };

    var param = new Array;
    param.push(res);

    console.log ("param",param);

    var strify = JSON.stringify(param);


    var dic = { 
      goods_list:strify,
      coupon_id:this.data.couponID,
    };

    confirmOrder(dic).then((res) => {
      console.log("confirm==", res);
      if (res.code == 0) {
        this.setData({
          orderInfo: res.data,
          goodsList: res.data.orders[0].goods,
        })
      
      }

    })
  },

  //获取地址列表
  getAddressList(res) {

    var param = { page: 1, page_size: 20 };

    addressList(param).then((res) => {
      //onsole.log("addresslist==", res);


      var data = res.data;
      if (res.code == 0) {
        this.setData({
          addressList: res.data.data,
        })

        if(this.data.addressList.length==1){
          this.setData({
            addressInfo:this.data.addressList[0],
            needSelectAddress:false,
          })
        }else if(this.data.addressList.length>1){
          for(var idx in this.data.addressList){
            var dic = this.data.addressList[idx];
            if (dic.is_default==1){
              this.setData({
                addressInfo: this.data.addressList[0],
                needSelectAddress:false,
              })
              break;
            }
          }
        }
        // if(res.data.data.)
      }

    })
  },
  immediatePurchase(e){


    if(this.data.needSelectAddress){
      wx.showToast({
        title: '请选择收货地址后购买',
        "icon":"none",
      })
    }else{
      this.creatOrder(this.data.creat_goodlist);
    }
   
    // wx.navigateTo({
    //   url: '../paySuccess/paySuccess?type=' + "fail",

    // })

  },

  //创建订单
  creatOrder(res){
    
    // console.log("address==", this.data.addressInfo);
    var strify = JSON.stringify(res);

    let that = this;

    var dic = { 
      goods_list: strify,
      receive_name: this.data.addressInfo.receive_name,
      receive_mobile: this.data.addressInfo.receive_mobile,
      receive_province: this.data.addressInfo.receive_province,
      receive_city: this.data.addressInfo.receive_city,
      receive_district: this.data.addressInfo.receive_district,
      receive_address: this.data.addressInfo.receive_address,
      pay_channel:"1",
      invite_code: "RH1XN5",//邀请码
      coupon_id:this.data.couponID, //优惠券ID
    };

  
    creatOrder(dic).then((res) => {
      
      if (res.code == 0) {
        console.log("creatSuccess==", res);

        that.setData({
          order_no: res.data.order_no,
        })
        var pay_params = res.data.pay_params;

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
            console.log("status");

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



      }

    })

  },
  couponPage(res){
    
    // console.log("coupon",this.data.options);

    var param = new Array;
    param.push(this.data.options);

    var strify = JSON.stringify(param);
  
    wx.navigateTo({
      url: '/pages/couponList/couponList?type='+"submit" + "&goods_list="+strify,

    })
  }

})