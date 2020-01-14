<template>
    <div class="mangeContainer" style="opacity:1">
        <ManageTopNav @trigerLeft="trigerDrawerLeft"></ManageTopNav>
        <DrawerLeft ref="leftDrwaer"></DrawerLeft>
        <div class="main">
            <div class="top">
                <div :class="['date long',dateActive?'active':'']" @click="selDate">
                    {{dateList[curDateIndex].text}}
                    <div class="dataList" v-if="showDateList">
                        <p :class="['dataItem',curDateIndex==index?'active':'']" @click="selCurDate($event,index)" v-for="(item,index) in dateList" :key="index">{{item.text}}</p>
                    </div>
                </div>
                <div :class="['type',typeActive?'active':'']" @click="selType">
                    {{typeList[curTypeIndex].text}}
                    <div class="typeList" v-if="showTypeList">
                        <p :class="['typeItem',curTypeIndex==index?'active':'']" @click="selCurType($event,index)" v-for="(item,index) in typeList" :key="index">{{item.text}}</p>
                    </div>
                </div>
                <div :class="['area',areaActive?'active':'']" @click="selArea">
                    {{sel_value.substr(0,3).replace(',','')}}
                    <!-- <div class="typeList" v-if="showAreaList">
                        <p :class="['typeItem',curAreaIndex==index?'active':'']" @click="selCurArea($event,index)" v-for="(item,index) in areaList" :key="index">{{item.regionName}}</p>
                    </div> -->
                </div>
                <div class="total" v-if="list.length">合计数：{{list[0].hjkhs}}</div>
                <div class="total" v-else>合计数：0</div>
            </div>
            <ul
                class="content"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
            >
                <div class="contentItem" v-for="(item,index) in list" :key="index">
                    <div class="infoTop">
                        <img class="icon" src="../images/dianpu_m.png" alt="">
                        <p class="fName">{{item.companyname}}</p>
                    </div>
                    <div class="infoBottom">
                        <div class="info">
                            店铺编码：{{item.companyid}}
                        </div>
                        <div class="info">
                            订单数量：{{item.dds}}
                        </div>
                        <div class="info">
                            采购总额：￥{{item.cgze}}
                        </div>
                        <div class="info">
                            采购品种：{{item.cgpz}}
                        </div>
                    </div>
                </div>
            </ul>
        </div>
        <ManageTabBarBotttom curTab="manageCustomerRank"></ManageTabBarBotttom>
        <div class="mask" v-show="showDrawLeft" @click="handleMaskClick"></div>
        <CityPicker  :areaVisible="cityVisible" :setArea="handleSetArea" :cancel="handleCancel" global="manage"></CityPicker>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import {mapGetters,mapMutations,mapState} from 'vuex'
