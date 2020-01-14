import React,{Component} from "react";
import "../styles/my.scss"
import { connect } from 'react-redux';
import {Link} from "react-router-dom"
import login from '../redux/loginAction'
import Tabbar from "../components/Tabbar";

window.updateValue = function() {
    if(window.callback != undefined) {
        window.callback.updateValue();
    }
};
 
window.setCallback = function(callback) {
    window.callback = callback;
};
 class My extends Component{
        constructor(props){
            super(props)
            this.savelogin=this.savelogin.bind(this)
            this.state={
                list:[
                    {title:"Car币记录",img:require("../images/carbijilu.png"),url:"/carhistory"},
                    {title:"购物记录",img:require("../images/gouwujilu.png"),url:"/shophistory"},
                    {title:"我的车库",img:require("../images/wodecheku.png"),url:"/carlist"},
                    {title:"我的评论",img:require("../images/mypinglun.png"),url:"/discusslist"},
                    {title:"我的设置",img:require("../images/shezhi.png"),url:"/setting"},
                ],
                user:{}
            }
        }
       
        componentDidMount(){
            window.savelogin = this.savelogin
        //   this.savelogin()
           if(this.props.user.userId){
            this.setState({
                user:this.props.user
            })
           }else{
                if(this.props.user.from == 'mini') {
                    window.wx.miniProgram.redirectTo({url: '/pages/login/login?prev=my'})
                }else{
                    window.Android.onLoginClicked("my") 
                }
           }
          
        }
        componentWillMount() {
            window.setCallback(this);
        }
        updateValue(val) {
            alert(1)
        }
        // 登陆保存
       savelogin(){
            alert(1)
            // this.props.login(user)
        }
        render(){
            const right=require("../images/myright.png")
            return(
               <div className="my">
                    <div className="head" >
                        <div className="left">
                        <img src={this.state.user.avatar} alt=""/>
                        </div>
                        <div className="right">
                            <div>{this.state.user.nickName}</div>
                            <p>正式居民</p>
                        </div>
                    </div>
                    <div className="con">
                    {this.state.list.map((item,index)=>{
                        return(
                            <Link className="list" to={item.url} key={index}>
                                <div className="left">
                                <img src={item.img} alt=""/> {item.title}
                                </div>
                                <div className="right">
                                <img src={right} alt=""/>   
                                </div>
                            </Link>
                        )
                    })}
                    </div>
                    <Tabbar current="3"/>
               </div> 
            )
        }
} 
const mapStateToProps = state => ({
    user: state.user
})
const mapDispatchToProps = dispatch => ({
    login: user => dispatch(login(user))
})
export default connect(mapStateToProps,mapDispatchToProps)(My);