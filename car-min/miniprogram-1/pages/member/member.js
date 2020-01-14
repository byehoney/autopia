//member.js
//获取应用实例
const app = getApp()

import { vipImageList } from "../../utils/api.js"


Page({
  data: {
    is_vip:0,

    listRule: ["车主黑卡会员可推荐新会员，每推荐1名车主黑卡可获得100元奖励；", "享受推荐车主销售返利10%奖励；", "车主黑卡会员可推荐新会员，每推荐1名车主黑卡可获得100元奖励；", "车主黑卡会员可推荐新会员，每推荐1名车主黑卡可获得100元奖励；", "享受推荐车主销售返利10%奖励；","车主黑卡会员可推荐新会员，每推荐1名车主黑卡可获得100元奖励；"],
    select:0,
    list:[],
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    let user = wx.getStorageSync("user");
    this.setData({
      // is_vip: app.globalData.is_vip,
      is_vip:user.is_vip,
    });

    console.log("is_vip",this.data.is_vip);

    if(this.data.is_vip){

    }else{
      this.getCommonUserData();
    }
    // if(this.data.is_vip){
    //   wx.setNavigationBarTitle({
    //     title: "黑卡会员",
    //     frontColor:""
    //   });

    //   wx.setNavigationBarColor({
    //     frontColor: "#ffffff",/*标题颜色，这里貌似仅支持 #ffffff 和 #000000 */
    //     backgroundColor: "1c1b1c",/*背景色 十六进制即可*/
    //     animation: {/*动画*/
    //       duration: 400,
    //       timingFunc: 'easeIn'
    //     }
    //   })

    // }


  },

  specialPower(res){

    console.log(res.currentTarget.dataset);
  },
  //服务权益
  serviceLegal(res){
    console.log(res.currentTarget.dataset);

  },
  inviteFriend(res){

    console.log("invite")
  },

  //阅读会员服务协议
  lookRule(){
     console.log('look');

  },
  //是否同意协议
  selectRule(res){
    this.setData({
      select: !this.data.select,
    })
  },
  openVip(res){
    if(this.data.select){//已同意协议
      console.log('open');

      wx.navigateTo({
        url: '/pages/vipGift/vipGift'
      })

    }else{
      wx.showToast({
        title: '请阅读并勾选协议～',
        "icon":"none"
      })
    }
 
  },
  getCommonUserData(){
    let param = {
      page: this.data.curPage,
      page_size: this.data.page_size,
    }
    let list = this.data.list;

    vipImageList().then(res => {
      if (res.code == 0) {
        console.log("res", res);
        this.setData({
          list: res.data,
        })
      }
    })
  },

})
