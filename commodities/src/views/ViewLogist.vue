<template>
    <div class="logistContainer">
       <TopNav></TopNav>
       <!-- <baidu-map class="map" id="map" :center="center" :zoom="zoom" @ready="handler" ak="CbvGZwjbrnWurzE8xAKUoaeFjZIcSClx">
            <bm-geolocation  :autoLocation="true" @locationSuccess="getLocation"></bm-geolocation>
            <bm-driving
                start="新街口"
                end="新街口"
                startCity="北京"
                endCity="南京"
                :panel="false"
                :auto-viewport="true"
                :selectFirstResult="true"
                :waypoints="['呼和浩特', '陕西兵马俑']"></bm-driving>
       </baidu-map> -->
       <div class="map" id="map"></div>
       <div class="infoBox" style="display:n-one">
           <div class="infoItem">
               <div class="title">订单信息</div>
               <div class="content">
                   <div class="left">订单号码：</div>
                   <div class="right">{{orderId}}</div>
               </div>
               <div class="content">
                   <div class="left">下单时间：</div>
                   <div class="right">{{time}}</div>
               </div>
                <div class="content">
                   <div class="left">支付方式：</div>
                   <div class="right">{{payType}}</div>
               </div>
           </div>
           <div class="infoItem">
               <div class="title">配送信息</div>
               <div class="content">
                   <div class="left">
                       配送服务：
                   </div>
                   <div class="right">
                       {{sendType}}
                   </div>
               </div>
               <div class="content">
                   <div class="left">
                       配送地址：
                   </div>
                   <div class="right">
                       {{addr}}
                   </div>
               </div>
           </div>
       </div>
       <div class="nextBtn" style="display:n-one">
           <img src="../images/kefu_icon.png"  alt="">
           <span>联系客服</span>
       </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from "@/components/TopNav";
