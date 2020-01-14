<template>
    <div class="refuseContainer" style="opacity:1">
        <TopNav></TopNav>
        <div class="orderTabs">
            <div :class="['tabItem',actIndex==index?'active':'']" v-for="(item,index) in tabList" :key="index" @click="selType(index)">
                {{item}}
            </div>
        </div>
        <ul
            class="content"
            style="max-height: 100vh; overflow-y: auto;"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
        >
            <li v-for="(item,index) in list" :key="index" class="listItem">
                <div class="listInner">
                    <div class="top">
                        <div class="topInfo">
                            <div class="orderNum">{{item.orderid}}</div>
                            <div class="orderState">{{item.orderstatus}}</div>
                        </div>
                        <div class="topImgs" @click="checkDetailInfo(item.orderid)">
                            <template v-for="(mtem,jIndex) in item.urls" >
                                <img :src="mtem" :key="jIndex" alt="" v-if="jIndex<4">
                            </template>
                        </div>
                        <div class="topDetail">
                            <div class="total">共{{item.bdpgs}}件商品</div>
                            <div class="name">金额：</div>
                            <div class="num">￥{{item.bdje}}</div>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="scanBtn" @click="scanOper" v-if="actIndex!=3&&actIndex!=4">
                            <img src="../images/saoma.png" alt="">
                            <span>付款码</span>
                        </div>
                        <!-- <router-link v-if="item.status=='是'&&actIndex!=4" class="askBack" :to="{name:'applyReturn',query:{id:item.orderid}}">申请退货</router-link> -->
                        <router-link class="goEva" v-if="actIndex==3" :to="{name:'evaForOrder',query:{id:item.orderid,url:item.url}}">评价</router-link>
                        <router-link class="goDetail" :to="{name:'orderDetail',query:{id:item.orderid}}">查看详情</router-link>
                    </div>
                </div>
                <!-- <div class="listInner" v-if="actIndex==0">
                    <div class="top">
                        <div class="topInfo">
                            <div class="orderNum">{{item.orderid}}</div>
                            <div class="orderState">{{item.orderstatus}}</div>
                        </div>
                        <div class="topImgs">
                            <img :src="item.url" alt="">
                        </div>
                        <div class="topDetail">
                            <div class="total">共{{item.bdpgs}}件商品</div>
                            <div class="name">金额：</div>
                            <div class="num">￥{{item.bdje}}</div>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="scanBtn" @click="scanOper">
                            <img src="../images/saoma.png" alt="">
                            <span>付款码</span>
                        </div>
                        <router-link class="goDetail" :to="{name:'orderDetail',query:{id:item.orderid}}">查看详情</router-link>
                    </div>
                </div>
                <div class="list_inner_other" v-if="actIndex==1||actIndex==2">
                    <div class="top">
                        <div class="topInner">
                            <div class="head">
                                <div class="left">
                                    <img src="../images/dianpu.png" alt="">
                                    <p class="fName">万家灯火烟花有限公司</p>
                                </div>
                                <div class="right" v-if="actIndex==1">
                                    {{item.orderstatus}}
                                </div>
                                <div class="wRight" v-if="actIndex==2">
                                    {{item.orderstatus}}
                                </div>
                            </div>
                            <div class="head_mid">
                                <div class="mid_left">
                                    <img :src="item.url" alt="">
                                </div>
                                <div class="mid_right">
                                    <p class="name_price">
                                        <span class="name">烟花商品名称</span>
                                        <span class="price">￥6.50</span>
                                    </p>
                                    <p class="mid_fName">河北保定星星烟花制造厂</p>
                                    <p class="size">规格：35g*1支</p>
                                    <p class="num">X1</p>
                                </div>
                            </div>
                            <div class="head_bottom">
                                <p class="total">共1件商品</p>
                                <p class="money">实付款：￥6.50</p>
                            </div>
                        </div>
                    </div>
                    <div class="bottom" v-if="actIndex==1">
                        <div class="btn warn">提醒发货</div>
                        <div class="btn">修改地址</div>
                        <div class="btn">申请退款</div>
                    </div>
                    <div class="bottom" v-if="actIndex==2">
                        <div class="btn">整单退</div>
                        <div class="btn">查看物流</div>
                        <div class="btn sure">确认收货</div>
                    </div>
                </div>
                <div class="listInner" v-if="actIndex==3">
                    <div class="top">
                        <div class="topInfo">
                            <div class="orderNum">订单号：990789789889</div>
                            <div class="orderState">待评价</div>
                        </div>
                        <div class="topImgs">
                            <img src="../images/shopcar.png" alt="">
                            <img src="../images/shopcar.png" alt="">
                            <img src="../images/shopcar.png" alt="">
                            <img src="../images/shopcar.png" alt="">
                        </div>
                        <div class="topDetail">
                            <div class="total">共120件商品</div>
                            <div class="name">金额：</div>
                            <div class="num">￥68.95</div>
                        </div>
                    </div>
                    <div class="bottom">
                        <router-link class="goEva" :to="{name:'evaForOrder',query:{id:item.orderid,url:item.url}}">评价</router-link>
                        <router-link class="hasEva" :to="{name:'hasEva',query:{id:item.orderid,url:item.url}}">已评价</router-link>
                    </div>
                </div>
                <div class="listInner back" v-if="actIndex==4">
                    <div class="backTop">
                        <div class="backLeft">
                            <img src="../images/shopcar.png" alt="">
                        </div>
                        <div class="backRight">
                            <div class="backName">烟花商品名称烟花商品名称烟花商品名称</div>
                            <div class="backNum">数量：1</div>
                            <div class="backStatus">
                                <img src="../images/shopcar.png" class="backIcon" alt="">
                                <span class="backText">退货退款 退款成功</span>
                            </div>
                        </div>
                    </div>
                    <div class="backBottom">
                        <div class="backBtn">查看详情</div>
                    </div>
                </div> -->
            </li>
        </ul>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import {getOrdersList} from '@/api/index'
