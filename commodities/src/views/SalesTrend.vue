<template>
    <div :class="['mangeContainer']">
        <ManageTopNav @trigerLeft="trigerDrawerLeft"></ManageTopNav>
        <DrawerLeft ref="leftDrwaer"></DrawerLeft>
        <div class="main">
            <p class="top">
                <span :class="[curIndex==0?'active':'']" @click="changeType(0)">近8天</span>
                <span :class="[curIndex==1?'active':'']" @click="changeType(1)">近四周</span>
                <span :class="[curIndex==2?'active':'']"  @click="changeType(2)">近三月</span>
            </p>
            <p class="title green">当日销售额</p>
            <div class="chartOne chart" id="chartOne">
                
            </div>
            <p class="title purple">当日订单门店数</p>
            <div class="chartTwo chart" id="chartTwo">
                
            </div>
            <p class="title yellow">当日产品销量</p>
            <div class="chartThree chart" id="chartThree">
                
            </div>
        </div>
        <ManageTabBarBotttom curTab="salesTrend"></ManageTabBarBotttom>
        <div class="mask" v-show="showDrawLeft" @click="handleMaskClick"></div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import HighCharts from 'highcharts'
import ManageTabBarBotttom from '@/components/ManageTabBarBottom'
import ManageTopNav from '@/components/ManageTopNav'
import DrawerLeft from '@/components/DrawerLeft'
import { mapState ,mapActions,mapGetters, mapMutations} from 'vuex';
import { getZxtList } from '@/api/index'
import { setTimeout } from 'timers';
export default {
    data(){
        return{
            curIndex:0,
            loading:false
        }
    },
    components:{
        ManageTabBarBotttom,
        ManageTopNav,
        DrawerLeft
    },
    computed: {
        ...mapState('mange',['showDrawLeft']),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    mounted() {
        this.getData();
    },
    methods: {
        ...mapMutations('mange',['changeDrawLeft']),
        trigerDrawerLeft(){
            // this.showLeft = true;
            // this.$refs.leftDrwaer.showDrawerLeft()
            this.changeDrawLeft(true);
        },
        handleMaskClick(){
            this.changeDrawLeft(false)
        },
        changeType(index){
            if(this.loading){
                return
            }
            this.loading = true;
            this.curIndex = index;
            this.getData();
        },
        async getData(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            };
            let res = await getZxtList({...defaulParams,type:parseInt(this.curIndex)+1});
            this.loading = false;
            let categories = [];
            let dataOne = [];
            let dataTwo = [];
            let dataThree = [];
            res.data.list.forEach((item,index) => {
                categories.push(item.date);
                dataOne.push(parseFloat(item.saleamount));
                dataTwo.push(parseInt(item.shopcount));
                dataThree.push(parseInt(item.salecount));
            });
            setTimeout(()=>{
                HighCharts.chart('chartOne',{
                    chart:{
                        backgroundColor:'transparent'
                    },
                    title:{
                        text:''
                    },
                    legend:{
                        enabled:false
                    },
                    xAxis:{
                        categories: categories,
                        labels:{
                            style:{
                                color:'#fff'
                            }
                        },
                        lineWidth:4,
                        lineColor:'#fff'
                    },
                    yAxis: {
                        title: {
                                text: ''
                        },
                        min: 0, 
                        minPadding: 0, 
                        minRange: 1,
                        startOnTick: true, 
                        gridLineColor:'transparent',
                        labels:{
                            enabled:false
                        }
                    },
                    series: [{
                        name:'销售额',
                        color:'#fff',
                        data: dataOne
                    }],
                })
                HighCharts.chart('chartTwo',{
                    chart:{
                        backgroundColor:'transparent'
                    },
                    title:{
                        text:''
                    },
                    legend:{
                        enabled:false
                    },
                    xAxis:{
                        categories: categories,
                        labels:{
                            style:{
                                color:'#fff'
                            }
                        },
                        lineWidth:4,
                        lineColor:'#fff'
                    },
                    yAxis: {
                        title: {
                                text: ''
                        },
                        min: 0, 
                        minPadding: 0, 
                        minRange: 1,
                        startOnTick: true, 
                        gridLineColor:'transparent',
                        labels:{
                            enabled:false
                        }
                    },
                    series: [{
                        name:'门店数',
                        color:'#fff',
                        data: dataTwo
                    }],
                })
                HighCharts.chart('chartThree',{
                    chart:{
                        backgroundColor:'transparent'
                    },
                    title:{
                        text:''
                    },
                    legend:{
                        enabled:false
                    },
                    xAxis:{
                        categories: categories,
                        labels:{
                            style:{
                                color:'#fff'
                            }
                        },
                        lineWidth:4,
                        lineColor:'#fff'
                    },
                    yAxis: {
                        title: {
                                text: ''
                        },
                        min: 0, 
                        minPadding: 0, 
                        minRange: 1,
                        startOnTick: true, 
                        gridLineColor:'transparent',
                        labels:{
                            enabled:false
                        }
                    },
                    series: [{
                        name:'销量',
                        color:'#fff',
                        data: dataThree
                    }],
                })
            },100)
        }
    },
}
</script>
<style lang="scss" scoped>
    .mask{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.6);
      z-index:99999;
    }
    .mangeContainer{
        width: 100%;
        background-color: #e5e5e5;
        &.pop{
            height: 100vh;
            overflow: hidden;
        }
        .main{
            background-color: #fff;
            margin-top: 100px;
            padding-bottom: 100px;
            .top{
                padding: 39px 0 36px 39px;
                line-height:31px;
                display: flex;
                span{
                    font-size:24px;
                    font-weight:bold;
                    color:rgba(153,153,153,1);
                    line-height:31px;
                    letter-spacing:1px;
                    margin-right: 49px;
                    &.active{
                        color:rgba(245,166,35,1);
                    }
                }
            }
            .title{
                font-size:24px;
                color:rgba(51,51,51,1);
                line-height:31px;
                letter-spacing:1px;
                margin-bottom: 19px;
                &::before{
                    content: ' ';
                    width: 13px;
                    height: 18px;
                    display: inline-block;
                    margin-right: 26px;
                }
                &.green{
                    &::before{
                        background-color: #7ED321
                    }
                }
                &.purple{
                    &::before{
                        background-color: #8589FF
                    }
                }
                &.yellow{
                    &::before{
                        background-color: #FFBE50
                    }
                }
            }
            .chart{
                width: 676px;
                height: 326px;
                margin:  0 auto 38px;
                &.chartOne{
                    background:linear-gradient(180deg,rgba(165,229,101,1) 0%,rgba(10,136,34,1) 100%);
                }
                &.chartTwo{
                    background:linear-gradient(360deg,rgba(87,72,235,1) 0%,rgba(200,109,215,1) 100%);
                }
                &.chartThree{
                    background:linear-gradient(180deg,rgba(250,217,97,1) 0%,rgba(247,107,28,1) 100%);
                }
            }
        }
    }
</style>
