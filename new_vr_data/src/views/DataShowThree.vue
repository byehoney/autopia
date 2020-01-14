<template>
    <div class="container">
        <div class="main fl">
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
            <div class="bottom">
                <div class="tableBox">
                    <div class="tableHeader">
                        <div class="headerOuter  fl">
                            <div class="headerCol">公众号</div>
                        </div>
                        <div class="headerOuter fl">
                            <div class="headerCol">日期</div>
                        </div>
                        <div class="headerOuter fl">
                            <div class="headerCol topcol">
                                <div class="htop">图文总阅读</div>
                            </div>
                            <div class="hbottom">
                                <div class="pNum fl">人数</div>
                                <div class="line"></div>
                                <div class="tNum fl">次数</div>
                            </div>
                        </div>
                        <div class="headerOuter fl">
                            <div class="headerCol topcol">
                                <div class="htop">公众号会话阅读</div>
                            </div>
                            <div class="hbottom">
                                <div class="pNum fl">人数</div>
                                <div class="line"></div>
                                <div class="tNum fl">次数</div>
                            </div>
                        </div>
                        <div class="headerOuter fl">
                            <div class="headerCol topcol">
                                <div class="htop">朋友圈阅读</div>
                            </div>
                            <div class="hbottom">
                                <div class="pNum fl">人数</div>
                                <div class="line"></div>
                                <div class="tNum fl">次数</div>
                            </div>
                        </div>
                        <div class="headerOuter fl">
                            <div class="headerCol topcol">
                                <div class="htop">分享转发</div>
                            </div>
                            <div class="hbottom">
                                <div class="pNum fl">人数</div>
                                <div class="line"></div>
                                <div class="tNum fl">次数</div>
                            </div>
                        </div>
                        <div class="headerOuter noR fl">
                            <div class="headerCol topcol">
                                <div class="htop">微信收藏</div>
                            </div>
                            <div class="hbottom">
                                <div class="pNum fl">人数</div>
                                <div class="line"></div>
                                <div class="tNum fl">次数</div>
                            </div>
                        </div>
                    </div>
                    <ul class="tableBody">
                        <li class="bodyItem" v-for="(item,index) in tableData" :key="index">
                            <div class="bodyCol fl">{{targetName}}</div>
                            <div class="bodyCol fl">{{item.refDate}}</div>
                            <div class="bodyCol fl">
                                <div class="colLeft fl">{{item.intPageReadTotalUserVirtual}}</div>
                                <div class="colRight noR fl">{{item.intPageReadTotalCountVirtual}}</div>
                            </div>
                            <div class="bodyCol fl">
                                <div class="colLeft fl">{{item.intPageReadUserVirtual}}</div>
                                <div class="colRight noR fl">{{item.intPageReadCountVirtual}}</div>
                            </div>
                            <div class="bodyCol fl">
                                <div class="colLeft fl">{{item.intPageFromFeedReadUserVirtual}}</div>
                                <div class="colRight noR fl">{{item.intPageFromFeedReadCountVirtual}}</div>
                            </div>
                            <div class="bodyCol fl">
                                <div class="colLeft fl">{{item.shareUserVirtual}}</div>
                                <div class="colRight noR fl">{{item.shareCountVirtual}}</div>
                            </div>
                            <div class="bodyCol noR fl">
                                <div class="colLeft fl">{{item.addToFavUserVirtual}}</div>
                                <div class="colRight noR fl">{{item.addToFavCountVirtual}}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <ul class="pagi">
                <li class="prev" @click="prev"></li>
                <li class="pageno"><input v-model="pageno" class="page-input" @change="topage" min="1" type="number"/></li>
                <li class="next" @click="next"></li>
            </ul>
        </div>
    </div>
</template>
<script>
import LeftBar from '../components/Left'
import { getDataShowThree } from '@/api/index'
var echarts = require('echarts');
export default {
    data(){
        return{
            startDatePicker:this.beginDate(),
            endDatePicker:this.processDate(),
            targetType:'',
            targetName:'',
            isLoading:false,
            pageno: 1,
            total: 1,
            rotateS:false,
            rotateE:false,
            start:'',
            end:'',
            tableData:[1,2,3,4,5,6,7,8,9]
        }
    },
    created(){
        // console.log(this.$router.history.current.params)
    },
    mounted(){
        document.getElementById("left").style.height = '589px';
        document.getElementById("tabs").style.height = '589px';
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
            let res = await getDataShowThree({currentPage:this.pageno,targetType:this.targetType,startDate:this.start,endDate:this.end});
            this.tableData = res.articleDataList;
            this.total = Math.ceil(res.totalSize/9);
            this.isLoading = false;
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
        async goSearch(){
            if(!this.start||!this.end){
                return;
            }
            this.pageno = 1;
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
    .container{
        overflow: hidden;
    }
    .main{
        width: 820px;
    }
    .fl{
        float: left;
    }
    .fr{
        float: right;
    }
    .top{
        overflow: hidden;
    }
    .mt{
        margin-top: 20px;
    }
    .bottom{
        width: 818px;
        height: 465px;
        /* margin-top: 52px; */
        /* margin-bottom: 126px; */
    }
    .tableBox{
        overflow: hidden;
        padding: 16px 30px 0 30px;
        /* background: rgba(0,255,161,0.05); */
    }
    .tableHeader,.hbottom{
        overflow: hidden;
    } 
    .hbottom{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .tableHeader .headerOuter{
        width: 106px;
        text-align: center;
        overflow: hidden;
    }
    .tableHeader{
        background-color: #F9F9F9;
    }
    .tableHeader .headerOuter.noR,.bodyCol.noR{
        margin-right: 0;
    }
    .headerCol .htop,.headerOuter .hbottom, .headerOuter .headerCol.topcol{
        height: 25px;
        line-height: 25px;
    }
    .tableHeader .headerCol{
        width: 100%;
        height: 50px;
        background: #F9F9F9;
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #525252;
        text-align: center;
        /* font-weight: lighter; */
        line-height: 50px;
    }
    .hbottom .pNum,.hbottom .tNum{
        /* width: 75px; */
        height: 25px;
        background: #F9F9F9;
        /* margin-top: 4px; */
        line-height: 25px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #525252;
        letter-spacing: 1.33px;
        text-align: center;
        /* font-weight: lighter; */
    }
    .hbottom .line{
        width: 1px ;
        height: 12px;
        background-color: #cacaca;
        margin: 0 9px;
    }
    .hbottom .pNum{
        /* margin-right: 7px; */
        /* border-right: 1px solid #CACACA; */
    }
    .bodyItem{
        overflow: hidden;
        border-bottom: 1px solid #e8e8e8;
    }
    .bodyItem：hover{
        background-color: #3089dc;
    }
    .bodyItem:last-child{
        /* border: none; */
    }
    .bodyCol{
        width: 106px;
        /* margin-right: 12px; */
        text-align: center;
        overflow: hidden;
        font-family: PingFangSC-Regular;
        font-size: 10px;
        color: #4D4D4D;

        /* font-weight: lighter; */
        padding: 12px 0;
    }
    .bodyCol .colLeft,.bodyCol .colRight{
        text-align: center;
        width: 53px;
    }
    .pagi {
        float: right;
        margin-bottom: 28px;
        margin-right: 30px;
    }
    .pagi li{
        display: inline-block;
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
