<template>
    <div class="driverContainer">
        <div class="nav">
            <img @click="goBack" src="../images/arrow_left_white.png" class="leftIcon" alt="">
            <span class="title">{{title}}</span>
        </div>
        <div class="checkList"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
        >
            <div class="inputArea">
                <div class="inputItem">
                    <div class="left">开始时间：</div>
                    <div class="right" v-if="start" id="start"  @click="show('S')">
                        <span>{{start}}</span>
                        <img class="dateIcon" src="../images/driver/data_icon.png" alt="">  
                    </div>    
                </div>
                <div class="inputItem">
                    <div class="left">结束时间：</div>
                    <div class="right"  v-if="end" id="end" @click="show('E')">
                        <span>{{end}}</span>
                        <img class="dateIcon" src="../images/driver/data_icon.png" alt="">
                    </div>    
                </div>
                <div class="inputItem">
                    <div class="left">调度单号：</div>
                    <div class="right">
                        <input type="text" v-model="orderNum" placeholder="请输入调度单号">    
                    </div>    
                </div>
                <div class="inputItem">
                    <div class="left">客户信息：</div>
                    <div class="right">
                        <input type="text" v-model="customer" placeholder="请输入客户信息">    
                    </div>    
                </div>
                <div class="btn" @click="doSearch">查询</div>
            </div>
            <!-- 未送达 -->
            <div class="noArive">
                <div class="noAriveBox" v-for="(item,index) in list" :key="index">
                    <div class="mainInfo">
                        <div class="infos">
                            <div class="left">调度单号：</div>
                            <div class="right">{{item.dddh}}</div>
                        </div>
                        <div class="infos">
                            <div class="left">运输线路：</div>
                            <div class="right">{{item.ysxl}}</div>
                        </div>
                    </div>
                    <div class="detailBox">
                        <div class="detailInfo" @click="goNoAriveDetail(ptem.dddh,ptem.companyid)" v-for="(ptem,pIndex) in item.childs" :key="pIndex">
                            <div class="detailInfos title">
                                <div class="left">客户：</div>
                                <div class="right">{{ptem.khmc}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">联系电话：</div>
                                <div class="right">{{ptem.lxdh}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">送货地址：</div>
                                <div class="right">{{ptem.address}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">配送日期：</div>
                                <div class="right">{{ptem.psrq}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">货值（元）：</div>
                                <div class="right">{{ptem.hz}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">体积（立方米）：</div>
                                <div class="right">{{ptem.tj}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">载重（公斤）：</div>
                                <div class="right">{{ptem.zz}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">品种数：</div>
                                <div class="right">{{ptem.pzs}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">库位数：</div>
                                <div class="right">{{ptem.kws}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">运费（元）：</div>
                                <div class="right">{{ptem.yf}}</div>
                            </div>
                            <!-- <div class="btnArea">
                                <div class="ariveBtn" @click="doArive($event,ptem.dddh,ptem.companyid,index,pIndex)">送达</div>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <awesome-picker
            ref="picker"
            :textTitle="picker.textTitle"
            :type="picker.type"
            :anchor="picker.anchor"
            :colorConfirm="picker.colorConfirm"
            @cancel="handlePickerCancel"
            @confirm="handlePickerConfirm"
        ></awesome-picker>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '../components/DriverTopNav';
import {reqManageSendingList} from '@/api/index';
import { mapState ,mapActions,mapGetters, mapMutations} from 'vuex';
export default {
    data(){
        return{
            lng:'',
            lat:'',
            title:'配送中',
            orderNum:'',//调度单号
            customer:'',//客户信息
            curSendIndex:'',//当前送货list 中操作index
            curSendOrder:'',//当前送货list中操作调度单号
            curAriveIndex:'',//当前操作送达list索引
            curAriveCIndex:'',//当前操作送达list childs 索引
            curAriveOrder:'',//当前操作送达调度单号
            curCompanyId:'',//当前操作送达公司id
            start:this.getNowFormatDate() ,
            end:this.getNowFormatDate(),
            curDate:'',
            Y: "",
            M: "",
            D: "",
            picker: {
                anchor: [],
                textTitle: "选择日期",
                type: "date",
                colorConfirm:"#007AFF"
            },
            showTip:false,//是否显示弹窗
            sendOrArrive:0,//发货 0 还是 送达 1
            loading:false,
            list:[],
            moreLoading:false,
            pageSize:10,
            pageNum:1,
            noData:false,//是否有数据
            hasMore:true,

        }
    },
    computed:{
        // ...mapState('login',['user','token']),
        ...mapState({
          user:state=>state.login.user,
          token:state=>state.login.token,
        }),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components:{
        // TopNav
    },
    mounted() {
       
    },
    activated() {/**  */
        if (!this.$route.meta.canKeep) {
            this.loading = true;
            this.hasMore = true;
            this.pageNum = 1;
            this.noData = false;
            this.list = [];
            this.getData();
        }
    },
    deactivated(){
        this.loading = true;
    },
    beforeRouteLeave(to, from, next){
        let position = document.getElementsByClassName('checkList')[0].scrollTop
        sessionStorage.setItem('SendingTop',position);
        next()
    },
    beforeRouteEnter (to, from, next) {/**  */
        if(from.name == 'manageSendRoute'){
            to.meta.canKeep = true;
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.$nextTick(function(){
                    let position = sessionStorage.getItem('SendingTop') //返回页面取出来
                    document.getElementsByClassName('checkList')[0].scrollTo({ 
                        top: position, 
                        behavior: "instant" 
                    });
                })
            })   
        }else{
            to.meta.canKeep = false;
            next();
        }
    },
    methods:{
        
        goNoAriveDetail(id,companyId){
            this.$router.push({name:'manageSendRoute',query:{id:id,companyId:companyId}});
        },
        doSearch(){//查询按钮
            if(this.moreLoading){
                return;
            }
            this.loading = true;
            this.hasMore = true;
            this.pageNum = 1;
            this.noData = false;
            this.list = [];
            this.getData();
        },
        goBack(){
            this.$router.go(-1);
        },
        show(type) {
            this.curDate = type;
            this.$refs.picker.show();
        },
        handlePickerCancel(){

        },
        handlePickerConfirm(v) {
            this.Y = parseInt(v[0].value)>9?parseInt(v[0].value):'0'+parseInt(v[0].value);
            this.M = parseInt(v[1].value)>9?parseInt(v[1].value):'0'+parseInt(v[1].value);
            this.D = parseInt(v[2].value)>9?parseInt(v[2].value):'0'+parseInt(v[2].value);
            this.picker.anchor = v;
            this.$refs.picker.display=false;
            if(this.curDate == 'S'){
                this.start = this.Y + '-' +this.M + '-'+ this.D;    
            }else{
                this.end = this.Y + '-' +this.M + '-'+ this.D; 
            }
        },
        getNowFormatDate() {
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
        async getData(){
            let res ;
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
                pageSize:this.pageSize,
                pageNum:this.pageNum,
            };
            let uniqueParams = {
                startTime:this.start,
                endTime:this.end,
                orderId:this.orderNum,
                khInfo:this.customer
            }
           
            res = await reqManageSendingList({...defaulParams,...uniqueParams});
           
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
    }
}
</script>
<style lang="scss" scoped>
    .driverContainer{
        padding-top: 94px;
        .checkList{
            // padding-top: 110px;
        }
        .mask{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background:rgba(0,0,0,0.5);
            z-index: 1000;
            .modal{
                width:600px;
                height:350px;
                background-color: #fff;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -175px;
                margin-left: -300px;
                .top{
                    height: 270px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size:30px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(51,51,51,1);
                    line-height:42px;
                }
                .bottom{
                    height: 80px;
                    display: flex;
                    justify-content: space-between;
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(255,255,255,1);
                    line-height:80px;
                    .left{
                        background-color: #BEBEBE;
                        width: 50%;
                        text-align: center;
                    }
                    .right{
                        background-color: #D33F3F;
                        width: 50%;
                        text-align: center;
                    }
                }
            }
        }
        .noArive{
            
            &.hasReturn{
                .detailInfo{
                    border-bottom: none;
                }
                .left{
                    width: 280px!important;
                }
                // .cancelBox{
                //     border-bottom: 1px solid #EBEBEB;
                //     margin-bottom: 10px;
                // }
            }
            .detailBox{
                padding: 23px 38px 36px;
                margin-bottom: 6px;
                background-color: #fff;
            }
            .detailInfo{
                border: 1px solid #EBEBEB;
                margin-bottom: 10px;
                .mainTitle{
                    border-bottom: 1px solid #EBEBEB;
                    background-color: #fff;
                    .infos{
                        display: flex;
                        align-items: center;
                        padding: 10px 38px;
                        font-size:28px;
                        font-family:PingFangSC-Light;
                        font-weight:300;
                        color:rgba(102,102,102,1);
                        line-height:40px;
                        display: flex;
                        align-items: center;
                        font-weight:600;
                        .left{
                            width: 230px;
                            flex-shrink: 0;
                        }
                    }
                }
                .btnArea{
                    display: flex;
                    justify-content: flex-end;
                    padding: 36px 16px;
                    border-bottom: 1px solid #ebebeb;
                }
                .ariveBtn{
                    width:200px;
                    height:80px;
                    background:rgba(211,63,63,1);
                    border-radius:10px;
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(255,255,255,1);
                    line-height:80px;
                    text-align: center;
                }
                .detailInfos{
                    padding: 10px 38px;
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(102,102,102,1);
                    line-height:40px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #ebebeb;
                    &.title{
                        height: 85px;
                    }
                    .left{
                        width: 230px;
                        flex-shrink: 0;
                    }
                }
            }
            .mainInfo{
                height: 160px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-left: 38px;
                border-top: 1px solid #dfdfdf;
                border-bottom: 1px solid #dfdfdf;
                background-color: #fff;
                .infos{
                    display: flex;
                    align-items: center;
                    .left{
                        width: 230px;
                        font-size:28px;
                        font-family:PingFangSC-Semibold;
                        font-weight:600;
                        color:rgba(102,102,102,1);
                        line-height:40px;
                    }
                    .right{
                        font-size:28px;
                        font-family:PingFangSC-Semibold;
                        font-weight:600;
                        color:rgba(102,102,102,1);
                        line-height:40px;
                    }
                }
            }
        }
        .waitAcept{
            
            .waitBox{
                margin-bottom: 6px;
                background-color: #fff;
            }
            .btnArea{
                height: 152px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 38px;
                .aceptBtn,.detailBtn{
                    width:200px;
                    height:80px;
                    background:rgba(247,181,0,1);
                    border-radius:10px;
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(255,255,255,1);
                    line-height:80px;
                    text-align: center;
                    margin-left: 20px;
                }
                .detailBtn{
                    background-color: #D33F3F;
                }
            }
            .detailInfo{
                .detailInfos{
                    display: flex;
                    align-items: center;
                    height: 50px;
                    border-bottom: 1px solid #dfdfdf;
                    padding-left: 38px;
                    .left{
                        width: 230px;
                        font-size:28px;
                        font-family:PingFangSC-Light;
                        font-weight:300;
                        color:rgba(102,102,102,1);
                        line-height:40px;
                    }
                    .right{
                        font-size:28px;
                        font-family:PingFangSC-Light;
                        font-weight:300;
                        color:rgba(102,102,102,1);
                        line-height:40px;
                    }
                }
            }
            .mainInfo{
                height: 160px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-left: 38px;
                border-top: 1px solid #dfdfdf;
                border-bottom: 1px solid #dfdfdf;
                .infos{
                    display: flex;
                    align-items: center;
                    .left{
                        width: 230px;
                        font-size:28px;
                        font-family:PingFangSC-Semibold;
                        font-weight:600;
                        color:rgba(102,102,102,1);
                        line-height:40px;
                    }
                    .right{
                        font-size:28px;
                        font-family:PingFangSC-Semibold;
                        font-weight:600;
                        color:rgba(102,102,102,1);
                        line-height:40px;
                    }
                }
            }
        }
    }
    .nav{
        width: 100%;
        height: 88px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #007AFF;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        .leftIcon{
            width: 17px;
            height: 30px;
            position: absolute;
            top: 29px;
            left: 30px;
        }
        .title{
            font-size: 30px;
            color: #fff;
        }
    }
    .inputArea{
        background-color: #fff;
        padding: 21px 0 56px;
        margin-bottom: 6px;
        .btn{
            width:340px;
            height:80px;
            background:#007AFF;
            border-radius:40px;
            line-height: 80px;
            text-align: center;
            font-size:28px;
            font-family:PingFangSC-Light;
            font-weight:300;
            color:rgba(255,255,255,1);
            margin: 72px auto 0;
        }
        .inputItem{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            justify-content: center;
            .left{
                flex-shrink: 0;
                font-size:28px;
                font-family:PingFangSC-Light;
                font-weight:300;
                color:rgba(51,51,51,1);
                line-height:40px;
                margin-right: 20px;
            }
            .right{
                width:390px;
                height:60px;
                border:1px solid rgba(190,190,190,1);
                font-size:28px;
                font-family:PingFangSC-Light;
                font-weight:300;
                color:rgba(51,51,51,1);
                line-height:60px;
                padding-left: 10px;
                padding-right: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .selIcon{
                    width:20px;
                    height:25px;
                }
                .dateIcon{
                    width: 30px;
                    height: 30px;
                }
                input{
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    border: none;
                    outline: none;
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:#333;
                    line-height:40px;
                }
            }
        }
    }
</style>
