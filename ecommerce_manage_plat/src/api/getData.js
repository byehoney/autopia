
import {post,get } from '@/config/http'




/* 登陆*/
export const userLogin = data => get('/admin/login',data)//登陆

/* 品牌*/
export const brandList = data => get('/admin/brand/list',data)//品牌列表

export const opBrand = data => post('/admin/brand/add',data)//新增或编辑品牌

export const delBrand = data => post('/admin/brand/del',data)//删除品牌

/**商品列表 */
export const goodsList = data => get('/admin/goods/goods_list',data)//商品列表

export const mainClassList = data => get('/admin/goods/cate_list',data)//一级分类

export const sonClassList = data => get('/admin/goods/getCateSon',data)//二级分类

export const goodInfo = data => get('/admin/goods/goodsSku',data)//获取商品信息

export const setGoodsPrice = data => post('/admin/goods/setGoodsPrice',data)//设置商品价格

export const setGoodsStock = data => post('/admin/goods/setGoodsSku',data)//设置商品库存

export const setGoodsRake = data => post('/admin/goods/setGoodsRaKeBack',data)//设置商品返佣比例

export const setGoodsStatus = data => post('/admin/goods/setStatus',data)//设置商品上下架

export const setGoodsGift = data => post('/admin/goods/setGift',data)//设置礼包商品

export const setGoodsPass = data => post('/admin/goods/examineVerify',data)//审核商品  sh_status 1 审核不通过   3 审核通过

export const editGoods = data => get('/admin/goods/edit',data)//编辑商品 

export const goodsBrandList = data => get('admin/brand/branList',data)//编辑商品 商品品牌列表

export const serviceList = data => get('/admin/service/list',data)//编辑商品 服务列表

export const addService = data => post('/admin/service/save',data)//编辑商品 添加服务协议

export const saveGoodsInfo = data => post('/admin/goods/saveEdit',data)//编辑商品 保存

export const goodsSet = data => post('/admin/goods/set',data)//商品推荐置顶type top 置顶 recommend 推荐 status 0 否 1是


/* 分类*/
export const classList = data => get('/admin/category/list',data)//分类列表

export const delClass = data => post('/admin/category/del',data)//删除分类

export const opClass = data => post('/admin/category/add',data)//添加 编辑分类

/*系统管理*/
export const adminUserList = data => get('/admin/adminuser/list',data)//管理员列表

export const opAdminUser = data => post('/admin/adminuser/add',data)//添加 编辑管理员

export const adminUserDetail = data => get('/admin/adminuser/detail',data)//管理员账号详情

export const setAdminUser = data => post('/admin/adminuser/set',data)//操作管理员启用 禁用

export const supplierList = data => get('/admin/supplier/list',data)//供应商列表

export const opSupplier = data => post('/admin/supplier/save',data)//添加 编辑供应商

export const supplierDetail = data => get('/admin/supplier/detail',data)//供应商账号详情

export const setSupplier = data => post('/admin/supplier/set',data)//操作供应商启用 禁用

export const platPrice = data => get('/admin/pps/get',data)//平台定价数据获取

export const platPriceSet = data => post('/admin/pps/set',data)//平台定价数据设置

/**用户管理 */
export const memberList = data => get('/admin/member/list',data)//会员列表

export const memberSet = data => post('/admin/member/set',data)//会员设置 status 1 设置vip 0 取消

/**订单管理 */
export const orderList = data => get('/admin/order/list',data)//订单列表

export const orderDetail = data => get('/admin/order/detail',data)//订单详情

export const modiAddr = data => post('/admin/order/change/addr',data);//修改收货地址

export const refundList = data => get('/admin/refund/list',data);//售后订单列表

export const orderOperate = data => post('/admin/refund/operate',data);//售后订单 同意取消 

export const addRemark = data => post('/admin/refund/add/remark',data);//添加备注

export const remarkList = data => get('/admin/refund/remark/list',data);//售后订单备注列表

export const exportOrder = data => get('/admin/order/export',data);//订单导出

export const getToken = data => get('/admin/get/token',data);//临时token

/**结算管理 */

export const withDrawList = data => get('/admin/withdraw/user/list',data);//会员提现列表

export const withDrawDetail = data => get('/admin/withdraw/user/detail',data);//会员提现详情

export const withDrawMakeloans = data => post('/admin/withdraw/user/makeloans',data);//会员提现发放

export const withDrawExamine = data => post('/admin/withdraw/user/examine',data);//会员提现审核

/**页面管理  */
export const  recommendList = data => get('/admin/goods/recommend/list',data);//推荐列表

export const  iconList = data => get('/admin/cateImg/list',data);//icon列表

export const opIcon = data => post('/admin/cateImg/add',data);//icon 添加 编辑

export const iconSet = data => post('/admin/cateImg/set',data);//icon 设置上下架

export const iconDel = data => post('/admin/cateImg/del',data);//icon 删除

export const iconDetail = data => get('/admin/cateImg/detail',data);//icon 详情

export const  adList = data => get('/admin/ad/list',data);//广告列表

export const  delAd = data => post('/admin/ad/del',data);//删除广告

export const  saveAd = data => post('/admin/ad/save',data);//添加、编辑广告

/**数据管理 */
export const  dashboard = data => get('/admin/dashboard',data);//数据看板
