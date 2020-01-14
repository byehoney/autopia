<template>
    <div class="container">
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="名称">
                <el-input v-model="form.name" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  @click="doReset">重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="doSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <el-row style="display:flex;align-items:center;justify-content:flex-end">
            <el-button type="primary" @click="doAdd">新增</el-button>
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
            label="图标"
          >
            <template slot-scope="scope">
              <img class="smallPic" 
                :src="scope.row.image_url_full" alt="" 
                @click="previewImg(scope.row.image_url_full)"
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="名称"
          >
          </el-table-column>
          <el-table-column
            prop="type_str"
            label="跳转类型"
          >
          </el-table-column>
          <el-table-column
            prop="type_value_str"
            label="目标地址"
          >
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
          >
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="添加时间"
          >
          </el-table-column>
          <el-table-column
            label="状态"
          >
            <template slot-scope="scope">
                <span>{{scope.row.status==1?'上架':'下架'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.status==0" @click="opSet(scope.row.id,1)">上架</el-button>
              <el-button type="text" v-if="scope.row.status==1" @click="opSet(scope.row.id,0)">下架</el-button>
              <el-button type="text" @click="opEdit(scope.row.id)">编辑</el-button>
              <el-button type="text" @click="opDel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" >
          <img width="100%" :src="origionPic" alt="">
        </el-dialog>
        <el-pagination
            class="pubPagation"
            @current-change="handleCurrentChange"
            :current-page.sync="curPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <IconPop ref="iconPop"></IconPop>
    </div>
</template>
<script>
import { iconList,iconSet,iconDel } from '../../api/getData'
import IconPop from './components/IconPop'
export default {
    data(){
        return {
            tableData:[],
            curPage:1,
            page_size:10,
            total:0,
            origionPic:'',
            dialogVisible:false,
            form:{
                name:''
            }
        }
    },
    components:{
        IconPop
    },
    mounted(){
        this.getData();
    },
    methods:{
        previewImg(imgStr){
            this.dialogVisible = true;
            this.origionPic = imgStr;
        },
        handleCurrentChange(curPage){
            this.curPage = curPage;
            this.getData();
        },
        doReset(){
            this.form.name = "";
            this.curPage = 1 ;
            this.getData();
        },
        doSearch(){
            this.curPage = 1;
            this.getData();
        },
        async getData(){
            let res = await iconList({title:this.form.name,page_size:this.page_size,page:this.curPage});
            if(res.code == 0){
                this.total = res.data.total;
                this.tableData = res.data.data;
            }else{
              this.$message.error(res.message);
            }
        },
        async opSet(id,status){
          let res = await iconSet({id,status});
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
        doAdd(){
          this.$refs.iconPop.showDetail();
        },
        opEdit(id){
          this.$refs.iconPop.showDetail(id);
        },
        async opDel(id){
          let res = await iconDel({id});
          if(res.code == 0){
              this.$message({
                  type: 'success',
                  message: '操作成功!'
              });
              this.getData();
          }else{
              this.$message.error(res.message);
          }
        }
    }
}
</script>
<style lang="scss" scoped>
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