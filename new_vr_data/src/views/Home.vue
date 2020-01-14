<template>
  <div class="container">
    <div class="floorOne">
      <div class="floorOne_title">全国总用户数</div>
      <div class="numArea">
        <template v-for="(item,index) in totalUser.split('')">
          <p :key="index" v-if="item!=','" :class="[index==0?'first':'']">{{item}}</p>
          <img :key="index" v-else src="../images/dot.png" alt="" class="dot">
        </template>
      </div>
    </div>
    <div class="floors">
      <div class="floor_title">账户总用户数的整体情况</div>
      <div class="floor_data">
        <div class="left">
          <div class="mtop">
            <img src="../images/zengchang.png" class="icon" alt="">
            <span>增长数量</span>
          </div>
          <div class="bottom">
            {{totalIncrease}}
          </div>
        </div>
        <div class="right">
          <div class="mtop">
            <img src="../images/reduce.png" class="icon" alt="">
            <span>取关用户</span>
          </div>
          <div class="bottom">
            {{totalDecrease}}
          </div>
        </div>
      </div>
    </div>
    <div class="floors">
      <div class="floor_title">微路况用户数的整体情况</div>
      <div class="floor_data">
        <div class="left">
          <div class="mtop">
            <span>总用户</span>
          </div>
          <div class="bottom">
            {{totalWLK}}
            <span class="strong" v-if="totalWLK>=10000000">(千万级)</span>
            <span class="strong" v-if="totalWLK>=1000000&&totalWLK<10000000">(百万级)</span>
          </div>
        </div>
        <div class="right">
          <div class="mtop">
            <span>新增用户</span>
          </div>
          <div class="bottom">
            {{totalWLKUp}}
          </div>
        </div>
      </div>
    </div>
    <div class="floors">
      <div class="floor_title">查违章用户数的整体情况</div>
      <div class="floor_data">
        <div class="left">
          <div class="mtop">
            <span>总用户</span>
          </div>
          <div class="bottom">
            {{totalCWZ}}
            <span class="strong" v-if="totalCWZ>=10000000">(千万级)</span>
            <span class="strong" v-if="totalCWZ>=1000000&&totalCWZ<10000000">(百万级)</span>
          </div>
        </div>
        <div class="right">
          <div class="mtop">
            <span>新增用户</span>
          </div>
          <div class="bottom">
            {{totalCWZUp}}
          </div>
        </div>
      </div>
    </div>
    <div class="floors">
      <div class="floor_title">其他微信生态（小程序、服务号、订阅号）的整体情况</div>
      <div class="floor_data">
        <div class="left">
          <div class="mtop">
            <span>总用户</span>
          </div>
          <div class="bottom">
            {{totalWXST}}
            <span class="strong" v-if="totalWXST>=10000000">(千万级)</span>
            <span class="strong" v-if="totalWXST>=1000000&&totalWXST<10000000">(百万级)</span>
          </div>
        </div>
        <div class="right">
          <div class="mtop">
            <span>新增用户</span>
          </div>
          <div class="bottom">
            {{totalWXSTUp}}
          </div>
        </div>
      </div>
    </div>
    <div class="floors">
      <div class="floor_title">其他矩阵用户数的整体情况</div>
      <div class="floor_data">
        <div class="left">
          <div class="mtop">
            <span>总用户</span>
          </div>
          <div class="bottom">
            {{totalOther}}
            <span class="strong" v-if="totalOther>=10000000">(千万级)</span>
            <span class="strong" v-if="totalOther>=1000000&&totalOther<10000000">(百万级)</span>
          </div>
        </div>
        <div class="right">
          <div class="mtop">
            <span>新增用户</span>
          </div>
          <div class="bottom">
            {{totalOtherUp}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTotalData } from "@/api/index";
export default {
  data() {
    return {
      totalUser: "0",
      totalIncrease:0,
      totalDecrease:0,
      totalWLK:0,
      totalWLKUp:0,
      totalCWZ:0,
      totalCWZUp:0,
      totalWXST:0,
      totalWXSTUp:0,
      totalOther:0,
      totalOtherUp:0
    };
  },
  mounted() {
    document.getElementById("left").style.height = '1580px';
    document.getElementById("tabs").style.height = '1580px';
    this.reqHomeData();
  },
  methods:{
    async reqHomeData(){
      let res = await getTotalData();
      this.totalUser = this.format(res.totalUserData.cumulateUser);
      this.totalIncrease = res.totalUserData.newUser;
      this.totalDecrease = res.totalUserData.cancelUser;
      this.totalWLK = res.userData202.cumulateUser;
      this.totalWLKUp = res.userData202.newUser;
      this.totalCWZ = res.userData203.cumulateUser;
      this.totalCWZUp = res.userData203.newUser;
      this.totalWXST = res.userData201.cumulateUser;
      this.totalWXSTUp = res.userData201.newUser;
      this.totalOther = res.userData9999.cumulateUser;
      this.totalOtherUp = res.userData9999.newUser;
    },
    format(num) {
      var reg = /\d{1,3}(?=(\d{3})+$)/g;
      return (num + "").replace(reg, "$&,");
    },
  }
};
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
.container {
  width: 820px;
  margin: 0 auto;
  float: left;
  overflow: hidden;
}
.floorOne{
  width: 820px;
  height: 280px;
  background-color: #fff;
}
.floorOne_title{
  font-family: PingFangSC-Medium;
  font-size: 34px;
  color: #333333;
  letter-spacing: 3.78px;
  text-align: center;
  /* font-weight: lighter; */
  padding-top: 46px;
}
.numArea{
  width: 100%;
  text-align: center;
  margin-top: 26px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.numArea .first{
  width: 86px;
  height: 108px;
  line-height: 108px;
  margin-right: 37px;
  position: relative;
  font-size: 100px;
}
.numArea .first::after{
  content: '';
  position: absolute;
  width: 39px;
  height: 18px;
  background: url('../images/unitB.png') no-repeat 0 0;
  right: -48px;
}
.numArea p{
  display: inline-block;
  width: 64px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background: url('../images/ledB.png') no-repeat 0 0;
  background-size: 100% 100%;
  font-size:50px;
  font-family:'LED';
  color: #FEFFEF;
  letter-spacing:6px;
  margin-right: 13px;
}
.numArea .dot{
  width:8px;
  height:18px;
  margin-right: 16px;
}
.floors{
  width: 820px;
  height: 240px;
  background-color: #fff;
  margin-top: 20px;
}
.floors .floor_title {
  padding: 30px 0 0 30px;
  font-family: PingFangSC-Regular;
  font-size: 20px;
  color: #333333;
  letter-spacing: 0.91px;
  margin-bottom: 53px;
}
.floor_data{
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: center;
}
.floor_data .mtop{
  display: flex;
  align-items: center;
  font-family: PingFangSC-Light;
  font-size: 16px;
  color: #333333;
  letter-spacing: 1.78px;
  justify-content: center;
}
.floor_data .bottom{
  font-family: PingFangSC-Regular;
  font-size: 44px;
  color: #333333;
  letter-spacing: 2px;
}
.floor_data .bottom .strong{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #1BC787;
  letter-spacing: 0.64px;
}
.floor_data  .icon{
  margin-right: 10px;
  width: 30px;
  height: 17px;
}
</style>

