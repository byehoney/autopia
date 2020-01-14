import React,{Component} from "react";
import { connect } from 'react-redux'
import BackBtn from "../components/BackBtn";
import '../styles/Find/nearbyRoad.scss';
import { Toast,ListView } from 'antd-mobile';
import markIcon from '../images/marker.png'
const AMap = window.AMap;
let trafficLayer="";
let isVisible=true;
class NearbyRoad extends Component {
    constructor(props){
        super(props)
        this.state={
           lng:'',
           lat:'',
           showBtn:false
        }
    }
    toggleMap(){
        if (isVisible) {
            trafficLayer.hide();
            isVisible = false;
        } else {
            trafficLayer.show();
            isVisible = true;
        }
    }
    componentDidMount() {
        let that = this;
        Toast.loading('努力获取定位中...', 0);
        var map = new AMap.Map('mapContainer', {
            resizeEnable: true,
            center: [116.38,39.90],
            zoom: 16
        });
        //实时路况图层
        trafficLayer = new AMap.TileLayer.Traffic({
            zIndex: 10
        });

        trafficLayer.setMap(map);

        map.plugin('AMap.Geolocation', function() {
            var geolocation = new AMap.Geolocation({
              // 是否使用高精度定位，默认：true
              enableHighAccuracy: true,
              // 设置定位超时时间，默认：无穷大
              timeout: 10000,
              // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
              buttonOffset: new AMap.Pixel(10, 20),
              //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              zoomToAccuracy: true,     
              //  定位按钮的排放位置,  RB表示右下
              buttonPosition: 'RB'
            })           
            geolocation.getCurrentPosition()
            AMap.event.addListener(geolocation, 'complete', onComplete)
            AMap.event.addListener(geolocation, 'error', onError)
         
            function onComplete (data) {
                console.log(data)
                // data是具体的定位信
                Toast.hide();
                that.setState({
                    lng:data.position.lng,
                    lat:data.position.lat,
                    showBtn:true
                })
                var marker,map = new AMap.Map('mapContainer', {
                    resizeEnable: true,
                    center: [data.position.lng,data.position.lat],
                    zoom: 16
                });
                //实时路况图层
                trafficLayer = new AMap.TileLayer.Traffic({
                    zIndex: 10
                });

                trafficLayer.setMap(map);

                marker = new AMap.Marker({
                    icon: markIcon,
                    position: [data.position.lng,data.position.lat],
                    offset: new AMap.Pixel(-13, -30)
                });
                marker.setMap(map);
            }
          
            function onError (data) {
                Toast.info('获取定位失败', 1)
                that.setState({
                    showBtn:false
                })
              // 定位出错
            }
        })
    }
    render() {
        return (
            <div className="nearbyContainer">
                <div id="mapContainer"></div>
                {
                    this.state.showBtn?
                    (
                        <div className="input-card">
                            <div className="input-item">
                                <button className="btnSwitch" onClick={this.toggleMap.bind(this)}>显示/隐藏实时路况</button>
                            </div>
                        </div>
                    )
                    :
                    ('')
                }
                <BackBtn from={this.props.user.from}/>
            </div>
        )
    }
}
export default connect(state=>{
    return {
        user:state.user,
    }
})(NearbyRoad);