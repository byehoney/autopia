<template>
    <div class="addrContainer">
        <div class="nav">
            <img @click="goBack" src="../images/leftArrow.png" class="leftIcon" alt="">
            <span class="title">我的收货地址</span>
            <span class="btn" @click="addNew">添加新地址</span>
        </div>
        <div class="addList">
            <div class="addItem" v-for="(item,index) in list" :key="index" @click="selDefault(index,item.warehouseCode)">
                <div class="check_icon">
                    <img src="../images/add_check.png"  alt="" v-if="item.status!=''">
                    <img src="../images/car_circle.png"  alt="" v-else>
                </div>
                <div class="addContent">
                    <div class="top">{{item.person}} {{item.tel}}</div>
                    <div class="bottom">{{item.city}} {{item.cvPosition}} {{item.warehouseAddr}}</div>
                </div>
                <div class="edit" @click="edit(item.warehouseCode,item.person,item.tel,item.city,item.cvPosition,item.warehouseAddr,item.regioncode)">编辑</div>
            </div>
        </div>
    </div>
</template>
<script>
import {getAddrList,setDefaultAddr} from '@/api/index'
import {mapGetters} from 'vuex';
export default {
    data(){
        return{
            list:[]
        }
    },
    computed:{
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    mounted(){
        this.getList();
    },
    methods:{
        async getList(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            } 
            let res = await getAddrList(defaulParams);
            this.list = res.data.list;
            console.log(res)
        },
        goBack(){
            this.$router.go(-1);
        },
        async selDefault(index,warehouseCode){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            } 
            let res = await setDefaultAddr({...defaulParams,warehouseCode:warehouseCode})
            if(res.code == 0){
                this.list.forEach((item,i)=>{
                    this.$set(this.list[i],'status','');
                })
                this.$set(this.list[index],'status','默认');
            }
        },
        edit(id,person,tel,city,cvPosition,warehouseAddr,positionCode){
            let data = {
                edit:true,
                warehouseCode:id,
                person:person,
                tel:tel,
                city:city,
                cvPosition:cvPosition,
                warehouseAddr:warehouseAddr,
                positionCode:positionCode,
                from:this.$route.query.from,
                money:this.$route.query.money,
                canSelMz:this.$route.query.canSelMz,
                type:this.$route.query.type
            }
            this.$router.replace({name:'addNewAdr',query:data});
        },
        addNew(){
            this.$router.replace({name:'addNewAdr',query:{from:this.$route.query.from,money:this.$route.query.money,canSelMz:this.$route.query.canSelMz,type:this.$route.query.type}});
        }
    }
}
</script>
<style lang="scss" scoped>
    .addrContainer{
        width: 100vw;
        min-height: 100vh;
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
                width:163px;
                height:35px;
                font-size:24px;
                color:rgba(153,153,153,1);
                line-height:35px;
                letter-spacing:2px;
                position: absolute;
                top: 26px;
                right: 41px;
                text-align: right;
            }
        }
        .addList{
            background-color: #ebebeb;
            padding-top: 92px;
            .addItem{
                display: flex;
                align-items: center;
                background-color: #fff;
                padding:38px 40px 54px 0;
                border-bottom: 2px solid #ebebeb;
                .check_icon{
                    width: 40px;
                    height: 40px;
                    margin-left: 39px;
                    margin-right: 29px;
                    position: relative;
                    img{
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: scale-down;
                    }
                }
                .addContent{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    width: 541px;
                    flex: 1;
                    .top{
                        font-size:26px;
                        color:rgba(102,102,102,1);
                        line-height:35px;
                        letter-spacing:3px;
                    }
                    .bottom{
                        font-size:24px;
                        color:rgba(102,102,102,1);
                        line-height:31px;
                        letter-spacing:3px;
                        width: 500px;
                    }
                }
                .edit{
                    font-size:24px;
                    color:rgba(153,153,153,1);
                    line-height:31px;
                    letter-spacing:1px;
                }
            }
        }
    }
</style>
