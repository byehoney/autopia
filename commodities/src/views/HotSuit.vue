<template>
    <div class="hotContainer">
        <TopNav></TopNav>
        <!-- <div class="top">
            <div class="left">
                <img src="../images/car_dianpu.png" alt="">
                <span>万家灯火烟花有限公司</span>
            </div>
            <div class="right">
                每日采集额：999
            </div>
        </div> -->
        <div class="scrollBox">
            <div class="scrollItem" v-for="(item,index) in list" :key="index" @click="goDetail(item.kbtcbm,item.tcyj,item.tchdj,item.kbtcms)">
                <div class="left">
                    <img :src="item.tctp" alt="">
                </div>
                <div class="right">
                    <div class="title">
                        <img src="../images/suit_icon.png" alt="">
                        <span>{{item.kbtcms}}</span>
                    </div>
                    <!-- <div class="size">规格：100g</div> -->
                    <div class="more">剩余：{{item.sytckszs}}</div>
                    <div class="price_btn">
                        <div class="price">
                            <span class="nPrice">￥{{item.tchdj}}</span>
                            <span class="oPrice">原价：￥{{item.tcyj}}</span>
                        </div>
                        <div class="btn" @click="addShopCar($event,index)">
                            加入购物车
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="left">
                <div class="badge" @click="goShopCar">
                    <!-- <img src="../images/choose_car.png" alt=""> -->
                    <span class="num" v-if="buyNum>0">{{buyNum}}</span>
                </div>   
                <!-- <span>￥0</span> -->
            </div>
            <!-- <div class="right">
                确定
            </div> -->
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapGetters,mapState } from 'vuex'
import { getSuitList ,addToCar,getCartNum} from '@/api/index'
import TopNav from '@/components/TopNav'
export default {
    data(){
        return{
            list:[],
            buyNum:0
        }
    },
    computed:{
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole']),
        ...mapState('login',['user'])
    },
    components:{
        TopNav,
    },
    mounted(){
        this.getData();
        this.getShopCarNum();
    },
    methods: {
        goShopCar(){
            this.$router.push({name:'newShopCar'})
        },
        async addShopCar(e,index){
            e.stopPropagation();
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            }; 
            let selArr = [];
            this.list[index].list.forEach((item)=>{
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
        },
        goDetail(id,tcyj,tchdj,kbtcms){
            this.$router.push({name:'suitDetail',query:{id:id,tcyj:tcyj,tchdj:tchdj,kbtcms:kbtcms}})
        },
        async getShopCarNum(){
            let defaulParams = {
                token: this.token,
                userId: this.userId,
                corpCode: this.corpCode,
                companyId: this.companyId,
                userRole: this.userRole,
            };
            let res = await getCartNum(defaulParams);
            if(res.code==0){
                this.buyNum = res.data.countitem;
            }
        },  
        async getData(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            };
            let res = await getSuitList(defaulParams);
            if(res.code==0){
                this.list = res.data.list;
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.hotContainer{
    width: 100vw;
    // min-height: 100vh;
    background:rgba(235,235,235,1);
    .nav{
        border-bottom: 2px solid #e5e5e5;
    }
    .bottom{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 98px;
        display: flex;
        background-color: #fff;
        justify-content: space-between;
        .left{
            display: flex;
            align-items: center;
            .badge{
                width: 62px;
                height: 62px;
                font-size: 26px;
                text-align: center;
                color: #666;
                // margin-top:15px;
                background: url("../images/choose_car.png") no-repeat top;
                background-size: 100% 100%;
                position: relative;
                margin-left: 49px;
                .num{
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #F5A41A;
                    position: absolute;
                    z-index: 100;
                    top: -10px;
                    right: -20px;
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                    color: #fff;
                    line-height: 40px;
                }
            }
            img{
                width: 62px;
                height: 62px;
                margin-left:39px; 
            }
            span{
                font-size:32px;
                font-weight:bold;
                color:#E32323;
                line-height:42px;
                margin-left: 16px;
            }
        }
        .right{
            width: 244px;
            height: 98px;
            background: url('../images/result.png') no-repeat 0 0;
            background-size: 100% 100%;
            font-size:32px;
            color:rgba(255,255,255,1);
            line-height:98px;
            letter-spacing:3px;
            text-align: center;
        }
    }
    .top{
        display: flex;
        padding: 18px 40px 19px 42px;
        margin-top: 88px;
        background-color: #fff;
        justify-content: space-between;
        border-bottom: 2px solid #ebebeb;
        .left{
            display: flex;
            align-items: center;
            img{
                width: 26px;
                height: 23px;
                margin-right: 8px;
            }
            span{
                font-size:26px;
                font-weight:bold;
                color:rgba(102,102,102,1);
                line-height:35px;
                letter-spacing:3px;
            }
        }
        .right{
            font-size:20px;
            color:rgba(102,102,102,1);
            line-height:26px;
            letter-spacing:1px;
        }
    }
    .scrollBox{
        padding-left: 38px;
        background-color: #fff;
        margin-top: 88px;
        .scrollItem{
            display: flex;
            align-items: center;
            padding: 24px 40px  34px 0; 
            border-bottom: 2px solid #ebebeb;
            .left{
                width: 220px;
                height: 176px;
                img{
                    width: 100%;
                    height: 100%;
                    object-fit: scale-down;
                }
            }
            .right{
                margin-left: 26px;
                flex: 1;
                .title{
                    display: flex;
                    align-items: center;
                    img{
                        width: 54px;
                        height: 30px;
                        margin-right: 12px;
                    }
                    span{
                        font-size:26px;
                        color:rgba(102,102,102,1);
                        line-height:35px;
                    }
                }
                .size{
                    font-size:20px;
                    color:rgba(153,153,153,1);
                    line-height:26px;
                    margin-top: 10px;
                }
                .more{
                    font-size:20px;
                    color:rgba(153,153,153,1);
                    line-height:26px;
                    margin-top: 10px;
                }
                .price_btn{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-top: 10px;
                    .price{
                        display: flex;
                        .nPrice{
                            font-size:26px;
                            color:#E32323;
                            line-height:35px;
                            margin-right: 30px;
                        }
                        .oPrice{
                            font-size:18px;
                            color:rgba(153,153,153,1);
                            line-height:24px;
                            text-decoration: line-through;
                            position: relative;
                            top: 11px;
                        }
                    }
                    .btn{
                        width: 125px;
                        height: 51px;
                        background-color: #E32323;
                        border-radius: 5px;
                        line-height: 51px;
                        text-align: center;
                        color: #fff;
                        font-size: 22px;
                        padding:0 5px;
                    }
                }
            }
        }
    }
}
</style>
