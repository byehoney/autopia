import React,{Component} from "react";
import "../styles/dhsuccess.scss"
import { connect } from 'react-redux';
import BackBtn from "../components/BackBtn";
class Dhsuccess extends Component{
    constructor(props){
        super(props)
        this.state={}
    }
    back(){
        this.props.history.go(-3);
    }
    render(){
        const url=require("../images/dhsuccess.png")
        return(
            <div className="dhsuccess">
                <img src={url} alt=""/>
                <p>恭喜兑换成功</p>
                <div className="go" onClick={this.back.bind(this)}>返回商城</div>
                <BackBtn from={this.props.user.from} back="-3"/>
            </div>
        )
    }
}    
const mapStateToProps = state => ({
    user: state.user
  })
  export default connect(mapStateToProps)(Dhsuccess);