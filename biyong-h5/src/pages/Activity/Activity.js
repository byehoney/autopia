import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { ListView } from 'antd-mobile';
import NetUtil from '../../utils/NetUtil.js';
import './Activity.scss';

class Activity extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = { 
            list: [],
            isLoading: true,
            pageno: 1,
            pageSize:10,
            dataSource,
            data: {},
            replyList: [],
            imageList: [],
            videoList: []
        }
    }
    componentDidMount() {
        this.setState({
            height: document.documentElement.clientHeight - findDOMNode(this.info).offsetHeight - findDOMNode(this.app).offsetHeight,
        })
        
        this.getInfo()
        this.getData()
    }
    getInfo() {
        NetUtil.post('/api/opencar/map/nearDetail', {
            id: this.props.match.params.id,
            userId: this.props.match.params.userId
        }).then(json => {
            const data = json.data.socialMap

            this.setState({
                data: data,
                imageList: data.imageList,
                videoList: data.videoList,
                // videoList: ['http://service.chetuobang.com/video/155702653981429440.mp4'],
                replyList: data.replyList
            })
        }) 
    }
    getData() {
        NetUtil.post('/api/opencar/map/nearHistory', {
            id: this.props.match.params.id,
            pageNum: this.state.pageno,
            pageSize: this.state.pageSize,
            type: 1
        }).then(json => {
            const list = json.data.nearHistory

            this.setState({
                list: list, 
                pageno: this.state.pageno + 1,
                dataSource: this.state.dataSource.cloneWithRows(list),
                isLoading: false,
            })
        }) 
        
    }
    onEndReached = (event) => {
        
        // if(!this.state.hasMore){
        //     return;
        // }
        if (this.state.isLoading) {
          return;
        }
        this.setState({ 
            isLoading: true, 
            hide: true,
            height: document.documentElement.clientHeight,
        });
        this.getData();
    }
    toApp() {
        const u = navigator.userAgent;
        const agent = {
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, 
            weixin: u.indexOf('MicroMessenger') > -1, 
        }
        if(agent.ios) {
            window.location.href="https://itunes.apple.com/cn/app/id1458574816?mt=8";
        }
        if(agent.android) {
            window.location.href="https://a.app.qq.com/o/simple.jsp?pkgname=com.chetuobang.ctbapp&from=groupmessage&isappinstalled=0";
        }
        // if(agent.weixin) {
        //     alert("请在浏览器打开");
        // }
    }
    render() {
        const row=(rowData, sectionID, rowID)=>{
            return(
                <div className='comment-item' key={rowID}>
                    <img src={rowData.headPortrait} alt='' className='comment-avatar'/>
                    <div className='comment-info'>
                        <div className='comment-author'>
                            <div className='comment-name'>{rowData.nikeName}</div>
                            <div>{rowData.createTime}</div>
                        </div>
                        <div>
                            {rowData.describe}
                        </div>
                        {
                            rowData.imageList.length > 0 ? 
                            <div className='comment-imgs'>
                                {rowData.imageList.map(item => <img src={item} alt='' className='comment-img'/>)}
                            </div>
                            : null
                        }
                        {
                            rowData.videoList && rowData.videoList.length > 0 ? 
                            <video src={rowData.videoList[0]} className='comment-video' controls></video>
                            : null
                        }
                        
                    </div>
                </div>
            )
        }
        const data = this.state.data
        
        return (
                <div className='active'>
                {
                    this.state.hide ? null :
                    <div className='active-info' ref={el => this.info = el}>
                        <div className='author-info'>
                            {data.headPortrait ?
                            <img src={data.headPortrait} alt='' className='author-avatar'/>
                            :
                            <img src={require('../../images/gerentxNew.png')} alt='' className='author-avatar'/>
                            }
                            <div className='author-content'>
                                <div className='author-name'>
                                    <div>{data.nikeName}</div>
                                    <div className='active-reward'>+C{data.uploadCarToken}</div>
                                </div>
                                <div className='active-news'>
                                    <div className='active-location'>{this.props.match.params.location}</div>
                                    <div>{data.createTime}</div>
                                </div>
                            </div>
                        </div>
                        <div className='active-content'>
                            {data.describe}
                        </div>
                        {
                            this.state.replyList.length > 0 ? null :
                            <div className='active-label'>
                                暂未有人通报路况恢复
                            </div>
                        }
                        {
                            this.state.imageList.length > 0 ? 
                            <div className='active-imgs'>
                                {this.state.imageList.map(item => <img src={item} />)}
                            </div>
                            : null
                        }
                        {
                            this.state.videoList && this.state.videoList.length > 0 ? 
                            <video src={this.state.videoList[0]} className='active-video' controls></video>
                            : null
                        }
                        
                    </div>
                }          
                
                <div className='comment-list'>
                    <div className='title-label' onClick={()=>{this.setState({hide: !this.state.hide})}}></div>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        renderRow={row}
                        renderFooter={() => ( this.state.isLoading ? <div style={{ padding: 10, textAlign: 'center' }}>loading....</div> : '')}
                        pageSize={this.state.pageSize}
                        scrollRenderAheadDistance={500}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={10}
                        style={{
                            height: this.state.height,
                            overflow: 'auto',
                        }}
                    >
                    </ListView>
                </div>
                <div className='app-img' 
                    ref={el => this.app = el}
                    onClick={this.toApp.bind(this)}>
                </div>
            </div> 
        );
    }
}

export default Activity;