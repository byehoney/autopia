<template>
    <div class="priceBox">
        <el-row>
            <el-col :span="24" class="top">
                <el-button-group>
                    <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">价格比例设定</el-button>
                    <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">返佣设定</el-button>
                    <!-- <el-button type="groupBtn" :class="['groupBtn',actTab==2?'active':'']" plain @click="changeType(2)">发货时间</el-button> -->
                </el-button-group>
            </el-col>
        </el-row>
        <el-row style="margin-top:100px" v-if="actTab==0">
            <el-form  :model="priceForm" label-width="180px">
                <el-form-item class="hFlex" label="平台成本价加价比例：">
                    <div  class="mr2">
                        <el-input-number class="mr2" style="width:150px;" v-model="priceForm.cbPrice" :controls="false" :precision="2" :step="0.1" :max="100"></el-input-number>%
                    </div>
                    <div class="vFlex">
                        <div class="tip">请输入百分比，支持小数点后两位，例如：10.87%</div>
                        <div class="tip">（1+平台成本价加价比例）X结算价=平台成本价</div>
                    </div>
                </el-form-item>
                <el-form-item class="hFlex" label="普通价加价比例：">
                    <div class="mr2">
                        <el-input-number class="mr2" style="width:150px;" v-model="priceForm.ptPrice" :controls="false" :precision="2" :step="0.1" :max="100"></el-input-number>%
                    </div>
                    <div class="vFlex">
                        <div class="tip">请输入百分比，支持小数点后两位，例如：10.87%</div>
                        <div class="tip">（1+普通价加价比例）X平台成本价=普通价</div>
                    </div>
                </el-form-item>
                <el-form-item class="hFlex" label="VIP价加价比例：">
                    <div class="mr2">
                        <el-input-number class="mr2" style="width:150px;" v-model="priceForm.vPrice" :controls="false" :precision="2" :step="0.1" :max="100"></el-input-number>%
                    </div>
                    <div class="vFlex">
                        <div class="tip">请输入百分比，支持小数点后两位，例如：10.87%</div>
                        <div class="tip">（1+VIP价加价比例）X平台成本价=VIP价</div>
                    </div>
                </el-form-item>
            </el-form>
            <el-row class="hFlex mt2">
                <el-button type="primary" @click="doSave">保存</el-button>
            </el-row>
        </el-row>
        <el-row style="margin-top:100px" v-if="actTab==1">
            <el-form  :model="priceForm" label-width="220px">
                <el-form-item class="hFlex" label="VIP自购返佣比例：">
                    <div  class="mr2">
                        <el-input-number class="mr2" style="width:150px;" v-model="priceForm.vRake" :controls="false" :precision="2" :step="0.1" :max="100"></el-input-number>%
                    </div>
                    <div class="vFlex">
                        <div class="tip">请输入百分比，支持小数点后两位，例如：10.87%</div>
                        <div class="tip">（VIP价-平台成本价）X VIP自购返佣比例=VIP自购返佣金额</div>
                    </div>
                </el-form-item>
                <el-form-item class="hFlex" label="VIP用户的上级用户返佣比例：">
                    <div class="mr2">
                        <el-input-number class="mr2" style="width:150px;" v-model="priceForm.vfRake" :controls="false" :precision="2" :step="0.1" :max="100"></el-input-number>%
                    </div>
                    <div class="vFlex">
                        <div class="tip">请输入百分比，支持小数点后两位，例如：10.87%</div>
                        <div class="tip">（VIP价-平台成本价）X VIP用户的上级用户返佣比例=VIP用户的上级用户返佣金额</div>
                    </div>
                </el-form-item>
                <el-form-item class="hFlex" label="普通用户的上级用户返佣比例：">
                    <div class="mr2">
                        <el-input-number class="mr2" style="width:150px;" v-model="priceForm.cRake" :controls="false" :precision="2" :step="0.1" :max="100"></el-input-number>%
                    </div>
                    <div class="vFlex">
                        <div class="tip">请输入百分比，支持小数点后两位，例如：10.87%</div>
                        <div class="tip">（普通价-平台成本价）X 普通用户的上级用户返佣比例=普通用户的上级用户返佣金额</div>
                    </div>
                </el-form-item>
                <el-form-item class="hFlex" label="礼包商品返佣金额：">
                    <div class="mr2">
                        <el-input-number class="mr2" style="width:150px;" v-model="priceForm.pRake" :controls="false" :precision="2" :step="0.1"></el-input-number>元
                    </div>
                    <div class="vFlex">
                        <div class="tip">会员礼包分销收益，每发展一名新会员获得的返佣</div>
                    </div>
                </el-form-item>
                <el-form-item class="hFlex" label="">
                    <el-button type="primary" @click="doSave">保存</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row style="margin-top:100px" v-if="actTab==2">
            <el-row style="text-align:center;color:#606266;margin-bottom:20px">特殊情况长期不发货时，可在此设置恢复发货日期。设置后所有商品的发货时间提示统一完成修改。</el-row>
            <el-form  :model="priceForm" label-width="240px">
                <el-form-item class="hFlex" label="礼包商品返佣金额：">
                    <div class="mr2">
                        <el-date-picker
                            v-model="priceForm.date"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item class="hFlex" label="商品详情页发货提示文字将显示：">
                    <div class="mr2" style="color:#606266;">
                        现在付款，{{priceForm.date}}开始陆续发货
                    </div>
                </el-form-item>
                <el-form-item class="hFlex" label="">
                    <el-button type="primary" @click="doSave">保存</el-button>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>
