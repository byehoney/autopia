<template>
  <div>
    <div class="list_shopcar fix">
      <div>
        <div class="list_shopcar_title">
          <div class="list_shopcar_name">
            <div
              class="list_shopcar_circle"
              :class="checked?'checked':''"
            ></div>
            <span>{{shopHead.syname}}</span>
          </div>
          <div class="list_shopcar_desc">每日采集额:{{shopHead.cjl}}</div>
        </div>
        <div class="list_shopcar_content fix" v-for="(list,index) in shopData.list" :key="index">
          <div class="list_shopcar_circle" :class="list.checked?'checked':''" @click="choose(list)"></div>
          <div class="com_add">
            <div class="list_shopcar_pic">
              <img :src="list.imgurl">
            </div>
            <div class="list_shopcar_com fix">
              <div class="list_shopcar_com_top fix">
                <div class="list_shopcar_com_top_title">
                  <p>{{list.formalname}}</p>
                  <p>{{list.factory}}</p>
                  <p>{{list.specification}}</p>
                  <p>原价:{{list.platformprice}}</p>
                </div>
              </div>
              <div class="list_shopcar_com_bottom fix">
                <div class="list_shopcar_com_price">¥{{list.price}}</div>
                <div class="list_shopcar_com_num">
                  <ul>
                    <li @click="reduce(list)">-</li>
                    <li>
                      <input
                        type="number"
                        v-model="list.packnumber"
                        class="sum"
                        v-on:input="calculate(pro)"
                      >
                    </li>
                    <li @click="add(list)">+</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="shop_gift">
            <div class="shop_gift_top fix">
              <div class="shop_gift_left">
                <h3>商品活动</h3>
              </div>
              <div class="shop_gift_right">
                <div>累积购买可或赠品，点击查看更多活动规则</div>
                <div class="gift_tips" @click="changeMenu(index)">
                  <div :class="menuShow==index?'':'gift_tips_gift'">累积购买可或赠品，点击查看更多活动规则点击查看更多活动规则</div>
                  <div class="gift_tips_menu">
                    <span :class="menuShow==index?'gift_tips_menu_down':'gift_tips_menu_up'"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="shop_gift_bottom">
              <router-link to="/choosegift">选择赠品</router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- 脚部 -->
    </div>
    <!-- 一个商品结束 -->
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
            <span>{{allnum}}</span>
          </div>
          <div class="shop_footer_result">
            <span>结算</span>
            <!-- <span>({{allnum}})</span> -->
          </div>
        </div>
        <div class="shop_footer_right" v-else>
          <div class="remove" @click="del(fetchData)">删除</div>
        </div>
      </mt-tabbar>
    </div>
  </div>
</template>

<script>
import { getCarList } from "@/api/index";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      is_checked: 0,
      checked: false, //是否选中
      menuShow: 0, //商品活动的展开或折叠,
      shopTitle: "", //商店名称
      allnum: "" //价格
    };
  },
  computed: {
    ...mapState({
      // 获取所有数据
      fetchData: state => state.shopCar.fetchData,
      // 获取管理和完成的状态
      shopResult: state => state.shopCar.fetchData.is_success,
      shopData: state => state.shopCar.shopData,
      shopHead: state => state.shopCar.shopHead
    }),
    ...mapGetters("login", [
      "token",
      "userId",
      "corpCode",
      "companyId",
      "userRole"
    ])
  },
  methods: {
    ...mapActions("shopCar", ["getShopMsg"]),
    changeMenu(index) {
      if (this.menuShow == index) {
        this.menuShow = -1;
      } else {
        this.menuShow = index;
      }
    },
    choose(pro) {
      if (!pro.checked) {
        pro.checked = true;
        this.allnum+= pro.price;
      } else {
        pro.checked = false;
        this.allnum -= pro.price;
        console.log(this.allnum)
        console.log(pro.price)
      }
    },
     getCarList(){
        var list=this.$store.state.shopCar.shopData.list
        for(var i=0;i<list.length;i++){
            this.allnum=list[i].allnum
        }
     },
    del(data) {
      var data = data.list;
      for (var i = 0; i < data.length; i++) {
        if (data[i].check) {
          data.splice(i, 1);
          console.log(this.fetchData.status);
          this.fetchData.allchoose--;
          console.log(this.fetchData);
          console.log(this.fetchData.allnum);
          this.fetchData.status = false;
          i--;
        } else {
          for (var j = 0; j < data[i].products.length; j++) {
            var check = data[i].products[j].checked;
            if (check) {
              data[i].products.splice(j, 1);
              --data[i].choose;
              if (data[i].products.length == 0) {
                this.fetchData.allsum = 0;
                data.splice(i, 1);
              }
            }
          }
        }
      }
    }
  },
  async mounted() {
    let defaulParams = {
      token: this.token,
      userId: this.userId,
      corpCode: this.corpCode,
      companyId: this.companyId,
      userRole: this.userRole
    };

    await this.getShopMsg(defaulParams);
    await this.getCarList()
    // console.log(this.$store.state.shopCar.shopData.list)
  }
};
</script>

