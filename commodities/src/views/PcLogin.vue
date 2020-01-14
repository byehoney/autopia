<template>
    <div class="pcContainer">
        <TopNav></TopNav>
        <div class="loginArea">
            <img src="../images/pc_icon.png" alt="">
            <p class="tip">Pc 登录确认</p>
            <div class="loginBtn" @click="loginPc">登录</div>
            <div class="noLogin" @click="canCelLogin">取消登录</div>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
import { pcLogin } from '@/api/index'
import TopNav from '@/components/TopNav'
import { setTimeout } from 'timers';
export default {
    data(){
        return{
            
        }
    },
    computed:{
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components:{
        TopNav,
    },
    methods: {
        async loginPc(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
                code:this.$route.query.code
            };
            let res = await pcLogin(defaulParams);
            if(res.code==0){
                Toast({
                    message: "登陆成功", //弹窗内容
                    position: "middle", //弹窗位置
                    duration: 2000 //弹窗时间毫秒,如果值为-1，则不会消失
                });
                setTimeout(()=>{
                    this.$router.go(-1);
                },2100)
            }
        },
        canCelLogin(){
            this.$router.go(-1);
        }
    },
}
</script>
<style lang="scss" scoped>
.pcContainer{
    width: 100vw;
    height: 100vh;
    background:rgba(235,235,235,1);
    .loginArea{
        padding-top: 165px;
        display: flex;
        flex-direction: column;
        align-items: center;
        img{
            width:284px;
            height:223px;
        }
        .tip{
            font-size:30px;
            color:rgba(51,51,51,1);
            line-height:40px;
            letter-spacing:2px;
            margin:19px auto  104px;
        }
        .loginBtn{
            width: 576px;
            height: 98px;
            line-height: 98px;
            text-align: center;
            font-size:36px;
            color:rgba(255,255,255,1);
            letter-spacing:3px;
            background-color: #E32323;
        }
        .noLogin{
            font-size:30px;
            color:rgba(74,144,226,1);
            line-height:40px;
            letter-spacing:2px;
            margin-top: 79px;
        }
    }
}
</style>
