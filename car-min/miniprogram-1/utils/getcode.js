
export default function code(){
  return new Promise((resolve, reject)=>{
    wx.login({
      success: res => {
        // // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // userLogin(res.code).then((data) => {
        //   resolve(data)
        // })
        // console.log(res)
        resolve(res.code)
      }
    })
  })
}
