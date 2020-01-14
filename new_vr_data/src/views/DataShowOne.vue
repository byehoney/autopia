<template>
    <div class="container fr">
        <div>
            <div class="top">
                <!-- <div class="type fl">
                    <el-select v-model="value" placeholder="请选择分析类别">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div> -->
                <div :class="['start fl',rotateS?'isReverse':'']" style="margin-left:27px">
                    <el-date-picker
                        v-model="start"
                        type="date"
                        :editable="false"
                        :clearable="false"
                        @focus="rotate(0)"
                        @blur="cRotate(0)"
                        :picker-options="startDatePicker"
                        placeholder="开始日期">
                    </el-date-picker>
                </div>
                <div class="divide fl"></div>
                <div :class="['end fl',rotateE?'isReverse':'']">
                    <el-date-picker
                        v-model="end"
                        type="date"
                        :editable="false"
                        :clearable="false"
                        @focus="rotate(1)"
                        @blur="cRotate(1)"
                        :picker-options="endDatePicker"
                        placeholder="结束日期">
                    </el-date-picker>
                </div>
                <div class="cx_btn fl" @click="goSearch">查询</div>
            </div>
        </div>
        <div class="table-wrapper">
            <ul class="tHead">
                <li class="th col1">公众号</li>
                <li class="th col2">日期</li>
                <li class="th col3">新增用户数</li>
                <li class="th col4">取关用户数</li>
                <li class="th col5">净增用户数</li>
                <li class="th col6">总用户数</li>
                <li class="th col6">常读人数</li>
            </ul>
            <ul class="tr" v-for="(item,index) in dataSource" :key="index">
                <li class="td">{{targetName}}</li>
                <li class="td">{{item.refDate}}</li>
                <li class="td">{{item.newUserVirtual}}</li>
                <li class="td">{{item.cancelUserVirtual}}</li>
                <li class="td">{{item.increaseUserVirtual}}</li>
                <li class="td">{{item.cumulateUserVirtual}}</li>
                <li class="td">{{item.articleReadUserVirtual}}</li>
            </ul>
        </div>
        <ul class="pagi">
            <li class="prev" @click="prev"></li>
            <li class="pageno"><input v-model="pageno" class="page-input" @change="topage" min="1" type="number"/></li>
            <li class="next" @click="next"></li>
        </ul>
    </div>
</template>
<script>
import { getDataShowOne } from '@/api/index'
import LeftBar from '../components/Left'
import {mapState} from 'vuex'
export default {
    data(){
        return{
            startDatePicker:this.beginDate(),
            endDatePicker:this.processDate(),
            targetType:'',
            targetName:'',
            pageno: 1,
            total: 1,
            isLoading: false,
            rotateS:false,
            rotateE:false,
            start:'',
            end:'',
            dataSource:[]
        }
    },
    components:{
    },
    watch: {
        $route: {
            handler: function(val, oldVal){
                console.log(val);
            },
            // 深度观察监听
            deep: true
        }
    },
    created(){
        // console.log(this.$router.history.current.params)
    },
    async mounted(){
        document.getElementById("left").style.height = '633px';
        document.getElementById("tabs").style.height = '633px';
        let type = sessionStorage.getItem('curIndex');
        if(type==1){
            this.targetType = 202;
            this.targetName = '微路况'
        }else if(type==3){
            this.targetType = 203
            this.targetName = '查违章'
        }else if(type==4){
            this.targetType = 201
            this.targetName = '微信生态'
        }
        this.getData();
    },
    methods:{
        rotate(index){
            if(index==0){
                this.rotateS=true;
            }else{
                this.rotateE=true;
            }
        },
        cRotate(index){
            if(index==0){
                this.rotateS=false;
            }else{
                this.rotateE=false;
            }
        },
        async getData() {
            if(this.isLoading) return;
            this.isLoading = true;
            let res = await getDataShowOne({currentPage:this.pageno,targetType:this.targetType,startDate:this.start,endDate:this.end});
            this.dataSource = res.userDataList;
            this.total = Math.ceil(res.totalSize/10);
            this.isLoading = false;
        },
        async goSearch(){
            if(!this.start||!this.end){
                return;
            }
            this.pageno = 1;
            this.getData();
        },
        prev() {
            let pageno = parseInt(this.pageno) - 1;
            if(pageno < 1) {
                this.pageno = 1;
                return;
            }

            this.pageno = pageno;
            this.getData();
        },
        next() {
            let pageno = parseInt(this.pageno) + 1;
            if(pageno > this.total) {
                this.pageno = this.total;
                return;
            }
            this.pageno = pageno;
            this.getData();
           
        },
        topage() {
            let pageno = parseInt(this.pageno);
            if(pageno > this.total) {
                this.pageno = this.total;
            }
            if(pageno < 1) {
                this.pageno = 1;
            }
            this.getData();
        },
        beginDate(){
            let self = this
            return {
                disabledDate(time){
                    if(self.end){
                        return new Date(self.end).getTime() < time.getTime() || time.getTime() > Date.now()
                    }else{
                        return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                    }
                }
            }
        },
        //提出结束时间必须大于提出开始时间
        processDate(){
            let self = this
            return {
                disabledDate(time){
                    if(self.start){
                        return new Date(self.start).getTime() > time.getTime() || time.getTime() > Date.now()
                    }else{
                        return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                    }
                }
            }
        }
    }
}
</script>
<style scoped>
    .table-wrapper .tHead{
        width: 760px;
        background: #F9F9F9;
    }
    li {
        list-style: none;
        display: inline-block;
    }
   .container{
        width: 820px;
        margin:0 auto;
        float: left;
        background-color: #fff;
        /* margin-left: 90px; */
    }
    .search-btn {
        background: #00FFA1;
        border-radius: 8px;
        width: 100px;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: #1A1A1A;
        letter-spacing: 2px;
        /* font-weight: lighter; */
        text-align: center;
    }
    .table-wrapper {
        width: 818px;
        /* background: rgba(0,255,161,0.05); */
        /* margin-top: 16px; */
        padding: 20px 30px 0 30px;
        box-sizing: border-box;
    }
    .th {
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #525252;
        font-weight: bold;
        text-align: left;
        height: 50px;
        line-height: 50px;
        width: 100px;
        margin-right: 10px;
        /* font-weight: lighter; */
    }
    .th:last-child {
        margin: 0;
    }
    .tr {
        border-bottom: 1px solid #e8e8e8;
        height: 40px;
        line-height: 40px;
        width: 758px;
    }
    .tr:last-child {
        border-bottom: none;
    }
    .td {
        width: 100px;
        margin-right: 9px;
        font-size: 10px;
        color: #4d4d4d;
        /* font-weight: lighter; */
        text-align: left;
    }
    .td:last-child {
        margin: 0;
    }
    .pagi {
        margin-top: 20px;
        float: right;
        margin-bottom: 38px;
        margin-right: 30px;
    }
    .pageno {
        vertical-align: top;
    }
    .page-input {
        background: #e8e8e8;
        width: 75px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        font-size: 14px;
        color: #555;
        /* font-weight: bold; */
        border: none;
        vertical-align: top;
        border: none;
        outline: none;
    }
    .prev, .next {
        width: 22px;
        height: 38px;
        cursor: pointer;
    }
    .prev {
        background: url(../images/pagi-prev-active.png) no-repeat center left;
    }
    .prev.disable {
        background-image: url(../images/pagi-prev.png);
    }
    .next {
        background: url(../images/pagi-next-active.png) no-repeat center right;
    }
    .next.disable {
        background: url(../images/pagi-next.png);
    }
    input[type=number] {
        -moz-appearance:textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
