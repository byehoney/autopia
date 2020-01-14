<template>
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline mb2">
            <el-form-item label="手机号" class="mr2" label-width="100px">
                <el-input v-model="form.tel" maxlength="11" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="提现状态" class="mr2" label-width="120px">
                <el-select @change="selStatus" v-model="form.status" placeholder="提现状态" v-if="actTab==0">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已发放" value="2"></el-option>
                    <el-option label="发放失败" value="4"></el-option>
                </el-select>
                <el-select @change="selStatus" v-model="form.status" placeholder="提现状态" v-if="actTab==1">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="待审核" value="0"></el-option>
                    <el-option label="申请驳回" value="3"></el-option>
                    <el-option label="已发放" value="2"></el-option>
                    <el-option label="发放失败" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="doReset" class="mr2">重置</el-button>
                <el-button type="primary" @click="doSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <el-row >
            <el-col :span="24" class="top">
                <el-button-group>
                    <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']"  @click="changeType(0)">小额提现</el-button>
                    <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']"  @click="changeType(1)">大额提现</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="statement_no"
                label="提现单号"
            >
            </el-table-column>
            <el-table-column
                prop="application_time"
                label="申请时间"
            >
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机号"
            >
            </el-table-column>
            <el-table-column
                prop="nickname"
                label="昵称"
            >
            </el-table-column>
            <el-table-column
                label="身份"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.is_vip==1?'VIP':'普通用户'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="cashout_money"
                label="提现金额"
            >
            </el-table-column>
            <el-table-column
                prop="status_str"
                label="提现状态"
            >
            </el-table-column>
            <el-table-column
                label="操作"
            >
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status==2||scope.row.status==3" @click="preDetail(scope.row)">提现详情</el-button>
                    <el-button type="text" v-if="scope.row.status==4" @click="tryAgain(scope.row)">重试</el-button>
                    <el-button type="text" v-if="scope.row.status==0" @click="doPass(scope.row,1)">审核通过</el-button>
                    <el-button type="text" v-if="scope.row.status==0" @click="doPass(scope.row,3)">驳回</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ManOperatePop ref="manOperatePop"></ManOperatePop>
        <WithDrawals ref="withDrawals"></WithDrawals>
        <RejectPop ref="rejectPop"></RejectPop>

        <el-pagination
            class="pubPagation"
            @current-change="handleCurrentChange"
            :current-page.sync="curPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
import { withDrawList,withDrawMakeloans,withDrawExamine } from '../../api/getData'
import ManOperatePop from './components/ManOperatePop'
import WithDrawals from './components/WithDrawalsDetail'
import RejectPop from './components/RejectPop'
export default {
    data(){
        return{
            form:{
                tel:'',
                status:''
            },
            tableData:[],
            actTab:0,
            curPage:1,
            page_size:10,
            total:0
        }
    },
    components:{
        ManOperatePop,
        WithDrawals,
        RejectPop
    },
    mounted(){
        this.getData();
    },
    methods: {
        changeType(index){
            this.actTab = index;
            this.curPage = 1;
            this.getData();
            this.form ={
                tel:'',
                status:'',
            }
        },
        doReset(){
            this.form = {
                tel:'',
                status:''
            }
            this.curPage = 1;
            this.getData()
        },
        doSearch(){
            this.curPage = 1;
            this.getData()
        },
        selStatus(val){
            this.status = val;
        },
        async getData(){
            let res = await withDrawList({page:this.curPage,page_size:this.page_size,type:this.actTab,status:this.form.status,mobile:this.form.tel});
            if(res.code == 0){
                this.tableData = res.data.data;
                this.total = res.data.total;
            }
        },
        handleCurrentChange(curPage){
            this.curPage = curPage;
            this.getData();
        },
        preDetail(row){
            this.$refs.withDrawals.showDetail(row);
        },
        async tryAgain(row){
            let res = await withDrawMakeloans({id:row.id});
            if(res.code == 0){
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.getData();
            }else{
                this.$message.error(res.message);
            }
        },
        async doPass(row,status){
            if(status == 1){
                let res = await withDrawExamine({id:row.id,status});
                if(res.code == 0){
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getData();
                }else{
                    this.$message.error(res.message);
                }
            }else{
                this.$refs.rejectPop.showDetail(row);
            }
        }
    },
}
</script>
<style lang="scss">
    .mb2{
        margin-bottom: 20px;
    }
    .vFlex{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .pubPagation{
        margin-top: 20px;
        float: right;
    }
    .top{
        border-bottom: 1px solid #e5e5e5;
        .groupBtn{
            border-bottom: none!important;
        }
        .active{
            background-color: #409eff;
            color: #fff;
        }
    }
</style>