<template>
    <div class="logistContainer">
       <TopNav></TopNav>
       <div class="map" id="map"></div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from "@/components/TopNav";
import {reqManageSendingRoute} from '@/api/index'
import {mapGetters} from 'vuex'
import loadBMap from '@/utils/loadMap.js'
export default {
    data(){
        return{
            center: {lng: 0, lat: 0},
            zoom: 15,
            myMap:'',
            lineList:[],
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
        // this.initMap()
    },
    methods: {
        async getData(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            };
            let res = await reqManageSendingRoute({...defaulParams,dddh:this.$route.query.id});
            let list = [];
            if(res.code==0){
                res.data.jwList.forEach(item => {
                    list.push({lat:item.wd,lng:item.jd,name:item.name})
                });
            }
            this.lineList = list;
            this.$nextTick(function() {
                this.initMap();
            })
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
                    setTimeout(()=>{
                        this.myMap = new BMap.Map("map");
                        // 先注释掉
                        // var p1 = new BMap.Point(116.310791, 40.003419);//(后期改为 起点物流位置)
                        // var p2 = new BMap.Point(116.408328,39.919141);//(后期改为 当前物流位置)
                        // var p3 = new BMap.Point(116.486419, 39.877282);//(后期改为 终点物流位置)
                        // const points = [p1,p2,p3]; //一组坐标点
                        // const view = this.myMap.getViewport(points); //获取最佳视角
                        // const zoom = view.zoom; //获取最佳视角的缩放层级
                        // const centerPoint = view.center; //获取最佳视角的中心点
                        // this.myMap.centerAndZoom(centerPoint, zoom);  // 编写自定义函数，创建标注 
                        // let myIcon1 = new BMap.Icon(require("../images/start_point.png"), new BMap.Size(25, 30));      
                        // let myIcon2 = new BMap.Icon(require("../images/end_point.png"), new BMap.Size(25, 30));      
                        // let myIcon3 = new BMap.Icon(require("../images/mid_point.png"), new BMap.Size(25, 30));      
                        // let marker1 = new BMap.Marker(p1, {icon: myIcon1});
                        // let marker2 = new BMap.Marker(p2, {icon: myIcon3});        
                        // let marker3 = new BMap.Marker(p3, {icon: myIcon2});        
                        // 先注释掉
                        // 路线规划
                        var p1 = new BMap.Point(this.lineList[0].lat, this.lineList[0].lng);//(后期改为 起点物流位置)
                        var p3 = new BMap.Point(this.lineList[this.lineList.length-1].lat, this.lineList[this.lineList.length-1].lng);//(后期改为 终点物流位置)
                        const view = this.myMap.getViewport([p1,p3]);
                        const zoom = view.zoom;
                        const centerPoint = view.center;
                        this.myMap.centerAndZoom(centerPoint, zoom); 
                        let myIcon1 = new BMap.Icon(require("../images/start_point.png"), new BMap.Size(25, 30));  //起点
                        let myIcon2 = new BMap.Icon(require("../images/end_point.png"), new BMap.Size(25, 30)); //终点
                        let myIcon3 = new BMap.Icon(require("../images/mid_point.png"), new BMap.Size(25, 30));   //当前点 
                        let myIcon4 = new BMap.Icon(require("../images/local_icon.png"), new BMap.Size(50, 50));   //途径点 
                        let marker1 = new BMap.Marker(p1, {icon: myIcon1});
                        let marker3 = new BMap.Marker(p3, {icon: myIcon2});      
                        var that = this;
                        that.myMap.addOverlay(marker1); 
                        that.myMap.addOverlay(marker3); 
                        
                        // 驾车开始    
                        // var driving = new BMap.DrivingRoute(this.myMap, { 
                        //     renderOptions: { 
                        //         map: this.myMap, 
                        //         autoViewport: true 
                        //     },
                        //     onMarkersSet:function(res) {    //标注点完成回调
                        //         // console.info(res);
                        //         var myStart = new BMap.Marker(p1,{icon:myIcon1}); 
                        //         that.myMap.removeOverlay(res[0].marker); //删除起点
                        //         that.myMap.addOverlay(myStart); 
                                
                        //         // var myP1 = new BMap.Marker(p1,{icon:myIcon1}); 
                        //         // console.log(res[1].Lm.Zc.innerHTML); //删除途经点
                        //         // console.log(wayPointIconHtml);
                        //         // res[1].Lm.Zc.innerHTML=wayPointIconHtml;
                        //         // that.myMap.addOverlay(myP1); 
                                
                        //         var myEnd = new BMap.Marker(p3,{icon:myIcon2}); 
                        //         that.myMap.removeOverlay(res[res.length-1].marker);//删除终点
                        //         that.myMap.addOverlay(myEnd); 

                        //         that.addMarker(p2,'当前位置', myIcon3);
                        //     },
                        //     onPolylinesSet:function(routes) {
                        //         console.log(routes)
                        //         var searchRoute = routes[0].getPolyline();//导航路线
                        //         console.log(searchRoute.ia)
                        //         console.log(that.lineList)
                        //          //创建线路
                        //         var polyline = new BMap.Polyline(searchRoute.ia,//所有的GPS坐标点
                        //         {
                        //             strokeColor : 'red', //线路颜色
                        //             strokeWeight : 6,//线路大小
                        //             //线路类型(虚线)
                        //             strokeStyle : "solid"});
                        //         that.myMap.addOverlay(polyline);
                        //     },
                        // });
                        // driving.search(p1, p3);
                        // 驾车结束
                        let pointList = [];
                        this.lineList.forEach((item,index)=>{
                            pointList.push(new BMap.Point(item.lat,item.lng));
                            if(item.name&&index>0&&index<this.lineList.length-1){
                                that.addMarker(new BMap.Point(item.lat,item.lng),'当前位置', myIcon4);
                            }else if(index==0){
                                that.addMarker(new BMap.Point(item.lat,item.lng),item.name, myIcon1);    
                            }else if(index == this.lineList.length-1){
                                that.addMarker(new BMap.Point(item.lat,item.lng),item.name, myIcon2);    
                            }
                        })
                        var polyline = new BMap.Polyline(pointList,{
                            strokeColor : 'red', //线路颜色
                            strokeWeight : 6,//线路大小
                            //线路类型(虚线)
                            strokeStyle : "solid"
                        });
                        that.myMap.addOverlay(polyline);
                    },10)
                })
                .catch(err => {
                    console.log('地图加载失败')
                })
        },
        addMarker (point, name,icon) {
            var marker = new BMap.Marker(point,{icon:icon});
            var label = new BMap.Label(name, {
                offset: new BMap.Size(20, -10)
            });
            marker.setLabel(label);
            this.myMap.addOverlay(marker);
            marker.addEventListener("click", function (e) { 
                console.log(e)
                if(!e.currentTarget.z.label.content){
                    return;
                }
                Toast({
                    message: e.currentTarget.z.label.content,
                    position: "middle",
                    duration: 2000
                });
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    #map >>> a img{
        display: none!important;
    }
    #map  .anchorBL{
        display: none!important;
    }
    .logistContainer{
        width: 100vw;
        height: 100vh;
        background: rgba(235, 235, 235, 1);
        .nav{
            border-bottom: 2px solid #ebebeb;
        }
        .map{
            width: 100%;
            height: 100vh;
            margin-top: 88px;
            a{
                display: none!important;
            }
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
    }
</style>
