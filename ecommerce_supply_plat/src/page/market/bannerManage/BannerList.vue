<template>
  <div class="content">
    <el-row class="center mb2">
        <el-col>
            <el-button type="primary" @click="addNewBanner">添加</el-button>
        </el-col>
        <el-col>
            共有数据：{{total}}条
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
        label="banner图"
        >
        <template slot-scope="scope">
        <img class="smallPic" 
            :src="scope.row.pic_full_url" alt="" 
            @click="previewImg(scope.row.pic_full_url)"
        >
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        >
      </el-table-column>
      <el-table-column
        prop="jump_url"
        label="跳转链接"
        >
      </el-table-column>
      <el-table-column
        label="跳转类型"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.jump_type==1">H5</span>
        </template>
      </el-table-column>
       <el-table-column
        label="状态"
        >
        <template slot-scope="scope">
            <el-button @click="setBannerState(scope.row,1)" v-if="scope.row.status==0" type="text" size="small">启用</el-button>
            <el-button @click="setBannerState(scope.row,0)" v-if="scope.row.status==1" type="text" size="small">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button @click="editBanner(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="delBanner(scope.row)" type="text" size="small">删除</el-button>
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
      layout="prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <BannerForm ref="bannerForm" />
  </div>
</template>
<script>
import BannerForm from '../../../components/bannerForm.vue'
import { bannerList ,upDateBannerState ,delMarketBanner} from '../../../api/getData.js'
export default {
  name: "bannerList",
  data(){
    return{
        dialogVisible:false,
        origionPic:'',
        page_size:10,
        curPage:1,
        total:0,
        tableData: []
    }
  },
  components: {
   BannerForm,
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){
      let res = await bannerList({page_size:this.page_size,page:this.curPage});
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
    addNewBanner(){
      this.$refs.bannerForm.showDialogForm();
    },
    editBanner(row){
      this.$refs.bannerForm.showDialogForm(row);
    },
    async setBannerState(row,type){
      let res = await upDateBannerState({id:row.id,status:type});
      if(res.code == 0){
        this.$message({
            message: '操作成功',
            type: 'success'
        });
        this.getData();
      }else{
        this.$message.error(res.message);
      }
    },
    async delBanner(row){
      let res = await delMarketBanner({id:row.id});
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
    .content .smallPic{
        width: 60px;
        height: 60px;
    }
    .content  .pubPagation{
      margin-top: 20px;
      float: right;
    }
</style>
