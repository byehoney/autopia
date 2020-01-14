<template>
    <div class="content">
        <el-row class="mb2">用户数据</el-row>
        <el-row class="mb2">
            <el-col>
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    :editable="false"
                    v-model="curDate"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
                <el-button type="primary" @click="deSearch">查询</el-button>
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="2">当日新增用户：</el-col>
            <el-col :span="10">{{todayUser}}</el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="2">累计用户：</el-col>
            <el-col :span="10">{{totalUser}}</el-col>
        </el-row>
    </div>
</template>
<script>
import { userData } from '../../api/getData.js'
export default {
  data() {
    return {
        curDate:'',
        todayUser:0,
        totalUser:0
    };
  },
  computed: {
    getNowTime() {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日期
        month = month + 1;
        month = month>9?month:'0'+month;
        date = date>9?date:'0'+date;
        var defaultDate = `${year}-${month}-${date}`;
        return defaultDate;
    },
  },
  mounted() {
    this.curDate = this.getNowTime;
    this.getUserData();
  },
  methods: {
    deSearch(){
        this.getUserData();
    },
    async getUserData(){
        let res = await userData({date:this.curDate});
        if(res.code==0){
            this.todayUser = res.data.user_day;
            this.totalUser = res.data.user_total;
        }
    }
  }

};
</script>
<style lang="scss" scoped>
    .content .mb2{
        margin-bottom: 20px;
    }
</style>
