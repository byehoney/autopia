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
        prop="created_at"
        label="注册时间"
        >
      </el-table-column>
      <el-table-column
        prop="supplier_code"
        label="编号"
        >
      </el-table-column>
      <el-table-column
        prop="supplier_account"
        label="账号"
        >
      </el-table-column>
      <el-table-column
        prop="company"
        label="公司名称"
        >
      </el-table-column>
      <el-table-column
        prop="contacts"
        label="联系人"
        >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
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
        <el-form-item label="联系人：">
            <el-input v-model="form.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
            <el-input v-model="form.tel" minlength="11" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="公司名称：">
            <el-input v-model="form.company"></el-input>
        </el-form-item>
        <el-form-item label="结算周期：">
            <el-radio-group v-model="form.range">
                <el-radio label="0">预付</el-radio>
                <el-radio label="1">按日结算</el-radio>
                <el-radio label="2">按月结算</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { supplyList,upDateSupply } from '../../../api/getData.js'
export default {
  name: "bannerList",
  data(){
    return{
        title:'新增',
        isEdit:false,
        dialogVisible:false,
        tableData: [],
        page_size:10,
        curPage:1,
        total:0,
        curSupplyId:'',
        form:{
            count:'',
            password:'',
            linkman:'',
            tel:"",
            company:'',
            range:''
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
      let res = await supplyList({page_size:this.page_size,curPage:this.curPage});
      if(res.code ==0 ){
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
      this.title = '新增';
      this.curSupplyId = '';
      this.isEdit = false;
      this.form = {
        count:'',
        password:'',
        linkman:'',
        tel:"",
        company:'',
        range:''
      }
    },
    editRow(row){
      this.dialogVisible = true;
      this.title = '编辑';
      this.curSupplyId = row.id;
      this.isEdit = true;
      this.form = {
        count:row.supplier_account,
        password:row.password,
        linkman:row.contacts,
        tel:row.mobile,
        company:row.company,
        range:row.type+''
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
      }else if(!this.form.linkman){
        this.$message({
          message: '请输入联系人',
          type: 'warning'
        });
        return;
      }else if(!this.form.tel){
        this.$message({
          message: '请输入联系电话',
          type: 'warning'
        });
        return;
      }else if(!(/^1[3456789]\d{9}$/.test(this.form.tel))){
        this.$message({
          message: '请输入正确的联系电话',
          type: 'warning'
        });
        return;
      }else if(!this.form.company){
        this.$message({
          message: '请输入公司名称',
          type: 'warning'
        });
        return;
      }else if(!this.form.range){
        this.$message({
          message: '请勾选结算周期',
          type: 'warning'
        });
        return;
      }else{
        let res = await upDateSupply({
          id:this.curSupplyId,
          supplier_account:this.form.count,
          password:this.form.password,
          contacts:this.form.linkman,
          mobile:this.form.tel,
          company:this.form.company,
          type:this.form.range
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
