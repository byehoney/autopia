// import React from "react";
import React, { Component } from 'react';
// import { connect } from 'react-redux'
import NetUtil from '../../utils/NetUtil';
// import { Link } from 'react-router-dom';
import jinbi from '../../images/jinbi.png';
import tanhao from '../../images/tanhao.png';
import xiangshanglv from '../../images/xiangshanglv.png';
import './CarHelp.scss';
class CarHelp extends React.Component {


    constructor(props){
        super(props)
        this.state={
            resList: [],
            globalDesFlag:-1
        }
    }
    componentDidMount() {
        document.title='Car币说明';
        this.getDesc();
    }
    getDesc() {
        NetUtil.get('/api/opencar/wallet/rewardDesc')
                .then((res) => {
                    this.setState({resList:res.data.rewardDescInfo})
                })
    }

    
    hidedes(){
        document.getElementById("descriptionbox"+arguments[0]).style.display="none";
    }
    showdes(){
        console.log(this.state.globalDesFlag);
        if(this.state.globalDesFlag!=-1&&this.state.globalDesFlag!=arguments[0]){
            document.getElementById("descriptionbox"+this.state.globalDesFlag).style.display="none";
        }

        var stateflag = document.getElementById("descriptionbox"+arguments[0]).style.display;
        if(stateflag=="flex"){
             document.getElementById("descriptionbox"+arguments[0]).style.display="none";
        }else{
            document.getElementById("descriptionbox"+arguments[0]).style.display="";
            document.getElementById("descriptionbox"+arguments[0]).style.display="flex";    
        }
        this.setState({globalDesFlag:arguments[0]});
    }

    render() {

        return (
            <div className="citationContianer1">
            {this.state.resList.map((item,index)=>{
                return(
                        <div className="limitPriceBox1">
                            <div className="limitBox"  onClick={this.showdes.bind(this,index+1)}>
                                <p className="title">{item.title}</p>
                                <p className="limitNum">{item.desc}<img className="jinbiIcon" src={jinbi}/>Car币</p>
                                <img className="tanhaoIcon" src={tanhao}/>
                            </div>
                            <div className="linebottom"></div>
                            <div className="descriptionbox" id={'descriptionbox'+(index+1)}>
                                <div className="description">
                                   {item.detail}
                                </div>
                                <div className="shouqi" onClick={this.hidedes.bind(this,index+1)}>收起
                                    <img className="shouqi1" src={xiangshanglv}/>
                                </div>
                            </div>
                        </div>
                )
            })}
            </div>
        )
    }
}
// export default connect(state=>{
//     return {
//         user:state.user,
//     }
// })(CarHelp);
export default CarHelp;