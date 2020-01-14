<template>
  <div class="content">
        <el-row class="center mb2">
            <el-col>
                <el-button type="primary" @click="addNew">添加</el-button>
            </el-col>
            <el-col>
                共有数据：5条
            </el-col>  
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="date"
                label="编号"
                >
            </el-table-column>
            <el-table-column
                prop="date"
                label="广告图"
                >
            </el-table-column>
            <el-table-column
                prop="date"
                label="广告地址"
                >
            </el-table-column>
            <el-table-column
                prop="date"
                label="跳转类型"
                >
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="editRow(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="delRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <adForm ref="adForm"></adForm>
  </div>
</template>
<script>
import adForm from '../../../components/adForm.vue'
export default {
  name: "adList",
  data(){
    return{
        baseUrl:'',//上传图片路径
        dialogVisible:false,
        title:'添加',
        imageUrl:'',
        imgId:'',
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            picture:['https://file.chetuobang.com/ctb/opencar/2019090786307396.png']
            }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
            picture:['https://file.chetuobang.com/ctb/opencar/2019090786307396.png']
            }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
            picture:['https://file.chetuobang.com/ctb/opencar/2019090786307396.png']
            }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            picture:['https://file.chetuobang.com/ctb/opencar/2019090786307396.png']
        }]
    }
  },
  components: {
    adForm
  },
  mounted() {
  
  },
  methods: {
    addNew(){
        this.$refs.adForm.showDialogForm();
    },
    editRow(row){
       this.$refs.adForm.showDialogForm();
    },
    delRow(row){

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
