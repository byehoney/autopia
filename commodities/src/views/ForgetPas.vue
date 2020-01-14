<template>
    <div class="forgetContainer">
        <TopNav></TopNav>
        <div class="pasArea">
            <div class="pasItem">
                <div class="left">
                    手机号
                </div>
                <div class="right">
                    <input type="text" placeholder="请输入您的手机号" class="input" disabled v-if="$route.query.from!='forget'" autocomplete="false" v-model="tel">
                    <input type="text" placeholder="请输入您的手机号" class="input"  v-else autocomplete="false" v-model="tel">
                </div>
            </div>
            <div class="pasItem">
                <div class="left">
                    验证码
                </div>
                <div class="right">
                    <input type="text" placeholder="请输入验证码" class="yzm" autocomplete="false" v-model="yzm">
                    <div class="sendBtn" @click="sendMsg()">{{msgStr}}</div>
                </div>
            </div>
            <div class="pasItem">
                <div class="left">
                    设置密码
                </div>
                <div class="right">
                    <input type="text" maxlength="20" minlength="6" placeholder="请输入密码" class="input" autocomplete="false" v-model="pasOne">
                </div>
            </div>
            <div class="pasItem">
                <div class="left">
                    再次输入
                </div>
                <div class="right">
                    <input type="text" maxlength="20" minlength="6" placeholder="请再次确认密码" class="input" autocomplete="false" v-model="pasTwo">
                </div>
            </div>
        </div>
        <div class="nextBtn" @click="goNext()">完成</div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import {mapGetters} from 'vuex'
import {getYzCode,checkYzCode,checkExist,checkForget,forgetPass} from '@/api/index'
export default {
    data(){
        return{
            tel:'',
            yzm:'',
            pasOne:'',
            pasTwo:'',
            msgStr:'获取验证码'
        }
    },
    components:{
        TopNav,
    },
    mounted() {
        if(this.$route.query!='forget'){
            this.tel = this.mobile;
        }
    },
    computed:{
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole','mobile'])
    },
    methods:{
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
        async reqYzcode(){
            let res = await getYzCode({mobile:this.tel});
        },
        async sendMsg(){
            if(!this.canSend()){
                return;
            }
            if(!this.sending){
                if(this.$route.query.from=='forget'){
                    let res = await checkForget({ywMobile:this.tel});
                    if(res.code==0&&res.data.ckeckResult=="true"){
                        this.doSend();
                    }else{
                        Toast({
                            message: res.data.ckeckResult,
                            position: "middle",
                            duration: 2000
                        });
                        return;
                    }
                }else{
                    this.doSend();
                }
            }
        },
        doSend(){
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
            }else if(!this.pasOne.trim()||!this.pasTwo.trim()){
                Toast({
                    message: "请输入密码",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else if(this.pasOne.trim()!=this.pasTwo.trim()){
                Toast({
                    message: "两次密码输入不同",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else{
                let defaulParams = {
                    token:this.token,
                    userId:this.userId,
                    corpCode:this.corpCode,
                    companyId:this.companyId,
                    userRole:this.userRole,
                }; 
               let res = await forgetPass({...defaulParams,mobile:this.tel,passWord:this.pasOne,code:this.yzm});
               if(res.code==0){
                   this.$router.go(-1);
               }
            }
        },
        goNext(){
            this.checkCode();
        }
    }
}
</script>
<style lang="scss" scoped>
    .forgetContainer{
        width: 100vw;
        height: 100vh;
        background:rgba(235,235,235,1);
        .nav{
            border-bottom: 2px solid #ebebeb;
        }
        .pasArea{
            padding-top: 92px;
            background-color: #fff;
            padding-bottom: 38px;
            .pasItem{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 98px;
                line-height: 98px;
                margin-bottom: 39px;
                &:first-child{
                    margin-top: 59px;
                }
                .left{
                    width: 150px;
                    font-size:30px;
                    color:rgba(102,102,102,1);
                    line-height:40px;
                    letter-spacing:3px;
                }
                .right{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border:1px solid rgba(155,155,155,1);
                    height: 96px;
                    padding-left: 15px;
                    width:425px;
                    height:96px;
                    .yzm{
                        width:199px;
                        height:92px;
                        line-height: 92px;
                        font-size:30px;
                        font-family:MicrosoftYaHei;
                        color:#333;
                        letter-spacing:3px;
                        border: none;
                        outline: none;
                    }
                    .input{
                        width: 98%;
                        height:92px;
                        line-height: 92px;
                        background:rgba(255,255,255,1);
                        border-radius:4px;
                        font-size:30px;
                        color:#333;
                        letter-spacing:3px;
                        border: none;
                        outline: none;
                    }
                    .sendBtn{
                        width:172px;
                        height:68px;
                        background:linear-gradient(85deg,rgba(255,98,56,1) 0%,rgba(255,18,64,1) 100%);
                        border-radius:10px;
                        font-size:24px;
                        font-family:MicrosoftYaHei;
                        color:rgba(255,255,255,1);
                        line-height:68px;
                        letter-spacing:2px;
                        margin-right: 20px;
                        text-align: center;
                    }
                }
            }
        }
        .nextBtn{
            width: 576px;
            height: 98px;
            line-height: 98px;
            text-align: center;
            font-size:36px;
            color:rgba(255,255,255,1);
            letter-spacing:3px;
            background-color: #FFC004;
            margin: 58px auto 0;
        }
    }
</style>
