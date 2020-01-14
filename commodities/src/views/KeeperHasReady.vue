<template>
    <div class="driverContainer">
        <TopNav/>
        <div class="inputArea">
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
                <div class="left">客户信息：</div>
                <div class="right">
                    <input type="text" v-model="customer" placeholder="请输入客户信息">    
                </div>    
            </div>
            <div class="inputItem">
                <div class="left">司机信息：</div>
                <div class="right">
                    <input type="text" v-model="driver" placeholder="请输入司机信息">    
                </div>    
            </div>
            <div class="inputItem">
                <div class="left">仓库名称：</div>
                <div class="right" @click="selState">
                    <span>{{sel_value}}</span>
                    <img class="selIcon" src="../images/driver/sel_icon.png" alt="">   
                </div>    
            </div>
            <div class="btn" @click="doSearch">查询</div>
        </div>
        <div class="infoArea">
            <div class="title">数据汇总</div>
            <div class="details" v-if="list.length">
                <div class="infoDetail">客户总数：{{list[0].khhz}}</div>
                <div class="infoDetail">货值合计（元）：{{list[0].hzhj}}</div>
                <div class="infoDetail">总体积（立方米）：{{list[0].ztj}}</div>
            </div>
            <div class="details" v-else>
                <div class="infoDetail">客户总数：0</div>
                <div class="infoDetail">货值合计（元）：0</div>
                <div class="infoDetail">总体积（立方米）：0</div>
            </div>
        </div>
        <!-- <div class="checkList">
            <div class="list">
                <div class="noArive">
                    <div class="listOuter">
                        <div class="innerTile">
                            库位名称：库位一
                        </div>
                        <div class="detailBox" @click="goDetail(0)">
                            <div class="detailInfo">
                                <div class="mainTitle">
                                    <div class="infos">
                                        <div class="left">调度单号：</div>
                                        <div class="right">JJHKLIGGHK987666</div>
                                    </div>
                                    <div class="infos">
                                        <div class="left">状态：</div>
                                        <div class="right state">已备货</div>
                                    </div>
                                </div>
                                <div class="detailInfos">
                                    <div class="left">客户名称：</div>
                                    <div class="right">张三</div>
                                </div>
                                <div class="detailInfos">
                                    <div class="left">司机姓名：</div>
                                    <div class="right">司机1</div>
                                </div>
                                <div class="detailInfos">
                                    <div class="left">司机电话：</div>
                                    <div class="right">13333333333</div>
                                </div>
                                <div class="detailInfos">
                                    <div class="left">业务员名称：</div>
                                    <div class="right">张三</div>
                                </div>
                                <div class="detailInfos">
                                    <div class="left">业务员电话：</div>
                                    <div class="right">13333333333</div>
                                </div>
                                <div class="detailInfos">
                                    <div class="left">配送日期：</div>
                                    <div class="right">2019-02-01</div>
                                </div>
                                <div class="detailInfos">
                                    <div class="left">货值（元）：</div>
                                    <div class="right">200</div>
                                </div>
                                <div class="detailInfos">
                                    <div class="left">体积（立方米）：</div>
                                    <div class="right">200</div>
                                </div>
                                <div class="detailInfos">
                                    <div class="left">载重（公斤）：</div>
                                    <div class="right">200</div>
                                </div>
                                <div class="detailInfos">
                                    <div class="left">品种数：</div>
                                    <div class="right">200</div>
                                </div>
                                <div class="detailInfos">
                                    <div class="left">备注：</div>
                                    <div class="right">快点备货，客户着急</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
        <div class="checkList">
            <div class="list">
                <div class="noArive">
                    <div class="listOuter" v-for="(item,index) in list" :key="index">
                        <div class="innerTile">
                            库位名称：{{item.ckmc}}
                        </div>
                        <div class="detailBox">
                            <div class="detailInfo" v-for="(ptem,pIndex) in item.childs" :key="pIndex">
                                <div class="mainTitle">
                                    <div class="infos">
                                        <div class="left">调度单号：</div>
                                        <div class="right">{{ptem.dddh}}</div>
                                    </div>
                                    <div class="infos">
                                        <div class="left">状态：</div>
                                        <div class="right state">{{ptem.bhzt}}</div>
                                    </div>
                                </div>
                                <div class="mainInfos"  @click="goDetail(jtem.dddh,jtem.ckbm,jtem.companyid)" v-for="(jtem,jIndex) in ptem.childs" :key="jIndex">
                                    <div class="detailInfos">
                                        <div class="left">客户名称：</div>
                                        <div class="right">{{jtem.khmc}}</div>
                                    </div>
                                    <div class="detailInfos">
                                        <div class="left">司机姓名：</div>
                                        <div class="right">{{jtem.sjxm}}</div>
                                    </div>
                                    <div class="detailInfos">
                                        <div class="left">司机电话：</div>
                                        <div class="right">{{jtem.sjdh}}</div>
                                    </div>
                                    <div class="detailInfos">
                                        <div class="left">业务员名称：</div>
                                        <div class="right">{{jtem.ywymc}}</div>
                                    </div>
                                    <div class="detailInfos">
                                        <div class="left">业务员电话：</div>
                                        <div class="right">{{jtem.ywydh}}</div>
                                    </div>
                                    <div class="detailInfos">
                                        <div class="left">配送日期：</div>
                                        <div class="right">{{jtem.psrq}}</div>
                                    </div>
                                    <div class="detailInfos">
                                        <div class="left">货值（元）：</div>
                                        <div class="right">{{jtem.hz}}</div>
                                    </div>
                                    <div class="detailInfos">
                                        <div class="left">体积（立方米）：</div>
                                        <div class="right">{{jtem.tj}}</div>
                                    </div>
                                    <div class="detailInfos">
                                        <div class="left">载重（公斤）：</div>
                                        <div class="right">{{jtem.zz}}</div>
                                    </div>
                                    <div class="detailInfos">
                                        <div class="left">品种数：</div>
                                        <div class="right">{{jtem.pzs}}</div>
                                    </div>
                                    <div class="detailInfos">
                                        <div class="left">备注：</div>
                                        <div class="right">{{jtem.bz}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                value-key="ckmc"
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
import { getKeeperHasReadyData,getKeepeStockData } from '@/api/index';
import { mapState ,mapGetters, mapMutations} from 'vuex';
export default {
    data(){
        return{
            customer:'',
            driver:'',
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
        this.getStockList();
    },
    activated() {/**  */
        if (!this.$route.meta.canKeep) {
            this.loading = true;
            this.hasMore = true;
            this.pageNum = 1;
            this.noData = false;
            this.list = [];
            this.getData();
        }
    },
    deactivated(){
        this.loading = true;
    },
    beforeRouteLeave(to, from, next){
        let position = document.getElementsByClassName('checkList')[0].scrollTop
        sessionStorage.setItem('kTopTwo',position);
        next()
    },
    beforeRouteEnter (to, from, next) {/**  */
        if(from.name == 'keeperHasReadyGoods'){
            to.meta.canKeep = true;
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.$nextTick(function(){
                    let position = sessionStorage.getItem('kTopTwo') //返回页面取出来
                    document.getElementsByClassName('checkList')[0].scrollTo({ 
                        top: position, 
                        behavior: "instant" 
                    });
                })
            })   
        }else{
            to.meta.canKeep = false;
            next();
        }
    },
    methods:{
        goDetail(id,code,companyId){
            this.$router.push({name:'keeperHasReadyGoods',query:{id:id,code:code,companyId:companyId}})
        },
        selState() {
            this.popupVisible = !this.popupVisible;
        },
        onValuesChange(picker, values) {
            if (!values.length || !values[0]) {
                return;
            }
            this.set_value = values[0].ckmc;
            this.setCode = values[0].ckbm;
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
        async getStockList(){
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
            let res = await getKeepeStockData(defaulParams);
            this.$set(this.slots[0],'values',res.data.list);
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
                startTime:this.start,
                endTime:this.end,
                khInfo:this.customer,
                sjInfo:this.driver,
                ckbm:this.selCode,
            };
            let res = await getKeeperHasReadyData({...defaulParams});
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
        .listOuter{
            .innerTile{
                height:110px;
                background:rgba(255,255,255,1);
                display: flex;
                align-items: center;
                font-size:28px;
                font-family:PingFangSC-Light;
                font-weight:300;
                color:rgba(211,63,63,1);
                line-height:40px;
                margin: 1px auto;
                padding-left: 87px;
                border-top: 1px solid #dfdfdf;
                border-bottom: 1px solid #dfdfdf;
            }
        }
        .noArive{
            background-color: #fff;
            &.hasReturn{
                .left{
                    width: 280px!important;
                }
            }
            .detailBox{
                padding: 23px 38px 36px;
            }
            .detailInfo{
                border-top: 1px solid #EBEBEB;
                border-left: 1px solid #EBEBEB;
                border-right: 1px solid #EBEBEB;
                margin-bottom: 10px;
                .mainInfos{
                    border-bottom: 20px solid #ebebeb;
                    &:last-child{
                        border: none;
                    }
                }
                .mainTitle{
                    border-bottom: 1px solid #EBEBEB;
                    .infos{
                        display: flex;
                        align-items: center;
                        padding: 10px 38px;
                        font-size:28px;
                        font-family:PingFangSC-Light;
                        font-weight:300;
                        color:rgba(102,102,102,1);
                        line-height:40px;
                        display: flex;
                        align-items: center;
                        font-weight:600;
                        .state{
                            font-size:28px;
                            font-family:PingFangSC-Semibold;
                            font-weight:600;
                            color:rgba(255,132,62,1);
                            line-height:40px;
                        }
                        .left{
                            width: 230px;
                            flex-shrink: 0;
                        }
                    }
                }
                .btnArea{
                    display: flex;
                    justify-content: flex-end;
                    padding: 36px 16px;
                }
                .ariveBtn{
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
                .detailInfos{
                    padding: 10px 38px;
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(102,102,102,1);
                    line-height:40px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #ebebeb;
                    &.title{
                        height: 85px;
                    }
                    &:last-child{
                        border-bottom:1px solid #ebebeb;
                    }
                    .left{
                        width: 230px;
                        flex-shrink: 0;
                    }

                }
            }
            .mainInfo{
                height: 160px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-left: 38px;
                border-top: 1px solid #dfdfdf;
                border-bottom: 1px solid #dfdfdf;
                .infos{
                    display: flex;
                    align-items: center;
                    .left{
                        width: 230px;
                        font-size:28px;
                        font-family:PingFangSC-Semibold;
                        font-weight:600;
                        color:rgba(102,102,102,1);
                        line-height:40px;
                    }
                    .right{
                        font-size:28px;
                        font-family:PingFangSC-Semibold;
                        font-weight:600;
                        color:rgba(102,102,102,1);
                        line-height:40px;
                    }
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
