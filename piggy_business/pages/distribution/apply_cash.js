// apply_cash.js
var common = require('../../utils/common.js');
var publicFun = require('../../utils/public.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showModalStatus: false, //模态框显示状态
        bankChecked: false, //选择银行标识
        bank_id: '',
        bank_card: '', //银行卡号
        bank_card_user: '', // 持卡人姓名
        opening_bank: '', //开户行名称
        bank_name: '', //发卡银行名字
        applyMoney: '', //申请提现金额
        storeData: '', //用户默认信息
        bankList: [], //获取银行卡列表
        applySuc: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        publicFun.setBarBgColor(app, that);// 设置导航条背景色
        publicFun.barTitle('申请提现');
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var that = this;
        let url = '/pages/distribution/apply_cash';
        publicFun.setUrl(url);
        common.post('app.php?c=drp_ucenter&a=withdrawal', '', initData, '');
        function initData(res) {
            if (res.err_code == 0) {
                that.setData({
                    'storeData': res.err_msg
                })
                if (that.data.storeData.store.bank_name != '') {
                    that.setData({
                        'bank_name': that.data.storeData.store.bank_name,
                        'bank_card': that.data.storeData.store.bank_card,
                        'bank_card_user': that.data.storeData.store.bank_card_user,
                        'opening_bank': that.data.storeData.store.opening_bank,
                        'bank_id': that.data.storeData.store.bank_id,
                    })
                }
            }
        }
    },

    //银行卡简单校验
    verifyBankCard: function(e) {
        var that = this;
        let bank_card = e.detail.value;
        let reg = /^([0-9]{16}|[0-9]{19})$/;
        if (bank_card == '' || bank_card == undefined) {
            //   publicFun.warning('请填写银行卡号', that);
            return false;
        }
        if (!reg.test(bank_card)) {
            //   publicFun.warning('请填写合法银行卡号', that);
            that.setData({
                bank_card: bank_card,
            });
            return false;
        }
        that.setData({
            bank_card: bank_card,
        });
    },
    //持卡人校验
    verifyBankCardUser: function (e) {
        var that = this;
        let a = e.detail.value;
        if (a == '' || a == undefined) {
            //   publicFun.warning('请填写持卡人姓名', that);
            return false;
        }
        that.setData({
            bank_card_user: a,
        });
        return true;
    },
    //开户行校验
    verifyOpeningBank: function (e) {
        var that = this;
        let a = e.detail.value;
        if (a == '' || a == undefined) {
            //   publicFun.warning('请填写开户行', that);
            return false;
        }
        that.setData({
            opening_bank: a,
        });
        return true;
    },
    //提现金额校验
    verifyApplyMoney: function (e) {
        var that = this;
        let a = e.detail.value;
        let regbank_card = /^\d+$/;
        if (a == '' || a == undefined) {
            //   publicFun.warning('请输入提现金额', that);
            return false;
        }
        if (!regbank_card.test(a)) {
            that.setData({
                applyMoney: '',
            });
            return false;
        }
        that.setData({
            applyMoney: a,
        });
    },
    //自定义弹窗控制
    modalControl: function (e) {
        var that = this;
        var currentStatu = e.currentTarget.dataset.statu;
        this.controlDeatail(currentStatu);
        if (currentStatu == 'open') {
            common.post('app.php?c=drp_ucenter&a=withdrawal_account', '', initData, '');
            function initData(res) {
                if (res.err_code == 0) {
                    that.setData({
                        'bankList': res.err_msg.bank_list
                    })
                    console.log(that.data.bankList)
                }
            }
        }
    },
    //弹窗事件
    controlDeatail: function (currentStatu) {
        /* 动画部分 */
        // 第1步：创建动画实例 
        var animation = wx.createAnimation({
            duration: 200, //动画时长 
            timingFunction: "linear", //线性 
            delay: 0 //0则不延迟 
        });

        // 第2步：这个动画实例赋给当前的动画实例 
        this.animation = animation;

        // 第3步：执行第一组动画 
        animation.opacity(0).rotateX(-100).step();

        // 第4步：导出动画对象赋给数据对象储存 
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画 
        setTimeout(function () {
        // 执行第二组动画 
            animation.opacity(1).rotateX(0).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
            this.setData({
                animationData: animation
            })

            //关闭 
            if (currentStatu == "close") {
                this.setData(
                {
                    showModalStatus: false
                }
                );
            }
        }.bind(this), 200)

        // 显示 
        if (currentStatu == "open") {
            this.setData({
                showModalStatus: true
            });
        }
    },
    //选择银行事件
    bankChoose: function(e) {
        var that = this;
        let bank_id = e.detail.value;
        let bank_list = that.data.bankList;
        for (let i = 0; i < bank_list.length; i++) {
            if (bank_list[i].bank_id == bank_id) {
                that.data.bank_name = bank_list[i].name
            }
        }
        that.setData({
            bank_id: bank_id,
            bank_name: that.data.bank_name
        })
    },
    //申请提现事件
    applyButtonEvent: function() {
        var that = this;
        var isCanApply = that.data.storeData.store.balance*1 > 0;
        if (isCanApply) {
            let regbank_card = /^([0-9]{16,20})$/;
            let regapply_money = /^\d+$/;
            if (that.data.bank_card == '' || that.data.bank_card == undefined) {
                publicFun.warning('请填写银行卡号', that);
                return false;
            }
            if (!regbank_card.test(that.data.bank_card)) {
                publicFun.warning('请填写合法银行卡号', that);
                return false;
            }
            if (that.data.bank_card_user == '' || that.data.bank_card_user == undefined) {
                publicFun.warning('请填写持卡人姓名', that);
                return false
            }
            if (that.data.opening_bank == '' || that.data.opening_bank == undefined) {
                publicFun.warning('请填写开户行', that);
                return false
            }
            if (that.data.bank_id == '' || that.data.bank_id == undefined || that.data.bank_id == 0) {
                publicFun.warning('请选择发卡银行', that);
                return false
            }
            if (that.data.applyMoney == '' || that.data.applyMoney == undefined) {
                publicFun.warning('请输入提现金额', that);
                return false
            }
            if (!regapply_money.test(that.data.applyMoney)) {
                publicFun.warning('请输入合法金额', that);
                return false;
            }
            if (that.data.applyMoney * 1 < that.data.storeData.store.withdrawal_min_amount * 1) {
                publicFun.warning('最低提现金额为' + that.data.storeData.store.withdrawal_min_amount + '元,请重新输入', that);
                return false;
            }
            if (that.data.applyMoney * 1 > that.data.storeData.store.balance * 1) {
                publicFun.warning('您最高可提现' + that.data.storeData.store.balance + '元，请重新输入', that);
                return false;
            }
            let postData = {};
            if (that.data.storeData.store.bank_id != 0 && that.data.storeData.store.bank_id != '' && that.data.storeData.store.bank_id != undefined) {
                // 已设置好提现账号
                postData = {
                    action: 'submit',
                    amount: that.data.applyMoney
                }
                applyCash(postData);
            } else {
                // 尚未设置提现账号
                postData = {
                    action: 'submit',
                    bank_id: that.data.bank_id,
                    bank_card: that.data.bank_card,
                    bank_card_user: that.data.bank_card_user,
                    opening_bank: that.data.opening_bank
                }
                common.post('app.php?c=drp_ucenter&a=withdrawal_account', postData, setBank, '');
            }
        } else {
            publicFun.warning('您当前没有可提现的佣金哦', that)
        }

        // 设置提现账号
        function setBank(res) {
            if (res.err_code == 0) {
                publicFun.warning('操作完成，正在提现', that)
                let postData = {
                    action: 'submit',
                    amount: that.data.applyMoney
                }
                applyCash(postData);
            }
        }
        
        // 申请提现
        function applyCash(postData) {
            console.log(postData)
            common.post('app.php?c=drp_ucenter&a=withdrawal', postData, callBackFun, '');
        }

        // 提现回调
        function callBackFun(res) {
            console.log(res)
            if (res.err_code == 0) {
                that.setData({
                    'applySuc': true
                })
            }
        }
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
})