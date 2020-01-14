import React,{Component} from "react";
import { SwipeAction, List,Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import "../styles/carlist.scss"
import NetUtil from '../utils/NetUtil';
import BackBtn from "../components/BackBtn";
class Carlist extends Component{
    constructor(props){
        super(props)
        this.state={
            list:[{name:"123123",one:0,two:0,three:0,red:false},
                {name:"123123",one:0,two:0,three:0,red:false},
                {name:"123123",one:0,two:0,three:0,red:false}
        ],
        img:[
            require("../images/yellow.png"),
            require("../images/blue.png"),
            require("../images/green.png"),
            require("../images/addcar.png")
        ],
        carInfos:[],
        user:{}
        }
    }
    componentDidMount(){
        this.loadPlate()
        this.setState({
            user:this.props.user
        })
        
    }
    // 查找车辆
    loadPlate() {
        // Toast.loading("加载中...",0)
        NetUtil.get("/wzcx/getPlateList/"+this.props.user.openId).then((res)=>{
            if(res.code===1){
                const data = res.results
                let msgs = this.loadPlateMsg(data)
                console.log(res)
				Promise.all(msgs).then(res => {
                    let carInfos = this.state.carInfos
                    
					res.map((item, index) => {
						let carInfo = carInfos[index]
						if (item.code === 1) {
                            Toast.hide()
							if (item.results) {
								const results = item.results;
								carInfo.illegalMsg = results.illegalMsg
								carInfo.violateInfos = results.violateInfos || []
								carInfo.status = results.status
							}
						} else {
							carInfo.illegalMsg.day = 0;
							carInfo.illegalMsg.illegalMoney = 0;
							carInfo.illegalMsg.illegalCount = 0;
							carInfo.illegalMsg.illegalScore = 0;
							carInfo.violateInfos = [];
							carInfo.status = 0;
						}
                    })
					this.setState({
						carInfos: carInfos
                    })
                    console.log(carInfos)
                })
                Promise.all(msgs).catch(()=>{
                    Toast.hide()
                })
            }else{
                Toast.hide()
            }
        })

    }
    loadPlateMsg(data) {
		let carInfos = []
		let list = data.map(plate => {
			let carInfo = {}
			carInfo.plate = plate
			carInfo.illegalMsg = {}
            carInfos.push(carInfo)
            let init = {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
					uid: this.props.user.openId,
					plate: plate
				})
            };
            const req = NetUtil.post('/wzcx/getPlateMsg',{
                uid: this.props.user.openId,
                plate: plate
            })
			return req
        })
        
		this.setState({
			carInfos: carInfos
		},()=>{

            let carInfos=this.state.carInfos
            for(var a=0;a<carInfos.length;a++){
                carInfos[a].url=this.state.img[a]
            }
            this.setState({
                carInfos:carInfos
                })
        })
		return list
	}
    // 删除车辆
    delete(index){
        let list=this.state.carInfos
       
        let plate=list[index].plate
        NetUtil.post('/wzcx/delPlate',{
            uid: this.props.user.openId,
            plate: plate
        })
        .then((res)=>{
            console.log(res)
            if(res.code==1){
                list.splice(index,1)
                this.setState({
                    list:list 
                })
            }
        }).catch(()=>{
            
        })
        
    }
 
    addcar(){
        if(this.state.carInfos.length===3){
            Toast.info('每个用户最多添加三辆车',1);
            return
        }
        this.props.history.push("/addcar/no")
    }
    // 编辑车辆
        editCar(index){
            this.props.history.push("/addcar/"+index)
        }
    render(){
        return(
            <div className="carlist">
            <p>每个用户最多可添加<span>3</span>辆车</p>
            {this.state.carInfos.map((item,index)=>{
                return(
                    <List key={index}>
                    <SwipeAction  autoClose
                        right={[
                          {
                            text: '删除',
                            onPress: () => this.delete(index),
                            style: { backgroundColor:"#F4333C",marginTop:0,border:0, color: 'white',width:"200px"},
                          },
                        ]}
                    >
                      <List.Item>
                        <div className="car" onClick={this.editCar.bind(this,index)}>
                            <div className="left">
                               <div>{item.plate}</div>
                               <div>未处理<span>{item.illegalMsg.illegalCount}</span> 罚款<span>{item.illegalMsg.illegalMoney}</span> 扣分<span>{item.illegalMsg.illegalScore}</span> </div>
                            </div>
                            <div className="right">
                            <img src={item.url} alt=""/>
                            </div>
                        </div>
                      </List.Item>
                    </SwipeAction>
                  </List>
                )
            })}
               <div className="addcar" onClick={this.addcar.bind(this)}>
               <img src={this.state.img[3]} alt=""/>
                  </div>
                  <BackBtn from={this.props.user.from}/>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    user: state.user
})
export default connect(mapStateToProps)(Carlist);