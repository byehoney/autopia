// pages/withDraw/withDraw.js
import {billWith, withApply} from "../../utils/userapi.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isErr:false,//是否有错误
    isCan:false, //是否可以提现
    withdraw_able_fee:"", //可提现金额
    value:"",//提现金额
    curPage: 1,
    page_size: 20,
    list: [],
    total: 0,

    
    //提现失败原因
    reject:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      withdraw_able_fee: options.withdraw_able_fee,
    })
    this.getList();
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  jumpRule(){
    wx.navigateTo({
      url: '/pages/withDrawRule/withDrawRule',
    })
  },

  //提现列表
  getList(){

    let { curPage, page_size, list } = this.data;


    billWith(page_size, curPage).then(res => {
      if (res.code == 0) {
        console.log("billwith",res);
        this.setData({
          list: [...list, ...res.data.data],
          total: res.data.total
        })
      }
    })

  },
  //申请提现
  withApply(res){
    let param = { "amount":this.data.value };

    // console.log("ds+++");


    withApply(param).then(res => {
      if (res.code == 0) {
        //console.log("withApply", res);
        wx.navigateTo({
          url: '/pages/withDrawSucc/withDrawSucc',

        })

      }
    })

  },
  inputSome(res){

    console.log("input",res);
    if(res.detail.value>=100){
      this.setData({
        isCan: true,
        value:res.detail.value,
      })
    }else{
      this.setData({
        isCan: false,

      })
    }

  },
  lookReason(res){

    let item = res.currentTarget.dataset.item;

    console.log("look",res);
    this.setData({
      reject:item.reject,

    })
  },
  close(){
    this.setData({
      reject: "",
    })
  }

})