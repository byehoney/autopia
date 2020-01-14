
import React from "react";
import { connect } from 'react-redux';
import NetUtil from '../utils/NetUtil';
import Tabbar from "../components/Tabbar";
import HomeHeader from "../components/HomeHeader";
import SwipeableViews from 'react-swipeable-views';
import { Link } from 'react-router-dom';
import { Toast, ListView } from 'antd-mobile';
import '../styles/home.scss';
import login, {saveLocation,changeFirst} from '../redux/loginAction'
import LoginNav from "../components/LoginNav";
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'

const AMap = window.AMap;

class Home extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => true,
        });
        this.state = {
            wList:[],
            dataSource,
            pageNum:0,
            pageSize:10,
            curType:'头条',
            isLoading: true,
            hasMore:true,
            info: {},
            details: [],
            code: null,    
            carOwnerService: {},
            taskList: [],
            showtoast:false,
            day:"",
            carnum:""
        }
    }
    componentDidMount() {
        if(this.props.user.userId) {
            this.getInfo();
        }
        if(this.props.user.todayFirstLogin==1){
            this.setState({
                showtoast:true
            })
        }
        // alert(JSON.stringify(this.props.user))
        this.getloginnum()
        this.getLocation();
        this.getService();
        this.getTask();
        this.getList();
    
    }
    getInfo(userId) {
        NetUtil.post('/api/opencar/home/load',
        {
            userId: userId || this.props.user.userId,
            province: this.props.user.province,
            city: this.props.user.city
        })
        .then((json) => {
            this.setState({
                info: json.data,
                code: json.data.illegalMessage.code,
                details: json.data.illegalMessage.details
            })
        });

    }
      //    隐藏提示、
      hidetoast(){
        this.setState({
            showtoast:false
        })
        this.props.changeFirst("0")
    }
    //   获取登录天数
    getloginnum(){
        NetUtil.post("/api/opencar/task/continuousLogin",{userId:this.props.user.userId})
        .then((res)=>{
            // console.log(res)
            if(res.code==0){
                let num=0
                let list=res.data.ContinuousLoginList
                    for(var a=0;a<list.length;a++){
                        list[a].isshow=false
                        if(list[a].continuousLogin===1){
                         num+=1
                        }
                    }
                    console.log(num)
                    list[num-1].isshow=true
                    console.log(list)
                    this.setState({
                        day:num,
                        carnum:list[num-1].cartokenNum
                    })  
            }
        })
        
    }
    getLocation() {
        if(this.props.user.city != '北京市') return;
        fetch('https://api.map.baidu.com/location/ip?ak=rzOTENpIQgddGZQoUniouvswM1M25hGZ')
            .then(response => response.json)
            .then((json) => {
                const city = json.content.address_detail.city;
                this.props.saveLocation({
                    province: json.content.address_detail.province,
                    city: city
                })

                if(this.props.user.userId && city != '北京市') {
                    this.getInfo(this.props.user.userId)
                }
            })
        // if(this.props.user.city != '北京市') return;

        // const mapObj = new AMap.Map('center');
        // const me = this;

        // mapObj.plugin('AMap.Geolocation', ()=>{
        //     const geolocation = new AMap.Geolocation({
        //         enableHighAccuracy: true,
        //         timeout: 10000,      
        //     });
           
        //     geolocation.getCurrentPosition();
        //     AMap.event.addListener(geolocation, 'complete', (data)=>{
        //         // this.setState({
        //         //     province: data.addressComponent.province,
        //         //     city: data.addressComponent.city || data.addressComponent.province
        //         // })
        //         this.props.saveLocation({
        //             province: data.addressComponent.province,
        //             city: data.addressComponent.city || data.addressComponent.province
        //         })

        //         if(me.props.user.userId && this.props.user.city != '北京市') {
        //             me.getInfo(me.props.user.userId)
        //         }
        //     });
        //     AMap.event.addListener(geolocation, 'error', (err)=>{console.log(err)})
        // });
    }
    getList(){
        NetUtil.post('/api/info/news/classify/newsList',
                    {classifyName:this.state.curType,pageNum: this.state.pageNum,pageSize: this.state.pageSize,platform:2})
                .then((res) => {
                    if(res.code==0){


                        if(!res.data.newsEntityList.length){
                            this.setState({
                                hasMore:false,
                            })
                            return;
                        }
                        this.state.pageNum++;
                        let newList=[...this.state.wList,...res.data.newsEntityList];
                        this.setState({
                            wList:newList,
                            totalCount:res.data.totalCount,
                            dataSource: this.state.dataSource.cloneWithRows(newList),
                            isLoading: false,
                        })
                    }
                });
    }
    getService() {
        NetUtil.post('/api/opencar/goods/carOwnerService',
                    {pageNum: 1, pageSize:3}
                ).then((res) => {
                    this.setState({
                        carOwnerService: res.data.carOwnerService
                    })
                })
    }
    getTask() {
        NetUtil.get('/api/opencar/task/getTaskList')
                .then((res) => {
                    this.setState({
                        taskList: res.data.TaskList
                    }, ()=>{
                        new Swiper('.swiper-container', {
                            slidesPerView: 3,
                            spaceBetween: 30
                          });
                    })
                })
    }
    onEndReached = (event) => {
        if (this.state.isLoading || !this.state.hasMore) {
          return;
        }
        this.setState({ isLoading: true });
        this.getList();
    }
    goDetail(id){
        this.props.history.push(`/TopLineDetail/${id}`)
    }
    renderRow() {
        const row = (rowData, sectionID, rowID) => {
            let item = rowData;
            return (
                <div className="articleList">
                    <div className="listItem" key={rowID} onClick={()=>{this.goDetail(item.id)}}>
                        <div className='listItem-wrapper'>
                            <img className="listBanner" src={item.headImage} alt=""/>
                        </div>
                        <div className="listDes">{item.title}</div>
                    </div>
                </div>
            );
        };
        return row;
    }
    toLogin() {
        if(this.props.user.from == 'mini') {
            window.wx.miniProgram.redirectTo({url: '/pages/login/login'})
        }
    }
    showLogin() {
        this.loginNav.showLogin();
    }
    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return;
        };
    }
    renderService() {
        let sv = this.state.carOwnerService;
        if(! sv.total || sv.total < 1) return;

        const cln = sv.list.length > 1 ? 'half' : '';
        let items = sv.list.map( item => {
            return (
                    <img 
                        src={item.coverImage} 
                        alt='' 
                        className={'service-item ' + cln}
                        key={item.goodsId}
                        onClick={()=>{
                            const url = '/productDetail/'+item.goodsId;
                            this.props.history.push(url);
                        }}
                        />
            )
        })
        if(sv.total > 3) {
            items.push(<div className='service-item half more'
                            onClick={()=>{
                                this.props.history.push('/serviceList')
                            }}>
                            更多>>
                        </div>)
        }
        return (
            <div className='home-item'>
                <h5>车主服务</h5>
                    <div className='service-list'
                        >
                        {items}
                    </div>
            </div>
        )
    }
    renderTask() {
        if(this.state.taskList.length < 1) return;
        
        const items = this.state.taskList.map(item => {
            const url = '/'+item.appPage;
            return (
                <div className="swiper-slide">
                    <Link className='task-item' 
                        key={item.id}
                        to={url}>
                        <img src={item.icon} className='task-image' alt=''/>
                        <div className='divider'></div>
                        <div className='task-title'>{item.productTitle}</div>
                        <div>{item.rewardTitle}</div>
                    </Link>
                </div>
            )
        })
        return (
            <div className='home-item task'>
                <h5>车主任务 <span className='task-label'>赚Car币</span></h5>
                <div className='task-list'>
                    <div className="swiper-container">
                        <div className="swiper-wrapper" style={{backgroundColor:'transparent',height:'3.2rem'}}>
                        {items}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        const car =require("../images/logincar.png")
        return (
            <div>
                <div className='home'>
                    <HomeHeader 
                        userId={this.props.user.userId}
                        info={this.state.info} 
                        details={this.state.details} 
                        code={this.state.code} 
                        province={this.props.user.province}
                        city={this.props.user.city}
                        changeCity={
                            (province, city)=>{
                                this.props.saveLocation({province, city})
                                this.getInfo();
                            }
                        }
                        bindLogin={
                            ()=>{this.toLogin()}
                        }
                        showLogin={()=>{
                            this.showLogin()
                        }}
                        />
                    {this.renderService()}
                    {this.renderTask()}
                    <div className='home-item'>
                        <h5>Car币购物</h5>
                        <Link to='/productList' className='product-btn'>
                            
                            <div className='product-txt'>
                                <h6 className='product-title'>Car币购物最划算</h6>
                                <div>全宇宙最好用最流行的Car币商城</div>
                                
                            </div>
                            <div className='product-img'></div>
                        </Link>
                    </div>
                    <div className='home-item'>
                        <h5>最热资讯</h5>
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                            {this.state.isLoading ? '拼命加载中...' : ''}
                            </div>)}
                            renderRow={this.renderRow()}
                            className="am-list"
                            pageSize={this.state.pageSize}
                            useBodyScroll
                            onEndReached={this.onEndReached}
                            scrollRenderAheadDistance={100}
                            onEndReachedThreshold={100}
                        />
                    </div>
                    <Tabbar current="0"/>
                </div>
                <LoginNav 
                    ref={r => this.loginNav = r}
                    key={this.props.user.userId}
                    userId={this.props.user.userId}
                    from={this.props.user.from}
                    prev='home'/>
                    {this.state.showtoast===true?<div className="fixed">
                    <div className="fixedcon">
                        <div>恭喜你连续登录<span>{this.state.day}</span>天</div>
                        <img src={car} alt=""/>
                        <p>奖励Car币 <span>{this.state.carnum}</span> 个</p>
                        <div className="btn" onClick={this.hidetoast.bind(this)}>知道了</div>
                    </div>       
                    </div>:""}
                    
                    
           </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
})
  
const mapDispatchToProps = dispatch => ({
    saveLocation: locate => dispatch(saveLocation(locate)),
    changeFirst: first=>dispatch(changeFirst(first))
})
  // 连接 tore 和组件
export default connect(mapStateToProps,mapDispatchToProps)(Home);