import React,{Component} from "react";
import NetUtil from '../../utils/NetUtil';
import '../../styles/TopLine/toplineDetail.scss';
import { Toast,ListView } from 'antd-mobile';
class EvaList extends Component {
    constructor(props){
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => true,
        });
        this.state={
            height: document.documentElement.clientHeight * 1,
            dataSource,
            isLoading: true,
            hasMore:true,
            disList:[],//评论列表
            evaCount:0,
            pageNum:0,
            pageSize:5,
            isShow:false,//超过100是否展示全部
            ableClick:true//点赞个人时候能够点击  true可以  false不可以
        }
    }
    componentDidMount() {
        this.getDisList();
    }
    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if(!this.state.hasMore){
            return;
        }
        if (this.state.isLoading || !this.state.hasMore) {
          return;
        }
        this.setState({ isLoading: true });
        this.getDisList();
    }
    getDisList(){//获取评论列表
        NetUtil.post('/api/info/news/dicussList',
                    {newsitemId:this.props.id,category: 'news_discuss',pageNum: this.state.pageNum,pageSize: this.state.pageSize,userId:this.props.userId})
                .then((res) => {
                    if(res.code==0){
                        if(!res.data.newsDiscussList.length){
                            this.setState({
                                hasMore:false,
                                isLoading:false,
                            })
                            return
                        }
                        this.state.pageNum++;
                        res.data.newsDiscussList.map((item,index)=>{
                            return item.isShow=false
                        })
                        let newList=[...this.state.disList,...res.data.newsDiscussList];
                        this.setState({
                            disList:[...this.state.disList,...res.data.newsDiscussList],
                            evaCount:res.data.totalCount,
                            dataSource: this.state.dataSource.cloneWithRows(newList),
                            isLoading: false,
                        })   
                    }
                });
    }
    isShowAll(id){
        let newList = this.state.disList.map(item => {
            if(item.id == id) {
                item.isShow=!item.isShow;
            }
            return item
        })
        this.setState({
            disList:newList,
            dataSource: this.state.dataSource.cloneWithRows(newList),
        })
    }
    showLogin(pop){
        pop.showLogin()
    }
    dianzan(id,nums){
        if(this.state.ableClick==false){
            return;
        }
        this.setState({
            ableClick:false
        })
        if(!this.props.userId){
            this.showLogin(this.props.pop);
            return;
        }
        NetUtil.post('/api/info/news/dianzan',
                    {id:id,category: 'news_discuss',num:nums,userId:this.props.userId})
                .then((res) => {
                    if(res.code==='0'){
                        let newList = this.state.disList.map(item => {
                            if(item.id == id) {
                                item.dianzanStatus=res.data.dianzanStatus;
                                item.dianzanNumber=res.data.dianzanNum;
                            }
                            return item
                        })
                        this.setState({
                            disList:newList,
                            dataSource: this.state.dataSource.cloneWithRows(newList),
                        })
                    }
                    this.setState({
                        ableClick:true
                    })
                });
    }
    render() {
        const row = (rowData, sectionID, rowID) => {
            let item = rowData;
            return (
                <div className="eva-content" key={rowID}>
                    <div className="eva-item">
                        <div className="eva-atv">
                            <img src={item.headUrl} alt=""/>
                        </div>
                        <div className="eva-detail">
                            <div className="eva-name">{item.nickName}</div>
                            <div className="eva-infos">
                                <p className="eva-date">{item.createTime}</p>
                                <div className="eva-state"  onClick={()=>{this.dianzan(item.id,item.dianzanStatus==0?-1:1)}}>
                                    <img className="eva-icon" src={item.dianzanStatus==1?this.props.sc:this.props.qsc}  alt=""/>
                                    <p className={`${item.dianzanStatus==0?"plred":"eva-num"}`}>{item.dianzanNumber}</p>
                                </div>
                            </div>
                            <div className="eva-txt">
                            {
                                item.content.length<101?
                                (<p>{item.content}</p>)
                                :
                                (item.isShow?<div><p>{item.content}</p><em onClick={()=>{this.isShowAll(item.id)}}>收起全文</em></div>:<div><p>{item.content.substr(0,98)+'...'}</p><em onClick={()=>{this.isShowAll(item.id)}}>全文</em></div>)
                            }
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <div className="evaContainer">
                <div className="eva-box" id='all'>
                    <div className="eva-title">全部评论({this.props.count})</div>
                    {
                        this.state.disList.length<=0?
                        (<div className="evaLists" style={{paddingBottom:'100px'}}>快来抢沙发</div>)
                        :
                        (
                            <div style={{position:'relative'}}>
                                <ListView
                                    style={{background:'#fff'}}
                                    ref={el => this.lv = el}
                                    dataSource={this.state.dataSource}
                                    renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                                    {this.state.isLoading ? '拼命加载中...' : ''}
                                    </div>)}
                                    renderRow={row}
                                    className="am-list"
                                    pageSize={this.state.pageSize}
                                    useBodyScroll
                                    onEndReached={this.onEndReached}
                                    scrollRenderAheadDistance={10}
                                    onEndReachedThreshold={10}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default EvaList;