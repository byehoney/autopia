<template>
  <div class="content">
        <el-row class="center mb2">
            <el-col>
                <el-button type="primary" @click="addNew">添加</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="id"
                label="编号"
                >
            </el-table-column>
            <el-table-column
                prop="service_name"
                label="服务名称"
                >
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="editRow(scope.row)" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
         width="30%"
         :title="title"
         :close-on-click-modal="false"
         :visible.sync="dialogVisible">
            <el-form :inline="true" :model="formInline" ref="formInline" :rules="rules" class="demo-form-inline">
                <el-form-item label="服务名称" prop="serviceName">
                    <el-input v-model="formInline.serviceName" placeholder="服务名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('formInline')">{{title=='添加'?'添加':'保存'}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
  </div>
</template>
<script>
import { serviceList,upDateService } from '../../../api/getData.js'
export default {
  name: "bannerList",
  data(){
    return{
        formInline: {
          serviceName: '',
        },
        rules: {
          serviceName: [
            { required: true, message: '请输入服务名称', trigger: 'blur' },
          ],
        },
        dialogVisible:false,
        title:'添加',
        tableData: []
    }
  },
  components: {
      
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){
        let res = await serviceList();
        if(res.code == 0){
            this.tableData = res.data;
        }
    },
    addNew(){
        this.dialogVisible = true;
        this.title = "添加";
        this.curId = '';
        this.formInline.serviceName = '';
    },
    editRow(row){
        this.dialogVisible = true;
        this.title = "编辑";
        this.curId = row.id;
        this.formInline.serviceName = row.service_name;
    },
    async updateInfo(){
        let  res = await upDateService({service_name:this.formInline.serviceName,id:this.curId});
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
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              this.updateInfo();
            } else {
                
                return false;
            }
        }); 
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
</style>
