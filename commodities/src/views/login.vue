<template>
    <div class="login_area">
        <img src="../images/login_logo.png" class="logo_icon" alt="">
        <input class="name" type="tel" maxlength="11" placeholder="请输入您的手机号" v-model="username" autocomplete="off">
        <input class="pas" type="password" placeholder="请输入密码" v-model="password" autocomplete="off">
        <div class="login_btn" @click="loginBtn">登录</div>
        <div class="more_fun">
            <router-link to="/register" replace>手机快速注册</router-link>
            <router-link :to="{name:'forgetPas',query:{from:'forget'}}" replace>忘记密码？</router-link>
        </div>
        <!-- <CheckUser></CheckUser> -->
    </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from "vuex";
import { Toast } from "mint-ui";
import CheckUser from "../components/CheckUser";
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  components: { CheckUser },
  created() {},
  mounted() {},
  methods: {
    ...mapActions("login", ["login"]),
    loginBtn() {
        let reg = /^1[345678]\d{9}$/;
        if (this.username.trim() === "" || this.password.trim() === "") {
            Toast({
                message: "请输入账号或密码",
                position: "middle",
                duration: 2000
            });
        }else if(!reg.test(this.username.trim())){
            Toast({
                message: "请输入正确的手机号",
                position: "middle",
                duration: 2000
            });
        }else {
            this.login({
                mobile: this.username,
                password: this.password,
                $router: this.$router,
                $route: this.$route
            });
        }
    }
  }
};
</script>
<style scoped lang="scss">
    .login_area{
        opacity: 1;
        width: 100vw;
        min-height: 100vh;
        background-color:#E32323; 
        display: flex;
        flex-direction: column;
        align-items: center;
        background: url('../images/login_bg.jpg') no-repeat 0 0;
        background-attachment: fixed;
        background-size: cover;
        .logo_icon{
            width: 200px;
            height: 112px;
            padding-top: 137px;
            margin-bottom: 143px;
        }
        .name,.pas{
            display: block;
            width:576px;
            height:98px;
            background:rgba(255,255,255,1);
            border-radius:4px;
            border:1px solid;
            border-image:linear-gradient(85deg, rgba(255,98,56,1), rgba(255,18,64,1)) 1 1;
            font-size:30px;
            color:#333;
            // color:rgba(235,235,235,1);
            line-height:98px;
            letter-spacing:3px;
            padding-left: 16px;
            margin-bottom: 40px;
        }
        .login_btn{
            width: 576px;
            height: 98px;
            line-height: 98px;
            text-align: center;
            background-color: #ffbe50;
            font-size:36px;
            color:rgba(255,255,255,1);
            letter-spacing:3px;
            margin-top: 75px;
        }
        .more_fun{
            width: 576px;
            margin:20px auto 0;
            display: flex;
            justify-content: space-between;
            a,span{
                font-size:26px;
                color:rgba(235,235,235,1);
                line-height:35px;
                letter-spacing:2px;
            }
        }
    }
</style>

