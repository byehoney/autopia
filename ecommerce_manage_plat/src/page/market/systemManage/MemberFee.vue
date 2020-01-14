<template>
    <div class="content">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="名称"
          >
          </el-table-column>
          <el-table-column
            prop="price"
            label="价钱"
          >
            <template slot-scope="scope">
              <el-input style="width:100px" :disabled="canEdit" v-model="scope.row.price" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="canEdit" @click="editRow(scope.row,0)" type="text" size="small">编辑</el-button>
              <el-button v-else @click="editRow(scope.row,1)" type="text" size="small">确定</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { memberFee,setMemberFee } from '../../../api/getData.js'
export default {
  name: "mainContent",
  data() {
    return {
      canEdit:true,
      tableData: [{
        name: '会员费',
        price: '499',
      }]
    }
  },
  components: {
   
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){
      let res = await memberFee();
      if(res.code == 0){
        this.$set(this.tableData[0],'price',res.data.price);
      }
    },
    async editRow(row,type){
      if(type==0){
        this.canEdit = false;
      }else{
        if(!row.price){
          this.$message({
            message: '请输入会员费金额',
            type: 'warning'
          });
          return;
        }else if(!(/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/).test(row.price)){
          this.$message({
            message: '请输入正确的金额',
            type: 'warning'
          });
          return;
        }
        this.canEdit = true;
        let res = await setMemberFee({price:row.price});
        if(res.code == 0){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getData();
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
