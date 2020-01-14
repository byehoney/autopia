<template>
    <div class="driverContainer">
        <TopNav/>
        <div class="goodsArea">
            <div class="top">商品名称：{{spmc}}</div>
            <div class="bottom">
                <div class="left">
                    <img :src="url?url:require('../images/default_logo.jpg')" alt="">
                </div>
                <div class="right">
                    <p>商品编码：{{productcode}}</p>
                    <p>规格：{{guig}}</p>
                    <p>单位：{{dw}}</p>
                    <p>厂家：{{cj}}</p>
                    <p>数量：{{sl}}</p>
                    <p>辅量：{{fl}}</p>
                    <div class="funArea">
                        <div class="funBtn" @click="reduce">-</div>
                        <input type="Number" v-model="num">
                        <div class="funBtn" @click="add">+</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="inputArea">
            <div class="left">{{$route.query.type=='cx'?'撤销':'拒收'}}原因：</div>
            <textarea class="area" v-model="note" :placeholder="$route.query.type=='cx'?'请输入撤销原因':'请输入拒收原因'" name="" id="" cols="30" rows="10"></textarea>
        </div>
        <div class="btnArea">
            <div class="btn" @click="confirm">确定</div>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import { getDriverAriveCancelClickData,getDriverCancelGoodsData,getDriverRefuseGoodsData,getDriverRefuseClickData } from '@/api/index'
import TopNav from '../components/DriverTopNav';
import { mapState ,mapActions,mapGetters, mapMutations} from 'vuex';
export default {
    data(){
        return{
            spmc:'',
            url:'',
            productcode:'',
            guig:'',
            dw:'',
            cj:'',
            sl:'',
            fl:'',
            num:1,
            note:''
        }
    },
    computed:{
        // ...mapState('login',['user','token']),
        ...mapState({
          user:state=>state.login.user,
          token:state=>state.login.token,
        }),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components:{
        TopNav
    },
    mounted() {
        this.getData();
    },
    methods:{
        reduce(){
            if(this.num==1){
                return;
            }
            this.num = this.num -1;
        },
        add(){
            this.num = this.num+1;
        },
        async getData(){

            let type = this.$route.query.type;
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
                sqlpwd:this.user.sqlpwd,
                url:this.user.url,
                user:this.user.user,
                mobile:this.user.mobile,
            };
            let res;
            if(type=='cx'){
                res = await getDriverCancelGoodsData({
                    ...defaulParams,
                    ckbm:this.$route.query.code,
                    ywCompanyId:this.$route.query.companyId,
                    dddh:this.$route.query.id,
                    productcode:this.$route.query.pId,
                })
            }else{
                res = await getDriverRefuseGoodsData({
                    ...defaulParams,
                    ywCompanyId:this.$route.query.companyId,
                    dddh:this.$route.query.id,
                    productcode:this.$route.query.pId,
                })
            }
            if(res.code==0){
                this.spmc = this.$route.query.type=='cx'?res.data.spmc:res.data.psmc;
                this.url = res.data.url;
                this.productcode = res.data.productcode;
                this.guig = res.data.guig;
                this.dw = res.data.dw;
                this.cj = res.data.cj;
                this.sl = res.data.sl;
                this.fl = res.data.fl;
            }
        },
        async confirm(){
            let reg = /^[0-9]*[1-9][0-9]*$/;
            if(!reg.test(this.num)){
                Toast({
                    message: '数量必须为正整数',
                    position: "middle",
                    duration: 2000
                });
                return;
            }
            let type = this.$route.query.type;
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
                sqlpwd:this.user.sqlpwd,
                url:this.user.url,
                user:this.user.user,
                mobile:this.user.mobile,
            };
            let res ;
            if(type=='cx'){
                res = await getDriverAriveCancelClickData({
                    ...defaulParams,
                    ckbm:this.$route.query.code,
                    ywCompanyId:this.$route.query.companyId,
                    dddh:this.$route.query.id,
                    productcode:this.$route.query.pId,
                    cxNum:this.num,
                    cxyy:this.note
                })
            }else{
                res = await getDriverRefuseClickData({
                    ...defaulParams,
                    ckbm:'aaa',
                    ywCompanyId:this.$route.query.companyId,
                    dddh:this.$route.query.id,
                    productcode:this.$route.query.pId,
                    cxNum:this.num,
                    cxyy:this.note
                })
            }
            if(res.code==0){
                Toast({
                    message: res.msg,
                    position: "middle",
                    duration: 2000
                });
                setTimeout(()=>{
                    this.$router.go(-1);
                },2100)
            }else{
                Toast({
                    message: res.msg,
                    position: "middle",
                    duration: 2000
                });
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .driverContainer{
        padding-top: 94px;
        background-color: #DFDFDF;
        .btnArea{
            display: flex;
            justify-content: flex-end;
            padding: 31px 37px;
            background-color: #fff;
            .btn{
                width:200px;
                height:80px;
                background:rgba(211,63,63,1);
                border-radius:10px;
                font-size:28px;
                font-family:PingFangSC-Light;
                font-weight:300;
                color:rgba(255,255,255,1);
                line-height:80px;
                text-align: center;
            }
        }
        .inputArea{
            padding: 37px;
            background-color: #fff;
            display: flex;
            border-bottom: 1px solid #BEBEBE;
            .left{
                font-size:28px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(102,102,102,1);
                line-height:40px;
                flex-shrink: 0;
            }
            .area{
                width:500px;
                height:200px;
                border:1px solid rgba(190,190,190,1);
                font-size:28px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(102,102,102,1);
                line-height:40px;
                flex-shrink: 0;
                padding: 14px 18px;
                resize: none;
            }
        }
        
        .goodsArea{
            background-color: #fff;
            padding: 38px;
            border-bottom: 1px solid #BEBEBE;
            .top{
                font-size:28px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(102,102,102,1);
                line-height:40px;
                margin-bottom: 32px;
            }
            .bottom{
                display: flex;
                align-items: center;
                .left{
                    width:298px;
                    height:285px;
                    flex-shrink: 0;
                    margin-right: 44px;
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: scale-down;
                        
                    }
                }
                .right{
                    font-size:26px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(102,102,102,1);
                    line-height:37px;
                    .funArea{
                        display: flex;
                        align-items: center;
                        margin-top: 40px;
                        .funBtn{
                            width:50px;
                            height:50px;
                            background:rgba(216,216,216,1);
                            border-radius:4px 0px 0px 4px;
                            line-height: 50px;
                            text-align: center;
                        }
                        input{
                            outline: none;
                            border-top: 1px solid #BEBEBE;
                            border-bottom: 1px solid #BEBEBE;
                            width: 100px;
                            height: 48px;
                            text-align: center;
                        }
                    }
                }
            }
        }
  }
</style>
