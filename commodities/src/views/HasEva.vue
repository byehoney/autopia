<template>
    <div class="hasEvaContainer" style="opacity:1">
        <TopNav></TopNav>
        <ul
            class="content"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
        >
            <li class="listItem" v-for="(item,index) in list" :key="index">
                <div class="top">
                    <img :src="item.url?item.url:require('../images/default_logo.jpg')" class="left" alt="">
                    <div class="mid">
                        <div class="name">{{item.productname}}</div>
                        <div class="evaLeval">
                            <span class="text">评分</span>
                            <img class="star" v-for="n in Math.ceil(parseInt(item.bzpj)+parseInt(item.psypj)+parseInt(item.shsdpj))/3" :key="n" src="../images/eva_star.png" alt="">
                        </div>
                    </div>
                    <div class="right">{{item.time.split(' ')[0]}}</div>
                </div>
                <div class="bottom">
                    {{item.comment}}
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import { getEvaList } from '@/api/index'
import {mapGetters} from 'vuex'
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
    components:{
        TopNav,
    },
    mounted() {
        this.getData();
    },
    methods:{
        async getData(){
            this.moreLoading = true;
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
                pageSize:this.pageSize,
                pageNum:this.pageNum,
                orderId :this.$route.query.id,
            }
            let res  = await getEvaList(defaulParams);
            this.moreLoading = false;
            if(res.code == 0){
                if(!res.data.list.length){
                    this.hasMore = false;
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
                }
                
                this.list = [...this.list,...res.data.list];
            }
        },
        loadMore(){
            if(this.moreLoading||!this.hasMore){
                return;
            }
            console.log(this.moreLoading,this.hasMore)
            this.pageNum = this.pageNum+1;
            this.getData();
        }
    },
}
</script>
<style lang="scss" scoped>
    .hasEvaContainer{
        width: 100vw;
        min-height: 100vh;
        background:rgba(235,235,235,1);
        .nav{
            border-bottom: 2px solid #ebebeb;
        }
        .content {
            padding-top: 92px;
            padding-bottom: 98px;
            .listItem{
                display: flex;
                flex-direction: column;
                padding: 25px 42px 55px 42px;
                background-color:#fff;
                border-bottom: 2px solid #ebebeb;
                .top{
                    display: flex;
                    align-items: flex-start;
                    .left{
                        width: 172px;
                        height: 122px;
                        object-fit: scale-down;
                    }
                    .mid{
                        display: flex;
                        flex-direction: column;
                        margin-left: 30px;
                        width: 300px;
                        .name{
                            font-size:26px;
                            color:rgba(51,51,51,1);
                            line-height:35px;
                            letter-spacing:2px;
                            margin-bottom: 24px;
                        }
                        .evaLeval{
                            display: flex;
                            align-items: center;
                            .text{
                                font-size:26px;
                                color:rgba(51,51,51,1);
                                line-height:35px;
                                letter-spacing:2px;
                                margin-right: 14px;
                            }
                            .star{
                                width: 34px;
                                height: 34px;
                                margin-right: 10px;
                            }
                        }
                    }
                    .right{
                        font-size:22px;
                        color:rgba(102,102,102,1);
                        line-height:29px;
                        letter-spacing:2px;
                    }
                } 
                .bottom{
                    font-size:26px;
                    color:rgba(51,51,51,1);
                    line-height:35px;
                    letter-spacing:2px;
                    margin-top: 38px;
                }
            }
        }
    }
</style>
