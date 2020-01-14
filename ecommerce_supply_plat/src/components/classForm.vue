<template>
    <el-dialog 
        v-loading="loading"
        :title="title"
        center 
        :visible.sync="dialogFormVisible"  
        v-if='dialogFormVisible'
        :close-on-click-modal="false" class="virForm" width="30%">
        <el-row class="mb2">
            <el-col :span="6">分类名称：</el-col>
            <el-col :span="12">
                <el-input  v-model="className" placeholder="请输入分类名称"></el-input>
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="6">上一级分类：</el-col>
            <el-col :span="12">
                <el-select :disabled="isSub" v-model="classId" placeholder="请选择">
                    <el-option
                    v-for="item in classOptions"
                    :key="item.id"
                    :label="item.cate_name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="btnArea">
            <el-button @click="handleConfirm" type="primary">保存</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
import { upDateClass } from '../api/getData.js';
export default {
  name: "bannerForm",
  data(){
    return{
      loading:false,
      title:'',
      dialogFormVisible:false,//表单弹框是否显示
      className:'',//分类名称
      classId:'',//分类id
      options: [],
      curId:'',//当前操作类 id
      fid:'',//当前操作类 父级 id
      isSub:false,//当前操作是否是子类目
      opType:'',//操作类型  0添加一级分类  1添加 二级分类  2 编辑分类
    }
  },
  props:['classOptions'],
  methods: {
    showDialogForm(type,row,isSub){
      this.dialogFormVisible = true;
      this.opType = type;
      this.isSub = isSub;
     
      if(row){
        this.fid = row.fid;
        this.curId = row.id;
        this.classId = row.id;
        this.className = row.cate_name;
      }
      if(isSub){
        this.className = '';
      }
      if(type==0||type==1){
        this.title = '添加';
        this.className = '';
        this.curId = '';
      }else{
        this.title = '编辑';
      }
      if(!isSub){
        this.classId = '';
      }
    },
    async handleConfirm(){
      if(!this.className){
        this.$message({
          showClose: true,
          message: '请输入分类名称',
          type: 'warning'
        });
        return;
      }else if(!this.classId&&this.opType==1){
        this.$message({
          showClose: true,
          message: '请选择上级分类',
          type: 'warning'
        });
        return;
      }else{
        let cate_name = this.className;
        let fid = this.classId;
        let id = this.curId;
        let res = await upDateClass({
          cate_name:cate_name,
          fid:fid,
          id:this.opType==1?'':id
        })
        if(res.code == 0){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.$parent.getData();
        }else{
          this.$message.error(res.message);
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

   .virForm  .mood_icon{
       width: 50px;
       height: 50px;
       border-radius:50%; 
   }
  .virForm  .el-button.active{
      background-color: #E6A23C;
      color: #fff;
  }
  .virForm  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9!important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .virForm  .btnArea{
      display: flex;
      justify-content: center;
  }
  .virForm   .mb{
      margin-bottom: 10px;
  }
  .virForm   .mb2{
      margin-bottom: 20px;
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