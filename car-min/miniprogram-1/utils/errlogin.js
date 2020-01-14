
// 登陆失效执行登陆
import login from "./login.js"
export default function errLogin(){
  wx.login({
    success:res=>{
      let code=res.code
      wx.getUserInfo({
        success: res => {
          // let param = { code: code, encrypte_data: res.encryptedData, iv: encodeURIComponent(res.iv)}
          let param = { code: code, encrypte_data: res.encryptedData, iv: res.iv }
          // 执行登陆获取token
          // console.log(param)
          login(param).then((res)=>{
            wx.setStorageSync('token', res.data.token)
          })
        }
      })
    }
  })
}

 

