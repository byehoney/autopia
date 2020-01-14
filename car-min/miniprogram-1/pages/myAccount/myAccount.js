// pages/myAccount/myAccount.js
import { myAccount, balanceList } from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all_profit_fee: 0,//总收益
    settle_fee: 0,//待入账
    withdraw_able_fee: 0,//可提现
    withdraw_all_fee: 0,//已提现金额
    curPage:1,
    page_size:10,
    list:[],
    total:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    myAccount().then(res=>{
      if(res.code == 0){
        this.setData({
          all_profit_fee: res.data.all_profit_fee,
          settle_fee: res.data.settle_fee,
          withdraw_able_fee: res.data.withdraw_able_fee,
          withdraw_all_fee: res.data.withdraw_all_fee,
        })
      }
    });
    this.getData();
  },
  getData(){
    let { curPage, page_size,list} = this.data;
    balanceList(page_size,curPage).then(res=>{
      if(res.code == 0){
        this.setData({
          list: [...list,...res.data.data],
          total:res.data.total
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let {curPage , page_size ,total} = this.data;
    if(curPage>=total/page_size){
      wx.showToast({
        title: '~已经到底了',
        icon:'none'
      })
      return;
    }
    this.setData({
      curPage:++curPage
    },()=>{
      this.getData();
    })
  },
  jumpWithDraw(){
    wx.navigateTo({
      url: '/pages/withDraw/withDraw?withdraw_able_fee='+this.data.withdraw_able_fee,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})