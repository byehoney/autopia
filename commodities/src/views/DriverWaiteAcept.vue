<template>
    <div class="driverContainer">
        <div class="nav">
            <img @click="goBack" src="../images/arrow_left_white.png" class="leftIcon" alt="">
            <span class="title">{{title}}</span>
        </div>
        <div class="tabs">
            <div :class="['tabItem',actIndex==index?'active':'']" 
                v-for="(item,index) in tabs" 
                :key="index" 
                @click="changeTab(index)">
                {{item}}
            </div>
        </div>
        <div class="checkList"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
        >
            <div class="inputArea" v-if="actIndex==2||actIndex==3||actIndex==4">
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
                    <div class="left">调度单号：</div>
                    <div class="right">
                        <input type="text" v-model="orderNum" placeholder="请输入调度单号">    
                    </div>    
                </div>
                <div class="inputItem">
                    <div class="left">客户信息：</div>
                    <div class="right">
                        <input type="text" v-model="customer" placeholder="请输入客户信息">    
                    </div>    
                </div>
                <div class="btn" @click="doSearch">查询</div>
            </div>
            <!-- 待接单 和 待发货 -->
            <div class="waitAcept" v-if="actIndex==0||actIndex==1">
                <div class="waitBox" v-for="(item,index) in list" :key="index">
                    <div class="mainInfo">
                        <div class="infos">
                            <div class="left">调度单号：</div>
                            <div class="right">{{item.dddh}}</div>
                        </div>
                        <div class="infos">
                            <div class="left">运输线路：</div>
                            <div class="right">{{item.ysxl}}</div>
                        </div>
                    </div>
                    <div class="detailInfo">
                        <div class="detailInfos">
                            <div class="left">配送日期：</div>
                            <div class="right">{{item.psrq}}</div>
                        </div>
                        <div class="detailInfos">
                            <div class="left">货值（元）：</div>
                            <div class="right">{{item.hz}}</div>
                        </div>
                        <div class="detailInfos">
                            <div class="left">体积（立方米）：</div>
                            <div class="right">{{item.tj}}</div>
                        </div>
                        <div class="detailInfos">
                            <div class="left">载重（公斤）：</div>
                            <div class="right">{{item.zz}}</div>
                        </div>
                        <div class="detailInfos">
                            <div class="left">品种数：</div>
                            <div class="right">{{item.pzs}}</div>
                        </div>
                        <div class="detailInfos">
                            <div class="left">库位数：</div>
                            <div class="right">{{item.kws}}</div>
                        </div>
                        <div class="detailInfos">
                            <div class="left">运费（元）：</div>
                            <div class="right">{{item.yf}}</div>
                        </div>
                    </div>
                    <div class="btnArea" v-if="actIndex==0">
                        <div class="aceptBtn" @click="aceptOrder(item.dddh,index)">接单</div>
                        <div class="detailBtn" @click="goWaiteAceptDetail(item.dddh)">查看详情</div>
                    </div>
                    <div class="btnArea" v-if="actIndex==1">
                        <div class="aceptBtn" @click="doSendGoods(item.dddh,index)">送货</div>
                        <div class="detailBtn" @click="goWaiteSendDetail(item.dddh)">查看详情</div>
                    </div>
                </div>
            </div>
            <!-- 未送达 -->
            <div class="noArive" v-if="actIndex==2">
                <div class="noAriveBox" v-for="(item,index) in list" :key="index">
                    <div class="mainInfo">
                        <div class="infos">
                            <div class="left">调度单号：</div>
                            <div class="right">{{item.dddh}}</div>
                        </div>
                        <div class="infos">
                            <div class="left">运输线路：</div>
                            <div class="right">{{item.ysxl}}</div>
                        </div>
                    </div>
                    <div class="detailBox">
                        <div class="detailInfo" @click="goNoAriveDetail(ptem.dddh,ptem.companyid)" v-for="(ptem,pIndex) in item.childs" :key="pIndex">
                            <div class="detailInfos title">
                                <div class="left">客户：</div>
                                <div class="right">{{ptem.khmc}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">联系电话：</div>
                                <div class="right">{{ptem.lxdh}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">送货地址：</div>
                                <div class="right">{{ptem.address}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">配送日期：</div>
                                <div class="right">{{ptem.psrq}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">货值（元）：</div>
                                <div class="right">{{ptem.hz}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">体积（立方米）：</div>
                                <div class="right">{{ptem.tj}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">载重（公斤）：</div>
                                <div class="right">{{ptem.zz}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">品种数：</div>
                                <div class="right">{{ptem.pzs}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">库位数：</div>
                                <div class="right">{{ptem.kws}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">运费（元）：</div>
                                <div class="right">{{ptem.yf}}</div>
                            </div>
                            <div class="btnArea">
                                <div class="ariveBtn" @click="doArive($event,ptem.dddh,ptem.companyid,index,pIndex)">送达</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 已完成 -->
            <div class="noArive" v-if="actIndex==3">
                <div class="noAriveBox" v-for="(item,index) in list" :key="index">
                    <div class="mainInfo">
                        <div class="infos">
                            <div class="left">调度单号：</div>
                            <div class="right">{{item.dddh}}</div>
                        </div>
                        <div class="infos">
                            <div class="left">运输线路：</div>
                            <div class="right">{{item.ysxl}}</div>
                        </div>
                    </div>
                    <div class="detailBox">
                        <div class="detailInfo" @click="goFinishDetail(ptem.dddh)" v-for="(ptem,pIndex) in item.childs" :key="pIndex">
                            <div class="detailInfos">
                                <div class="left">配送日期：</div>
                                <div class="right">{{ptem.psrq}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">货值（元）：</div>
                                <div class="right">{{ptem.hz}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">体积（立方米）：</div>
                                <div class="right">{{ptem.tj}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">载重（公斤）：</div>
                                <div class="right">{{ptem.zz}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">品种数：</div>
                                <div class="right">{{ptem.pzs}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">库位数：</div>
                                <div class="right">{{ptem.kws}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">运费（元）：</div>
                                <div class="right">{{ptem.yf}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">拒收品种数：</div>
                                <div class="right">{{ptem.jspzs}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">拒收货值（元）：</div>
                                <div class="right">{{ptem.jshz}}</div>
                            </div>
                            <div class="btnArea">
                                <div class="ariveBtn">查看详情</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 已撤销 -->
            <div class="noArive hasReturn" v-if="actIndex==4">
                <div class="detailBox">
                    <div class="detailInfo" v-for="(item,index) in list" :key="index">
                        <div class="mainTitle">
                           <div class="infos">
                                <div class="left">调度单号：</div>
                                <div class="right">{{item.dddh}}</div>
                            </div>
                            <div class="infos">
                                <div class="left">运输线路：</div>
                                <div class="right">{{item.ysxl}}</div>
                            </div>
                        </div>
                        <div class="cancelBox"  @click="goRovokeDetail(ptem.dddh,ptem.companyid)" v-for="(ptem,pIndex) in item.childs" :key="pIndex">
                            <div class="detailInfos">
                                <div class="left">客户：</div>
                                <div class="right">{{ptem.khmc}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">配送日期：</div>
                                <div class="right">{{ptem.psrq}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">货值（元）：</div>
                                <div class="right">{{ptem.hz}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">体积（立方米）：</div>
                                <div class="right">{{ptem.tj}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">载重（公斤）：</div>
                                <div class="right">{{ptem.zz}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">品种数：</div>
                                <div class="right">{{ptem.pzs}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">库位数：</div>
                                <div class="right">{{ptem.kws}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">撤销日期：</div>
                                <div class="right">{{ptem.csrq}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">撤销货值（元）：</div>
                                <div class="right">{{ptem.cshz}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">撤销体积（立方米）：</div>
                                <div class="right">{{ptem.cxtj}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">撤销载重（公斤）：</div>
                                <div class="right">{{ptem.cxzz}}</div>
                            </div>
                            <div class="detailInfos">
                                <div class="left">撤销品种数：</div>
                                <div class="right">{{ptem.cxpzs}}</div>
                            </div>
                            <div class="btnArea">
                                <div class="ariveBtn">查看详情</div>
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
        <div class="mask" v-show="showTip">
            <div class="modal">
                <div class="top" v-if="sendOrArrive==0">您是否确认已完成装车并开始送货？</div>
                <div class="top" v-else>您是否确认客户已确认送达？</div>
                <div class="bottom">
                    <div class="left" @click="handleHideTip">取消</div>
                    <div class="right send" v-if="actIndex==1" @click="handleConfirmSend">确定</div>
                    <div class="right arive" v-if="actIndex==2" @click="handleConfirmArive">确定</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '../components/DriverTopNav';
import {getDriverStatusData,getDriverAceptClickData,getDriverSendClickData,getDriverAriveClickData} from '@/api/index';
import { mapState ,mapActions,mapGetters, mapMutations} from 'vuex';
import loadBMap from '@/utils/loadMap.js'
export default {
    data(){
        return{
            lng:'',
            lat:'',
            title:'待接单',
            tabs:['待接单','待发货','未送达','已完成','已撤销'],
            actIndex:0,//当前激活tab索引
            orderNum:'',//调度单号
            customer:'',//客户信息
            curSendIndex:'',//当前送货list 中操作index
            curSendOrder:'',//当前送货list中操作调度单号
            curAriveIndex:'',//当前操作送达list索引
            curAriveCIndex:'',//当前操作送达list childs 索引
            curAriveOrder:'',//当前操作送达调度单号
            curCompanyId:'',//当前操作送达公司id
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
            showTip:false,//是否显示弹窗
            sendOrArrive:0,//发货 0 还是 送达 1
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
        // TopNav
    },
    mounted() {
       
    },
    activated() {/**  */
        if (!this.$route.meta.canKeep) {
            this.initMap();
            this.loading = true;
            this.actIndex = this.$route.query.actIndex?this.$route.query.actIndex:0;
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
        sessionStorage.setItem('dTop',position);
        next()
    },
    beforeRouteEnter (to, from, next) {/**  */
        if(from.name == 'driverWaiteAceptDetail'||from.name == 'driverWaiteSendDetail'||from.name == 'driverFinishDetail'||from.name == 'driverRovokeDetail'||from.name == 'driverNoAriveDetail'){
            to.meta.canKeep = true;
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.$nextTick(function(){
                    let position = sessionStorage.getItem('dTop') //返回页面取出来
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
        initMap(){
            this.$nextTick(()=>{
                loadBMap()
                .then(() => {
                    var geolocation = new BMap.Geolocation();
                    let that = this;
                    geolocation.getCurrentPosition(function(r){
                        if(this.getStatus() == BMAP_STATUS_SUCCESS){
                            console.log('您的位置：'+r.point.lng+','+r.point.lat);
                            that.lng = r.point.lng;
                            that.lat = r.point.lat;
                            // alert('您的位置：'+r.point.lng+','+r.point.lat);
                        }
                        else {
                            // alert('failed'+this.getStatus());
                        }        
                    });
                })
                .catch(err => {
                    console.log('地图加载失败')
                })
            })
            
        },
        goWaiteAceptDetail(id){
            this.$router.push({name:'driverWaiteAceptDetail',query:{id:id}});
        },
        goWaiteSendDetail(id){
            this.$router.push({name:'driverWaiteSendDetail',query:{id:id}});
        },
        goNoAriveDetail(id,companyId){
            this.$router.push({name:'driverNoAriveDetail',query:{id:id,companyId:companyId}});
        },
        goFinishDetail(id){
            this.$router.push({name:'driverFinishDetail',query:{id:id}});
        },
        goRovokeDetail(id,companyId){
            this.$router.push({name:'driverRovokeDetail',query:{id:id,companyId:companyId}});
        },
        async aceptOrder(id,index){//点击接单按钮
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
            let res = await getDriverAceptClickData({...defaulParams,dddh:id});
            if(res.code==0){
                Toast({
                    message: res.msg,
                    position: "middle",
                    duration: 2000
                });
                setTimeout(()=>{
                    this.list.splice(index,1);
                    this.list = this.list;
                },2100)
            }else{
                Toast({
                    message: res.msg,
                    position: "middle",
                    duration: 2000
                });
            }
        },
        doSendGoods(id,index){//点击送货按钮
            this.showTip = true;
            this.sendOrArrive = 0;
            this.curSendIndex = index;
            this.curSendOrder = id;
        },
        doArive(e,id,companyId,index,pIndex){//点击送达按钮
            e.stopPropagation();
            this.showTip = true;
            this.sendOrArrive = 1;
            this.curAriveOrder = id;
            this.curCompanyId = companyId;
            this.curAriveIndex = index;
            this.curAriveCIndex = pIndex;
        },
        async handleConfirmSend(){//点击发货确定按钮
            this.showTip = false;
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
                jd:this.lng,
                wd:this.lat
            };
            let res = await getDriverSendClickData({...defaulParams,dddh:this.curSendOrder});
            if(res.code==0){
                Toast({
                    message: res.msg,
                    position: "middle",
                    duration: 2000
                });
                setTimeout(()=>{
                    this.list.splice(this.curSendIndex,1);
                    this.list = this.list;
                },2100)
            }else{
                Toast({
                    message: res.msg,
                    position: "middle",
                    duration: 2000
                });
            }
        },
        async handleConfirmArive(){
            this.showTip = false;
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
                jd:this.lng,
                wd:this.lat
            };
            let res = await getDriverAriveClickData({
                ...defaulParams,
                dddh:this.curAriveOrder,
                ywCompanyId:this.curCompanyId
            })
            if(res.code==0){
                Toast({
                    message: res.msg,
                    position: "middle",
                    duration: 2000
                });
                this.list[this.curAriveIndex].childs.splice(this.curAriveIndex,1);
                if(!this.list[this.curAriveIndex].childs.length){
                    this.list.splice(this.curAriveIndex,1);
                }
                this.list = this.list;
            }else{
                Toast({
                    message: res.msg,
                    position: "middle",
                    duration: 2000
                });
            }
        },
        handleHideTip(){
            this.showTip = false;
        },
        doSearch(){//查询按钮
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
        changeTab(index){
            if(this.moreLoading){
                return;
            }
            this.actIndex = index;
            this.title = this.tabs[index];
            this.loading = true;
            this.hasMore = true;
            this.pageNum = 1;
            this.noData = false;
            this.list = [];
            this.getData();
        },
        goBack(){
            this.$router.go(-1);
        },
        selState() {
            this.popupVisible = !this.popupVisible;
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
        async getData(){
            let res ;
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
                type:parseInt(this.actIndex)+1
            };
            let uniqueParams = {
                startTime:this.start,
                endTime:this.end,
                orderId:this.orderNum,
                khInfo:this.customer
            }
            if(this.actIndex>1){
                res = await getDriverStatusData({...defaulParams,...uniqueParams});
            }else{
                res = await getDriverStatusData(defaulParams);
            }
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
            if(this.moreLoading||!this.hasMore||this.actIndex==4){
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
        .checkList{
            padding-top: 110px;
        }
        .mask{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background:rgba(0,0,0,0.5);
            z-index: 1000;
            .modal{
                width:600px;
                height:350px;
                background-color: #fff;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -175px;
                margin-left: -300px;
                .top{
                    height: 270px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size:30px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(51,51,51,1);
                    line-height:42px;
                }
                .bottom{
                    height: 80px;
                    display: flex;
                    justify-content: space-between;
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(255,255,255,1);
                    line-height:80px;
                    .left{
                        background-color: #BEBEBE;
                        width: 50%;
                        text-align: center;
                    }
                    .right{
                        background-color: #D33F3F;
                        width: 50%;
                        text-align: center;
                    }
                }
            }
        }
        .noArive{
            
            &.hasReturn{
                .detailInfo{
                    border-bottom: none;
                }
                .left{
                    width: 280px!important;
                }
                // .cancelBox{
                //     border-bottom: 1px solid #EBEBEB;
                //     margin-bottom: 10px;
                // }
            }
            .detailBox{
                padding: 23px 38px 36px;
                margin-bottom: 6px;
                background-color: #fff;
            }
            .detailInfo{
                border: 1px solid #EBEBEB;
                margin-bottom: 10px;
                .mainTitle{
                    border-bottom: 1px solid #EBEBEB;
                    background-color: #fff;
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
                    border-bottom: 1px solid #ebebeb;
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
                background-color: #fff;
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
        .waitAcept{
            
            .waitBox{
                margin-bottom: 6px;
                background-color: #fff;
            }
            .btnArea{
                height: 152px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 38px;
                .aceptBtn,.detailBtn{
                    width:200px;
                    height:80px;
                    background:rgba(247,181,0,1);
                    border-radius:10px;
                    font-size:28px;
                    font-family:PingFangSC-Light;
                    font-weight:300;
                    color:rgba(255,255,255,1);
                    line-height:80px;
                    text-align: center;
                    margin-left: 20px;
                }
                .detailBtn{
                    background-color: #D33F3F;
                }
            }
            .detailInfo{
                .detailInfos{
                    display: flex;
                    align-items: center;
                    height: 50px;
                    border-bottom: 1px solid #dfdfdf;
                    padding-left: 38px;
                    .left{
                        width: 230px;
                        font-size:28px;
                        font-family:PingFangSC-Light;
                        font-weight:300;
                        color:rgba(102,102,102,1);
                        line-height:40px;
                    }
                    .right{
                        font-size:28px;
                        font-family:PingFangSC-Light;
                        font-weight:300;
                        color:rgba(102,102,102,1);
                        line-height:40px;
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
        .tabs{
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 110px;
            background-color: #fff;
            margin-bottom: 6px;
            position: fixed;
            top: 88px;
            left: 0;
            width: 100%;
            .tabItem{
                font-size:28px;
                font-family:PingFangSC-Light;
                font-weight:300;
                color:rgba(153,153,153,1);
                &.active{
                    color: #E32323;
                }
            }
        }
    }
    .nav{
        width: 100%;
        height: 88px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #D33F3F;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        .leftIcon{
            width: 17px;
            height: 30px;
            position: absolute;
            top: 29px;
            left: 30px;
        }
        .title{
            font-size: 30px;
            color: #fff;
        }
    }
    .inputArea{
        background-color: #fff;
        padding: 21px 0 56px;
        margin-bottom: 6px;
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
</style>
