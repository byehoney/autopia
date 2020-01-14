<template>
    <div class="container">
        <div class="floors">
            <div class="title">抖音</div>
            <div class="floor_detail">
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/xinzengfensishu.png" alt="">
                        <span>新增粉丝</span>
                    </div>
                    <div class="item_bottom">{{dyNew}}</div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/fensi.png" alt="">
                        <span>总粉丝</span>
                    </div>
                    <div class="item_bottom">
                        {{dyz}}
                        <span class="light" v-if="dyz>=10000000">(千万级)</span>
                        <span class="light" v-if="dyz>=1000000&&dyz<10000000">(百万级)</span>
                    </div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/zan-copy.png" alt="">
                        <span>总获赞</span>
                    </div>
                    <div class="item_bottom">{{dyzz}}</div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/yuedu.png" alt="">
                        <span>总阅读数</span>
                    </div>
                    <div class="item_bottom">{{dyzy}}</div>
                </div>
            </div>
        </div>
        <div class="floors nb">
            <div class="title">微博及其他</div>
            <div class="floor_detail">
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/xinzengfensishu.png" alt="">
                        <span>新增粉丝</span>
                    </div>
                    <div class="item_bottom">{{wbNew}}</div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/fensi.png" alt="">
                        <span>总粉丝</span>
                    </div>
                    <div class="item_bottom">
                        {{wbz}}
                        <span class="light" v-if="wbz>=10000000">(千万级)</span>
                        <span class="light" v-if="wbz>=1000000&&wbz<10000000">(百万级)</span>
                    </div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/zan-copy.png" alt="">
                        <span>总获赞</span>
                    </div>
                    <div class="item_bottom">{{wbzz}}</div>
                </div>
            </div>
        </div>
        <div class="chartBox">
            <div class="chartInner">
                <div class="title">新增粉丝</div>
                <div class="chart" id="chartOne"></div>
            </div>
            <div class="chartInner">
                <div class="title">总粉丝</div>
                <div class="chart" id="chartTwo"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { getOtherData } from '../api/index' 
