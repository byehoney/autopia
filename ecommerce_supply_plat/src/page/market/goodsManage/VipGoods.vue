<template>
    <div class="content">
      <el-row class="mb2">
        <el-col :span="12" class="center mb2">
          <el-col :span="4">
              <el-button type="primary" @click="addNewGoods">添加特权商品</el-button>
          </el-col>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="商品id"
        >
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
        >
        </el-table-column>
        <el-table-column
          prop="vip_price"
          label="VIP价格">
        </el-table-column>
      </el-table>
      <el-dialog
        title="添加"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="链接商品：">
            <el-select v-model="form.goodsId" placeholder="请选择">
              <el-option :label="item.goods_name" :value="item.id" v-for="(item,index) in goodsOption" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">增 加</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
import { vipGoodsList ,goodsList ,addVipGoods} from '../../../api/getData.js'
export default {
  name: "mainContent",
  data(){
    return {
      centerDialogVisible:false,
      goodsOption:[],
      form: {
        goodsId:''
      },
      tableData: []
    }
  },
  components: {
   
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){
      let res = await vipGoodsList();
      if(res.code == 0){
        let data = [];
        data.push(res.data);
        this.tableData = data;
      }
    },
    async getGoodsList(){
      let res = await goodsList({
        page_size:10000,
        page:1,
      })
      if(res.code == 0){
        this.goodsOption = res.data.data;
      }
    },
    addNewGoods(){
      this.centerDialogVisible = true;
      this.getGoodsList();
    },
    async onSubmit() {
      if(!this.form.goodsId){
        this.$message({
          message: '请选择关联商品',
          type: 'warning'
        });
        return;
      }else{
        let res = await addVipGoods({goods_id:this.form.goodsId});
        if(res.code == 0){
          this.$message({
              message: '操作成功',
              type: 'success'
          });
          this.centerDialogVisible = false;
          this.getData();
        }else{
          this.$message.error(res.message);
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.content  .center{
  display: flex;
  align-items: center;

}
.content .mr2{
  margin-right: 20px;
}
.content .mb2{
  margin-bottom: 20px;
}
.content  .pubPagation{
  margin-top: 20px;
  float: right;
}
</style>
