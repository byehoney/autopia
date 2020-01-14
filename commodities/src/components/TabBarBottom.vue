<template>
    <mt-tabbar v-model="selected" fixed class="bar mybar">
        <mt-tab-item id="home">
            <img slot="icon" :src="selected==='home'?tabs[0][1]:tabs[0][0]">
            首页
        </mt-tab-item>
        <mt-tab-item id="choose">
            <img slot="icon" :src="selected==='choose'?tabs[1][1]:tabs[1][0]">
            选品
        </mt-tab-item>
        <mt-tab-item id="shopcar">
            <img slot="icon" :src="selected==='shopcar'?tabs[2][1]:tabs[2][0]">
            购物车
        </mt-tab-item>
        <mt-tab-item id="my">
            <img slot="icon" :src="selected==='my'?tabs[3][1]:tabs[3][0]">
            我的
        </mt-tab-item>
    </mt-tabbar>
</template>
<script>
export default {
    data(){
        return{
            selected:this.curTab,
            tabs:[
                [require('../images/home_sel.png'),require('../images/home_grey.png')],
                [require('../images/choose_sel.png'),require('../images/choose_grey.png')],
                [require('../images/shopcar_sel.png'),require('../images/shopcar_grey.png')],
                [require('../images/my_sel.png'),require('../images/my_grey.png')]
            ],
        }
    },
    props:{
        curTab: String,
    },
    activated(){
        this.selected = this.curTab;
    },
    created(){
        
    },
    methods:{
       
    },
    watch:{
        selected(newValue,oldValue){
            switch(newValue){
                case 'home':   
                    this.$router.push('/');
                break;
                case 'choose':
                    this.$router.push('/choose');
                break;
                case 'shopcar':
                    this.$router.push('/newShopcar');
                break;
                case 'my':
                    this.$router.push('/my');
                break;
                default:
                    this.$router.push('/');
            }
        }
    }
}
</script>
<style scoped lang="scss">
    .mint-tabbar>.mint-tab-item{
        color: #fff;
        background: #E32323;
        // background: -webkit-linear-gradient(to right, #ff6238ed, #ff1240);
        // background: linear-gradient(to right, #ff6238ed, #ff1240);
        // background:linear-gradient(to right,rgba(245,81,81,1) 0%,rgba(195,41,24,1) 100%);
    }
   .mint-tabbar>.mint-tab-item.is-selected {
        background: #E32323;
        // background: -webkit-linear-gradient(to right, #ff6238ed, #ff1240);
        // background: linear-gradient(to right, #ff6238ed, #ff1240);
        // background:linear-gradient(to right,rgba(245,81,81,1) 0%,rgba(195,41,24,1) 100%);
        color:#fff;
    }
    .bar{
        height: 98px;
        color:#fff;
        font-size:22px;
        font-family:'MicrosoftYaHei';
        line-height:29px;
        letter-spacing:2px;
        background: #E32323;
    }
    .mint-tab-item{
        padding: 21px 0 16px;
    }
    .mint-tab-item-icon {
        width: 100%;
        height: 100%;
        margin: 0 auto 10px;
        display: flex;
        justify-content: center;
    }
    .mint-tab-item-icon>*{
        width: 29px!important;
        height: 28px!important;
    }
    .mint-tabbar.is-fixed{
        z-index: 1000;
    }
</style>