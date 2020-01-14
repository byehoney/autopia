// pages/addressList/addressList.js

const app = getApp()
import { addressList } from "../../utils/api.js"
import { addressCreat } from "../../utils/api.js"
import { addressDelete } from "../../utils/api.js"
import { addressDetail } from "../../utils/api.js"

Page({



  
  /**
   * 页面的初始数据
   */
  data: {
    addressList:[
    ],
    isSelect:false,
    addressInfo:{},


    isDefult: false,
    name: "",
    mobile: "",
    area: "",
    areaCode: "",
    address: "",
    houseNumber: "",
    isSave: false,

    id: "",
    region: [],
    data: {
      name: "",
      province: "省",
      city: "市",
      district: "区",
      detail: "",
      tel: "",
      default: true
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("options",options);
    if (options.subbmit =="true"){
      this.setData({
        isSelect:true,
   
      })

      wx.setNavigationBarTitle({
        title: '选择收货地址',
      })
    }else{
      this.setData({
        isSelect: false,
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
    this.getAddressList();
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

  //获取地址列表
  getAddressList(res) {

    var param = { page: 1, page_size: 20 };

    addressList(param).then((res) => {
      console.log("addresslist==", res);

      
      var data = res.data;
      if (res.code == 0) {
        this.setData({
          addressList: res.data.data,
        })

        // if(res.data.data.)
      }

    })
  },

  addressClick(e){
   
   console.log(e);

    if(this.data.isSelect){//订单选择地址

      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        mydata: e.currentTarget.dataset.item,
      })

      wx.navigateBack({//返回
        delta: 1
      })
      // console.log('e', e.currentTarget.dataset);
      // console.log("select");
    }else{
      var idx = e.currentTarget.dataset.idx;

      var item = this.data.addressList[idx];
      var isAllow = item.isAllow;
      if (!isAllow) {

        wx.navigateTo({
          url: '../addressEdit/addressEdit?type=' +"edit" + "&id="+e.currentTarget.dataset.item.id,
        });

        
      }else {
        wx.navigateTo({
          url: '../addAddress/addAddress?type=edit'
        }),
        console.log("不支持配送");
      }
    }
   



  },
  createAddress(e){
    console.log("creat");
    wx.navigateTo({
      url: '../addressEdit/addressEdit?type=create'
    })

  },

  deleteAddress(e){


    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除当前地址？～',
      success: function (res) {
        if (res.confirm) {


          console.log('e', e.currentTarget.dataset.item);


          that.addressDelete(e.currentTarget.dataset.item); 

        } else {
          console.log('用户点击取消')
        }

      }
    })
   

  },
  

  addressDelete(e) {
    var param = { id: e.id };

    var that = this;
    addressDelete(param).then((res) => {
      console.log("delete==", res);



      if (res.code == 0) {

        wx.showToast({
          title: '删除成功',
          icon:"none",
        })
        that.getAddressList();
      }

    })

  },

  clickDefault(res){
    console.log("!!!!");
    console.log("adddres",res);

    let idx = res.currentTarget.dataset.idx;
    let item = res.currentTarget.dataset.item;
    let that = this;
    if (item.is_default){//是默认地址

    }else{

      var param = { id: item.id };

      addressDetail(param).then((res) => {
        //console.log("addressDetail==", res);
        if (res.code == 0) {
          var provinceKey = 'data.province';
          var cityKey = 'data.city';
          var areaKey = 'data.district';
          that.setData({
            name: res.data.receive_name,
            mobile: res.data.receive_mobile,
            [provinceKey]: res.data.receive_province,
            [cityKey]: res.data.receive_city,
            [areaKey]: res.data.receive_district,
            address: res.data.receive_address,

          })


          var param = {
            receive_name: that.data.name,
            receive_mobile: that.data.mobile,
            receive_province: that.data.data.province,
            receive_city: that.data.data.city,
            receive_district: that.data.data.district,
            receive_address: that.data.address,
            is_default: "1",
            id: item.id,

          }

          that.addressCreat(param);


        }

      })


    }

  },

  
  // 调起收货地址
  wechatAddress() {
    this.addressSeting()
    var that = this;
    wx.chooseAddress({
      success(res) {
        console.log("wechatAddress",res)
        that.setData({

          addressInfo:res,
  
        })

        let areaSub = res.provinceName.substring(0,2);

        console.log("areaSub", areaSub);

        if ((areaSub == '新疆') | (areaSub == '西藏') | (areaSub == '青海') | (areaSub == '宁夏') | (areaSub == '香港') | (areaSub == '澳门') | (areaSub == '台湾') | (areaSub == '海外')) {
          wx.showToast({
            title: '该地区暂不支持发货',
            "icon": "none",
          })
          return;
        }



        let mark;
        if(that.data.addressList.length==0){
          mark = 1;
        }else{
          mark = 0;
        }
        var param = {
          receive_name: that.data.addressInfo.userName,
          receive_mobile: that.data.addressInfo.telNumber,
          receive_province: that.data.addressInfo.provinceName,
          receive_city: that.data.addressInfo.cityName,
          receive_district: that.data.addressInfo.countyName,
          receive_address: that.data.addressInfo.detailInfo,
          is_default: mark,

        }



        that.addressCreat(param);

      }
    })

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
  //创建地址
  addressCreat(param) {
    //var param = { page: 1, page_size: 20 };


    var that = this;
    addressCreat(param).then((res) => {

      var data = res.data;
      if (res.code == 0) {
        
        // wx.showToast({
        //   title: '修改成功',
        //   icon:'none',
        // })

        that.getAddressList();
        // if(res.data.data.)
      }

    })

  }, 


  

})