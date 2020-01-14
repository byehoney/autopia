//classify.js
//获取应用实例
const app = getApp()

import { classifyGood } from "../../utils/api.js"

Page({
  data: {
    leftIndex:0,
    title:"",
    typeID:"",
    typeList: [
    ],
    goodsList: [
    ],

  },

  onLoad: function () {

    this.getGoodCatagory();

  },
  //获取商品一级分类
  getGoodCatagory(e) {

    var param = { fid: 0 };

    //当不传fid(或fid=0)时为获取一级分类
    classifyGood(param).then((res) => {
      console.log("calssify==", res);
      if (res.code == 0) {
        this.setData({
          typeList : res.data,
          title: res.data[0].cate_name,
          typeID:res.data[0].id,
        });
        this.getSubCatagory(res.data[0].id);

      }

    })
  },
  //获取商品二级分类
  getSubCatagory(e) {

    var param = { fid: e };

    //当不传fid(或fid=0)时为获取一级分类
    classifyGood(param).then((res) => {
      //console.log("subgoodlist==", res);
      if (res.code == 0) {
        this.setData({
          goodsList: res.data,
        });
      }

    })
  },

  //跳转到搜索页面
  inputChange: function () {
    wx.navigateTo({
      url: '../searchList/searchList?type=create'
    })
  },
  typeChange(e){
    // console.log(e);
    console.log('type',e.currentTarget.dataset);
    this.setData({
      leftIndex: e.currentTarget.dataset.idx,
      title: e.currentTarget.dataset.item.cate_name,
      typeID: e.currentTarget.dataset.item.id,
    })
    var fid = e.currentTarget.dataset.item.id;
    this.getSubCatagory(fid);
    
  },
  goodsClick(e){
    console.log(e.currentTarget.dataset.idx);
    var index = e.currentTarget.dataset.idx;

    // var params = {
    //   "id": this.data.goodsList[index].id,
    //   "title":this.data.title,
    // }
    wx.navigateTo({
      url: '../goodList/goodList?id=' + this.data.goodsList[index].id + '&title=' + this.data.title + '&typeID=' + this.data.typeID + "&idx=" + index,
    })

  }

})
