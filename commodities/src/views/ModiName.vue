<template>
    <div class="nameContainer">
        <div class="nav">
            <img @click="goBack" src="../images/leftArrow.png" class="leftIcon" alt="">
            <span class="title">修改姓名</span>
            <span class="btn" @click="saveName">保存</span>
        </div>
        <input class="input" type="text" autocomplete="false" v-model="name" placeholder="请输入姓名">
    </div>
</template>
<script>
import {updateUserInfo} from '@/api/index'
import {mapState,mapActions, mapMutations,mapGetters} from 'vuex' 
export default {
    data(){
        return{
            name:''
        }
    },
    computed:{
        ...mapState('login',['user']),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    methods:{
        ...mapMutations('login',['saveUserName']),
        goBack(){
            this.$router.go(-1);
        },
        async saveName(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            }; 
            let res = await updateUserInfo({...defaulParams,type:3,data:this.name});
            if(res.code == 0){
                this.saveUserName(this.name);
                this.$router.go(-1);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.nameContainer{
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
            width:116px;
            height:35px;
            font-size:26px;
            color:#E32323;
            line-height:35px;
            letter-spacing:3px;
            position: absolute;
            top: 26px;
            right: 41px;
            text-align: right;
        }
    }
    .input{
        width: 100%;
        height: 120px;
        line-height: 120px;
        background-color: #fff;
        border: none;
        outline: none;
        padding-top: 92px;
        display: block;
        font-size:26px;
        color:#333;
        letter-spacing:1px;
        padding-left: 39px;
    }
}
</style>
