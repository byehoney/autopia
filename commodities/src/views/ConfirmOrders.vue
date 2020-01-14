<template>
  <div class="nameContainer">
    <div class="nav">
      <img @click="goBack" src="../images/leftArrow.png" class="leftIcon" alt>
      <span class="title">确认订单</span>
      <span class="btn" style="display:none">完成</span>
    </div>
    <div class="main">
      <div class="orderAddInfo">
        <img src="../images/local_icon.png" class="localIcon" alt>
        <div class="addInfo" @click="chooseAddr">
          <p class="defaultInfo" v-if="!hasDefault">请选择收货地址</p>
          <div
            class="infoTop"
            v-if="hasDefault"
          >{{person}} {{tel.substr(0,3)+'****'+tel.substr(7,11)}}</div>
          <div class="infoBottom" v-if="hasDefault">{{city}} {{cvPosition}} {{warehouseAddr}}</div>
        </div>
        <img src="../images/arrow_right.png" class="rightIcon" alt>
      </div>
      <div class="orderDetailInfo" @click="goProList">
        <div class="proImgs">
          <div class="imgBox" v-for="(url,index) in urls" :key="index">
            <img :src="url.imgurl?url.imgurl:require('../images/default_logo.jpg')" alt>
          </div>
        </div>
        <div class="proNum">共{{productnum}}件</div>
        <img src="../images/arrow_right.png" class="rightIcon" alt>
      </div>
      <div class="orderSelInfo">
        <div class="selItem" v-if="giftList.length">
          <div class="selLeft">赠品选择</div>
          <div class="selRight" @click="chooseGift">
            <span class="text">{{selMzGift.length>0?'已选择':'请选择'}}</span>
            <img src="../images/arrow_right.png" class="rightIcon" alt>
          </div>
        </div>
        <div class="selItem" @click="selTicket">
          <div class="selLeft">发票</div>
          <div class="selRight">
            <span class="text">{{sel_value}}</span>
            <img src="../images/arrow_right.png" class="rightIcon" alt>
          </div>
        </div>
        <div class="selItem">
          <div class="selLeft">备注</div>
          <input type="text" v-model="note" placeholder="请输入备注">
        </div>
      </div>
      <div class="orderPriceInfo">
        <div class="priceItem">
          <div class="priceLeft">商品金额</div>
          <div class="priceRight">￥{{spje}}</div>
        </div>
        <div class="priceItem">
          <div class="priceLeft">活动优惠</div>
          <div class="priceRight">￥{{yhje}}</div>
        </div>
      </div>
    </div>
    <div class="fixBottom">
      <div class="left">
        <span class="text">实付款</span>
        <span class="price">￥{{sfje}}</span>
      </div>
      <div class="right" @click="submitOrder">提交订单</div>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <mt-picker
        value-key="fptype"
        ref="picker"
        :slots="slots"
        @change="onValuesChange"
        showToolbar
      >
        <div class="barContent">
          <div @click="handleCancel" class="cancel">取消</div>
          <div class="tip">请选择</div>
          <div @click="handleConfirm" class="sure">确认</div>
        </div>
      </mt-picker>
    </mt-popup>
    <mt-popup class="gitPop" @touchmove.stop v-model="giftVisible" position="bottom">
      <div class="gift_wrap">
        <div class="nav">
          <img @click="closePop" src="../images/leftArrow.png" class="leftIcon" alt="">
          <span class="title">选择赠品</span>
        </div>
        <div class="shopgift_list" v-for="(item,index) in giftList" :key="index">
          <div class="shopgift_list_content">
            <div
              class="list_shopcar_circle"
              :class="item.checked?'checked':''"
              @click="checkgift(index)"
            ></div>
            <div class="shopgift_list_pic">
              <img alt :src="item.url?item.url:require('../images/default_logo.jpg')">
            </div>
            <div class="shopgift_list_text">
              <div class="shopgift_text_top">
                <h3>{{item.zpname}}</h3>
                <p>{{item.cj}}</p>
                <p>规格：{{item.guig}}</p>
              </div>
              <div class="shopgift_text_bottom">
                <ul>
                  <li>￥{{item.zpdj}}</li>
                  <li>{{item.zsjh}} 件</li>
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
              <span>{{giftNum}}</span>件
            </p>
          </div>
          <div class="footer_guide_right fix">
            <ul>
              <li @click="clear">
                <span >清空</span>
              </li>
              <li @click="confirmGift">
                <span>确定</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { getAddrList, confirmGetInfo,submitOrder,getFullList, getTicket,addToCar} from "@/api/index";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      hasDefault: false, //有无默认地址
      person: "",
      tel: "",
      city: "",
      cvPosition: "",
      warehouseCode:'',
      note:'',//备注
      popupVisible: false,
      giftVisible: false,
      warehouseAddr: "",
      set_value: "",
      setCode: "",
      sel_value: "",
      selCode: "",
      slots: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      giftList: [],
      giftNum: 0,
      selMzGift:[],
      productnum:0,
      urls:[],
      spje:'',
      sfje:'',
      yhje: ''
    };
  },
  computed: {
    ...mapState('login',['orderInfo','user','mzInfo']),
    ...mapGetters("login", [
      "token",
      "userId",
      "corpCode",
      "companyId",
      "userRole"
    ])
  },
  mounted() {
    console.log(this.orderInfo)
    this.selMzGift = this.mzInfo;
    // this.getAddr();
    this.getOrderInfo();
    this.getTicketInfo();
    this.getGiftData();
  },
  destroyed(){
    // this.restOrderInfo();
  },
  methods: {
    ...mapMutations('login',['restOrderInfo','saveMzInfo']),
    goProList(){
      this.$router.push({name:'productsList'})
    },
    submitOrder(){
      this.addGiftToCart();
    },
    async addGiftToCart(){
        console.log(this.orderInfo);
       
        let defaulParams = {
            token: this.token,
            userId: this.userId,
            corpCode: this.corpCode,
            companyId: this.companyId,
            userRole: this.userRole,
        };
        let giftArr = [];
        if(this.orderInfo.mzList&&this.orderInfo.mzList.length&&this.$route.query.type==1){
            this.orderInfo.mzList.forEach((item,index)=>{
                if(item[0].selGifts.length){
                    item[0].selGifts.forEach((pterm)=>{
                        if(item[0].promotionflag=='买赠'&&item[0].numberormny=='数量满足'){
                            giftArr.push({
                                mzhdlx:'买赠',
                                pzlx:true,
                                ghsbm:'',
                                hdbm:pterm.hdbm,
                                jghdlx:'无',
                                productId:pterm.zpbm,
                                cartNum:pterm.zssl,
                                pzdj:pterm.zpjj,
                                pzyj:pterm.zpjj,
                                mobile:this.user.mobile
                            })
                        }else if(item[0].promotionflag=='买赠'&&item[0].numberormny=='金额满足'){
                            giftArr.push({
                                mzhdlx:'满额赠',
                                pzlx:false,
                                ghsbm:'',
                                hdbm:pterm.hdbm,
                                jghdlx:'无',
                                productId:pterm.zpbm,
                                cartNum:pterm.zssl,
                                pzdj:pterm.zpjj,
                                pzyj:pterm.zpjj,
                                mobile:this.user.mobile
                            })
                        }
                    })
                }
            })
        }
        this.selMzGift.forEach((item)=>{
            giftArr.push({
                mzhdlx:'整单满额赠',
                pzlx:true,
                ghsbm:'',
                hdbm:item.hdcode,
                jghdlx:'无',
                productId:item.zpcode,
                cartNum:item.zsjh,
                pzdj:item.zpdj,
                pzyj:item.zpyj,
                mobile:this.user.mobile
            })
        })
        
        let res = await submitOrder({
          ...defaulParams,
          morenReginCode:this.warehouseCode,
          jsonStr:JSON.stringify(giftArr),
          orderText:this.note,
          userName:this.person,
          userMobile:this.tel,
          fpCode:this.selCode,
          type:this.$route.query.type
        });
        if(res.code==0){
          Toast({
            message: "提交成功", //弹窗内容
            position: "middle", //弹窗位置
            duration: 2000 //弹窗时间毫秒,如果值为-1，则不会消失
          });

          this.restOrderInfo();//重置选择的赠品
          setTimeout(()=>{
            if(this.$route.query.type==0){
              this.$router.go(-1);
            }else{
              this.$router.replace({name:'home'});
            }
          },2100)
        }
    },
    async getAddr() {
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole
      };
      let res = await getAddrList(defaulParams);
      if (res.code == 0) {
        res.data.list.forEach(item => {
          if (item.status == "默认") {
            this.hasDefault = true;
            this.person = item.person;
            this.tel = item.tel;
            this.city = item.city;
            this.cvPosition = item.cvPosition;
            this.warehouseAddr = item.warehouseAddr;
          }
        });
      }
    },
    async getOrderInfo() {
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole,
        money:this.$route.query.money
      };
      let res = await confirmGetInfo(defaulParams);
      if (res.data.info.status == "默认") {
        this.hasDefault = true;
        this.person = res.data.info.person;
        this.tel = res.data.info.tel;
        this.city = res.data.info.city;
        this.cvPosition = res.data.info.cvPosition;
        this.warehouseAddr = res.data.info.warehouseAddr;
        this.warehouseCode = res.data.info.warehouseCode;
      }
      this.productnum = res.data.productnum;
      this.urls = res.data.urls;
      this.spje = res.data.spje;
      this.sfje = res.data.sfje;
      this.yhje = res.data.yhje;
    },
    async getTicketInfo(){
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole
      };
      let res = await getTicket(defaulParams);
      if(res.code==0){
        this.$set(this.slots[0],'values',res.data.list);
        this.sel_value = res.data.moren.fptype;
        let index = res.data.list.findIndex(item=>item.fptype==res.data.moren.fptype);
        this.selCode = res.data.moren.fptype=='请选择'?'':res.data.list[index].code;
      }
    },
    selTicket() {
      this.popupVisible = !this.popupVisible;
    },
    onValuesChange(picker, values) {
      if (!values.length || !values[0]) {
        return;
      }
      this.set_value = values[0].fptype;
      this.setCode = values[0].code;
    },
    handleCancel() {
      this.popupVisible = false;
    },
    handleConfirm() {
      this.popupVisible = false;
      this.sel_value = this.set_value;
      this.selCode = this.setCode;
    },
    goBack() {
      this.$router.go(-1);
    },
    chooseAddr() {
      this.$router.push({ name: "address",query:{from:'confirm',money:this.$route.query.money,canSelMz:this.$route.query.canSelMz,type:this.$route.query.type} });
    },
    chooseGift() {
      this.giftVisible = true;
      this.countGiftNum();
    //   this.getGiftData();
    },
    confirmGift() {
        console.log(this.orderInfo)
        this.giftVisible = false;
        let selMzGift = [];
        this.giftList.forEach((item)=>{
            if(item.checked){
                selMzGift.push(item);
                this.selMzGift = selMzGift;
            }
        })
        this.saveMzInfo(this.selMzGift);
    },
    async getGiftData() {
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole
      };
      let res = await getFullList({ ...defaulParams,money:this.$route.query.money});
      if (res.code == 0) {
        res.data.list.forEach((item,index)=> {
          if(this.selMzGift.length){
            this.selMzGift.forEach((pterm,pIndex)=>{
              if(pterm.zpcode==item.zpcode){
                item.checked = true;
              }else{
                item.checked = false;
              }
            })
          }else{
            item.checked = false;
          }
        });
        this.giftList = res.data.list;
      }
    },
    clear() {
      this.giftList.forEach(item => {
        item.checked = false;
      });
      this.countGiftNum();
    },
    countGiftNum() {
      let num = 0;
      this.giftList.forEach((item, index) => {
        if (item.checked) {
          num++;
        }
      });
      this.giftNum = num;
    },
    checkgift(index) {
      let num = 0;
      this.giftList.forEach((item)=>{
        if(item.checked){
          num++;
        }
      })
      if(num>=this.giftList[index].zprxnum&&!this.giftList[index].checked){
        Toast({
          message: "可选赠品数量"+this.giftList[index].zprxnum, //弹窗内容
          position: "middle", //弹窗位置
          duration: 2000 //弹窗时间毫秒,如果值为-1，则不会消失
        });
        return;
      }
      this.$set(this.giftList[index], "checked", !this.giftList[index].checked);
      this.countGiftNum();
    },
    closePop(){
      this.giftVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.nameContainer {
  width: 100vw;
  min-height: 100vh;
  background: rgba(235, 235, 235, 1);
  .fixBottom {
    width: 100%;
    height: 98px;
    background: rgba(255, 255, 255, 1);
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    .left {
      width: 67%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .text {
        font-size: 26px;
        color: rgba(102, 102, 102, 1);
        line-height: 35px;
        letter-spacing: 2px;
      }
      .price {
        font-size: 26px;
        color: #E32323;
        line-height: 35px;
        letter-spacing: 2px;
        margin-right: 61px;
      }
    }
    .right {
      width: 33%;
      height: 98px;
      background: url("../images/result.png") no-repeat 0 0;
      background-size: 100% 100%;
      text-align: center;
      line-height: 98px;
      font-size: 30px;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 3px;
    }
  }
  .main {
    padding-top: 90px;
    .orderPriceInfo {
      background-color: #fff;
      .priceItem {
        margin-left: 38px;
        border-bottom: 2px solid #ebebeb;
        padding: 34px 46px 34px 55px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:last-child {
          border: none;
        }
        .priceLeft {
          font-size: 24px;
          color: rgba(102, 102, 102, 1);
          line-height: 31px;
          letter-spacing: 1px;
        }
        .priceRight {
          font-size: 24px;
          color: #E32323;
          line-height: 31px;
          letter-spacing: 1px;
        }
      }
    }
    .orderSelInfo {
      background-color: #fff;
      margin-bottom: 8px;
      .selItem {
        margin-left: 38px;
        border-bottom: 2px solid #ebebeb;
        padding: 34px 46px 34px 55px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .selLeft {
          font-size: 24px;
          color: rgba(102, 102, 102, 1);
          line-height: 31px;
          letter-spacing: 1px;
        }
        .selRight {
          display: flex;
          align-items: center;
          .text {
            font-size: 24px;
            color: rgba(102, 102, 102, 1);
            line-height: 31px;
            letter-spacing: 1px;
          }
          .rightIcon {
            width: 17px;
            height: 30px;
            margin-left: 37px;
          }
        }
        input {
          border: none;
          outline: none;
          font-size: 24px;
          line-height: 31px;
          letter-spacing: 1px;
          flex: 1;
          margin-left: 69px;
        }
      }
    }
    .orderDetailInfo {
      padding: 28px 46px 37px 38px;
      background-color: #fff;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .proImgs {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 500px;
        .imgBox {
          width: 146px;
          height: 116px;
          border: 2px solid #ebebeb;
          margin-right: 8px;
          img {
            width: 100%;
            height: 100%;
            object-fit: scale-down;
          }
        }
      }
      .proNum {
        font-size: 24px;
        color: rgba(102, 102, 102, 1);
        line-height: 31px;
        letter-spacing: 1px;
        margin-left: 30px;
        width: 120px;
        flex-shrink: 0;
      }
      .rightIcon {
        width: 17px;
        height: 30px;
        margin-left: 23px;
      }
    }
    .orderAddInfo {
      display: flex;
      align-items: center;
      background-color: #fff;
      padding: 29px 46px 34px 45px;
      border-bottom: 4px solid #E32323;
      margin-bottom: 8px;
      .localIcon {
        width: 44px;
        height: 44px;
        margin-right: 27px;
      }
      .addInfo {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 541px;
        .defaultInfo {
          font-size: 26px;
          color: rgba(102, 102, 102, 1);
          line-height: 35px;
          letter-spacing: 3px;
        }
        .infoTop {
          font-size: 26px;
          color: rgba(102, 102, 102, 1);
          line-height: 35px;
          letter-spacing: 3px;
          margin-bottom: 21px;
        }
        .infoBottom {
          font-size: 26px;
          color: rgba(102, 102, 102, 1);
          line-height: 35px;
          letter-spacing: 3px;
        }
      }
      .rightIcon {
        width: 17px;
        height: 30px;
        margin-left: 30px;
      }
    }
  }
  .nav {
    width: 100%;
    height: 88px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    border-bottom: 2px solid #ebebeb;
    .leftIcon {
      width: 17px;
      height: 30px;
      position: absolute;
      top: 29px;
      left: 30px;
    }
    .title {
      font-size: 30px;
    }
    .btn {
      width: 116px;
      height: 35px;
      font-size: 26px;
      color: rgba(153, 153, 153, 1);
      line-height: 35px;
      letter-spacing: 3px;
      position: absolute;
      top: 26px;
      right: 41px;
      text-align: right;
    }
  }
  .mint-popup-bottom {
    width: 100%;
  }
  .picker-toolbar {
    width: 100%;
    height: 96px;
    border-bottom: 2px solid #ebebeb;
  }
  .barContent {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 38px;
    color: #666;
    .cancel,
    .sure {
      height: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 30px;
      font-size: 26px;
      color: rgba(102, 102, 102, 1);
      letter-spacing: 2px;
    }
    .sure {
      color: #E32323;
    }
    .tip {
      font-size: 30px;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 3px;
    }
  }
  .slot1 {
    width: 100vw;
    .picker-item {
      font-size: 30px;
      color: rgba(51, 51, 51, 1);
      height: 78px;
      line-height: 78px;
      letter-spacing: 3px;
    }
  }
  .gitPop {
    height: 100vh;
    &.mint-popup-bottom {
      width: 100%;
      height: 100%;
      background-color: #ebebeb;
    }
    .gift_wrap {
      background: #fff;
      .nav{
        width: 100%;
        height: 88px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        .leftIcon{
            width: 17px;
            height: 30px;
            position: absolute;
            top: 29px;
            left: 30px;
        }
        .title{
            font-size: 30px;
        }
    }
      // padding-top: 88px;
      .shopgift_list .shopgift_list_content:last-child {
        border: none;
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
        border-bottom: 2px solid #ebebeb;
        margin-top: 93px;
        &:last-child {
          border: none;
        }
        .shopgift_list_content {
          width: 705px;
          display: flex;
          border-bottom: 1px solid #e5e5e5;
          padding-bottom: 26px;
          padding-top: 40px;
        }
        .shopgift_list_pic {
          width: 220px;
          height: 176px;
          // background: #ccc;
          margin-right: 26px;
          img {
            width: 100%;
            height: 100%;
            object-fit: scale-down;
          }
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
        background-size: 100% 100%;
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
    }
  }
}
</style>
