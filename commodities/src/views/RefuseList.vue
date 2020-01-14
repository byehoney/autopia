<template>
    <div class="refuseContainer">
        <TopNav></TopNav>
        <ul
            class="content"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
        >
            <li v-for="(item,index) in list" :key="index" class="listItem">
                <div class="left">
                    <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
                    <img src="../images/gift_icon.png" v-if="item.mzbj=='true'" class="giftIcon" alt="">
                    <img src="../images/group_icon.png" v-if="item.tgsl>0"  class="giftIcon" alt="">
                </div>
                <div class="right">
                    <div class="top">
                        <div class="bName">{{item.productname}}</div>
                        <div class="fName">{{item.cj}}</div>
                        <div class="size">规格：{{item.hlgg}}</div>
                        <div class="size">买赠活动类型：{{item.mzhdlx}}</div>
                        <div class="size">价格活动类型：{{item.jghdlx}}</div>
                        <!-- <div class="saled">已销：700件</div> -->
                    </div>
                    <div class="bottom">
                        <div class="nPrice">￥{{item.cgjg}}</div>
                        <div class="oPrice">{{item.yj}}</div>
                    </div>
                </div>
            </li>
        </ul>
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
            hasMore:true
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
            let res = await getOrderStatuList({...defaulParams,orderId:this.$route.query.id,orderStatus:'厂商拒开'})
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
            background-color: #fff;
            .listItem{
                display: flex;
                align-items: center;
                padding: 25px 41px 25px 47px;
                border-bottom: 2px solid #ebebeb;
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
                        .nPrice{
                            font-size:32px;
                            font-weight:bold;
                            color:#E32323;
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
                    }
                }
            }
        }
    }
</style>
