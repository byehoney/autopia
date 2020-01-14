<template>
  <div class="content">
    <el-row class="bTitle">
      请输入禁词文字和字符，用中文半角或英文分号区隔。
    </el-row>
    <el-row>
      <el-col :span="14">
        <el-input
          type="textarea"
          :autosize="{ minRows: 10}"
          placeholder="请输入内容"
          v-model="badWords">
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14" class="btnArea">
        <el-button type="primary" @click="saveBadWords">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "badWordsStock",
  data(){
    return{
      badWords:''
    }
  },
  components: {

  },
  methods: {
    saveBadWords(){
      
    }
  },
};
</script>

<style lang="scss" scoped>
  .content  .btnArea{
    display: flex;
    justify-content: center;
    margin-top: 50px;
  }
  // .content  .el-textarea__inner{
  //   height: 300px!important;
  // }
  .content .bTitle{
    margin-bottom: 20px;
  }
</style>