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
                <div :class="['start fl',rotateS?'isReverse':'']">
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
                <div class="divide fl"></div>
                <div :class="['end fl',rotateE?'isReverse':'']">
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
                <!-- <div class="btTitle">{{title}}</div> -->
                <div class="chartBox" id="chartBox">

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {getDataShowTwo} from '@/api/index';
import LeftBar from '../components/Left'
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
            title:'',
            options: [{
                value: '101',
                label: '周末累关人数'
            }, {
                value: '102',
                label: '月末累关人数'
            }, {
                value: '103',
                label: '周日均新增人数'
            }, {
                value: '104',
                label: '周日均取关人数'
            }, {
                value: '105',
                label: '周日均净增人数'
            }, {
                value: '106',
                label: '月日均新增人数'
            }, {
                value: '107',
                label: '月日均取关人数'
            }, {
                value: '108',
                label: '月日均净增人数'
            }],
            value: '101',
            myChart:''
        }
    },
    created(){
        // console.log(this.$router.history.current.params)
    },
    mounted(){
        document.getElementById("left").style.height = '683px';
        document.getElementById("tabs").style.height = '683px';
        let type = sessionStorage.getItem('curIndex');
        if(type==1){
            this.targetType = 202;
            this.targetName = '微路况'
        }else if(type==3){
            this.targetType = 203
            this.targetName = '查违章（订阅号）'
        }else if(type==4){
            this.targetType = 201
            this.targetName = '微信生态'
        }
        this.getData();
    },
    methods:{
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
        async getData(){
            let res = await getDataShowTwo({targetType:this.targetType,startDate:this.start,endDate:this.end,chartType:this.value});
            this.userDatas = res.userDatas;
            this.dateDatas = res.dateDatas;
            this.myChart = echarts.init(document.getElementById('chartBox'));
            this.createChart();
        },
        goSearch(){
            if(!this.end||!this.start){
                return;
            }
            this.getData();
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
            date.setDate(date.getDate()-180);
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
        },
        createChart(){
            let index = this.options.findIndex((v)=>{
                return v.value == this.value;
            })
            let interval = 0;
            if(this.value==101||this.value==103||this.value==104||this.value==105){
                interval = 5;
            }
            this.title = this.options[index].label;
            this.myChart.setOption({
                title:{
                    show:true,
                    text:this.title,
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#333',
                        fontSize: 18,
                        letterSpacing: 2,
                        fontWeight:'bold'
                    }
                },
                grid: {
                    left: "3%",
                    right: "3%",
                    bottom: "1%",
                    top:"10%",
                    containLabel: true
                },
                tooltip : {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'category',
                    position:'bottom',
                    offset:0,
                    splitLine:{show: false},//去除网格线
                    axisLine: {
                        show:true,
                        lineStyle:{
                            color:'#ebebeb'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    scale:true,
                    axisLabel: {
                        textStyle: {
                            color: '#000',//坐标值得具体的颜色
                            fontSize:8
                        },
                        // interval: interval,
                        rotate:45
                    },
                    data: this.dateDatas
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
                    axisTick:{
                        show:false
                    },
                    // offset:20,
                    axisLabel: {
                        textStyle: {
                            color: '#b4b4b4',//坐标值得具体的颜色
                            fontSize:10
                        },
                    }
                },
                
                series: [{
                    data: this.userDatas,
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
                                        offset: 0, color: '#1BC787 ' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#1BC787 ' // 100% 处的颜色
                                    }],
                                    global: false // 缺省为 false
                                }
                            }
                        }
                    },
                }]
            });
        },
        createChartBottom(){
            this.myChart.setOption({
                title:{
                    text:'微路况月度日均总阅读人数同比',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#00FFA1',
                        fontSize: 18,
                        letterSpacing: 2,
                    }
                },
                tooltip : {
                    // trigger: 'axis'
                },
                legend: {
                    bottom:0,
                    itemGap: 50,
                    itemWidth: 12,
                    itemHeight: 12,
                    data: [
                        {
                            name:'2018',
                            textStyle:{
                                color: '#F3F4F5',
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
                            show:false,
                        },
                        // min: function(value) {
                        //     return value.min +30;
                        // },
                        axisLabel: {
                            textStyle: {
                                color: 'rgba(255,255,255,.5)',//坐标值得具体的颜色
                            }
                        },
                        axisTick: {show: false},
                        data: ['一月', '二月','三月', '四月','五月', '六月','七月', '八月','九月', '十月','十一月', '十二月']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine:{show: false},//去除网格线
                        axisLine: {
                            show:false,
                        },
                        offset:28,
                        axisLabel: {
                            textStyle: {
                                color: 'rgba(255,255,255,.5)',//坐标值得具体的颜色
                            }
                        },
                    }
                ],
                series: [
                    {   
                        name:'2018',
                        type: 'bar',
                        barWidth:'6px',
                        barGap:'100%',
                        itemStyle:{
                            barBorderRadius:[8,8,4,4],
                            color:'#00FFA1' 
                        },
                        data: [320, 332,320, 332,320, 332,320, 332,320, 332,320, 332]
                    },
                    {
                        name:'2019',
                        type: 'bar',
                        barWidth:'6px',
                        barGap:'100%',
                        itemStyle:{
                            barBorderRadius:[8,8,4,4],
                            color:'#FFEF27' 
                        },
                        data: [220, 182,220, 182,220, 182,220, 182,220, 182,220, 182]
                    }
                ]
            })
        }
    },
}
</script>
<style scoped>
    .container{
        overflow: hidden;
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
        height: 630px;
        /* margin-top: 52px;
        margin-bottom: 126px; */
    }
    .btTitle{
        text-align: center;
        font-size: 18px;
        color: #00FFA1;
        letter-spacing: 2px;
        text-align: center;
        /* font-weight: lighter; */
        padding-top:20px; 
    }
    .chartBox{
        width: 820px;
        height: 600px;
    }
</style>
