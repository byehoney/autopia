<template>
  <div class="header">
    <!-- 头部logo -->
    <img class="back_icon" v-if="pub" @click="goBack" src="../images/publicback.png">
    <div class="header_logo" v-if="showlogo&&!pub" @click="goShop"></div>
    <!-- 头部input输入框 -->
    <div class="header_input" v-if="showlogo">
      <span v-if="!showScan">
        <img  src="../images/smallsousuo.png">
      </span>
      <span class="pScan" v-else @click="scan('buy')">
        <img  src="../images/pScan.png">
      </span>
      <input id="common" type="text" v-model="searchStr" @focus="doSearch" placeholder="请输入烟花名称">
    </div>
    <!-- 头部切换的输入框 -->
    <div class="header_input newheader" v-else ref="sel">
      <span>
        <img src="../images/smallsousuo.png">
      </span>
      <form @submit.prevent class="form">
        <input  type="text" v-model="searchStr" id="input" autofocus @keyup="search" @keypress="searchGoods" placeholder="请输入烟花名称">
      </form>
    </div>
    <div class="selIcon_box" v-if="showlogo&&!pub" @click="goMore">
      <img class="selIcon" src="../images/sel_ld_icon.png" alt>
    </div>
    <div class="header_search" v-if="showlogo" @click="showcode">
      <img src="../images/home/home_list.png">
    </div>
    <div class="header_search_copy" v-else>
      <ul>
        <li @click="SearchVal">搜索</li>
        <li @click="cancelSearch">取消</li>
      </ul>
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
          <li @click="scan('login')">
            <span>
              <img src="../images/saoma.png">
            </span>
            <span class="remove">扫码登录</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 侧滑 -->
    <DrawRight v-show="rightWinShow" :rightHide="hide" @getRight="remove" ref="rightMenu"/>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import DrawRight from "./DrawerRight";
