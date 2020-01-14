// pages/nameEdit/nameEdit.js

const app = getApp()
import { updateName } from "../../utils/userapi.js"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:""
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
  //修改用户信息
  updateName(e) {

    var param = { nickname: this.data.name };

    updateName(param).then((res) => {
      // console.log("updateName==", res);
      if(res.code==0){
        wx.navigateBack({
          
        });
      }


    })
  },

  bindKeyInput(e){

    
    this.setData({
        name:e.detail.value,
      }
    );
    console.log(e.detail.value);
  },
  save(e){
    if(this.data.name.length==0){

    }else{
      console.log(this.data.name);

      this.updateName(this.data.name)
    }
    
  }

})