import React from "react";
import './index.css';
import Tabbar from '../../components/tabbar/Tabbar';
import addIcon from '../../images/add_icon.png';
import localIcon from '../../images/local_icon.png';
import logoIcon from '../../images/logo_icon.png';
import zanIcon from '../../images/zan_icon.png';
import evaIcon from '../../images/eva_icon.png';
import { Carousel,Tabs,ListView,Toast} from 'antd-mobile';
import NetUtil from '../../utils/NetUtil';
class Index extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        props.cacheLifecycles.didCache(this.componentDidCache)
        props.cacheLifecycles.didRecover(this.componentDidRecover)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => true,
        });
        this.state = {
            data: ['1', '2', '3'],
            wList:[],//文章列表
            dataSource,
            curIndex:0,
            pageNum:1,
            pageSize:10,
            curType:'头条资讯',
            isLoading: true,
            hasMore:true,
            tabs:[],
            serveList:[{
                imgUrl:require('../../images/wz_dj_icon.png'),
                text:'违章代缴'
            },{
                imgUrl:require('../../images/wz_dj_icon.png'),
                text:'罚单代缴'
            },{
                imgUrl:require('../../images/wz_dj_icon.png'),
                text:'车辆年检'
            },{
                imgUrl:require('../../images/wz_dj_icon.png'),
                text:'爱车估值'
            },{
                imgUrl:require('../../images/wz_dj_icon.png'),
                text:'周边路况'
            },{
                imgUrl:require('../../images/wz_dj_icon.png'),
                text:'今日油价'
            },{
                imgUrl:require('../../images/wz_dj_icon.png'),
                text:'自驾出游'
            },{
                imgUrl:require('../../images/wz_dj_icon.png'),
                text:'特约代驾'
            },{
                imgUrl:require('../../images/wz_dj_icon.png'),
                text:'海外租车'
            },{
                imgUrl:require('../../images/wz_dj_icon.png'),
                text:'全部服务'
            }],
            isLogin:true
        }
    }
    componentDidRecover = () => {
        console.log('被恢复时');
        // 强制更新
        this.forceUpdate();
    }
    componentDidMount() {
        console.log(this)
        this.getTypeLists();
        this.getList();
    }
    getTypeLists(){
        NetUtil.post('/api/info/news/classify',
                {})
            .then((res) => {
                if(res.code==0){
                    let typeList=[]
                    res.data.newsClassifyListAll.map((item,index)=>{
                        return typeList[index]={title:item.classifyName};
                    })
                    this.setState({
                        curType:typeList[0].title,
                        tabs:typeList,
                        lineWidth:(100/typeList.length)
                    })
                }
            });
    }
    getList(){
        Toast.loading('拼命加载中', 0);
        NetUtil.post('/api/info/news/classify/newsList',
                    {classifyName:this.state.curType,pageNum: this.state.pageNum,pageSize: this.state.pageSize,platform:2})
                .then((res) => {
                    Toast.hide();
                    if(res.code==0){
                        console.log(res.data.newsEntityList.length)
                        if(res.data.newsEntityList.length==0){
                            this.setState({
                                hasMore:false,
                            })
                        }
              
                        let newList=[...this.state.wList,...res.data.newsEntityList];
                        this.setState({
                            pageNum:this.state.pageNum+1,
                            wList:newList,
                            totalCount:res.data.totalCount,
                            dataSource: this.state.dataSource.cloneWithRows(newList),
                            isLoading: false,
                        })
                    }
                });
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
        this.getList();
    }
    changeType(tab,index){
        console.log(tab,index)
        this.setState({
            curIndex:index,
            down:true,
            pageNum:1,
            curType:this.state.tabs[index].title=="其它"?'其他':this.state.tabs[index].title,
            wList:[],
            dataSource:this.state.dataSource.cloneWithRows([]),
        },()=>{
            this.getList();
        })
    }
    goDetail(e,id){
        this.props.history.push(`/topLineDetail/${id}`)
    }
    signLove(e,id){
        e.stopPropagation();
        console.log(id)
    }
    goEva(e,id){
        e.stopPropagation();
        console.log(id)
    }
    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return;
        };
    }
    render() {
        const row = (rowData, sectionID, rowID) => {
            let item = rowData;
            return (
                <div className="articleList" key={rowID} onClick={(e)=>{this.goDetail(e,item.id)}}>
                    <div className="listItem">
                        <div className="listBox">
                            <img className="listBanner" src={item.headImage} alt=""/>
                        </div>
                        <p className="listDes" style={{textOverflow: '-o-ellipsis-lastline',overflow: 'hidden',textOverflow: 'ellipsis',display: '-webkit-box',lineClamp: 2,WebkitBoxOrient: 'vertical'}}>{item.title}</p>
                        <div className="listFun">
                            <div className="read">{item.reading}人阅读了</div>
                            <div className="zanEva">
                                <div className="zan" onClick={(e)=>{this.signLove(e,item.id)}}>
                                    <img src={zanIcon} className="zanIcon" alt=""/>
                                    <span className="zanNum">{item.zanNews}</span>
                                </div>
                                <div className="eva" onClick={(e)=>{this.goEva(e,item.id)}}>
                                    <img src={evaIcon} className="evaIcon" alt=""/>
                                    <span className="evaNum">{item.commentNum}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <div className="homeMain">
                <div className="head">
                    <div className="headTop">
                        <p className="title">查违章</p>
                        <img className="addIcon" src={addIcon} alt="" />
                    </div>
                    {
                        this.state.isLogin?(
                            <div className="headMid">
                                <div className="midLeft">
                                    <img className="localIcon" src={localIcon} alt=""/>
                                    <span className="text">北京</span> 
                                </div>
                                <div className="midRight">
                                    今日限行 6和8
                                </div>
                            </div>
                        ):(
                            <div className="noLogin">
                                <img className="logo" src={logoIcon} alt=""/>
                                <div className="noTip">
                                    <p className="tipTop">立即登录</p>
                                    <p className="tipBottom">登录后开始查违章</p>
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                    this.state.isLogin?(
                        <div className="swiperContainer">
                            <Carousel
                                autoplay={false}
                                infinite
                                dots = {true}
                            >
                                {this.state.data.map((item,index) => (
                                    <div key={index} className="swiperSlide"> 
                                        <div className="wzItem">
                                            <div className="itemTitle">京QBJ016</div>   
                                            <div className="itemDetail">
                                                <div className="detail">
                                                    <div className="detailText">未处理</div>
                                                    <div className="detailNum">3</div>
                                                </div>
                                                <div className="detail">
                                                    <div className="detailText">罚款</div>
                                                    <div className="detailNum">500</div>
                                                </div>
                                                <div className="detail">
                                                    <div className="detailText">扣分</div>
                                                    <div className="detailNum">6</div>
                                                </div>
                                            </div>  
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    ):null
                }
                <div className={`content ${this.state.isLogin?'loginPadding':''}`}>
                    <div className="conTitle">
                        <div className="title">暖心服务</div>
                        <div className="more">More</div>
                    </div>  
                    <div className="conDetail">
                        {
                            this.state.serveList.map((item,index)=>{
                                return(
                                    <div className={`conItem ${(index+1)%5==0&&index!=0?"noRight":""}`} key={index}>
                                        <img src={item.imgUrl} className="conIcon" alt=""/>
                                        <p className="conName">{item.text}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="conTitle">
                        <div className="title">热门资讯</div>
                        <div className="more">More</div>
                    </div>  
                </div>
                <div className="scrollBar">
                    <Tabs onTabClick={(tab,index)=>{this.changeType(tab,index)}}  tabs={this.state.tabs} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}></Tabs>
                </div>
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
                    scrollRenderAheadDistance={100}
                    onEndReachedThreshold={100}
                />
                <Tabbar current='0'/>
            </div>
        )
    }
}

export default Index;