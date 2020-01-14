<template>
    <div class="refuseContainer" style="opacity:1">
        <TopNav></TopNav>
        <ul
            class="content"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
        >
            <li v-for="(item,index) in list" :key="index" class="listItem" @click="selGoods(index)">
                <img class="sel" v-if="item.isActive" src="../images/car_checkcircle.png" alt="">
                <img class="sel" v-else src="../images/car_circle.png" alt="">
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
                        <div class="btnGroup">
                            <div class="logBtn" @click="checkViewLogist($event,item.productid)">查看物流</div>
                            <div class="returnBtn" @click="returnGoods($event,item.productid)">退货</div>
                        </div>
                        <!-- <div class="oPrice">8.80</div> -->
                    </div>
                </div>
            </li>
        </ul>
        <div class="fixBottom">
            <!-- <div class="nextBtn left" >
                退货
            </div> -->
            <div class="nextBtn right" @click="confirmReciveGoods">
                收货
            </div>
            <div class="selBtn" @click="toggleAll">
                <img class="sel" v-if="allCheck" src="../images/car_checkcircle.png" alt="">
                <img class="sel" v-else src="../images/car_circle.png" alt="">
                <span>全选</span>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import {mapGetters} from 'vuex'
import { getOrderStatuList ,reciveGOods} from '@/api/index'
export default {
    data(){
        return{
            allCheck:false,
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
        async confirmReciveGoods(){
            let selList = this.list.filter(item=>item.isActive==true);
            let selIds = [];
            selList.forEach(item => {
                selIds.push(item.productid);
            });
            console.log(selIds)
            if(!selIds.length){
                Toast({
                    message: "请选择收货商品",
                    position: "middle",
                    duration: 2000
                });
                return;
            }
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            };
            let res = await reciveGOods({
                ...defaulParams,
                productId:selIds.join(','),
                orderId:this.$route.query.id
            })
            if(res.code==0){
                Toast({
                    message: "操作成功",
                    position: "middle",
                    duration: 2000
                });
                this.pageNum = 1;
                this.list = [];
                this.hasMore = true;
                this.allCheck = false;
                this.getData();
            }
        },
        returnGoods(e,id){
            e.stopPropagation();
            // if(!this.selIds.length){
            //     Toast({
            //         message: "请选择退货商品",
            //         position: "middle",
            //         duration: 2000
            //     });
            //     return;
            // }
            this.$router.push({name:'applyReturn',query:{id:id,orderId:this.$route.query.id}})
        },
        selGoods(index){
            // this.list.forEach((item,index)=>{
            //     this.$set(this.list[index], 'isActive', false);
            // })
            this.$set(this.list[index], 'isActive', !this.list[index].isActive);
            let selList = this.list.filter(item=>item.isActive==true);
            if(selList.length == this.list.length){
                this.allCheck = true;
            }else{
                this.allCheck = false;
            }
            // this.selIds = [];
            // selList.forEach(item => {
            //     this.selIds.push(item.productid);
            // });
            // console.log(this.selIds)
        },
        checkViewLogist(e,id){
            e.stopPropagation();
            this.$router.push({name:'viewLogist',query:{id:id}})
        },
        toggleAll(){
            this.allCheck = !this.allCheck;
            if(this.allCheck){
                this.list.forEach((item,index)=>{
                    this.$set(this.list[index], 'isActive', true);
                })
            }else{
                this.list.forEach((item,index)=>{
                    this.$set(this.list[index], 'isActive', false);
                })
            }
        },
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
            let res = await getOrderStatuList({...defaulParams,orderId:this.$route.query.id,orderStatus:'待收货'})
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
        // min-height: 100vh;
        background:rgba(235,235,235,1);
        padding-bottom: 100px;
        .nav{
            border-bottom: 2px solid #ebebeb;
        }
        .content{
            margin-top: 92px;
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
                            .name{
                                flex: 1;
                            }
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
                        align-items: center;
                        justify-content: space-between;
                        margin-top: 35px;
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
                        .btnGroup{
                            display: flex;
                            justify-content: flex-end;
                        }
                        .logBtn{
                            width:145px;
                            height:50px;
                            line-height: 50px;
                            text-align: center;
                            background:rgba(255,255,255,1);
                            border-radius:35px;
                            border:2px solid rgba(74,144,226,1);
                            font-size:22px;
                            color:rgba(74,144,226,1);
                            letter-spacing:2px;
                        }
                        .returnBtn{
                            width:110px;
                            height:50px;
                            background:rgba(255,255,255,1);
                            border-radius:35px;
                            border:2px solid rgba(245,164,26,1);
                            text-align: center;
                            line-height: 50px;
                            font-size:22px;
                            color:rgba(245,164,26,1);
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
        .fixBottom{
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
            background:rgba(235,235,235,1);
            display: flex;
            justify-content: space-between;
        }
        .nextBtn{
          width: 370px;
          height: 98px;
          line-height: 98px;
          text-align: center;
          &.left{
              background-color: #FFC004;
          }
          &.right{
              background-color: #E32323;
              border-radius:80px 0  0 80px;
          }
        }
        .selBtn{
            background-color: #fff;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 40px;
                height: 40px;
            }
            span{
                font-size:26px;
                color:rgba(102,102,102,1);
                line-height:35px;
                margin-left: 10px;
            }
        }
    }
</style>
