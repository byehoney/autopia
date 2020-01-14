<template>
    <div class="content">
        <el-row class="mb2">
            <el-col :span="24" class="center">
                <el-radio-group v-model="type" class="mr2">
                    <el-radio label="0">用户ID</el-radio>
                    <el-radio label="1">用户昵称</el-radio>
                </el-radio-group>
                <el-input v-model="keyWord" placeholder="关键词" class="mr2 input"></el-input>
                <el-button type="primary" @click="doSearch">查 询</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            prop="id"
            label="用户ID"
            >
            </el-table-column>
            <el-table-column
            prop="create_time"
            label="注册时间">
            </el-table-column>
             <el-table-column
            prop="nickname"
            label="用户昵称"
            >
            </el-table-column>
            <el-table-column
            prop="u_sex_str"
            label="性别"
            >
            </el-table-column>
            <el-table-column
            prop="recommend_time"
            label="注册地"
            >
            </el-table-column>
            <el-table-column
            label="身份"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.u_auth==1?'大V':''}}</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="u_auth_title"
            label="认证信息"
            >
            </el-table-column>
            <el-table-column
            prop="feed_count"
            label="动态"
            >
            </el-table-column>
            <el-table-column
            prop="activity_cnt"
            label="活动"
            >
            </el-table-column>
            <el-table-column
            prop="car_group_cnt"
            label="建群"
            >
            </el-table-column>
            <el-table-column
            prop="user_status_str"
            label="状态"
            >
            </el-table-column>
            <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
                <el-button
                @click.native.prevent="setRole(scope.$index, scope.row)"
                type="text"
                size="small">
                设置身份
                </el-button>
                <el-button
                @click.native.prevent="setFobidden(scope.$index, scope.row)"
                type="text"
                size="small">
                禁言
                </el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-dialog
            center
            title="禁言设置"
            :visible.sync="dialogFVisible"
            width="30%"
            >
            <el-row class="centerGroup mb2">
                <el-radio-group v-model="fType">
                    <el-radio-button label="0" v-if="curUser.user_status!=0">解禁</el-radio-button>
                    <el-radio-button label="1">禁言3天</el-radio-button>
                    <el-radio-button label="2">禁言7天</el-radio-button>
                    <el-radio-button label="3">永久禁言</el-radio-button>
                </el-radio-group>
            </el-row>
            <el-row class="mb2">
                <el-input v-model="reason" placeholder="请输入理由"></el-input>
            </el-row>
            <el-row class="centerGroup mb2">
                <el-button type="primary" @click="confirmForbidden">确定</el-button>
            </el-row>
        </el-dialog>
        <el-dialog
            center
            title="设置身份"
            :visible.sync="dialogSVisible"
            width="30%"
            >   
            <el-row class="centerGroup mb2">
                <el-radio-group v-model="authType">
                    <el-radio-button label="0">普通用户</el-radio-button>
                    <el-radio-button label="1">认证用户</el-radio-button>
                </el-radio-group>
            </el-row>
            <el-row class="mb2" v-if="authType==1">
                <el-input v-model="auth" placeholder="请输入认证信息"></el-input>
            </el-row>
            <el-row class="centerGroup mb2">
                <el-button type="primary" @click="confirmRole">确定</el-button>
            </el-row>
        </el-dialog>
        <el-pagination
            class="pubPagation"
            @current-change="handleCurrentChange"
            :current-page.sync="curPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>

import { userListData ,setUser,setForbidden} from '../../api/getData.js'
export default {
  data() {
    return {
        dialogFVisible:false,
        dialogSVisible:false,
        tableData:[],
        curPage:1,
        total:0,
        page_size:10,
        keyWord:'',
        type:'',
        fType:'',//禁言类型
        reason:'',//设置禁言原因
        authType:'',//设置身份信息
        auth:'',//认证信息
        curUser:{},//存储当前用户信息
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){
        let res = await userListData({page_size:this.page_size,page:this.curPage,type:this.type,keyword:this.keyWord});
        if(res.code==0){
            this.tableData = res.data.data;
            this.total = res.data.total;
        }
    },
    doSearch(){
        if(!this.type){
            return
        }
        this.curPage = 1;
        this.getData();
    },
    setRole(index,row){
        this.dialogSVisible = true;
        this.curUser = row;
        this.authType = row.u_auth;
        this.auth = row.u_auth_title;
    },
    setFobidden(index,row){
        this.dialogFVisible = true;
        this.curUser = row;
        this.fType = this.curUser.user_status;
        this.reason = this.curUser.forbidden_remark;
    },
    async confirmForbidden(){
        if(!this.fType){
            this.$message({
                showClose: true,
                message: '请选择禁言类型',
                type: 'warning'
            });
            return;
        }else if(!this.reason){
            this.$message({
                showClose: true,
                message: '请填写禁言原因',
                type: 'warning'
            });
            return;
        }
    
        let res = await setForbidden({user_id:this.curUser.id,type:this.fType,remark:this.reason});
        if(res.code == 0){
            this.dialogFVisible = false;
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.getData();
        }else{
            this.$message.error(res.message);
        }
    },
    async confirmRole(){
        if(!this.authType){
            this.$message({
                showClose: true,
                message: '请选择用户类型',
                type: 'warning'
            });
            return;
        }else if(this.authType == 1&&!this.auth){
            this.$message({
                showClose: true,
                message: '请填写认证信息',
                type: 'warning'
            });
            return;
        }
        let data ;
        if(this.authType == 0){
            data = {
                user_id:this.curUser.id,
                u_auth:this.authType,
            }
        }else{
            data = {
                user_id:this.curUser.id,
                u_auth:this.authType,
                u_auth_title:this.auth
            }
        }
        let res = await setUser(data);
        if(res.code == 0){
            this.dialogSVisible = false;
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.getData();
        }else{
            this.$message.error(res.message);
        }
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getData();
    },
  }

};
</script>
<style lang="scss" scoped>
    .content .input{
        width: 200px;
    }
    .content .mb2{
        margin-bottom: 20px;
    }
    .content .mr2{
        margin-right: 20px;
    }
    .content  .center{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .content  .centerGroup{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .content  .pubPagation{
        margin-top: 20px;
        float: right;
    }
</style>
