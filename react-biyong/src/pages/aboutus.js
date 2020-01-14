import React,{Component} from "react";
import BackBtn from "../components/BackBtn";
import { connect } from 'react-redux';
import "../styles/aboutus.scss"
 class Aboutus extends Component{
    constructor(props){
        super(props)
        this.state={}
    }
    render(){
        const logo=require("../images/logo.png")
        return(
            <div className="adoutus">
                <img src={logo} alt=""/>
                <div className="con">
                <p>1、用户兑换商品时请确认收货信息，如因手机号、地址、姓名等错误信息，导致无法收到快递，【车主币用】不给予补发；</p>
                <p>2、物品快递后，如发生不可抗力因素，如地震、大风、山崩等导致物品丢失或损坏，【车主币用】不给予补发；</p>
                <p>3、新疆、内蒙古、西藏等地区，因快递原因暂不支持发货，请谨慎兑换，兑换的商品将不给予星钻补偿；</p>
                <p>4、如用户收到货物出现损坏、无法使用等问题，可以联系客服帮忙寻找供应商，中间产生的快递费、维修费等需要用户自行处理；</p>
                <p>5、用户在兑换后的15-25个工作日发货，推荐专区、游戏专区、邀请专区、新人专区快递均为免费，用户无需缴纳额外费用；</p>
                </div>
                <BackBtn from={this.props.user.from}/>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    user: state.user
  })
  export default connect(mapStateToProps)(Aboutus);