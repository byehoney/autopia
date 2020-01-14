import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../styles/inviteFriend.scss';
import NetUtil from '../utils/NetUtil';
import copy from 'copy-to-clipboard';
import { Toast } from 'antd-mobile';

class InviteFriend extends Component {
    state={
        inviteNum: '',
        difference: '',
        invitationCode: '',
        showCopy: false
    }
    componentDidMount() {
        // NetUtil.post('/api/opencar/task/getMyInvitation',{
        //     userId: this.props.user.userId
        // }).then(json=>{
        //     this.setState({
        //         inviteNum: json.data.myInvitationInfo.inviteNum,
        //         difference: json.data.myInvitationInfo.difference
        //     })
        // })
        // NetUtil.post('/api/opencar/task/getInvitationCode',{
        //     userId: this.props.user.userId
        // }).then(json=>{
        //     this.setState({
        //         invitationCode: json.data.InvitationCode.invitationCode
        //     })
        // })
    }
    render() {
        return (
            <div className='invite'>
                <div className='invite-info'>
                    <div className='invite-logo'></div>
                    <div className='invite-title'>
                        已邀请 <span className='invite-total'>{this.state.inviteNum}</span> 个
                    </div>
                    <div className='invite-tips'>
                        距离下一次奖励还差 <span className='invite-no'>{this.state.difference}</span> 人，让好朋友助你一臂之力
                    </div>
                </div>
                <div className='invite-rules'>
                    <div className='invite-item'>邀请3个好友，奖励30Car币</div>
                    <div className='invite-item'>邀请3个好友，奖励30Car币</div>
                    <div className='invite-item'>邀请3个好友，奖励30Car币</div>
                    <div className='invite-item'>邀请3个好友，奖励30Car币</div>
                </div>
                <div className='invite-btn' 
                    onClick={()=>{
                        this.setState({
                            showCopy: true
                        })
                    }}>邀请好友</div>

                <div className={this.state.showCopy ? 'mask show' : 'mask'}>
                    <div className='copy-popup'>
                        <div className='copy-title'>邀请码已复制</div>
                        <div className='copy-subtitle'>发送到微信／QQ立即邀请好友</div>
                        <div className='copy-btn'
                            onClick={()=>{
                                this.setState({
                                    showCopy: false
                                })
                                if(copy(this.state.invitationCode)){
                                    Toast.info('邀请码已复制成功，请粘贴给好友');
                                }else {

                                }
                            }}>
                            粘贴給好友
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
})
  // 连接 tore 和组件
export default connect(mapStateToProps)(InviteFriend);