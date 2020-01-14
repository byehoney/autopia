<template>
    <div>
        <el-dialog
            center
            title="价格调整"
            :visible.sync="popVisible"
            width="60%"
            >
            <el-row class="mt2">商品名称：{{goodsName}}</el-row>
            <el-row class="mt2">
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="3">&nbsp;</el-col>
                <el-col :span="4">结算价(元)</el-col>
                <el-col :span="4">平台成本</el-col>
                <el-col :span="4">普通价</el-col>
                <el-col :span="4">VIP价</el-col>
                <el-col :span="4">市场价</el-col>
            </el-row>
            <template v-if="infos.length">
                <el-row class="mt2 vFlex" v-for="(item,index) in infos" :key="index">
                    <el-col :span="1">{{index+1}}</el-col>
                    <el-col :span="3">{{item.sku_name}}</el-col>
                    <el-col :span="4">
                        <el-input-number style="width:100px" :controls="false" v-model="item.settlement_price"  :precision="2" :min="0" ></el-input-number>
                    </el-col>
                    <el-col :span="4">
                        <el-input-number style="width:100px" :controls="false" v-model="item.platform_cost_price"  :precision="2" :min="0"></el-input-number>
                    </el-col>
                    <el-col :span="4">
                        <el-input-number style="width:100px" :controls="false" v-model="item.ordinary_price"  :precision="2"  :min="0"></el-input-number>
                    </el-col>
                    <el-col :span="4">
                        <el-input-number style="width:100px" :controls="false" v-model="item.vip_price"  :precision="2" :min="0"></el-input-number>
                    </el-col>
                    <el-col :span="4">
                        <el-input-number style="width:100px" :controls="false" v-model="item.market_price"   :precision="2" :min="0"></el-input-number>
                    </el-col>
                </el-row>
                <el-row class="mt2 vFlex">
                    <el-col :span="4">批量调整</el-col>
                    <el-col :span="4">
                        <el-input-number v-model="settlement_price" style="width:100px" :controls="false"  :precision="2"  :min="0" ></el-input-number>
                        <el-button @click="setPrice(0)">确定</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-input-number v-model="platform_cost_price" style="width:100px" :controls="false"  :precision="2" :min="0"></el-input-number>
                        <el-button @click="setPrice(1)">确定</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-input-number v-model="ordinary_price" style="width:100px" :controls="false"  :precision="2" :min="0"></el-input-number>
                        <el-button @click="setPrice(2)">确定</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-input-number v-model="vip_price" style="width:100px" :controls="false"  :precision="2" :min="0"></el-input-number>
                        <el-button @click="setPrice(3)">确定</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-input-number v-model="market_price" style="width:100px" :controls="false"  :precision="2" :min="0"></el-input-number>
                        <el-button @click="setPrice(4)">确定</el-button>
                    </el-col>
                </el-row>
            </template>
            <!-- <el-row class="mt2">
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="3">全部规格</el-col>
                <el-col :span="4">
                    <el-input-number style="width:100px" :controls="false"   :min="0"  label="结算价"></el-input-number>
                </el-col>
                <el-col :span="4">
                    <el-input-number style="width:100px" :controls="false"   :min="0"  label="结算价"></el-input-number>
                </el-col>
                <el-col :span="4">
                    <el-input-number style="width:100px" :controls="false"   :min="0"  label="结算价"></el-input-number>
                </el-col>
                <el-col :span="4">
                    <el-input-number style="width:100px" :controls="false"   :min="0"  label="结算价"></el-input-number>
                </el-col>
                <el-col :span="4">
                    <el-input-number style="width:100px" :controls="false"   :min="0"  label="结算价"></el-input-number>
                </el-col>
            </el-row> -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doSave">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { goodInfo ,setGoodsPrice} from '../../../api/getData';
export default {
    data(){
      return{
        popVisible:false,
        infos:[],
        settlement_price:0,
        market_price:0,
        platform_cost_price:0,
        ordinary_price:0,
        vip_price:0,
        curGoodsId:'',
        goodsName:'',
        draft:''
      }
    },
    methods:{
        async showDetail(row,draft){
            this.curGoodsId = row.id;
            this.goodsName = row.goods_name;
            this.draft = draft;
            let data ={
                id:row.id,
                draft:draft
            };
            
            let res = await goodInfo(data);
            if(res.code == 0){  
                this.popVisible = true;
                this.infos = res.data;
            }else{
                this.$message.error(res.message);
            }
        },
        setPrice(order){
            if(order==0){
                this.infos.map((item,index)=>{
                    this.$set(this.infos[index],'settlement_price',this.settlement_price)
                })
            }else if(order == 1){
                this.infos.map((item,index)=>{
                    this.$set(this.infos[index],'platform_cost_price',this.platform_cost_price)
                })
            }else if(order == 2){
                this.infos.map((item,index)=>{
                    this.$set(this.infos[index],'ordinary_price',this.ordinary_price)
                })
            }else if(order == 3){
                this.infos.map((item,index)=>{
                    this.$set(this.infos[index],'vip_price',this.vip_price)
                })
            }else if(order == 4){
                this.infos.map((item,index)=>{
                    this.$set(this.infos[index],'market_price',this.market_price)
                })
            }
        },
        async opSave(){
            let goods_price = [];
            this.infos.map(item=>{
                goods_price.push({
                    id:item.id,
                    settlement_price:item.settlement_price,
                    platform_cost_price:item.platform_cost_price,
                    ordinary_price:item.ordinary_price,
                    vip_price:item.vip_price,
                    market_price:item.market_price
                })
            })
            let res = await setGoodsPrice({goods_id:this.curGoodsId,goods_price:goods_price,draft:this.draft});
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
        },
        doSave(){
            this.settlement_price=0;
            this.market_price = 0;
            this.platform_cost_price = 0;
            this.ordinary_price = 0;
            this.vip_price = 0;
            this.opSave();
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
    .vFlex{
        display: flex;
        align-items: center;
    }
</style>