<template>
    <div class="content">
       <el-row class="center mb2">
            <el-input  class="input mr2" v-model="userName" placeholder="请输入用户名"></el-input>
            <el-button type="primary" @click="doSearch">查询</el-button>
       </el-row>
       <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            prop="create_time"
            label="加入时间"
            >
            </el-table-column>
            <el-table-column
            prop="id"
            label="编号"
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
                    <span v-if="scope.row.is_vip==1">VIP</span>
                    <span v-else>会员</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="f_invite_code"
            label="所属渠道"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.f_invite_code">{{scope.row.f_invite_code}}</span>
                    <span v-else>——</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="invitation_code"
            label="邀请码"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.invitation_code">{{scope.row.invitation_code}}</span>
                    <span v-else>——</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="zip"
            label="VIP升级方式"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.agent_type==1">前台充值</span>
                    <span v-else>后台设置</span>
                </template>
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            >
            <template slot-scope="scope">
                <el-button @click="updateRow(scope.row,0)" v-if="scope.row.is_vip==1" type="text" size="small">取消vip</el-button>
                <el-button @click="updateRow(scope.row,1)" v-else type="text" size="small">设置vip</el-button>
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
    </div>
</template>
<script>
import { memberList,setMember } from '../../../api/getData.js'
export default {
  name: "memberLsit",
  data(){
    return{
        userName:'',
        curPage:1,
        page_size:10,
        total:0,
        tableData:[],
    }
  },
  components: {
   
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){
        let res = await memberList({page_size:10,page:this.curPage,username:this.userName});
        if(res.code == 0){
            this.tableData = res.data.data;
            this.total = res.data.total;
        }
    },
    doSearch(){
        this.curPage = 1;
        this.getData();
    },
    handleCurrentChange(curPage){
        this.curPage = curPage;
        this.getData();
    },
    async updateRow(row,type){
        let res = await setMember({user_id:row.id,status:type});
        if(res.code == 0){
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.getData();
        }else{
            this.$message.error(res.message);
        }
    }
  },
};
</script>

<style lang="scss" scoped>
    .center{
        display: flex;
        align-items: center;
    }
    .input{
        width: 200px;
    }
    .mr2{
        margin-right: 20px;
    }
    .mb2{
        margin-bottom: 20px;
    }
    .content  .pubPagation{
        margin-top: 20px;
        float: right;
    }
</style>
