<template>
    <div>
        <el-row class="flex mb2">
            <el-col :span="20">
                <!-- 共有8个一级分类、184个二级分类 -->
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addMainClass">新增一级分类</el-button>
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
                label="分类图"
            >
                <template slot-scope="scope">
                    <img class="smallPic" 
                        :src="scope.row.image_url_full" alt="" 
                        @click="previewImg(scope.row.image_url_full)"
                    >
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.fid == 0" @click="addSubClass(scope.row)" type="text" size="small">添加二级分类</el-button>
                    <el-button @click="editRow(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button v-if="!scope.row.candel" @click="delRow(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <AddNewClass ref="addNewClass"></AddNewClass>
        <el-dialog :visible.sync="dialogVisible" >
            <img width="100%" :src="origionPic" alt="">
        </el-dialog>
    </div>
</template>
<script>
import AddNewClass from './components/AddNewClass'
import { classList,delClass } from '../../api/getData'
export default {
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
            tableData: [],
            origionPic:''
        }
    },
    components: {
        AddNewClass
    },
    mounted() {
        this.getData();
    },
    methods: {
        previewImg(imgStr){
            this.dialogVisible = true;
            this.origionPic = imgStr;
        },
        async getData(){
            let res = await classList({page_size:this.page_size,page:this.curPage});
            res.data.data.forEach(item => {
                if(item.son.length){
                    item.candel = true;
                }else{
                    item.candel = false;
                }
            });
            if(res.code==0){
                this.tableData = res.data.data;
                this.total = res.data.total;
            }
        },
        addMainClass(){
            this.$refs.addNewClass.showClassPop(0,'');
        },
        addSubClass(row){
            this.$refs.addNewClass.showClassPop(1,row);
        },
        editRow(row){
            this.$refs.addNewClass.showClassPop(2,row);
        },
        async delRow(row){
            this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delClass({id:row.id}).then((res)=>{
                    if(res.code == 0){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.getData();
                    }else{
                        this.$message.error(res.message);
                    }
                });
            })
        }
    },
}
</script>
<style lang="scss" scoped>
    .flex{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .mb2{
        margin-bottom: 20px;
    }
    .smallPic{
        width: 60px;
        height: 60px;
    }
</style>