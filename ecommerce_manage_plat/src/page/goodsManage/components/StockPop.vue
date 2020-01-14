<template>
    <div>
        <el-dialog
            center
            title="调整库存"
            :visible.sync="popVisible"
            width="30%"
            >
            <el-row>商品名称：{{goodsName}}</el-row>
            <template v-if="infos.length">
                <el-row class="mt2 vertical" v-for="(item,index) in infos" :key="index">
                    <el-col :span="8">{{index+1}}</el-col>
                    <el-col :span="8">{{item.sku_name}}</el-col>
                    <el-col :span="8">
                        <el-input-number style="width:100px" :controls="false" v-model="item.stock"  :precision="0" :min="0" ></el-input-number>
                        <!-- <span>{{item.stock}}</span> -->
                    </el-col>
                </el-row>
            </template>
            <!-- <el-row class="mt2 vertical" v-if="!infos.length">
                <el-col :span="12">全部规格</el-col>
                <el-col :span="12">
                    <el-input v-model="infos" placeholder="请输入内容"></el-input>
                </el-col>
            </el-row> -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doSave">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { goodInfo ,setGoodsStock} from '../../../api/getData';
export default {
    data(){
      return{
        popVisible:false,
        infos:[],
        goodsName:'',
        curGoodsId:'',
        draft:''
      }
    },
    methods:{
        async showDetail(row,draft){
            this.curGoodsId = row.id;
            this.infos = row;
            this.goodsName = row.goods_name;
            this.draft = draft;
            let res = await goodInfo({id:row.id,draft:draft});
            if(res.code == 0){  
                this.popVisible = true;
                this.infos = res.data;
            }else{
                this.$message.error(res.message);
            }
        },
        async doSave(){
            let goods_sku = [];
            this.infos.map(item=>{
                goods_sku.push({
                    id:item.id,
                    stock:item.stock
                })
            })
            let res = await setGoodsStock({goods_id:this.curGoodsId,goods_sku:goods_sku,draft:this.draft});
            if(res.code == 0){
                this.popVisible = false;
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
                this.$parent.getData();
            }else{
                this.$message.error(res.message);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .mt2{
        margin-top: 20px;
    }
    .mb1{
        margin-bottom: 10px;
    }
    .vertical{
        display: flex;
        align-items: center;
    }
</style>