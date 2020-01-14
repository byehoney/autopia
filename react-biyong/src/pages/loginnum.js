import React,{Component} from "react";
import { connect } from 'react-redux';
import "../styles/loginnum.scss"
import NetUtil from '../utils/NetUtil';
import BackBtn from "../components/BackBtn";
class Loginnum extends Component{
    constructor(props){
            super(props)
            this.state={
                list:[
                  
                ],
                day:"",
                carnum:"",
                showtoast:true,
                user:{}
            }
    }
   componentDidMount(){
       this.setState({
           user:this.props.user
       })
    this.getloginnum()
   }
//   获取登录天数
    getloginnum(){
        NetUtil.post("/api/opencar/task/continuousLogin",{userId:this.props.user.userId})
        .then((res)=>{
            // console.log(res)
            if(res.code==0){
                let num=0
                let list=res.data.ContinuousLoginList
                    for(var a=0;a<list.length;a++){
                        list[a].isshow=false
                        if(list[a].continuousLogin===1){
                         num+=1
                        }
                    }
                    console.log(num)
                    list[num-1].isshow=true
                    console.log(list)
                    this.setState({
                        list:list,
                        day:num,
                        carnum:list[num-1].cartokenNum
                    })  
            }
        })
        
    }
    render(){
        const jian=require("../images/loginjian.png")
        return(
          
            <div className="loginnum">
                <div className="num">
               {this.state.list.map((item,index)=>{
                   let show=""
                   let showcar=false
                   if(item.continuousLogin===1){
                       show="login"
                   }
                   if(item.isshow===true){
                       show=show+" show"
                       showcar=true
                   }
                   return(
                    <div className={show}  key={index}>{index+1}天 <span></span> 
                    {showcar===true? <div className="shownum" >
                    <img src={jian} alt=""/>
                    +{item.cartokenNum}Car币
                    </div>:""}
                   
                    </div>
                  
                   )
                  
               })}
                </div>
                <div className="nav">
                说明：若有一天未登录，再次登录时，连续登录的天数会重新计算
                </div>
                <BackBtn from={this.props.user.from}/>
             </div>
        )
    }
}
const mapStateToProps = state => ({
    user: state.user
})
export default connect(mapStateToProps)(Loginnum);