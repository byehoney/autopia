<template>
    <div>
        <el-dialog
            title="备注"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <el-row>
                <el-input  type="textarea" v-model="desc" placeholder="请输入内容"></el-input>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doAdd">添加备注</el-button>
            </span>
            <el-row class="mt2">备注记录</el-row>
            <div class="noteBox" style="height:200px;overflow-y:scroll">
                <el-row class="mb2" v-for="(item,index) in list" :key="index">
                    <el-row>{{item.created_at}} {{item.supplier_account}} 【{{item.remark_type}}】</el-row>
                    <el-row>{{item.remark}}</el-row>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { addRemark,remarkList } from '../../../api/getData'
export default {
    data(){
        return{
            centerDialogVisible:false,
            advice:'',
            curId:'',
            desc:'',
            list:[],
        }
    },
    methods: {
        async getList(){
            let res = await remarkList({id:this.curId});
            if(res.code == 0){
                this.list = res.data;
            }else{
                this.$message.error(res.message);
            }
        },
        showDetail(row){
            this.desc = '';
            this.centerDialogVisible = true;
            this.curId = row.id;
            this.getList();
        },
        async doAdd(){
            if(!this.desc){
                this.$message.error('请输入备注内容');
                return;
            }
            let res = await addRemark({id:this.curId,remark:this.desc})
            if(res.code == 0){
                this.$message.success('操作成功');
                this.centerDialogVisible = false;
                this.desc = '';
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
    .mb2{
        margin-bottom: 20px;
    }
    ::-webkit-scrollbar {
        width: 4px;
        height: 0px;
        background-color: #F5F5F5;
    }
</style>