import { autoSearch } from "@/api/index";
import { mapGetters,mapState,mapMutations } from "vuex";
import { setTimeout } from 'timers';
let scan = null;
export default {
  props: ["data", "showHistory","pScan","pub"],
  data() {
    return {
      // showScan:false,
      scanType:'',
      showlogo: true,
      searchStr: "",
      hide: "",
      rightWinShow: false,
      showScan: false,
      newHistory: false,
      oldHistory: true,
      searchResult: [],
      fromPath:'home',//来源页面路由
    };
  },
  computed: {
    ...mapState('login',['flTermS','cjTermS','pzTermS']),
    ...mapGetters("login", [
      "token",
      "userId",
      "corpCode",
      "companyId",
      "userRole"
    ])
  },
  methods: {
    ...mapMutations('login',['savePzTerm']),
    // 判断是否是安卓设备
    isAndroid() {
      var browser = {
        versions: (function() {
          var u = navigator.userAgent,
            app = navigator.appVersion;
          return {
            trident: u.indexOf("Trident") > -1, //IE内核
            presto: u.indexOf("Presto") > -1, //opera内核
            webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
            gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android终端
            iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf("iPad") > -1, //是否iPad
            webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf("MicroMessenger") > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
          };
        })(),
        language: (
          navigator.browserLanguage || navigator.language
        ).toLowerCase()
      };
      return browser.versions.android;
    },
    doSearch(){
      this.$router.push({name:'search'})
    },
    // 跳转到商家公告
    goShop() {
      this.$router.push("/public");
    },
    searchGoods(event){
      if (event.keyCode == 13) {
        event.preventDefault(); //禁止默认事件（默认是换行）
        this.SearchVal();
      }
    },
    // 查询input中输入的值
    SearchVal() {
      if (this.searchStr.trim()) {
        this.savePzTerm(this.searchStr.trim());
        this.$emit("receve", this.searchStr.trim());
        // this.searchStr = "";
      }
    },
    async search() {
      // 智能搜索
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole
      };
      this.$emit("closelist", this.showlist);
      this.$router.replace({name:'search',query:{backPath:this.$route.path}});
      if (this.searchStr.length == 0) {
        this.$emit("closehistory", this.oldHistory);
        return;
      } else {
        this.$emit("closehistory", this.newHistory);
        let data = await autoSearch({
          ...defaulParams,
          fullText: this.searchStr
        });
        this.searchResult = data.data.list;
        this.$emit("searchRes", this.searchResult);
        // 往search组件里面传递input的值
        this.$emit("searchStr", this.searchStr);
      }
    },
    cancelSearch() {
      this.savePzTerm('');
      this.$router.push(this.$route.query.backPath?this.$route.query.backPath:'/')
    },
    showcode() {
      if(!this.token||!this.userId){
        this.$router.push({path: '/login',query: {redirect: '/'}})
        return;
      }
      if (this.rightWinShow) {
      } else {
        this.hide = !this.hide;
      }
    },
    // 关闭右侧菜单
    remove(val) {
      this.rightWinShow = val;
    },
    // 显示或隐藏右侧菜单
    change() {
      this.rightWinShow = !this.rightWinShow;
      this.hide = false;
      this.$refs.rightMenu.getList();
    },
    // 跳转到分类
    goMore() {
      this.$router.push({ name: "classify" });
    },
    scan(type) {
      if(type=='login'){
        this.scanType = 'login';
      }else{
        this.scanType = 'buy';
      }
      var u_agent = navigator.userAgent;
      if (!this.isAndroid()) {
        window.webkit.messageHandlers.scanQRCode.postMessage({});
      } else {
        window.android.scanQRCode();
      }
    },
    scanResult(str) {
      if(this.scanType=='login'){
        this.$router.push({ name: "pcLogin", query: { code: str } });
      }else{
        if(!str){
          Toast({
            message: "品种不存在", //弹窗内容
            position: "middle", //弹窗位置
            duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
          });
          return;
        }
        this.$router.push({name:'detail',query:{id:str}});
      }
    },
    goBack(){
      this.$router.go(-1)
    }
  },
  watch: {
    'pzTermS' (val, old) { 
      this.searchStr = this.pzTermS
    }
  },
  async mounted() {
    console.log(this.pzTermS)
    this.searchStr = this.pzTermS;
    window.scanResult = this.scanResult;
    if (this.data == "search") {
      this.showlogo = false;
    } else {
      this.showlogo = true;
    }
    if(this.pScan=='scan'){
      this.showScan = true;
    }else{
      this.showScan = false;
    }
    this.remove();
  },
  components: {
    DrawRight
  }
};
</script>

<style lang="scss" scoped>
.back_icon{
  width: 17px;
  height: 30px;
  float: left;
}
.scan {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000001;
  background: rgba(0, 0, 0, 0);
  #bcid {
    width: 80%;
    height: 60%;
    position: absolute;
    left: 10%;
    right: 0;
    top: 20%;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0);
    z-index: 100000001;
  }
}
.header {
  width: 708px;
  height: 58px;
  background: #E32323;
  font-size: 25px;
  padding: 15px 21px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.newheader {
  width: 505px !important;
}
.header_logo {
  width: 91px;
  height: 58px;
  background: url("../images/gg_icon.png") no-repeat 0 0;
  background-size: 100% 100%;
  float: left;
}
.header_input {
  width: 456px;
  height: 58px;
  border: 1px solid #fff;
  border-radius: 29px;
  float: left;
  margin: 0 0 0 21px;
  background: #fff;
  display: flex;
  align-items: center;
  .pScan{
    display: inline-block;
    width: 36px;
    height: 36px;
    margin-left: 21px;
    // vertical-align: sub;
  }
}
.form{
  width: 80%;
  height: 58px;
  display: inline-block;
  .header_input input {
    width: 100%;
    height: 58px;
    outline: none;
    border: none;
    background: none;
    padding-left: 15px;
    border-radius: 29px;
  }
}
input[type="search"]{-webkit-appearance:none;} 

input::-webkit-search-cancel-button {display: none;}

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
  margin-left: 46px;
  margin-top: 15px;
  float: left;
}
.public_header_back img {
  width: 100%;
}
.selIcon_box {
  float: left;
  margin-top: 10px;
}
.selIcon {
  width: 46px;
  height: 40px;
  margin-left: 30px;
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
/* .tips {
  
 
} */
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
</style>
