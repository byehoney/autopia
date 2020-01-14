var common = require('../../../utils/common.js');
var publicFun = require('../../../utils/public.js');
var app = getApp();
Page({
  data: {
    user_address: {},
    group_detail:{},
    province_name_arr: ['请选择'],
    province_code_arr: [],
    province_index: 0,
    province_code: 0,
    city_name_arr: ['请选择'],
    city_code_arr: [],
    city_index: 0,
    city_code: 0,
    country_name_arr: ['请选择'],
    country_code_arr: [],
    country_index: 0,
    country_code: 0,
    community_name_arr: ['请选择'],
    community_index: 0,
    codenum:60,
    code: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: '申请团长',
    });
    wx.login({
      success: res => {
        that.data.code = res.code
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    var that = this;
    let addId = 0;
    publicFun.addressEditGO(that, addId);
    wx.hideLoading();
  },
  getTelcode:function(){
    let that = this;
    let phone_no = this.data.group_detail.tel || this.data.phoneNumber;
    if (!(/^1[34578]\d{9}$/.test(phone_no))) {
      
      return publicFun.warning('手机号码格式不正确', that);
    }
    let datas = {
      phone: phone_no
    };
    let url = 'app.php?c=community_leader&a=sentMsg';
    common.post(url,datas,function(res){
      that.setData({
        sendcodeStatus:true
      })
      let codenum = 60 ;
      let interTime = setInterval(function(){
        that.setData({codenum: codenum--});
        if (codenum == 0){
          codenum = 0;
          clearInterval(interTime);
          that.setData({sendcodeStatus:false})
        }
      },1000)
      console.log('验证码',res)
    },'')
  },
 
  getPhoneNumber: function (e) {
    console.log(e.detail,e.detail.errMsg)
    console.log(e.detail.iv) //包括敏感数据在内的完整用户信息的加密数据,需要解密
    console.log(e.detail.encryptedData) //加密算法的初始向量，解密需要用到
    let that = this;
    // 检查登录态是否过期
    wx.checkSession({
      success(res) {
        app.getPhoneNumber(e, that, that.data.code);
      },
      fail(err) {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success: res => {
            that.data.code = res.code
          }
        })
      }
    })
    
  } ,
  // 数据绑定
  bindName:function(e){
    this.setData({
      "group_detail.name": e.detail.value
    })
  },
  bindTel: function (e) {
    this.setData({
      "group_detail.tel": e.detail.value
    })
  },
  bindCode: function (e) {
    this.setData({
      "group_detail.code": e.detail.value
    })
  },
  bindHousenumber: function (e) {
    this.setData({
      "group_detail.housenumber": e.detail.value
    })
  },
  bindCommunityname: function (e) {
    this.setData({
      "group_detail.communityname": e.detail.value
    })
  },
  bindWxnumber: function (e) {
    this.setData({
      "group_detail.wxnumber": e.detail.value
    })
  },
  bindCareer: function (e) {
    this.setData({
      "group_detail.career": e.detail.value
    })
  },
  bindHouseholds: function (e) {
    this.setData({
      "group_detail.households": e.detail.value
    })
  },
  bindApplynotes: function (e) {
    this.setData({
      "group_detail.applynotes": e.detail.value
    })
  },
  // 地址
  pickerProvince: function (e, p_index) { //省份选择
    var that = this;
    publicFun.pickerProvince(that, e, p_index,true)
    
  },
  // 社区
  pickerCommunity: function (e,c_index) {
    var community_index = '';
    if (typeof c_index != "undefined") {
      community_index = c_index;
    } else {
      community_index = e.detail.value;
      this.setData({
        community_index: community_index
      });
    }
  },
  pickerCity: function (e, c_index) { //市级选择
    var that = this;
    publicFun.pickerCity(that, e, c_index,true)
  },

  pickerCountry: function (e) { //县区
    var that = this;
    publicFun.pickerCountry(that, e,true)
  },
  grouperSave:function(){
    let that = this;
    if (!this.data.group_detail.name ){
      return publicFun.warning('请填写收货人姓名', that);
    }
    let phone_no = this.data.group_detail.tel || this.data.phoneNumber;
    if (!(/^1[34578]\d{9}$/.test(phone_no))){
      let that = this;
      return publicFun.warning('手机号码格式不正确', that);
    }
    if (!(/^\d{4}$/.test(this.data.group_detail.code))) {
      let that = this;
      return publicFun.warning('验证码只有4位', that);
    }
    if (!this.data.group_detail.housenumber) {
      let that = this;
      return publicFun.warning('详细地址不能为空', that);
    }
    if (!this.data.community_name_arr[this.data.community_index].pigcms_id) {
      let that = this;
      return publicFun.warning('申请社区不能为空', that);
    }
    if (!this.data.group_detail.wxnumber) {
      let that = this;
      return publicFun.warning('微信号不能为空', that);
    }
    if (!this.data.group_detail.applynotes) {
      let that = this;
      return publicFun.warning('申请说明不能为空', that);
    }
    let latitude = wx.getStorageSync('latitude');
    let longitude = wx.getStorageSync('longitude');
    let params = {
      physical_id: this.data.community_name_arr[this.data.community_index].pigcms_id,
      user_name: this.data.group_detail.name,
      phone: this.data.group_detail.tel || this.data.phoneNumber,
      code: this.data.group_detail.code,
      province: this.data.province_code_arr[this.data.province_index],
      city: this.data.city_code_arr[this.data.city_index],
      county: this.data.country_code_arr[this.data.country_index] ,
      address: this.data.group_detail.housenumber,
      lat: latitude,
      lng: longitude,
      weixin_name: this.data.group_detail.wxnumber,
      profession: this.data.group_detail.career,
      person_num: this.data.group_detail.households,
      apply_description: this.data.group_detail.applynotes,
    }
    let url = "app.php?c=community_leader&a=apply_community_leader";
    common.post(url,params,function(res){
      console.log('团长申请',res)
      if(res.err_code == 0){
        wx.navigateTo({
          url: '/pages/groupbuying/applyform/applystatus',
        })
      }
    },'')
  },
})