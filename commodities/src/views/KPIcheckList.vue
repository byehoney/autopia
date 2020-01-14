<template>
    <div class="mangeContainer" style="opacity:1">
        <div class="manageHeader">
            <img @click="goBack" src="../images/arrow_left_white.png" class="leftIcon" alt="">
            <div class="inputArea">
                <form @submit.prevent class="form">
                    <input v-model="searchStr" @keypress="searchShop" type="text" placeholder="请输入搜索内容" class="input">
                </form>
            </div>
            <span @click="doSearch">搜索</span>
        </div>
        <div class="manageList" 
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
        >
            <div class="listItem" v-for="(item,index) in list" :key="index" @click="goDetail(item.companyid)">
                <img class="shopIcon" src="../images/dianpu_m.png" alt="">
                <div class="listInfo">
                    <div class="sName">门店名称：{{item.companyname}}</div>
                    <div class="lName">联系人：{{item.username}}</div>
                    <div class="rAdd">注册地址：{{item.address}}</div>
                    <div class="order">总订单数：<span class="num">{{item.zdds}}</span></div>
                    <div class="order">总订单额：<span class="num">¥{{item.zdde}}</span></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
import { reqManageShop } from '@/api/index'
export default {
    data(){
        return{
            searchStr:'',
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
       
    },
    activated() {
        this.loading = false;
        if (!this.$route.meta.canKeep) {
            this.pageNum = 1;
            this.list = [];
            this.getData();
        }
    },
    deactivated(){
        this.loading = true;
    },
    beforeRouteLeave(to, from, next){
        let position = window.scrollTop
        sessionStorage.setItem('mStop',position);
        next()
    },
    beforeRouteEnter (to, from, next) {
        if(from.name == 'kpiCheckShop'){
            to.meta.canKeep = true;
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.$nextTick(function(){
                    let position = sessionStorage.getItem('mStop') //返回页面取出来
                    window.scrollTo({ 
                        top: position, 
                        behavior: "instant" 
                    });
                })
            })   
        }else{
            to.meta.canKeep = false;
            next();
        }
    },
    methods: {
        goDetail(id){
            this.$router.push({name:'kpiCheckShop',query:{id:id,memberId:this.$route.query.id}})
        },
        goBack(){
            this.$router.go(-1);
        },
        doSearch(){
            this.pageNum = 1;
            this.list = [];
            this.getData();
        },
        searchShop(event){
            if (event.keyCode == 13) {
                event.preventDefault(); //禁止默认事件（默认是换行）
                this.pageNum = 1;
                this.list = [];
                this.getData();
            }
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
            let res = await reqManageShop({...defaulParams,ywUserId:this.$route.query.id,khItem:this.searchStr});
            this.moreLoading = false;
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
}
</script>
<style lang="scss" scoped>
    .mangeContainer{
        background-color: #fff;
        // padding-bottom: 100px;
        .manageList{
            margin-top: 93px;
            .listItem{
                display: flex;
                margin-left: 55px;
                border-bottom: 2px solid #ebebeb;
                padding: 27px 38px 27px 0;
                .shopIcon{
                    width: 40px;
                    height: 36px;
                    margin-right: 20px;
                    flex-shrink: 0;
                }
                .sName,.lName,.rAdd,.order{
                    font-size:22px;
                    color:rgba(51,51,51,1);
                    line-height:29px;
                    letter-spacing:2px;
                    margin-bottom: 10px;
                }
                .num{
                    color: #F5A623;
                }
            }
        }
        .manageHeader{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 93px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            background:linear-gradient(180deg,rgba(0,122,255,1) 0%,rgba(24,152,247,1) 100%);
            .leftIcon{
                width: 17px;
                height: 30px;
            }
            .inputArea{
                width: 506px;
                height: 58px;
                background-color: #fff;
                border-radius: 30px;
                position: relative;
            }
            .input{
                width: 506px;
                height: 58px;
                background-color: #fff;
                font-size:22px;
                color:#999;
                line-height:30px;
                letter-spacing:2px;
                border: none;
                outline: none;
                position: absolute;
                top: 0;
                left: 0;
                border-radius: 30px;
                padding-left: 21px;
            }
            span{
                font-size:28px;
                color:rgba(255,255,255,1);
                line-height:37px;
                letter-spacing:2px;
            }
        }
    }
</style>
