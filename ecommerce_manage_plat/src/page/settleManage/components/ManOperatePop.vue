<template>
    <div>
        <el-dialog
            title="人工发放登记"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="提现单号：">
                    <span></span>
                </el-form-item>
                <el-form-item label="申请时间：">
                    <span></span>
                </el-form-item>
                <el-form-item label="手机号：">
                    <span></span>
                </el-form-item>
                <el-form-item label="昵称：">
                    <span></span>
                </el-form-item>
                <el-form-item label="发放方式：">
                    <el-radio-group v-model="form.payType" size="small">
                        <el-radio-button label="0">微信支付</el-radio-button>
                        <el-radio-button label="1">支付宝</el-radio-button>
                        <el-radio-button label="2">银行转账</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="收款账号：">
                    <el-input v-model="form.acount"></el-input>
                </el-form-item>
                <el-form-item label="账户名：">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="开户行：">
                    <el-input v-model="form.bank"></el-input>
                </el-form-item>
                <el-form-item label="发放金额：">
                    <el-input-number v-model="form.money" :controls="false" :precision="2"  placeholder="请输入发放金额"></el-input-number>
                </el-form-item>
                <el-form-item label="付款单号：">
                    <el-input v-model="form.orderNum"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="form.note"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doSend">完成发放</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            dialogVisible:false,
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
            this.form = {
                payType: '0',
                acount: '',
                name: '',
                bank: '',
                money: '',
                orderNum: '',
                note :''
            }
        },
        doSend(){

        }
    },
}
</script>
<style lang="scss">
    
</style>