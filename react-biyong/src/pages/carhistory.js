import React from "react";
import { connect } from 'react-redux';
import '../styles/carhistory.scss';
import { ListView } from 'antd-mobile';
import NetUtil from '../utils/NetUtil';
import nourl from "../images/carno.png"
import BackBtn from "../components/BackBtn";
class Carhistory extends React.Component {
    constructor(props){
        super(props)
        const dataSource = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
       })
        this.state={
            dataSource,
            height: document.documentElement.clientHeight-200,
            isLoading:false,
            list:[],
            pageNum:1,
            none:false,
            total:0,
            user:{}
        }
    }
  componentDidMount() {
    this.setState({
      user:this.props.user
    })
   this.getList()
   
  }
// componentWillReceiveProps(){
//   this.getList()
// }
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

  getList(num){
      if(num){}else{num=this.state.pageNum}
      NetUtil.post("/api/opencar/wallet/detail",{userId:this.props.user.userId,pageNum:num,pageSize:10})
      .then(res=>{
        console.log(res)
        if(res.code==="0"){
          let list=res.data.details
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
                  none:false
                })
              }
          }else{
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(list),
              list:list,
              total:res.data.totalAmount,
              isLoading:false
            })
          }
         
        }
       
        
      })
  }
  render() {

    const row=(rowData, sectionID, rowID)=>{
      return(
        <div className="conlist" key={rowID}>
        <div className="left">
        {rowData.bizType}
        <p>{rowData.happenTime}</p>
        </div>
        <div className="right">
        {rowData.type===1?<span className="jia">+</span>:<span className="jian">-</span> }{rowData.amount}
        </div>
     </div>
      )  
  }
    return (
        <div className="carhistory">
        {this.state.list.length===0
        ?
        <div className="no">
            <img src={nourl} alt=""/>
            <p>暂无Car币收支记录</p>
        </div>
        :
      <div >
      <div className="head">
                <div> <span>Car币</span> <div className="num">{this.state.total}</div></div>
                <p>今日您的Car币总值</p>
        </div>
       <div className="con">
       <p>收支记录</p>
       <ListView
                ref={el => this.lv = el}
                initialListSize={10}
                dataSource={this.state.dataSource}
                renderRow={row}
                renderFooter={() => ( this.state.isLoading ? <div style={{ padding: 10, textAlign: 'center' }}>loading....</div> : '')}
                style={{
                height: this.state.height,
                overflow: 'auto',
                }}
                pageSize={4}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached.bind(this)}
                onEndReachedThreshold={10}
            />
            </div>
            </div>    
           
          
           }
        <BackBtn from={this.props.user.from}/>
        </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user
})
export default connect(mapStateToProps)(Carhistory);
