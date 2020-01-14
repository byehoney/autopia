<template>
  <div class="telContainer" style="opacity:1">
    <TopNav></TopNav>
    <div class="telContent">
      <div
        class="scrollBox"
        style="max-height: 100vh; overflow-y: auto;"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <div class="scrollItem" v-for="(item,index) in list" :key="index">
          <div class="top">
            <div class="title">{{item[0].mzhdms}}</div>
          </div>
          <div class="bottom" v-for="(pterm,jIndex) in item" :key="pterm.productcode">
            <img class="sel_icon" @click="checkedPo(index,jIndex,pterm.productcode)" :src="pterm.checked?require('../images/car_checkcircle.png'):require('../images/car_circle.png')" alt>
            <div class="box" @click="goDetail($event,pterm.productcode)">
              <div class="left">
                <img :src="pterm.dptplj?pterm.dptplj:require('../images/default_logo.jpg')" alt>
              </div>
              <div class="right">
                <p class="name">{{pterm.productname}}</p>
                <p class="factory">{{pterm.cj}}</p>
                <p class="size">规格：{{pterm.guige}}</p>
                <p class="oPrice">原价：￥{{pterm.pzyj}}</p>
                <div class="fun">
                  <p class="nPrice">￥{{pterm.dj}}</p>
                  <div class="counter">
                    <p class="reduce" @click="reduce($event,index,jIndex)">-</p>
                    <p class="num" @click="popInput($event,index,jIndex)">{{pterm.num}}</p>
                    <p class="add" @click="add($event,index,jIndex)">+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 商品活动 -->
          <div class="shop_gift">
            <div class="shop_gift_top">
              <div class="shop_gift_left">
                <h3>商品活动</h3>
              </div>
              <div class="shop_gift_right">
                <p>累积购买可获赠品，点击查看更多活动规则</p>
                <div class="activity" v-if="item[0].showAct">
                  <p v-for="(act,index) in item[0].sphd.split(',')" :key="index">{{act}}</p>
                </div>
              </div>
              <img class="arrIcon" :src="item[0].showAct?require('../images/arrow_down.png'):require('../images/arrow_up.png')" alt="" @click="showActDetail(index)">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer_guide fix">
      <div class="footer_guide_left fix" @click="goShopCar">
        <p class="badge">
          <span class="num" v-if="buyNum>0">{{buyNum}}</span>
        </p>
        <p>¥{{money}}</p>
      </div>
      <div class="footer_guide_right fix">
        <ul>
          <li>
            <span @click="handlerClick">确定</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="mask" v-show="showInput">
      <div class="inputModal">
        <p class="title">修改购买数量</p>
        <div class="funArea">
          <div class="reduce" @click="popReduce">-</div>
          <input type="number" min="1" v-model="num" class="num">
          <div class="add" @click="popAdd">+</div>
        </div>
        <div class="btnGroup">
          <div class="cancel btn" @click="closeInput">取消</div>
          <div class="confirm btn" @click="confirmInput">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from "@/components/TopNav";