<style scoped>
.list_shopcar {
  padding-left: 38px;
  background: #fff;
  min-height: 547px;
}
.list_shopcar_title {
  min-height: 54px;
  padding-top: 20px;
  font-size: 26px;
  color: #666;
  line-height: 40px;
  font-weight: 900;
  border-bottom: 1px solid #d8d8d8;
}
.list_shopcar_name {
  float: left;
}
.list_shopcar_name span:nth-of-type(2) {
  display: inline-block;
  width: 26px;
  height: 23px;
  background: url("../images/car_dianpu.png") no-repeat center;
  background-size: 100%;
  margin-right: 8px;
}
.list_shopcar_desc {
  float: right;
  font-size: 18px;
  color: #666666;
  margin-right: 23px;
  font-weight: 400;
}
.list_shopcar_content {
  padding-top: 21px;
  font-size: 24px;
  color: #666;
  min-height: 200px;
  border-bottom: 1px solid #d8d8d8;
  background: #fff;
}
.list_shopcar_content:last-child {
  border-bottom: none;
}
.list_shopcar_circle {
  width: 40px;
  height: 40px;
  background: url("../images/car_circle.png") no-repeat center;
  background-size: 100%;
  margin-right: 8px;
  float: left;
}
.list_shopcar_com_bottom {
  width: 380px;
}
.checked {
  background: url("../images/car_checkcircle.png") no-repeat center;
  background-size: 100%;
}
.com_add {
  min-height: 219px;
  border-bottom: 1px solid #d8d8d8;
}
.list_shopcar_pic {
  width: 220px;
  height: 176px;
  background: #ccc;
  float: left;
  margin-right: 28px;
}
.list_shopcar_pic img {
  width: 100%;
  height: 100%;
}
.list_shopcar_com {
  float: left;
  line-height: 35px;
  /* min-height: 70px; */
}
.list_shopcar_com_top {
  /* margin-bottom: 25px; */
}
.list_shopcar_com_top_title {
  float: left;
}
.list_shopcar_com_top_title p {
  font-size: 18px;
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list_shopcar_com_top_title p:first-child {
  font-size: 26px;
}
.list_shopcar_com_top_title p:last-child {
  text-decoration: line-through;
  text-decoration-color: red;
  -moz-text-decoration-color: red; /* 针对 Firefox 的代码 */
}
.list_shopcar_com_top_gift {
  float: right;
  color: #ff0000;
  font-size: 18px;
}
.gift_tips {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
.gift_tips_gift {
  height: 40px;
  overflow: hidden;
}
.gift_tips_menu {
  position: relative;
}
.gift_tips_menu_up {
  display: block;
  position: absolute;
  top: 17px;
  height: 10px;
  width: 10px;
  transform: rotate(316deg);
  -webkit-transform: rotate(316deg);
  border-left: 2px solid transparent;
  border-bottom: 2px solid transparent;
  border-right: 2px solid #999999;
  border-top: 2px solid #999999;
}
.gift_tips_menu_down {
  display: block;
  position: absolute;
  top: 10px;
  height: 10px;
  width: 10px;
  transform: rotate(316deg);
  -webkit-transform: rotate(316deg);
  border-left: 2px solid #999;
  border-bottom: 2px solid #999;
  border-right: 2px solid transparent;
  border-top: 2px solid transparent;
}
.shop_gift {
  margin-left: 47px;
  width: 618px;
  min-height: 40px;
  margin-top: 12px;
  margin-bottom: 15px;
  line-height: 40px;
  font-size: 20px;
}
.shop_gift_top {
  display: flex;
  color: #999;
  margin-bottom: 18px;
}
.shop_gift_left h3 {
  color: #ff1900;
  font-weight: 400;
  width: 100px;
  margin-right: 26px;
}
.shop_gift_bottom {
  width: 104px;
  height: 43px;
  border: 1px solid #4a90e2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}
.shop_gift_bottom a {
  color: #4a90e2;
}
.list_shopcar_com_price {
  float: left;
  margin-top: 10px;
  font-size: 28px;
  color: #ff0000;
}
.list_shopcar_com_num {
  float: right;
}
.list_shopcar_com_num ul li {
  width: 48px;
  height: 48px;
  float: left;
  border: 1px solid #ccc;
  line-height: 47px;
  text-align: center;
}
.list_shopcar_com_num ul li:nth-of-type(2) {
  width: 80px;
}
.list_shopcar_com_num ul li input {
  width: 70px;
  height: 43px;
  /* border: 1px solid #ccc; */
  /* border-left:none;
  border-top:none; */
  text-align: center;
}
.list_shopcar_com_num ul li:nth-of-type(2),
.list_shopcar_com_num ul li:nth-of-type(3) {
  border-left: none;
}
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
  /* margin-right: 11px; */
  position: relative;
  /* top: 10px; */
  background: url("../images/car_checkcircle.png") no-repeat left 50%;
  background-size: 100%;
}
/*  */
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
