import { get, post, upload } from '@/axios/http.js';
import store from 'store/index';
// let defaulParams = {};
// if(store.getters['login/token']){
//     defaulParams = {
//         token:store.getters['login/token'],
//         userId:store.getters['login/userId'],
//         corpCode:store.getters['login/corpCode'],
//         companyId:store.getters['login/companyId'],
//         userRole:store.getters['login/userRole'],
//     }
// }
// alert(JSON.stringify(defaulParams))
// function login(params) {
//     return post('/mock/5cb48c7ed491cd741c54456f/base/login', params);
// }
function uploadImage(params, handle) {
    return upload('https://up-z0.qiniup.com', params, handle)
}

function getUploadToken(params) {//获取图片上传token
    return post('/qiniu/get/token.do', params)
}
function getYzCode(params) {//获取验证码
    return post('/mobile/sendcode.do', params)
}
function checkYzCode(params) {//验证验证码
    return post('/mobile/check/code.do', params)
}
function checkExist(params) {//验证手机号
    return post('/login/check/mobile.do', params)
}

function checkExistClient(params) {//验证门店
    return post('/register/check/clientname.do', params)
}

function checkForget(params) {//验证忘记密码手机号
    return post('/mobile/check/legitimate.do', params)
}
function getBannerVideo(params){//获取首页banner 和 视频
    return post('/index/get/operation.do', params)  
}
function login(params) {//用户登陆
    return post('/user/login.do', params)
}
function updateUserInfo(params){//更新用户信息  type: 1 修改头像  2 修改手机  3 修改用户名
    // let data = {...defaulParams,...params}
    return post('/user/update/info.do', params)
}
function forgetPass(params){//忘记密码  修改
    // let data = {...defaulParams,...params}
    return post('/user/update/password.do', params)
}
function getActorList(params) {//获取注册角色列表
    return get('/userrole/get/list.do', params)
}
function getCompanyList(params) {//获取注册角色列表
    return get('/register/sycompany/list.do', params)
}
function getFactoryList(params) {//获取注册角色列表
    return get('/register/cjcompany/list.do', params)
}
function getPartList(params) {//获取注册角色列表
    return get('/register/cjcompany/bument.do', params)
}
function getRegShopList(params) {//获取注册门店列表
    return post('/client/list/regioncode.do', params)
}
function checkTcode(params) {//校验推荐码是否正确
    return post('/code/check/status.do', params)
}
function getPropertyList(params) {//获取注册经营性质
    return get('/properties/get/list.do', params)
}
function getIntelList(params) {//获取注册资质信息
    return post('/qualification/get/list.do', params)
}
function getRangeList(params) {//获取注册经营范围
    return get('/scope/get/list.do', params)
}
function getCityList(params) {//地区选择获取数据
    return post('/city/all/list.do', params)
}
function joinRegister(params){//注册  加入门店类型
    return post('/register/add/client.do', params)
}
function creatRegister(params){//注册  创建门店类型
    return post('/register/create/client.do', params)
}
function getAddrList(params){//用户信息  获取收货地址列表
    // let data = {...defaulParams,...params}
    return post('/user/address/list.do', params)
}
function addNewAddr(params){//用户信息  新增收货地址
    // let data = {...defaulParams,...params}
    return post('/user/add/address.do', params)
}
function upDateAddr(params){//收货地址  更新收货地址  type:0 修改   1 删除
    // let data = {...defaulParams,...params}
    return post('/user/update/address.do', params)
}
function setDefaultAddr(params){//收货地址  设置默认
    // let data = {...defaulParams,...params}
    return post('/user/moren/address.do', params)
}
function getMyInfo(params){//我的页面  获取用户信息
    // let data = {...defaulParams,...params}
    return post('/user/get/info.do', params)
}
function getCompanyInfo(params){//我的页面  获取门店详细信息
    // let data = {...defaulParams,...params}
    return post('/client/get/info.do', params)
}
function addRelativeCompany(params){//我的页面  添加关联门店  
    // let data = {...defaulParams,...params}
    return post('/user/add/client.do', params)
}
function addRelativeCreate(params){//我的页面  添加关联门店  创建新门店
    // let data = {...defaulParams,...params}
    return post('/user/create/client.do', params)
}
function getChooseList(params){//选品列表
    // let data = {...defaulParams,...params}
    return post('/product/get/list.do', params)
}
function getChooseDetail(params){  //选品商品详情
    return post('/product/get/info.do',params)
}

