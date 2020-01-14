// pages/goodDetail/goodDetail.js
const app = getApp()
import { shopDetail } from "../../utils/api.js"
import { getBindMobile } from "../../utils/userapi.js"
import { wxcode } from "../../utils/userapi.js"
import { goodsListAPI } from "../../utils/api.js"

//1.2 导入文件
const WxParse = require('../../wxParse/wxParse.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {

    userMsg:{},
    indicatorDots:true,
    autoplay:true,

    //分享时制作图片
    painting: {
    },
    shareImage:"",
    is_vip:false,
    shareSelect:false,
    drawSelect:false,
    styleSelect:false,

    goodCount:1,
    goodInfo:{},


    higherPrice:"",//最高价
    lowPrice:"", //最低价
    returnMoney: "",//返还
    economizeMoney:"",//节约
    invite_user_back_price:"",//邀请会员返现
    stock:"",//库存
    vipPrice:"",//vip价格

    sku_id:"",
    //1.1文本编辑内容
    content:{},
    readOnly:true,


    //sku样式
    sku_list:[],
    //种类 样式选择
    specs_list: [
    ],

    //个人选择样式记录
    historySpecs:[],

    //最终匹配的sku
    sku_item:{},
    styleImg:"",

    //判断是否多规格
    // 商品规格类型 0 多规格 1 单规格
    specs_type:"",

    //服务承诺
    service_promise:[],

    curPage: 1,
    page_size: 2,
    list: [],
    randomList:[],
    cate_id:"",//商品二级分类ID
    codeMsg:"https://file.chetuobang.com/hwmc/wxcode/2020011359888098.png",
    title:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
 
    console.log("detail==",options);

    


    let userInfo = wx.getStorageSync("userMsg");
    let user = wx.getStorageSync("user");
    if(user.is_vip=='1'){
      this.wxcode();
    }else{
      
    }
  
    this.setData({
      is_vip:user.is_vip,
      userMsg: userInfo,

    })
    console.log("userMsg",this.data.userMsg);
    let mobile = wx.getStorageSync("mobile");
    this.setData({
      mobile: mobile,
    })

    //  console.log("detailoptions",options);
    
    if (options.type == "immediate"){
      this.styleClick();
    }
    this.goodDetail(options);

    for(var obj in this.data.specs_list){

      //设置列标记
      this.data.specs_list[obj].index = 0;
      // this.setData({
        
      // });
    }
    console.log("specs_list", this.data.specs_list);

    this.setData({
      specs_list:this.data.specs_list,
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
  onShareAppMessage: function (res) {


  

    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   // console.log(res.target)
    // }
    return {
      title: this.data.title,
      // path: '/pages/goodDetail/goodDetail'
    }


  },
  goodDetail(res){
    // var param = { id:res.id};


    var param = { id: res.id};
    shopDetail(param).then((res) => {
      console.log("goodDetail==", res);
      if (res.code == 0) {
        this.setData({
          goodInfo:res.data,
          content:res.data.content,//1.3获取对应内容
          specs_list: res.data.specs_list,
          sku_list: res.data.sku_list,
          service_promise: res.data.service_promise,
          specs_type:res.data.specs_type,
          cate_id: res.data.category_id_two,
          title: res.data.category_two_name,
        })
        

        //二级分类名称
        wx.setNavigationBarTitle({
          title: res.data.category_two_name,

        })

        app.globalData.cate_id = res.data.category_id_two,
        this.getGoodList(res.data.category_id_two);
        if (this.data.goodInfo.picture.length<=1){
          this.setData({
            indicatorDots:false,
          })
        }

        // 商品规格类型 0 多规格 1 单规格
        if(res.data.specs_type==1){//单规格不选择样式。
          this.setData({
            specs_list:[],
            sku_item:res.data.sku_list[0],
            
          })
        }else{

        }

        console.log("skuitem",this.data.sku_item);
        //取默认价格
        let skuItem = this.data.sku_list[0];
        this.setData({
          economizeMoney: skuItem.economize_price,
          returnMoney: skuItem.cash_back_price,
          // stock:skuItem.stock,
          sku_item:skuItem,
          vipPrice: skuItem.vip_price,
          higherPrice: skuItem.ordinary_price,
          invite_user_back_price: skuItem.invite_user_back_price,
          sku_id:skuItem.id,
        })


        /**
        * WxParse.wxParse(bindName , type, data, target,imagePadding)
        * 1.bindName绑定的数据名(必填)
        * 2.type可以为html或者md(必填)
        * 3.data为传入的具体数据(必填)
        * 4.target为Page对象,一般为this(必填)
        * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        */
  
        WxParse.wxParse('article','html',res.data.content,this,5);       
        if(this.data.goodInfo.picture.length>=1){
          this.setData({
            styleImg: this.data.goodInfo.picture[0],
          })

        }

      }


    })
  },
  
  //选择绘图
  eventDraw() {

    this.setData({
      drawSelect: true,
      shareSelect: false,
    });
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true,
      
    })
    this.setData({
      painting: {
        width: 375,
        height: 555,
        clear: true,
        views: [
          {//背景图片
            type: 'image',
            url: '/images/drawBG.png',
            top: 0,
            left: 0,
            width: 375,
            height: 555
          },
          
          {//商品图片
            type: 'image',
            url:this.data.goodInfo.picture[0],
            top: 50,
            left: 30,
            width: 315,
            height: 315,
            mode:"aspectFill"
          },
          {//二维码图片
            type: 'image',
            url:this.data.codeMsg.url,
            top: 423,
            left: 255,
            width: 88,
            height: 88
          },
          {//商品名称
            type: 'text',
            content: this.data.goodInfo.goods_name,
            fontSize: 16,
            lineHeight: 21,
            color: '#383549',
            textAlign: 'left',
            top: 486,
            left: 30,
            width: 177,
            MaxLineNumber: 2,
            breakWord: true,
            bolder: true
          },
          {//现在价格
            type: 'text',
            content:'¥'+this.data.sku_item.ordinary_price,
            fontSize: 19,
            color: '#E62004',
            textAlign: 'left',
            top: 405,
            left: 30,
            bolder: true
          },
          {//原价
            type: 'text',
            content: '原价:' + this.data.sku_item.market_price,
            fontSize: 13,
            color: '#7E7E8B',
            textAlign: 'left',
            top: 409,
            left: 150,
            textDecoration: 'line-through'
          },
          {//vip logo
            type: 'image',
            url: '/images/v@2x.png',
            top: 445,
            left: 30,
            width: 20.7,
            height: 17.1,
          },
          {//再返价格
            type: 'text',
            content: 'vip:¥' + this.data.sku_item.vip_price + "再返" + this.data.sku_item.cash_back_price, 
            fontSize: 14,
            color: '#333333',
            textAlign: 'left',
            top: 449,
            left: 60,
            // textDecoration: 'line-through'
          },
          
        ]
      },
    })
  },
  //保存到本地相册
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
    }
  },


  //分享弹窗选择
  shareSelect(e){
    this.setData({
      shareSelect:true,
      drawSelect:false,
    })
  },
  cancelShare(e){
    this.setData({
      shareSelect: false,
      drawSelect:false,
      styleSelect:false,
    })

  },
  //开通vip
  openVip(e){
    console.log("openVip");
  },
  //展示标签
  labelClick(e){
    console.log("label");
  },

  //选择样式弹窗
  styleClick(e){
    
    this.setData({
      styleSelect:true,
    });

    console.log("sytle");
  },

  homeClick(e){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  //详情页面立即购买
  immediatePurchase(e){
    
    // if (this.data.historySpecs.length < this.data.specs_list.length){
      
      //弹出选择样式弹窗、以便更改购买数量
      this.styleClick();


    // }else{
    //   console.log("purchse");
    //   wx.navigateTo({
    //     url: '../submitOrder/submitOrder?goods_id=' + this.data.goodInfo.id + "&quantity=" + this.data.goodCount + "&sku_id=" + this.data.sku_item.id,
    //   });
    // }
    
  },

  //阻断滚动穿透事件
  myCatchTouch: function () {
    // console.log('stop user scroll it!');
    return;
  },
  minusClick(e){
    console.log("--");
    var count = this.data.goodCount;
    if(count>0){
      this.setData({
        goodCount:count-1,
      })
    }

  },
  addClick(e){
    console.log("++");
    var count = this.data.goodCount;
   
    this.setData({
      goodCount: count + 1,
    })
    

  },

  //选择某个样式
  selectStyle(e){
    console.log('ddSelcte',e);
    //row 第一层数组下标  idx 第二层数组下标
    let row = e.currentTarget.dataset.row;
    this.data.specs_list[row].index = e.currentTarget.dataset.idx;
    this.setData({
      specs_list:this.data.specs_list,
    });

    var item = e.currentTarget.dataset.item;
   
   //取出历史选择记录
    var array = this.data.historySpecs;
    //在指定位置添加元素,第一个参数指定位置,第二个参数指定要删除的元素,如果为0,则追加 （如果为0则会一直追加数组有bug）
    array.splice(row, 1, item);
    //记录主动选择样式表 
    this.setData({
      historySpecs:array,
    })
    
    //判断是否选择完样式并进行计算
    if (this.data.historySpecs.length < this.data.specs_list.length) {//样式没有选择完全
      
    } else {

      let newArr = new Array;

      for (var idx in this.data.historySpecs) {

        let item = this.data.historySpecs[idx];
        let sArr = new Array;
        sArr.push(item.specs_id);
        sArr.push(item.id);
        let sStr = sArr.join(':');
        newArr.push(sStr);
      }

      let endSpaces = newArr.join(';');

      console.log("endAPSec", endSpaces);

      for (var idx in this.data.sku_list) {
        var item = this.data.sku_list[idx];
        if (item.properties == endSpaces) {

          this.setData({
            sku_item: item,
          })
          break;
        }

      }

    }

    console.log("sku-item",this.data.sku_item);
    this.setData({
      sku_id:this.data.sku_item.id,
    })

  },

  //样式选择表完成后 立即购买
  purchseImmediate(e){

    console.log("array", this.data.historySpecs);
    if(this.data.historySpecs.length<this.data.specs_list.length)    {//样式没有选择完全

       wx.showToast({
         title: '还有样式没有选择哦',
         icon:"none",
       }); 
       return;
    }else{
      
      console.log("样式选择表完成后立即购买");
      wx.navigateTo({
        url: '../submitOrder/submitOrder?goods_id=' + this.data.goodInfo.id + "&quantity=" + this.data.goodCount + "&sku_id=" + this.data.sku_id,
      });
    }
    
    console.log("style's-purchase");


  },


  //获取绑定手机号
  getPhoneNumber(e) {

    let that = this;
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.log("codeSuccess");

        wx.login({
          success: res => {
            // // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // userLogin(res.code).then((data) => {
            //   resolve(data)
            // })

            console.log("sspreCode==", app.globalData.code);
            app.globalData.code = res.code

            console.log("ssnowCode==", app.globalData.code);
            // 获取code

            let param = {
              "code": res.code,
              "iv": e.detail.iv,
              "encryptedData": e.detail.encryptedData
            }
            that.getBindMobile(param);
      
          }
        })


      },
      fail: function () {

        console.log("codeFail");
        //登录态过期
        wx.login({
          success: res => {
            // // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // userLogin(res.code).then((data) => {
            //   resolve(data)
            // })

            console.log("ffpreCode==",app.globalData.code);
            app.globalData.code = res.code

            console.log("ffnowCode==", res.code);
            // 获取code

            //let code = app.globalData.code;

            let param = {
              "code": res.code,
              "iv": e.detail.iv,
              "encryptedData": e.detail.encryptedData
            }
            that.getBindMobile(param);
      
          }
        })
      }
    })





  },
