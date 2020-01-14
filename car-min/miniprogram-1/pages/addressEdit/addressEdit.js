// pages/addressEdit/addressEdit.js

const app = getApp()
import { addressCreat } from "../../utils/api.js"
import { addressDetail } from "../../utils/api.js"
import { addressList } from "../../utils/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEdit:true,
    isDefult:false,
    name:"",
    mobile:"",
    area: "",
    areaCode: "",
    address: "",
    houseNumber: "",
    isSave:false,

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
    addressList: [
    ],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options);
    this.getAddressList();
  
    if (options.type == "edit"){
      
      //当编辑时先获取地址信息
      this.addressDetail(options);
      this.setData({
        isEdit:true,
        id:options.id,
      })
      //console.log("edit");

      wx.setNavigationBarTitle({
        title: "编辑地址",
      })
    }else{
      this.setData({
        isEdit: false,
      })
      wx.setNavigationBarTitle({
        title: "添加地址",
      })
      console.log("creat");
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  addressDetail(e){
    var param = { id: e.id };

    addressDetail(param).then((res) => {
      console.log("addressDetail==", res);

      if (res.code == 0) {
        
        var provinceKey = 'data.province';
        var cityKey = 'data.city';
        var areaKey = 'data.district';
        this.setData({
          name: res.data.receive_name,
          mobile: res.data.receive_mobile,
          [provinceKey]: res.data.receive_province,
          [cityKey]: res.data.receive_city,
          [areaKey]: res.data.receive_district,
          address: res.data.receive_address,
          isDefult:res.data.is_default,
        })

      }

    })

  },

  bindKeyInput(e){
    

    var value = e.detail.value;
    var key = e.currentTarget.dataset.prop;
    var changed = {};
    this.setData({
      isSave:true,
    })
    changed[key] = value;
    this.setData(changed);

    // console.log(e.currentTarget.dataset.prop);
    // console.log(e.detail.value);
    // console.log(this.data.address);
    
  },

  saveBtn(e){

    // receive_mobile
    // 手机号

    // receive_province
    // 省

    // receive_city
    // 市

    // receive_district
    // 区

    // receive_address
    // 详细地址

    // receive_name
    // 收货人姓名

    // id
    // 编辑时传递

    if(!this.data.name){
      wx.showToast({
        title: '请填写收货人姓名',
        "icon":"none",
      })
      return;
    }else if(!this.data.mobile){
      wx.showToast({
        title: '请填写联系电话',
        "icon": "none",
      })
      return;
    }else if(!this.data.data.province){
      wx.showToast({
        title: '请选择收货人省市区',
        "icon": "none",
      })
      return;
    }else if(!this.data.address){
      wx.showToast({
        title: '请填写详细地址',
        "icon": "none",
      })
      return;
    }

    var param;

    if(this.data.addressList.length<1){
      param = {
        receive_name: this.data.name,
        receive_mobile: this.data.mobile,
        receive_province: this.data.data.province,
        receive_city: this.data.data.city,
        receive_district: this.data.data.district,
        receive_address: this.data.address + this.data.houseNumber,
        is_default: "1",
        id: this.data.id,

      }
      // console.log("<1");
      // return;
    }else{
      param = {
        receive_name: this.data.name,
        receive_mobile: this.data.mobile,
        receive_province: this.data.data.province,
        receive_city: this.data.data.city,
        receive_district: this.data.data.district,
        receive_address: this.data.address + this.data.houseNumber,
        is_default: this.data.isDefult,
        id: this.data.id,

      }

      // console.log(">1");

      // return;
    }

    this.addressCreat(param);



  },
  switch2Change: function (e) {
    console.log(e.detail.value);

    this.setData({
      isDefult: e.detail.value,
      isSave: true,
    })
  },
  /**
   * 所在地区
   * */
  bindRegionChange: function (e) {

    // 收货地址选择省市：如果用户选择的省份是新疆，西藏，青海、宁夏、香港、澳门、台湾、海外，弹出不支持发货提示，且确定按钮不可点击
    // console.log(e)
    var provinceKey = 'data.province';
    var cityKey = 'data.city';
    var areaKey = 'data.district';

    let areaSub = e.detail.value[0].substring(0,2);
    console.log("areaSub", areaSub);

    if ((areaSub == '新疆') | (areaSub == '西藏') | (areaSub == '青海') | (areaSub == '宁夏') | (areaSub == '香港') | (areaSub == '澳门') | (areaSub == '台湾') | (areaSub == '海外')){
      wx.showToast({
        title: '该地区暂不支持发货',
        "icon":"none",
      })
      return;
    }
    this.setData({
      region: e.detail.value,
      [provinceKey]: e.detail.value[0],
      [cityKey]: e.detail.value[1],
      [areaKey]: e.detail.value[2],
      isSave: true,
    })
    console.log('picker',e);

  },


  addressCreat(param){
    //var param = { page: 1, page_size: 20 };

    addressCreat(param).then((res) => {
      
      var data = res.data;
      if (res.code == 0) {
        // console.log("addresslist==", res);
        // wx.showToast({
        //   title: '创建地址成功',
        //   icon:'none',
        // })
        wx.navigateBack({
          
        });
        // if(res.data.data.)
      }

    })

  },

  //获取地址列表
  getAddressList(res) {

    var param = { page: 1, page_size: 20 };

    addressList(param).then((res) => {
      
      
      var data = res.data;
      if (res.code == 0) {

        console.log("creatlist",res);
        this.setData({
          addressList: res.data.data,
        })

        // if(res.data.data.)
      }

    })
  },

})