<template>
    <div :class="['mangeContainer',showDrawLeft?'pop':'']" style="opacity:1">
        <ManageTopNav @trigerLeft="trigerDrawerLeft"></ManageTopNav>
        <DrawerLeft ref="leftDrwaer"></DrawerLeft>
        <div class="main">
            <mt-swipe class="manage_swiper" :auto="0" :show-indicators="false">
                <mt-swipe-item class="item">
                    <div class="top">￥{{bData.jrxse}}</div>
                    <div class="center">今日销售额</div>
                    <div class="bottom">
                        <div class="left">采购店数：{{bData.cgmds}}</div>
                        <div class="right">销售数量：{{bData.jrxl}}</div>
                    </div>
                    <img class="arrow" src="../images/m_arrow_right.png" alt="" v-show="user.userRole=='04'||user.userRole=='05'">
                </mt-swipe-item>
                <mt-swipe-item class="item total" v-if="user.userRole=='04'||user.userRole=='05'">
                    <div class="top">￥{{bData.zsxe}}</div>
                    <div class="center">总销售额</div>
                    <div class="bottom">
                        <div class="left">总订单数：{{bData.zdds}}</div>
                        <div class="right">总客户数：{{bData.zkhs}}</div>
                    </div>
                    <img class="arrow arrow_left" src="../images/m_arrow_left.png" alt="">
                </mt-swipe-item>
            </mt-swipe>
        </div>
        <!-- 厂家管理员和业务员 -->
        <div class="infos" v-if="user.userRole=='02'||user.userRole=='03'||user.userRole=='08'">
            <router-link to="/manageorderstatus" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_04.png" alt="">
                    <div class="text">今日订单数/未处理</div>
                </div>
                <div class="right">{{bData.dds}}/{{bData.wclzs}}</div>
            </router-link>
            <div class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_05.png" alt="">
                    <div class="text">今日退款单</div>
                </div>
                <div class="right">{{bData.thds}}</div>
            </div>
            <router-link to="/managecamp" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_06.png" alt="">
                    <div class="text">在售商品/有库存</div>
                </div>
                <div class="right">{{bData.zypgs}}/{{bData.ykcpgs}}</div>
            </router-link>
            <router-link to="/manageNoStock" tag="div"  class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_07.png" alt="">
                    <div class="text">无库存商品数量</div>
                </div>
                <div class="right">{{bData.wkcpgs}}</div>
            </router-link>
            <router-link to="/manageAdduser" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_08.png" alt="">
                    <div class="text">今日新增客户</div>
                </div>
                <div class="right">{{bData.brxkes}}</div>
            </router-link>
            <router-link to="/manageshortstock" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_10.png" alt="">
                    <div class="text">缺货商品</div>
                </div>
                <div class="right">{{bData.brqhpz}}</div>
            </router-link>
            <router-link :to="{name:'manageuncelled',query:{gNum:bData.sstwdspzs,sNum:bData.sstwdxkhs}}" tag="div"  class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_11.png" alt="">
                    <div class="text">30天未动销（商品/门店）</div>
                </div>
                <div class="right">{{bData.sstwdspzs}}/{{bData.sstwdxkhs}}</div>
            </router-link>
            <router-link :to="{name:'manageBusCover',query:{cover:bData.yfgkhs,unCover:bData.wfgkhs}}" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_06.png" alt="">
                    <div class="text">业务（已覆盖/未覆盖）</div>
                </div>
                <div class="right">{{bData.yfgkhs}}/{{bData.wfgkhs}}</div>
            </router-link>
        </div>
        <!-- 商业管理员和业务员 -->
        <div class="infos" v-if="(user.userRole=='04'||user.userRole=='05')&&bData">
            <!-- <div class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_01.png" alt="">
                    <div class="text">app今日打开次数</div>
                </div>
                <div class="right">{{bData.jrdkcs}}</div>
            </div> -->
            <div class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_02.png" alt="">
                    <div class="text">未处理总额</div>
                </div>
                <div class="right">{{bData.wclze?bData.wclze:0}}</div>
            </div>
            <router-link to="/manageshop" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_03.png" alt="">
                    <div class="text">未处理采购门店数/今日未处理门店数</div>
                </div>
                <div class="right">{{bData.wclcgmds}}/{{bData.cgmds}}</div>
            </router-link>
            <router-link to="/manageorderstatus" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_04.png" alt="">
                    <div class="text">今日订单数/未处理（总数）</div>
                </div>
                <div class="right">{{bData.dds}}/{{bData.wclzs}}</div>
            </router-link>
            <div class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_05.png" alt="">
                    <div class="text">今日退款单</div>
                </div>
                <div class="right">{{bData.thds}}</div>
            </div>
            <router-link to="/managecamp" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_06.png" alt="">
                    <div class="text">在售商品/有库存</div>
                </div>
                <div class="right">{{bData.zypgs}}/{{bData.ykcpgs}}</div>
            </router-link>
            <router-link to="/manageNoStock" tag="div"  class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_07.png" alt="">
                    <div class="text">无库存商品数量</div>
                </div>
                <div class="right">{{bData.wkcpgs}}</div>
            </router-link>
            <router-link to="/manageAdduser" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_08.png" alt="">
                    <div class="text">今日新增客户</div>
                </div>
                <div class="right">{{bData.brxkes}}</div>
            </router-link>
            <router-link to="/managestock" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_09.png" alt="">
                    <div class="text">库存不足7日商品</div>
                </div>
                <div class="right">{{bData.ccxy7tel}}</div>
            </router-link>
            <router-link to="/manageshortstock" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_10.png" alt="">
                    <div class="text">缺货商品</div>
                </div>
                <div class="right">{{bData.brqhpz}}</div>
            </router-link>
            <router-link :to="{name:'manageuncelled',query:{gNum:bData.sstwdspzs,sNum:bData.sstwdxkhs}}" tag="div" class="infoItem">
                <div class="left">
                    <img class="icon" src="../images/manage/manage_11.png" alt="">
                    <div class="text">30天未动销（商品/门店）</div>
                </div>
                <div class="right">{{bData.sstwdspzs}}/{{bData.sstwdxkhs}}</div>
            </router-link>
            
        </div>
        <div class="hotsale scrollBox" v-if="(user.userRole=='04'||user.userRole=='05')&&bData&&bData.list.length">
            <div class="title">今日热销商品</div>
            <div class="hotList">
                <div class="hotItem" v-for="(item,index) in bData.list" :key="index">
                    <img :src="item.image?item.image:require('../images/default_logo.jpg')" alt="">
                    <div class="hotInfo">
                        <p class="sName">{{item.formalname}}</p>
                        <p class="fName">{{item.factoryname}}</p>
                        <p class="price">￥{{item.price}}</p>
                        <p class="money">金额：{{item.totalsaleamount}}</p>
                        <p class="buyShopNum">采购店数：{{item.shopcount}}</p>
                        <p class="sales">销量：{{item.totalsalecount}}</p>
                    </div>
                </div>
            </div>
        </div>
        <ManageTabBarBotttom curTab="manageHome"></ManageTabBarBotttom>
        <div class="mask" v-show="showDrawLeft" @click="handleMaskClick"></div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import ManageTabBarBotttom from '@/components/ManageTabBarBottom'
