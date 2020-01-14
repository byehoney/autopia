/**
 * 封装http 请求方法
 */
import login from "./login.js"
import errUrl from "./geterrurl.js"
import errLogin from "./errlogin.js"
import app from "../app.js"
// const apiUrl = "https://sapi.chetuobang.com"; //服务器api地址
const apiUrl = "https://tsapi.chetuobang.com"; //服务器api地址
let appthis=null
// 初始化全局变量
// function init(app){
//   console.log(app)
//   appthis=app
// }
// function init(app){
//   return new Promise((ro,re)=>{
//     ro(app)
//   })
// }
// console.log(app)
const http = (params) => {

  // console.log("http!!==",params);
  //返回promise 对象
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl + params.url,//服务器url+参数中携带的接口具体地址
      data: params.data||"",//请求参数
      header:{

        //application/x-www-form-urlencoded  。此条设置不兼容json字符串格式。 application/json
        "Content-Type": "application/json",//设置后端需要的常用的格式就好，特殊情况调用的时候单独设置
        "Authorization": wx.getStorageSync('token'),
        "Platform":"CTB_SHOP_MINIPRO",
        "ver":"1001"
      },
      method: params.method || 'POST',//默认为GET,可以不写，如常用请求格式为POST，可以设置POST为默认请求方式
      dataType: params.dataType||'json',//返回的数据格式,默认为JSON，特殊格式可以在调用的时候传入参数
      // responseType: params.responseType,//响应的数据类型
      success: function (res) {
        //接口访问正常返回数据
        // console.log("APIres",res);
        

        if (res.statusCode == 200) {

  
          // console.log(res)
          //1. 操作成功返回数据,原则上只针对服务器端返回成功的状态（如本例中为000000）
          if (res.data.code == "0") {
            resolve(res.data)
          }else{
            wx.showToast({
              icon: "none",
              title: res.data.message
            })
            // console.log(res.data)
          }
        } else if (res.statusCode == 401) {

          console.log("401",res);
          wx.showToast({
            title: '请先登录',
            icon: "none"
          })

          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                errLogin()
                // 执行登陆接口
                wx.showToast({
                  title: '请求超时',
                  icon: "none"
                })
                // console.log("yesAuth");
              } else {

                // console.log("noAuth");
                // 跳转个人页面手动登陆
                if (params.errBack) {
                  // console.log("11noAuth");

                } else {
                  // console.log("22noAuth");
                   console.log("errurl", errUrl());

                  if (errUrl() != "pages/mine/mine"){

                    wx.setStorageSync("backurl", "/" + errUrl());
       

                    setTimeout(() => {
                      // console.log("hhtpsetTimeout")
                      wx.switchTab({
                        url: '../mine/mine',
                      })

                    }, 1500)
  


              
                  }
                }
              }
            }
          })
        }
      },
      fail: function (e) {
        reject(e)
      }
    })
  })
}
module.exports = {
  http: http
}