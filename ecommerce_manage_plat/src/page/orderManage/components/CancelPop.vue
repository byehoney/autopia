<template>
    <div>
        <el-dialog
            :title="title"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <el-row style="text-align:center">确认后，货款将退给客户，请慎重操作。</el-row>
            <el-form class="mt2" ref="form" :model="form" label-width="120px">
                <el-form-item label="客服处理意见">
                    <el-input  type="textarea" v-model="form.desc" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doOper">{{title}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { orderOperate } from '../../../api/getData'
export default {
    data(){
        return{
            centerDialogVisible:false,
            advice:'',
            title:'',
            status:'',
            form:{
                desc:''
            }
        }
    },
    methods: {
        showDetail(row,status){
            this.form.desc = '';
            this.centerDialogVisible = true;
            this.curId = row.id;
            this.status = status;
            if(status == 2){
                this.title = '同意取消订单';
            }else{
                this.title = '拒绝取消订单';
            }
        },
        async doOper(){
            if(!this.form.desc){
                this.$message.error('请输入处理意见');
                return;
            }
            let res = await orderOperate({id:this.curId,remark:this.form.desc});
            if(res.code == 0){
                this.$message.success('操作成功');
                this.centerDialogVisible = false;
                this.$parent.getData();
            }else{
                this.$message.error(res.message);
            }
        }
    },
}
</script>
<style lang="scss" scoped>
    .mt2{
        margin-top: 20px;
    }
</style>