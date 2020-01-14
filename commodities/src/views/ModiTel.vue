<template>
    <div class="telContainer">
        <TopNav></TopNav>
        <div class="telContent">
            <div class="tip">您正在更换手机号：{{user.mobile|formatTel}}</div>
            <div class="text">请验证</div>
            <div class="pasArea">
                <div class="pasItem">
                    <div class="left">
                        新手机号
                    </div>
                    <div class="right">
                        <input type="text" maxlength="11" placeholder="请输入您的手机号" class="input" autocomplete="false" v-model="tel">
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
            </div>
        </div>
        <div class="confirm_btn" @click="confirm()">确认</div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import {updateUserInfo,getYzCode,checkYzCode} from '@/api/index'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
    data(){
        return{
            tel:'',
            yzm:'',
            sending:false,
            msgStr:"获取验证码",
        }
    },
    filters:{
        formatTel(data){
            return data.substr(0,3)+'****' + data.substr(7,11);
        }
    },
    computed:{
        ...mapState('login',['user']),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components:{
        TopNav,
    },
    methods:{
        ...mapMutations('login',['saveMobile']),
        async reqYzcode(){
            let res = await getYzCode({mobile:this.user.mobile});
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
        sendMsg(){
            if(!this.canSend()){
                return;
            }
            if(!this.sending){
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
            }else{
                this.saveMobile(this.tel);
                let defaulParams = {
                    token:this.token,
                    userId:this.userId,
                    corpCode:this.corpCode,
                    companyId:this.companyId,
                    userRole:this.userRole,
                }; 
               let res = await updateUserInfo({...defaulParams,data:this.tel,type:2});
               if(res.code==0){
                   this.$router.go(-1);
               }
            }
        },
        confirm(){
            this.checkCode();
        }
    }
}
</script>
<style lang="scss" scoped>
.telContainer{
    width: 100vw;
    height: 100vh;
    background:rgba(235,235,235,1);
    .confirm_btn{
        width: 671px;
        height: 98px;
        line-height: 98px;
        text-align: center;
        background-color: #FFC004;
        font-size:30px;
        color:rgba(255,255,255,1);
        letter-spacing:3px;
        margin: 83px auto 0;
    }
    .telContent{
        padding-top: 120px;
        display: flex;
        flex-direction: column;
        padding-left: 39px;
        padding-right: 41px;
        .tip{
            font-size:28px;
            color:rgba(51,51,51,1);
            line-height:37px;
            letter-spacing:2px;
            margin-bottom: 18px;
        }
        .text{
            font-size:26px;
            color:rgba(102,102,102,1);
            line-height:35px;
            letter-spacing:1px;
            margin-bottom: 38px;
        }
        .sendArea{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left{
                width: 331px;
                height: 96px;
                line-height: 96px;
                border: 2px solid #ebebeb;
                background-color: #fff;
                font-size:28px;
                color:rgba(235,235,235,1);
                letter-spacing:1px;
                padding-left: 17px;
                margin-right: 16px;
                border-radius: 10px;
            }
            .right{
                width: 516px;
                height: 94px;
                border: 2px solid #E32323;
                font-size:28px;
                color:#E32323;
                line-height:94px;
                letter-spacing:2px;
                border-radius: 10px;
                text-align: center;
            }
        }
        .pasArea{
            // padding-top: 92px;
            // background-color: #fff;
            // padding-bottom: 38px;
            .pasItem{
                display: flex;
                justify-content: space-between;
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
                    background-color: #fff;
                    border-radius:4px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border:1px solid rgba(155,155,155,1);
                    height: 96px;
                    padding-left: 15px;
                    width:516px;
                    height:96px;
                    .yzm{
                        width:199px;
                        height:94px;
                        line-height: 94px;
                        font-size:30px;
                        font-family:MicrosoftYaHei;
                        color:#333;
                        letter-spacing:3px;
                        border: none;
                        outline: none;
                    }
                    .input{
                        width: 98%;
                        height:94px;
                        line-height: 94px;
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
    }
}
</style>
