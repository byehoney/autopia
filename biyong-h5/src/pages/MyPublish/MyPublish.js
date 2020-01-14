import React, { Component } from 'react';
import {  Toast,ListView } from 'antd-mobile';
import './MyPublish.scss';
import NetUtil from '../../utils/NetUtil'
class MyPublish extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = { 
            list:[],
            isLoading: true,
            pageNum: 1,
            pageSize:10,
            hasMore:true,
            dataSource
        }
    }
    componentDidMount() {
        this.getData()
    }
    getData() {
        NetUtil.post('/api/opencar/map/nearHistory',
            {type:0,userId:this.props.match.params.userId,pageNum: this.state.pageNum,pageSize: this.state.pageSize})
        .then((res) => {
            if(res.code==0){
                console.log(res.data.nearHistory.length)
                if(res.data.nearHistory.length==0){
                    this.setState({
                        hasMore:false,
                    })
                }
        
                let newList=[...this.state.list,...res.data.nearHistory];
                this.setState({
                    pageNum:this.state.pageNum+1,
                    list:newList,
                    totalCount:res.data.totalCount,
                    dataSource: this.state.dataSource.cloneWithRows(newList),
                    isLoading: false,
                })
            }
        });
    }
    goDetail(id){
        // this.props.history.push(`/activity/${id}/564813857437937664`)
        const u = navigator.userAgent;
        const agent = {
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, 
            weixin: u.indexOf('MicroMessenger') > -1, 
        }
        if(agent.ios) {
            window.webkit.messageHandlers.onGoDetailClicked.postMessage(id);
        }
        if(agent.android) {
            window.Android.onGoDetailClicked(id);
        }
    }
    onEndReached = (event) => {
        
        if(!this.state.hasMore){
            return;
        }
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
    render() {
        const row=(rowData, sectionID, rowID)=>{
            let atv = rowData.headPortrait?rowData.headPortrait:require('../../images/gerentxNew.png');
            return(
                <div className='commentItem' key={rowID}>
                    <img src={atv} alt='' className='commentAvatar'/>
                    <div className='commentInfo'>
                        <div className='commentAuthor'>
                            <div className='commentName'>{rowData.nikeName}</div>
                            <div className="date">{rowData.createTime}</div>
                        </div>
                        <div className="commentContent">
                            {rowData.describe}
                        </div>
                        {
                            rowData.imageList&&rowData.imageList.length?(<div className='commentImgs'>
                            {rowData.imageList.map((item,index)=>{
                                return (<img key={index} src={item} alt='' className='commentImg'/>)
                            })}
                        </div>):null
                        }
                        {
                            rowData.videoList?( <div className="commentVideos">
                            <video controls className="commentVideo" src={rowData.videoList}></video>
                        </div> ):null
                        }
                        <div className="goDetail" onClick={()=>{this.goDetail(rowData.id)}}>
                            <div className="goText">查看详情</div>
                            <img className="icon" src={require('../../images/rightArrow.png')}  alt=""/>
                        </div> 
                    </div>
                </div>
            )
        }
        return(
            <div className="container">
                {
                    this.state.list.length?(
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderRow={row}
                            useBodyScroll
                            renderFooter={() => ( this.state.isLoading ? <div style={{ padding: 10, textAlign: 'center' }}>拼命加载中....</div> : '')}
                            pageSize={this.state.pageSize}
                            scrollRenderAheadDistance={500}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={10}
                        >
                        </ListView>
                    ):(
                        <div className="noData">
                            <img src={require('../../images/noData.png')} className="noIcon"/>
                            <p className="noTip">暂无发布哦！</p>
                        </div> 
                    )
                }
            </div>
        )
    }
}

export default MyPublish;