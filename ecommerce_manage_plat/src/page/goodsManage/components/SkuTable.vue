<template>
  <div>
    <!-- <el-button @click="doCon">打印</el-button> -->
    <Egrid
      border
      max-height="1200"
      v-bind="$attrs"
      v-on="$listeners"
      :data="data"
      :columns="columns"
      :columns-props="columnsProps"
    ></Egrid>
    <el-row class="mt2">
        <span class="grey">批量设置：</span>
        <el-popover
            placement="top"
            width="160"
            v-model="visibleS">
            <el-input v-model="allStock"></el-input>
            <div style="text-align: right; margin-top:10px ">
                <el-button size="mini" type="text" @click="doCancel('S')">取消</el-button>
                <el-button type="primary" size="mini" @click="doConfirm('S')">确定</el-button>
            </div>
            <el-button slot="reference">库存</el-button>
        </el-popover>
        <el-popover
            placement="top"
            width="160"
            v-model="visibleP">
            <el-input v-model="allPrice"></el-input>
            <div style="text-align: right; margin-top:10px ">
                <el-button size="mini" type="text" @click="doCancel('P')">取消</el-button>
                <el-button type="primary" size="mini" @click="doConfirm('P')">确定</el-button>
            </div>
            <el-button slot="reference">结算价</el-button>
        </el-popover>
        <el-popover
            placement="top"
            width="160"
            v-model="visibleM">
            <el-input v-model="mPrice"></el-input>
            <div style="text-align: right; margin-top:10px ">
                <el-button size="mini" type="text" @click="doCancel('M')">取消</el-button>
                <el-button type="primary" size="mini" @click="doConfirm('M')">确定</el-button>
            </div>
            <el-button slot="reference">市场价</el-button>
        </el-popover>
    </el-row>
  </div>
