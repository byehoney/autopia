<template>
    <div class="container">
        <div class="floors" v-for="(item,index) in dataListOne" :key="index">
            <div class="title">{{item.oName}}</div>
            <div class="floor_detail">
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/xinzengfensishu.png" alt="">
                        <span>新增粉丝</span>
                    </div>
                    <div class="item_bottom">{{item.newUserCnt}}</div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/fensi.png" alt="">
                        <span>总粉丝</span>
                    </div>
                    <div class="item_bottom">
                        {{item.totalUserCnt}}
                        <span class="light" v-if="item.totalUserCnt>=10000000">(千万级)</span>
                        <span class="light" v-if="item.totalUserCnt>=1000000&&item.totalUserCnt<10000000">(百万级)</span>
                    </div>
                </div>
                <div class="detailItem" v-if="item.pType>3">
                    <div class="item_top">
                        <img src="../images/zan-copy.png" alt="">
                        <span>总获赞</span>
                    </div>
                    <div class="item_bottom">{{item.totalPraiseCnt}}</div>
                </div>
            </div>
        </div>
        <div class="floors nb">
            <div class="title">开车问查叔</div>
            <div class="floor_detail">
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/xinzengfensishu.png" alt="">
                        <span>新增粉丝</span>
                    </div>
                    <div class="item_bottom">{{totalUpTwo}}</div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/fensi.png" alt="">
                        <span>总粉丝</span>
                    </div>
                    <div class="item_bottom">
                        {{totalTwo}}
                        <span class="light" v-if="totalTwo>=10000000">(千万级)</span>
                        <span class="light" v-if="totalTwo>=1000000&&totalTwo<10000000">(百万级)</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="chartBox">
            <div class="title">新增粉丝</div>
            <div class="chart" id="chartOne"></div>
            <div class="title">总粉丝</div>
            <div class="chart" id="chartTwo"></div>
        </div>
    </div>
</template>
<script>
var echarts = require("echarts");
import { getOtherData } from '../api/index' 
export default {
    data(){
        return{
            dataListOne:[],
            dataListTwo:[],
            totalTwo:0,//查叔总用户
            totalUpTwo:0,//查叔新增
            twoName:''
        }
    },
    mounted() {
        document.getElementById("left").style.height = '1025px';
        document.getElementById("tabs").style.height = '1025px';
        this.getData();
    },
    methods: {
        async getData(){
            let res = await getOtherData();
            let list = [];
            let olist = [];
            let platList = [];
            let datas = [];
            let upDatas = [];
            res.otherDataList.forEach(item => {
                if(item.oName == "汽车女巫"&&item.pType>3){
                    list.push({oName:item.oName,newUserCnt:item.newUserCnt,totalPraiseCnt:item.totalPraiseCnt,totalUserCnt:item.totalUserCnt});
                }
                if(item.oName == '开车问查叔'&&item.pType>3){
                    olist.push({oName:item.oName,newUserCnt:item.newUserCnt,totalPraiseCnt:item.totalPraiseCnt,totalUserCnt:item.totalUserCnt,pType:item.pType});
                }
            });
            this.dataListOne = list;
            this.dataListTwo = olist;
            olist.forEach(item=>{
                this.totalTwo += parseInt(item.totalUserCnt);
                this.totalUpTwo += parseInt(item.newUserCnt);
                datas.push(parseInt(item.totalUserCnt)+'');
                upDatas.push(parseInt(item.newUserCnt)+'');
                if(item.pType==4){
                    platList.push('头条');
                }else if(item.pType==5){
                    platList.push('趣头条');
                }else if(item.pType==7){
                    platList.push('企鹅号');
                }else if(item.pType==8){
                    platList.push('百家号');
                }else if(item.pType==9){
                    platList.push('车家号');
                }else if(item.pType==10){
                    platList.push('易车');
                }
            })
            // this.platforms = platList;
            this.datas = [...datas];
            this.upDatas = [...upDatas];
            console.log(platList);
            console.log(datas);
            console.log(upDatas);
            this.myChartOne = echarts.init(document.getElementById("chartOne"));
            this.myChartTwo = echarts.init(document.getElementById("chartTwo"));
            this.$nextTick(()=>{
                this.createChartOne(platList,upDatas);
                this.createChartTwo(platList,datas);
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
                    data: upDatas
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
                    data: datas
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
.chartBox .title{
    opacity: 0.8;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000000;
}
.chart{
    width: 750px;
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
.floors:last-child,.nb{
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
    width: 33%;
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
    font-size: 44px;
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
