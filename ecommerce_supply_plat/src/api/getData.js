
import {post,get } from '@/config/http'







export const userLogin = data => post('/supplier/doLogin',data)//登陆

/** 商品管理 商品列表**/
export const goodsList = data => get('/supplier/goods/draft_list',data);

export const serviceList = data => get('/supplier/service/list',data);//服务协议列表

export const addService = data => post('/supplier/service/save',data);//添加服务协议

export const specificationList = data => get('/supplier/goods/specs_list',data);//规格列表

export const specificationValues = data => get('/supplier/goods/specs_values',data);//规格值列表

export const addSpecification = data => post('/supplier/goods/addGoodsSpecs',data);//添加规格


export const submitAudit = data => post('/supplier/goods/examineVerify',data);//草稿箱提交审核

export const delStock = data => post('/supplier/goods/delDraft',data);//草稿箱删除商品

export const  checkSettlementPrice = data => get('/supplier/goods/checkDraftSku',data);//草稿箱获取结算价

export const modifyStock = data => post('/supplier/goods/setGoodsSkuDraft',data);//修改库存

export const modifyMarket = data => post('/supplier/goods/setDraftMarketPrice',data);//修改市场价

export const realGoodsList = data => get('/supplier/goods/goods_list',data);//商品列表

export const opUpDown = data => post('/supplier/goods/setStatus',data);//操作商品上下架


/*添加商品*/
export const getMainClass = data => get('/supplier/cate/list',data);//获取一级分类

export const getSonClass = data => get('/supplier/cate/getSon',data);//获取二级分类

export const getBrands = data => get('/supplier/brand/brand_list',data);//获取品牌

export const submitGoodsInfo = data => post('/supplier/goods/addData',data);//提交新增商品信息


/**编辑商品 */
export const getGoodsInfo = data => get('/supplier/goods/editDraft',data);//编辑商品 获取商品信息

export const saveGoodsInfo = data => post('/supplier/goods/saveDraftEdit',data);//保存编辑商品信息


/**订单管理 */
export const orderList = data => get('/supplier/order/list',data);//订单列表

export const addPackage = data => post('/supplier/order/addPackage',data);//订单发货

export const orderDetail = data => get('/supplier/order/detail',data);//订单详情

export const modiAddr = data => post('/supplier/order/saveOrderAddr',data);//修改收货地址

export const refundList = data => get('/supplier/refund/list',data);//售后订单列表

export const addRemark = data => post('/supplier/refund/addRemark',data);//添加备注

export const remarkList = data => get('/supplier/refund/remarkList',data);//售后订单备注列表

export const orderOperate = data => post('/supplier/refund/orderOperate',data);//售后订单 同意取消 1 拒绝 2 同意



/*结算管理*/
export const withdrawInfo = data => get('supplier/withdraw/info',data);//结算账户信息


export const withdrawAddData= data => post('/supplier/withdraw/addData',data);//添加提现账户

export const editWithdrawAddData= data => post('/supplier/withdraw/saveBankData',data);//编辑提现账户


















