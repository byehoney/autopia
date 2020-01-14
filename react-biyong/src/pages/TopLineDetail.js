import React,{Component} from "react";
import { connect } from 'react-redux'
import { ActionSheet,Toast } from 'antd-mobile';
import NetUtil from '../utils/NetUtil';
import EvaList from '../components/TopLine/EvaList';
import login  from '../redux/loginAction';
import LoginNav from "../components/LoginNav";
import BackBtn from "../components/BackBtn";
import '../styles/violate.css';
import '../styles/TopLine/toplineDetail.scss';
import ck from '../images/chakan.png';
import sc from '../images/xh1.png';
import qSc from '../images/xh2.png';
import eva from '../images/pinglun.png';
import back from '../images/back.png';
import shareIcon from '../images/fenxiang.png';
import wx from '../images/wx.png';
import carIcon from '../images/logincar.png'
let timer = null;
let time = 0;
class TopLineDetail extends Component {
    constructor(props){
        super(props)
        this.state={
            newsDetail:'',
            loveStatus:1,//点赞状态（1未点赞  0 已点赞）
            isZan:false,
            loveNum:0,//点赞个数
            flag:true,//点赞flag  true可以点  false 不可以点
            pageNum:0,
            pageSize:10,
            scrollHeight:0,
            startTime:new Date().getTime(),
            showPop:false,
            carnum:0,
            rId:'',
        }
    }
    componentDidMount() {
        window.scrollTo(0,0);
        this.getDetails();
        this.getStartDisList();
        if(this.props.user.userId){
            timer=setInterval(()=>{
                time++
                if(time==21){
                    this.getReadTimes();
                    clearInterval(timer);
                }
            },1000)
        }
    }
    getReadTimes(){
        NetUtil.post('/api/info/opencar/readStatistics',
            {newsId:this.props.match.params.id,readDuration:21,userId:this.props.user.userId,whetherAddHistory:0})//whetherAddHistory 0 阅读中  1阅读完
        .then((res) => {
            if(res.code==0){
                this.getRewarPop();
            }
        });
    }
    getRewarPop(){
        NetUtil.post('/api/opencar/task/getNoReadList',
                {"userId":this.props.user.userId,"category":1})
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
    getDetails(){//获取文章详情
        Toast.loading('拼命加载中',0);
        NetUtil.post('/api/info/news/newsDetail',
                    {id:this.props.match.params.id,category: 'news',userId:this.props.user.userId})
                .then((res) => {
                    Toast.hide();
                    if(res.code==0){
                        this.setState({
                            newsDetail:res.data.newsDetail,
                            loveStatus:res.data.newsDetail.dianzanStatus,
                            loveNum:res.data.newsDetail.zanNews,
                            isZan:res.data.newsDetail.dianzanStatus==0?true:false
                        })
                    }else{
                        Toast.info(res.message, 1);
                    }
                });
    }
    getStartDisList(){//获取评论列表
        NetUtil.post('/api/info/news/dicussList',
                    {newsitemId:this.props.match.params.id,category: 'news_discuss',pageNum: this.state.pageNum,pageSize: this.state.pageSize,userId:this.props.user.userId})
                .then((res) => {
                    if(res.code==0){
                        this.setState({
                            disList:res.data.newsDiscussList,
                            evaCount:res.data.totalCount
                        })
                    }else{
                        Toast.info(res.message, 1);
                    }
                });
    }
    signLove(){//点赞 取消点赞
        if (this.state.flag == false) {
            return
        }
        if(!this.props.user.userId){
            this.showLogin();
            return;
        }
        this.setState({
            zan: 'pulse'
        })
        setTimeout(() => {
            this.setState({
                zan: ''
            })
        }, 500)
        if (this.state.isZan) {
            this.foZan('-1')
        } else {
            this.foZan("1")
        }
    }
    foZan(nums){
        this.setState({
            flag:false
        })
        NetUtil.post('/api/info/news/dianzan',
            {id:this.props.match.params.id,num: nums,category: 'news',userId:this.props.user.userId})
        .then((res) => {
            if(res.code=="0"){
                if(nums=='1'){
                    this.setState({
                        loveStatus:0,
                        loveNum:res.data.dianzanNum,
                        isZan:true,
                    })
                }else{
                    this.setState({
                        loveStatus:1,
                        loveNum:res.data.dianzanNum,
                        isZan:false
                    })
                }
            }else{
    
            }
            this.setState({
                flag:true
            })
            console.log(res)
        });
    }
    showSharePop(){//分享

            ActionSheet.showShareActionSheetWithOptions({
              options: [{icon:<img src={wx} alt=""/>,title:'微信好友'}],
            },
            (buttonIndex) => {
              console.log(buttonIndex)
              // also support Promise
            //   return new Promise((resolve) => {
            //     Toast.info('closed after 1000ms');
            //     setTimeout(resolve, 1000);
            //   });
            });
    
    }
    toEva(){//跳转评论
        if(!this.props.user.userId){
            this.showLogin();
            return;
        }
        this.props.history.push(`/EvaArea/${this.props.match.params.id}`)
    }
    goback(){
        if(this.props.location.state&&this.props.location.state.from){
            this.props.history.go(-1)
        }else{
            this.props.history.push('/home');
        }
    }
    toLogin() {
        if(this.props.user.from == 'mini') {
            window.wx.miniProgram.redirectTo({url: '/pages/login/login'})
        }
    }
    showLogin() {
        console.log(this)
        this.loginNav.showLogin();
    }
    componentWillUnmount(){
        if(!this.props.user.userId){
            return;
        }
        let endTime = new Date().getTime();
        let readDuration = parseInt((endTime - this.state.startTime)/1000)
        NetUtil.post('/api/info/opencar/readStatistics',
            {newsId:this.props.match.params.id,readDuration:readDuration+'',userId:this.props.user.userId,whetherAddHistory:1})
        .then((res) => {
            
        });
        clearInterval(timer);
    }
    render() {
        return (
            <div className="mainContainer">
                <div className="detailContaienr">
                    <p className="detailTitle">{this.state.newsDetail.title}</p>
                    <div className="w-info">
                        <div className="auth">
                            <p className="icon"></p>
                            <p className="auth-name">文/{this.state.newsDetail.author}</p>
                        </div>
                        <p className="type">{this.state.newsDetail.classifyName}</p>
                        <p className="date">{this.state.newsDetail.updateTime}</p>
                    </div>
                    <div ref="detailinner" className="detailinner" dangerouslySetInnerHTML = {{ __html: this.state.newsDetail.content }} />
                    <div className="w-data">
                        <div className="w-data-detail">
                            <div className="w-borderK w-border">
                                <img src={ck}  alt=""/>
                            </div>
                            <p>{this.state.newsDetail.reading}</p>
                        </div>
                        <div className="w-data-detail" onClick={this.signLove.bind(this)}>
                            <div className={`w-border ${this.state.loveStatus==0?"red":''}`}>
                                <img className={`animated infinite ${this.state.zan}`} src={this.state.loveStatus==0?qSc:sc} alt=""/>
                            </div>
                            <p>{this.state.loveNum}</p>
                        </div>
                        <div className="w-data-detail">
                            <div className="w-border">
                                <img src={eva} alt="" />
                            </div>
                            <p>{this.state.evaCount}</p>
                        </div>
                    </div>
                </div>
                <div className="divide"></div>
                <EvaList sc={sc} qsc={qSc} userId={this.props.user.userId} pop={this.loginNav}  id={this.props.match.params.id} list={this.state.disList} count={this.state.evaCount}/>
                <div className='botFix'>
                    <div className='left'>
                        <img bindtap='back' src={back} alt="" onClick={this.goback.bind(this)}/>
                        <div className="inputArea" onClick={()=>{this.toEva()}}></div>
                    </div>
                    <div className='right'>
                        <img className={`animated infinite ${this.state.zan}`} src={this.state.loveStatus==0?qSc:sc} onClick={this.signLove.bind(this)} alt=""/>
                        <img style={{display:'none'}} src={shareIcon} onClick={()=>{this.showSharePop()}} alt=""/>
                        <img src={eva} onClick={()=>{this.toEva()}} alt=""/>
                    </div>
                </div>
                <div className="fixed" style={{display:this.state.showPop?'block':'none'}}>
                    <div className="fixedcon">
                        <div>恭喜您完成任务</div>
                        <img src={carIcon} alt=""/>
                        <p>奖励Car币 <span>{this.state.carnum}</span> 个</p>
                        <div className="btn" onClick={this.hidePop.bind(this)}>知道了</div>
                    </div>
                        
                </div>
                <LoginNav 
                    ref={r => this.loginNav = r}
                    key={this.props.user.userId}
                    userId={this.props.user.userId}
                    from={this.props.user.from}
                    prev={`TopLineDetail/${this.props.match.params.id}`}/>
   
            </div>
        );
    }
}
export default connect(state=>{
    return {
        user:state.user,
    }
},dispatch=>{
    return{
        login: user => dispatch(login(user))
    }
})(TopLineDetail);