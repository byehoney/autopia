import React,{Component} from "react";
import { connect } from 'react-redux';
import "../styles/disscusslist.scss"
import { ListView ,Toast} from 'antd-mobile';
import { Link } from "react-router-dom";
import NetUtil from '../utils/NetUtil';
import BackBtn from "../components/BackBtn";
class Discusslist extends Component{
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
                pageNum:0,
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
       onEndReached (){
         const that=this
         if(that.state.isLoading===true||that.state.none===true){
             return
         }
         let pageNum=that.state.pageNum+=1
         this.getList(pageNum)
         this.setState({
             isLoading:true,
             pageNum:pageNum
         })
         
         
       }
      
       getList(num){
           if(num){}else{num=this.state.pageNum}
           NetUtil.post("/api/info/news/myNews",{userId:this.props.user.userId,pageNum:num,pageSize:10})
           .then(res=>{
             if(res.code==="0"){
               let list=res.data.myNewsList
               if(this.state.pageNum>0){
                   if(list.length===0){
                    Toast.info("已经到底了",1.5)
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
    render(){
      const nolist=require("../images/nolist.png")
        const row=(rowData, sectionID, rowID)=>{
            return(
                <Link className="map" to={{pathname:'/TopLineDetail/'+rowData.newsitemId,state:{from:this.props.location.pathname}}} key={rowID}>
                <div className="title">
                {rowData.newsitemTitle}
                </div>
                <div className="time">
                {rowData.createTime}
                </div>
                <div className="detail">
                {rowData.content}
                </div>
                <div className="to">
                <div><img src={rowData.headUrl}/></div>
                <div className="link" to={'/TopLineDetail/'+rowData.newsitemId}>去往文章>></div>
                </div>
            </Link>
            )  
        }
        return(
          
            <div className="disscusslist">
                {this.state.list.length===0? <div className="nolist">
                  <img src={nolist} alt=""/>
                  <p>您还没有评论，快去头条参与评论吧</p>
                  </div>: <ListView
                ref={el => this.lv = el}
                initialListSize={10}
                dataSource={this.state.dataSource}
                renderRow={row}
                renderFooter={() => ( this.state.isLoading ? <div style={{ paddingBottom: 10, textAlign: 'center' }}>loading....</div> : '')}
                style={{
                height: this.state.height,
                overflow: 'auto',
                }}
                pageSize={10}
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
export default connect(mapStateToProps)(Discusslist);