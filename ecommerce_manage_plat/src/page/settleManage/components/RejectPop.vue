<template>
    <div>
        <el-dialog
            title="驳回申请"
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
                <el-form-item label="提现金额：">
                    <span>{{cashout_money}}</span>
                </el-form-item>
                <el-form-item label="驳回理由：">
                    <el-input type="textarea" v-model="form.reason" placeholder="不超过100个字" maxlength="100"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doSend">确定驳回</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { withDrawDetail ,withDrawExamine} from '../../../api/getData'
export default {
    data(){
        return {
            dialogVisible:false,
            statement_no:'',
            application_time:'',
            mobile:'',
            nickname:'',
            lending_at:'',
            status_str:'',
            cashout_money:'',
            reject:'',
            status:'',
            curId:'',
            form:{
                acount:'',
                name:'',
                bank:'',
                money:'',
                orderNum:'',
                reason:''
            }
        }
    },
    methods: {
        handleClose(){
            this.dialogVisible = false;
            this.form = {
                payType: '0',
                acount: '',
                name: '',
                bank: '',
                money: '',
                orderNum: '',
                reason :''
            }
        },
        async showDetail(row){
            this.dialogVisible = true;
            this.curId = row.id;
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
            }
        },
        async doSend(){
            if(!this.form.reason){
                this.$message.error('请输入驳回理由');
                return;
            }
            let res = await withDrawExamine({id:this.curId,status:3,remark:this.form.reason});
            if(res.code == 0){
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.dialogVisible = false;
                this.$parent.getData();
            }else{
                this.$message.error(res.message);
            }
        }
    },
}
</script>
<style lang="scss">
    
</style>