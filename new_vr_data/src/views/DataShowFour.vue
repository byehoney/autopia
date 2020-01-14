<template>
    <div class="container">
        <div class="main fl">
            <div class="top">
                <div class="type fl">
                    <el-select v-model="value" placeholder="请选择分析类别">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div :class="['start fl',rotateS?'isReverse':'']" v-if="value!=202">
                    <el-date-picker
                        v-model="start"
                        type="date"
                        :editable="false"
                        :clearable="false"
                        @focus="rotate(0)"
                        @blur="cRotate(0)"
                        :picker-options="startDatePicker"
                        placeholder="开始日期">
                    </el-date-picker>
                </div>
                <div class="divide fl" v-if="value!=202"></div>
                <div :class="['end fl',rotateE?'isReverse':'']" v-if="value!=202">
                    <el-date-picker
                        v-model="end"
                        type="date"
                        :editable="false"
                        :clearable="false"
                        @focus="rotate(1)"
                        @blur="cRotate(1)"
                        :picker-options="endDatePicker"
                        placeholder="结束日期">
                    </el-date-picker>
                </div>
                <div class="cx_btn fl" @click="goSearch">查询</div>
            </div>
            <div class="bottom">
                <div class="chartBox" v-if="value==201" id="chartBox">

                </div>
                <div class="chartBox" v-if="value==202" id="chartBoxOne">

                </div>
                <div class="chartBox" v-if="value==203" id="chartBoxTwo">

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import LeftBar from '../components/Left'
import { getDataShowFour } from '@/api/index'
var echarts = require('echarts');

