<template>
    <div class="suitContainer">
        <TopNav></TopNav>
        <div class="content">
            <mt-swipe :auto="0" class="suit_swiper">
                <mt-swipe-item v-for="(item,index) in list" :key="index">
                    <img class="banner" :src="item.dptplj" alt="">
                </mt-swipe-item>
            </mt-swipe>
            <div class="suitInfo">
                <div class="top">
                    <img src="../images/suit_icon.png" alt="">
                    <span>{{$route.query.kbtcms}}</span>
                </div>
                <div class="bottom">
                    <div class="price">
                        <span class="nPrice">￥{{$route.query.tchdj}}</span>
                        <span class="oPrice">￥{{$route.query.tcyj}}</span>
                    </div>
                    <div class="btn" @click="confirm">
                        加入购物车
                    </div>
                </div>
            </div>
            <div class="suitDetail">
                <div class="suit_title">套餐包含</div>
                <div class="details">
                    <div class="detail_item" v-for="(item,index) in list" :key="index">
                        <div class="left">
                            <img :src="item.dptplj" alt="">
                        </div> 
                        <div class="right">
                            <p class="name">{{item.productname}}</p>    
                            <p class="factory">
                                {{item.cj}}
                            </p>
                            <p class="num">数量：{{item.mzdpgmsl}}</p>
                            <p class="size">规格：{{item.guige}}</p>
                            <p class="leave">剩余：{{item.sytckszs}}</p>
                            <p class="price">
                                <span class="nPrice">￥{{item.dptcjg}}</span>
                                <span class="oPrice">原价：￥{{item.dpyj}}</span>
                            </p>
                        </div>   
                    </div> 
                </div>
            </div>
        </div>
        <!-- <div class="bottom">
            <div class="left">
                <img src="../images/choose_car.png" alt="">
                <span>￥0</span>
            </div>
            <div class="right">
                确定
            </div>
        </div> -->
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapGetters,mapState } from 'vuex'
import { getSuitDetail,addToCar } from '@/api/index'
import TopNav from '@/components/TopNav'
export default {
    data(){
        return{
           list:[]
        }
    },
    computed:{
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole']),
        ...mapState('login',['user']),
    },
    components:{
        TopNav,
    },
    async mounted(){
        let defaulParams = {
            token:this.token,
            userId:this.userId,
            corpCode:this.corpCode,
            companyId:this.companyId,
            userRole:this.userRole,
            suiteBuyCode:this.$route.query.id
        };
        let res = await getSuitDetail(defaulParams);
        if(res.code == 0){
            this.list = res.data.list
        }
    },
    methods:{
        async confirm(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            }; 
            let selArr = [];
            this.list.forEach((item,index)=>{
                selArr.push({
                    mzhdlx:'套餐',
                    pzlx:false,
                    ghsbm:'',
                    hdms:item.kbtcms,
                    hddz:item.tctp,
                    tcj:item.tchdj,
                    zzysj:item.tcyj,
                    gmsz:1,
                    hdbm:item.kbtcbm,
                    jghdlx:'无',
                    productId:item.productcode,
                    cartNum:item.mzdpgmsl,
                    pzdj:item.dptcjg,
                    pzyj:item.dpyj,
                    mobile:this.user.mobile
                })
            })
            let res = await addToCar({...defaulParams,jsonStr:JSON.stringify(selArr)});
            if(res.code == 0){
                Toast({
                    message: "加入购物车成功", //弹窗内容
                    position: "middle", //弹窗位置
                    duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
                });
            }
            console.log(selArr)
        }
    }
}
</script>
<style lang="scss" scoped>
.suitContainer{
    width: 100vw;
    // min-height: 100vh;
    background:rgba(235,235,235,1);
    .nav{
        border-bottom: 2px solid #ebebeb;
    }
    .content{
        margin-top: 92px;
        .suitDetail{
            background-color: #fff;
            margin-top: 7px;
            margin-bottom: 98px;
            .suit_title{
                padding: 32px 46px;
                font-size:24px;
                color:rgba(51,51,51,1);
                line-height:31px;
                letter-spacing:1px;
                display: flex;
                align-items: center;
                border-bottom: 2px solid #ebebeb;
                &::before{
                    content: "";
                    display: inline-block;
                    width:10px;
                    height:28px;
                    background:linear-gradient(85deg,rgba(255,98,56,1) 0%,rgba(255,18,64,1) 100%);
                    margin-right:10px; 
                }
            }
            .details{
                padding-left: 46px;
                .detail_item{
                    border-bottom: 2px solid #ebebeb;
                    display: flex;
                    align-items: center;
                    padding-bottom: 28px;
                    padding-top: 30px;
                    .left{
                        width: 200px;
                        height: 177px;
                        img{
                            width: 100%;
                            height: 100%;
                            object-fit: scale-down;
                        }
                    }
                    .right{
                        margin-left: 28px;
                        .name{
                            font-size:26px;
                            color:rgba(51,51,51,1);
                            line-height:35px;
                            letter-spacing:2px;
                        }
                        .size,.num,.leave,.factory{
                            font-size:18px;
                            color:rgba(153,153,153,1);
                            line-height:24px;
                            margin-top: 5px;
                        }
                        .price{
                            display: flex;
                            align-items: flex-end;
                            margin-top: 10px;
                            .nPrice{
                                font-size:26px;
                                color:#E32323;
                                line-height:35px;
                            }
                            .oPrice{
                                font-size:18px;
                                color:rgba(153,153,153,1);
                                line-height:10px;
                                text-decoration: line-through;
                                position: relative;
                                top: -8px;
                                margin-left: 30px;
                            }
                        }
                    }
                }
            }
        }
        .suitInfo{
            margin-top: 7px;
            background:rgba(255,255,255,1);
            padding: 29px 43px 25px 52px;
            .top{
                display: flex;
                align-items: center;
                margin-bottom: 25px;
                img{
                    width: 54px;
                    height: 30px;
                    margin-right: 8px;
                }
                span{
                    font-size:28px;
                    color:rgba(51,51,51,1);
                    line-height:37px;
                }
            }
            .bottom{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .price{
                    display: flex;
                    align-items: flex-end;
                    .nPrice{
                        font-size:30px;
                        color:#E32323;
                        line-height:40px;
                    }
                    .oPrice{
                        font-size:22px;
                        color:rgba(153,153,153,1);
                        line-height:34px;
                        letter-spacing:2px;
                        margin-left: 40px;
                        text-decoration: line-through;
                    }
                }
                .btn{
                    width: 125px;
                    height: 51px;
                    line-height: 51px;
                    background-color: #E32323;
                    color: #fff;
                    font-size: 20px;
                    text-align: center;
                    border-radius: 8px;
                }
            }
        }
        .suit_swiper{
            width: 100%;
            height: 570px;
            background-color: #fff;
            .banner{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
    // .bottom{
    //     position: fixed;
    //     bottom: 0;
    //     left: 0;
    //     width: 100%;
    //     height: 98px;
    //     display: flex;
    //     background-color: #fff;
    //     justify-content: space-between;
    //     .left{
    //         display: flex;
    //         align-items: center;
    //         img{
    //             width: 62px;
    //             height: 62px;
    //             margin-left:39px; 
    //         }
    //         span{
    //             font-size:32px;
    //             font-weight:bold;
    //             color:rgba(255,25,0,1);
    //             line-height:42px;
    //             margin-left: 16px;
    //         }
    //     }
    //     .right{
    //         width: 244px;
    //         height: 98px;
    //         background: url('../images/result.png') no-repeat 0 0;
    //         background-size: 100% 100%;
    //         font-size:32px;
    //         color:rgba(255,255,255,1);
    //         line-height:98px;
    //         letter-spacing:3px;
    //         text-align: center;
    //     }
    // }
}
</style>
