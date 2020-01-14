<template>
    <div class="detailContainer" style="opacity:1">
        <TopNav></TopNav>
        <div class="main">
            <div class="header">
                <span>{{status==0?'全部到货':'部分到货'}}</span>
            </div>
            <div class="addInfo">
                <img class="left" src="../images/local_icon.png" alt="">
                <div class="mid">
                    <div class="top">{{name}} {{tel.substr(0,3)+'****'+tel.substr(7,11)}}</div>
                    <div class="bottom">{{addr}}</div>
                </div>
                <img class="right" src="../images/arrow_right.png" alt="">
            </div>
            <div class="shopInfo">
                <div class="infoBox" v-if="cjjk.length">
                    <div class="shopItem">
                        <template v-for="(item,index) in cjjk">
                            <div class="imgBox"  :key="index" v-if="index<3">
                                <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
                            </div>
                        </template>
                    </div>
                    <div class="shopRight" @click="goRefuse">
                        <div class="shopDes">
                            <div class="desState">{{cjjk[0].ordertype}}</div>
                            <div class="desNum">共{{cjjk.length}}件</div>
                        </div>
                        <img class="desIcon" src="../images/arrow_right.png" alt="">
                    </div>
                </div>
                <div class="infoBox" v-if="dfh.length">
                    <div class="shopItem">
                        <template v-for="(item,index) in dfh">
                            <div class="imgBox"  :key="index" v-if="index<3">
                                <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
                            </div>
                        </template>
                    </div>
                    <div class="shopRight" @click="goWaiteSend">
                        <div class="shopDes">
                            <div class="desState">{{dfh[0].ordertype}}</div>
                            <div class="desNum">共{{dfh.length}}件</div>
                        </div>
                        <img class="desIcon" src="../images/arrow_right.png" alt="">
                    </div>
                </div>
                <div class="infoBox" v-if="dsh.length">
                    <div class="shopItem">
                        <template v-for="(item,index) in dsh">
                            <div class="imgBox"  :key="index" v-if="index<3">
                                <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
                            </div>
                        </template>
                    </div>
                    <div class="shopRight" @click="goWaiteGet">
                        <div class="shopDes">
                            <div class="desState">{{dsh[0].ordertype}}</div>
                            <div class="desNum">共{{dsh.length}}件</div>
                        </div>
                        <img class="desIcon" src="../images/arrow_right.png" alt="">
                    </div>
                </div>
                <div class="infoBox" v-if="th.length">
                    <div class="shopItem">
                        <template v-for="(item,index) in th">
                            <div class="imgBox"  :key="index" v-if="index<3">
                                <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
                            </div>
                        </template>
                    </div>
                    <div class="shopRight" @click="goReturn">
                        <div class="shopDes">
                            <div class="desState">{{th[0].ordertype}}</div>
                            <div class="desNum">共{{th.length}}件</div>
                        </div>
                        <img class="desIcon" src="../images/arrow_right.png" alt="">
                    </div>
                </div>
                <div class="infoBox" v-if="ypj.length">
                    <div class="shopItem">
                        <template v-for="(item,index) in ypj">
                            <div class="imgBox"  :key="index" v-if="index<3">
                                <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
                            </div>
                        </template>
                    </div>
                    <div class="shopRight" @click="goEvaList">
                        <div class="shopDes">
                            <div class="desState">{{ypj[0].ordertype}}</div>
                            <div class="desNum">共{{ypj.length}}件</div>
                        </div>
                        <img class="desIcon" src="../images/arrow_right.png" alt="">
                    </div>
                </div>
                <div class="infoBox" v-if="ysh.length">
                    <div class="shopItem">
                        <template v-for="(item,index) in ysh">
                            <div class="imgBox"  :key="index" v-if="index<3">
                                <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
                            </div>
                        </template>
                    </div>
                    <div class="shopRight" @click="goEvaForOrder(ysh[0].url)">
                        <div class="shopDes">
                            <div class="desState">{{ysh[0].ordertype}}</div>
                            <div class="desNum">共{{ysh.length}}件</div>
                        </div>
                        <img class="desIcon" src="../images/arrow_right.png" alt="">
                    </div>
                </div>
            </div>
            <div class="orderInfo">
                <div class="orderItem">
                    订单编号：{{orderId}}
                </div>
                <div class="orderItem">
                    创建时间：{{time}}
                </div>
            </div>
            <div class="priceInfo">
                <div class="priceItem">
                    <div class="left">商品总额</div>
                    <div class="right">￥{{zjg}}</div>
                </div>
                <div class="priceItem">
                    <div class="left">立减优惠</div>
                    <div class="right red">￥{{ljyh}}</div>
                </div>
                <div class="priceItem">
                    <div class="left">实付金额</div>
                    <div class="right red">￥{{sfje}}</div>
                </div>
            </div>
            <div class="nextBtn">
                <img src="../images/kefu_icon.png"  alt="">
                <span>联系客服</span>
            </div>
        </div>
    </div>
