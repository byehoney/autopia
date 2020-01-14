import React,{Component} from "react";
import { Toast } from 'antd-mobile';
import NetUtil from '../../utils/NetUtil';
import TopNav from '../../components/TopNav/TopNav';
import './topLineDetail.css';
import loveGrey from '../../images/xh_grey.png';
import loveLight from '../../images/xh_light.png';
import evaGrey from '../../images/eva_grey.png';
import shareGrey from '../../images/share_grey.png';
import { Item } from "antd-mobile/lib/tab-bar";
class TopLineDetail extends Component {
    constructor(props){
        super(props)
        this.state={
            author:{},
            newsDetail:{},
            dianzanStatus:1,
            zanNews:0,
            disList:[],
            evaCount:0,
            ableClick:true//点赞可否点击
        }
    }
    componentDidMount(){
        console.log(this)
        this.getDetails();
        this.getStartDisList();
    }
    getDetails(){//获取文章详情
        Toast.loading('拼命加载中',0);
        NetUtil.post('/api/info/news/newsDetail',
                    {id:this.props.match.params.id,category: 'news',userId:''})
                .then((res) => {
                    Toast.hide();
                    if(res.code==0){
                        this.setState({
                            newsDetail:res.data.newsDetail,
                            author:res.data.author,
                            dianzanStatus:res.data.newsDetail.dianzanStatus,
                            zanNews:res.data.newsDetail.zanNews,
                            isZan:res.data.newsDetail.dianzanStatus==0?true:false
                        })
                    }else{
                        Toast.info(res.message, 1);
                    }
                });
    }
    getStartDisList(){//获取评论列表
        NetUtil.post('/api/info/news/dicussList',
                    {newsitemId:this.props.match.params.id,category: 'news_discuss',pageNum: 1,pageSize: 2,userId:''})
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
    signLove(nums){
        if(this.state.ableClick==false){
            return;
        }
        this.setState({
            ableClick:false
        })
        NetUtil.post('/api/info/news/dianzan',
            {id:this.props.match.params.id,num: nums,category: 'news',userId:''})
        .then((res) => {
            if(res.code=="0"){
                this.setState({
                    dianzanStatus:res.data.dianzanStatus,
                    zanNews:res.data.dianzanNum,
                })
            }
            this.setState({
                ableClick:true
            })
        });
    }
    zan(id,nums,index){
        if(this.state.ableClick==false){
            return;
        }
        this.setState({
            ableClick:false
        })
        // if(!this.props.userId){
        //     this.showLogin(this.props.pop);
        //     return;
        // }
        NetUtil.post('/api/info/news/dianzan',
            {id:id,category: 'news_discuss',num:nums,userId:''})
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
                    })
                }
                this.setState({
                    ableClick:true
                })
        });
    }
    back(){
        this.props.history.go(-1);
    }
    render() {
        return(
            <div className="detailContaienr">
                <TopNav title="头条详情" back={()=>{this.back()}}></TopNav>
                <p className="detailTitle">{this.state.newsDetail.title}</p>
                <div className="w-info">
                    <div className="auth">
                        <img className="icon" src={this.state.author.authorHeadimgurl} alt=""/>
                        <p className="auth-name">{this.state.author.authorName}</p>
                    </div>
                    <p className="date">{this.state.newsDetail.updateTime}</p>
                </div>
                <div ref="detailinner" className="detailinner" dangerouslySetInnerHTML = {{ __html: this.state.newsDetail.content }} />
                <div className="divide"></div>
                <div className="evaContainer">
                    <div className="evaTitle">评论</div>
                    <div className="evaList">
                        {
                            this.state.disList.map((item,index)=>{
                                return(
                                    <div className="evaItem" key={item.id}>
                                        <img src={item.headUrl} className="atv"/>
                                        <div className="evaContent">
                                            <p className="name">{item.nickName}</p>
                                            <div className="dateLove">
                                                <p className="time">{item.createTime}</p>
                                                <p className="love" onClick={()=>{this.zan(item.id,item.dianzanStatus==0?-1:1,index)}}>
                                                    <img src={item.dianzanStatus==0?loveLight:loveGrey} alt="" className="loveIcon"/>
                                                    <span className="loveNum">{item.dianzanNumber}</span>
                                                </p>
                                            </div>
                                            <p className="text">{item.content}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <p className="tip">查看全部{this.state.evaCount}条评论</p>
                    </div>
                </div>
                <div className="fixBottom">
                    <p className="read">27683 人阅读了</p>
                    <div className="fun">
                        <div className="heart" onClick={()=>{this.signLove(this.state.dianzanStatus==0?-1:1)}}>
                            <img  src={this.state.dianzanStatus==0?loveLight:loveGrey} alt="" className="heartIcon"/>
                            <span className="num">{this.state.zanNews}</span>
                        </div>
                        <div className="eva">
                            <img  src={evaGrey} alt="" className="plIcon"/>
                            <span className="num">{this.state.evaCount}</span>
                        </div>
                        <div className="share">
                            <img  src={shareGrey} alt="" className="shareIcon"/>
                            <span className="num">222</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default TopLineDetail