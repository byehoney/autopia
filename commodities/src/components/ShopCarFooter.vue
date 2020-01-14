<template>
  <div>
    <mt-tabbar fixed class="shop_footer">
      <div class="shop_footer_left" @click="cartchoose()">
        <span :class="this.fetchData.status?'checked':'first'"></span>
        <span>全选</span>
      </div>
      <div class="shop_footer_right" v-if="shopResult">
        <div class="shop_footer_price">
          <span>合计：</span>
          <span>¥</span>
          <span>{{this.fetchData.allsum}}</span>
        </div>
        <div class="shop_footer_result">
          <span>结算</span>
          <span>({{this.fetchData.allnum}})</span>
        </div>
      </div>
      <div class="shop_footer_right" v-else>
        <div class="remove" @click="del(fetchData)">删除</div>
      </div>
    </mt-tabbar>
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      fetchData: state => state.shopCar.fetchData,
      shopResult: state => state.shopCar.fetchData.is_success
    })
  },
  methods: {
    ...mapMutations("shopCar", ["manage"]),
    choosetrue(item, list) {
      list.checked = true; //将商品选中状态改为true
      ++this.fetchData.allnum;
      ++item.choose === item.products.length ? (item.check = true) : ""; //这里执行了两部，选中商品数量先+1，再与该店铺商品数量比较，如果相等就更改店铺选中状态为true
      item.check
        ? ++this.fetchData.allchoose === this.fetchData.list.length
          ? (this.fetchData.status = true)
          : (this.fetchData.status = false)
        : ""; //如果店铺选中状态改为true，选中店铺数量先+1，再与店铺数量比较，如果相等就更改全选选中状态为true
      this.fetchData.allsum += list.sum;
      // this.fetchData.is_success = false;
    },
    choosefalse(item, list) {
      list.checked = false; //将商品选中状态改为false
      --this.fetchData.allnum;
      --item.choose; //选中商品数量-1
      if (item.check) {
        //如果店铺是被选中的，更改店铺选中状态
        item.check = false;
        --this.fetchData.allchoose; //并且选中店铺数量-1
      }
      this.fetchData.status = false; //无论之前全选的状态，将其改为false就行
      // this.fetchData.is_success = true;
      this.fetchData.allsum -= list.sum;
    },
    shoptrue(item) {
      item.products.forEach(pro => {
        pro.checked === false ? this.choosetrue(item, pro) : "";
      });
    }, //循环店铺中的商品，先筛选出目前没选中的商品，给它执行choosetrue函数
    shopfalse(item) {
      item.products.forEach(pro => {
        pro.checked === true ? this.choosefalse(item, pro) : "";
      });
    },
    cartchoose() {
      // this.fetchData.is_success=false
      var item = this.fetchData.list;
      console.log(this.fetchData.status);
      this.fetchData.status = !this.fetchData.status; //取反改变状态
      this.fetchData.status
        ? this.fetchData.list.forEach(item => this.shoptrue(item))
        : this.fetchData.list.forEach(item => this.shopfalse(item));
    },
    del(data) {
      var data = data.list;
      for (var i = 0; i <data.length; i++) {
        if (data[i].check) {
          data.splice(i, 1);
          i--
        } else {
          for (var j = 0; j < data[i].products.length; j++) {
            var check = data[i].products[j].checked;
            if (check) {
              data[i].products.splice(j, 1);
              --data[i].choose
              if (data[i].products.length == 0) {
                data.splice(i, 1);
              }
            }
          }
        }
      }
    }
  },
  mounted(){

  }
};
</script>

<style scoped lang="scss">
.shop_footer {
  background: #fff !important;
  min-height: 98px;
  font-size: 26px;
  line-height: 98px;
  color: #666;
}
.shop_footer_left {
  width: 244px;
  height: 98px;
  float: left;
}
.shop_footer_left span {
  display: inline-block;
}
.shop_footer_left span.first {
  width: 40px;
  height: 40px;
  margin-right: 11px;
  position: relative;
  top: 10px;
  background: url("../images/car_circle.png") no-repeat left 50%;
  background-size: 100%;
}
.checked {
  width: 40px;
  height: 40px;
  margin-right: 11px;
  position: relative;
  top: 10px;
  background: url("../images/car_checkcircle.png") no-repeat left 50%;
  background-size: 100%;
}
.shop_footer_right {
  width: 506px;
  float: left;
}
.remove {
  width: 134px;
  height: 68px;
  line-height: 70px;
  text-align: center;
  color: #ff0000;
  font-size: 28px;
  border: 2px solid #ff0000;
  border-radius: 50px;
  float: right;
  margin-top: 15px;
  margin-right: 39px;
}
.shop_footer_price {
  float: left;
  margin-left: 90px;
}
.shop_footer_price span {
  color: #ff0000;
}
.shop_footer_price span:first-child {
  color: #333;
}
.shop_footer_result {
  width: 244px;
  height: 98px;
  background: url("../images/result.png") no-repeat top;
  background-size: 100%;
  color: #fff;
  float: right;
}
.shop_footer_result img {
  width: 100%;
}
</style>
