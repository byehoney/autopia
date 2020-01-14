<template>
    <div>
        <el-row class="vEFlex mb2">
            <el-radio-group v-model="type" class="mr2">
                <el-radio :label="0">按编号</el-radio>
                <el-radio :label="1">按昵称</el-radio>
                <el-radio :label="2">按手机号</el-radio>
            </el-radio-group>
            <el-input style="width:180px;" class="mr2" v-model="keyword" placeholder="请输入内容"></el-input>
            <el-button type="primary" @click="doSearch">查询</el-button>
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            prop="created_at"
            label="注册时间"
            >
            </el-table-column>
            <el-table-column
            prop="id"
            label="编号">
            </el-table-column>
            <el-table-column
            prop="mobile"
            label="手机号">
            </el-table-column>
            <el-table-column
            prop="nickname"
            label="用户昵称"
            >
            </el-table-column>
            <el-table-column
            prop="higher_user_id"
            label="上级用户"
            >
            </el-table-column>
            <el-table-column
            label="身份"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.is_vip==0?'普通用户':'VIP'}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
            label="所属渠道"
            >
            </el-table-column> -->
            <el-table-column
            prop="invitation_code"
            label="邀请码"
            >
            </el-table-column>
            <el-table-column
            label="VIP升级方式"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.is_vip==0">——</span>
                    <span v-else>{{scope.row.vip_upgtade}}</span>
                </template>
            </el-table-column>
            <el-table-column
            label="生效时间"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.vip_start_at">{{scope.row.vip_start_at}}</span>
                    <span v-else>——</span>
                </template>
            </el-table-column>
            <el-table-column
            label="截止时间"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.vip_end_at">{{scope.row.vip_end_at}}</span>
                    <span v-else>——</span>
                </template>
            </el-table-column>
            <el-table-column
            label="操作"
            >
                <template slot-scope="scope">
                    <el-button
                    v-if="scope.row.is_vip==0"
                    @click.native.prevent="setVip(scope.row,1)"
                    type="text"
                    size="small">
                        设为vip
                    </el-button>
                    <el-button
                    v-if="scope.row.is_vip==1"
                    @click.native.prevent="setVip(scope.row,0)"
                    type="text"
                    size="small">
                        取消vip
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pubPagation"
            @current-change="handleCurrentChange"
            :current-page.sync="curPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-dialog
            :title="isSet?'设为vip':'取消vip'"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form ref="form" :model="form" label-width="150px">
                <el-row v-if="!isSet">
                    <el-form-item label="升级时间：">
                        <div>{{upTime}}</div>
                    </el-form-item>
                    <el-form-item label="升级方式：">
                        <div>{{upType}}</div>
                    </el-form-item>
                </el-row>
                <el-form-item label="手机号：">
                    <div>{{mobile}}</div>
                </el-form-item>
                <el-form-item label="昵称：">
                    <div>{{nickName}}</div>
                </el-form-item>
                <el-form-item label="设置原因：" v-if="isSet">
                    <el-input type="textarea" v-model="form.reason"></el-input>
                </el-form-item>
                <el-form-item label="取消原因：" v-else>
                    <el-input type="textarea" v-model="form.reason"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doSave">{{isSet?'设为VIP':'取消VIP身份'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { memberList,memberSet } from '../../api/getData'
export default {
    data(){
        return {
            isSet:true,
            total:0,
            curPage:1,
            page_size:10,
            keyword:'',
            type:0,
            tableData:[],
            dialogVisible:false,
            upTime:'',//升级时间
            upType:'',//升级方式
            mobile:'',//手机号
            nickName:'',//昵称
            form:{
                reason:''
            },
            curId:'',//当前操作用户id
            curStatus:'',//当前操作status
        }
    },
    mounted(){
        this.getData();
    },
    methods: {
        doSearch(){
            this.curPage = 1;
            this.getData();
        },
        async getData(){
            let res = await memberList({page:this.curPage,page_size:this.page_size,keywords:this.keyword,type:this.type});
            if(res.code == 0){
                this.tableData = res.data.data;
                this.total = res.data.total;
            }
        },
        handleCurrentChange(curPage){
            this.curPage = curPage;
            this.getData();
        },
        handleClose(){
            this.dialogVisible = false;
            this.form.reason = '';
        },
        setVip(row,status){
            this.dialogVisible = true;
            this.curStatus = status;
            this.curId = row.id;
            if(status == 0){
                this.isSet = false;
                this.upTime = row.vip_start_at;
                this.upType = row.vip_upgtade;
                this.mobile = row.mobile,
                this.nickName = row.nickname;
            }else{
                this.isSet = true;
                this.mobile = row.mobile,
                this.nickName = row.nickname;
            }
        },
        async doSave(){
            if(!this.form.reason){
                this.$message.error('请输入操作原因');
                return;
            }
            let res = await memberSet({user_id:this.curId,status:this.curStatus,remark:this.form.reason});
            if(res.code == 0){
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.dialogVisible = false;
                this.getData();
            }else{
                this.$message.error(res.message);
            }
        }
    },
}
</script>
<style lang="scss" scoped>
    .vEFlex{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .mr2{
        margin-right: 20px;
    }
    .mb2{
        margin-bottom: 20px;
    }
    .pubPagation{
        margin-top: 20px;
        float: right;
    }
</style>