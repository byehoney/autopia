<template>
    <div class="reg_container">
        <TopNav></TopNav>  
        <div class="reg_area">
            <input class="tel" type="tel" maxlength="11" v-model="tel" autocomplete="false" placeholder="请输入您的手机号">
            <div class="msg_area">
                <input class="yzm" type="text" v-model="yzm" autocomplete="false" placeholder="请输入验证码">
                <div class="yzm_btn" @click="sendMsg">{{msgStr}}</div>
            </div>
            <div class="agree_area">
                <div class="agree" @click="toggleCheck">
                    <img v-if="!checked" src="../images/agree_01.png" class="check" alt="">
                    <img v-if="checked" src="../images/agree_02.png" class="check" alt="">
                    <span>确认阅读并同意</span>
                </div>
                <router-link to="/agreement">用户使用协议</router-link>
            </div>
            <div class="next_btn" @click="goNext">下一步</div>
        </div>
    </div>
</template>
<script>
import TopNav from '@/components/TopNav'
import { Toast } from "mint-ui";
import { setInterval, clearInterval } from 'timers';
import {mapState,mapMutations} from 'vuex';
import {checkYzCode,getYzCode,checkExist} from '@/api/index';
export default {
    data(){
        return{
            tel:'',
            yzm:'',
            msgStr:"获取验证码",
            checked:true,
            sending:false,
            canPass:false
        }
    },
    components:{
        TopNav
    },
    computed:{
        ...mapState('register',['mobile'])
    },
    mounted(){
        this.tel = this.mobile;
    },
    methods: {
        ...mapMutations('register',['saveMobile']),
        async reqYzcode(){
            let res = await getYzCode({mobile:this.tel});
        },
        async checkCode(){
            if(!this.canSend()){
                return;
            }else if(!this.yzm.trim()){
                Toast({
                    message: "请输入验证码",
                    position: "middle",
                    duration: 2000
                });
                return;
            }
            let res = await checkYzCode({mobile:this.tel,code:this.yzm});
            this.canPass = res.data.ckeckResult;
            if(!this.canSend()){
                return;
            }else if(!this.yzm.trim()){
                Toast({
                    message: "请输入验证码",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else if(!this.canPass){
                Toast({
                    message: "验证码不正确",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else if(!this.checked){
                Toast({
                    message: "请勾选用户使用协议",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else{
                this.saveMobile(this.tel)
                // 下一步
                this.$router.push('/registerActor')
            }
        },
        async sendMsg(){
            let res = await checkExist({mobile:this.tel});
            if(res.code!=0){
                Toast({
                    message: "该手机号已被注册",
                    position: "middle",
                    duration: 2000
                });
                return;
            }
            if(!this.canSend()){
                return;
            }else if(!this.sending){
                let timer = null;
                let step = 60;
                this.sending = true;
                this.reqYzcode();
                timer = setInterval(()=>{
                    step--;
                    if(step==0){
                        this.msgStr = '重新发送' ;
                        clearInterval(timer);
                        this.sending = false;
                    }else{
                        this.msgStr = step+'s后重新发送' ;
                    }
                },1000)
            }
        },
        canSend(){
            let reg = /^1[345678]\d{9}$/;
            if(!this.tel.trim()||!reg.test(this.tel.trim())){
                Toast({
                    message: "请输入正确的手机号",
                    position: "middle",
                    duration: 2000
                });
                return false;
            }else{
                return true
            }
        },
        toggleCheck(){
            this.checked = !this.checked;
        },
        goNext(){
            this.checkCode(); 
        }
    },
}
</script>
<style lang="scss" scoped>
    .reg_container{
        width: 100vw;
        height: 100vh;
        background:rgba(235,235,235,1);
        opacity: 1;
        .reg_area{
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 153px;
            .tel{
                width:559px;
                height:98px;
                line-height: 98px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(155,155,155,1);
                color:#333;
                font-size:30px;
                letter-spacing:3px;
                padding-left: 17px;
            }
            .msg_area{
                width:576px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 39px 0 27px;
                .yzm{
                    width:317px;
                    height:98px;
                    line-height: 98px;
                    background:rgba(255,255,255,1);
                    border-radius:4px;
                    border:1px solid rgba(155,155,155,1);
                    color: #333;
                    font-size:30px;
                    letter-spacing:3px;
                    padding-left: 17px;
                }
                .yzm_btn{
                    width:229px;
                    height:98px;
                    line-height: 98px;
                    background:linear-gradient(85deg,rgba(255,98,56,1) 0%,rgba(255,18,64,1) 100%);
                    border-radius:4px;
                    font-size:30px;
                    color:rgba(235,235,235,1);
                    letter-spacing:3px;
                    text-align: center;
                }
            }
            .agree_area{
                display: flex;
                justify-content: center;
                align-items: center;
                font-size:20px;
                color:rgba(102,102,96,1);
                line-height:26px;
                letter-spacing:2px;
                .agree{
                    display: flex;
                    align-items: center;
                }
                .check{
                    width: 23px;
                    height: 23px;
                    margin-right: 15px;
                }
                a{
                    color: #F5A623;
                }
            }
            .next_btn{
                width: 576px;
                height: 98px;
                line-height: 98px;
                text-align: center;
                font-size:36px;
                color:rgba(255,255,255,1);
                letter-spacing:3px;
                background-color: #FFC004;
                margin-top: 116px;
            }
        }
    }
</style>
