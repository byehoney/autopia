<template>
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="数据时间" label-width="120px">
                <el-date-picker 
                    v-model="form.time" 
                    type="datetimerange" 
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="doReset">重置</el-button>
                <el-button type="primary" @click="doSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <el-row class="mt5">数据统计（{{form.time[0]|switchTimeFormat}} - {{form.time[1]|switchTimeFormat}}）</el-row>
        <el-row class="mt2" style="color:#606266">
            <el-col :span="6" class="pd2 bg-purple">订单数据</el-col>
            <el-col :span="6" class="pd2 bg-purple">收入数据</el-col>
            <el-col :span="6" class="pd2 bg-purple">用户数据</el-col>
            <el-col :span="6" class="pd2 bg-purple">会员数据</el-col>
            <el-col :span="6" class="pd2 bg-purple-light">订单数：{{order_count}}</el-col>
            <el-col :span="6" class="pd2 bg-purple-light">订单金额：{{order_money}}元</el-col>
            <el-col :span="6" class="pd2 bg-purple-light">新增用户：{{new_user_count}}</el-col>
            <el-col :span="6" class="pd2 bg-purple-light">新增会员：{{new_vip_count}}</el-col>
            <el-col :span="6" class="pd2 bg-purple-light mtm5">已付款订单数：{{pay_order_count}}</el-col>
            <el-col :span="6" class="pd2 bg-purple-light mtm5">已付款金额：{{pay_order_money}}元</el-col>
            <el-col :span="6" class="pd2 bg-purple-light mtm5">&nbsp;</el-col>
            <el-col :span="6" class="pd2 bg-purple-light mtm5">&nbsp;</el-col>
            <el-col :span="6" class="pd2 bg-purple mtm50 tc">历史总订单数</el-col>
            <el-col :span="6" class="pd2 bg-purple mtm50 tc">历史总收入</el-col>
            <el-col :span="6" class="pd2 bg-purple mtm50 tc">用户总数</el-col>
            <el-col :span="6" class="pd2 bg-purple mtm50 tc">会员总数</el-col>
            <el-col :span="6" class="pd2 bg-purple-light tc">{{total_order_count}}</el-col>
            <el-col :span="6" class="pd2 bg-purple-light tc">{{pay_order_total_money}}元</el-col>
            <el-col :span="6" class="pd2 bg-purple-light tc">{{user_total_count}}</el-col>
            <el-col :span="6" class="pd2 bg-purple-light tc">{{vip_total_count}}</el-col>
        </el-row>
    </div>
</template>
<script>
import { dashboard } from '../../api/getData'
export default {
    data(){
        return{
            form:{
                time:''
            },
            order_count:0,
            pay_order_count:0,
            total_order_count:0,
            order_money:0,
            pay_order_money:0,
            pay_order_total_money:0,
            new_user_count:0,
            user_total_count:0,
            new_vip_count:0,
            vip_total_count:0
        }
    },
    mounted(){
        this.form.time = [new Date(new Date(new Date().toLocaleDateString()).getTime()),new Date(new Date(this.formatTime()).getTime())];
        this.getData();
    },
    filters:{
        switchTimeFormat (time) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getMonth()+1<=9?'0'+(date.getMonth()+1):date.getMonth()+1;
            var day = date.getDate()<=9?'0'+date.getDate():date.getDate();
            var hour = date.getHours()<=9?'0'+date.getHours():date.getHours();
            var minute = date.getMinutes()<=9?'0'+date.getMinutes():date.getMinutes();
            return year+ '.'+ month + '.' + day + ' ' + hour + ':' + minute 
        },
    },
    methods:{
        doReset(){
            this.form.time = [new Date(new Date(new Date().toLocaleDateString()).getTime()),new Date(new Date(this.formatTime()).getTime())];
            this.getData();
        },
        doSearch(){
            this.getData();
        },
        async getData(){
            let res = await dashboard({start_at:this.switchTimeFormat(this.form.time[0]),end_at:this.switchTimeFormat(this.form.time[1])});
            if(res.code == 0){
                this.order_count = res.data.order.order_count;
                this.pay_order_count = res.data.order.pay_order_count;
                this.total_order_count = res.data.order.total_order_count;
                this.order_money = res.data.income.order_money;
                this.pay_order_money = res.data.income.pay_order_money;
                this.pay_order_total_money = res.data.income.pay_order_total_money;
                this.new_user_count = res.data.user.new_user_count;
                this.user_total_count = res.data.user.user_total_count;
                this.new_vip_count = res.data.vip.new_vip_count;
                this.vip_total_count = res.data.vip.vip_total_count;
            }else{
                this.$message.error(res.message);
            }
        },
        formatTime(){
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1<=9?'0'+(date.getMonth()+1):date.getMonth()+1;
            var day = date.getDate()<=9?'0'+date.getDate():date.getDate();
            var hour = date.getHours()<=9?'0'+date.getHours():date.getHours();
            var minute = date.getMinutes()<=9?'0'+date.getMinutes():date.getMinutes();
            return year+ '-'+ month + '-' + day + ' ' + hour + ':' + minute 
        },
        switchTimeFormat (time) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getMonth()+1<=9?'0'+(date.getMonth()+1):date.getMonth()+1;
            var day = date.getDate()<=9?'0'+date.getDate():date.getDate();
            var hour = date.getHours()<=9?'0'+date.getHours():date.getHours();
            var minute = date.getMinutes()<=9?'0'+date.getMinutes():date.getMinutes();
            return year+ '.'+ month + '.' + day + ' ' + hour + ':' + minute 
        },
    }
}
</script>
<style lang="scss" scoped>
    .tc{
        text-align: center;
    }
    .pd2{
        padding:20px 0;
    }
    .mt2{
        margin-top: 20px;
    }
    .mtm5{
        margin-top: 1px;
    }
    .mtm50{
        margin-top: 5px;
    }
    .mt5{
        margin-top: 50px;
        color: #606266;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
</style>