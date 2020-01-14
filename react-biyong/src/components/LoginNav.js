import React, { Component } from 'react';
import '../styles/loginnav.scss';

class LoginNav extends Component {
    state = { 
        show: false
    }
    showLogin() {
        this.setState({
            show: true
        })
    }
    hideLogin() {
        this.setState({
            show: false
        })
    }
    render() {
        return (
            <div className={this.state.show?'mask show':'mask'}>
                <div className='login-popup'>
                    <div className='login-title'>您还未登录</div>
                    <div className='login-subtitle'>请先登录后再进行操作</div>
                    <div className='login-pbg'></div>
                    <div className='login-btns'>
                        <div className='login-btn'
                            onClick={()=>{
                                this.hideLogin()
                            }}>暂不登录</div>
                        <div className='login-btn blue'
                            onClick={()=>{
                            if(this.props.from == 'mini') {
                                window.wx.miniProgram.redirectTo({url: '/pages/login/login?prev='+this.props.prev})
                            }
                        }}>立即登录</div>
                    </div>
                </div>

            </div>
        );
    }
}

export default LoginNav;
