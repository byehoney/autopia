<template>
    <div class="content">
        <el-row class="mb2 hFlex">
            <el-col :span="8"><el-button type="primary" @click="doAdd">新增管理员</el-button></el-col>
            <el-col :span="16" class="end">
                <el-input class="mr2" style="width:150px;" v-model="userName" placeholder="请输入用户名"></el-input>
                <el-button type="primary" @click="doSearch">查询</el-button>
            </el-col>
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
                label="编号"
            >
            </el-table-column>
            <el-table-column
                prop="account"
                label="账号"
            >
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
            >
            </el-table-column>
            <!-- <el-table-column
                prop="address"
                label="角色"
            >
            </el-table-column> -->
            <el-table-column
                prop="workjob"
                label="职务"
            >
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话"
            >
            </el-table-column>
            <el-table-column
                label="操作"
            >
                <template slot-scope="scope">
                    <el-button type="text" @click="doEdit(scope.row)">修改</el-button>
                    <el-button v-if="scope.row.status==1" type="text" @click="doOperate(scope.row,0)">停用</el-button>
                    <el-button v-if="scope.row.status==0" type="text" @click="doOperate(scope.row,1)">启用</el-button>
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
            :title="isEdit?'修改管理员账号信息':'新增管理员账号'"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form ref="cform" :model="cform" label-width="120px" >
                <el-form-item label="账号：" prop="count">
                    <el-input style="width:250px;" v-model="cform.count" :disabled="isEdit" placeholder="请输入电子邮箱"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input :maxlength="6" :minlength="6" style="width:250px;" v-model="cform.password" placeholder="请输入6位密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="name">
                    <el-input style="width:250px;" v-model="cform.name" placeholder="请输入用户姓名"></el-input>
                </el-form-item>
                <el-form-item label="职务：" prop="job">
                    <el-input style="width:250px;" v-model="cform.job" placeholder="请输入职务" ></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" prop="tel">
                    <el-input :maxlength="11" :minlength="11"  style="width:250px;" v-model="cform.tel" placeholder="请输入联系电话" ></el-input>
                </el-form-item>
                <!-- <el-form-item label="角色：" prop="role">
                    <el-checkbox-group v-model="cform.role">
                        <el-checkbox label="客服" name="role"></el-checkbox>
                        <el-checkbox label="商品管理员" name="role"></el-checkbox>
                        <el-checkbox label="出纳" name="role"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item> -->
            </el-form>
            <el-row class="hFlex">
                <el-button class="mt2" type="primary" @click="doConfirm">{{isEdit?'保存':'新增'}}</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import { adminUserList,opAdminUser ,adminUserDetail,setAdminUser} from '../../api/getData';
export default {
    data(){
        return{
            dialogVisible:false,
            isEdit:false,//是否编辑
            cform:{
                count:'',
                password:'',
                name:'',
                job:'',
                tel:'',
                role:[]
            },
            userName:'',
            curPage:1,
            page_size:10,
            total:0,
            tableData: [],
            curUserId:''//当前操作用户id
        }
    },
    mounted(){
        this.getData();
    },
    methods:{
        doSearch(){
            this.curPage = 1;
            this.getData();
        },
        async getData(){
            let res = await adminUserList({page:this.curPage,page_size:this.page_size,keywords:this.userName});
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
            this.cform={
                count:'',
                password:'',
                name:'',
                job:'',
                tel:'',
                role:[]
            }
            
        },
        checkInfos(){
            let result = true;
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var telReg = /^1[3456789]\d{9}$/;
            if(!filter.test(this.cform.count)){
                this.$message({
                    message: '账号格式不正确',
                    type: 'warning'
                });
                result = false;
            }else if(this.cform.password.trim().length!=6){
                this.$message({
                    message: '密码格式不正确',
                    type: 'warning'
                });
                result = false;
            }else if(!this.cform.name){
                this.$message({
                    message: '用户姓名不能为空',
                    type: 'warning'
                });
                result = false;
            }else if(!this.cform.job){
                this.$message({
                    message: '职务不能为空',
                    type: 'warning'
                });
                result = false;
            }else if(!telReg.test(this.cform.tel)){
                this.$message({
                    message: '联系电话格式不正确',
                    type: 'warning'
                });
                result = false;
            }else{
                result = true;
            }
            return result;
        },
        doAdd(){
            this.dialogVisible = true;
            this.isEdit = false;
            this.curUserId = '';
        },
        async doEdit(row){
            this.dialogVisible = true;
            this.isEdit = true;
            this.curUserId = row.id;
            let res = await adminUserDetail({id:row.id});
            if(res.code == 0){
                this.cform = {
                    count:res.data.account,
                    password:res.data.password,
                    name:res.data.username,
                    job:res.data.workjob,
                    tel:res.data.mobile,
                    role:[]
                }
            }
        },
        async opStatus(row,type){
            let res = await setAdminUser({id:row.id,status:type});
            if(res.code == 0){
                this.$message({
                    showClose: true,
                    message: '操作成功',
                    type: 'success'
                });
                this.getData();
            }else{
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error'
                });
            }
        },
        doOperate(row,type){
            if(type==0){
                this.$confirm('此操作将停用该账户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.opStatus(row,type)
                })
            }else{
                this.opStatus(row,type)
            }
        },
        async doConfirm(){
            if(!this.checkInfos()){
                return;
            }
            let data = {};
            if(!this.isEdit){
                data = {
                    account:this.cform.count,
                    password:this.cform.password,
                    username:this.cform.name,
                    workjob:this.cform.job,
                    mobile:this.cform.tel
                }
            }else{
                data = {
                    password:this.cform.password,
                    username:this.cform.name,
                    workjob:this.cform.job,
                    mobile:this.cform.tel,
                    id:this.curUserId
                }
            }
            let res = await opAdminUser(data);
            if(res.code == 0){
                this.$message({
                    showClose: true,
                    message: '操作成功',
                    type: 'success'
                });
                this.getData();
                this.dialogVisible = false;
            }else{
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error'
                });
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .mt2{
        margin-top: 20px;
    }
    .mb2{
         margin-bottom: 20px;
    }
    .mr2{
        margin-right: 20px;
    }
    .ml2{
        margin-left: 20px;
    }
    .hFlex{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .flexV{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .end{
        display: flex;
        align-items: center;
        justify-content: flex-end
    }
    .content  .pubPagation{
        margin-top: 20px;
        float: right;
    }
</style>