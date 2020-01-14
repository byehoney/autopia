<template>
    <div>
        <el-dialog
            center
            title="调整库存"
            :visible.sync="popVisible"
            width="50%"
            >
            <el-row>商品名称：{{goodsName}}</el-row>
            <template>
                <el-row class="mt2 vertical" v-for="(item,index) in infos" :key="index">
                    <el-col :span="8">{{index+1}}</el-col>
                    <el-col :span="8">{{item.sku_name}}</el-col>
                    <el-col :span="8">
                        <el-input-number v-model="item.stock" placeholder="请输入内容" :controls="false" :precision="0"></el-input-number> 件
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
import { checkSettlementPrice ,modifyStock} from '../../../api/getData'
export default {
    data(){
      return{
        popVisible:false,
        infos:[],
        goodsName:'',
        curId:'',//当前修改商品id
        draft:''
      }
    },
    methods:{
        showDetail(row,draft){
            this.popVisible = true;
            this.getStock(row.id,draft);
            this.goodsName = row.goods_name; 
            this.curId = row.id;
            this.draft = draft;
        },
        async getStock(id,draft){
            let res = await checkSettlementPrice({id:id,draft:draft});
            if(res.code == 0){
                this.infos = res.data;
            }
        },
        async doSave(){
            
            let goods_sku_draft = [];
            this.infos.forEach((item,index)=>{
                goods_sku_draft.push({id:item.id,stock:item.stock});
            })
            let res = await modifyStock({goods_id:this.curId,goods_sku_draft:goods_sku_draft,draft:this.draft});
            if(res.code == 0){
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.popVisible = false;
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