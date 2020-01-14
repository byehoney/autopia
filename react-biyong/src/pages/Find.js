import React,{Component} from "react";
import { connect } from 'react-redux'
import login from '../redux/loginAction';
import LoginNav from "../components/LoginNav";
import NetUtil from '../utils/NetUtil';
import { Link } from 'react-router-dom'
import Tabbar from "../components/Tabbar";
import '../styles/Find/find.scss';
import wzcx from '../images/chaweizhangFind.png';
import fjlk from '../images/fujinlu.png';
import fjr from '../images/fujinren.png';
import zbfw from '../images/zhoubianfu.png';
import cbfw from '../images/cfuwu.png'
import cgw from '../images/cgouwu.png';
import yx from '../images/youxi.png';
import arrow from '../images/bread.png';
class Find extends Component {
    constructor(props){
        super(props)
        this.state={
            pageNum:1,
            pageSize:10,
            list:[],
            total:0
        }
    }
    componentDidMount() {
        this.getData();
    }
    getData(){
        NetUtil.post('/api/opencar/goods/carOwnerService',
            {pageNum:this.state.pageNum,pageSize:this.state.pageSize})
            .then((res)=>{
                if(res.code==0){
                    this.setState({
                        total:res.data.carOwnerService.total,
                        list:res.data.carOwnerService.list,
                    })
                }
                console.log(res)
            })
    }
    showLogin() {
        console.log(this)
        this.loginNav.showLogin();
    }
    goViolate(){
        if(!this.props.user.userId){
            this.showLogin();
            return;
        }
        this.props.history.push('/CitationFind')
    }
    render() {
        return (
            <div className="findContainer">
                <div className="findBanner">
                    <p className="findTitle">发现</p>
                </div>
                <div className="findContent">
                    <div className="findBox">
                        <div className="findItem" onClick={this.goViolate.bind(this)}>
                            <img className="findImg" src={wzcx} alt=""/>
                            <div className="right">
                                <span className="findDes">违章查询</span>
                                <img className="findIcon" src={arrow} alt=""/>
                            </div>
                        </div>
                        <Link to="/nearbyRoad">
                            <div className="findItem">
                                <img className="findImg" src={fjlk} alt=""/>
                                <div className="right">
                                    <span className="findDes">附近路况</span>
                                    <img className="findIcon" src={arrow} alt=""/>
                                </div>
                            </div>
                        </Link>
                        <div className="findItem">
                            <img className="findImg" src={fjr} alt=""/>
                            <div className="right">
                                <span className="findDes">附近的人<span className="devp">(拼命开发中...)</span></span>
                                <img className="findIcon" src={arrow} alt=""/>
                            </div>
                        </div>
                        <div className="findItem">
                            <img className="findImg" src={zbfw} alt=""/>
                            <div className="right last">
                                <span className="findDes">周边服务<span className="devp">(拼命开发中...)</span></span>
                                <img className="findIcon" src={arrow} alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="findBox">
                        {
                            this.state.total>1?
                                (
                                    <Link to="/serviceList">
                                        <div className="findItem">
                                            <img className="findImg" src={cbfw} alt=""/>
                                            <div className="right">
                                                <span className="findDes">Car币服务</span>
                                                <img className="findIcon" src={arrow} alt=""/>
                                            </div>
                                        </div>
                                    </Link>
                                ):this.state.total==1?
                                (
                                    <Link to={`/productDetail/${this.state.list[0].goodsId}`}>
                                        <div className="findItem">
                                            <img className="findImg" src={cbfw} alt=""/>
                                            <div className="right">
                                                <span className="findDes">Car币服务</span>
                                                <img className="findIcon" src={arrow} alt=""/>
                                            </div>
                                        </div>
                                    </Link>
                                ):('')
                                
                        }
                        <Link to="/productList">
                            <div className="findItem">
                                    <img className="findImg" src={cgw} alt=""/>
                                    <div className="right last">
                                        <span className="findDes">Car币购物</span>
                                        <img className="findIcon" src={arrow} alt=""/>
                                    </div>
                            </div>
                        </Link>
                    </div>
                    {
                        this.props.user.from!='mini'?(
                            <div className="findBox">
                                <a href="http://h.4399.com/wap/new.html">
                                    <div className="findItem">
                                        <img className="findImg" src={yx} alt=""/>
                                        <div className="right last">
                                            <span className="findDes">游戏</span>
                                            <img className="findIcon" src={arrow} alt=""/>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ):('')
                    }
                </div>
                <LoginNav 
                    ref={r => this.loginNav = r}
                    key={this.props.user.userId}
                    userId={this.props.user.userId}
                    from={this.props.user.from}
                    prev="find"/>
                <Tabbar current="2"/>
            </div>
        )
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
})(Find);