let publicFun = require('../../utils/public.js');
const app = getApp()
let common = require('../../utils/common')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        topCates: [],
        currentSubCats: [],
        activeIndex: 0,
        searchKeyWord:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        publicFun.barTitle('商品分类');
        publicFun.setBarBgColor(app, this)// 设置导航条背景色
        common.post(`app.php?c=category&a=store_category`, '', 'getCategories', this)
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
    // onShareAppMessage: function () {
    //     return {
    //         title: this.data.shopHomeData.store.name,
    //         desc: '这里发现一个好店铺，速度围观',
    //         path: '/pages/index/index?store_id=' + getApp().globalData.store_id + "&share_uid=" + getApp().globalData.my_uid + "&shareType=2"
    //     }
    // },

    wxSearchInput() {
    },
    wxSearchFn() {

    },

    getCategories(data) {
        console.log(data)
        if (data.err_code != 0) {
            return wx.showToast({
                title: data.err_msg ? data.err_msg : '加载分类失败!',
                icon:'none'
            })
        }

      let categories = data.err_msg.cat_list;
      let ARR = []
      for (let property in categories) {
        ARR.push(categories[property])
      }
      // let topCates =  Object.keys(categories).map(key => categories[key]);
      let topCates = ARR;
        let currentSubCats = topCates[0] ? topCates[0] : []
        this.setData({
            topCates,
            currentSubCats
        })
    },

    /**
     * 切换顶级分类
     */
    switchTopCate(event) {
        console.log(event)
        let {tabindex: tabIndex} = event.currentTarget.dataset
        let {topCates, activeIndex} = this.data
        if (tabIndex === activeIndex) return false
        this.setData({
            currentSubCats: topCates[tabIndex],
            activeIndex: tabIndex
        })
    },

    /**
     * 点击分类跳转到详情页面
     */
    clickCate(event) {
        let {id} = event.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/product/productList?cid=${id}`
        })
    },

    /**
     * 搜索商品
     */
    bindSearchGoods() {
        let {searchKeyWord} = this.data
        if(!searchKeyWord)return wx.showToast({
          title: '请输入搜索关键词',
            icon:'none'
        })
        wx.navigateTo({
            url: `/pages/product/productList?keyword=${searchKeyWord}`
        })
    },

    inputKeyWord(event) {
        let {detail: {value, cursor}} = event
        this.setData({
            searchKeyWord:value.slice(0, 20)
        })
        if (cursor > 20) return value.slice(0, 20)
    },

    backToHome() {
        wx.redirectTo({
            url:'/pages/index/index'
        })
    }
})
