<template>
    <div>
        <el-row>账户信息：<el-button v-if="hasInfo" type="primary" @click="doModify">修改</el-button></el-row>
        <div class="vFlex">
            <el-row class="mt2">
                <el-radio-group v-model="radio" :disabled="hasInfo">
                    <el-radio :label="1">公司</el-radio>
                    <el-radio :label="0">个人</el-radio>
                </el-radio-group>
            </el-row>
            <el-form class="mt2" ref="form" :rules="rules" :model="form" label-width="120px">
                <el-form-item label="账户名：" prop="name">
                    <el-input style="width:300px" :disabled="hasInfo" v-model="form.name" placeholder="请输入账户名"></el-input>
                </el-form-item>
                <el-form-item label="银行账号：" prop="acount">
                    <el-input @keyup.native="number"  style="width:300px;text-align:left" :disabled="hasInfo" v-model="form.acount" placeholder="请输入银行账号"></el-input>
                </el-form-item>
                <el-form-item label="开户银行：" prop="bank">
                    <el-input style="width:300px" :disabled="hasInfo" v-model="form.bank" placeholder="请输入开户行"></el-input>
                </el-form-item>
                <el-form-item label="" >
                    <span style="color:#606266">请注意，开户银行要具体到支行</span>
                </el-form-item>
                <el-form-item label="最近修改时间：" v-if="hasInfo">
                    <span style="color:#606266">{{updated_at}}</span>
                </el-form-item>
                <el-form-item v-if="!hasInfo">
                    <el-button style="margin-left:80px" type="primary" @click="submitForm('form')">保存</el-button>
                </el-form-item>
                <el-form-item label="" v-if="!hasInfo">
                    <span style="color:#606266">请确保账户信息完整无误后保存</span>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { withdrawInfo,withdrawAddData,editWithdrawAddData } from  '../../api/getData' 
export default {
    data(){
        return{
            hasInfo:false,//是否有账户信息
            radio: 1,
            updated_at:'',
            form :{
                name:'',
                acount:'',
                bank:''
            },
            rules: {
                name: [
                    { required: true, message: '请输入账户名', trigger: 'blur' },
                ],
                acount: [
                    { required: true, message: '请输入银行账号', trigger: 'blur' }
                ],
                bank: [
                    { required: true, message: '请输入开户行', trigger: 'blur' }
                ],
            }
        }
    },
    mounted(){
        this.getInfo();
    },
    methods:{
        number(){
            this.form.acount=this.form.acount.replace(/[^\.\d]/g,'');
            this.form.acount=this.form.acount.replace('.','');
        },
        async getInfo(){
            let res = await withdrawInfo();
            if(res.code == 0){
                if(res.data){
                    this.hasInfo = true;
                    this.radio = res.data.bank_type;
                    this.form.name = res.data.bank_account;
                    this.form.acount = res.data.bank_card;
                    this.form.bank = res.data.opening_bank;
                    this.updated_at = res.data.updated_at;
                    this.curId = res.data.id;
                }else{
                    this.hasInfo = false;
                    this.radio = 1;
                    this.form.name = '';
                    this.form.acount = '';
                    this.form.bank = '' ;
                    this.updated_at = '';
                    this.curId = '';
                }
            }else{
                this.$message.error(res.message);
            }
        },
        async doSave(){
            var reg = /^[1-9]\d*$/;
            if(!reg.test(this.form.acount)){
                this.$message.error('银行账号只能输入数字');
                return;
            }
            let res ;
            if(!this.curId){
                res = await withdrawAddData({
                    bank_card:this.form.acount,
                    bank_account:this.form.name,
                    opening_bank:this.form.bank,
                    bank_type:this.radio
                })
            }else{
                res = await editWithdrawAddData({
                    id:this.curId,
                    bank_card:this.form.acount,
                    bank_account:this.form.name,
                    opening_bank:this.form.bank,
                    bank_type:this.radio
                })
            }
            
            if(res.code == 0){
                this.getInfo();
            }else{
                this.$message.error(res.message);
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.doSave();
                } else {
                    return false;
                }
            });
        },
        doModify(){
            this.hasInfo = false;
        },
    }
}
</script>
<style lang="scss" scoped> 
    .mt2{
        margin-top: 20px;
    }
    .ml20{
        margin-left: 200px;
    }
    .vFlex{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>