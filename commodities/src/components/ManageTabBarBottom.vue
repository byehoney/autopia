<template>
    <mt-tabbar v-model="selected" fixed class="bar mybar">
        <mt-tab-item id="manageHome">
            <img slot="icon" :src="selected==='manageHome'?tabs[0][1]:tabs[0][0]">
            今日
        </mt-tab-item>
        <mt-tab-item id="salesTrend">
            <img slot="icon" :src="selected==='salesTrend'?tabs[1][1]:tabs[1][0]">
            报表
        </mt-tab-item>
        <mt-tab-item id="manageProRank">
            <img slot="icon" :src="selected==='manageProRank'?tabs[2][1]:tabs[2][0]">
            商品
        </mt-tab-item>
        <mt-tab-item id="manageCustomerRank">
            <img slot="icon" :src="selected==='manageCustomerRank'?tabs[3][1]:tabs[3][0]">
            店铺
        </mt-tab-item>
    </mt-tabbar>
</template>
<script>
export default {
    data(){
        return{
            selected:this.curTab,
            tabs:[
                [require('../images/manage/manage_b_05.png'),require('../images/manage/manage_b_01.png')],
                [require('../images/manage/manage_b_06.png'),require('../images/manage/manage_b_02.png')],
                [require('../images/manage/manage_b_07.png'),require('../images/manage/manage_b_03.png')],
                [require('../images/manage/manage_b_08.png'),require('../images/manage/manage_b_04.png')]
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
                case 'manageHome':   
                    this.$router.push('/manageHome');
                break;
                case 'salesTrend':
                    this.$router.push('/salesTrend');
                break;
                case 'manageProRank':
                    this.$router.push('/manageProRank');
                break;
                case 'manageCustomerRank':
                    this.$router.push('/manageCustomerRank');
                break;
                default:
                    this.$router.push('/manageHome');
            }
        }
    }
}
</script>
<style scoped lang="scss">
    .mint-tabbar>.mint-tab-item{
        color: #fff;
        background: #ff1240;
        background:linear-gradient(180deg,rgba(0,122,255,1) 0%,rgba(24,152,247,1) 100%);
    }
   .mint-tabbar>.mint-tab-item.is-selected {
        background: #ff1240;
        background:linear-gradient(180deg,rgba(0,122,255,1) 0%,rgba(24,152,247,1) 100%);
        color:#fff;
    }
    .bar{
        height: 98px;
        color:#fff;
        font-size:22px;
        font-family:'MicrosoftYaHei';
        line-height:29px;
        letter-spacing:2px;
        background: #ff1240;
        background:linear-gradient(180deg,rgba(0,122,255,1) 0%,rgba(24,152,247,1) 100%);
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