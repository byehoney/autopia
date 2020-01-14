<template>
  <div class="content">
    <el-row class="cTitle">
      <el-button @click="addVirUser">添加用户</el-button>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="用户ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="注册时间"
        width="180">
      </el-table-column>
      <el-table-column
        label="头像">
        <template slot-scope="scope">
          <img class="smallPic" 
            :src="scope.row.u_icon_url" alt="" 
            @click="previewImg(scope.row.u_icon_url)"
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="用户昵称">
      </el-table-column>
      <el-table-column
        prop="u_sex_str"
        label="性别">
      </el-table-column>
      <el-table-column
        cell-class-name="feel"
        label="心情">
        <template slot-scope="scope"  cell-class-name="feel">
          <img @click="editRow(scope.$index, scope.row)" class="feelIcon" :src="scope.row.u_mood_icon_url" alt="">
        </template>
      </el-table-column>
      <el-table-column
        cell-class-name="feel"
        label="签名">
        <template slot-scope="scope"  cell-class-name="feel">
          <span style="cursor:pointer" @click="editRow(scope.$index, scope.row)">{{scope.row.u_sign}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="u_auth_title"
        label="认证信息">
      </el-table-column>
      <el-table-column
        label="已发数据">
        <template slot-scope="scope">
          <el-row>动态：{{scope.row.feed_count}}</el-row>  
          <el-row>路况：{{scope.row.road_count}}</el-row>  
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="editRow(scope.$index, scope.row)"
            type="text"
            size="small">
            编辑
          </el-button>
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
    <el-dialog :visible.sync="dialogVisible" >
      <img width="100%" :src="origionPic" alt="">
    </el-dialog>
    <VirtulForm ref="virtulForm" />
  </div>
</template>
<script>
import { getVirtulUserList  } from '../../api/getData.js';
import VirtulForm from '../../components/virtulForm.vue'
export default {
  name: "autoPublish",
  data(){
      return{
        dialogVisible:false,//头像预览弹窗
        origionPic:'',//放大显示图片
        curPage:1,//当前页码
        total:100,//数据总数
        tableData: [
        //   {
        //   id:1,
        //   date: '2016-05-02',
        //   status:'待发布',
        //   name: '王小虎',
        //   content:'上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
        //   address: '上海市普陀区金沙江路 1518 弄',
        //   sex:'男',
        //   images:["https://file.chetuobang.com/ctb/shop/2019090360698548.png","https://file.chetuobang.com/ctb/shop/2019090360698548.png"],
        //   talk:'自驾游',
        // }, {
        //   id:2,
        //   date: '2016-05-04',
        //   status:'待发布',
        //   name: '王小虎',
        //   content:'上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
        //   address: '上海市普陀区金沙江路 1517 弄',
        //   sex:'男',
        //   images:["https://file.chetuobang.com/ctb/shop/2019090360698548.png","https://file.chetuobang.com/ctb/shop/2019090360698548.png"],
        //   talk:'自驾游'
        // }, {
        //   id:3,
        //   date: '2016-05-01',
        //   status:'待发布',
        //   name: '王小虎',
        //   content:'上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
        //   address: '上海市普陀区金沙江路 1519 弄',
        //   sex:'男',
        //   images:["https://file.chetuobang.com/ctb/shop/2019090360698548.png","https://file.chetuobang.com/ctb/shop/2019090360698548.png"],
        //   talk:'自驾游'
        // }, {
        //   id:4,
        //   date: '2016-05-03',
        //   status:'待发布',
        //   name: '王小虎',
        //   content:'上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
        //   address: '上海市普陀区金沙江路 1516 弄',
        //   sex:'男',
        //   images:["https://file.chetuobang.com/ctb/shop/2019090360698548.png","https://file.chetuobang.com/ctb/shop/2019090360698548.png"],
        //   talk:'自驾游'
        // }
        ]
      }
  },
  components: {
    VirtulForm,
  },
  mounted() {
    this.getData();
  },
  methods: {
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getData();
    },
    addVirUser(){
      this.$refs.virtulForm.showDialogForm();
    },
    editRow(index,row){
      this.$refs.virtulForm.showDialogForm(index,row);
    },
    previewImg(imgStr){
      this.dialogVisible = true;
      this.origionPic = imgStr;
    },
    async getData(){
      let res = await getVirtulUserList({page_size:10,page:this.curPage});
      this.tableData = res.data.data;
      this.total = res.data.total;
    }
  },
};
</script>

<style lang="scss" scoped>
.content .feel{
  display: flex;
  justify-content: center;
  align-items: center;
}
.content .feelIcon{
  width: 20px;
  height: 20px;
  position: relative;
  top: 5px;
}
  .cTitle{
    margin-bottom: 20px;
  }
  .smallPic{
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }
  .content  .pubPagation{
    margin-top: 20px;
    float: right;
  }
</style>