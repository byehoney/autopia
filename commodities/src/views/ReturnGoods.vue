<template>
    <div class="refuseContainer">
        <TopNav></TopNav>
        <ul
            class="content"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
        >
            <li v-for="(item,index) in list" :key="index" class="listItem" @click="selGoods(index)">
                <!-- <img class="sel" v-if="item.isActive" src="../images/car_checkcircle.png" alt="">
                <img class="sel" v-else src="../images/car_circle.png" alt=""> -->
                <div class="left">
                    <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
                    <img src="../images/gift_icon.png" v-if="item.mzbj=='true'" class="giftIcon" alt="">
                    <img src="../images/group_icon.png"  v-if="item.tgsl>0" class="giftIcon" alt="">
                </div>
                <div class="right">
                    <div class="top">
                        <div class="bName">
                            <span class="name">{{item.productname}}</span>
                            <span class="num">{{item.cgl}}件</span>
                        </div>
                        <div class="fName">{{item.cj}}</div>
                        <div class="size">规格：{{item.hlgg}}</div>
                        <div class="size">买赠活动类型：{{item.mzhdlx}}</div>
                        <div class="size">价格活动类型：{{item.jghdlx}}</div>
                        <!-- <div class="saled">已销：700件</div> -->
                    </div>
                    <div class="bottom">
                        <div class="nPrice">￥{{item.cgjg}}</div>
                        <!-- <div class="logBtn">提醒发货</div> -->
                        <!-- <div class="oPrice">8.80</div> -->
                    </div>
                </div>
            </li>
        </ul>
        <!-- <div class="nextBtn">
            到货
        </div> -->
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import {mapGetters} from 'vuex'
import { getOrderStatuList } from '@/api/index'
export default {
    data(){
        return{
            loading:false,
            list:[],
            moreLoading:false,
            pageSize:10,
            pageNum:1,
            noData:false,//是否有数据
            hasMore:true,
            selIds:[]
        }
    },
    computed:{
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    mounted(){
        this.getData();
    },
    methods:{
        async getData(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
                pageNum:this.pageNum,
                pageSize:this.pageSize
            };
            let res = await getOrderStatuList({...defaulParams,orderId:this.$route.query.id,orderStatus:'退货'})
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
                res.data.list.map((item,index)=>{
                    return item.isActive = false;
                })
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
        .content{
            padding-top: 92px;
            // padding-bottom: 120px;
            background-color: #fff;
            .listItem{
                display: flex;
                align-items: center;
                padding: 25px 41px 25px 47px;
                border-bottom: 2px solid #ebebeb;
                .sel{
                    width: 40px;
                    height: 40px;
                    align-self: flex-start;
                    margin-top: 33px;
                    margin-right: 14px;
                    display: none;
                }
                .left{
                    width: 200px;
                    height: 210px;
                    background:rgba(255,255,255,1);
                    position: relative;
                    .giftIcon{
                        position: absolute;
                        top: 0;
                        left: 20px;
                        width: 45px;
                        height: 45px;
                    }
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: scale-down;
                    }
                }
                .right{
                    width: 400px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    margin-left: 26px;
                    justify-content: space-between;
                    .top{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        .bName{
                            font-size:26px;
                            color:rgba(51,51,51,1);
                            line-height:35px;
                            letter-spacing:2px;
                            margin-bottom: 10px;
                            display: flex;
                            justify-content: space-between;
                        }
                        .fName{
                            font-size:18px;
                            color:rgba(102,102,102,1);
                            line-height:24px;
                            letter-spacing:1px;
                            margin-bottom: 7px;
                        }
                        .size{
                            font-size:18px;
                            color:rgba(102,102,102,1);
                            line-height:24px;
                            letter-spacing:1px;
                            margin-bottom: 10px;
                        }
                        .saled{
                            font-size:18px;
                            color:rgba(51,51,51,1);
                            line-height:24px;
                            letter-spacing:1px;
                            margin-bottom: 43px;
                        }
                    }
                    .bottom{
                        display: flex;
                        align-items: flex-end;
                        justify-content: space-between;
                        .nPrice{
                            font-size:32px;
                            font-weight:bold;
                            color:#666666;
                            line-height:42px;
                        }
                        .oPrice{
                            font-size:18px;
                            color:rgba(153,153,153,1);
                            line-height:35px;
                            letter-spacing:1px;
                            margin-left: 30px;
                            text-decoration: line-through;
                        }
                        .logBtn{
                            width:145px;
                            height:50px;
                            line-height: 50px;
                            text-align: center;
                            background:rgba(255,255,255,1);
                            border-radius:35px;
                            border:2px solid #F5A623;
                            font-size:22px;
                            color:#F5A623;
                            letter-spacing:2px;
                        }
                    }
                }
            }
        }
        .nextBtn{
            position: fixed;
            width: 100%;
            bottom: 0;
            left: 0;
            height: 98px;
            line-height: 98px;
            text-align: center;
            font-size:30px;
            color:rgba(255,255,255,1);
            letter-spacing:3px;
            background-color: #666;
        }
    }
</style>