function getMoreKindsMain(params){//获取更多分类里 大类
    return post('/search/product/select.do', params)
}
function getMoreKindsBranch(params){//获取更多分类里 小类
    return post('/search/select/detail.do', params)
}

function getOrdersList(params){//获取订单列表   type  0 全部 1 待发货 2 待收货 3 待评价 4 退货
    return post('/order/get/type.do', params)
}

function getOrderDetail(params){//获取订单详情  
    return post('/order/get/info.do', params)
}

function evaForOrder(params){//订单评价
    return post('/order/add/comment.do', params)
}
function getEvaList(params){//获取订单评价列表
    return post('/order/get/comment.do', params)
}
function getOrderStatuList(params){//根据订单状态获取对应列表
    return post('/order/pruduct/orderstatus.do', params)
}

function getViewLogist(params){//获取物流信息
    return post('/order/get/express.do', params)
}

function backGOods(params){//退货
    return post('order/status/tuihuo.do', params)
}

function reciveGOods(params){//收货
    return post('/order/status/shouhuo.do', params)
}

function getActivityInfo(params){//首页 是否显示套餐 买赠活动
    return post('/index/mztc/status.do', params)
}

function getMyUserOrderNum(params){//获取我的页面 各种订单状态数
    return post('/user/order/num.do', params)
}


function switchCompanyList(params){//首页切换门店 门店数据
    return post('/client/list/usercode.do', params)
}

function getSuitList(params){//获取套餐列表
    return post('/index/get/taocan.do', params)
}

function getSuitDetail(params){//获取套餐详情
    return post('/product/setmeal/detail.do', params)
}

function getBestGoodsList(params){//获取精品买赠列表
    return post('/index/get/maiz.do', params)
}

function getPub(params){//获取门店公告
    return post('/client/get/gongg.do', params)
}

function addToCar(params){//添加到购物车
    return post('/product/add/cart.do', params)
}

function buyCheckNum(params){//立即购买前购买数量验证
    return post('/product/check/productnum.do', params)
}
function getGiftList(params){//获取赠品列表
    return post('/product/get/zpin.do', params)
}
function getCartNum(params){//获取购物车数量
    return post('/purchase/get/num.do', params)
}
function recordCartNum(params){//记录购物车商品加减数量
    return post('/cache/purchase/list.do', params)
}
function delFromCar(params){//从购物车删除
    return post('/product/update/cart.do', params)
}
function getCarList(params){//获取购物车列表参数
    return post('/product/get/cartlist.do', params)
}
function getCarTip(params){//获取购物车金额达到标准提示
    return post('/product/cart/title.do', params)
}

function settleAcount(params){//购物车结算
    return post('/settlement/order.do', params)
}
function confirmGetInfo(params){//确认订单获取订单信息
    return post('/order/queren/info.do', params)
}

function getConfirmProducts(params){//获取订单确认商品列表
    return post('/order/queren/products.do', params)
}

function getTicket(params){//获取发票
    return post('/order/fapiao/info.do', params)
}
function getFullList(params){//获取满赠列表
    return post('/order/manez/list.do', params)
}

function submitOrder(params){//提交订单
    return post('/product/submit/order.do', params)
}

function nowBuy(params){//立即购买添加购物车
    return post('/product/ljgm/cart.do', params)
}

function autoSearch(params){//智能搜索
    return post('/get/zhineng/list.do', params)
}

