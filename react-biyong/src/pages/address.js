import React,{Component} from "react";
import { connect } from 'react-redux';
import { Picker} from 'antd-mobile';
import {address} from '../redux/loginAction'
import { SwipeAction, List,Toast } from 'antd-mobile';
import NetUtil from '../utils/NetUtil';
import BackBtn from "../components/BackBtn";
import "../styles/address.scss"
const CustomChildren = props => (
   <div className="list" onClick={props.onClick}>
   <div className="nav" >选择地区</div>
   <input placeholder="地区信息" value={props.city} className={props.city.length>0?"opicy":""} disabled="disabled"/>
 </div>
);
class Address extends Component{
  constructor(props){
    super(props)
    this.state = {
        pickerValue: [],
        antdDistrict:null,
        s:"",
        ss:"",
        sss:"",
        list:[
        ],
        goodsId:"",
        notaddress:false,
        showaddress:false,
        city:"",
        phonevalue:"",
        user:{}
    };
    
  }
  componentDidMount(){
    // 查找用户地址列表
    this.setState({
      user:this.props.user
    })
      const goodsId = this.props.match.params.id;
      this.findAddress(goodsId)
      if(goodsId==="no"){
        this.setState({
          notaddress:true
        })
      }else{
        this.setState({
          goodsId,
          notaddress:false,
      })
      }
    let antdDistrict =[];
    let districtData = require('../location.json');
    Object.keys(districtData).forEach((index)=>{
        let itemLevel1 ={};
        let itemLevel2 ={};
        itemLevel1.value = districtData[index].code;
        itemLevel1.label = districtData[index].name;
        itemLevel1.children = [];
        let data = districtData[index].cities;
        Object.keys(data).forEach((index)=>{
            itemLevel2.value = data[index].code;
            itemLevel2.label = data[index].name;
            itemLevel2.children = [];
            let data2 = data[index].districts;
            let itemLevel3 ={};
            itemLevel3.children = [];
            Object.keys(data2).forEach((index)=>{
                itemLevel3.value = index;
                itemLevel3.label = data2[index];
                itemLevel2.children.push(itemLevel3);
                itemLevel3 ={};
            });
            itemLevel1.children.push(itemLevel2);
            itemLevel2 ={};
        });
        antdDistrict.push(itemLevel1)
        
    });
    this.setState({
      antdDistrict:antdDistrict
    })
    // console.log(antdDistrict)
  }
  oks(value){
    this.findaddress(value)
  }
  change(value){
    this.findaddress(value)
  }
  // 查找地址输出值
      findaddress(num){
        let address=this.state.antdDistrict
        let s=""
        let ss=""
        let sss=""
          for(var a=0;a<address.length;a++){
              if(address[a].value===num[0]){
                s=address[a].label
                let add1=address[a].children
                for(var j=0;j<add1.length;j++){
                  if(add1[j].value===num[1]){
                    ss=add1[j].label
                    let add2=add1[j].children
                    for(var r=0;r<add2.length;r++){
                      if(add2[r].value===num[2]){
                        sss=add2[r].label
                      }
                    }
                  }
                }
              }
          }
          console.log(s,ss,sss)
          this.setState({
            s:s,
            ss:ss,
            sss:sss,
            city:s+ss+sss
          })
      }
      // 添加新地址
      addNew(){
        this.setState({
          showaddress:true
        })
      }
      // 查找地址(){

