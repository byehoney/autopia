<template>
    <div class="content">
        <el-row class="flex mb2">
            <el-col :span="20">
                <el-input style="width:200px" v-model="brandName" placeholder="请输入品牌名称"></el-input>
                <el-button type="primary" @click="doSearch">查询品牌</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addBrand">新增品牌</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            >
            <el-table-column
            prop="id"
            label="编号"
            >
            </el-table-column>
            <el-table-column
                label="商标图"
            >
                <template slot-scope="scope">
                    <img class="smallPic" 
                        :src="scope.row.image_url_full" alt="" 
                        @click="previewImg(scope.row.image_url_full)"
                    >
                </template>
            </el-table-column>
            <el-table-column
            prop="brand_name"
            label="品牌"
            >
            </el-table-column>
            <!-- <el-table-column
            prop="address"
            label="商品分类">
            </el-table-column> -->
            <el-table-column
            label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
                    <el-button type="text" @click="doDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <AddBrand ref="addBrand"></AddBrand>
        <el-pagination
            class="pubPagation"
            @current-change="handleCurrentChange"
            :current-page.sync="curPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-dialog :visible.sync="dialogVisible" >
            <img width="100%" :src="origionPic" alt="">
        </el-dialog>
    </div>
</template>
<script>
import AddBrand from './components/AddBrand';
import { brandList ,delBrand} from '../../api/getData'
export default {
    data(){
        return{
            brandName:'',
            curPage:1,
            page_size:10,
            total:0,
            dialogVisible:false,//大图预览器是否展示
            origionPic:'',//图片预览器展示图片路径
            tableData: []
        }
    },
    components:{
        AddBrand,
    },
    mounted(){
        this.getData();
    },
    methods:{
        async getData(){
            let res = await brandList({page:this.curPage,page_size:this.page_size,brand_name:this.brandName});
            if(res.code == 0){
                this.tableData = res.data.data;
                this.total = res.data.total;
            }
        },
        handleCurrentChange(curPage){
            this.curPage = curPage;
            this.getData();
        },
        previewImg(imgStr){
            this.dialogVisible = true;
            this.origionPic = imgStr;
        },
        doSearch(){
            this.curPage = 1;
            this.getData();
        },
        addBrand(){
            this.$refs.addBrand.showBrandPop();
        },
        editRow(row){
            this.$refs.addBrand.showBrandPop(row);
        },
        async opDel(row){
            let res = await delBrand({id:row.id});
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
        doDel(row){
            this.$confirm('此操作将删除该品牌, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.opDel(row)
            })
        }
    }
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
    .content  .pubPagation{
        margin-top: 20px;
        float: right;
    }
    .smallPic{
        width: 60px;
        height: 60px;
    }
</style>