var echarts = require("echarts");
export default {
    data(){
        return{
            dyNew:0,
            dyz:0,
            dyzz:0,
            dyzy:0,
            wbNew:0,
            wbz:0,
            wbzz:0
        }
    },
    mounted() {
        document.getElementById("left").style.height = '733px';
        document.getElementById("tabs").style.height = '733px';
        this.getData();
    },
    methods: {
        async getData(){
            let res = await getOtherData();
            let dyNew = 0;
            let dyz = 0;
            let dyzz = 0;
            let dyzy = 0;
            let wbNew = 0;
            let wbz = 0;
            let wbzz = 0;
            let platList = [];
            let upDatas = [];
            let datas= [];
            res.otherDataList.forEach(item => {
                if(item.pType==1){
                    dyNew += parseInt(item.newUserCnt);
                    dyz += parseInt(item.totalUserCnt);
                    dyzz += parseInt(item.totalPraiseCnt);
                    dyzy += parseInt(item.totalReadCnt);
                    this.dyNew = dyNew;
                    this.dyz = dyz;
                    this.dyzz = dyzz;
                    this.dyzy = dyzy;
                }
                if(item.pType!=1){
                    wbNew += parseInt(item.newUserCnt);
                    wbz += parseInt(item.totalUserCnt);
                    wbzz += parseInt(item.totalPraiseCnt);
                    this.wbNew = wbNew;
                    this.wbz = wbz;
                    this.wbzz = wbzz;
                    // datas.push(parseInt(item.totalUserCnt));
                    // upDatas.push(parseInt(item.newUserCnt));
                }
                if(item.pType==1){
                    platList.push('抖音');
                }else if(item.pType==2){
                    platList.push('微博及其他');
                }
                // if(item.pType==1){
                //     platList.push('抖音');
                // }else if(item.pType==2){
                //     platList.push('微博');
                // }else if(item.pType==3){
                //     platList.push('微视');
                // }else if(item.pType==4){
                //     platList.push('头条');
                // }else if(item.pType==5){
                //     platList.push('趣头条');
                // }else if(item.pType==7){
                //     platList.push('企鹅号');
                // }else if(item.pType==8){
                //     platList.push('百家号');
                // }else if(item.pType==9){
                //     platList.push('车家号');
                // }else if(item.pType==10){
                //     platList.push('易车');
                // }
            });
            datas.push(parseInt(dyz));
            datas.push(parseInt(wbz));
            upDatas.push(parseInt(dyNew));
            upDatas.push(parseInt(wbNew));
            this.myChartOne = echarts.init(document.getElementById("chartOne"));
            this.myChartTwo = echarts.init(document.getElementById("chartTwo"));
            this.$nextTick(()=>{
                this.createChartOne(Array.from(new Set(platList)),upDatas);
                this.createChartTwo(Array.from(new Set(platList)),datas);
            })
        },
        createChartOne(platList,upDatas) {
            this.myChartOne.setOption(
                {
                // title: {
                //   text: "用户手机型号TOP 5",
                //   textStyle: {
                //     color: "#00FFA1",
                //     fontSize: 12,
                //     fontWeight: "lighter"
                //   },
                //   left: 20,
                //   top: 20
                // },
                color: '#1BC787',
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: "3%",
                    right: "3%",
                    bottom: "5%",
                    top:"5%",
                    containLabel: true
                },
                xAxis: [
                    {
                    type: "category",
                    data: platList,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        textStyle: {
                        color: "rgba(0,0,0,1)" //坐标值得具体的颜色
                        },
                        interval: 0,
                        // rotate: 45
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#ebebeb"
                        }
                    }
                    }
                ],
                yAxis: [
                    {
                    type: "value",
                    axisLabel: {
                        textStyle: {
                            color: "#b4b4b4" //坐标值得具体的颜色
                        }
                    },
                    axisLine: {
                        lineStyle: {
                        color: "#ebebeb"
                        },
                        onZero: false
                    },
                    splitLine: {
                        lineStyle: {
                        type: "dotted",
                        opacity: 0.3
                        },
                        onZero: false
                    }
                    }
                ],
                series: [
                    {
                        name: "用户数",
                        type: "bar",
                        barWidth: "30",
                        data: upDatas,
                        "itemStyle": {
                            "normal": {
                                "color": "#1BC787",
                                "label": {
                                    "show": true,
                                    "textStyle": {
                                        "color": "#8B8B8B"
                                    },
                                    "position": "top",
                                    formatter: function(p) {
                                        return p.value > 0 ? (p.value)+'人' : '';
                                    }
                                }
                            }
                        },
            
                    }
                ]
                },
                true
            );
        },
        createChartTwo(platList,datas) {
            this.myChartTwo.setOption(
                {
                // title: {
                //   text: "用户手机型号TOP 5",
                //   textStyle: {
                //     color: "#00FFA1",
                //     fontSize: 12,
                //     fontWeight: "lighter"
                //   },
                //   left: 20,
                //   top: 20
                // },
                color: '#1BC787',
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: "0.5%",
                    right: "3%",
                    bottom: "5%",
                    top:"5%",
                    containLabel: true
                },
                xAxis: [
                    {
                    type: "category",
                    data: platList,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        textStyle: {
                        color: "rgba(0,0,0,1)" //坐标值得具体的颜色
                        },
                        interval: 0,
                        // rotate: 45
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#ebebeb"
                        }
                    }
                    }
                ],
                yAxis: [
                    {
                    type: "value",
                    axisLabel: {
                        textStyle: {
                        color: "#b4b4b4" //坐标值得具体的颜色
                        }
                    },
                    axisLine: {
                        lineStyle: {
                        color: "#ebebeb"
                        },
                        onZero: false
                    },
                    splitLine: {
                        lineStyle: {
                        type: "dotted",
                        opacity: 0.3
                        },
                        onZero: false
                    }
                    }
                ],
                series: [
                    {
                        name: "用户数",
                        type: "bar",
                        barWidth: "30",
                        data: datas,
                        "itemStyle": {
                            "normal": {
                                "color": "#1BC787",
                                "label": {
                                    "show": true,
                                    "textStyle": {
                                        "color": "#8B8B8B"
                                    },
                                    "position": "top",
                                    formatter: function(p) {
                                        return p.value > 0 ? (p.value)+'人' : '';
                                    }
                                }
                            }
                        },
                    }
                ]
                },
                true
            );
        },
    },
}
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
.floors.nb{
    border:none;
}
.chartBox{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.chartBox .title{
    opacity: 0.8;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000000;
}
.chart{
    width: 375px;
    height: 250px;
    margin-bottom: 10px;
    /* background-color: #fff; */
}
.container {
  width: 752px;
  margin: 0 auto;
  float: left;
  overflow: hidden;
  padding: 0 32px 0 36px;
  background-color: #fff;
}
.floors{
    border-bottom: 1px solid #E5E5E5;
}
.floors:last-child{
    border:none;
}
.floors .title{
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #333333;
    letter-spacing: 0.91px;
    padding-top: 30px;
    margin-bottom: 47px;
}
.floor_detail{
    display: flex;
    align-items: center;
    justify-content: space-around;
    
}
.floor_detail img{
    margin-right: 16px;
}
.detailItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    width: 25%;
}
.floor_detail .detailItem:first-child{
    width: 20%;
}
.detailItem .item_top{
    display: flex;
    align-items: center;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #333333;
    letter-spacing: 1.78px;
}
.detailItem .item_bottom{
    font-family: PingFangSC-Regular;
    font-size: 40px;
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 40px;
}
.light{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #1BC787;
    letter-spacing: 0.64px;
}
</style>