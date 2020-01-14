<template>
  <div>
    <LocalHeader pub="pub"/>
    <div class="header" style="display:none">
      <!-- 公告的返回 -->
      <div class="public_header_back" @click="goHome">
        <img src="../images/publicback.png">
      </div>
      <!-- 头部切换的输入框 -->
      <div class="header_input newheader">
        <span>
          <img src="../images/smallsousuo.png">
        </span>
        <input type="text" v-model="searchStr" @click="search" placeholder="请输入烟花名称">
      </div>
      <div class="header_search" @click="showcode">
        <img src="../images/home/home_list.png">
      </div>
      <div class="tips_wrap" v-show="hide">
        <div class="tips_deg"></div>
        <div class="tips">
          <ul>
            <li @click="change">
              <span>
                <img src="../images/change.png">
              </span>
              <span>门店切换</span>
            </li>
            <li>
              <span>
                <img src="../images/saoma.png">
              </span>
              <span class="remove">扫码登录</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 侧滑 -->
      <DrawRight v-show="rightWinShow" :rightHide="hide" @getRight="remove"/>
    </div>

    <!-- 头部结束 -->
    <div class="public_pic">
      <div class="public_pic_left">
        <img :src="atv?atv:require('../images/default_logo.jpg')" alt>
      </div>
      <div class="public_pic_right">
        <div class="public_pic_right_title">{{clientname}}</div>
        <div class="public_pic_right_desc">
          <p>
            <span>上架{{sjpzs}}种</span>
            <span>发货{{fhnum}}万件</span>
          </p>
          <p>({{qsjg}}元起配)</p>
        </div>
        <div class="public_pic_right_user">
          <ul>
            <li>
              <span>综合评分:</span>
              <span>{{zhpf}}</span>
              <span></span>
            </li>
            <li>
              <span>用户评价:</span>
              <span>{{yhpj}}</span>
              <span class="you"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="public_nav fix">
      <ul>
        <li>
          <p>
            <img src="../images/public_hone.png">
          </p>
          <p>商家首页</p>
        </li>
        <li>
          <p class="num">{{qbsp}}</p>
          <p>全部商品</p>
        </li>
        <li>
          <p>
            <img src="../images/public_car.png">
          </p>
          <p>待收货</p>
        </li>
        <li>
          <p class="num">{{cjbs}}</p>
          <p>成交量</p>
        </li>
        <li>
          <p>
            <img src="../images/public_chat.png">
          </p>
          <p>联系客服</p>
        </li>
      </ul>
    </div>
    <div class="public_bill">
      <div class="public_bill_header">
        <h3>
          <span></span>发票随货
        </h3>
      </div>
      <div class="public_bill_list">
        <ul>
          <li>
            <span>开户</span>
            <span>仅纸质版开户，客户必须先邮寄纸质版，收到纸质 版资料再开户</span>
          </li>
          <li>
            <span>配送</span>
            <span>{{qsjg}}元起送，车配</span>
          </li>
          <li>
            <span>发票</span>
            <span>普通纸质发票（随货）、支持专票（随货）</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="public_msg">
      <div class="public_bill_header">
        <h3>
          <span></span>商家公告
        </h3>
      </div>
      <div class="public_msg_info">
        <p>{{sjgg}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { mapGetters } from "vuex";
import { getPub } from "@/api/index";
import DrawRight from "../components/DrawerRight";
import LocalHeader from "@/components/Header";
export default {
  data() {
    return {
      searchStr: "",
      hide: "",
      rightWinShow: false,
      atv:'',
      clientname: "",
      sjpzs: "",
      fhnum: "",
      qsjg: "",
      zhpf: "",
      yhpj: "",
      qbsp: "",
      cjbs: "",
      sjgg: ""
    };
  },
  methods: {
    SearchVal() {
      if (this.searchStr.trim()) {
        this.$emit("receve", this.searchStr.trim());
        this.searchStr = "";
      }
    },
    goHome() {
      this.$router.go(-1);
    },
    change() {
      this.rightWinShow = !this.rightWinShow;
      this.hide = false;
    },
    remove(val) {
      this.rightWinShow = val;
    },
    showcode() {
      if (this.rightWinShow) {
      } else {
        this.hide = !this.hide;
      }
    },
    search() {
      this.$router.push("/search");
    }
  },
  computed: {
    ...mapGetters("login", [
      "token",
      "userId",
      "corpCode",
      "companyId",
      "userRole"
    ])
  },
  components: {
    DrawRight,
    LocalHeader
  },
  async mounted() {
    let defaulParams = {
      token: this.token,
      userId: this.userId,
      corpCode: this.corpCode,
      companyId: this.companyId,
      userRole: this.userRole
    };
    let res = await getPub(defaulParams);
    this.atv = res.data.url;
    this.clientname = res.data.clientname;
    this.sjpzs = res.data.sjpzs;
    this.fhnum = res.data.fhnum;
    this.qsjg = res.data.qsjg;
    this.zhpf = res.data.zhpf;
    this.yhpj = res.data.yhpj;
    this.qbsp = res.data.qbsp;
    this.cjbs = res.data.cjbs;
    this.sjgg = res.data.sjgg;
  }
};
</script>

<style scoped lang="scss">
.header {
  width: 708px;
  height: 58px;
  background: #FF0304;
  font-size: 25px;
  padding: 15px 21px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
.newheader {
  width: 505px !important;
}

.header_input {
  width: 456px;
  height: 58px;
  border: 1px solid #fff;
  border-radius: 29px;
  float: left;
  background: #fff;
}
.header_input input {
  width: 80%;
  height: 58px;
  outline: none;
  border: none;
  background: none;
  padding-left: 15px;
  border-radius: 29px;
}
.header_input span {
  display: inline-block;
  width: 26px;
  height: 26px;
  margin-left: 21px;
  vertical-align: sub;
}
.header_input span img {
  width: 100%;
}
.public_header_back {
  vertical-align: middle;
  width: 17px;
  height: 30px;
  margin-right: 90px;
  margin-left: 25px;
  margin-top: 15px;
  float: left;
}
.public_header_back img {
  width: 100%;
}
.header_search {
  width: 17px;
  height: 58px;
  float: left;
  margin-top: 3px;
  margin-left: 30px;
}
.header_search img {
  width: 100%;
}
.header_search_copy ul li {
  float: left;
  color: #fff;
  font-size: 28px;
  margin-top: 15px;
  margin-left: 22px;
}
.tips_wrap {
  width: 300px;
  height: 264px;
  background: #4a4a4a;
  position: absolute;
  right: 0;
  top: 108px;
  color: #fff;
  border-radius: 10px;
}
.tips_deg {
  width: 0;
  height: 0;
  border-width: 0 20px 20px;
  border-style: solid;
  border-color: transparent transparent #333; /*透明 透明  灰*/
  position: absolute;
  top: -20px;
  right: 9px;
}
.tips ul li {
  height: 135px;
  line-height: 135px;
  font-size: 30px;
}
.tips ul li span {
  display: inline-block;
}
.tips ul li span:nth-of-type(1) {
  width: 60px;
  height: 60px;
  margin-right: 7px;
  margin-left: 34px;
}
.tips ul li span img {
  width: 100%;
  vertical-align: middle;
}
.tips ul li span:nth-of-type(2) {
  width: 197px;
  border-bottom: 1px solid #666666;
  text-indent: 30px;
}
.tips ul li span.remove {
  border-bottom: none;
}
.public_pic {
  width: 750px;
  min-height: 320px;
  display: flex;
  margin-top: 85px;
  align-items: center;
  background: url("../images/public_pic.png") no-repeat top;
  background-size: 100%;
  .public_pic_left {
    width: 180px;
    height: 180px;
    display: flex;
    margin-left: 46px;
    margin-right: 22px;
    background: #fff;
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }
  .public_pic_right {
    font-size: 30px;
    color: #fff;
    .public_pic_right_title {
      margin-bottom: 20px;
      // margin-left: 33px;
    }
    .public_pic_right_desc {
      font-size: 26px;
      margin-bottom: 25px;
      // margin-left: 33px;
      p {
        margin-bottom: 4px;
        span {
          margin-right: 28px;
        }
      }
    }
    .public_pic_right_user ul li {
      display: inline-block;
      margin-right: 25px;
      font-size: 24px;
      color: #f8e71c;
      span {
      }
      span:nth-of-type(3) {
        background: url("../images/l.png") no-repeat left center;
        width: 30px;
        height: 30px;
        vertical-align: bottom;
        background-size: 100% 100%;

        margin-left: 6px;
        display: inline-block;
      }
      .you {
        background: url("../images/y.png") no-repeat left center !important;
        background-size: 100% 100% !important;
        width: 30px !important;
        height: 30px !important;
        vertical-align: bottom !important;
        margin-left: 6px !important;
        display: inline-block;
      }
    }
  }
}
.public_nav {
  width: 658px;
  min-height: 93px;
  background: #fff;
  font-size: 24px;
  padding: 43px 46px;
  border-bottom: 10px solid #dddd;
}
.public_nav ul{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.public_nav ul li {
  width: 100px;
  margin-right: 38px;
  float: left;
  text-align: center;
  font-size: 24px;
  color: #666;
}
.public_nav ul li:last-child {
  margin-right: 0;
}
.public_nav ul li p:nth-of-type(1) {
  width: 59px;
  height: 59px;
  margin: 0 auto;
  margin-bottom: 19px;
  text-align: center;
  &.num {
    width: 100% !important;
    text-align: center !important;
    font-size: 29px;
    font-weight: bold;
    color: rgba(102, 102, 102, 1);
    line-height: 58px;
    letter-spacing: 1px;
  }
  img {
    width: 100%;
  }
}
.public_bill,
.public_msg {
  width: 664px;
  min-height: 251px;
  padding: 33px 41px 47px 45px;
  background: #fff;
  .public_bill_header h3,
  .public_msg h3 {
    color: #FF0304;
    font-size: 28px;
    font-weight: 400;
    margin-bottom: 21px;

    span {
      padding-left: 10px;
      margin-right: 20px;
      background: url("../images/block.png") no-repeat left;
      background-size: 100%;
    }
  }
  .public_bill_list ul li {
    font-size: 24px;
    margin-bottom: 40px;
    color: #333;
    display: flex;
    align-items: center;
    span:nth-of-type(1) {
      display: inline-block;
      color: #f5a623;
      width: 63px;
      height: 38px;
      border: 1px solid #f5a623;
      text-align: center;
      border-radius: 4px;
      line-height: 38px;
      margin-right: 18px;
    }
  }
}
.public_msg {
  margin-top: 10px;
  .public_msg_info {
    color: #666;
    font-size: 24px;
  }
}
</style>
