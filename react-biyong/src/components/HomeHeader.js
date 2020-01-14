import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NetUtil from '../utils/NetUtil';
import GetCity from '../components/GetCity';

class HomeHeader extends Component {
    state = { 
        plateIndex: 0,
        showViolate: false,
        userId: ''
     }
    renderViolate() {
        const msg = this.props.details[this.state.plateIndex];
        return (
                <div className='car-info'>
                    <ul className='plate-list'>
                        {this.props.details.map((item, i) => {
                            return <li 
                                        key={i}
                                        className={this.state.plateIndex === i ? "plate current": "plate"}
                                        onClick={()=>{
                                            this.setState({
                                                plateIndex: i
                                            })
                                        }}
                                        >
                                        <span>{item.plate}</span>
                                    </li>;
                        })}
                        {this.props.details.length < 3 ? <li><Link to='/addcar/no' className='add-car'></Link></li> : ''}
                    </ul>
                    <Link to='/citationFind' className='violate-content'>您有 <span className='violate-count'>{msg && msg.times}</span> 条违章信息，点击查看>></Link>
                </div>
        )
    }
    renderBlock() {
        if(this.props.code === -1){
            return (
                <Link className='violate-block' to='/addcar/no'>
                    <div className='title' >绑定车辆查违章</div>
                    <div className='arrow right'></div>
                </Link>
            )
        }else if(this.props.code === 1){
            return (
                <div className={this.state.showViolate? 'violate-block hide':'violate-block'}
                    onClick={()=>{this.setState({showViolate: true})}}>
                    <div className='title'>您有 <span className='violate-count'>{this.props.info.homeIllegalMessage}</span> 条违章信息</div>
                    <div className='arrow'></div>
                </div>
                )
        }else if(this.props.code === 0){
            return (
                <div className={this.state.showViolate? 'violate-block hide':'violate-block'} 
                    onClick={()=>{this.setState({showViolate: true})}}>
                    <div className='title'>您有 <span className='violate-count'>0</span> 条违章信息</div>
                    <div className='arrow'></div>
                </div>
                )
        }else {
            return (
                <div className='violate-block'>
                    <div className='title' onClick={this.props.showLogin}>登录获取查违章消息</div>
                    <div className='arrow'></div>
                </div>
            )
        }
        
    }
    render() {
        return (
            <div className='home-header'>
                <img src={require('../images/home-bg.png')} className='bg-default' alt=''/>
                <div className='info-bg'>
                    <div className='info-profile'>
                        <div className='title-block'>
                            <span className='title'>Car币</span>
                            {
                                this.props.userId ? 
                                '' :
                                <div className='login-btn' onClick={()=>{this.props.bindLogin()}}>登录</div>
                            }
                            
                        </div>
                        <img src={require('../images/avatar-default.png')} className='avatar' alt=''/>
                    </div>
                    <div className='info-money'>
                    {
                        this.props.userId ? 
                        this.props.info.currencyTotalAmount:
                        <div className='no-login' onClick={this.props.showLogin}>请登录查看Car币</div>
                    }
                    </div>
                </div>
                { this.renderBlock()}
                <div className={this.state.showViolate? 'violate-block':'violate-block hide'}
                    onClick={()=>{}}>
                    {this.renderViolate()}
                    <div className='divider'></div>
                    <div className='other-info'>
                        <div className='locate'>
                            <GetCity selectCity={
                                            (code, city, province)=>{
                                                // this.setState({province, city})
                                                // this.getInfo();
                                                this.props.changeCity(province, city);
                                            }}
                                            city={this.props.city}
                                            >
                            </GetCity>
                        </div>
                        <Link to='/citationFind' className='info-content'>
                            <ul className='info-item'>
                                <li className='info-label'>今日限行</li>
                                <li className='info-strict'>{this.props.info.controlNumberMsg}</li>
                            </ul>
                            
                            <ul className='info-item'>
                                <li className='info-label'>今日油价<span className='more-icon'></span></li>
                                <li>
                                    <p className='first-line'>95#</p>
                                    <p>{this.props.info.no95OilPriceMsg}<span className='unit'>（元／升）</span></p>
                                </li>
                            </ul>
                        </Link>
                    </div>
                    <div className='arrow up' onClick={()=>{this.setState({showViolate:false})}}></div>
                </div>
            </div>
        );
    }
}

export default HomeHeader;