export default {
    data(){
        return{
            startDatePicker:this.beginDate(),
            endDatePicker:this.processDate(),
            targetType:'',
            targetName:'',
            rotateS:false,
            rotateE:false,
            start:this.lastYear(),
            end:this.nowYear(),
            options: [{
                value: '201',
                label: '阅读周日均人数'
            }, {
                value: '202',
                label: '阅读月日均人数'
            }, {
                value: '203',
                label: '阅读月度趋势'
            }],
            value: '201',
            myChart:'',
            myChartOne:'',
            myChartTwo:''
        }
    },
    computed:{
    },
    created(){
        // console.log(this.$router.history.current.params)
    },
    mounted(){
        document.getElementById("left").style.height = '630px';
        document.getElementById("tabs").style.height = '630px';
        let type = sessionStorage.getItem('curIndex');
        if(type==1){
            this.targetType = 202;
            this.targetName = '微路况'
        }else if(type==3){
            this.targetType = 203
            this.targetName = '查违章'
        }else if(type==4){
            this.targetType = 204
            this.targetName = '微信生态'
        }
        this.getData();
    },
    methods:{
        async getData(){
            let res = await getDataShowFour({targetType:this.targetType,startDate:this.start,endDate:this.end,chartType:this.value});
            if(this.value==201){
                this.myChart = echarts.init(document.getElementById('chartBox'));
                this.createChartLine(res.dateDatas,res.articleDatas);   
            }else if(this.value==202){
                this.myChartOne = echarts.init(document.getElementById('chartBoxOne'));
                this.createChartBar(res.datas,res.dimensionArr,res.seriesArr);
            }else if(this.value==203){
                this.myChartTwo = echarts.init(document.getElementById('chartBoxTwo'));
                this.createChartCompare(res.dateDatas,res.avgDatas,res.peakDatas,res.valleyDatas);
            }
        },
        goSearch(){
            if(!this.start||!this.end){
                return;
            }
            this.getData()
        },
        nowYear(){
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        lastYear(){
            var nowDate = new Date();
            var date = new Date(nowDate);
            date.setDate(date.getDate()-365);
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        rotate(index){
            if(index==0){
                this.rotateS=true;
            }else{
                this.rotateE=true;
            }
        },
        cRotate(index){
            if(index==0){
                this.rotateS=false;
            }else{
                this.rotateE=false;
            }
        },
        createChartLine(xData,yData){
            this.myChart.setOption({
                title:{
                    show:true,
                    text:'阅读周日均人数',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#333',
                        fontSize: 18,
                        letterSpacing: 2,
                        fontWeight:'bold'
                    }
                },
                tooltip : {
                    trigger: 'axis',
                },
                grid: {
                    left: "3%",
                    right: "3%",
                    bottom: "3%",
                    top:"10%",
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    position:'bottom',
                    offset:0,
                    splitLine:{show: false},//去除网格线
                    // min: function(value) {
                    //     return value.min +30;
                    // },
                    axisLine: {
                        show:true,
                        lineStyle:{
                         color:'#ebebeb'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#000',//坐标值得具体的颜色
                            fontSize:8
                        },
                        rotate:45
                    },
                    data: xData
                },
                yAxis: {
                    type: 'value',
                    splitLine:{show: false},//去除网格线
                    axisLine: {
                        show:true,
                        lineStyle:{
                            color:'#ebebeb'
                        }
                    },
                    // offset:20,
                    axisLabel: {
                        textStyle: {
                            color: '#000',//坐标值得具体的颜色
                            fontSize:8
                        }
                    }
                },
                series: [{
                    data: yData,
                    type: 'line',
                    smooth: true,
                    symbol:'none',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width:2,
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: '#1BC787' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#1BC787' // 100% 处的颜色
                                    }],
                                    global: false // 缺省为 false
                                }
                            }
                        }
                    },
                }]
            },true);
        },
        createChartBar(datas,dimensionArr,seriesArr){
            this.myChartOne.setOption({
                title:{
                    text:'阅读月日均人数',
                    left: 'center',
                    top: 16,
                    textStyle: {
                        color: '#333',
                        opacity:0.5,
                        fontSize:18,
                        fontWeight:'bold'
                    }
                },
                grid: {
                    left: "5%",
                    right: "3%",
                    bottom: "10%",
                    top:"10%",
                    containLabel: true
                },
                tooltip : {
                    // trigger: 'axis'
                },
                legend: {
                    bottom:5,
                    itemGap: 50,
                    itemWidth: 12,
                    itemHeight: 12,
                    data: [
                        {
                            name:'2018',
                            textStyle:{
                                color: '#1BC787',
                                fontSize:12,
                                padding:[0,5]
                            }
                        },
                        {
                            name:'2019',
                            textStyle:{
                                color: '#F3F4F5',
                                fontSize:12,
                                padding:[0,5]
                            }
                        }
                    ]
                },
                xAxis: [
                    {
                        type: 'category',
                        splitLine:{show: false},//去除网格线
                        axisLine: {
                            show:true,
                            lineStyle:{
                                color:'#ebebeb'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#000',//坐标值得具体的颜色
                                fontSize:8
                            }
                        },
                        axisTick: {show: false},
                        // data: ['一月', '二月','三月', '四月','五月', '六月','七月', '八月','九月', '十月','十一月', '十二月']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine:{show: false},//去除网格线
                        axisLine: {
                            show:true,
                            lineStyle:{
                                color:'#ebebeb'
                            }
                        },
                        offset:10,
                        axisLabel: {
                            textStyle: {
                                color: '#b4b4b4',//坐标值得具体的颜色
                                fontSize:10
                            }
                        },
                    }
                ],
                dataset: {
                    dimensions: dimensionArr,
                    source: datas
                },
                series: seriesArr
            },true)
        },
        createChartCompare(dateDatas,avgDatas,peakDatas,valleyDatas){
            this.myChartTwo.setOption({
                title: {
                    text: '阅读月度趋势',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#000',
                        fontSize: 18,
                        letterSpacing: 2,
                        fontWeight:'bold'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                },
                color:['#FF787B','#00FFA1','#FFEF27'],
                grid: {
                    left: "5%",
                    right: "3%",
                    bottom: "8%",
                    top:"10%",
                    containLabel: true
                },
                legend: {
                    bottom:0,
                    itemGap: 50,
                    itemWidth: 12,
                    itemHeight: 12,
                    padding:[10,0,0],
                    data: [
                        {
                            name:'日均阅读人数',
                            icon:'rect',
                            textStyle:{
                                color: '#FF787B',
                                fontSize:12,
                                padding:[0,5],
                            }
                        },
                        {
                            name:'月峰阅读人数',
                            icon:'rect',
                            textStyle:{
                                color: '#00FFA1',
                                fontSize:12,
                                padding:[0,5]
                            }
                        },
                        {
                            name:'月谷阅读人数',
                            icon:'rect',
                            textStyle:{
                                color: '#FFEF27',
                                fontSize:12,
                                padding:[0,5]
                            }
                        }
                    ]
                },
                // toolbox: {
                //     feature: {
                //         saveAsImage: {}
                //     }
                // },
                xAxis: {
                    type: 'category',
                    splitLine:{show: false},//去除网格
                    axisLine: {
                        show:true,
                        lineStyle:{
                            color:'#ebebeb'
                        }
                    },
                    offset:0,
                    axisLabel: {
                        textStyle: {
                            color: '#000',//坐标值得具体的颜色
                            fontSize:8
                        }
                    },
                    axisTick: {show: false},
                    data: dateDatas
                },
                yAxis: {
                    type: 'value',
                    splitLine:{show: false},//去除网格线
                    axisLine: {
                        show:true,
                        lineStyle:{
                            color:'#ebebeb'
                        }
                    },
                    offset:0,
                    axisLabel: {
                        textStyle: {
                            color: '#b4b4b4',//坐标值得具体的颜色
                            fontSize:10
                        }
                    },
                },
                series: [
                    {
                        name:'日均阅读人数',
                        type:'line',
                        // stack: '总量',
                        smooth: true,
                        symbol:'none',
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width:3,
                                    color: '#FF787B'
                                }
                            },
                        },
                        data:avgDatas
                    },
                    {
                        name:'月峰阅读人数',
                        type:'line',
                        // stack: '总量',
                        smooth: true,
                        symbol:'none',
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width:3,
                                    color: '#00FFA1'
                                }
                            }
                        },
                        data:peakDatas
                    },
                    {
                        name:'月谷阅读人数',
                        type:'line',
                        // stack: '总量',
                        smooth: true,
                        symbol:'none',
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width:3,
                                    color: '#FFEF27'
                                }
                            }
                        },
                        data:valleyDatas
                    }
                ]
            },true)
        },
        beginDate(){
            let self = this
            return {
                disabledDate(time){
                    if(self.end){
                        return new Date(self.end).getTime() < time.getTime() || time.getTime() > Date.now()
                    }else{
                        return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                    }
                }
            }
        },
        //提出结束时间必须大于提出开始时间
        processDate(){
            let self = this
            return {
                disabledDate(time){
                    if(self.start){
                        return new Date(self.start).getTime() > time.getTime() || time.getTime() > Date.now()
                    }else{
                        return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                    }
                }
            }
        }
    }
}
</script>
<style scoped>
    .container{
        overflow: hidden;
        background-color: #fff;
        height: 630px;
    }
    .main{
        width: 820px;
    }
    .fl{
        float: left;
    }
    .fr{
        float: right;
    }
    .top{
        overflow: hidden;
    }
    .bottom{
        width: 820px;
        height: 576px;
        margin-bottom: 126px;
    }
    .chartBox{
        width: 820px;
        height: 550px;
        margin: 0 auto;
    }
</style>
