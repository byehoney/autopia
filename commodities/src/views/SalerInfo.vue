<template>
    <div class="salerContainer">
        <TopNav></TopNav>
        <div class="progress" v-if="!unique">
            <div class="state">
                <img src="../images/md_icon_act.png" class="stateIcon" alt="">
                <p class="stateText">门店信息</p>
            </div>
            <div class="divide" v-if="more"></div>
            <div class="state" v-if="more">
                <img src="../images/intel_icon_act.png" class="stateIcon" alt="">
                <p class="stateText">资质信息</p>
            </div>
            <div class="divide"></div>
            <div class="state">
                <img src="../images/user_icon_act.png" class="stateIcon" alt="">
                <p class="stateText">人员信息</p>
            </div>
        </div>
        <div :class="['info_area',unique?'top':'']">
            <div class="info_list">
                <div class="info_item">
                    <div class="left">姓名</div>
                    <input type="text" v-model="name" class="input" placeholder="请输入真实姓名" autocomplete="false">
                </div>
                <div class="info_item noBorder">
                    <div class="left">身份认证</div>
                    <p class="right">上传身份证正反面进行身份验证</p>
                </div>
            </div>
        </div>
        <div class="card_box">
            <div class="card_item">
                <div class="top z">
                    <img :src="imgStrZ" alt="" class="cardImg">
                    <input @change="fileChange($event,'imgStrZ')" type="file" id="upload_file" class="upload_file"  accept="image/*"/>
                </div>
                <div class="bottom">身份证头像面</div>
            </div>
            <div class="card_item">
                <div class="top f">
                    <img :src="imgStrF" alt="" class="cardImg">
                    <input @change="fileChange($event,'imgStrF')" type="file" id="upload_file" class="upload_file"  accept="image/*"/>
                </div>
                <div class="bottom">身份证国徽面</div>
            </div>
        </div>
        <div class="nextBtn" @click="goNext">完成</div>
        <div class="mask" v-if="showTip">
            <div class="tipContent">
                <div class="title">温馨提示</div>
                <div class="text">内容已提交，等待审核中</div>
                <div class="sure" @click="closeTip">确认</div>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import {uploadImage,getUploadToken,joinRegister,creatRegister,} from '@/api/index'
