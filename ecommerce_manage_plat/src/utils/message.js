function toast(self, fn, msg, item) {
  self.$confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 执行操作接口
    fn(item)
  }).catch(() => {

  });
}

function err(data, self, type) {
  if (type) {
    self.$message.success(data);
  } else {
    self.$message.error(data);
  }
}
module.exports = {
  toast,
  err
}
