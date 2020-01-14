<template>
    <div>
        <el-dialog
            center
            title="结算价"
            :visible.sync="popVisible"
            width="50%"
            >
            <el-row>商品名称：{{goodsName}}</el-row>
            <template>
                <el-row class="mt2" v-for="(item,index) in infos" :key="index">
                    <el-col :span="8">{{index+1}}</el-col>
                    <el-col :span="8">{{item.sku_name}}</el-col>
                    <el-col :span="8">{{item.settlement_price}} 元</el-col>
                </el-row>
            </template>
            <!-- <el-row class="mt2" v-if="!infos.length">
                <el-col :span="12">全部规格</el-col>
                <el-col :span="12">1000.00元</el-col>
            </el-row> -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="popVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { checkSettlementPrice } from '../../../api/getData'
export default {
    data(){
      return{
        popVisible:false,
        infos:[],
        goodsName:'',
        
      }
    },
    methods:{
        showDetail(row,draft){
            this.popVisible = true;
            
            this.getPrice(row.id,draft);
            this.goodsName = row.goods_name;
        },
        async getPrice(id,draft){
            let res = await checkSettlementPrice({id:id,draft:draft});
            if(res.code == 0){
                this.infos = res.data;
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
</style>