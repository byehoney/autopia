<template>
    <div class="nav">
        <img @click="goBack" src="../images/arrow_left_white.png" class="leftIcon" alt="">
        <span class="title">{{title}}</span>
    </div>
</template>
<script>
export default {
    data(){
        return{
            title:''
        }
    },
    mounted() {
      this.title = this.$router.currentRoute.meta.title
    },
    methods:{
        goBack(){
            this.$router.go(-1);
        }
    }
}
</script>
<style lang="scss" scoped>
    .nav{
        width: 100%;
        height: 88px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #D33F3F;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        .leftIcon{
            width: 17px;
            height: 30px;
            position: absolute;
            top: 29px;
            left: 30px;
        }
        .title{
            font-size: 30px;
            color: #fff;
        }
    }
</style>
