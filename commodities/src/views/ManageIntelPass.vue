<template>
    <div class="mangeContainer" style="opacity:1">
        <TopNav></TopNav>
        <div class="divide"></div>
        <div class="state">
            <div class="title">审核状态</div>
            <div class="status">待审核</div>
        </div>
        <div class="divide"></div>
        <div class="infos">
            <div class="title">人员信息</div>
            <div class="infoItem">
                姓名：{{userData.userName}}
            </div>
            <div class="infoItem">
                手机：{{userData.userPhone}}
            </div>
            <div class="infoItem">
                店名：{{userData.cvName}}
            </div>
            <div class="infoItem">
                类型：{{userData.type}}
            </div>
            <div class="infoItem" @click="selState">
                客户类型：{{sel_value}}
            </div>
            <div class="card">
                <img :src="userData.idCardUrl" alt="">
            </div>
            <div class="card">
                <img :src="userData.idCardbackUrl" alt="">
            </div>
            <div class="btn" @click="passIt">通过</div>
        </div>
        <mt-popup v-model="popupVisible" position="bottom">
            <mt-picker
                value-key="cvTypeName"
                ref="statePicker"
                :slots="slots"
                @change="onValuesChange"
                showToolbar
            >
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
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
import TopNav from '@/components/TopNav'
import { reqManageWaitePassDetail,reqManagePassWaite,reqManageCustomerType} from '@/api/index'
// import ManageTabBarBotttom from '@/components/ManageTabBarBottom';

export default {
    data(){
        return{
            popupVisible: false,
            set_value: "",
            setCode: "",
            sel_value: "全部",
            selCode: "",
            slots: [
                {
                flex: 1,
                values: [],
                className: "slot1",
                textAlign: "center"
                }
            ],
           userData:{
                userName:'',
                userPhone:'',
                cvName:"",
                type:'',
                idCardUrl:'',
                idCardbackUrl:'',
           }
        }
    },
    computed: {
         ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    components:{
        TopNav,
    //    ManageTabBarBotttom,
    },
    async mounted() {
        let defaulParams = {
            token:this.token,
            userId:this.userId,
            corpCode:this.corpCode,
            companyId:this.companyId,
            userRole:this.userRole,
        };
        let typeList = await reqManageCustomerType(defaulParams);
        this.$set(this.slots[0],'values',typeList.data.list);  
        this.sel_value = typeList.data.list[0].cvTypeName;
        this.selCode =  typeList.data.list[0].cvTypeCode;
        let res = await reqManageWaitePassDetail({
            ...defaulParams,
            shmobile:this.$route.query.id
        })
        this.userData = res.data;
    },
    methods: {
        selState() {
            this.popupVisible = !this.popupVisible;
        },
        onValuesChange(picker, values) {
            if (!values.length || !values[0]) {
                return;
            }
            this.set_value = values[0].cvTypeName;
            this.setCode = values[0].cvTypeCode;
        },
        handleCancel() {
            this.popupVisible = false;
        },
        handleConfirm() {
            this.popupVisible = false;
            this.sel_value = this.set_value;
            this.selCode = this.setCode;
        },
        async passIt(){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
                cvType:this.selCode,
            };   
            let res = await reqManagePassWaite({
                ...defaulParams,
                shmobile:this.userData.userPhone,
                shcompanyId:this.userData.clientCode
            })
            if(res.code==0){
                Toast({
                    message: "操作成功",
                    position: "middle",
                    duration: 2000
                });
                setTimeout(()=>{
                    this.$router.go(-1);
                },2100)
            }
        }
    },
}
</script>
<style lang="scss" scoped>
    .mangeContainer{
        background-color: #fff;
        padding-top: 100px;
        .mint-header.manageHeader{
            background-color: #fff;
            .mintui{
                color: #333;
            }
            .mint-header-title{
                font-size:30px;
                color:rgba(51,51,51,1);
                line-height:40px;
            }
        }
        .infos{
            padding-bottom: 152px;
            .btn{
                width:384px;
                height:90px;
                background:linear-gradient(180deg,rgba(250,217,97,1) 0%,rgba(247,107,28,1) 100%);
                border-radius:50px;
                font-size:28px;
                color:rgba(255,255,255,1);
                text-align: center;
                line-height: 90px;
                margin: 57px auto 0;
            }
            .card{
                width:566px;
                height:347px;
                border-radius:8px;
                border:2px solid rgba(109,114,120,1);
                margin: 29px auto 0;
                img{
                    width: 546px;
                    height: 326px;
                    object-fit: scale-down;
                    position: relative;
                    top: 10px;
                    left: 10px;
                }
            }
            .infoItem{
                margin-left: 39px;
                border-bottom: 2px solid #ebebeb;
                font-size:28px;
                color:rgba(102,102,102,1);
                line-height:37px;
                padding:36px 53px 36px 0;
            }
            .title{
                padding-top: 35px;
                padding-bottom: 24px;
                font-size:34px;
                color:rgba(0,122,255,1);
                line-height:45px;
                text-align: center;
            }
        }
        .state{
            width:100%;
            background:#4B95E6;
            padding: 58px 0;
            .title{
                font-size:30px;
                color:rgba(255,255,255,1);
                line-height:40px;
                margin-left:69px; 
            }
            .status{
                font-size:46px;
                font-weight:bold;
                color:rgba(255,255,255,1);
                line-height:61px;
                margin-left:69px; 
                margin-top: 30px;
            }
        }
        .divide{
            width: 100%;
            height: 8px;
            background-color: #ebebeb;
        }
        
    }
    .mint-popup-bottom {
    width: 100%;
  }
  .picker-toolbar {
    width: 100%;
    height: 96px;
    border-bottom: 2px solid #ebebeb;
  }
  .barContent {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 38px;
    color: #666;
    .cancel,
    .sure {
      height: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 30px;
      font-size: 26px;
      color: rgba(102, 102, 102, 1);
      letter-spacing: 2px;
    }
    .sure {
      color: #E32323;
    }
    .tip {
      font-size: 30px;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 3px;
    }
  }
  .slot1 {
    width: 100vw;
    .picker-item {
      font-size: 30px;
      color: rgba(51, 51, 51, 1);
      height: 78px;
      line-height: 78px;
      letter-spacing: 3px;
    }
  }
</style>
