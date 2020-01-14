import React from "react";
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import BackBtn from "../components/BackBtn";
import NetUtil from '../utils/NetUtil';
import '../styles/CitationFind/citationFind.scss'
import GetCity from '../components/GetCity';
import limit from '../images/xianhang.png';
import add from '../images/tianjiada.png';
import yj from '../images/youjiaguanli.png';
class CitationFind extends React.Component {
    constructor(props){
        super(props)
        this.state={
            todayText:'该城市暂未开放',
            plateIndex: 0,
            info:'',
            code:'',
            details:[],
            antdDistrict:[],
            pickerValue:['110000','110000'],
            curCity:'',
            curCode:'',
            userId:'',
            province:'',
            city:'',
            oil89Price:0,
            oil92Price:0,
            oil95Price:0,
            oil0Price:0
        }
    }
    async componentDidMount() {
        console.log(this)
        // this.loadPlate();
        // this.getOilPrice();
        // this.getLimiteNum();
        this.setState({
            curCity:this.props.user.city
        })
        this.getInfo();
    }
    getOilPrice(){
        NetUtil.get(`/oil-price/oilPrice?code=${this.state.curCode}`)
        .then((res) => {
            console.log(res)
            if(res.code==0){
                this.setState({
                    oil89Price:res.oil90,
                    oil92Price:res.oil93,
                    oil95Price:res.oil97,
                    oil0Price:res.oilZero
                })
            }else{
                Toast.info(res.message, 1);
            }
        });
    }
    getLimiteNum(){
        NetUtil.post(`/api/act/restricted/query`,{
            ruleCityName:this.state.curCity,
            local:1
        })
        .then((res) => {
            if(res.code==0){
                if (res.data.today || res.data.tomorrow){
                    this.setState({
                        todayText: res.data.today.split(',').join('') == '13579' ? '单号' : res.data.today.split(',').join('') == '24680' ? '双号' : res.data.today.split(',')
                    })
                } else if (res.data.rulelist){
                    this.setState({
                        rulelist: res.data.rulelist
                    })
                    this.getCurDay(res.data.rulelist)
                    this.setCurLimit(res.data.rulelist);
                }
            }else{
                this.setState({
                    todayText:'该城市暂未开放'
                })
            }
            console.log(res)
        });
    }
    getCurDay(rulelist){//获取当天
		rulelist.forEach((item, index) => {
			if (item.week.indexOf('今天') > -1) {
				console.log(index)
				this.setState({
					curDay:index
				})
			}
		})
	}
    setCurLimit(data){
        if(data.length){
			if (data[this.state.curDay].rule=='不限行'){
				this.setState({
					todayText:'不限行'
				})
			}else{
				this.setState({
					todayText: data[this.state.curDay].rule.split(',').join(',')
				})
			}
		}
    }
    changeCity(code,city,province){
        console.log(code,city,province)
        this.setState({
            province:province,
            curCity:city,
            city:city,
            curCode:code
        },()=>{
            this.getInfo();
        })
        
    }
    getInfo() {
        NetUtil.post('/api/opencar/home/load',
        {
            userId:this.props.user.userId,
            province:this.props.user.province,
            city:this.props.user.city
        })
        .then((res) => {
            console.log(res)
            if(res.code==0){
                this.setState({
                    info: res.data,
                    code: res.data.illegalMessage.code,
                    details: res.data.illegalMessage.details,
                    oil89Price:res.data.oilPriceDetail.oil90,
                    oil92Price:res.data.oilPriceDetail.oil93,
                    oil95Price:res.data.oilPriceDetail.oil97,
                    oil0Price:res.data.oilPriceDetail.oilZero,
                    todayText:res.data.controlNumberMsg
                })
            }else{
                Toast.info(res.message, 1);
            }
        });

    }
    renderViolate() {
        const msg = this.state.details[this.state.plateIndex];
        return (
            <div>
                {
                    this.state.details.length?(
                        <div className='car-info'>
                            <ul className='plate-list'>
                                {this.state.details.map((item, i) => {
                                    return <li 
                                                key={i}
                                                className={this.state.plateIndex === i ? "plate current": "plate"}
                                                onClick={()=>{
                                                    this.setState({
                                                        plateIndex: i
                                                    })
                                                }}
                                                >
                                                <span>{item.plate}</span>
                                            </li>;
                                })}
                                {
                                    this.state.details.length<3?(<li><Link to='/addcar/no' className='add-car'></Link></li>):('')
                                }
                            </ul>
                            {
                                msg&&msg.times<1?
                                (<p className="noMsg">当前没有违章记录</p>)
                                :
                                (<Link to={`/CitationFindDetail/${this.state.details[this.state.plateIndex].plate}`} className='violate-content'>您有 <span className='violate-count'>{msg && msg.times}</span> 条违章信息，点击查看>></Link>)
                            }
                            
                        </div>
                    ):(
                        <Link to="/addcar/no">
                            <div className="noCar">
                                <img className="addIcon" src={add} alt=""/>
                                <div className="noDes">
                                    <p className="noTitle">添加车辆查违章</p>
                                    <p className="noInfo">享受最新违章查询，在线办理服务</p>
                                </div>
                            </div>
                        </Link>
                    )
                }
            </div>
        )
    }
    render() {
        return (
            <div className="citationContianer">
                <div className="violate-block">
                    {this.renderViolate()}  
                </div>
                <div className="limitPriceBox">
                    <GetCity city={this.state.curCity} province={this.state.province} selectCity={this.changeCity.bind(this)}/>
                    <div className="limitBox">
                        <div className="left">
                            <img className="limitIcon" src={limit} alt="" />
                            <p className="title">今日限行</p>
                        </div>
                        <p className="limitNum">{this.state.todayText}</p>
                    </div>
                    <div className="oilBox">
                        <img className="yjIcon" src={yj} alt="" />
                        <p className="title">今日油价</p>
                    </div>
                    <ul className="oilDetai">
                        <li className="oilItem">
                            <p className="type">89#汽油</p>
                            <p className="price">{this.state.oil89Price}/升</p>
                        </li>
                        <li className="oilItem">
                            <p className="type">92#汽油</p>
                            <p className="price">{this.state.oil92Price}/升</p>
                        </li>
                        <li className="oilItem">
                            <p className="type">95#汽油</p>
                            <p className="price">{this.state.oil95Price}/升</p>
                        </li>
                        <li className="oilItem">
                            <p className="type">0#汽油</p>
                            <p className="price">{this.state.oil0Price}/升</p>
                        </li>
                    </ul>
                </div>
                <BackBtn from={this.props.user.from}/>
            </div>
        )
    }
}
export default connect(state=>{
    return {
        user:state.user
    }
})(CitationFind);