<template>
    <div class="intelContainer">
        <TopNav></TopNav>
        <div class="progress">
            <div class="state">
                <img src="../images/md_icon_act.png" class="stateIcon" alt="">
                <p class="stateText">门店信息</p>
            </div>
            <div class="divide"></div>
            <div class="state">
                <img src="../images/intel_icon_act.png" class="stateIcon" alt="">
                <p class="stateText">资质信息</p>
            </div>
            <div class="divide" v-if="!is_add_relative"></div>
            <div class="state" v-if="!is_add_relative">
                <img src="../images/user_icon_grey.png" class="stateIcon" alt="">
                <p class="stateText grey">人员信息</p>
            </div>
        </div>
        <div class="info_area">
            <div class="info_list">
                <div class="info_item" @click="selProperties">
                    <div class="left">经营性质</div>
                    <div class="properties">
                        <span>{{sel_value}}</span>
                        <img class="right_icon" src="../images/arrow_right.png" alt="">
                    </div>
                </div>
                <div class="info_item noBorder" @click="selRange">
                    <div class="left">经营范围</div>
                    <img src="../images/arrow_right.png" alt="">
                </div>
            </div>
        </div>
        <div class="itel_info" v-if="itelList.length>0">
            <p class="title">
                <span class="main_title">资质信息</span>
                <!-- <span class="tip">上传身份证正反面进行身份验证</span> -->
            </p>
            <div class="itel_list">
                <div class="itel_item" v-for="(item,index) in itelList" :key="index">
                    <p class="itel_title">{{item.aptitudeName}}</p>
                    <div class="itel_upload">
                        <img :src="item.imgStr" alt="">
                        <input @change="fileChange($event,index,item.aptitudeCode)" type="file" id="upload_file" class="upload_file"  accept="image/*"/>
                    </div>
                </div>
            </div>
        </div>

        <div class="nextBtn" @click="goEnd" v-if="!is_add_relative">下一步</div>
        <div class="nextBtn" @click="goEnd" v-if="is_add_relative">完成</div>
        <div class="mask" v-if="showTip">
            <div class="tipContent">
                <div class="title">温馨提示</div>
                <div class="text">内容已提交，等待审核中</div>
                <div class="sure" @click="closeTip">确认</div>
            </div>
        </div>
        <mt-popup
            v-model="popupVisible"
            position="bottom"
        >
            <mt-picker value-key="businessName" ref="picker" :defaultIndex="dIndex" :slots="slots" @change="onValuesChange" showToolbar>
                <div class="barContent">
                    <div @click="handleCancel" class="cancel">取消</div>
                    <div class="tip">请选择</div>
                    <div @click="handleConfirm" class="sure">确认</div>
                </div>
            </mt-picker>
        </mt-popup>
    </div>
