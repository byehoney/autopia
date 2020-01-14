import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { ListView } from 'antd-mobile';
import NetUtil from '../../utils/NetUtil.js';
import './ServiceDetail.scss';

class ServiceDetail extends Component {
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
            hide: false,
            img: ''
        }
    }
    componentDidMount() {
        this.setState({
            height: document.documentElement.clientHeight - findDOMNode(this.info).offsetHeight,
        })
        this.getImg()
        this.getData()
    }
    getImg() {
        NetUtil.post('/api/opencar/map/serviceIconQuery', {
            type: this.props.match.params.type
        }).then(json => {
            this.setState({
                img: json.data.ServiceIcon[0].imageUrl
            })
        })
    }
    getData() {
        NetUtil.get('/api/opencar/map/randomcomment')
            .then(json => {
            const list = json.data.randomcomment

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
        // this.getData();
    }
   
    render() {
        const row=(rowData, sectionID, rowID)=>{
            return(
                <div className='comment-item' key={rowID}>
                    
                    {rowData.headPortrait ?
                    <img src={rowData.headPortrait} alt='' className='comment-avatar'/>
                    :
                    <img src={require('../../images/gerentxNew.png')} alt='' className='author-avatar'/>
                    }
                    <div className='comment-info'>
                        <div className='comment-author'>
                            <div style={{display:'flex'}}>
                                <div className='comment-name'>{rowData.nikeName}</div>
                                <div className='active-reward'
                                    onClick={()=>{
                                        const u = navigator.userAgent;
                                        const agent = {
                                            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                                            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, 
                                            weixin: u.indexOf('MicroMessenger') > -1, 
                                        }
                                        if(agent.ios) {
                                            window.webkit.messageHandlers.onGoCarbClicked.postMessage();
                                        }
                                        if(agent.android) {
                                            window.Android.onGoCarbClicked();
                                        }
                                    }}>
                                    +C{rowData.rewardAmount}
                                </div>
                            </div>
                            <div>{rowData.createTime}</div>
                        </div>
                        <div>
                            {rowData.describe}
                        </div>
                        {/* {
                            rowData.imageList.length > 0 ? 
                            <div className='comment-imgs'>
                                {rowData.imageList.map(item => <img src={item} alt='' className='comment-img'/>)}
                            </div>
                            : null
                        } */}
                        {/* {
                            rowData.videoList && rowData.videoList.length > 0 ? 
                            <video src={rowData.videoList[0]} className='comment-video' controls></video>
                            : null
                        } */}
                        
                    </div>
                </div>
            )
        }
        
        return (
                <div className='service'>
                    {
                        !this.state.hide &&
                        <div className='service-info' ref={el => this.info = el}>
                            {this.state.img ?
                            <img src={this.state.img} alt='' className='service-img'/>
                            :
                            null
                            }
                        </div>
                    }          
                    
                    <div className='comment-list'>
                        <div className='title-label' onClick={()=>{this.setState({hide: !this.state.hide})}}></div>
                        <div className='comment-title'>服务评价</div>
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
                </div> 
        );
    }
}

export default ServiceDetail;