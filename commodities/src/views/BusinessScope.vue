<template>
    <div class="scopeContainer">
        <TopNav></TopNav>
        <!-- <div class="title">《XX商品经营许可证》</div> -->
        <div class="scopeBox">
            <div class="scopeList">
                <div class="scopeItem" v-for="(item,index) in dataList" :key="index" @click="selItem(index,item.scopeCode)">
                    <span>{{item.scopeName}}</span>
                    <img class="sel" v-if="item.gxStatus=='勾选'" src="../images/xuanze.png" alt="">
                </div>
            </div>
        </div>
        <div class="nextBtn" @click="confirm">确定</div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import {getRangeList} from '@/api/index'
import {mapMutations} from 'vuex'
export default {
    data(){
        return{
            dataList:[],
            selList:[],
        }
    },
    components:{
        TopNav,
    },
    async mounted(){
        let res = await getRangeList();
        this.dataList = res.data.list;
        console.log(res)
    },
    methods:{
        ...mapMutations('register',['saveRange']),
        selItem(index,scopeCode){
            if(this.dataList[index].gxStatus=='勾选'){
                this.$set(this.dataList[index],'gxStatus','不勾选')
            }else{
                this.$set(this.dataList[index],'gxStatus','勾选')
            }  
        },
        confirm(){
            this.dataList.map((item,index)=>{
                if(item.gxStatus=='勾选'){
                    this.selList.push({scope_code:item.scopeCode});
                }
            })
            this.saveRange(this.selList);
            this.$router.history.go(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
.scopeContainer{
    width: 100vw;
    min-height: 100vh;
    background:rgba(235,235,235,1);
    .nav{
        border-bottom: 2px solid #ebebeb;
    }
    .title{
        width:280px;
        height:91px;
        font-size:26px;
        font-family:MicrosoftYaHei;
        color:rgba(102,102,102,1);
        line-height:91px;
        letter-spacing:1px;
        padding-top: 92px;
        padding-left: 39px;
    }
    .scopeBox{
        width: 100%;
        background-color: #fff;
        margin-bottom: 100px;
        margin-top: 93px;
        .scopeList{
            margin-left: 39px;
            .scopeItem{
                height: 85px;
                line-height: 85px;
                border-bottom: 2px solid #ebebeb;
                font-size:26px;
                color:rgba(102,102,102,1);
                letter-spacing:1px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                &:last-child{
                    border: none;
                }
                .sel{
                    width: 32px;
                    height: 23px;
                    margin-right: 41px;
                }
            }
        }
    }
    .nextBtn{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 98px;
        line-height: 98px;
        text-align: center;
        font-size:36px;
        color:rgba(255,255,255,1);
        letter-spacing:3px;
        background-color: #FFC004;
        margin: 0 auto;
    }
}
</style>