function getHotSearchList(params){//热门搜索
    return post('/get/remen/list.do', params)
}


function pcLogin(params){//pc扫码登陆
    return post('/login/user/scan.do', params)
}

function getIndexInfo(params){
    return post('/index/gather/info.do', params)
}
function getHeatList(params) {//获取首页热门分类
    // let data = {...defaulParams,...params}
    return post('/index/heat/list.do', params)
}
function getSpecialList(params) {//获取首页精品推荐
    // let data = {...defaulParams,...params}
    return post('/index/boutique/list.do',params)
}
function secKill(params) {//获取首页限时秒杀
    // let data = {...defaulParams,...params}
    return post('/index/spike/list.do',params)
}


// 后台管理接口
function getManageMerchandise(params){ //获取在营商品
    return post('/manage/get/zysp.do',params)
}
function getManageOrderStatus(params){//获取订单的状态
    return post('/manage/get/jrdds.do',params)
}
function reqManageIndex(params) {//获取管理页面首页数据
    return post('/manage/index/list.do',params)
}
function getZxtList(params) {//获取销售走势图
    return post('/manage/get/zxtlist.do',params)
}
function getProRankList(params) {//获取商品销售排名
    return post('/manage/get/spxsfx.do',params)
}
function getCoustomerCityList(params){//获取客户销售排名  城市列表筛选条件
    return post('/city/get/list.do',params)
}
function getCoustomerRankList(params){//获取客户销售排名
    return post('/manage/get/mdxspx.do',params)
}
function reqMemberKPI(params){//获取业务员业绩
    return post('/manage/get/yccxsy.do',params)
}
function reqManageShop(params){//获取业务员负责门店
    return post('/manage/get/ywyzrmd.do',params)
}
function reqManageShopDetail(params){//获取业务员负责门店经营详情
    return post('/manage/get/ywymdxq.do',params)
}
function reqManageBusiness(params){//获取业务覆盖情况
    return post('/manage/get/ywxx.do',params)
}
function reqSevenDaysStock(params){//获取库存不足七日商品
    return post('/manage/get/kc7rsp.do',params)
}
function reqNoStock(params){//获取无库存商品
    return post('/manage/get/wkcsp.do',params)
}
function reqNotFullStock(params){//获取缺货商品
    return post('/manage/get/qhsp.do',params)
}
function reqNoCareShop(params){//获取未处理门店
    return post('/manage/get/wcsmd.do',params)
}
function reqNoCareGoods(params){//获取未动销商品
    return post('/manage/get/wdssp.do',params)
}
function reqWdxShop(params){//获取未动销门店
    return post('/manage/get/wdskh.do',params)
}
function reqManageNewAdd(params){//获取今日新增客户
    return post('/manage/get/jrxzkh.do',params)
}
function reqManageFirstOrder(params){//获取今日订单 待处理订单
    return post('/manage/get/dcldd.do',params)
}

function reqManageWaitePass(params){//获取待审核
    return post('/manage/get/dshxx.do',params)
}

function reqManageWaitePassDetail(params){//获取待审核详情
    return post('/manage/get/dshxxdetail.do',params)
}

function reqManagePassWaite(params){//通过审核
    return post('/manage/update/userstatus.do',params)
}
function reqManageOrderDetail(params){//获取管理页面订单详情
    return post('/manage/get/orderdetail.do',params)
}
function reqManageCustomerType(params){//获取管理页面审核客户类型
    return post('/manage/get/usertype.do',params)
}

function reqManageSendingList(params){//获取管理页面配送中列表
    return post('/manage/order/pszlist.do',params)
}
function reqManageSendingRoute(params){//获取管理页面配送路线
    return post('/manage/get/wlxx.do',params)
}




function getAllCitys(params){//获取管理页面全部省市区
    return post('/manger/all/city.do',params)
}

