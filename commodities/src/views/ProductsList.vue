<template>
    <div class="hotContainer">
        <TopNav></TopNav>
        <ul
            class="content"
        >
            <li v-for="(item,index) in list" :key="index" class="listItem">
                <div class="left">
                    <img :src="item.imgurl?item.imgurl:require('../images/default_logo.jpg')" alt="">
                </div>
                <div class="right">
                    <div class="top">
                        <div class="bName">{{item.suitebuynumber>0?item.cartproductsuitename:item.formalname}}</div>
                        <div class="fName">{{item.factory}}</div>
                        <div class="size">规格：{{item.specification}}</div>
                        <!-- <div class="saled">已销：700件</div> -->
                    </div>
                    <div class="bottom">
                        <div class="price">
                            <div class="nPrice">￥{{item.price}}</div>
                            <div class="oPrice">{{item.platformprice}}</div>
                        </div>
                        <div class="num">
                            {{item.quantity}}{{item.suitebuynumber>0?'套':'件'}}
                        </div>
                    </div>
                </div>
            </li>
        </ul>      
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapGetters,mapState } from 'vuex'
import { getConfirmProducts} from '@/api/index'
import TopNav from '@/components/TopNav'
export default {
    data(){
        return{
            list:[]
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
    },
    methods: {
        async getData(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            };
            let res = await getConfirmProducts(defaulParams);
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
                flex: 1;
                .top{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    margin-bottom: 50px;
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
                    justify-content: space-between;
                    align-items: center;
                    flex:1;
                    .num{
                        font-size:18px;
                        color:rgba(102,102,102,1);
                        line-height:24px;
                        letter-spacing:1px;
                    }
                    .price{
                        display: flex;
                        align-items: flex-end;
                        .nPrice{
                            font-size:32px;
                            font-weight:bold;
                            color:rgba(255,25,0,1);
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
}
</style>