      findAddress(id){
        NetUtil.post("/api/opencar/address/getUserAddressList",{
          userId:this.props.user.userId
          // userId:1,
        })
        .then((res)=>{
            console.log(res)
            if(res.data.UserAddressList==null){ 
                if(id==="no"){}else{
                  this.setState({
                    showaddress:true
                     }) 
                }
               return
              }
            this.setState({
              list:res.data.UserAddressList
            })
      
        })
        
      }
      editAddress(index){
        console.log(index)
      }
      delete(indexid){
        NetUtil.post("/api/opencar/address/deleteUserAddress",{
          addressId:indexid,
          userId:this.props.user.userId
        })
        .then((res)=>{
          console.log(res)
        })
        let list=this.state.list
        list.forEach((item,index)=>{
           if(item.addressId===indexid) {
            list.splice(index,1)
           }
        })
        this.setState({
          list:list
        })
      }
      toshop(index){
        // if(this.state.notaddress===false){
        //   this.props.history.push("/order/"+this.state.goodsId+"?"+index)
        // }
        console.log(index)
        this.props.history.go(-1);
        this.props.address(index)
        
      }
      // 回退
      goback(){
        this.setState({
          showaddress:false,
          city:"",
          phonevalue:""
        })

      }
      // 保存地址
        save(){
            console.log(this.refs)
            let user=this.refs.user.value
            let phone=this.refs.phone.value
            let detail=this.refs.detail.value
            let youzheng=this.refs.youzheng.value
            console.log(user)
            console.log(phone)
            console.log(detail)
            console.log(youzheng)
            if(user.length>0&&phone.length>0&&detail.length>0&&youzheng.length>0&&this.state.s.length>0){
              if(!(/^1[34578]\d{9}$/.test(phone))){ 
                Toast.info("手机号错误",1)
                return
               } 
               NetUtil.post("/api/opencar/address/addUserAddress",{
                userId:this.state.user.userId,
                // userId:1,
                addressName:user,
                addressPhone:phone,
                addressProvince:this.state.s,
                addressCity:this.state.ss,
                addressDistrict:this.state.sss,
                addressDetailed:detail,
                postalCode:youzheng
              })
              .then(res=>{
                console.log(res)
                if(res.code==0){
                  this.setState({
                    showaddress:false,
                    city:"",
                    phonevalue:""
                  })
                  this.findAddress()
                }else{
                  Toast.info("添加地址失败",1)
                }
              })

            }else{
                if(user.length===0){
                  Toast.info("联系人不能为空",1)
                  return 
                }
                if(phone.length===0){
                  Toast.info("手机号不能为空",1)
                  return
                }
                if(detail.length===0){
                  Toast.info("请输入详细地址",1)
                  return
                }
                if(youzheng.length===0){
                  Toast.info("邮政编码不能为空",1)
                  return
                }
            }

        }
        // 限制手机号最大输入长度
        maxlength(e){
          if(this.refs.phone.value.length<=11){
            this.setState({
                phonevalue:this.refs.phone.value
            })
          }
        }
     render(){
     
         return(
           <div className="addressand">
           {this.state.showaddress==false? <div className="address"> 
          <div className="addressnav">
            {this.state.list.map((item,index)=>{
                            return(
                                <List key={index}  className="123">
                                <SwipeAction  autoClose
                                    right={[
                                      {
                                        text: '删除',
                                        onPress: (e) => this.delete(item.addressId),
                                        style: { backgroundColor:"#F4333C",marginTop:0,border:0, color: 'white',width:"200px"},
                                      },
                                    ]}
                                >
                                  <List.Item>
                                    <div className="list">
                                        <div className="left" onClick={this.toshop.bind(this,item.addressId)}>
                                          <div className="name">{item.addressName} <span>{item.addressPhone}</span></div>
                                          <div className="detail"> {item.addressProvince}{item.addressCity}{item.addressDistrict}{item.addressDetailed}</div>
                                        </div>
                                        {/* <div className="right"  onClick={this.editAddress.bind(this,index)}>
                                        编辑
                                        </div> */}
                                    </div>
                                  </List.Item>
                                </SwipeAction>
                              </List>
                            )
                        })}
            </div>
            <div className="newaddress" onClick={this.addNew.bind(this)}>
        + 添加地址
         </div>
            </div>:<div className="add">
                      <div className="head">
                          <div className="left" onClick={this.goback.bind(this)}> 
                          <span></span>
                          </div>
                          <div className="center">新增地址</div>
                          <div className="right" onClick={this.save.bind(this)}>保存</div>
                      </div>
                      <div className="con">
                        <div className="list">
                          <div className="nav">联系人</div>
                          <input placeholder="请输入姓名" ref="user" />
                        </div>
                        <div className="list">
                          <div className="nav" >手机号码</div>
                          <input value={this.state.phonevalue} onChange={this.maxlength.bind(this)} placeholder="请输入手机号码" ref="phone"  type="tel"/>
                        </div>
                        {/* <div className="list">
                          <div className="nav">选择地址</div>
                          <input  placeholder="地区信息"/>
                        </div> */}
                          <Picker
                    title="选择地区"
                    extra=""
                    city={this.state.city}
                    data={this.state.antdDistrict}
                    value={this.state.pickerValue}
                    onChange={(lable) => this.change(lable)}
                    onOk={(lable) => this.oks(lable)}
                    onClick={()=>{console.log('xx')}}
                >
                <CustomChildren city={this.state.city}>添加地址</CustomChildren>
                </Picker>
                       
                        <div className="list detail">
                          <div className="nav">详细地址</div>
                          <textarea  placeholder="街道门牌信息" ref="detail"/>
                        </div>
                        <div className="list">
                          <div className="nav" >邮政编码</div>
                          <input pattern="[0-9]*"  type="number"placeholder="邮政编码" ref="youzheng"/>
                        </div>
                      </div>
                    
            </div>}
            <BackBtn from={this.props.user.from}/>
           </div>
         
         )
     }
}
const mapStateToProps = state => ({
  user: state.user
})
const mapDispatchToProps = dispatch => ({
  address: num => dispatch(address(num))
})
export default connect(mapStateToProps,mapDispatchToProps)(Address);
