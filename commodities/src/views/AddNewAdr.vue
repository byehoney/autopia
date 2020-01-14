<template>
    <div class="addContainer">
        <!-- <TopNav></TopNav> -->
        <div class="nav">
            <img @click="goBack" src="../images/leftArrow.png" class="leftIcon" alt="">
            <span class="title">我的收货地址</span>
            <span class="btn" v-if="showDel" @click="delAdd">删除</span>
        </div>
        <div class="addArea">
            <div class="addItem">
                <div class="left">
                    收货人：
                </div>
                <div class="right">
                    <input type="text" class="input" autocomplete="false" placeholder="请输入" v-model="name">
                </div>
            </div>
             <div class="addItem">
                <div class="left">
                    手机号：
                </div>
                <div class="right">
                    <input type="text" maxlength="11" class="input" autocomplete="false" placeholder="请输入" v-model="tel">
                </div>
            </div>
             <div class="addItem" @click="handlerArea"> 
                <div class="left">
                    所在地区：
                </div>
                <div class="right addr">
                    <input type="text" disabled class="input" v-model="sel_value" autocomplete="false" placeholder="请选择省市区">
                    <img src="../images/arrow_right.png" alt>
                </div>
            </div>
             <div class="addItem">
                <div class="left">
                    详细地址：
                </div>
                <div class="right">
                    <input type="text" class="input" autocomplete="false" placeholder="街道、楼牌号等" v-model="details">
                </div>
            </div>
        </div>
        <div class="nextBtn" @click="saveAddr">保存</div>
        <CityPicker :areaVisible="areaVisible" :setArea="handleSetArea" :cancel="handleCancel"></CityPicker>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import CityPicker from "@/components/CityPicker";
import {addNewAddr,upDateAddr} from '@/api/index'
import {mapState,mapGetters}  from 'vuex'
export default {
    data(){
        return{
            showDel:false,//是否显示删除按钮
            areaVisible:false,
            set_value: "", //滑动变化值
            sel_value: "", //选择的值
            name:'',
            tel:'',
            details:'',
            pCode:'',
            cCode:'',
            aCode:'',
            warehouseCode:''
        }
    },
    computed:{
        ...mapState('login',['user']),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components:{
        TopNav,
        CityPicker
    },
    mounted(){
        let query = this.$router.history.current.query;
        if(query.edit){
            this.showDel = true;
            this.sel_value = query.city+','+query.cvPosition;
            this.name = query.person;
            this.tel = query.tel;
            this.details = query.warehouseAddr;
            this.aCode = query.positionCode;
            this.warehouseCode = query.warehouseCode;
        }
    },
    methods:{
        goBack(){
            this.$router.go(-1);
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
        async reqAdd(data){
            let res = await addNewAddr(data);
            if(res.code==0){
                if(this.$route.query.from=="confirm"){
                    this.$router.replace({name:'confirmOrders',query:{money:this.$route.query.money,canSelMz:this.$route.query.canSelMz,type:this.$route.query.type}})
                }else{
                    this.$router.replace({name:'address'})
                }
            }
        },
        async modifyArr(data){
            let res = await upDateAddr(data);
            if(res.code == 0){
                if(this.$route.query.from=="confirm"){
                    this.$router.replace({name:'confirmOrders',query:{money:this.$route.query.money,canSelMz:this.$route.query.canSelMz,type:this.$route.query.type}})
                }else{
                    this.$router.replace({name:'address'})
                }
            }
        },
        async delAdd(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            };
            let data ={
                ...defaulParams,
                address:this.details,
                userName:this.name,
                warehouseCode:this.warehouseCode,
                mobile:this.tel,
                type:1,
                positionCode:this.aCode
            }
            let res = await upDateAddr(data);
            if(res.code==0){
                if(this.$route.query.from=="confirm"){
                    this.$router.replace({name:'confirmOrders',query:{money:this.$route.query.money,canSelMz:this.$route.query.canSelMz,type:this.$route.query.type}})
                }else{
                    this.$router.push({name:'address'})
                }
            }
        },
        saveAddr(){
            let reg = /^1[345678]\d{9}$/;
            if(!this.name.trim()){
                Toast({
                    message: "请输入姓名",
                    position: "middle",
                    duration: 2000
                });
            }else if(!this.tel.trim()||!reg.test(this.tel.trim())){
                Toast({
                    message: "请输入正确的手机号",
                    position: "middle",
                    duration: 2000
                });
            }else if(!this.sel_value.trim()){
                Toast({
                    message: "请选择所在地区",
                    position: "middle",
                    duration: 2000
                });
            }else if(!this.details.trim()){
                Toast({
                    message: "请输入详细地址信息",
                    position: "middle",
                    duration: 2000
                });
            }else{
                let defaulParams = {
                    token:this.token,
                    userId:this.userId,
                    corpCode:this.corpCode,
                    companyId:this.companyId,
                    userRole:this.userRole,
                };
                let data = {
                    ...defaulParams,
                    corpCode:this.user.corpCode,//平台编码
                    companyId:this.user.companyId,
                    userId:this.user.userId,
                    address:this.details,
                    userName:this.name,
                    mobile:this.tel,
                    positionCode:this.aCode
                }
                if(this.showDel){//修改  删除
                    this.modifyArr({...data,type:0,warehouseCode:this.warehouseCode})
                }else{
                    this.reqAdd(data);
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.addContainer{
    width: 100vw;
    height: 100vh;
    background:rgba(235,235,235,1);
    .nav{
        width: 100%;
        height: 88px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        border-bottom: 2px solid #ebebeb;
        .leftIcon{
            width: 17px;
            height: 30px;
            position: absolute;
            top: 29px;
            left: 30px;
        }
        .title{
            font-size: 30px;
        }
        .btn{
            width:133px;
            height:35px;
            font-size:24px;
            color:rgba(153,153,153,1);
            line-height:35px;
            letter-spacing:2px;
            position: absolute;
            top: 26px;
            right: 41px;
            text-align: right;
        }
    }
    .addArea{
        padding-top: 92px;
        background-color: #fff;
        width: 100%;
        .addItem{
            margin-left: 39px;
            border-bottom: 2px solid #ebebeb;
            display: flex;
            align-items: center;
            height: 112px;
            line-height: 112px;
            .left{
                width:136px;
                font-size:26px;
                color:rgba(102,102,102,1);
                letter-spacing:1px;
            }
            .right{
                display: flex;
                align-items: center;
                flex: 1;
                padding-right: 41px;
                &.addr{
                    display: flex;
                    .input{
                        padding-right: 20px;
                    }
                    img{
                        width: 17px;
                        height: 30px;
                    }
                }
                .input{
                    border: none;
                    outline: none;
                    height: 112px;
                    line-height: 112px;
                    font-size:26px;
                    color:#333;
                    letter-spacing:3px;
                    text-align: right;
                    width: 100%;
                    background-color: #fff;
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
        background-color: #FFC004;
        margin: 0 auto;
    }
}
</style>
