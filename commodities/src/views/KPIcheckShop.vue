<template>
    <div class="mangeContainer" style="opacity:1">
        <mt-header title="门店详情" class="manageHeader">
            <router-link to="" slot="left">
                <mt-button icon="back" @click.native="$router.back(-1)"></mt-button>
            </router-link>
        </mt-header>
        <div class="tabs">
            <div :class="['tab',actIndex==0?'active':'']" @click="changeType(0)">基本信息</div>
            <div :class="['tab',actIndex==1?'active':'']" @click="changeType(1)">品规查询</div>
        </div>
        <div class="content" v-show="actIndex==0">
            <div class="title">基本信息</div>
            <div class="allInfos">
                <div class="infos">门店名称：<span>{{companyName}}</span></div>
                <div class="infos">联系人：<span>{{userName}}</span></div>
                <div class="infos">联系电话：<span>{{mobile}}</span></div>
                <div class="infos">注册地址：<span>{{address}}</span></div>
            </div>
            <div class="title">销售数据</div>
            <div class="datas">
                <div class="dataInfo bleft">
                    <p class="name">今日订单数</p>
                    <p class="des top">{{jrdss}}</p>
                </div>
                <div class="dataInfo bleft">
                    <p class="name">今日订单额</p>
                    <p class="des top">{{jrdde}}元</p>
                </div>
                <div class="dataInfo">
                    <p class="name">今日品规数</p>
                    <p class="des top">{{jrpgs}}</p>
                </div>
                <div class="dataInfo noBorder bleft">
                    <p class="name">总订单数</p>
                    <p class="des bottom">{{zdds}}</p>
                </div>
                <div class="dataInfo noBorder bleft">
                    <p class="name">总订单额</p>
                    <p class="des bottom">{{zdde}}元</p>
                </div>
                <div class="dataInfo noBorder">
                    <p class="name">总品规数</p>
                    <p class="des bottom">{{zpss}}</p>
                </div>
            </div>
        </div>
        <div class="searchContainer" v-show="actIndex==1">
            <div class="searchContent">
                <div class="searchArea">
                    <div class="sName">商品信息：</div>
                    <input type="text" v-model="searchStr" placeholder="请输入商品编码，通用名称" class="input">
                </div>
                <div class="searchBtn" @click="doSearch">查询</div>
            </div>
            <div class="divide"></div>
            <div class="shoList"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
            >
                <div class="listItem" v-for="(item,index) in list" :key="index">
                    <p>通用名称：<span>{{item.tyname}}</span></p>
                    <p>厂&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;商：<span>{{item.cj}}</span></p>
                    <p>商品编码：<span>{{item.productid}}</span></p>
                    <p>规&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格：<span>{{item.guig}}</span></p>
                    <div class="sales">
                        <p>销售额&nbsp;&nbsp;&nbsp;&nbsp;：<span>￥{{item.xsje}}</span></p>
                        <p>销量：<span>{{item.xsl}}件</span></p>
                    </div>
                </div>
            </div>
        </div>
        <!-- <ManageTabBarBotttom></ManageTabBarBotttom> -->
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
// import ManageTabBarBotttom from '@/components/ManageTabBarBottom';
import { reqManageShopDetail } from '@/api/index'
export default {
    data(){
        return{
            companyName:'',
            userName:'',
            mobile:'',
            address:'',
            jrdss:0,
            jrdde:0,
            jrpgs:0,
            zdds:0,
            zdde:0,
            zpss:0,
            searchStr:'',
            actIndex:0,
            loading:false,
            list:[],
            moreLoading:false,
            pageSize:10,
            pageNum:1,
            noData:false,//是否有数据
            hasMore:true,
        }
    },
    computed: {
         ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components:{
    //    ManageTabBarBotttom,
    },
    mounted() {
        this.loading = true;
        this.getData();
    },
    destroyed() {
        this.loading = false;
    },
    methods: {
        doSearch(){
            this.pageNum = 1;
            this.list = [];
            this.getData();
        },
        changeType(index){
            this.actIndex = index;
            this.getData();
        },
        async getData(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
                pageSize:this.pageSize,
                pageNum:this.pageNum
            };      
            let res = await reqManageShopDetail({
                ...defaulParams,
                ywCompanyId:this.$route.query.id,
                ywUserId:this.$route.query.memberId,
                fullText:this.searchStr,
                type:this.actIndex
            })
            if(this.actIndex == 0){//基本信息
                this.companyName = res.data.companyname;
                this.userName = res.data.username;
                this.mobile = res.data.mobile;
                this.address = res.data.address;
                this.jrdss = res.data.jrdss;
                this.jrdde = res.data.jrdde;
                this.jrpgs = res.data.jrpgs;
                this.zdds = res.data.zdds;
                this.zdde = res.data.zdde;
                this.zpss = res.data.zpss;
            }else{//品规信息
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
            }
        },
        loadMore(){
            if(this.moreLoading||!this.hasMore){
                return;
            }
            if(this.actIndex==0){
                return;
            }
            this.pageNum = this.pageNum+1;
            this.getData();
        }
    },
}
</script>
<style lang="scss" scoped>
    .mangeContainer{
        background-color: #fff;
        .manageHeader{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
        }
        .shoList{
            .listItem{
                margin-left: 39px;
                border-bottom: 2px solid #ebebeb;
                padding-right: 39px;
                display: flex;
                flex-direction: column;
                padding-top: 24px;
                padding-bottom: 25px;
                p{
                    font-size:20px;
                    color:rgba(102,102,102,1);
                    line-height:26px;
                    margin-bottom: 10px;
                    span{
                        font-size:20px;
                        color:rgba(153,153,153,1);
                        line-height:26px;
                    }
                }
                .sales{
                    display: flex;
                    p{
                        width: 50%;
                    }
                }
            }
        }
        .searchContainer{
            .divide{
                width: 100%;
                height: 12px;
                background-color: #ebebeb;
            }
            .searchContent{
                padding-bottom: 25px;
                .searchBtn{
                    width:384px;
                    height:90px;
                    background:linear-gradient(180deg,rgba(250,217,97,1) 0%,rgba(247,107,28,1) 100%);
                    border-radius:50px;
                    margin: 24px auto 28px;
                    font-size:28px;
                    color:rgba(255,255,255,1);
                    line-height:90px;
                    letter-spacing:2px;
                    text-align: center;
                }
                .searchArea{
                    display: flex;
                    align-items: center;
                    margin-left: 39px;
                    border-bottom: 2px solid #ebebeb;
                    padding: 25px 0; 
                    .sName{
                        font-size:24px;
                        color:rgba(51,51,51,1);
                        line-height:31px;
                        letter-spacing:1px;
                        flex-shrink: 0;
                    }
                    .input{
                        font-size:24px;
                        color:rgba(51,51,51,1);
                        line-height:31px;
                        letter-spacing:1px;
                        border: none;
                        outline: none;
                    }
                }
            }
        }
        .content{
            margin-left: 39px;
            .title{
                padding: 24px 0;
                font-size:24px;
                color:rgba(51,51,51,1);
                line-height:31px;
                letter-spacing:1px;
                border-bottom: 2px solid #ebebeb;
            }
            .allInfos{
                padding: 14px 39px 19px 0;
                border-bottom: 2px solid #ebebeb;
                .infos{
                    font-size:20px;
                    color:rgba(102,102,102,1);
                    line-height:26px;
                    margin: 10px 0;
                    span{
                        color:rgba(153,153,153,1);
                    }
                }
            }
            .datas{
                display: flex;
                flex-wrap: wrap;
                .dataInfo{
                    width: 33%;
                    padding: 29px 0;
                    border-bottom:2px solid #ebebeb; 
                    &.noBorder{
                        border: none;
                    }
                    &.bleft{
                        border-right: 2px solid #ebebeb;
                    }
                    .name{
                        font-size:22px;
                        color:rgba(153,153,153,1);
                        line-height:29px;
                        text-align: center;
                        margin-bottom: 22px;
                    }
                    .des{
                        font-size:30px;
                        font-weight:bold;
                        line-height:40px;
                        letter-spacing:1px;
                        text-align: center;
                        &.top{
                            color:rgba(245,166,35,1);
                        }
                        &.bottom{
                            color: #007AFF;
                        }
                    }
                }
            }
        }
        .tabs{
            display: flex;
            width: 100%;
            height: 94px;
            line-height: 94px;
            text-align: center;
            margin-top: 12px;
            margin-top: 98px;
            .tab{
                font-size:24px;
                color:rgba(255,255,255,1);
                letter-spacing:2px;
                width: 50%;
                height: 100%;
                background-color: #A5C1DF;
                &.active{
                    background:linear-gradient(180deg,rgba(0,122,255,1) 0%,rgba(24,152,247,1) 100%);
                }
            }
        }
    }
</style>