function getDriverHomeData(params){//获取司机端首页数据
    return post('/siji/get/index.do',params)
}
function getDriverMoneyData(params){//获取司机端费用列表
    return post('/siji/fycx/list.do',params)
}
function getDriverStatusData(params){//获取司机端待接单 待发货 已送达 已完成  已撤销数据 
    return post('/siji/get/orders.do',params)
}
function getDriverAceptClickData(params){//司机端接单按钮点击
    return post('/siji/order/jiedan.do',params)
}
function getDriverSendClickData(params){//司机端送货确定按钮点击
    return post('/siji/user/songhuo.do',params)
}
function getDriverWaitAceptDetailData(params){//司机端获取待接单详情 待发货详情  type:0 待发货  1：待接单
    return post('/siji/get/djdinfo.do',params)
}
function getDriverNoAriveDetailData(params){//司机端获未送达详情  ywCompanyId  客户编码    dddh  调度单号
    return post('/siji/wsd/info.do',params)
}
function getDriverHasFinishDetailData(params){//司机端获已完成详情
    return post('/siji/ywc/info.do',params)
}
function getDriverRovokeDetailData(params){//司机端获已撤销详情
    return post('/siji/ycx/info.do',params)
}
function getDriverWaitAceptGoodsData(params){//司机端待接单商品详情
    return post('/siji/djd/products.do',params)
}

function getDriverAriveClickData(params){//司机端送达确定按钮点击
    return post('/siji/user/songda.do',params)
}
function getDriverAriveCancelClickData(params){//司机端送达商品撤销按钮点击
    return post('/siji/user/cxpz.do',params)
}

function getDriverCancelGoodsData(params){//司机端送达商品撤销商品信息
    return post('/siji/dcxpz/info.do',params)
}
function getDriverRefuseGoodsData(params){//司机端拒收商品信息
    return post('/siji/get/djs.do',params)
}
function getDriverRefuseClickData(params){//司机端送达商品拒收 按钮点击
    return post('/siji/user/jushou.do',params)
}
function getDriverPayStateData(params){//司机端获取支付状态
    return post('/siji/zfzt/list.do',params)
}
function getDriverPositionData(params){//司机端获取司机定位
    return post('/siji/set/dswz.do',params)
}





function getKeeperHomeData(params){//获取保管员首页数据
    return post('/bgy/get/index.do',params)
}
function getKeeperWaitReadyData(params){//获取保管员待备货数据
    return post('/bgy/dbg/list.do',params)
}
function getKeeperHasReadyData(params){//获取保管员已备货数据
    return post('/bgy/ybh/list.do',params)
}
function getKeepeStockData(params){//获取保管员仓库列表
    return post('/bgy/get/bgyck.do',params)
}
function getKeeperWaitReadyDetailData(params){//获取保管员待备货详情
    return post('/bgy/dbh/info.do',params)
}
function getKeeperHasReadyDetailData(params){//获取保管员已备货详情
    return post('/bgy/get/ybh.do',params)
}

function getKeeperReadyClickData(params){//获取保管员备货完成按钮点击
    return post('/bgy/user/bhwc.do',params)
}

