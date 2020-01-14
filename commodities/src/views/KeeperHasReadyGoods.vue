<template>
    <div class="driverContainer">
        <TopNav/>
        <div class="infos">
            <div class="infoArea" v-if="list.length">
                <div class="infoItem title">
                    <div class="left">调度单号：</div>
                    <div class="right">{{list[0].dddh}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">客户名称：</div>
                    <div class="right">{{list[0].khmc}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">联系电话：</div>
                    <div class="right">{{list[0].khdh}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">库位名称：</div>
                    <div class="right">{{list[0].ckmc}}</div>
                </div>
            </div>
            <div class="goodsArea">
                <div class="goodsItem" v-for="(item,index) in list" :key="index">
                    <div class="top">商品名称：{{item.spmc}}</div>
                    <div class="bottom">
                        <div class="left">
                            <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
                        </div>
                        <div class="right">
                            <p>商品编码：{{item.productcode}}</p>
                            <p>规格：{{item.guig}}</p>
                            <p>单位：{{item.dw}}</p>
                            <p>厂家：{{item.cj}}</p>
                            <p>数量：{{item.sl}}</p>
                            <p>辅量：{{item.fl}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '../components/DriverTopNav';
import { getKeeperHasReadyDetailData } from '@/api/index';
import { mapState ,mapActions,mapGetters, mapMutations} from 'vuex';
export default {
    data(){
        return{
            list:[],
        }
    },
    components:{
        TopNav
    },
    computed:{
        // ...mapState('login',['user','token']),
        ...mapState({
          user:state=>state.login.user,
          token:state=>state.login.token,
        }),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    mounted() {
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
                sqlpwd:this.user.sqlpwd,
                url:this.user.url,
                user:this.user.user,
                mobile:this.user.mobile,
            };
            let res = await getKeeperHasReadyDetailData({
                ...defaulParams,
                dddh:this.$route.query.id,
                ckbm:this.$route.query.code,
                ywCompanyId:this.$route.query.companyId
            });
            this.list = res.data.list;
        },
    }
}
</script>
<style lang="scss" scoped>
    .driverContainer{
        padding-top: 94px;
        background-color: #DFDFDF;
        .finishBtn{
            width:340px;
            height:80px;
            background:rgba(211,63,63,1);
            border-radius:40px;
            line-height: 80px;
            text-align: center;
            font-size:28px;
            font-family:PingFangSC-Light;
            font-weight:300;
            color:rgba(255,255,255,1);
            margin: 30px auto 10px;
        }
        .infos{
            background-color: #fff;
            .goodsArea{
                padding: 24px 38px 47px;
                .goodsItem{
                    border: 2px solid #BEBEBE;
                    display: flex;
                    flex-direction: column;
                    padding: 28px 20px;
                    border-radius:6px;
                    margin-bottom: 10px;
                    .top{
                        font-size:26px;
                        font-family:PingFang-SC-Medium;
                        font-weight:500;
                        color:rgba(102,102,102,1);
                        line-height:37px;
                    }
                    .bottom{
                        display: flex;
                        align-items: center;
                        margin-top: 24px;
                        .left{
                            width:298px;
                            height:285px;
                            flex-shrink: 0;
                            img{
                                width: 100%;
                                height: 100%;
                                object-fit: scale-down;
                                
                            }
                        }
                        .right{
                            font-size:26px;
                            font-family:PingFangSC-Light;
                            font-weight:300;
                            color:rgba(102,102,102,1);
                            line-height:37px;
                            .btn{
                                width:200px;
                                height:60px;
                                background:rgba(211,63,63,1);
                                border-radius:4px;
                                font-size:28px;
                                font-family:PingFangSC-Light;
                                font-weight:300;
                                color:rgba(255,255,255,1);
                                line-height:60px;
                                text-align: center;
                                margin-top: 36px;
                            }
                        }
                    }
                }
            }
            .infoArea{
                font-size:28px;
                font-family:PingFangSC-Light;
                font-weight:300;
                color:rgba(51,51,51,1);
                line-height:40px;
                .infoItem{
                    padding:17px 38px;
                    border-bottom: 1px solid #BEBEBE;
                    display: flex;
                    align-items: center;
                    &.title{
                        padding: 35px 38px;
                        color: #D33F3F;
                    }
                    .left{
                        width: 168px;
                        margin-right: 100px;
                    }
                }
            }
        }
  }
</style>