</template>
<script>
import Vue from "vue";
import { flatten } from "../../../utils/sku";
import { diffArary } from "../../../utils";
export default {
    data: () => ({
        allStock:0,//全部库存
        allPrice:0,//全部价格
        mPrice:0,//全部市场价
        visibleS: false,//库存弹窗
        visibleP: false,//价格弹窗
        visibleM:false,//市场价弹窗
        visible:false,
        data: [],
        coefficient: {
            purchase_coefficient: 0,
            guide_coefficient: 0,
        },
        columnsProps: {
            align: 'center',
            minWidth: 100,
        },
    }),
//   data() {
//     return {
//         allStock:0,//全部库存
//         allPrice:0,//全部价格
//         visibleS: false,//库存弹窗
//         visibleP: false,//价格弹窗
//         visible:false,
//         data: [],
//         coefficient: {
//             purchase_coefficient: 0,
//             guide_coefficient: 0,
//         },
//         columnsProps: {
//             align: 'center',
//             minWidth: 100,
//         },
//     };
//   },
  props: {
    skusData: {
      type: Array,
      default() {
        return [];
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return false;
      }
    },
    skuNums:{
      type: Array,
      default() {
        return [];
      }
    },
  },
  computed: {
    skusList() {
      return flatten(this.skusData).map(item => ({
        skus: item.skus,
        ids: item.skus.reduce(
          (total, prev, index) =>
            `${total}${prev.k_id}:${prev.v_id}${
              index === item.skus.length - 1 ? "" : ";"
            }`,
          ""
        )
      }));
    },

    columns() {
      const specList = this.skusData.map(item => ({
        label: item.value,
        formater(row) {
          const sku = row.skus.find(sku => sku.k === item.value);
          return sku.v;
        }
      }));
      return [
        ...specList,
        {
          label: "库存",
          component: Vue.extend({
            props: ["row"],
            render() {
              return (
                <el-input-Number
                  style="width:100px"
                  placeholder="请输入库存"
                  step={1}
                  min={0}
                  controls={false}
                  precision={0}
                  value={this.row.stock}
                  onInput={e => {this.row.stock = e;}}
                ></el-input-Number>
              );
            }
          })
        },
        {
          label: "结算价",
          component: Vue.extend({
            props: ["row"],
            render() {
              return (
                <el-input-number
                  style="width:100px"
                  placeholder="请输入结算价"
                  value={this.row.settlement_price}
                  step={1}
                  min={0}
                  controls={false}
                  precision={2}
                  onInput={e => (this.row.settlement_price = e)}
                ></el-input-number>
              );
            }
          })
        },
        {
          label: "市场价",
          component: Vue.extend({
            props: ["row"],
            render() {
              return (
                <el-input-number
                  style="width:100px"
                  placeholder="请输入市场价"
                  value={this.row.market_price}
                  step={1}
                  min={0}
                  controls={false}
                  precision={2}
                  onInput={e => (this.row.market_price = e)}
                ></el-input-number>
              );
            }
          })
        },
      ];
    }
  },
  watch: {
    
    skusList: {
      deep: true,
      immediate: true,
      handler(newSkus, oldSkus) {
        if (!newSkus.length) return (this.data = []);
        if (!oldSkus || !oldSkus.length) return this.initData(newSkus);
        if (newSkus.length === oldSkus.length) {
          // 当规格名和规格值数量未发生变化，更新 skus 即可
          return (this.data = newSkus.map((item, index) => ({
            ...this.data[index],
            ...item
          })));
        }

        // 当规格名的数量发生了变化
        if (newSkus[0].skus.length !== oldSkus[0].skus.length)
          return this.initData(newSkus);

        const diffIds = this.diffIds(newSkus, oldSkus);
        if (newSkus.length > oldSkus.length) {
          // 当添加了规格值
          let data = [];
          newSkus.forEach(item => {
            
            const sku = this.data.find(_item => _item.ids === item.ids);
            if (sku) {
              data.push(sku);
            } else {
              data.push({
                ...item,
                stock: 0,//库存
                settlement_price: 0,//结算价
                market_price: 0,//市场价
              });
            }
          });
          this.data = data;
        } else {
          // 当删除了规格值
          this.data = this.data.filter(_item => !diffIds.includes(_item.ids));
        }
      }
    },
    // skuNums:{
    //   deep: true,
    //   immediate: true,
    //   handler(newSkuNums, oldSkuNums) {
    //     
    //     
    //   }
    // }
  },
  methods: {
    doCon(){
        
    },
    doCancel(type){
        if(type=='S'){
            this.visibleS = false;
            this.allStock = 0;
        }else if(type=='P'){
            this.visibleP = false;
            this.allPrice = 0;
        }else{
            this.visibleM = false;
            this.mPrice = 0;
        }
    },
    doConfirm(type){
        if(type=='S'){
            this.visibleS = false;
            
            this.data = this.data.map(item => ({
                ...item,
                // 初始化属性
                stock: this.allStock,
            }))
        }else if(type=='P'){
            this.visibleP = false;
            this.data = this.data.map(item => ({
                ...item,
                settlement_price: this.allPrice,
            }))
        }else{
          this.visibleM = false;
          this.data = this.data.map(item => ({
              ...item,
              market_price: this.mPrice,
          }))
        }
    },
    diffIds(skusList1, skusList2) {
      // 两个数据的 ids 进行相差
      skusList1 = skusList1.map(item => item.ids)
      skusList2 = skusList2.map(item => item.ids)
      return diffArary(skusList1, skusList2)
    },

    initData(skusList) {
      
      
      let newData = [];
      skusList.map((item,index)=>{
        newData.push({
          ...item,
          // 初始化属性
          stock: 0,
          settlement_price: 0,
          market_price: 0,
        })
      })
      newData.map((item,index)=>{
        this.skuNums.map((ptem,pIndex)=>{
          if(ptem.ids == item.properties && index == pIndex) {
            newData[index]['stock'] = ptem.stock;
            newData[index]['settlement_price'] = ptem.settlement_price;
            newData[index]['market_price'] = ptem.market_price;
          }   
        })
      })
      this.data = newData;
      // if(!this.isEdit){
        // this.data = skusList.map(item => ({
        //   ...item,
        //   // 初始化属性
        //   stock: 0,
        //   settlement_price: 0,
        //   market_price: 0,
        // }))
      // }else{
      //   let newData = [];
      //   
      //   this.skuNums.forEach((item,index)=>{
      //     skusList.map((ptem,pIndex) =>{
      //       if(index == pIndex){
      //         newData.push({
      //           ...ptem,
      //           // 初始化属性
      //           stock: item.stock,
      //           settlement_price: item.settlement_price,
      //           market_price: item.market_price,
      //         })
      //       }
      //     })
      //   })
      //   this.data = newData;
      //   
      // }
    },

    setGuideCoefficient() {
      const guide_coefficient = this.coefficient.guide_coefficient
      this.data = this.data.map(item => ({
        ...item,
        purchase_price: (item.guide_price || 0) * guide_coefficient,
      }))
    },

    setPurchaseCoefficient() {
      const purchase_coefficient = this.coefficient.purchase_coefficient
      this.data = this.data.map(item => ({
        ...item,
        sell_price: (item.purchase_price || 0) * purchase_coefficient,
      }))
    },
  },
};
</script>
<style lang="scss" scoped>
    .mt2{
        margin-top: 20px;
    }
    .grey{
        color: #606266;
    }
</style>