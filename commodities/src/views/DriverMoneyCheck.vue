<template>
    <div class="driverContainer">
        <TopNav/>
        <div class="inputArea">
            <div class="inputItem">
                <div class="left">调度单号：</div>
                <div class="right">
                    <input v-model="orderNum" type="text" placeholder="请输入调度单号">    
                </div>    
            </div>
            <div class="inputItem">
                <div class="left">客户信息：</div>
                <div class="right">
                    <input v-model="customer" type="text" placeholder="请输入客户信息">    
                </div>    
            </div>
            <div class="inputItem">
                <div class="left">开始时间：</div>
                <div class="right" v-if="start" id="start"  @click="show('S')">
                    <span>{{start}}</span>
                    <img class="dateIcon" src="../images/driver/data_icon.png" alt="">  
                </div>    
            </div>
            <div class="inputItem">
                <div class="left">结束时间：</div>
                <div class="right"  v-if="end" id="end" @click="show('E')">
                    <span>{{end}}</span>
                    <img class="dateIcon" src="../images/driver/data_icon.png" alt="">
                </div>    
            </div>
            <div class="inputItem">
                <div class="left">支付状态：</div>
                <div class="right" @click="selState">
                    <span>{{sel_value}}</span>
                    <img class="selIcon" src="../images/driver/sel_icon.png" alt="">   
                </div>    
            </div>
            <div class="btn" @click="doSearch">查询</div>
        </div>
        <div class="infoArea">
            <div class="title">费用查询统计</div>
            <div class="details" v-if="list.length">
                <div class="infoDetail">总应收（元）：{{list[0].zys}}</div>
                <div class="infoDetail">总已收（元）：{{list[0].zyis}}</div>
                <div class="infoDetail">运费总额（元）：{{list[0].yfze}}</div>
            </div>
            <div class="details" v-else>
                <div class="infoDetail">总应收（元）：0</div>
                <div class="infoDetail">总已收（元）：0</div>
                <div class="infoDetail">运费总额（元）：0</div>
            </div>
        </div>
        <div class="checkList"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
        >
            <div class="list" v-for="(item,index) in list" :key="index">
                <div class="title">
                    <div class="left">调度单号：</div>
                    <div class="right">{{item.dddh}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">送达日期：</div>
                    <div class="right">{{item.ssrq}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">配送日期：</div>
                    <div class="right">{{item.psrq}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">客户数：</div>
                    <div class="right">{{item.khs}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">货值（元）：</div>
                    <div class="right">{{item.hz}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">体积（立方米）：</div>
                    <div class="right">{{item.tj}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">载重（公斤）：</div>
                    <div class="right">{{item.zz}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">品种数：</div>
                    <div class="right">{{item.pzs}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">库位数：</div>
                    <div class="right">{{item.kws}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">运费（元）：</div>
                    <div class="right">{{item.yf}}</div>
                </div>
                <div class="infoItem">
                    <div class="left">下单日期：</div>
                    <div class="right">{{item.xdrq}}</div>
                </div>
            </div>
        </div>
        <awesome-picker
        ref="picker"
        :textTitle="picker.textTitle"
        :type="picker.type"
        :anchor="picker.anchor"
        :colorConfirm="picker.colorConfirm"
        @cancel="handlePickerCancel"
        @confirm="handlePickerConfirm"
        ></awesome-picker>
        <mt-popup v-model="popupVisible" position="bottom">
            <mt-picker
                value-key="zfzt"
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
import TopNav from '../components/DriverTopNav';
import { getDriverMoneyData ,getDriverPayStateData} from '@/api/index';
import { mapState ,mapActions,mapGetters, mapMutations} from 'vuex';
export default {
    data(){
        return{
            start:this.getNowFormatDate() ,
            end:this.getNowFormatDate(),
            curDate:'',
            Y: "",
            M: "",
            D: "",
            picker: {
                anchor: [],
                textTitle: "选择日期",
                type: "date",
                colorConfirm:"#007AFF"
            },
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
            orderNum:'',
            customer:'',
            loading:false,
            list:[],
            moreLoading:false,
            pageSize:10,
            pageNum:1,
            noData:false,//是否有数据
            hasMore:true,
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
        this.loading = true;
        this.getPayStatus();
        this.getData();
    },
    methods:{
        selState() {
            this.popupVisible = !this.popupVisible;
        },
        onValuesChange(picker, values) {
            if (!values.length || !values[0]) {
                return;
            }
            this.set_value = values[0].zfzt;
            this.setCode = values[0].zfzt=='全部'?'':values[0].zfzt;
        },
        handleCancel() {
            this.popupVisible = false;
        },
        handleConfirm() {
            this.popupVisible = false;
            this.sel_value = this.set_value;
            this.selCode = this.setCode;
        },
        show(type) {
            this.curDate = type;
            this.$refs.picker.show();
        },
        handlePickerCancel(){

        },
        handlePickerConfirm(v) {
            this.Y = parseInt(v[0].value)>9?parseInt(v[0].value):'0'+parseInt(v[0].value);
            this.M = parseInt(v[1].value)>9?parseInt(v[1].value):'0'+parseInt(v[1].value);
            this.D = parseInt(v[2].value)>9?parseInt(v[2].value):'0'+parseInt(v[2].value);
            this.picker.anchor = v;
            this.$refs.picker.display=false;
            if(this.curDate == 'S'){
                this.start = this.Y + '-' +this.M + '-'+ this.D;    
            }else{
                this.end = this.Y + '-' +this.M + '-'+ this.D; 
            }
        },
        getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        async getPayStatus(){
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
            let res = await getDriverPayStateData(defaulParams);
            let newStatusList = [{'zfzt':'全部'}];
            this.$set(this.slots[0],'values',newStatusList.concat(res.data.list));
        },
        doSearch(){
            if(this.moreLoading){
                return;
            }
            this.loading = true;
            this.hasMore = true;
            this.pageNum = 1;
            this.noData = false;
            this.list = [];
            this.getData();
        },
        async getData(){
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
                pageSize:this.pageSize,
                pageNum:this.pageNum,
            };
            let uniqueParams = {
                startTime:this.start,
                endTime:this.end,
                orderId:this.orderNum,
                khInfo:this.customer,
                zfzt:this.selCode
            }
            let res = await getDriverMoneyData({
                ...defaulParams,
                ...uniqueParams
            })
            this.loading = false;
            if(res.code == 0){
                if(!res.data.list.length){
                    this.hasMore = false;
                    this.moreLoading = false;
                    if(this.pageNum!=1){
                        Toast({
                            message: "已经到底了~",
                            position: "middle",
                            duration: 2000
                        });
                    }else{
                        Toast({
                            message: "暂无数据",
                            position: "middle",
                            duration: 2000
                        });
                    }
                    return;
                }else{
                    this.hasMore = true;
                    this.moreLoading = false;
                }
                this.list = [...this.list,...res.data.list];
            }
        },
        loadMore(){
            if(this.moreLoading||!this.hasMore){
                return;
            }
            this.pageNum = this.pageNum+1;
            this.getData();
        }
    }
}
</script>
<style lang="scss" scoped>
    .driverContainer{
        padding-top: 94px;
        background-color: #DFDFDF;
        .list{
            background-color: #fff;
            margin-top: 6px;
            .title{
                height: 110px;
                line-height: 110px;
                padding-left: 87px;
                font-size:28px;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:rgba(102,102,102,1);
                display: flex;
                border-bottom: 2px solid #dfdfdf;
                .left{
                    width: 224px;
                }
            }
            .infoItem{
                display: flex;
                align-items: center;
                padding-left: 87px;
                height: 50px;
                border-bottom: 1px solid #dfdfdf;
                margin-bottom: 6px;
                .left{
                    width: 224px;
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(102,102,102,1);
                }
                .right{
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(102,102,102,1);
                }
            }
        }
        .infoArea{
            margin-top: 6px;
            .title{
                padding-left: 87px;
                height:110px;
                line-height: 110px;
                font-size:28px;
                font-family:PingFangSC-Light;
                font-weight:300;
                color:rgba(211,63,63,1);
                margin-bottom: 2px;
                background-color: #fff;
            }
            .details{
                background-color: #fff;
            }
            .infoDetail{
                background-color: #fff;
                font-size:28px;
                font-family:PingFangSC-Light;
                font-weight:300;
                color:rgba(51,51,51,1);
                line-height:40px;
                padding: 27px 0 0 87px;
                &:last-child{
                    padding-bottom: 27px;
                }
            }
        }
        .inputArea{
            background-color: #fff;
            padding: 21px 0 56px;
            .btn{
                width:340px;
                height:80px;
                background:rgba(211,63,63,1);
                border-radius:40px;
                line-height: 80px;
                text-align: center;
                font-size:28px;
                font-family:PingFangSC-Light;
                font-weight:300;
                color:rgba(255,255,255,1);
                margin: 72px auto 0;
            }
            .inputItem{
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                justify-content: center;
                .left{
                    flex-shrink: 0;
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(51,51,51,1);
                    line-height:40px;
                    margin-right: 20px;
                }
                .right{
                    width:390px;
                    height:60px;
                    border:1px solid rgba(190,190,190,1);
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(51,51,51,1);
                    line-height:60px;
                    padding-left: 10px;
                    padding-right: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .selIcon{
                        width:20px;
                        height:25px;
                    }
                    .dateIcon{
                        width: 30px;
                        height: 30px;
                    }
                    input{
                        width: 100%;
                        height: 40px;
                        line-height: 40px;
                        border: none;
                        outline: none;
                        font-size:28px;
                        font-family:PingFangSC-Light;
                        font-weight:300;
                        color:#333;
                        line-height:40px;
                    }
                }
            }
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
