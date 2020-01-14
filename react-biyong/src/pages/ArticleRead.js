import React from "react";
import { connect } from 'react-redux'
import BackBtn from "../components/BackBtn";
import NetUtil from '../utils/NetUtil';
import { Link } from 'react-router-dom';
import book from '../images/yuedu.png'
import '../styles/read.scss'
class ArticleRead extends React.Component {
    constructor(props){
        super(props)
        this.state={
            coinNum:0,
            readNum:0,
        }
    }
    componentDidMount() {
        this.getData();
    }
    getData(){
        NetUtil.post('/api/info/opencar/readQuery',{
            userId:this.props.user.userId
        }).then((res)=>{
            console.log(res)
            if(res.code==0){
                this.setState({
                    coinNum:res.data.Read.cartoken,
                    readNum:res.data.Read.readNum
                })
            }
        })
    }
    render() {
        return (
            <div className="readContianer">
                <div className="mainBox">
                    <img className="book" src={book} alt=""/>
                    <p className="title">今日已阅读 <span className="num">{this.state.readNum}</span> 篇</p>
                </div>
                <ul className="rule">
                    <li>阅读1篇文章20秒以上，奖励{this.state.coinNum}币</li>
                    <li>每天可获得3次奖励</li>
                    <li>一天内重复浏览相同文章无效</li>
                </ul>
                <Link to="/topLineList">
                    <div className="readBtn">去阅读</div>
                </Link>
                <BackBtn from={this.props.user.from}/>
            </div>
        )
    }
}
export default connect(state=>{
    return {
        user:state.user,
    }
})(ArticleRead);