import {mapState,mapMutations} from 'vuex'
import { setTimeout } from 'timers';
export default {
    data(){
        return{
            loading:false,//是否在发送请求  开关 控制多次请求
            more:false,//是否显示引导项
            unique:false,
            showTip:false,
            name:'',
            imgStrZ: '',
            imgStrF:'',
            file:'',
            token:'',
            file_key:'',
            key:'',
            domain:'http://yanhuawang.rydltech.com/',
        }
    },
    components:{
        TopNav,
    },
    computed:{
        ...mapState('register',['mobile','roleInfo','rangeList','intel','joinInfo','createAddInfo'])
    },
    mounted(){
        this.more = this.$router.history.current.query.creatNew;
        this.unique = this.$router.history.current.query.unique;
        this.getToken();
    },
    methods:{
        async getToken(){
            let res = await getUploadToken({suffix:'1'});
            this.token = res.data.token;
            this.key = res.data.imgUrl;
            console.log(res);
        },
        async registerJoin(data){
            if(this.loading){
                return;
            }
            this.loading = true;
            let res = await joinRegister(data);
            this.loading = false;
            // alert(JSON.stringify(res))
            if(res.code==0){
                this.showTip = true;
                this.$router.replace({name:'login'})
            }
        },
        async registerCreat(data){
            if(this.loading){
                return;
            }
            this.loading = true;
            let res = await creatRegister(data);
            this.loading = false;
            if(res.code==0){
                this.showTip = true;
                this.$router.replace({name:'login'})
            }
        },
        goNext(){
            if(!this.name.trim()){
                Toast({
                    message: "请输入真实姓名",
                    position: "middle",
                    duration: 2000
                });
            }else if(!this.imgStrZ){
                Toast({
                    message: "请上传身份证正面",
                    position: "middle",
                    duration: 2000
                });
            }else if(!this.imgStrF){
                Toast({
                    message: "请上传身份证反面",
                    position: "middle",
                    duration: 2000
                });
            }else{
                if((this.roleInfo.userRoleCode=='06'||this.roleInfo.userRoleCode=='07')&&this.more){
                    let data = {
                        mobile:this.mobile,
                        name:this.name,
                        userRole:this.roleInfo.userRoleCode,
                        qIdCard:this.imgStrZ,
                        hIdCard:this.imgStrF,
                        passWord:this.roleInfo.psw,
                        companyName:this.createAddInfo.shopName,
                        regionCode:this.createAddInfo.aCode,
                        address:this.createAddInfo.regAddr,
                        code:this.createAddInfo.tCode,
                        businessCode:this.intel.intelCode,
                        aptitudeStr:JSON.stringify({'aptitude':this.intel.aptitudeList}),
                        scopeStr:JSON.stringify({'scope':this.rangeList})
                    }
                    console.log(data)
                    this.registerCreat(data)
                }else{
                    let companyId = '';
                    if(this.roleInfo.userRoleCode=='06'||this.roleInfo.userRoleCode=='07'){
                        companyId = this.joinInfo.shopCode;
                    }else if(this.userRole=='03'||this.userRole=='08'){
                        companyId = this.roleInfo.partCode;
                    }else {
                        companyId = this.roleInfo.companyCode;
                    }
                    let data = {
                        mobile:this.mobile,
                        name:this.name,
                        userRole:this.roleInfo.userRoleCode,
                        qIdCard:this.imgStrZ,
                        hIdCard:this.imgStrF,
                        passWord:this.roleInfo.psw,
                        companyId:companyId
                    }
                    this.registerJoin(data)
                }
            }
        },
        chooseType() {
            document.getElementById('upload_file').click();
        },
        upload(e,card){
            var data = new FormData();//重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
            data.append('token', this.token);
            data.append('file',this.file)
            data.append('key',this.key+this.file_key)
            uploadImage(data,(res)=>{
                this[card] = this.domain+res.key
            })
        },
        fileChange(e,card) {
           if (!e.target.files[0].size) return;
            this.file= e.target.files[0]
            this.file_key = e.target.files[0].name
            e.target.value = ''
            this.upload(e,card);
        },
        closeTip(){
            this.showTip = false;
        }
    }
}
</script>
<style lang="scss" scoped>
    .salerContainer{
        width: 100vw;
        height: 100vh;
        background:rgba(235,235,235,1);
        .nav{
            border-bottom: 2px solid #ebebeb;
        }
        .progress{
            padding-top: .92rem;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 184px;
            background-color: #fff;
            .state{
                display: flex;
                flex-direction: column;
                align-items: center;
                .stateIcon{
                    width: 80px;
                    height: 80px;
                    margin-bottom: 5px;
                }
                .stateText{
                    font-size:22px;
                    color:#E32323;
                    line-height:29px;
                    &.grey{
                        color: #999;
                    }
                }
            }
            .divide{
                width:190px;
                height:3px;
                background:rgba(153,153,153,1);
                border-radius:2px;
                position: relative;
                top: -10px;
            }
        }
        .info_area{
            display: flex;
            flex-direction: column;
            width: 100%;
            background-color: #fff;
            margin-top: 10px;
            &.top{
                padding-top: .92rem;
            }
            .info_list{
                margin-left: 39px;
                display: flex;
                flex-direction: column;
                .info_item{
                    display: flex;
                    align-items: center;
                    height: 120px;
                    border-bottom: 2px solid #ebebeb;
                    &.noBorder{
                        border:none;
                    }
                    .left{
                        width: 120px;
                        font-size:26px;
                        color:rgba(102,102,102,1);
                        letter-spacing:1px;
                        margin-right: 55px;
                    }
                    .input{
                        width: 253px;
                        height: 100%;
                        border: none;
                        outline: none;
                        font-size:26px;
                        color:#333;
                        line-height: 110px;
                        letter-spacing:1px;
                    }
                    .right{
                        width:506px;
                        height: 100%;
                        line-height: 120px;
                        font-size:20px;
                        color:rgba(153,153,153,1);
                        letter-spacing:1px;
                    }
                }
            }
        }
        .card_box{
            display: flex;
            justify-content: center;
            background-color: #fff;
            width: 100%;
            .card_item{
                display: flex;
                flex-direction: column;
                margin-right: 52px;
                .top{
                    width:292px;
                    height:166px;
                    // background:linear-gradient(85deg,rgba(255,98,56,1) 0%,rgba(255,18,64,1) 100%);
                    border-radius:10px;
                    position: relative;
                    &.z{
                        background: url('../images/id_card_z.png') no-repeat 0 0;
                        background-size: 100% 100%;
                    }
                    &.f{
                        background: url('../images/id_card_f.png') no-repeat 0 0;
                        background-size: 100% 100%;
                    }
                    .cardImg{
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    .upload_file{
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        font-size: 0;
                        opacity: 0;
                    }
                }
                &:last-child{
                    margin-right: 0;
                }
                .bottom{
                    font-size:20px;
                    color:rgba(153,153,153,1);
                    line-height:26px;
                    letter-spacing:2px;
                    margin-top: 21px;
                    margin-bottom: 209px;
                    text-align: center;
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
        .mask{
            position: fixed;
            top: 0;
            left:0;
            width: 100%;
            height: 100%;
            background:rgba(0,0,0,.5);
            .tipContent{
                width:552px;
                height:334px;
                background:rgba(28,28,28,1);
                border-radius:8px;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -167px;
                margin-left: -276px;
                display: flex;
                flex-direction: column;
                .title{
                    font-size:36px;
                    color:rgba(255,255,255,1);
                    line-height:47px;
                    letter-spacing:1px;
                    padding-top: 75px;
                    padding-left: 57px;
                    text-align: left;
                }
                .text{
                    font-size:30px;
                    color:rgba(255,255,255,1);
                    line-height:40px;
                    letter-spacing:1px;
                    padding-left: 57px;
                    margin-top: 32px;
                }
                .sure{
                    font-size:30px;
                    color:rgba(74,144,226,1);
                    line-height:40px;
                    letter-spacing:1px;
                    align-self: flex-end;
                    margin-top: 54px;
                    margin-right: 49px;
                }
            }
        }
    }
</style>