export {
    getBannerVideo,
    checkForget,
    checkExist,
    checkExistClient,
    getYzCode,
    checkYzCode,
    login,
    addRelativeCompany,
    addRelativeCreate,
    updateUserInfo,
    getUploadToken,
    uploadImage,
    getActorList,
    getCompanyList,
    getFactoryList,
    getPartList,
    getRegShopList,
    checkTcode,
    getPropertyList,
    getIntelList,
    getRangeList,
    getCityList,
    joinRegister,
    creatRegister,
    forgetPass,
    getAddrList,
    addNewAddr,
    upDateAddr,
    setDefaultAddr,
    getMyInfo,
    getMyUserOrderNum,
    getCompanyInfo,
    getChooseList,
    getChooseDetail,
    getOrdersList,
    getOrderDetail,
    evaForOrder,
    getEvaList,
    getViewLogist,
    getOrderStatuList,
    switchCompanyList,
    getMoreKindsMain,
    getMoreKindsBranch,
    getActivityInfo,
    getBestGoodsList,
    backGOods,
    reciveGOods,
    getPub,
    recordCartNum,
    getTicket,
    getFullList,
    confirmGetInfo,
    settleAcount,
    getCarTip,
    buyCheckNum,
    addToCar,
    getCartNum,
    getGiftList,
    delFromCar,
    getCarList,
    getConfirmProducts,
    submitOrder,
    nowBuy,
    autoSearch,
    getHotSearchList,
    getSuitList,
    getSuitDetail,
    pcLogin,
    getIndexInfo,
    getHeatList,
    getSpecialList,
    secKill,
    reqManageCustomerType,//管理页面获取客户类型
    getManageMerchandise,//在营商品
    getManageOrderStatus,//管理页面的订单状态
    reqManageIndex,//管理页面首页
    getZxtList,//管理页面走势图
    getProRankList,//管理页面 商品销售排名
    getCoustomerCityList,//管理页面客户销售排名
    getCoustomerRankList,//管理页面城市筛选条件列表
    reqMemberKPI,//管理页面获取业务员业绩
    reqManageShop,//管理页面获取业务员负责门店
    reqManageShopDetail,//管理页面获取业务员负责门店详情
    reqManageBusiness,//管理页面获取业务覆盖情况
    reqSevenDaysStock,//管理页面获取库存不足七日商品
    reqNoStock,//管理页面获取无库存商品
    reqNotFullStock,//管理页面获取缺货商品
    reqNoCareShop,//管理页面获取未处理门店
    reqNoCareGoods,//管理页面未动销商品
    reqWdxShop,//管理页面未动销门店
    reqManageNewAdd,//管理页面获取今日新增客户
    reqManageFirstOrder,//管理页面获取今日订单 待处理订单
    reqManageWaitePass,//管理页面获取待审核
    reqManageWaitePassDetail,//管理页面获取待审核详情
    reqManagePassWaite,//管理页面通过审核
    reqManageOrderDetail,//管理页面获取订单详情
    reqManageSendingList,//管理页面获取配送中列表
    reqManageSendingRoute,//管理页面获取配送路线
    getAllCitys,//管理页面获取全部省市区
    getDriverHomeData,//司机端首页接口数据
    getDriverMoneyData,//司机端获取费用列表
    getDriverStatusData,//司机端获取待接单 待发货 已完成 已送达  已撤销
    getDriverAceptClickData,//司机端接单按钮点击
    getDriverSendClickData,//司机端送货确定 按钮点击
    getDriverWaitAceptDetailData,//司机获取待接单详情  待发货详情
    getDriverNoAriveDetailData,//司机端获取未送达详情
    getDriverAriveClickData,//司机送达按钮点击
    getDriverHasFinishDetailData,//司机端已完成详情
    getDriverRovokeDetailData,//司机端已撤销详情
    getDriverWaitAceptGoodsData,//司机端待接单商品详情
    getDriverAriveCancelClickData,//司机端 送达商品撤销按钮
    getDriverCancelGoodsData,//司机端 撤销商品信息
    getDriverRefuseClickData,//司机端 拒收按钮点击
    getDriverRefuseGoodsData,//司机端拒收商品信息
    getDriverPayStateData,//司机端获取支付状态
    getDriverPositionData,//司机端上传司机位置信息
    getKeeperHomeData,//保管员首页数
    getKeeperWaitReadyData,//保管员待备货
    getKeepeStockData,//保管员仓库列表
    getKeeperWaitReadyDetailData,//保管员待备货详情
    getKeeperHasReadyData,//保管员已备货
    getKeeperHasReadyDetailData,//保管员已备货详情
    getKeeperReadyClickData,//保管员备货完成按钮点击
}