import { getBestGoodsList ,addToCar,getCartNum} from '@/api/index'
import {mapGetters,mapState} from 'vuex'
export default {
  data() {
    return {
      showInput:false,//是否显示输入框
      num:1,//输入框内数字
      list:[],
      cIndex:0,//当前活动序号
      cJindex:0,//当前活动商品序号
      money:0,//总金额
      buyNum:0,
    };
  },
  computed:{
    ...mapState('login',['user']),
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
  },
  components: {
    TopNav
  },
  mounted() {
    this.getData();
    this.getShopCarNum();
  },
  activated() {/**  */
    if (!this.$route.meta.canKeep) {
      this.list = [];
      this.money = 0;
      this.getData();
    }
  },
  beforeRouteLeave(to, from, next){
    let position = document.getElementsByClassName('scrollBox')[0].scrollTop
    sessionStorage.setItem('bTop',position);
    next()
  },
  beforeRouteEnter (to, from, next) {/**  */
    if(from.name == 'detail'){
      to.meta.canKeep = true;
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.$nextTick(function(){
            let position = sessionStorage.getItem('bTop') //返回页面取出来
            console.log("beforeRouteEnter moments update: ", position);
            // document.getElementsByClassName('scrollBox')[0].scroll(0, position)
            document.getElementsByClassName('scrollBox')[0].scrollTo({ 
                top: position, 
                behavior: "instant" 
            });
        })
      })   
    }else{
      to.meta.canKeep = false;
      next();
    }
  },
  methods: {
    goShopCar(){
      this.$router.push({name:'newShopCar'})
    },
    reduce(e,index,jIndex){
      e.stopPropagation();
      if(this.list[index][jIndex].num<=1){
        this.list[index][jIndex].num=1
      }else{
        this.list[index][jIndex].num--;
      }
      this.countMoney();
    },
    add(e,index,jIndex){
      e.stopPropagation();
      this.list[index][jIndex].num++;
      this.countMoney();
    },
    popReduce(){
      if(this.num<=1){
        this.num = 1;
        return;
      }else{
        this.num = this.num-1;
      }
    },
    popAdd(){
      this.num = this.num+1;
    },
    popInput(e,index,jIndex){
      e.stopPropagation();
      this.showInput = true;
      this.num = this.list[index][jIndex].num;
      this.cIndex = index;
      this.cJindex = jIndex;
    },
    closeInput(){
      this.showInput = false;
    },
    confirmInput(){
      this.showInput = false;
      this.$set(this.list[this.cIndex][this.cJindex],'num',this.num);
      this.countMoney();
    },
    goDetail(e,id){
      e.stopPropagation();
      this.$router.push({name:'detail',query:{id:id}})
    },
    async handlerClick(){
      let defaulParams = {
        token:this.token,
        userId:this.userId,
        corpCode:this.corpCode,
        companyId:this.companyId,
        userRole:this.userRole,
      };
      let selArr = [];
      this.list.forEach((item,index)=>{
        item.forEach((ls,ln)=>{
          if(ls.checked){
            selArr.push({
              mzhdlx:'买赠',
              pzlx:false,
              ghsbm:'',
              hdbm:ls.mzhdbm,
              jghdlx:'无',
              productId:ls.productcode,
              cartNum:ls.num,
              pzdj:ls.dj,
              pzyj:ls.pzyj,
              mobile:this.user.mobile
            })
          }
        })
      })
      if(selArr.length){
        let res = await addToCar({...defaulParams,jsonStr:JSON.stringify(selArr)})
        if(res.code==0){
          Toast({
            message: "加入购物车成功", //弹窗内容
            position: "middle", //弹窗位置
            duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
          });
          this.resetList();
        }
      }
    },
    resetList(){//加入完购物车以后清空之前选择的数据
      this.list.forEach((item,index)=>{
        item.forEach((ls,ln)=>{
          ls.num = 1;
          ls.checked = false
        })
      })
      this.money = 0;
    },
    checkedPo(index,jIndex,proCode){
      this.$set(this.list[index][jIndex],'checked',!this.list[index][jIndex].checked);
      this.countMoney();
    },
    countMoney(){
      var money = 0;
      this.list.forEach((item,index)=>{
        item.forEach((ls,ln)=>{
          if(ls.checked){
            money+=(parseFloat(ls.dj)*1000)*ls.num/1000;
          }
        })
      })
      this.money = money;
    },
    showActDetail(index){
      this.$set(this.list[index][0],'showAct',!this.list[index][0].showAct)
    },
    async getShopCarNum(){
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole,
      };
      let res = await getCartNum(defaulParams);
      if(res.code==0){
        this.buyNum = res.data.countitem;
      }
    },  
    async getData(){
      let defaulParams = {
        token:this.token,
        userId:this.userId,
        corpCode:this.corpCode,
        companyId:this.companyId,
        userRole:this.userRole,
      };
      let res = await getBestGoodsList(defaulParams);
      if(res.code==0){
        res.data.list.forEach(item => {
          item[0].showAct = true;
          item.forEach(jterm=>{
            jterm.num = 1;
            jterm.checked = false;
          })
        });
        this.list = res.data.list;
      }
    },
    loadMore() {}
  }
};
</script>
<style lang="scss" scoped>
.telContainer {
  width: 100vw;
  min-height: 100vh;
  background: rgba(235, 235, 235, 1);
  .nav {
    border-bottom: 2px solid #ebebeb;
  }
  .mask{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.3);
    z-index: 1000;
    .inputModal{
      width: 500px;
      height: 300px;
      background-color: #fff;
      border-radius: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -150px;
      margin-left: -250px;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      .btnGroup{
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 80px;
        border-top: 2px solid #ebebeb;
        .btn{
          width: 50%;
          text-align: center;
          line-height: 80px;
          font-size: 26px;
          &.confirm{
            background-color: #E32323;
            color: #fff;
            padding-right: 2px;
          }
        }
      }
      .title{
        font-size: 26px;
        color: rgba(102, 102, 102, 1);
        line-height: 35px;
        letter-spacing: 2px;
        text-align: center;
        padding: 30px 0;
      }
      .funArea{
        display: flex;
        align-items: center;
        justify-content: center;
        .reduce,.add{
          width: 50px;
          height: 50px;
          border: 2px solid #ebebeb;
          font-size: 26px;
          line-height: 50px;
          text-align: center;
        }
        .num{
          width: 100px;
          height: 50px;
          border-left: none;
          border-right: none;
          border-top: 2px solid #ebebeb;
          border-bottom: 2px solid #ebebeb;
          text-align: center;
          font-size: 26px;
          line-height: 50px;
          outline: none;
          color:#333;
        }
      }
    }
  }
  .telContent {
    padding: 92px 0;
    background-color: #E5E5E5;
    .scrollBox {
      // padding-left: 44px;
      
    }
    .scrollItem {
      background-color: #fff;
      padding-left: 44px;
      margin-bottom: 14px;
      .top {
        font-size: 26px;
        color: rgba(102, 102, 102, 1);
        line-height: 35px;
        letter-spacing: 2px;
        padding: 17px 39px 20px 0;
        border-bottom: 2px solid #ebebeb;
        // margin-bottom: 24px;
      }
      .bottom {
        display: flex;
        align-items: center;
        padding: 24px 0 18px 0;
        .sel_icon {
          width: 40px;
          height: 40px;
          margin-right: 14px;
        }
        .box {
          display: flex;
          align-items: center;
          flex: 1;
          border-bottom: 1px solid #e5e5e5;
          padding-right: 39px;
          padding-bottom: 16px;
          .left {
            width: 220px;
            height: 176px;
            margin-right: 26px;
            img {
              width: 100%;
              height: 100%;
              object-fit: scale-down;
            }
          }
          .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            .name {
              font-size: 26px;
              color: rgba(102, 102, 102, 1);
              line-height: 35px;
            }
            .factory,
            .size,
            .oPrice {
              font-size: 18px;
              color: rgba(153, 153, 153, 1);
              line-height: 24px;
              letter-spacing: 1px;
              margin-top: 8px;
            }
            .oPrice {
              text-decoration: line-through;
            }
            .fun {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .nPrice {
                font-size: 26px;
                color: #E32323;
                line-height: 35px;
              }
              .counter {
                display: flex;
                width: 180px;
                height: 50px;
                .reduce,
                .add {
                  width: 45px;
                  height: 46px;
                  line-height: 36px;
                  text-align: center;
                  border: 2px solid #ebebeb;
                  font-size: 28px;
                  color: rgba(102, 102, 102, 1);
                  line-height: 46px;
                  letter-spacing: 2px;
                }
                .num {
                  height: 46px;
                  border-top: 2px solid #ebebeb;
                  border-bottom: 2px solid #ebebeb;
                  font-size: 28px;
                  color: rgba(102, 102, 102, 1);
                  line-height: 46px;
                  letter-spacing: 2px;
                  width: 76px;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
}
.shop_gift {
  margin-left: 47px;
  width: 618px;
  min-height: 40px;
  margin-top: 12px;
  padding-bottom: 15px;
  line-height: 40px;
  font-size: 20px;
}
.shop_gift_top {
  display: flex;
  color: #999;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .shop_gift_right{
    width: 425px;
  }
  .arrIcon{
    width: 24px;
    height: 15px;
  }
}
.shop_gift_left h3 {
  color: #E32323;
  font-weight: 400;
  margin-right: 26px;
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
.footer_guide_left p {
  font-size: 32px;
  float: left;
  margin-left: 49px;
}
.footer_guide_left p:nth-of-type(2){
    margin-left:40px;
    color:#E32323
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
  float: right;
  background: url("../images/result.png") no-repeat top;
  background-size: 100%;
  span{
    font-size: 32px;
  }
}
.on {
  color: #02a774;
}
span {
  display: inline-block;
  font-size: 12px;
}
.badge {
  width: 62px;
  height: 62px;
  font-size: 26px;
  text-align: center;
  color: #666;
margin-top:15px;
  background: url("../images/choose_car.png") no-repeat top;
  background-size: 100% 100%;
  position: relative;
  .num{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #F5A41A;
    position: absolute;
    z-index: 100;
    top: -10px;
    right: -20px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    line-height: 40px;
  }
  span {
    color: #E32323;
    font-size: 26px;
  }
}
.iconfont {
  font-size: 22px;
}
</style>
