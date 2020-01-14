import React,{Component} from "react";
import { Toast,Tabs,ListView} from 'antd-mobile';
import Tabbar from "../components/Tabbar";
import NetUtil from '../utils/NetUtil';
import '../styles/TopLine/topLineList.scss';
import xx from '../images/xiangxia.png';
import xs from '../images/xiangshang.png';
class TopLineList extends Component {
    constructor(props){
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => true,
        });
        this.state={
            tabs:[],
            wList:[],//文章列表
            dataSource,
            left:0,
            down:true,
            lineWidth:0,
            curIndex:0,
            pageNum:0,
            pageSize:10,
            curType:'头条',
            isLoading: true,
            hasMore:true,
        }
    }
    componentDidMount() {
        this.getTypeLists();
        this.getList();
        this.getRewarPop();
    }
    getRewarPop(){
        NetUtil.post('/api/opencar/task/getNoReadList',
                {"userId":"2","category":1})
            .then((res) => {
                if(res.code==0){
                    if(res.data.NoRead){
                        this.setState({
                            showPop:true,
                            rId:res.data.NoRead.id,
                            carnum:res.data.NoRead.tokenNum
                        })
                    }
                }
            });
    }
    hidePop(){
        this.setState({
            showPop:false
        })
        NetUtil.post('/api/opencar/task/alreadyRead',
                {"id":this.state.rId})
            .then((res) => {
                
            });
    }
    changeType(tab,index){
        this.setState({
            curIndex:index,
            down:true,
            pageNum:0,
            curType:this.state.tabs[index].title=="其它"?'':this.state.tabs[index].title,
            wList:[],
            dataSource:this.state.dataSource.cloneWithRows([]),
        },()=>{
            this.getList();
        })
       
    }
    changeMode(){
        this.setState({
            down:!this.state.down
        })
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
    goDetail(id){
        this.props.history.push(`/TopLineDetail/${id}`)
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
                <div className="articleList" key={rowID} onClick={()=>{this.goDetail(item.id)}}>
                    <div className="listItem">
                        <div className="listBox">
                            <img className="listBanner" src={item.headImage} alt=""/>
                        </div>
                        <div className="listDes">{item.title}</div>
                    </div>
                </div>
            );
        };
        return (
            <div className="topLineContainer">
                <div className="tabNav">
                    <div className="scrollBox">
                        <Tabs onChange ={this.changeType.bind(this)}
                            swipeable={true}
                            page={this.state.curIndex}
                            tabBarUnderlineStyle={{width:'0.4rem',marginLeft:'0.45rem'}}
                            tabs={this.state.tabs} 
                            renderTabBar={props => <Tabs.DefaultTabBar   {...props}  />}
                            >
                
                        </Tabs>
                    </div>
                    <div className="iconBox" onClick={this.changeMode.bind(this)}> 
                         <img className="dropIcon" src={this.state.down?xx:xs} alt=""/>  
                    </div>
                </div>
                <div className={!this.state.down?'topCon':'topCon noTopCon'}>
                    {
                        this.state.tabs.map((item,index)=>{
                            return(
                                <div className="topConItem" key={index} onClick={()=>{this.changeType('',index)}}>
                                    <p className={this.state.curIndex==index?'topConActiveText':''}>{item.title}</p>
                                </div>
                            )
                        })
                    }
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
                <Tabbar current="1"/>
            </div>
        );
    }
}

export default TopLineList