import DrawerLeft from '@/components/DrawerLeft'
import ManageTopNav from '@/components/ManageTopNav'
import {mapGetters,mapMutations,mapState} from 'vuex'
import { reqManageIndex } from '@/api/index'
export default {
    data(){
        return{
            bData:{
                brqhpz: 0,
                brxkes: 0,
                ccxy7tel: 0,
                cgmds: 0,
                dds: 0,
                jrdkcs: 0,
                jrxl: 0,
                jrxse: 0,
                list: [],
                sstwdspzs: 0,
                sstwdxkhs: 0,
                thds: 0,
                wclcgmds: 0,
                wclze: 0,
                wclzs: 0,
                wfgkhs: 0,
                wkcpgs: 0,
                yfgkhs: 0,
                ykcpgs: 0,
                zdds: 0,
                zkhs: 0,
                zsxe: 0,
                zypgs: 0,
            },
        }
    },
    computed: {
        ...mapState({
          user:state=>state.login.user,
          token:state=>state.login.token,
          showDrawLeft:state=>state.mange.showDrawLeft
        }),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components:{
        ManageTabBarBotttom,
        ManageTopNav,
        DrawerLeft
    },
    mounted() {
        this.getData();
    },
    methods: {
        ...mapMutations('mange',['changeDrawLeft']),
        trigerDrawerLeft(){
            this.changeDrawLeft(true);
        },
        handleMaskClick(){
            this.changeDrawLeft(false)
        },
        async getData(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            };
            let res = await reqManageIndex(defaulParams);
            if(res.code == 0){
                this.bData = res.data;
            }
        }
    },
}
</script>
<style lang="scss" scoped>
    .mask{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.6);
      z-index:99999;
    }
    .mangeContainer{
        background-color: #ebebeb;
        // min-height: 100vh;
        &.pop{
            height: 100vh;
            overflow: hidden;
        }
        .hotsale {
            padding-top: 36px;
            background-color: #fff;
            .title{
                width:188px;
                height:40px;
                font-size:30px;
                color:rgba(0,145,255,1);
                line-height:40px;
                letter-spacing:1px;
                margin: 0 auto 20px;
                padding-bottom: 12px;
                border-bottom: 6px solid #0091FF;

            }
            .hotList{
                padding-bottom: 1rem;
                .hotItem{
                    margin-left: 46px;
                    border-bottom: 2px solid #ebebeb;
                    padding: 36px 36px 34px 0;
                    display: flex;
                    align-items: center;
                    img{
                        width: 200px;
                        height: 210px;
                        object-fit: scale-down;
                        flex-shrink: 0;
                    }
                    .hotInfo{
                        flex-shrink: 0;
                        margin-left: 26px;
                        .sName{
                            font-size:26px;
                            color:rgba(51,51,51,1);
                            line-height:35px;
                            letter-spacing:2px;
                            margin-bottom: 8px;
                        }
                        .fName{
                            font-size:20px;
                            color:rgba(153,153,153,1);
                            line-height:26px;
                            letter-spacing:2px;
                            margin-bottom: 4px;
                        }
                        .price{
                            font-size:32px;
                            font-weight:bold;
                            color:rgba(255,25,0,1);
                            line-height:42px;
                            margin-bottom: 5px;
                        }
                        .money,.buyShopNum,.sales{
                            font-size:20px;
                            color:rgba(153,153,153,1);
                            line-height:26px;
                            letter-spacing:2px;
                            margin-bottom: 5px;
                        }
                    }
                }
            }
        }
        .main{
            padding: 121px 37px 31px;
            background-color: #fff;
        }
        .manage_swiper{
            width: 676px;
            height: 326px;
            .item{
                width: 676px;
                height: 326px;
                background:rgba(245,164,26,1);
                border-radius:20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                // position: relative;
                &.total{
                    background-color: #8589FF;
                }
                .top{
                    width: 582px;
                    font-size:56px;
                    font-weight:bold;
                    color:rgba(255,255,255,1);
                    line-height:74px;
                    letter-spacing:2px;
                    margin: 76px auto 0;
                    text-align: center;
                }
                .center{
                    width: 582px;
                    font-size:26px;
                    color:rgba(255,255,255,1);
                    line-height:35px;
                    letter-spacing:1px;
                    margin: 23px auto 0;
                    text-align: center;
                }
                .bottom{
                    display: flex;
                    justify-content: space-between;
                    margin: 37px auto 0;
                    width: 582px;
                    .left,.right{
                        font-size:26px;
                        color:rgba(255,255,255,1);
                        line-height:35px;
                        letter-spacing:1px;
                        text-align: center;
                    }
                    
                }
                .arrow{
                    width: 24px;
                    height: 46px;
                    position: absolute;
                    top: 142px;
                    right: 16px;
                    &.arrow_left{
                        left: 16px;
                    }
                }
            }
        }
        .infos{
            padding: 0 0 100px 38px;
            background-color: #fff;
            .infoItem{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 26px 37px  24px 0;
                border-bottom: 2px solid #ebebeb;
                &:last-child{
                    border-bottom: none;
                }
                .left{
                    display: flex;
                    align-items: center;
                    .icon{
                        width: 36px;
                        height: 36px;
                    }
                    .text{
                        font-size:24px;
                        color:rgba(51,51,51,1);
                        line-height:31px;
                        letter-spacing:1px;
                        margin-left: 14px;
                    }
                }
                .right{
                    font-size:22px;
                    color:rgba(102,102,102,1);
                    line-height:29px;
                }
            }
        }
    }
</style>
