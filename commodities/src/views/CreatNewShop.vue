<!--创建新门店-->
<template>
    <div class="creatContainer">
        <TopNav></TopNav>
        <div class="progress">
            <div class="state">
                <img src="../images/md_icon_act.png" class="stateIcon" alt="">
                <p class="stateText">门店信息</p>
            </div>
            <div class="divide"></div>
            <div class="state">
                <img src="../images/intel_icon_grey.png" class="stateIcon" alt="">
                <p class="stateText grey">资质信息</p>
            </div>
            <div class="divide" v-if="!is_add_relative"></div>
            <div class="state" v-if="!is_add_relative">
                <img src="../images/user_icon_grey.png" class="stateIcon" alt="">
                <p class="stateText grey">人员信息</p>
            </div>
        </div>
        <div class="info_area">
            <div class="info_box">
                <div class="info_item">
                    <div class="left">门店名称</div>
                    <input type="text" v-model="shop" placeholder="输入门店名称" class="input">
                </div>
                <div class="info_item" @click="handlerArea">
                    <div class="left">所在地区</div>
                    <div class="right">
                        <span>{{sel_value}}</span>
                        <img src="../images/arrow_right.png" alt="">
                    </div>
                </div>
                <div class="info_item">
                    <div class="left">注册地址</div>
                    <input type="text" v-model="addr" placeholder="输入注册地址" class="input">
                </div>
                <div class="info_item">
                    <div class="left">推荐码</div>
                    <input type="text" v-model="code" maxlength="11" placeholder="输入推荐码" class="input">
                </div>
            </div>
        </div>
        <CityPicker :areaVisible="popupVisible" :setArea="handleSetArea" :cancel="handleCancel"></CityPicker>
        <div class="nextBtn" @click="goNext">下一步</div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import CityPicker from '@/components/CityPicker'
import {mapState,mapMutations} from 'vuex';
import {checkTcode,checkExistClient} from '@/api/index'
export default {
    data(){
        return{
            is_add_relative:false,//是否  我的 -   添加关联门店
            popupVisible:false,
            set_value:'',//滑动变化值
            sel_value:'请选择地区',//选择的值
            shop:'',
            addr:'',
            code:'',
            pCode:'',
            cCode:'',
            aCode:'',
        }
    },
    components:{
        TopNav,
        CityPicker
    },
    computed:{
        ...mapState('register',['createAddInfo'])
    },
    mounted(){
        if(this.$router.history.current.query.is_add_relative){
            this.is_add_relative = true;
        }
        this.pCode = this.createAddInfo.pCode;
        this.cCode = this.createAddInfo.cCode;
        this.aCode = this.createAddInfo.aCode;
        this.sel_value = this.createAddInfo.addStr||'请选择地区';
        this.addr = this.createAddInfo.regAddr;
        this.shop = this.createAddInfo.shopName;
        this.code = this.createAddInfo.tCode;
    },
    methods:{
        ...mapMutations('register',['saveCreateShop']),
        handlerArea(){
            this.popupVisible = !this.popupVisible;
        },
        handleSetArea(value,pCode,cCode,aCode){
            this.sel_value = value;
            this.pCode = pCode;
            this.cCode = cCode;
            this.aCode = aCode;
            this.popupVisible = false;
        },
        handleCancel(){
            this.popupVisible = false;
        },
        checkCode(){
            let res = checkTcode({code:this.code.trim()});
            console.log(res)
            let pass = false;
            if(res.code==0){
                pass = true;
            }else{
                pass = false;
            }
            alert(pass)
            return pass;
        },
        async goNext(){
            let reg = /^1[345678]\d{9}$/; 
            if(!this.shop){
                Toast({
                    message: "请输入店铺名称",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else if(this.sel_value=='请选择地区'){
                Toast({
                    message: "请选择所在地区",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else if(!this.addr){
                Toast({
                    message: "请输入注册地址",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else if(!this.code.trim()){
                Toast({
                    message: "请输入正确的推荐码",
                    position: "middle",
                    duration: 2000
                });
                return;
            }
            // else if(!this.checkCode()){
            //     console.log(this.checkCode())
            //     Toast({
            //         message: "请输入正确的推荐码",
            //         position: "middle",
            //         duration: 2000
            //     });
            //     return;
            // }
            else{
                let res = await checkTcode({code:this.code.trim()});
                let result =  await checkExistClient({clientName:this.shop});
                if(res.code!=0){
                    return;
                }
                if(result.data.ckeck_result!="true"&&result.data.ckeck_result!=true){
                    Toast({
                        message: result.data.ckeck_result,
                        position: "middle",
                        duration: 2000
                    });
                    return;
                }
                let data = {
                    addStr:this.sel_value,
                    pCode:this.pCode,
                    cCode:this.cCode,
                    aCode:this.aCode,
                    regAddr:this.addr,
                    shopName:this.shop,
                    tCode:this.code,
                }
                this.saveCreateShop(data);
                if(this.is_add_relative){
                    this.$router.push({name:'intelInfo',query:{is_add_relative:true}})
                }else{
                    this.$router.push({name:'intelInfo',query:{creatNew:true}})
                }
                
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .creatContainer{
        width: 100vw;
        height: 100vh;
        background:rgba(235,235,235,1);
        .nav{
            border-bottom: 2px solid #ebebeb;
        }
        .progress{
            padding-top: .92rem;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 184px;
            background-color: #fff;
            .state{
                display: flex;
                flex-direction: column;
                align-items: center;
                .stateIcon{
                    width: 80px;
                    height: 80px;
                    margin-bottom: 5px;
                }
                .stateText{
                    font-size:22px;
                    color:#E32323;
                    line-height:29px;
                    &.grey{
                        color:rgba(153,153,153,1);
                    }
                }
            }
            .divide{
                width:190px;
                height:3px;
                background:rgba(153,153,153,1);
                border-radius:2px;
                position: relative;
                top: -10px;
            }
        }
        .info_area{
            width: 100%;
            background-color: #fff;
            margin-top: 10px;
            .info_box{
                margin-left: 39px;
                display: flex;
                flex-direction: column;
                align-items: center;
                .info_item{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    height: 112px;
                    border-bottom: 2px solid #ebebeb;
                    .left{
                        font-size:26px;
                        color:rgba(102,102,102,1);
                        line-height:112px;
                        letter-spacing:1px;
                    }
                    .input{
                        width:374px;
                        height:100px;
                        font-size:26px;
                        color:#333;
                        line-height:100px;
                        letter-spacing:3px;
                        border: none;
                        outline: none;
                        margin-right: 41px;
                        text-align: right;
                    }
                    .right{
                        display: flex;
                        align-items: center;
                        span{
                            font-size:26px;
                            color:rgba(153,153,153,1);
                            line-height:35px;
                            letter-spacing:3px;
                        }
                        img{
                            width: 17px;
                            height: 30px;
                            margin-right: 41px;
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
        .nextBtn{
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 100;
            width: 100vw;
            height: 98px;
            line-height: 98px;
            text-align: center;
            font-size:36px;
            color:rgba(255,255,255,1);
            letter-spacing:3px;
            background-color: #FFC004;
            margin: 0 auto;
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
        }
    }
</style>
