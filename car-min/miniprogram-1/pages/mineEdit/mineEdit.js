
const app = getApp()
const apiUrl = "https://tsapi.chetuobang.com"; //服务器api地址
// const apiUrl = "https://sapi.chetuobang.com"; //服务器api地址
import { userMsg } from "../../utils/userapi.js"
import { updateHead } from "../../utils/userapi.js"
import { changeGender } from "../../utils/userapi.js"
import { changeBirthDay } from "../../utils/userapi.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: "xxx",
    headUrl: "",
    headparam:"",
    gender: "",
    // birthday: "",
    mobile: "",
    userDate: "请选择出生日期",

    userMsg: {},
    array:["男","女"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getUserOrder();//每次返回刷新数据
    console.log("edit--show");
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

  // 获取用户信息
  getUserOrder() {


    userMsg().then((res) => {


      console.log("userInfo==", res);

      // 判断绑定邀请码
      if (res.data.invite_code.length == 0 && app.globalData.inviteCode) {
        // 执行绑定邀请码操作
        // this.bindCode()
      }

      let gender;
      if (res.data.identity==0){
        gender = "男";
      }else{
        gender = "女";
      }




      this.setData({
        userMsg: res.data,
        invite_code: res.data.invite_code,
        isVip: res.data.is_vip,
    
        account: res.data.nickname,
        headUrl: res.data.head_img,
        mobile: res.data.mobile,
        userDate: res.data.birthday,
        gender:gender,

      })

      if ((res.data.birthday == null) | (res.data.birthday == "null") | (res.data.birthday == undefined)) {
        this.setData({
          userDate:"请选择出生日期",
        })
      }


      wx.setStorageSync('userMsg', res.data);
      app.globalData.isVip = res.data.is_vip;
      app.globalData.userMsg = res.data;
      console.log("asdd", app.globalData.isVip);
    })
  },

  

  //事件处理函数
  bindViewTap: function () {
    console.log("?????");
    wx.navigateTo({
      url: '../nameEdit/nameEdit'
    })
  },
  addHeadUrl(e){
    console.log(this.data.headUrl);

    var that = this;
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      success(res) {
        console.log(res.tapIndex)
        let sourceType = 'camera'
        if (res.tapIndex == 0) {
          sourceType = 'camera'
        } else if (res.tapIndex == 1) {
          sourceType = 'album'
        }
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: [sourceType],
          success: function (res) {
   
            that.setData({
              headUrl: res.tempFilePaths[0],
            });
            that.uploadImg(res.tempFilePaths[0]);
          },
        })
      },
    })

  },
  //上传图片
  uploadImg(e) {

    var that = this;
    wx.uploadFile({
      url: apiUrl+"/api/v1/upload",
      filePath: this.data.headUrl,
      name: 'file',
      formData:{
        
      },
      header: {
        "Content-Type": "application/json",//设置后端需要的常用的格式就好，特殊情况调用的时候单独设置
        "Authorization": wx.getStorageSync('token'),
        "Platform": "CTB_SHOP_MINIPRO",
        "ver": "1001"
      },
      success(res){

        var data = JSON.parse(res.data);
        console.log("data",data.data);

        that.setData({
          headUrl: data.data.complete_url,
          headparam: data.data.image_url,
        });

        that.updateHead(data.data.image_url);

      }

    })

  },
  //修改头像图片
  updateHead(e){

    console.log("updateStart==", e);
    var param = { head_img: this.data.headparam };

    updateHead(param).then((res) => {
      console.log("updateHead==", res);
      if (res.code == 0) {
       wx.showToast({
         title: '更新头像成功',
         icon:"none",

       })
      }
    })

  },

  addGender(){
    console.log("1");
    
  },
  bindKeyInput(e){
    this.setData({
      mobile:e.detail.value,
    })
    console.log(this.data.mobile);
  },

  //出生日期选择
  DateChange: function (e) {

    console.log("dateChange==");
    let thas = this;

    thas.setData({

      userDate: e.detail.value

    });

    let param = {
      birthday:e.detail.value,
    }
    this.changeBirthDay(param);
  },

  //改变性别
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    let gender;
    if (e.detail.value == 0) {//男
      gender="男";
    } else {
      gender="女";
    }
    this.setData({
      index: e.detail.value,
      gender:gender,
    })

    let param = {
      identity:e.detail.value,
    }
    this.changeGender(param);
  },
  //修改性别接口
  changeGender(res){

   
    var param = { identity: res.identity};

    changeGender(param).then((res) => {
      console.log("changegender==", res);
      if (res.code == 0) {
        wx.showToast({
          title: '更新性别成功',
          icon: "none",

        })
      }
    })
  },
  //修改生日接口
  changeBirthDay(res){

    var param = { birthday: res.birthday};

    changeBirthDay(param).then((res) => {

      console.log("changeBirth==", res);
      if (res.code == 0) {

        wx.showToast({
          title: '修改生日成功',
          icon: "none",

        })
      }
    })
  },


})