import ManageTabBarBotttom from '@/components/ManageTabBarBottom'
import DrawerLeft from '@/components/DrawerLeft'
import ManageTopNav from '@/components/ManageTopNav'
import CityPicker from "@/components/CityPicker";
import { getCoustomerCityList,getCoustomerRankList } from '@/api/index'
export default {
    data(){
        return{
            dateActive:true,
            typeActive:false,
            areaActive:false,
            showDateList:false,
            showTypeList:false,
            showAreaList:false,
            dateList:[{text:'近七天',days:7},{text:'近三十天',days:30},{text:'近三个月',days:90},{text:'近六个月',days:180}],
            typeList:[{text:'销量',sort:0},{text:'订单量',sort:1}],
            areaList:[{regionCode: "", regionName: "全国"}],
            curDateIndex:1,
            curTypeIndex:0,
            curAreaIndex:0,
            list:[],
            loading:false,
            moreLoading:false,
            hasMore:true,
            pageSize:10,
            pageNum:1,
            noData:false,//是否有数据
            cityVisible:false,
            sel_value:'全国',
            pCode:'',
            cCode:'',
            aCode:'',
        }
    },
    computed:{
         ...mapState({
          user:state=>state.login.user,
          token:state=>state.login.token,
          showDrawLeft:state=>state.mange.showDrawLeft
        }),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components:{
        ManageTabBarBotttom,
        ManageTopNav,
        DrawerLeft,
        CityPicker,
    },
    async mounted() {
        let defaulParams = {
            token:this.token,
            userId:this.userId,
            corpCode:this.corpCode,
            companyId:this.companyId,
            userRole:this.userRole,
        };        
        // let cities = await getCoustomerCityList({...defaulParams});
        // this.areaList = cities.data.list;
        this.loading = true;
        this.getData();
    },
    destroyed() {
        this.loading = false;
    },
    methods: {
        ...mapMutations('mange',['changeDrawLeft']),
        // handlerArea(){
        //     this.areaVisible = !this.areaVisible;
        // },
        handleSetArea(value,pCode,cCode,aCode){
            this.sel_value = value;
            this.pCode = pCode;
            this.cCode = cCode;
            this.aCode = aCode;
            this.cityVisible = false;
            this.hasMore = true;
            this.list = [];
            this.pageNum = 1;
            this.getData();
        },
        handleCancel(){
            this.cityVisible = false;
        },
        trigerDrawerLeft(){
            this.changeDrawLeft(true);
        },
        handleMaskClick(){
            this.changeDrawLeft(false)
        },
        selDate(){
            this.dateActive = true;
            this.showDateList = true;
            this.showTypeList = false;
            this.typeActive = false;
            this.showAreaList = false;
            this.areaActive = false;
            this.cityVisible = false;
        },
        selType(){
            this.typeActive = true;
            this.dateActive = false;
            this.showTypeList = true;
            this.showDateList = false;
            this.showAreaList = false;
            this.areaActive = false;
            this.cityVisible = false;
        },
        selArea(){
            this.typeActive = false;
            this.dateActive = false;
            this.showTypeList = false;
            this.showDateList = false;
            this.showAreaList = true;
            this.areaActive = true;
            this.cityVisible = !this.cityVisible;
        },
        selCurDate(e,index){
            e.stopPropagation();
            if(this.moreLoading){
                return;
            }
            this.curDateIndex = index;
            this.showDateList = false;
            this.hasMore = true;
            this.list = [];
            this.pageNum = 1;
            this.getData();
        },
        selCurType(e,index){
            e.stopPropagation();
            if(this.moreLoading){
                return;
            }
            this.curTypeIndex = index;
            this.showTypeList = false;
            this.hasMore = true;
            this.list = [];
            this.pageNum = 1;
            this.getData();
        },
        selCurArea(e,index){
            e.stopPropagation();
            if(this.moreLoading){
                return;
            }
            this.curAreaIndex = index;
            this.showAreaList = false;
            this.hasMore = true;
            this.list = [];
            this.pageNum = 1;
            this.getData();
        },
        async getData(){
            this.moreLoading = true;
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
                pageSize:this.pageSize,
                pageNum:this.pageNum
            };
            let res = await getCoustomerRankList({
                ...defaulParams,
                days:this.dateList[this.curDateIndex].days,
                sort:this.typeList[this.curTypeIndex].sort,
                regionCode:this.aCode
            })
            this.moreLoading = false;
            this.loading = false;
            if(res.code == 0){
                if(!res.data.list.length){
                    this.hasMore = false;
                    this.moreLoading = false;
                    if(this.pageNum!=1){
                        Toast({
                            message: "已经到底了~",
                            position: "middle",
                            duration: 2000
                        });
                    }else{
                        Toast({
                            message: "暂无数据",
                            position: "middle",
                            duration: 2000
                        });
                    }
                    return;
                }else{
                    this.hasMore = true;
                    this.moreLoading = false;
                }
                this.list = [...this.list,...res.data.list];
            }
        },
        loadMore(){
            if(this.moreLoading||!this.hasMore){
                return;
            }
            this.pageNum = this.pageNum+1;
            this.getData();
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
        padding-top: 100px;
        background-color: #e5e5e5;
        .main{
            background-color: #fff;
            padding-bottom: 100px;
            .contentItem{
                display: flex;
                flex-direction: column;
                margin-left: 46px;
                padding: 0 36px 34px 0;
                border-bottom: 2px solid #ebebeb;
                .infoBottom{
                    display: flex;
                    flex-wrap: wrap;
                    width: 94%;
                    padding-top:27px;
                    .info{
                        width: 50%;
                        font-size:20px;
                        color:rgba(153,153,153,1);
                        line-height:26px;
                        letter-spacing:2px;
                        // text-indent: 60px;
                        text-align: center;
                        margin-bottom: 10px;
                        // pad-ding-left: 60px;
                    }
                }
                .infoTop{
                    display: flex;
                    padding: 37px  36px 0 0;
                    .icon{
                        width: 40px;
                        height: 36px;
                        margin-right: 20px;
                    }
                    .fName{
                        font-size:26px;
                        color:rgba(51,51,51,1);
                        line-height:35px;
                        letter-spacing:2px;
                        width: 500px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            .top{
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-left: 39px;
                padding: 31px 37px 31px 0 ;
                height: 30px;
                border-bottom: 2px solid #ebebeb;
                .total{
                    font-size:22px;
                    color:rgba(102,102,102,1);
                    line-height:29px;
                    letter-spacing:2px;
                    // margin-left: 65px;
                }
                .date,.type,.area{
                    position: relative;
                    width: 115px;
                    font-size:22px;
                    color:rgba(153,153,153,1);
                    letter-spacing:2px;
                    padding-left: 26px;
                    &.long{
                        width: 150px;
                    }
                    &.active{
                        color: #007AFF;
                        &::after{
                             border-color:#007AFF transparent transparent transparent;
                        }
                    }
                    .dataList,.typeList{
                        position: absolute;
                        left: 0;
                        top: 0.6rem;
                        border: 2px solid #ebebeb;
                        background-color: #fff;
                    }
                    &::after{
                        content: '';
                        display: inline-block;
                        width: 0; 
                        height: 0;
                        border-width: 13px;
                        border-style: solid;
                        border-color:#999999 transparent transparent transparent;
                        position: absolute;
                        top: 0;
                        right: 0;
                        top: 5px;
                        right: 0;
                    }
                }
                .dataList{
                    .dataItem{
                        padding-left: 26px;
                        width: 189px;
                        height: 75px;
                        font-size:22px;
                        font-family:MicrosoftYaHei;
                        color:#666;
                        letter-spacing:2px;
                        line-height: 75px;
                        border-bottom: 2px solid #ebebeb;
                        &.active{
                            background-color: #007AFF;
                            color:#fff;   
                        }
                        &:last-child{
                            border: none;
                        }
                    }
                }
                .typeList{
                    .typeItem{
                        padding-left: 26px;
                        width: 189px;
                        height: 75px;
                        line-height: 75px;
                        font-size:22px;
                        color:rgba(102,102,102,1);
                        letter-spacing:2px;
                        border-bottom: 2px solid #ebebeb;
                        &:last-child{
                            border: none;
                        }
                        &.active{
                            background-color: #007AFF;
                            color:#fff;   
                        }
                    }
                }
            }
        }
    }
</style>
