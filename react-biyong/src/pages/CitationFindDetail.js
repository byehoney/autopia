import React from "react";
import { connect } from 'react-redux'
import BackBtn from "../components/BackBtn";
import NetUtil from '../utils/NetUtil';
import { Toast } from 'antd-mobile';
import '../styles/CitationFind/citationFindDetail.scss'
class CitationFindDetail extends React.Component {
    constructor(props){
        super(props)
        this.state={
            // plateIndex: this.props.match.params.index,
            // carInfo:{plate:'',illegalMsg:{},violateInfos:[],status:''},
            // carInfos: [],//车辆信息
            carInfo:{plate:'',illegalMsg:{},violateInfos:[],status:''},
            plate:this.props.match.params.plate
        }
    }
    async componentDidMount() {
        console.log(this.props)
        this.loadPlatInfo();
    }
    loadPlatInfo(){
        NetUtil.post('/wzcx/getPlateMsg',{
            uid: this.props.user.openId,
            plate: this.state.plate
        }).then(res=>{
            console.log(res)
            if(res.code==1){
                this.setState({
                    carInfo:{
                        plate:res.results.illegalMsg.plate,
                        illegalMsg:res.results.illegalMsg,
                        violateInfos:res.results.violateInfos,
                        status:res.results.status
                    }
                })
            }
        })
    }
    payForOrder(){
        NetUtil.post('wzcx/violate',{uid: this.props.user.openId,plate: this.state.carInfo.plate})
            .then((res)=>{
                if(res.data.code == 1){
                    window.location.href = res.data.results;
                }else{
                    Toast.info(res.data.msg, 1)
                }
            })
    }
    render() {
        console.log(this.state.carInfo) 
        return (
            <div className="citationDetailContianer">
                <div className="history-wrap">
                    <div className="history">
                        <div>
                            <div className="violate-plate">{this.state.carInfo?this.state.carInfo.plate:''}</div>
                            <div className="violate-info-old">
                                {
                                    this.state.carInfo&&this.state.carInfo.violateInfos.map((item,index)=>(
                                        <div className="history-item">
                                            <div className="img-tip">
                                                <div className="circle"></div>
                                                <div className="line"></div>
                                            </div>
                                            <div className="content">
                                                <div className="violate-title">
                                                    <p className="violate-date">{item.illegalTime}</p>
                                                </div>
                                                <div className="violate-row">
                                                    <p className='violate-label'>违章原因</p>
                                                    <div className='violate-p'>{item.reason}</div>
                                                </div>
                                                <div className="violate-row">
                                                    <p className='violate-label'>违章地点</p>
                                                    <div className='violate-p'>{item.location}</div>
                                                </div>
                                                <div className="violate-punish">
                                                    <div className="violate-punish-count">{item.punishPoint?item.punishPoint:0}分</div>
                                                    <div className="violate-punish-money">{item.punishMoney?item.punishMoney:0}元</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="pay">
                            <div className="pay-list">
                                <div className="pay-item">{this.state.carInfo.illegalMsg.illegalCount}笔</div>
                                <div className="pay-item">共{this.state.carInfo.illegalMsg.illegalMoney}元</div>
                                <div className="pay-item">扣{this.state.carInfo.illegalMsg.illegalScore}分</div>
                            </div>
                            <div className="pay-btn" onClick={this.payForOrder.bind(this)}>
                                立即办理
                            </div>
                        </div>
                    </div>
                </div>
                <BackBtn from={this.props.user.from}/>
            </div>
        )
    }
}
export default connect(state=>{
    return {
        user:state.user
    }
})(CitationFindDetail);