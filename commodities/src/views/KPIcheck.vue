<template>
    <div class="mangeContainer" style="opacity:1">
        <mt-header :title="title" class="manageHeader">
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- <mt-button icon="more" slot="right"></mt-button> -->
        </mt-header>
        <div class="checkArea">
            <div class="checkItem">
                <div class="left">姓名：</div>
                <div class="right">
                    <input type="text" class="input" v-model="name" placeholder="请输入姓名">
                </div>
            </div>
            <div class="checkItem">
                <div class="left">手机号：</div>
                <div class="right">
                    <input type="text" class="input" v-model="mobile" placeholder="请输入手机号">
                </div>
            </div>
            <div class="checkItem" @click="handlerArea">
                <div class="left">选择地区：</div>
                <div class="right">
                    <span>{{sel_value}}</span>
                    <img src="../images/arrow_right.png" class="right_icon" alt="">
                </div>
            </div>
            <div class="checkBtn" @click="doSearch">查询</div>
        </div>
        <div class="list">
            <div class="listItem" v-for="(item,index) in list" :key="index" @click="goKPIList(item.userid)">
                <img src="../images/manage_atv.png" class="atv" alt="">
                <div class="infos">
                    <div class="name">姓名：{{item.username}}</div>
                    <div class="customer">今日客户数：<span class="num">{{item.jrkhs}}</span></div>
                </div>
                <div class="infos">
                    <div class="tel">电话：{{item.mobile}}</div>
                    <div class="customer">总客户数：<span class="num">{{item.zkhs}}</span></div>
                </div>
                <img src="../images/arrow_right.png" class="right_icon" alt="">
            </div>
        </div>
        <!-- <ManageTabBarBotttom></ManageTabBarBotttom> -->
        <CityPicker global="manage" :areaVisible="areaVisible" :setArea="handleSetArea" :cancel="handleCancel"></CityPicker>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
// import ManageTabBarBotttom from '@/components/ManageTabBarBottom';
import CityPicker from "@/components/CityPicker";
import { reqMemberKPI } from '@/api/index'
export default {
    data(){
        return{
            title:'业绩查询',
            name:'',
            mobile:'',
            areaVisible:false,
            sel_value:'请选择地区',
            pCode:'',
            cCode:'',
            aCode:'',
            list:[],
        }
    },
    computed: {
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components:{
        // ManageTabBarBotttom,
        CityPicker,
    },
    mounted() {
        this.getData();
    },
    methods: {
        goKPIList(id){
            this.$router.push({name:'kpiCheckList',query:{id:id}})
        },
        doSearch(){
            this.getData();
        },
        handlerArea(){
            this.areaVisible = !this.areaVisible;
        },
        handleSetArea(value,pCode,cCode,aCode){
            this.sel_value = value;
            this.pCode = pCode;
            this.cCode = cCode;
            this.aCode = aCode;
            this.areaVisible = false;
        },
        handleCancel(){
            this.areaVisible = false;
        },
        async getData(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            };      
            let res = await reqMemberKPI({...defaulParams,ywMobile:this.mobile.trim(),ywName:this.name.trim(),regionCode:this.aCode});
            if(res.code == 0){
                this.list = res.data.list;
            }
        }
    },
}
</script>
<style lang="scss" scoped>
    .mangeContainer{
        background-color: #ebebeb;
        padding-bottom: 100px;
        .manageHeader{
            height: 93px;
            line-height: 93px;
            font-size: 30px;
            color:#333;
            background: #fff;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
        }
        .list{
            background:#fff;
            margin-top: 11px;
            .listItem{
                margin-left: 44px;
                border-bottom: 2px solid #ebebeb;
                padding: 24px 39px 21px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                &:last-child{
                    border-bottom: none;
                }
                .atv{
                    width: 54px;
                    height: 54px;
                }
                .name,.tel{
                    font-size:24px;
                    color:rgba(102,102,102,1);
                    line-height:31px;
                    letter-spacing:2px;
                    margin-bottom: 14px;
                }
                .customer{
                    font-size:24px;
                    color:rgba(102,102,102,1);
                    line-height:31px;
                    .num{
                        font-size:22px;
                        color:rgba(0,122,255,1);
                        line-height:29px;
                    }
                }
                .right_icon{
                    width: 17px;
                    height: 31px;
                }
            }
        }
        .checkArea{
            margin-top: 102px;
            padding-bottom: 34px;
            width:100%;
            background:#fff;
            .checkBtn{
                width:384px;
                height:90px;
                background:linear-gradient(180deg,rgba(250,217,97,1) 0%,rgba(247,107,28,1) 100%);
                border-radius:50px;
                text-align: center;
                line-height: 90px;
                font-size:28px;
                color:rgba(255,255,255,1);
                letter-spacing:2px;
                margin: 38px auto 0;
            }
            .checkItem{
                display: flex;
                align-items: center;
                margin-left: 39px;
                border-bottom: 2px solid #d8d8d8;
                .left{
                    width: 154px;
                    font-size:28px;
                    color:rgba(102,102,102,1);
                    line-height:37px;
                    letter-spacing:2px;
                    flex-shrink: 0;
                }
                .right{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 27px 39px 27px 0;
                    .input,span{
                        width: 500px;
                        font-size:28px;
                        color:#666;
                        line-height:37px;
                        letter-spacing:2px;
                        display: inline-block;

                    }
                    .right_icon{
                        width: 17px;
                        height: 31px;
                    }
                }
            }
        }
    }
</style>
