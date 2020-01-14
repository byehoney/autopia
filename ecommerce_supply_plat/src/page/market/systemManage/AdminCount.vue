<template>
  <div class="content">
    <el-row class="center mb2">
        <el-col>
            <el-button type="primary" @click="addNew">添加</el-button>
        </el-col>
        <el-col>
            共有数据：{{total}}条
        </el-col>  
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="user_name"
        label="账号"
        >
      </el-table-column>
      <el-table-column
        prop="position"
        label="职位"
        >
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button @click="editRow(scope.row)" type="text" size="small">编辑</el-button>
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
    <el-dialog width="30%" :close-on-click-modal="false" center :visible.sync="dialogVisible" :title="title">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="账号：">
            <el-input :disabled="isEdit" v-model="form.count"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
            <el-input v-model="form.password" show-password ></el-input>
        </el-form-item>
        <el-form-item label="职务：">
            <el-input v-model="form.position"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { managerList,upDateManage } from '../../../api/getData.js'
export default {
  name: "bannerList",
  data(){
    return{
        title:'新增',
        isEdit:false,
        dialogVisible:false,
        curPage:1,
        page_size:10,
        total:0,
        tableData: [],
        curAdminId:'',
        form:{
            count:'',
            password:'',
            position:'',
        }
    }
  },
  components: {
 
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){
      let res = await managerList({page:this.curPage,page_size:this.page_size});
      if(res.code == 0){
        this.tableData = res.data.data;
        this.total = res.data.total;
      }
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getData();
    },
    addNew(){
      this.dialogVisible = true;
      this.curAdminId = '';
      this.title = '新增';
      this.isEdit = false;
      this.form = {
        count:'',
        password:'',
        position:'',
      }
    },
    editRow(row){
      this.dialogVisible = true;
      this.curAdminId = row.id;
      this.title = '编辑';
      this.isEdit = true;
      this.form = {
        count:row.user_name,
        password:row.password,
        position:row.position,
      }
    },
    async onSubmit(){
      if(!this.form.count){
        this.$message({
          message: '请输入账号',
          type: 'warning'
        });
        return;
      }else if(!this.form.password){
        this.$message({
          message: '请输入密码',
          type: 'warning'
        });
        return;
      }else if(!this.form.position){
        this.$message({
          message: '请输入联系人',
          type: 'warning'
        });
        return;
      }else{
        let res = await upDateManage({
          id:this.curAdminId,
          user_name:this.form.count,
          password:this.form.password,
          position:this.form.position,
        })
        if(res.code == 0){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.dialogVisible = false;
          this.getData();
        }else{
          this.$message.error(res.message);
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
    .content .center{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .content .mb2{
        margin-bottom: 20px;
    }
    .content .smallPic{
        width: 60px;
        height: 60px;
    }
    .content  .pubPagation{
      margin-top: 20px;
      float: right;
    }
</style>
