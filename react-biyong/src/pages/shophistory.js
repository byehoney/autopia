import React,{Component} from "react";
import { ListView } from 'antd-mobile';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import NetUtil from '../utils/NetUtil';
import "../styles/shophistory.scss"
import nourl from "../images/carno.png"
import BackBtn from "../components/BackBtn";
class Shophistory extends Component{
    constructor(props){
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
         })
        this.state={
            dataSource,
            height: document.documentElement.clientHeight * 1,
            isLoading:false,
            list:[],
            pageNum:1,
            none:false,
            user:{}
        }
    }

    componentDidMount(){
        this.getList()
        this.setState({
            user:this.props.user
        })
    }
    getList(num){
        if(num){}else{num=this.state.pageNum}
        NetUtil.post("/api/opencar/act/buy/query",{userId:this.props.user.userId,pageNum:num,pageSize:10})
        .then(res=>{
          console.log(res)
          if(res.code==="0"){
            let list=res.data.StarBuyHistory.list
            if(this.state.pageNum>1){
                if(list.length===0){
                  this.setState({
                    none:true,
                    isLoading:false
                  })
                  return
                }else{
                list=this.state.list.concat(list)
                  this.setState({
                    none:false,
                    dataSource: this.state.dataSource.cloneWithRows(list),
                    list:list,
                    total:res.data.totalAmount,
                    isLoading:false
                  })
                }
               
            }else{
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(list),
                    list:list,
                    isLoading:false
                  })
            }
          }
         
          
        })
    }
    onEndReached (){
        const that=this
    if(that.state.isLoading===true||that.state.none===true){
        return
    }
    let pageNum=that.state.pageNum+=1
    this.setState({
        isLoading:true,
        pageNum:pageNum
    })
    this.getList(pageNum)
    }
    render(){
        const order=require("../images/shoporder.png")
        const text=require("../images/shoptest.png")
        const row=(rowData, sectionID, rowID)=>{
            return(
                <div className="list" key={rowID}>
                            <div className="top">
                            <img src={order} alt=""/> <span>{rowData.orderNumber}</span>
                            <p>{rowData.buyTime}</p>
                            </div>
                            <div className="center">
                            <img src={rowData.headimgurl} alt=""/> <div>
                            <p>{rowData.goodsName}</p>
                            <p> <span>c</span>{rowData.tokenNumber}</p>
                            </div>
                            </div>
                            <div className="bot"> 
                            {rowData.isSendOut===0?<p className="no">待发货 <span>15天内发货</span></p>:
                            <p className="ed">已发货</p>
                            }
                            </div>
                        </div>
            )
            
        }
        return(
            <div className="shophistory">
            {this.state.list.length===0?<div className="no">
            <img src={nourl} alt=""/>
            <p>没有购物记录</p>
            </div>:<ListView
                ref={el => this.lv = el}
                initialListSize={10}
                dataSource={this.state.dataSource}
                renderRow={row}
                renderFooter={() => ( this.state.isLoading ? <div style={{ padding: 10, textAlign: 'center' }}>loading....</div> : '')}
                style={{
                height: this.state.height,
                overflow: 'auto',
                }}
                pageSize={1}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached.bind(this)}
                onEndReachedThreshold={10}
            />}
             <BackBtn from={this.props.user.from}/>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    user: state.user
})
export default connect(mapStateToProps)(Shophistory);