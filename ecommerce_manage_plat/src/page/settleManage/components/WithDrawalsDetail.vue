<template>
    <div>
        <el-dialog
            title="提现详情"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="提现单号：">
                    <span>{{statement_no}}</span>
                </el-form-item>
                <el-form-item label="申请时间：">
                    <span>{{application_time}}</span>
                </el-form-item>
                <el-form-item label="手机号：">
                    <span>{{mobile}}</span>
                </el-form-item>
                <el-form-item label="昵称：">
                    <span>{{nickname}}</span>
                </el-form-item>
                <el-form-item label="放款时间：" v-if="status==2">
                    <span>{{lending_at}}</span>
                </el-form-item>
                <el-form-item label="申请时间：" v-if="status==3">
                    <span>{{update_at}}</span>
                </el-form-item>
                <el-form-item label="状态：">
                    <span>{{status_str}}</span>
                </el-form-item>
                <el-form-item label="发放金额：">
                    <span>{{cashout_money}}</span>
                </el-form-item>
                <el-form-item label="驳回理由：" v-if="status==3">
                    <span>{{reject}}</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible=false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { withDrawDetail } from '../../../api/getData'
export default {
    data(){
        return {
            dialogVisible:false,
            is_refuse:false,//是否是驳回
            statement_no:'',
            application_time:'',
            mobile:'',
            nickname:'',
            lending_at:'',
            status_str:'',
            cashout_money:'',
            reject:'',
            status:'',
            update_at:'',
            form:{
                payType:'0',
                acount:'',
                name:'',
                bank:'',
                money:'',
                orderNum:'',
                note:''
            }
        }
    },
    methods: {
        handleClose(){
            this.dialogVisible = false;
        },
        async showDetail(row){
            this.dialogVisible = true;
            let res = await withDrawDetail({id:row.id});
            if(res.code == 0){
                this.statement_no = res.data.statement_no;
                this.application_time = res.data.application_time;
                this.mobile = res.data.mobile;
                this.nickname = res.data.nickname;
                this.lending_at = res.data.lending_at;
                this.reject = res.data.reject;
                this.status_str = res.data.status_str;
                this.cashout_money = res.data.cashout_money;
                this.status = res.data.status;
                this.update_at = res.data.updated_at;
            }
        },
        
    },
}
</script>
<style lang="scss">
    
</style>