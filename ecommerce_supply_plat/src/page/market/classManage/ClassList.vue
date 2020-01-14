<template>
  <div class="content">
        <el-row class="center mb2">
            <el-col>
                <el-button type="primary" @click="addNew">添加</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            row-key="id"

            :tree-props="{children: 'son', hasChildren: 'hasSon'}"
            style="width: 100%">
            <el-table-column
                prop="id"
                label="编号"
                >
            </el-table-column>
            <el-table-column
                prop="cate_name"
                label="名称"
                >
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="editRow(scope.row,false)" type="text" size="small">编辑</el-button>
                    <el-button v-if="scope.row.fid == 0" @click="addSub(scope.row,true)" type="text" size="small">添加子栏目</el-button>
                    <el-button @click="delRow(scope.row,false)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <classForm ref="classForm" :classOptions="tableData"></classForm>
  </div>
</template>
<script>
import classForm from '../../../components/classForm.vue'
import { classList,delClass } from '../../../api/getData.js'
export default {
  name: "adList",
  data(){
    return{
        baseUrl:'',//上传图片路径
        dialogVisible:false,
        page_size:100,
        curPage:1,
        total:0,
        title:'添加',
        imageUrl:'',
        imgId:'',
        tableData: []
    }
  },
  components: {
    classForm
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){
        let res = await classList({page_size:this.page_size,page:this.curPage});
        if(res.code==0){
            this.tableData = res.data.data;
            this.total = res.data.total;
        }
    },
    addNew(){
        this.$refs.classForm.showDialogForm(0,'',false);
    },
    addSub(row){
        this.$refs.classForm.showDialogForm(1,row,true);
    },
    editRow(row){
       this.$refs.classForm.showDialogForm(2,row,false);
    },
    async delRow(row){
        let res = await delClass({id:row.id});
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
    .content .center{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .content .mb2{
        margin-bottom: 20px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9!important;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 145px;
        height: 145px;
        line-height: 145px;
        text-align: center;
    }
    .avatar {
        width: 145px;
        height: 145px;
        display: block;
    }
</style>