import {getViewLogist} from '@/api/index'
import {mapGetters} from 'vuex'
// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
// import BmDriving from 'vue-baidu-map/components/search/Driving.vue'
// import BmGeolocation from 'vue-baidu-map/components/controls/Geolocation.vue'
// import BMap from 'BMap'
import loadBMap from '@/utils/loadMap.js'
export default {
    data(){
        return{
            orderId:'',
            time:'',
            payType:'',
            sendType:'',
            addr:{},
            center: {lng: 0, lat: 0},
            zoom: 15,
            myMap:''
        }
    },
    computed:{
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components: {
        TopNav,
        // BaiduMap,
        // BmDriving,
        // BmGeolocation
    },
    mounted() {
        this.getData();
        this.initMap()
    },
    methods: {
        async getData(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
                orderId:this.$route.query.id
            };
            let res = await getViewLogist(defaulParams);
            if(res.code == 0){
                this.orderId = res.data.list[0].orderid;
                this.time = res.data.list[0].orderid;
            }
            this.initMap();
        },
        //固定写法
        handler ({BMap, map}) {
            this.center.lng = 116.404
            this.center.lat = 39.915    //天安门经纬度
            this.zoom = 15
        },
        getLocation(e){
            console.log(e)
        },
        initMap() {
            loadBMap()
                .then(() => {

                    this.myMap = new BMap.Map("map");
                    var p1 = new BMap.Point(116.301934,39.977552);//(后期改为 起点物流位置)
                    var p2 = new BMap.Point(116.508328,39.919141);//(后期改为 当前物流位置)
                    var p3 = new BMap.Point(116.365942,39.996165);//(后期改为 终点物流位置)
                    const points = [p1,p2,p3]; //一组坐标点
                    const view = this.myMap.getViewport(points); //获取最佳视角
                    const zoom = view.zoom; //获取最佳视角的缩放层级
                    const centerPoint = view.center; //获取最佳视角的中心点
                    this.myMap.centerAndZoom(centerPoint, zoom);  // 编写自定义函数，创建标注 
                    
                    let myIcon1 = new BMap.Icon(require("../images/start_point.png"), new BMap.Size(25, 30), {    
                        anchor: new BMap.Size(64, 64),    
                        imageOffset: new BMap.Size(0, 0)   // 设置图片偏移    
                    });      
                    let myIcon2 = new BMap.Icon(require("../images/end_point.png"), new BMap.Size(25, 30), {    
                        anchor: new BMap.Size(64, 64),    
                        imageOffset: new BMap.Size(0, 0)   // 设置图片偏移    
                    });      
                    let myIcon3 = new BMap.Icon(require("../images/mid_point.png"), new BMap.Size(25, 30), {    
                        anchor: new BMap.Size(64, 64),    
                        imageOffset: new BMap.Size(0, 0)   // 设置图片偏移    
                    });      
                    let marker1 = new BMap.Marker(p1, {icon: myIcon1});
                    let marker2 = new BMap.Marker(p2, {icon: myIcon2});        
                    let marker3 = new BMap.Marker(p3, {icon: myIcon3});        
                    this.myMap.addOverlay(marker1);   
                    this.myMap.addOverlay(marker2);   
                    this.myMap.addOverlay(marker3);    
                    // 百度地图API功能
                    // let that = this;
                    // this.myMap = new BMap.Map("map");
                    // var myCity = new BMap.LocalCity();
                    // myCity.get(myFun); 
                    // function myFun(result){
                    //     var cityName = result.name;
                    //     that.myMap.setCenter(cityName);
                    //     var mk = new BMap.Marker(result.center);
                    //     // that.myMap.addOverlay(mk);
                    //     that.myMap.panTo(result.center);
                    //     that.myMap.centerAndZoom(result.center,12);
                    //     var p1 = new BMap.Point(116.301934,39.977552);
                    //     var p2 = new BMap.Point(116.508328,39.919141);
                    //     var p3 = new BMap.Point(116.365942,39.996165);
                    //     var startIcon = new BMap.Icon(require("../images/local_icon.png"),new BMap.Size(64,64))
                    //     var endIcon = new BMap.Icon(require("../images/local_icon.png"),new BMap.Size(64,64))
                    //     var icon = require('../images/local_icon.png');
                    //     var wayPointIconHtml='<img style="width:16px;height:16px;position:absolute;top:20px" src="'+icon+'">'
                    //     var driving = new BMap.DrivingRoute(that.myMap, {
                    //         renderOptions:{map: that.myMap, autoViewport: true},
                    //         onPolylinesSet:function(routes) {
                    //             var searchRoute = routes[0].getPolyline();//导航路线
                    //             that.myMap.addOverlay(searchRoute);
                    //         },
                    //     });
                    //     driving.setSearchCompleteCallback(function(){
                    //         var plan = driving.getResults().getPlan(0);
                    //         for(var i=0;i<plan.getNumRoutes();i++){
                    //             var pts =plan.getRoute(i).getPath();
                    // 　　　　     //重点在这   这个地方是关于修改颜色的
                    //             var polyline = new BMap.Polyline(pts,{ strokeColor: "#FF1240", strokeWeight: 5, strokeOpacity: 1});
                    //             that.myMap.addOverlay(polyline);
                    //         }
                    //     })
                    //     driving.search(p1, p2,{waypoints:[p3]});//waypoints表示途经点
                    //     driving.setMarkersSetCallback(function(res){
                    //         res[0].marker.setIcon(startIcon);
                    //         res[1].Nm.Yc.innerHTML=wayPointIconHtml;
                    //         res[2].marker.setIcon(endIcon);
                    //     })
                    // }
                    // var myGeo = new BMap.Geocoder();      
                    // // 将地址解析结果显示在地图上，并调整地图视野    
                    // myGeo.getPoint("佛山路30号7门", function(point){      
                    //     if (point) {      
                    //         console.log(point)
                    //     }      
                    // }, 
                    // "辽宁市");




                    // var geolocation = new BMap.Geolocation();
                    // geolocation.getCurrentPosition(function(r){
                    //     console.log(r)
                    //     if(this.getStatus() == 0){
                    //         var mk = new BMap.Marker(r.point);
                    //         that.myMap.addOverlay(mk);
                    //         that.myMap.panTo(r.point);
                    //         that.myMap.centerAndZoom(r.point,12);
                    //     }
                    //     else {
                    //         Toast({
                    //             message: "获取定位失败",
                    //             position: "middle",
                    //             duration: 2000
                    //         });
                    //     }        
                    // });
                })
                .catch(err => {
                    console.log('地图加载失败')
                })
        }
    }
}
</script>
<style lang="scss" scoped>
    .logistContainer{
        width: 100vw;
        // min-height: 100vh;
        background: rgba(235, 235, 235, 1);
        .nav{
            border-bottom: 2px solid #ebebeb;
        }
        .map{
            width: 100%;
            height: 500px;
            margin-top: 88px;
            a[title="到百度地图查看此区域"]{
                display: none !important;
            }
            .BMap_noprint.anchorBL{
                display: none;
            }
            .driving{
                display: none;
            }
        }
        .infoBox{
            padding: 0 41px 0 39px;
            background-color: #fff;
            .infoItem{
                border-bottom: 2px solid #ebebeb;
                padding-bottom: 59px;
                padding-top: 42px;
                .title{
                    font-size:24px;
                    color:rgba(51,51,51,1);
                    line-height:31px;
                    letter-spacing:1px;
                    border-left: 10px solid #E32323;
                    padding-left: 10px;
                    margin-bottom: 46px;
                }
                .content{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    .left{
                        font-size:24px;
                        color:rgba(153,153,153,1);
                        line-height:31px;
                        letter-spacing:1px;
                        width: 125px;
                        flex: 1;
                    }
                    .right{
                        width: 500px;
                        font-size:24px;
                        color:rgba(153,153,153,1);
                        line-height:31px;
                        letter-spacing:1px;
                    }
                }
            }
        }
        .nextBtn{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 98px;
            line-height: 98px;
            text-align: center;
            font-size:36px;
            color:rgba(255,255,255,1);
            letter-spacing:3px;
            background-color: #fff;
            margin: 0 auto;
            img{
                width: 32px;
                height: 35px;
                margin-right: 16px;
            }
            span{
                font-size:26px;
                color:#E32323;
                line-height:35px;
                letter-spacing:2px;
                position: relative;
                bottom: 5px;
            }
        }
    }
</style>