import {mapGetters} from 'vuex'
export default {
    data(){
        return{
            actIndex:0,
            tabList:['全部','待发货','待收货','待评价','退货'],
            loading:false,
            list:[],
            scrollTop:0,
            moreLoading:false,
            pageSize:10,
            pageNum:1,
            noData:false,//是否有数据
            hasMore:true
        }
    },
    computed:{
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    activated(){
        this.loading = false;
        if (!this.$route.meta.canKeep) {
            let setTab = this.$router.history.current.query.showTab;
            this.actIndex = setTab;
            this.pageNum = 1;
            this.list = [];
            this.hasMore = false;
            this.getData();
        }
    },
    deactivated(){
        this.loading = true;
    },
    beforeRouteLeave(to, from, next){
        let position = document.getElementsByClassName('content')[0].scrollTop
        sessionStorage.setItem('oTop',position);
        next()
    },
    beforeRouteEnter (to, from, next) {
        if(from.name == 'orderDetail'||from.name == 'evaForOrder'){
            to.meta.canKeep = true;
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.$nextTick(function(){
                    let position = sessionStorage.getItem('oTop') //返回页面取出来
                    document.getElementsByClassName('content')[0].scrollTo({ 
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
        selType(index){
            this.actIndex = index;
            this.pageNum = 1;
            this.list = [];
            this.loading = false;
            this.hasMore = true;
            this.getData();
        },
        scanOper(){
            Toast({
                message: "在线付款尚未开通",
                position: "middle",
                duration: 2000
            });
        },
        loadMore(){
            if(this.moreLoading||!this.hasMore){
                return;
            }
            console.log(this.moreLoading,this.hasMore)
            this.pageNum = this.pageNum+1;
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
            let res = await getOrdersList({...defaulParams,type:this.actIndex});
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
        checkDetailInfo(id){
            this.$router.push({name:'orderDetail',query:{id:id}})
        }
    },
    components:{
        TopNav,
    },
}
</script>
<style lang="scss" scoped>
    .refuseContainer{
        width: 100vw;
        min-height: 100vh;
        background:rgba(235,235,235,1);
        .nav{
            border-bottom: 2px solid #ebebeb;
        }
        .orderTabs{
            width: 100%;
            height: 84px;
            border-bottom: 2px solid #ebebeb;
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: fixed;
            top: 88px;
            left: 0;
            z-index: 100;
            background-color: #fff;
            .tabItem{
                height: 84px;
                line-height: 84px;
                font-size:28px;
                color:rgba(51,51,51,1);
                letter-spacing:2px;
                &.active{
                    font-size:28px;
                    color: #E32323;
                    letter-spacing:2px;
                }
            }
        }
        .content{
            padding-top: 176px;
            .listItem{
                margin-bottom: 10px;
                background-color: #fff;
                .listInner{
                    &.back{
                        display: flex;
                        flex-direction: column;
                        .backTop{
                            margin-left: 49px;
                            border-bottom: 2px solid #ebebeb;
                            display: flex;
                            padding: 22px 43px 22px 0;
                            .backLeft{
                                width:200px;
                                height:173px;
                                img{
                                    width: 100%;
                                    height: 100%;
                                    object-fit: scale-down;
                                }
                            }
                            .backRight{
                                margin-left: 70px;
                                .backName{
                                    font-size:26px;
                                    color:rgba(51,51,51,1);
                                    line-height:35px;
                                    letter-spacing:2px;
                                    margin-bottom: 16px;
                                }
                                .backNum{
                                    font-size:18px;
                                    color:rgba(102,102,102,1);
                                    line-height:24px;
                                    letter-spacing:1px;
                                    margin-bottom: 35px;
                                }
                                .backStatus{
                                    display: flex;
                                    align-items: center;
                                    .backIcon{
                                        width:34px;
                                        height:34px;
                                    }
                                    .backText{
                                        font-size:22px;
                                        color:rgba(51,51,51,1);
                                        line-height:29px;
                                        letter-spacing:2px;
                                        margin-left: 13px;
                                    }
                                }
                            }
                        }
                        .backBottom{
                            padding: 18px 51px 20px 0;
                            display: flex;
                            justify-content: flex-end;
                            .backBtn{
                                width:145px;
                                height:50px;
                                background:rgba(255,255,255,1);
                                border-radius:4px;
                                border:2px solid rgba(245,166,35,1);
                                font-size:22px;
                                color:rgba(245,166,35,1);
                                line-height:50px;
                                letter-spacing:2px;
                                text-align: center;
                            }
                        }
                    }
                }
                .list_inner_other{
                    display: flex;
                    flex-direction: column;
                    // padding: 28px 43px 31px 47px;
                    .top{
                        display: flex;
                        flex-direction: column;
                        padding-top: 28px;
                        border-bottom: 2px solid #e5e5e5;
                        .topInner{
                            padding-left: 47px;
                            padding-right: 43px;
                        }
                        .head{
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 29px;
                            .left{
                                display: flex;
                                align-items: center;
                                img{
                                    width: 26px;
                                    height: 23px;
                                }
                                .fName{
                                    font-size:28px;
                                    color:rgba(102,102,102,1);
                                    line-height:37px;
                                    letter-spacing:3px;
                                    margin-left: 10px;
                                }
                            }
                            .right{
                                font-size:28px;
                                color:rgba(245,166,35,1);
                                line-height:37px;
                                letter-spacing:1px;
                            }
                            .wRight{
                                font-size:28px;
                                color:rgba(0,122,255,1);
                                line-height:37px;
                                letter-spacing:1px;
                            }
                        }
                        .head_mid{
                            display: flex;
                            align-items: center;
                            height:247px;
                            background:rgba(245,244,244,1);
                            .mid_left{
                                width: 200px;
                                height: 210px;
                                margin-left: 30px;
                                img{
                                    width: 100%;
                                    height: 100%;
                                    object-fit: scale-down;
                                    flex: 1;
                                }
                            }
                            .mid_right{
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                margin-left: 19px;
                                flex: 1;
                                .name_price{
                                    display: flex;
                                    justify-content: space-between;
                                    .name{
                                        font-size:28px;
                                        color:rgba(51,51,51,1);
                                        line-height:37px;
                                        letter-spacing:2px;
                                    }
                                    .price{
                                        font-size:28px;
                                        color:rgba(102,102,102,1);
                                        line-height:37px;
                                        margin-right: 35px;
                                    }
                                }
                                .mid_fName{
                                    font-size:20px;
                                    color:rgba(153,153,153,1);
                                    line-height:26px;
                                    letter-spacing:2px;
                                    margin-top: 8px;
                                }
                                .size{
                                    font-size:20px;
                                    color:rgba(153,153,153,1);
                                    line-height:26px;
                                    letter-spacing:2px;
                                    margin-top: 5px;
                                }
                                .num{
                                    font-size:24px;
                                    color:rgba(102,102,102,1);
                                    line-height:31px;
                                    margin-top: 30px;
                                }
                            }
                        }
                        .head_bottom{
                            display: flex;
                            justify-content: flex-end;
                            font-size:28px;
                            color:rgba(102,102,102,1);
                            line-height:37px;
                            letter-spacing:3px;
                            padding: 24px 35px 29px 0; 
                        }
                    }
                    .bottom{
                        padding: 33px 43px 31px 47px;
                        display: flex;
                        justify-content: flex-end;
                        .btn{
                            width: 164px;
                            height: 64px;
                            line-height: 64px;
                            border: 2px solid #999;
                            border-radius: 8px;
                            text-align: center;
                            font-size:26px;
                            color:rgba(153,153,153,1);
                            letter-spacing:1px;
                            margin-left: 32px;
                            &.warn{
                                border: 2px solid #F5A623;
                                color: #F5A623;
                            }
                            &.sure{
                                border: 2px solid #007AFF;
                                color: #007AFF;
                            }
                        }
                    }
                }
                .listInner{
                    display: flex;
                    flex-direction: column;
                    .top{
                        display: flex;
                        flex-direction: column;
                        padding: 29px 43px 20px 46px;
                        border-bottom: 2px solid #ebebeb;
                        .topInfo{
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 43px;
                            .orderNum{
                                font-size:24px;
                                color:rgba(102,102,102,1);
                                line-height:31px;
                                letter-spacing:3px;
                            }
                            .orderState{
                                font-size:24px;
                                color:rgba(245,166,35,1);
                                line-height:31px;
                                letter-spacing:1px;
                            }
                        }
                        .topImgs{
                            display: flex;
                            flex-wrap: wrap;
                            // justify-content: space-between;
                            margin-bottom: 20px;
                            img{
                                width: 150px;
                                height: 120px;
                                object-fit: scale-down;
                                margin-right: 20px;
                                &:last-child{
                                    margin-right: 0;
                                }
                            }
                        }
                        .topDetail{
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            .total,.name{
                                font-size:24px;
                                color:rgba(102,102,102,1);
                                line-height:31px;
                                letter-spacing:3px;
                                margin-left: 10px;
                            }
                            .num{
                                font-size:24px;
                                color: #E32323;
                                line-height:31px;
                                letter-spacing:3px;
                            }
                        }
                    }
                    .bottom{
                        display: flex;
                        justify-content: flex-end;
                        padding: 29px 43px 34px 46px;
                        .scanBtn{
                            width: 176px;
                            height: 68px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background:  #E32323;
                            margin-right: 20px;
                            border-radius: 5px;
                            img{
                                width: 33px;
                                height: 31px;
                                margin-right: 10px;
                            }
                            span{
                                font-size:24px;
                                color:rgba(255,255,255,1);
                                line-height:31px;
                                letter-spacing:3px;
                            }
                        }
                        .goDetail{
                            display: block;
                            width: 176px;
                            height: 68px;
                            line-height: 68px;
                            font-size:24px;
                            color:rgba(255,255,255,1);
                            letter-spacing:3px;
                            background-color: #FFC004;
                            text-align: center;
                            border-radius: 5px;
                        }
                        .askBack{
                            width: 164px;
                            height: 64px;
                            line-height: 64px;
                            border: 2px solid #999;
                            border-radius: 8px;
                            text-align: center;
                            font-size:26px;
                            color:rgba(153,153,153,1);
                            letter-spacing:1px;
                            margin-right: 20px;
                        }
                        .goEva{
                            width: 164px;
                            height: 64px;
                            line-height: 64px;
                            border:2px solid  #FF0304;
                            border-radius: 8px;
                            text-align: center;
                            font-size:26px;
                            color: #E32323;
                            letter-spacing:1px;
                            display: block;
                            text-align: center;
                            margin-right: 20px;
                        }
                        .hasEva{
                            width: 128px;
                            height: 64px;
                            border:2px solid #797979;
                            border-radius: 50px;
                            line-height: 64px;
                            font-size:24px;
                            color:rgba(102,102,102,1);
                            letter-spacing:1px;
                            display: block;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
</style>