<script>
import {platPrice ,platPriceSet} from '../../api/getData'
export default {
    data(){
        return{
            actTab:0,//当前激活按钮
            priceForm:{
                cbPrice:'',
                ptPrice:'',
                vPrice:'',
                vRake:'',
                vfRake:'',
                cRake:'',
                pRake:'',
                date:''
            },
            rakeForm:{

            }
        }
    },
    mounted(){
        this.getData();
    },
    methods:{
        changeType(index){
            this.actTab = index;
            this.getData();
        },
        async getData(){
            let res = await platPrice();
            if(res.code == 0) {
                this.priceForm.cbPrice = res.data.platform_cost_markup_ratio;
                this.priceForm.ptPrice = res.data.common_price_markup_ratio;
                this.priceForm.vPrice = res.data.vip_price_markup_ratio;
                this.priceForm.vRake = res.data.vip_self_profit_ratio;
                this.priceForm.vfRake = res.data.vip_higher_profit_ratio;
                this.priceForm.cRake = res.data.ordinary_user_profit_ratio;
                this.priceForm.pRake = res.data.vip_goods_profit_money;
            }else{
                this.$message.error(res.message);
            }
        },
        async doSave(){
            let data = {};
            if(this.actTab == 0){
                if(!this.priceForm.cbPrice){
                    this.$message.error('请填写平台成本价加价比例');
                    return;
                }else if(!this.priceForm.ptPrice){
                    this.$message.error('请填写普通价加价比例');
                    return;
                }else if(!this.priceForm.vPrice){
                    this.$message.error('请填写VIP价加价比例');
                    return;
                }else{
                    data = {
                        type:0,
                        platform_cost_markup_ratio:this.priceForm.cbPrice,
                        common_price_markup_ratio:this.priceForm.ptPrice,
                        vip_price_markup_ratio:this.priceForm.vPrice
                    }
                }
            }else if(this.actTab==1){
                if(!this.priceForm.vRake){
                    this.$message.error('请填写VIP自购返佣比例');
                    return;
                }else if(!this.priceForm.vfRake){
                    this.$message.error('请填写VIP用户的上级用户返佣比例');
                    return;
                }else if(!this.priceForm.cRake){
                    this.$message.error('请填写普通用户的上级用户返佣比例');
                    return;
                }else if(!this.priceForm.pRake){
                    this.$message.error('请填写礼包商品返佣金额');
                    return;
                }else{
                    data = {
                        type:1,
                        vip_self_profit_ratio:this.priceForm.vRake,
                        vip_higher_profit_ratio:this.priceForm.vfRake,
                        ordinary_user_profit_ratio:this.priceForm.cRake,
                        vip_goods_profit_money:this.priceForm.pRake
                    }
                }
            }
            let res = await platPriceSet(data);
            if(res.code == 0){
                this.$message({
                type: 'success',
                message: '操作成功!'
                });
                this.getData();
            }else{
                this.$message.error(res.message);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.mr2{
    margin-right: 5px;
}
.mt2{
    margin-top: 50px;
}
.hFlex{
    display: flex;
    align-items: center;
    justify-content: center;
}

.vFlex{
    display: flex;
    flex-direction: column;
    align-items: center;
    color:#606266;
    width: 320px;
}
.top{
    border-bottom: 1px solid #e5e5e5;
    .groupBtn{
        border-bottom: none!important;
    }
    .active{
        background-color: #409eff;
        color: #fff;
    }
}
</style>