import React,{Component} from "react";
import { connect } from 'react-redux';
import "../styles/addcar.scss"
import { InputItem,Toast } from 'antd-mobile';
import BackBtn from "../components/BackBtn";
import NetUtil from '../utils/NetUtil';
class Addcar extends Component{
    constructor(props){
        super(props)
        this.state={
            img:[
                require("../images/addcarhead.png"),
                require("../images/sheng.png")
            ],
            hasError: false,
            value4: '',
            value3: '',
            value2: '',
            value1: '',
            show:false,
            list:[
              {name:"京"},
              {name:"津"},
              {name:"冀"},
              {name:"晋"},
              {name:"蒙"},
              {name:"辽"},
              {name:"黑"},
              {name:"沪"},
              {name:"苏"},
              {name:"浙"},
              {name:"皖"},
              {name:"闽"},
              {name:"赣"},
              {name:"鲁"},
              {name:"豫"},
              {name:"鄂"},
              {name:"湘"},
              {name:"粤"},
              {name:"桂"},
              {name:"琼"},
              {name:"渝"},
              {name:"川"},
              {name:"贵"},
              {name:"云"},
              {name:"藏"},
              {name:"陕"},
              {name:"甘"},
              {name:"青"},
              {name:"宁"},
              {name:"吉"},
              {name:"新"},
              {name:"台"}
            ],
            showb:false,
            text:"京",
            disable:false
        }
    }
componentDidMount(){
  // 省份循环添加属性select
  const carid = this.props.match.params.id;
  if(carid==="no"){
    this.findplate("京")
  }else{
    this.setState({
      disable:true
    })
    Toast.loading("加载中...",0)
    NetUtil.get("/wzcx/getPlateList/"+this.props.user.openId)
    .then((res)=>{
      if(res.code===1){
        let plate=res.results[carid]
        let  nav=plate.slice(0,1)
          let  num=plate.slice(1)
          this.findplate(nav)
          this.setState({
            text:nav,
            value1:num,
          })
        NetUtil.post('/wzcx/getPlateMsg',{
          uid: this.props.user.openId,
          plate: plate
      })
      .then((res)=>{
        if(res.code===1){
          Toast.hide()
            this.setState({
              value2:res.results.plateInfo.evin,
              value3:res.results.plateInfo.engine,
              value4:res.results.plateInfo.mobile
            })
        }
      })
      }
    })
  }
  let list=this.state.list
  list.forEach((item)=>{
    item.select=0
  })
  this.setState({
    list:list
  })
}
// 选择车牌
selectS(index){
  let list=this.state.list
  list.forEach((item)=>{
    item.select=0
  })
  list[index].select=1
  this.setState({
    list:list,
    showb:false,
    text:list[index].name
  })
}
// 查找车牌添加样式
  findplate(items){
    let list=this.state.list
    list.forEach((item)=>{
      if(item.name===items){
        item.select=1
      }
    })
    this.setState({
      list:list
    })
  }
// 展示隐藏底部车牌
tapb(){
  if(this.state.disable===true){
    return
  }
  let show=this.state.showb
  this.setState({
    showb:!show
  })
}
    onErrorClick = () => {
        if (this.state.hasError) {
          Toast.info('请输入正确手机号');
        }
      }
      onChange1=(value1)=>{
       this.setState({
         value1
       },()=>{
        this.isShow()
       })
      
      }
      onChange2=(value2)=>{
        this.setState({
          value2
        },()=>{
          this.isShow()
        })
      
      }
      onChange3=(value3)=>{
        this.setState({
          value3
        },()=>{
          this.isShow()
        })
        
      }
      onChange4 = (value4) => {
        if (!(/^1[34578]\d{9}$/.test(value4))){
          this.setState({
            hasError: true,
          });
          this.setState({
            show:false
          })
        } else {
          this.setState({
            hasError: false,
          });
          this.isShow()
        }
        this.setState({
          value4
        })
       
    }
    // 添加车辆
    addnewcar(){
      // 验证车牌
          let myreg = /^[A-Z]{1}[A-Z_0-9]{5}$/;
          console.log( this.state.value1)
          if (!myreg.test(this.state.value1)) {
          
           Toast.info("车牌号不正确",1)
            return false
          }
          // 验证车架号
          if(this.state.value2.length!==17){
            Toast.info("车架号为17位字母与数字组合",1)
            return false
          }
          // 验证发动机号
          if(this.state.value3.length<6||this.state.value3.lengthß>12){
            Toast.info("发动机号为6-12位字母与数字组合",1)
            return false
          }
          if(!(/^1[34578]\d{9}$/.test(this.state.value4))){ 
            Toast.info("手机号错误",1)
            return false
           } 
      NetUtil.post('/wzcx/redactCarInfo',{
        uid: this.props.user.openId,
        plate: this.state.text + this.state.value1,
        engine:  this.state.value3,
        evin:  this.state.value2,
        mobile:  this.state.value4
    })
    .then(res=>{
      // console.log(res)
      if(res.results===true){
        this.props.history.go(-1)
      }
    })
    .catch(()=>{
      Toast.info('添加车辆失败');
    })
    }
    // 判断
      isShow(){
        if(this.state.value1.length>0&&this.state.value2.length>0&&this.state.value3.length>0&&this.state.value4.length>0){
          this.setState({
            show:true
          })
        }else{
          this.setState({
            show:false
          })
        }
      }
            render(){
                return(
                    <div className="addcar">
                        <div className="head">
                            <img src={this.state.img[0]} alt=""/>
                            <p>目前暂不支持新能源车辆的违章查询</p>
                        </div>
                        <div className="con">
                        <InputItem className="first"
                                type="text"
                                placeholder="请输入车牌号"
                                value={this.state.value1}
                                disabled={this.state.disable}
                                onChange={this.onChange1}
                        ><div className="pai" onClick={this.tapb.bind(this)}>{this.state.text}<img src={this.state.img[1]} alt=""/> </div></InputItem>
                        <InputItem
                              type="text"
                              placeholder="请输入车架号"
                              value={this.state.value2}
                              onChange={this.onChange2}
                              maxLength={17}
                         >车架号</InputItem>
                        <InputItem
                              type="number"
                              placeholder="请输发动机号"
                              value={this.state.value3}
                              onChange={this.onChange3}
                        >发动机号</InputItem>
                        <InputItem
                            type="number"
                            placeholder="请输入手机号"
                            onChange={this.onChange4}
                            maxLength={11}
                            disabled={this.state.disable}
                            value={this.state.value4}
                        >手机号码</InputItem>
                        <p>所填信息为当地交管局查询所需，您的信息将严格保密</p>
                        {this.state.show===true?<div  className="btn" onClick={this.addnewcar.bind(this)}>下一步</div>:<div className="btn no" >下一步</div>}
                    </div>
                    {this.state.showb===true? <div className="bottm">
                   <div className="list">
                    {this.state.list.map((item,index)=>{
                      return(
                        <div onClick={this.selectS.bind(this,index)} className={item.select===1?'selected':''} key={index}>{item.name}</div>
                      )
                    })}
                      <p className="cancle" onClick={this.tapb.bind(this)}>取消</p>
                   </div>
                   </div>:""}
                   <BackBtn from={this.props.user.from}/>
                    </div>
                )
            }
}
const mapStateToProps = state => ({
  user: state.user
})
export default connect(mapStateToProps)(Addcar);