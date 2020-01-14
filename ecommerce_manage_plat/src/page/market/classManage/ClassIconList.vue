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
        prop="id"
        label="编号"
        >
      </el-table-column>
      <el-table-column
        label="分类图片"
        >
        <template slot-scope="scope">
        <img class="smallPic" 
            :src="scope.row.cate_img_url" alt="" 
            @click="previewImg(scope.row.cate_img_url)"
        >
        </template>
      </el-table-column>
      <el-table-column
        prop="cate_name"
        label="分类名称"
        >
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        >
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" >
      <img width="100%" :src="origionPic" alt="">
    </el-dialog>
    <ClassIconForm :typeIconList="typeList" ref="classIconForm" />
  </div>
</template>
<script>
import ClassIconForm from '../../../components/classIconForm.vue'
import { classIconList ,classList,delIcon} from '../../../api/getData.js'
export default {
  name: "bannerList",
  data(){
    return{
        dialogVisible:false,
        origionPic:'',
        curPage:1,
        page_size:1000,
        total:0,
        tableData: [],
        typeList:[]
    }
  },
  components: {
   ClassIconForm,
  },
  mounted() {
    this.getData();
    this.getIconList();
  },
  methods: {
    async getData(){
      let res = await classIconList({page:this.curPage,page_size:this.page_size});
      if(res.code == 0){
        this.tableData = res.data.data;
        this.total = res.data.total;
      }
    },
    async getIconList(){
        let res = await classList({page_size:this.page_size,page:1});
        if(res.code==0){
          this.typeList = res.data.data;
        }
    },
    previewImg(imgStr){
      this.dialogVisible = true;
      this.origionPic = imgStr;
    },
    addNew(){
      this.$refs.classIconForm.showDialogForm();
    },
    edit(row){
      this.$refs.classIconForm.showDialogForm(row);
    },
    async del(row){
      let res = await delIcon({id:row.id});
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
</style>
