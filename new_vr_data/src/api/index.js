import { get, post ,upload} from '@/axios/http.js'
function getTotalData (params) {
    return post('/visualization/home', params)
}
function getHomeData (params) {
    return post('/visualization/home/user', params)
}
function getDataShowOne(params) {
    return post('/visualization/user/list/gatherforday', params)
}
function getDataShowTwo(params) {
    return post('/visualization/user/chart', params)
}
function getDataShowThree(params) {
    return post('/visualization/article/list/gatherforday', params)
}
function getDataShowFour(params) {
    return post('/visualization/article/chart', params)
}
function getMapData(params){
    return post('/visualization/user/china/chart',params)
}
function getMapDetailData(params){
    return post('/visualization/user/colligate/chart',params)
}

function getOtherData(params){
    return post('/visualization/user/other/list',params);
}

function getUploadToken(params) {  
    return post('/qiniu/get/token.do', params)
}
function uploadImage(params,handle) {
    return upload('https://up-z0.qiniup.com', params,handle)
}
function getCityList(params) {
    return post('/city/all/list.do', params)
}
function getHotList(params){
    return post('/index/heat/list.do',params)
}

export {
    getTotalData,
    getHomeData,
    getDataShowOne,
    getDataShowTwo,
    getDataShowThree,
    getDataShowFour,
    getUploadToken,
    uploadImage,
    getCityList,
    getHotList,
    getMapData,
    getMapDetailData,
    getOtherData
}