</template>
<script>
import TopNav from "@/components/TopNav";
import { getOrderDetail } from '@/api/index';
import {mapGetters} from 'vuex'
export default {
    data(){
        return{
            status:0,
            name:'',
            tel:'',
            addr:'',
            cjjk:[],//厂家拒开
            dfh:[],//待发货
            dsh:[],//待收货
            th:[],//退货
            ypj:[],//已评价
            ysh:[],//已收货
            orderId:'',
            time:'',
            zjg:'',
            sfje:'',
            ljyh:''
        }
    },
    computed:{
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components: {
        TopNav,
    },
    async mounted() {

        let defaulParams = {
            token:this.token,
            userId:this.userId,
            corpCode:this.corpCode,
            companyId:this.companyId,
            userRole:this.userRole,
        };
        let res = await getOrderDetail({...defaulParams,orderId:this.$route.query.id});
        if(res.code == 0){
            this.name = res.data.sjr;
            this.tel = res.data.mobile;
            this.addr = res.data.address;
            this.orderId = res.data.orderid;
            this.time = res.data.createtime;
            this.cjjk = res.data.cjjk;
            this.dfh = res.data.dfh;
            this.dsh = res.data.dsh;
            this.th = res.data.th;
            this.ypj = res.data.ypj;
            this.ysh = res.data.ysh;
            this.status = res.data.status;
            this.zjg = res.data.zjg;
            this.sfje = res.data.sfje;
            this.ljyh = res.data.ljyh;
        }
    },
    methods: {
        goRefuse(){
            this.$router.push({name:'refuseList',query:{id:this.orderId}})
        },
        goWaiteSend(){
            this.$router.push({name:'waiteSend',query:{id:this.orderId}})
        },
        goWaiteGet(){
            this.$router.push({name:'waiteGet',query:{id:this.orderId}})
        },
        goReturn(){
            this.$router.push({name:'returnGoods',query:{id:this.orderId}})
        },
        goEvaList(){
            this.$router.push({name:'hasEva',query:{id:this.orderId}})
        },
        goEvaForOrder(url){
            this.$router.push({name:'evaForOrder',query:{id:this.orderId,url:url}})
        }
    },
}
</script>
<style lang="scss" scoped>
    .detailContainer{
        width: 100vw;
        min-height: 100vh;
        background: rgba(235, 235, 235, 1);
        .nav{
            border-bottom: 2px solid #ebebeb;
        }
        .header{
            width: 100%;
            height: 168px;
            background:linear-gradient(85deg,rgba(255,98,56,1) 0%,rgba(255,18,64,1) 100%);
            margin-top: 92px;
            span{
                font-size:30px;
                color:rgba(255,255,255,1);
                line-height:40px;
                letter-spacing:3px;
                margin-left: 92px;
            }
        }
        .addInfo{
            display: flex;
            align-items: center;
            width: 100%;
            height: 176px;
            background-color: #fff;
            justify-content: space-around;
            margin-bottom: 8px;
            .left{
                width: 44px;
                height: 44px;
                margin-left: 45px;
            }
            .mid{
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-left: 27px;
                width: 541px;
                .top{
                    font-size:26px;
                    color:rgba(102,102,102,1);
                    line-height:35px;
                    letter-spacing:3px;
                }
                .bottom{
                    font-size:24px;
                    color:rgba(102,102,102,1);
                    line-height:31px;
                    letter-spacing:3px;
                }
            }
            .right{
                width: 17px;
                height: 30px;
                margin-right: 46px;
            }
        }
        .shopInfo{
            // display: flex;
            // justify-content: space-between;
            background-color: #fff;
            padding: 0 46px 0 0;
            .infoBox{
                display: flex;
                justify-content: space-between;
                flex: 1;
                margin-left: 38px;
                padding-top: 16px;
                padding-bottom: 17px;
                border-bottom: 2px solid #ebebeb;
            }
            .shopItem{
                width: 530px;
                display: flex;
                .imgBox{
                    width: 150px;
                    height: 120px;
                    background:rgba(235,235,235,1);
                    margin-right: 24px;
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: scale-down;
                    }
                }
            }
            .shopRight{
                display: flex;
                align-items: center;
                .shopDes{
                    display: flex;
                    flex-direction: column;
                    margin-right: 10px;
                    width: 130px;
                    text-align: center;
                    .desState{
                        font-size:24px;
                        color:#E32323;
                        line-height:31px;
                        letter-spacing:1px;
                    }
                    .desNum{
                        font-size:20px;
                        color:rgba(155,155,155,1);
                        line-height:26px;
                    }
                }
                img{
                    width: 17px;
                    height: 30px;
                }
            }
        }
        .orderInfo{
            margin: 8px 0;
            background-color: #fff;
            width: 100%;
            height: 126px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .orderItem{
                font-size:24px;
                color:rgba(102,102,102,1);
                line-height:31px;
                letter-spacing:1px;
                margin-left:38px; 
            }
        }
        .priceInfo{
            background-color: #fff;
            width: 100%;
            margin-bottom: 100px;
            .priceItem{
                width: 660px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 49px 51px 31px 0;
                margin-left: 38px;
                border-bottom: 2px solid #ebebeb;
                .left{
                    font-size:24px;
                    color:rgba(102,102,102,1);
                    line-height:31px;
                    letter-spacing:1px;
                }
                .right{
                    font-size:24px;
                    color:rgba(102,102,102,1);
                    line-height:31px;
                    letter-spacing:1px;
                    &.red{
                        color:#E32323;
                    }
                }
            }
        }
        .nextBtn{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 98px;
            line-height: 98px;
            text-align: center;
            font-size:36px;
            color:rgba(255,255,255,1);
            letter-spacing:3px;
            background-color: #fff;
            margin: 0 auto;
            img{
                width: 32px;
                height: 35px;
                margin-right: 16px;
            }
            span{
                font-size:26px;
                color:#E32323;
                line-height:35px;
                letter-spacing:2px;
                position: relative;
                bottom: 5px;
            }
        }
    }
</style>
