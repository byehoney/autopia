import React,{Component} from "react";
import { connect } from 'react-redux';
import "../styles/setting.scss"
import {Link} from "react-router-dom"
import NetUtil from '../utils/NetUtil';
import {logout} from '../redux/loginAction'
import BackBtn from "../components/BackBtn";
class Setting extends Component{
constructor(props){
    super(props)
    this.state={
        tourl:[
            "/login",
            "/address/no",
            "/version",
            "/aboutus"
        ],
        showToast:false,
        user:{},
        phone:"",
        version:""
    }
}
url(index){
  
    this.props.history.push(this.state.tourl[index])
}
toast(){
    if(this.state.showToast===true){
        return
    }
    console.log(1)
    this.setState({
        showToast:true
    })
    setTimeout(()=>{
        this.setState({
            showToast:false
        })
    },1500)
}
    // 退出登陆
    goout(){
        if(this.state.user.from=="mini"){
            // this.props.nav('home');
            window.wx.miniProgram.redirectTo({url: '/pages/login/login?prev=home'})
            this.props.logout()
        }else{
            window.Android.onLoginClicked() 
            window.Android.onExitClicked()
        }
    }
    // 获取用户设置信息
    getsetmsg(){
        NetUtil.post("/api/opencar/user/settings",{
            userId:this.props.user.userId,
            appType:"2"
        })
        .then(res=>{
            console.log(res)
            if(res.code==0){
                this.setState({
                   phone: res.data.userMobile,
                   version:res.data.appVersion.curVersionName
                })
              
            }
        })
      
    }
    componentDidMount(){
        this.setState({
            user:this.props.user
        })
        this.getsetmsg()
    }
    render(){
        return(

            
            <div className="setting">
            <div className="con">
                <div className="user">
                    <div className="left">当前账号</div>
                    <div className="right">{this.state.phone}</div>
                </div>
                <div to="/address/no" className="address" onClick={this.url.bind(this,1)}>
                    <div className="left">收货地址</div>
                    <div className="right">
                    <span></span>
                    </div>
                </div>
                <div className="version" onClick={this.toast.bind(this)}>
                    <div className="left" >版本号</div>
                    <div className="right">
                    {this.state.version}<span></span>
                    </div>
                </div>
                <div className="our" onClick={this.url.bind(this,3)}>
                    <div className="left" >关于我们</div>
                    <div className="right">
                    <span></span>
                    </div>
                </div>
            </div>
                <div className="goout" onClick={this.goout.bind(this)}>
                    退出登录
                </div>
                {this.state.showToast===true? <div className="toast">
                    已经是最新版本了
                </div>:""}
                <BackBtn from={this.props.user.from}/>
            </div>
            
        )
    }
}
const mapStateToProps = state => ({
    user: state.user
})
const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
})
export default connect(mapStateToProps,mapDispatchToProps)(Setting);