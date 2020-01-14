<template>
  <div id="app" class="fillcontain">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import './style/common';
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
// $background:#cccccc;
// body{
//   background: $background;
// }

.pubForm .upCoverImg .el-upload {
    border: 1px dashed #d9d9d9!important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .pubForm .upCoverImg  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .pubForm .upCoverImg  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .pubForm .upCoverImg  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
    .pubForm .ql-editor {
  min-height: 300px !important;
}
  .goodsContainer  .ql-tooltip.ql-editing{
      left: 100px!important;
      top: 30px!important;
  }
  .priceBox .hFlex  .el-form-item__content{
      display: flex;
      align-items: center;
      margin-right: 20px;
      margin-left: 50px!important;
}
</style>
