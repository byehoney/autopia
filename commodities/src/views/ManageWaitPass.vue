<template>
    <div class="mangeContainer" style="opacity:1">
        <TopNav></TopNav>
        <div class="divide"></div>
        <div class="waiteList">
            <div class="waitItem" v-for="(item,index) in list" :key="index" @click="goDetail(item.userId)">
                <img src="../images/manage_atv.png" class="atv" alt="">
                <div class="infos">
                    <div class="top">
                        <div class="name">姓名：<span>{{item.userName}}</span></div>
                        <div class="tel">电话：<span>{{item.userPhone}}</span></div>
                    </div>
                    <div class="bottom">店名：<span>{{item.cvName}}</span></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
import TopNav from '@/components/TopNav'
// import ManageTabBarBotttom from '@/components/ManageTabBarBottom';
import { reqManageWaitePass } from '@/api/index'
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
        }
    },
    computed: {
         ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components:{
        TopNav
    //    ManageTabBarBotttom,
    },
    mounted() {
        this.getData();
    },
    methods: {
        goDetail(id){
            this.$router.push({name:'manageIntelPass',query:{id:id}})
        },
        async getData(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
                pageSize:this.pageSize,
                pageNum:this.pageNum
            };      
            let res = await reqManageWaitePass({
                ...defaulParams
            })
            this.list = res.data.list;
        }
    },
}
</script>
<style lang="scss" scoped>
    .mangeContainer{
        background-color: #fff;
        .divide{
            width: 100%;
            height: 8px;
            background-color: #ebebeb;
            padding-top: 93px;
        }
        .waiteList{
            .waitItem{
                margin-left: 45px;
                border-bottom: 2px solid #ebebeb;
                display: flex;
                align-items: center;
                padding: 33px 0 22px 0;
                .atv{
                    width: 52px;
                    height: 52px;
                    margin-right: 10px;
                    flex-shrink: 0;
                }
                .infos{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size:24px;
                    color:rgba(102,102,102,1);
                    line-height:31px;
                    .top{
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 15px;
                        width: 515px;
                    }
                    .bottom{
                        width: 515px;
                    }
                    span{
                        font-size:22px;
                        color:rgba(153,153,153,1);
                        line-height:29px;
                    }
                }
            }
        }
    }
</style>
