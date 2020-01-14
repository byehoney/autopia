<template>
  <!-- 选择赠品 -->
  <div class="gift_wrap">
    <!-- <div>
      <mt-header title="选择赠品" class="shopgift_header">
        <router-link to="/newshopcar" slot="left">
          <mt-button icon="back" class="text"></mt-button>
        </router-link>
      </mt-header>
    </div> -->
    <TopNav></TopNav>
    <!-- <div class="shopgift_subheader">
      <h3>组合满10件可选择以下商品</h3>
    </div> -->
    <div class="shopgift_list" v-for="(item,index) in list" :key="index">
      <div class="shopgift_list_content">
        <div
          class="list_shopcar_circle"
          :class="item.checked?'checked':''"
          @click="checkgift(index)"
        ></div>
        <div class="shopgift_list_pic"></div>
        <div class="shopgift_list_text">
          <div class="shopgift_text_top">
            <h3>{{item.zpmc}}</h3>
            <p>{{item.cj}}</p>
            <p>规格：{{item.guige}}</p>
          </div>
          <div class="shopgift_text_bottom">
            <ul>
              <li>￥{{item.zpjj}}</li>
              <li>{{item.mzsl}}件</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer_guide fix">
      <div class="footer_guide_left fix">
        <p class="badge">
          已选择
          <span>434</span>件
        </p>
      </div>
      <div class="footer_guide_right fix">
        <ul>
          <li>
            <span @click="clear">清空</span>
          </li>
          <li>
            <span @click="handlerClick">确定</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import TopNav from "@/components/TopNav";
import { mapGetters,mapState } from 'vuex'
import { getGiftList } from '@/api/index';
// import { constants } from "crypto";
export default {
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.getData();
  },
  computed:{
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole']),
    ...mapState('login',['user'])
  },
  components: {
    TopNav,
  },
  methods: {
    async getData(){
      let defaulParams = {
        token:this.token,
        userId:this.userId,
        corpCode:this.corpCode,
        companyId:this.companyId,
        userRole:this.userRole,
      }; 
      let res = await getGiftList({...defaulParams,productId:this.$route.query.id});
      res.data.list.forEach(item => {
        item.checked =false;
      });
      if(res.code ==0){
        this.list = res.data.list;
      }
    },
    handlerClick(){
      this.list.forEach((item)=>{
        if(item.checked){
          
        }
      })
    },
    clear(){
      this.list.forEach((item)=>{
        item.checked = false;
      })
    },
    checkgift(index) {
      this.$set(this.list[index],'checked',!this.list[index].checked);
    }
  }
};
</script>

<style scoped lang="scss">
.shopgift_list .shopgift_list_content:last-child{
  border: none;
}
.nav{
  border-bottom: 2px solid #ebebeb;
}
.gift_wrap {
  background: #fff;
  padding-top: 88px;
}
.shopgift_header {
  background: #fff;
  color: #333333;
  font-size: 30px;
  .text {
    font-size: 30px;
  }
}
.list_shopcar_circle {
  width: 40px;
  height: 40px;
  background: url("../images/car_circle.png") no-repeat center;
  background-size: 100%;
  margin-right: 8px;
  float: left;
}
.checked {
  background: url("../images/car_checkcircle.png") no-repeat center;
  background-size: 100%;
}
.shopgift_subheader {
  min-height: 42px;
  line-height: 42px;
  color: #8b572a;
  background: #ffe6bc;
  margin-bottom: 19px;
  h3 {
    font-weight: 400;
    margin-left: 38px;
    font-size: 20px;
  }
}
.shopgift_list {
  min-height: 221px;
  font-size: 18px;
  padding-left: 45px;
  background: #fff;
  margin-bottom: 10px;
  .shopgift_list_content {
    width: 705px;
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 26px;
    padding-top: 40px;
  }
  .shopgift_list_pic {
    width: 220px;
    min-height: 176px;
    background: #ccc;
    margin-right: 26px;
  }
  .shopgift_text_top h3 {
    font-size: 24px;
    color: #666;
    line-height: 40px;
  }
  .shopgift_text_top p {
    color: #999;
    line-height: 35px;
  }
}
.shopgift_text_bottom {
  width: 400px;
  color: #999;
  margin-top: 46px;
}
.shopgift_text_bottom ul li {
  float: left;
  height: 40px;
  width: 180px;
}
.shopgift_text_bottom ul li:nth-of-type(2) {
  float: right;
  text-align: center;
}
/* 底部样式 */
.footer_guide {
  border-top: 5px solid #e4e4e4;
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 1px;
  background-color: #fff;
  width: 100%;
  height: 95px;
  line-height: 95px;
}
.footer_guide_left {
  width: 262px;
  float: left;
  min-height: 100px;
}
.footer_guide_left ul li {
  width: 62px;
  height: 62px;
  float: left;
  margin-left: 49px;
}
.footer_guide_left ul li:nth-of-type(1) {
  position: relative;
}
.footer_guide_left ul li:nth-of-type(2) {
  width: 49px;
  height: 62px;
  float: left;
}
.footer_guide_left ul li img,
.footer_guide_right ul li img {
  width: 100%;
}
.footer_guide_right {
  width: 488px;
  float: left;
  text-align: center;
  color: #fff;
}
.footer_guide_right ul li {
  width: 244px;
  height: 100px;
  line-height: 50px;
  float: left;
  background: url("../images/resultgray.png") no-repeat top;
  background-size: 100% 100%;
}
.footer_guide_right ul li:nth-of-type(2) {
  background: url("../images/result.png") no-repeat top;
  background-size: 100%;
}
.on {
  color: #02a774;
}
span {
  display: inline-block;
  font-size: 32px;
}
.badge {
  font-size: 26px;
  text-align: center;
  color: #666;
  line-height: 95px;
  span {
    color: #E32323;
    font-size: 26px;
  }
}
.iconfont {
  font-size: 22px;
}
</style>
