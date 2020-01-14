<template>
    <div>
        <el-dialog
            center
            title="返佣比例调整"
            :visible.sync="popVisible"
            width="60%"
            >
            <el-row class="mt2">商品名称：{{goodsName}}</el-row>
            <el-row class="mt2">
                <el-col :span="3">&nbsp;</el-col>
                <el-col :span="3">&nbsp;</el-col>
                <el-col :span="6">VIP自购</el-col>
                <el-col :span="6">VIP上级</el-col>
                <el-col :span="6">普通用户上级</el-col>
            </el-row>
            <template v-if="infos.length">
                <el-row class="mt2 vFlex" v-for="(item,index) in infos" :key="index">
                    <el-col :span="3">{{index+1}}</el-col>
                    <el-col :span="3">{{item.sku_name}}</el-col>
                    <el-col :span="6">
                        <el-input-number style="width:100px" :controls="false" v-model="item.vip_self_profit_ratio" :precision="2"  :min="0"></el-input-number>%
                    </el-col>
                    <el-col :span="6">
                        <el-input-number style="width:100px" :controls="false" v-model="item.vip_higher_profit_ratio"  :precision="2" :min="0"></el-input-number>%
                    </el-col>
                    <el-col :span="6">
                        <el-input-number style="width:100px" :controls="false" v-model="item.ordinary_user_profit_ratio" :precision="2"  :min="0"></el-input-number>%
                    </el-col>
                </el-row>
                <el-row class="mt2 vFlex">
                    <el-col :span="6">批量调整</el-col>
                    <el-col :span="6">
                        <el-input-number v-model="vip_self_profit_ratio" style="width:100px" :controls="false"   :min="0" :precision="2"></el-input-number>%
                        <el-button @click="setRake(0)">确定</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-input-number v-model="vip_higher_profit_ratio" style="width:100px" :controls="false"   :min="0" :precision="2"></el-input-number>%
                        <el-button @click="setRake(1)">确定</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-input-number v-model="ordinary_user_profit_ratio" style="width:100px" :controls="false"   :min="0"  :precision="2"></el-input-number>%
                        <el-button @click="setRake(2)">确定</el-button>
                    </el-col>
                </el-row>
            </template>
            <!-- <el-row class="mt2" v-if="!infos.length">
                <el-col :span="6">全部规格</el-col>
                <el-col :span="6">
                    <el-input-number style="width:100px" :controls="false"   :min="0"  label="结算价"></el-input-number>%
                </el-col>
                <el-col :span="6">
                    <el-input-number style="width:100px" :controls="false"   :min="0"  label="结算价"></el-input-number>%
                </el-col>
                <el-col :span="6">
                    <el-input-number style="width:100px" :controls="false"   :min="0"  label="结算价"></el-input-number>%
                </el-col>
            </el-row> -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doSave">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { goodInfo,setGoodsRake } from '../../../api/getData'
export default {
    data(){
      return{
        popVisible:false,
        infos:[],
        curGoodsId:'',
        goodsName:'',
        vip_self_profit_ratio:0,
        vip_higher_profit_ratio:0,
        ordinary_user_profit_ratio:0,
        draft:''
      }
    },
    methods:{
        async showDetail(row,draft){
            this.curGoodsId = row.id;
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
        setRake(order){
            if(order==0){
                this.infos.map((item,index)=>{
                    this.$set(this.infos[index],'vip_self_profit_ratio',this.vip_self_profit_ratio)
                })
            }else if(order == 1){
                this.infos.map((item,index)=>{
                    this.$set(this.infos[index],'vip_higher_profit_ratio',this.vip_higher_profit_ratio)
                })
            }else if(order == 2){
                this.infos.map((item,index)=>{
                    this.$set(this.infos[index],'ordinary_user_profit_ratio',this.ordinary_user_profit_ratio)
                })
            }
        },
        async opSave(){
            let rake_back = [];
            this.infos.map(item=>{
                rake_back.push({
                    id:item.id,
                    vip_self_profit_ratio:item.vip_self_profit_ratio,
                    vip_higher_profit_ratio:item.vip_higher_profit_ratio,
                    ordinary_user_profit_ratio:item.ordinary_user_profit_ratio,
                })
            })
            let res = await setGoodsRake({goods_id:this.curGoodsId,rake_back:rake_back,draft:this.draft});
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
            this.vip_self_profit_ratio=0;
            this.vip_higher_profit_ratio = 0;
            this.ordinary_user_profit_ratio = 0;
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