//获取手机号码
  getBindMobile(res) {
    let that = this;
    var param = { code: res.code, encrypte_data: res.encryptedData, iv: res.iv };
    getBindMobile(param).then((res) => {

      var data = res.data;
      if (res.code == 0) {
        wx.setStorageSync("mobile", res.data.mobile);

        that.setData({
          mobile:res.data.mobile,
        })
        
        wx.showToast({
          title: '获取手机号成功',
          "icon":"none"
        })

      }

    })
  },

  //获取分类商品列表
  getGoodList(res) {


    // let cate_id = wx.getStorageSync("cate_id");

    let that = this;
    var param = { cate_id: res, page: 1, goods_name: '', page_size:20};

    goodsListAPI(param).then((res) => {
      // console.log("goodlist==", res.data);
      var data = res.data;
      if (res.code == 0) {

        that.setData({
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
        if(mark<2){

        }else{
          mark = 2
        }
        
        //取随机本类型商品
        for (let idx = 0; idx < mark; idx++) {
          //let index = Math.floor(Math.random() * res.data.data.length);
          let index = Arr[idx];

          console.log('idx', index);
          that.data.randomList.push(res.data.data[index]);
        }

        that.setData({
          randomList:that.data.randomList,
        })

      }

    })



  },
  
  //点击推荐商品列表
  itemClick(res){
    console.log('item', res.currentTarget.dataset.item);

    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + res.currentTarget.dataset.item.id
    })
  },

  //获取二维码
  wxcode(res){
    
    // var pages = getCurrentPages(); //获取加载的页面
    // var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    // var url = "/"+currentPage.route; //当前页面url

    // console.log("pageUrl",url);
    let param = {
      page_url:"",
    }
    wxcode(param).then((res) => {
      console.log("wx.code==", res.data);
      var data = res.data;
      if (res.code == 0) {

        this.setData({
          codeMsg:res.data,
        })

      }

    })
  }
 
  

})