</template>
<script>
import Vue from 'vue'
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import {mapState,mapMutations,mapGetters} from 'vuex';
import {getPropertyList,getIntelList,uploadImage,getUploadToken,addRelativeCreate} from '@/api/index'
import { setTimeout } from 'timers';
export default {
    data(){
        return{
            loading:false,
            is_add_relative:false, //是否来源   我的  ---添加关联门店
            dIndex:0,//默认选中的经营性质
            itelList:[],//资质列表
            showTip:false,
            popupVisible:false,
            set_value:'',//滑动变化值
            sel_value:'请选择',//选择的值  经营性质
            businessCode:'',//经营性质编码
            setCode:'',
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }   
            ],
            file:'',
            uptoken:'',
            file_key:'',
            key:'',
            domain:'http://yanhuawang.rydltech.com/',
            aptitudeList:[],//存储资质信息 以及对应的图片  供最后提交
        }
    },
    computed:{
        ...mapState({
            user: state => state.login.user,
            intel: state => state.register.intel,
            rangeList:state =>state.register.rangeList,
            createAddInfo:state =>state.register.createAddInfo,
        }),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
        // ...mapState('register',['intel','rangeList','createAddInfo'])
    },
    components:{
        TopNav,
    },
    async mounted(){
        if(this.$router.history.current.query.is_add_relative){
            this.is_add_relative = true;
        }
        console.log(this.$store.state)
        let res = await getPropertyList();
        this.$set(this.slots[0],'values',res.data.list);
        this.sel_value = this.intel.intelName;
        this.getToken();
        if(this.intel.intelCode){
            this.businessCode = this.intel.intelCode;
            this.reqList();
        }
    },
    methods: {
        ...mapMutations('register',['saveIntel','restIntel']),
        async getToken(){
            let res = await getUploadToken({suffix:'1'});
            this.uptoken = res.data.token;
            this.key = res.data.imgUrl;
            console.log(res);
        },
        onValuesChange(picker, values){
            if(!values.length||!values[0]){
                return
            }
            this.set_value = values[0].businessName;
            this.setCode = values[0].businessCode;
        },
        selProperties(){
            this.popupVisible = !this.popupVisible;
        },
        handleCancel(){
            this.popupVisible = false
        },
        handleConfirm() {
            this.restIntel();
            this.popupVisible = false;
            this.sel_value = this.set_value;
            this.businessCode = this.setCode;
            console.log(this.businessCode)
            let dIndex = 0;
            this.slots[0].values.map((item,index)=>{
                if(item.businessCode==this.businessCode){
                    dIndex = index;
                }
            })
            this.saveIntel({name:this.sel_value,code:this.businessCode,dIndex:dIndex,aptitudeList:[]});
            console.log(this.$store.state)
            this.reqList();
        },
        async reqList(){
            let res = await getIntelList({code:this.businessCode});
            res.data.list.map((item,index)=>{
                item.imgStr = '';
            })
            if(this.intel.aptitudeList.length&&this.intel.intelCode){
                console.log(this.intel.aptitudeList)
                this.itelList = this.intel.aptitudeList;
            }else{
                this.itelList = res.data.list;
            }
        },
        closeTip(){
            this.showTip = false;
            this.$router.push({name:'my'})
        },
        selRange(){//选择经营范围
            this.$router.push({name:'businessScope'})
        },
        chooseType() {
            document.getElementById('upload_file').click();
        },
        upload(e,index,code){
            var data = new FormData();//重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
            data.append('token', this.uptoken);
            data.append('file',this.file)
            data.append('key',this.key+this.file_key)
            uploadImage(data,(res)=>{
                console.log(this.domain+res.key)
                this.$set(this.itelList[index],'imgStr',this.domain+res.key);
                this.saveIntel({name:this.sel_value,code:this.businessCode,dIndex:index,aptitudeList:this.itelList});
                // console.log(this.$store.state)
                // let cIndex = this.aptitudeList.findIndex((item)=>{
                //     return item.aptitude_Code == code;
                // })
                // if(cIndex>-1){
                //     this.aptitudeList.fill({aptitude_Code:code,aptitude_Url:this.domain+res.key},index,1);
                // }else{
                //     this.aptitudeList.push({aptitude_Code:code,aptitude_Url:this.domain+res.key});
                // }
            })
        },
        fileChange(e,index,code) {
            if (!e.target.files[0].size) return;
            this.file= e.target.files[0]
            this.file_key = e.target.files[0].name
            e.target.value = ''
            this.upload(e,index,code);
        },
        checkFull(){//检测资质信息是否完善
            var full = true;
            for(var i=0;i<this.itelList.length;i++){
                if(!this.itelList[i].imgStr||this.itelList[i].imgStr==''){
                    full = false;
                    break;
                }else{
                    full = true;
                }
            }
            return full
        },
        async addRelative(data){
            if(this.loading){
                return;
            }
            this.loading = true;
            let res = await addRelativeCreate(data);
            this.loading = false;
            if(res.code==0){
                this.showTip = true;
                this.$router.push({name:'my'})
            }
        },
        goEnd(){
            if(this.sel_value=='请选择'||this.set_value==''){
                Toast({
                    message: "请选择经营性质",
                    position: "middle",
                    duration: 2000
                });
            }else if(!this.rangeList.length){
                Toast({
                    message: "请选择经营范围",
                    position: "middle",
                    duration: 2000
                });
            }else if(!this.checkFull()){
                Toast({
                    message: "请完善资质信息",
                    position: "middle",
                    duration: 2000
                });
            }else{
                if(!this.is_add_relative){
                    this.$router.push({name:'salerInfo',query:{creatNew:true}})
                }else{//添加关联门店
                    let defaulParams = {
                        token:this.token,
                        userId:this.userId,
                        corpCode:this.corpCode,
                        companyId:this.companyId,
                        userRole:this.userRole,
                    };
                    let data = {
                        ...defaulParams,
                        mobile:this.user.userId,
                        companyName:this.createAddInfo.shopName,
                        regionCode:this.createAddInfo.aCode,
                        address:this.createAddInfo.regAddr,
                        code:this.createAddInfo.tCode,
                        businessCode:this.intel.intelCode,
                        aptitudeStr:JSON.stringify({'aptitude':this.intel.aptitudeList}),
                        scopeStr:JSON.stringify({'scope':this.rangeList})
                    }
                    this.addRelative(data)
                }
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.intelContainer{
    width: 100vw;
    min-height: 100vh;
    background:rgba(235,235,235,1);
    padding-bottom: 98px;
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
        .info_list{
            margin-left: 39px;
            display: flex;
            flex-direction: column;
            .info_item{
                display: flex;
                align-items: center;
                height: 120px;
                border-bottom: 2px solid #ebebeb;
                justify-content: space-between;
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
                .properties{
                    width: 453px;
                    height: 100%;
                    border: none;
                    outline: none;
                    font-size:26px;
                    color:#666;
                    line-height: 120px;
                    letter-spacing:1px;
                    text-align: right;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    span{
                        flex: 1;
                        margin-right: 10px;
                    }
                }
                .input{
                    width: 253px;
                    height: 100%;
                    border: none;
                    outline: none;
                    font-size:20px;
                    color:#333;
                    line-height: 120px;
                    letter-spacing:1px;
                    margin-right: 43px;
                    text-align: right;
                }
                img{
                    width: 17px;
                    height: 30px;
                    margin-right: 43px;
                }
            }
        }
    }
    .itel_info{
        .title{
            display: flex;
            align-items: center;
            padding: 37px 43px 30px 39px;
            .main_title{
                font-size:26px;
                color:rgba(102,102,102,1);
                line-height:35px;
                letter-spacing:1px;
                margin-right: 55px;
            }
            .tip{
                font-size:20px;
                color:rgba(153,153,153,1);
                line-height:26px;
                letter-spacing:1px;
            }
        }
    }
    .itel_list{
        display: flex;
        flex-direction: column;
        .itel_item{
            display: flex;
            flex-direction: column; 
            padding-left: 39px;
            .itel_title{
                font-size:22px;
                color:rgba(102,102,102,1);
                line-height:29px;
                margin-bottom: 37px;
            }
            .itel_upload{
                width:164px;
                height:216px;
                background:rgba(216,216,216,1);
                border:2px solid rgba(151,151,151,1);
                margin-bottom: 37px;
                position: relative;
                img{
                    position: absolute;
                    top: 0;
                    left:0;
                    width: 100%;
                    height: 100%; 
                    object-fit: scale-down;
                }
                .upload_file{
                    position: absolute;
                    top: 0;
                    left:0;
                    width: 100%;
                    height: 100%;
                    z-index: 100;
                    font-size: 0;
                    opacity: 0;
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
    .mask{
        position: fixed;
        top: 0;
        left:0;
        z-index: 10000;
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
    .mint-popup-bottom{
        width: 100%;
    }
    .picker-toolbar{
        width: 100%;
        height: 96px;
        border-bottom: 2px solid #ebebeb;
    }
    .barContent{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 38px;
        color:#666;
        .cancel,.sure{
            height: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding:0 30px;
            font-size:26px;
            color:rgba(102,102,102,1);
            letter-spacing:2px;
        }
        .sure{
            color:#E32323;
        }
        .tip{
            font-size:30px;
            color:rgba(51,51,51,1);
            letter-spacing:3px;
        }
    }
    .slot1{
        width: 100vw;
        .picker-item{
            font-size:30px;
            color:rgba(51,51,51,1);
            height: 78px;
            line-height:78px;
            letter-spacing:3px;
        }
    }
}
</style>
