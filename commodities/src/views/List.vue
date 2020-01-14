<template>
  <div class="list_wrap">
    <LocalHeader/>
    <div class="shop_nav">
      <ul>
        <li>销量</li>
        <li>价格</li>
        <li>主推</li>
        <li>筛选</li>
      </ul>
    </div>
    <div class="shop_list">
      <ul>
        <li v-for="(item,index) in shopList" :key="index">
        <router-link to="/detail">
          <div class="shop_pic">
            <img src>
          </div>
          <div class="shop_info">
            <div class="shop_title">{{item.title}}</div>
            <div class="shop_desc">{{item.desc}}</div>
            <div class="shop_content">
              <!-- <div class="shop_tag">
                <div class="shop_tag_list">
                  <span>{{item.tags}}</span>
                  <span>{{item.rebate}}</span>
                  <div class="shop_price">
                    <ul>
                      <li>{{item.price}}</li>
                      <li>{{item.oldprice}}</li>
                    </ul>
                    <div style="clear:both"></div>
                  </div>
                </div>
              </div>-->
              <div class="shop_car">
                <img src>
                <p>
                  <span>已销:</span>
                  <span>70</span>
                </p>
              </div>
            </div>
          </div>
          </router-link>
        </li>
      </ul>
      <div style="clear:both"></div>
    </div>
  </div>
</template>

<script>
import LocalHeader from "@/components/Header";
export default {
  data() {
    return {
      shopList: [
        {
          title: "烟花商品名称500g",
          desc: "路尼克（广州）烟花制造厂",
          tags: "星选",
          rebate: "8.8折",
          price: "$6.5",
          oldprice: "8.8",
          sale: "70"
        },
        {
          title: "烟花商品名称500g",
          desc: "路尼克（广州）烟花制造厂",
          tags: "星选",
          rebate: "8.8折",
          price: "$6.5",
          oldprice: "8.8",
          sale: "70"
        },
        {
          title: "烟花商品名称500g",
          desc: "路尼克（广州）烟花制造厂",
          tags: "星选",
          rebate: "8.8折",
          price: "$6.5",
          oldprice: "8.8",
          sale: "70"
        }
      ]
    };
  },
  components: {
    LocalHeader
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
ul li {
  list-style: none;
}
a {
  text-decoration: none;
  color: #333;
}
.list_wrap {
  background: #e5e5e5;
}
.shop_nav {
  width: 704px;
  height: 43px;
  background: #fff;
  padding: 25px 46px;
  margin-bottom: 6px;
}
.shop_nav ul li {
  float: left;
  font-size: 28px;
  line-height: 43px;
  margin-right: 138px;
  color: #333;
}
.shop_nav ul li:last-child {
  margin-right: 0;
}
.shop_list {
  width: 750px;
  /* background: #fff; */
  /* padding: 11px 24px; */
}
.shop_list ul li {
  min-height: 245px;
  margin-bottom: 2px;
  background: #fff;
}
.shop_pic {
  width: 207px;
  height: 207px;
  border: 1px solid #f00;
  float: left;
  margin-left: 45px;
  margin-top: 18px;
}
.shop_pic img {
  width: 100%;
}
.shop_info {
  width: 415px;
  float: left;
  margin-left: 45px;
  margin-top: 8px;
  line-height: 50px;
}
.shop_title {
  width: 240px;
  font-size: 28px;
  color: #333;
}
.shop_desc {
  font-size: 22px;
}
.shop_content {
}
.shop_tag_list {
  font-size: 18px;
}
.shop_tag_list span {
  display: inline-block;
  border-radius: 4px;
}
.shop_tag {
  float: left;
}
.shop_tag_list span:nth-of-type(1),
.shop_tag_list span:nth-of-type(2) {
  width: 61px;
  height: 31px;
  background: #ffbe50;
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  color: #fff;
  border-radius: 4px;
  margin-right: 10px;
}
.shop_tag_list span:nth-of-type(2) {
  width: 60px;
  height: 28px;
  border: 2px solid #f00 !important;
  background: none;
  color: #f00;
  font-size: 12px;
}
.shop_price ul li {
  float: left;
  margin-top: 28px;
}
.shop_price ul li:nth-of-type(1) {
  font-size: 32px;
  color: #c32918;
  margin-right: 18px;
}
.shop_price ul li:nth-of-type(2) {
  color: #999;
  margin-top: 33px;
}
.shop_car {
  font-size: 18px;
  color: #333;
  float: right;
  margin-top: 35px;
}
</style>
