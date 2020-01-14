/***@author wangmu***/
var publicFun = require('../../../utils/public.js');
var common = require('../../../utils/common.js');
var app = getApp();
Page({
    data: {
        index: 0,
        numIndex: 0,
        numList: '',
        postage: true,
        imgList: [],
        methodList:[
          { type: 1, name:"退货退款"},
          { type: 2, name: "仅退款不退货"}
        ],
        method:1,
        showMessage: false // 查看留言信息
    },
    onLoad: function(e) { // 页面渲染完成
        var that = this;
        publicFun.setBarBgColor(app, that);// 设置导航条背景色
        this.setData({
            id: e.id,
            order_no: e.order
        });
    },
    onReady: function(e) {
        var that = this;
        common.post('app.php?c=return&a=apply&pigcms_id=' + this.data.id + '&order_no=' + this.data.order_no, '', "returnData", that);
    },

    returnData: function(result) {
        if (result.err_code == 0) {
            let list = [];
            for (var i in result.err_msg.type_arr) {
                list.push(result.err_msg.type_arr[i].name)
            }

            let product_list = [];
            for (let i = 0; i < result.err_msg.product_list.length; i++) {
                if (result.err_msg.product_list[i].product_id == result.err_msg.order.product_id) {
                    result.err_msg.product_list = result.err_msg.product_list.splice(i, 1);
                }
            }
            result.err_msg.orderInfo = true;
            this.setData({
                returnData: result.err_msg,
                type_arr: list
            });
        };
        let num = this.data.returnData.order.pro_num - this.data.returnData.return_number;
        // let num = 10;
        this.setData({
                pro_num: num
            })
        // console.log(this.data.pro_num);
        let numList = [];
        if (num == 1) {
            return
        }
        for (var i = 0; i < num; i++) {
            numList[i] = num - i;
        }
        this.setData({
            numList: numList
        })

    },
   bindPickerReturnType({detail}) {
     this.setData({
       method:this.data.methodList[detail.value]['type']
     })
   },
    bindPickerNum: function(e) { //选择退货数量
        let value = e.detail.value
        this.setData({
            numIndex: value,
            pro_num: this.data.numList[value]
        })
    },
    bindPickerReason: function(e) { //选择退货原因
        this.setData({
            index: e.detail.value
        })
    },
    addImg: function(e) { //图片上传
        var that = this;
        publicFun.addImg(that)
    },
    phoneNumber: function(e) { //手机号验证
        var that = this;
        let num = e.detail.value;
        publicFun.verifyNumber(that, num)
    },
    returnExplain: function(e) { //退货说明验证
        var that = this;
        let explain = e.detail.value;
        publicFun.returnExplain(that, explain)
    },
    applyRefund: function(e) { //提交申请退货
        var that = this;
        let num = that.data.phoneNumber;
        let explain = that.data.returnExplain;
        let imgList = [];
        imgList = that.data.imgList;
        imgList = Object.keys(imgList).map(function(k) {
            return imgList[k]
        });
        let flag = (publicFun.verifyNumber(that, num) && publicFun.returnExplain(that, explain));

        if (!flag) {
            return
        }

        let data = {
            order_no: that.data.order_no,
            pigcms_id: that.data.id,
            type: that.data.returnData.type_arr[that.data.index].type_id,
            phone: num,
            content: explain,
            images: imgList,
            number: that.data.pro_num,
            method:that.data.method
        }
        common.post('app.php?c=return&a=save', data, applyRefund, '');

        function applyRefund(result) {
            if (result.err_code == 0) {
                publicFun.promptMsg(result.err_msg.message, '返回', '', applyRefund);

                function applyRefund() {
                    wx.redirectTo({ url: '/pages/USERS/pages/user/myServer/index?rights=0' });
                    //  wx.navigateTo({ url: '/pages/user/order/returnCompletion?id=' + that.data.id + '&order=' + that.data.order_no+'&returnid='+ result.err_msg.return_id});

                }

            };
        }
    },
    showMessage: function (e) { //查看留言
        var that = this;
        that.setData({
            'showMessage': true
        });
    },
    showPayment: function (e) { //查看订单(留言弹窗内)
        var that = this;
        that.setData({
            'showMessage': false
        })
    }


})
