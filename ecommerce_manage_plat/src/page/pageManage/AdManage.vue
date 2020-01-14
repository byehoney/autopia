<template>
    <div>
        <el-row style="display:flex;justify-content:flex-end;align-items:center">
            <el-button type="primary" @click="addAd">添加广告</el-button>
        </el-row>
        <el-table
            class="mt2"
            :data="tableData"
            style="width: 100%">
            <!-- <el-table-column
                prop="id"
                label="序号"
                >
            </el-table-column> -->
            <el-table-column
                prop="id"
                label="广告位编号"
                >
            </el-table-column>
            <el-table-column
                label="广告位名称">
                <template slot-scope="scope">
                    <div >
                        {{adOptions[parseInt(scope.row.id)-1]['name']}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="ad_desc"
                label="描述">
            </el-table-column>
            <el-table-column
                label="尺寸">
                <template slot-scope="scope">
                    <div >
                        {{adOptions[parseInt(scope.row.id)-1]['size']['width']+'*'+adOptions[parseInt(scope.row.id)-1]['size']['height']}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="user_type_str"
                label="观看者属性">
            </el-table-column>
            <el-table-column
                prop="dump_type"
                label="目标类型">
            </el-table-column>
            <el-table-column
                prop="dump_value"
                label="目标地址">
            </el-table-column>
            <el-table-column
                prop="status_str"
                label="状态">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status==0">发布</el-button>
                    <el-button type="text" v-if="scope.row.status==1">下架</el-button>
                    <el-button type="text" @click="doEdit(scope.row)">编辑内容</el-button>
                    <el-button type="text" @click="doDel(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pubPagation"
            @current-change="handleCurrentChange"
            :current-page.sync="curPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-dialog :visible.sync="dialogVisible" >
          <img width="100%" :src="origionPic" alt="">
        </el-dialog>
        <AdPop ref = "adPop"></AdPop>
    </div>
</template>
<script>
import { adList,delAd } from '../../api/getData'; 
import AdPop from './components/AdPop';
export default {
    data(){
        return{
            adOptions:[
                {id:1,name:'首页头图1',size:{width:700,height:350}},
                {id:2,name:'首页头图2',size:{width:700,height:350}},
                {id:3,name:'首页头图3',size:{width:700,height:350}},
                {id:4,name:'首页头图4',size:{width:700,height:350}},
                {id:5,name:'首页头图5',size:{width:700,height:350}},
                {id:6,name:'首页通栏1',size:{width:695,height:174}},
                {id:7,name:'首页会员权益1',size:{width:345,height:345}},
                {id:8,name:'首页会员权益2',size:{width:342,height:165}},
                {id:9,name:'首页会员权益3',size:{width:342,height:165}},
                {id:10,name:'首页通栏2',size:{width:695,height:161}},
                {id:11,name:'首页通栏3',size:{width:695,height:174}},
                {id:12,name:'首页通栏4',size:{width:700,height:229}},
                {id:13,name:'首页弹窗',size:{width:700,height:1020}},
                {id:14,name:'分类通栏1',size:{width:703,height:250}},
                {id:15,name:'分类通栏2',size:{width:700,height:350}},
            ],
            dialogVisible:false,
            origionPic:'',
            tableData:[],
            curPage:1,
            page_size:10,
            total:0
        }
    },
    components:{
        AdPop
    },
    mounted(){
        this.getData();
    },  
    methods:{
        handleCurrentChange(curPage){
            this.curPage = curPage;
            this.getData();
        },
        async getData(){
            let res = await adList({page:this.curPage,page_size:this.page_size});
            if(res.code == 0){
                this.tableData = res.data.data;
                this.total = res.data.total;
            }else{
                this.$message.error(res.message);
            }
        },
        addAd(){
            this.$refs.adPop.showDetail();
        },
        previewImg(imgStr){
            this.dialogVisible = true;
            this.origionPic = imgStr;
        },
        doEdit(row){
            this.$refs.adPop.showDetail(row);
        },
        async confirmDel(id){
            let res = await delAd({id});
            if(res.code == 0){
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.getData();
            }else{
                this.$message.error(res.message);
            }
        },
        doDel(id){
            this.$confirm('此操作将该删除该条广告, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.confirmDel(id);
            }).catch(() => {
            
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    .mt2{
        margin-top: 20px;
    }
    .pubPagation{
        margin-top: 20px;
        float: right;
    }
    .smallPic{
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
</style>