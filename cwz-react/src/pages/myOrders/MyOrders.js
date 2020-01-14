import React,{Component} from "react";
import { Toast } from 'antd-mobile';
import NetUtil from '../../utils/NetUtil';
import TopNav from '../../components/TopNav/TopNav';
import './myOrders.css';
import orderLight from '../../images/dingdan_light.png';
import orderGrey from '../../images/dingdan_grey.png';
import carIcon from '../../images/carIcon.png';
class Myorders extends Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    back(){
        this.props.history.go(-1);
    }
    render(){
        return(
            <div className="orderContainer">
                <TopNav back={()=>{this.back()}} title="我的订单"/>
                <div className="tabs">
                    <div className="tabItem">
                        处理中
                    </div>
                    <div className="tabItem">
                        已完成
                    </div>
                </div>
                <div className="details">
                    <div className="detailItem">
                        <div className="detailTop">
                            <div className="topLeft">
                                <img  src={orderLight} alt="" className="icon"/>
                                <span className="order">2019027873198</span>
                            </div>
                            <div className="topRight">2018-09-27   20:09</div>
                        </div>
                        <div className="detailBottom">
                            <img src={carIcon} className="carIcon" alt=""/>
                            <div className="detailInfo">
                                <p className="carNums">
                                    <span className="text">车牌号：</span>
                                    <span className="nums">京128828</span>
                                </p>
                                <p className="orderMoney">
                                    <span className="text">订单金额：</span>
                                    <span className="money">¥400</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Myorders