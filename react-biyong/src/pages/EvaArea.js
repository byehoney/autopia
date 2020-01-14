import React,{Component} from "react";
import { connect } from 'react-redux'
import BackBtn from "../components/BackBtn";
import { Toast ,TextareaItem} from 'antd-mobile';
import NetUtil from '../utils/NetUtil';
import '../styles/TopLine/topLineEva.scss'
const strTrim =  (str) => {
	return str.replace(/(^\s*)|(\s*$)/g, "");
};
class EvaArea extends Component {
    constructor(props){
        super(props)
        this.state={
            content:'',
        }
    }
    textChange(value){
        if(value.length>200){
            Toast.info('最多只能评论200字', 1);
            return;
        }
        this.setState({
            content:value
        })
    }
    sendDis(){
        if(!strTrim(this.state.content).length){
            Toast.info('请输入评论内容', 1);
            return;
        }
        NetUtil.post('/api/info/news/dicussAdd',{
            newsitemId: this.props.match.params.id,
            content:this.state.content,
            nickName:this.props.user.nickName,
            headUrl:this.props.user.avatar,
		    userId:this.props.user.userId
        }).then((res)=>{
            if(res.code==0){
                this.props.history.push(`/topLineDetail/${this.props.match.params.id}`)
            }else{
                Toast.info('评论失败', 1);
            }
        })
    }
    render() {
        return (
            <div className="evaContainer">
                <TextareaItem
                    placeholder="优质评论将会被优先展示"
                    rows={7}
                    count={200}
                    maxLength={200}
                    onChange={this.textChange.bind(this)}
                />
                <div className={`${this.state.content.length>0?'evaBtn':'evaBtn disable'}`} onClick={this.sendDis.bind(this)}>发送</div>
                <BackBtn from={this.props.user.from}/>
            </div>
        );
    }
}
export default connect(state=>{
    return {
        user:state.user,
    }
})(EvaArea);