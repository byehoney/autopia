
import React from "react";
import NetUtil from '../utils/NetUtil';
import '../styles/product.scss';
import { connect } from 'react-redux';
import {Toast} from "antd-mobile"
import {address} from '../redux/loginAction'
import BackBtn from "../components/BackBtn";
import { Item } from "antd-mobile/lib/tab-bar";
class ProductOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: {},
            prod: {},
            detail: {},
            token: 0,
            xieyiEd: true,
            goodsId: '',
            showaddress:false,
            addressIndex:null,
            isAddress:false,
            list:[]
        }
    }
    componentDidMount() {
        console.log(this.props.user)
        if(this.props.user.address!=''){
            console.log(this.props.user.address)
            this.setState({
                addressIndex:this.props.user.address,
                isAddress:true
            },()=>{
                this.getaddress("select")
            })
           
        }else{
            this.getaddress("default")
        }
        
        const goodsId = this.props.match.params.id;

        this.setState({
            goodsId
        },()=>{
        this.getdetail(goodsId)
        })
       
    }
    // 查找用户地址列表
    getaddress(type){

        NetUtil.post("/api/opencar/address/getUserAddressList",{
            userId:this.props.user.userId,
            // userId:1
          })
          .then((res)=>{
              console.log(res.data.UserAddressList)
              let list=res.data.UserAddressList
              if(res.data.UserAddressList==null){return}
              
              if(list.length===0){
                this.setState({
                    isAddress:false
                })
              }else{
                this.setState({
                    isAddress:true
                  })
              }
              if(type==="select"){
                let id=this.state.addressIndex
                console.log(id)
                for(var a=0;a<list.length;a++){
                        if(list[a].addressId==id){
                            this.setState({
                                address:list[a]
                            })
                        }
                }
              }
              if(type==="default"){
                  for(var j=0;j<list.length;j++){
                    if(list[j].addressDefault===1){
                        this.setState({
                            address:list[j]
                        })
                    }else{
                        this.setState({
                            address:list[0]
                        }) 
                    }
                  }
                
              }
          })
    }
    // 获取商品详情
    getdetail(goodsId){
        NetUtil.get('/api/opencar/goods/detail?goodsId='+goodsId)
        .then((json) => {
            console.log(json)
            this.setState({
                detail:json.data.GoodsDetail
            })
        })
    }
    // 兑换商品
    dh(){
        if(this.state.isAddress===false){
            Toast.info("请先添加收货地址",1)
            return
        }
       
        NetUtil.post("/api/opencar/goods/buygoods",{
            userId:this.props.user.userId,
            goodsId:this.state.goodsId,
            addressId:this.state.address.addressId
        })
        .then(res=>{
            console.log(res)
            if(res.code==0){
                   this.props.history.push("/dhsuccess")  
                   this.props.address("")
            }else{
                Toast.info(res.message,1)
            }
        })
   
    }
    // 添加地址
    address(){
        this.props.history.push("/address/"+this.state.goodsId)  
    }
    render() {
        const detail=this.state.detail
        const carbi=require("../images/price-icon.png")
        const addressdetail=this.state.address
        return (
            <div className='dhShop'>
            {this.state.isAddress===true?<div className="alladdress">
                    <div className="name">
                      <div className="leftadd">收货人:</div><div className="rightadd">{addressdetail.addressName}</div> 
                      <span onClick={this.address.bind(this)}></span>
                    </div>
                    <div className="phone">
                    <div className="leftadd">手机号:</div><div className="rightadd">{addressdetail.addressPhone}</div>  
                    </div>
                    <div className="detailaddress">
                      <div className="leftadd">地址:</div><div className="rightadd">{addressdetail.addressProvince}{addressdetail.addressCity}{addressdetail.addressDistrict}{addressdetail.addressDetailed}</div>   
                    </div>
            </div>:""}
            
                <div className="nav">
                    <div className="left">
                    <img src={detail.coverImage} alt=""/>
                    </div>
                    <div className="right">
                    {detail.goodsName}
                    <p><img src={carbi} alt=""/> {detail.tokenNumber}</p>
                    </div>
                </div> 
                {this.state.isAddress===false?<p className="address" onClick={this.address.bind(this)}><span>+</span>添加地址</p>:""}
                
                <div className='dhFoot' >
                                <span><img src={carbi} alt=""/><span>{detail.tokenNumber}</span></span>
                                <div className='dhFoot2' 
                                    onClick={this.dh.bind(this)}>
                                    立即兑换
                                </div>
                </div>
                <BackBtn from={this.props.user.from}/>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user
})
const mapDispatchToProps = dispatch => ({
    address: num => dispatch(address(num))
})
export default connect(mapStateToProps,mapDispatchToProps)(ProductOrder)