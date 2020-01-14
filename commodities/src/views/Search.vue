<template>
  <div>
    <LocalHeader :data="search"  @searchStr="getSearchStr"  @receve="getval" :showHistory="showHistory" @closehistory="closehistory" @searchRes="result"/>
    <div class="history_wrap" v-if="showHistory">
      <!-- 历史搜索 -->
      <div class="history_list" v-if="HistoryList.length">
        <h3>
          <span>历史搜索</span>
          <span @click="delSearch()">
            <img src="../images/remove.png">
          </span>
        </h3>
        <ul>
          <li v-for="(item,index) in HistoryList" :key="index" @click="listSearch(item)">
            {{item}}
          </li>
        </ul>
        <div style="clear:both"></div>
      </div>
      <!-- 热门搜索 -->
      <div class="history_new" v-if="hotList.length">
        <h3>
          <span style="color:#c32918">热门搜索</span>
        </h3>
        <ul class="hotLists">
          <template v-for="(item,index) in hotList">
            <li  v-if="item.name&&item.name!='undefined'" :key="index" @click="listSearch(item.name)">
              {{item.name}}
            </li>
          </template>
        </ul>
      </div>
    </div>
    <!-- 下拉菜单 -->
    <div class="search_list" v-else>
      <ul>
        <li v-for="item in searchList" :key="item.productcode" @click="goChoose(item)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import LocalHeader from "../components/Header";
import { mapGetters ,mapMutations} from "vuex";
import { getHotSearchList } from '@/api/index';
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      showHistory:true,
      HistoryList: [],
      hotList: [],
      timer: null,
      inputVal: "",
      D: 0,
      H: 0,
      M: 0,
      S: 0,
      // 判断是否执行搜索的字段
      search: "search",
      // 接受查询到的列表
      searchList:[],
      // 点击查询到的列表传到input的值
      listval:""
    };
  },
  components: {
    LocalHeader
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
  created() {
    let history = localStorage.getItem("HistoryList")
      ? JSON.parse(localStorage.getItem("HistoryList").split(","))
      : [];
    this.HistoryList = history;
  },
  mounted() {
    this.result()
    this.getHostList();
    setTimeout(()=>{
      document.getElementById("input").focus();
    },500)
  },
  methods: {
     ...mapMutations('login',['savePzTerm']),
    async getHostList(){
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole,
      };
      let res = await getHotSearchList(defaulParams);
      if(res.code==0){
        this.hotList = res.data.list;
      }
    },
    closehistory(newclose){
      this.showHistory=newclose
    },
    getval(newval) {
      let val = newval; // 清除空格
      this.inputVal = newval;
      if (this.HistoryList.length > 0) {
        // 有数据的话 判断
        if (this.HistoryList.indexOf(val) !== -1) {
          // 有相同的，先删除 再添加
          this.HistoryList.splice(this.HistoryList.indexOf(val), 1);
          this.HistoryList.unshift(val);
        } else {
          // 没有相同的 添加
          this.HistoryList.unshift(val);
        }
      } else {
        // 没有数据 添加
        this.HistoryList.unshift(val);
      }
      if (this.HistoryList.length > 6) {
        // 保留六个值
        this.HistoryList.pop();
      }
      localStorage.setItem("HistoryList", JSON.stringify(this.HistoryList));
      this.$router.push("/choose?pzTerm="+newval)
      // this.findMost(this.HistoryList)
    },
    delSearch() {
      //   this.HistoryList.splice(index, 1);
      //   localStorage.setItem("HistoryList", JSON.stringify(this.HistoryList));
      localStorage.removeItem("HistoryList");
      this.HistoryList = [];
    },
    countTime() {
      this.timer = setInterval(() => {
        let endtime = new Date("2019/05/08,14:52:12").getTime();
        let nowtime = new Date().getTime();
        let leftsecond = parseInt((endtime - nowtime) / 1000);
        if (leftsecond >= 0) {
          this.D =
            parseInt(leftsecond / 3600 / 24) < 10
              ? "0" + parseInt(leftsecond / 3600 / 24)
              : parseInt(leftsecond / 3600 / 24);
          this.H =
            parseInt((leftsecond / 3600) % 24) < 10
              ? "0" + parseInt((leftsecond / 3600) % 24)
              : parseInt((leftsecond / 3600) % 24);
          this.M =
            parseInt((leftsecond / 60) % 60) < 10
              ? "0" + parseInt((leftsecond / 60) % 60)
              : parseInt((leftsecond / 60) % 60);
          this.S =
            parseInt(leftsecond % 60) < 10
              ? "0" + parseInt(leftsecond % 60)
              : parseInt(leftsecond % 60);
        } else {
          this.D = 0;
          this.H = "00";
          this.M = "00";
          this.S = "00";
          // clearInterval(this.timer);
        }
      }, 1000);
    },
    findMost(arr) {
      var obj = {};
      var maxEle;
      var maxNum = 1;
      arr.join("").replace(/(\w)/g, function(word, p) {
        obj[p[0]] ? (obj[p[0]] += 1) : (obj[p[0]] = 1);
        if (obj[p[0]] > maxNum) {
          maxEle = p[0];
          maxNum++;
        }
      });
      console.log("次数最多的元素为:" + maxEle + ", 次数为:" + obj[maxEle]);
      return "次数最多的元素为:" + maxEle + ", 次数为:" + obj[maxEle];
    },
    // 得到查询到的数据列表
    result(val){
      this.searchList=val
    },
    // 点击查询到的列表进行跳转
    goChoose(item){
      this.savePzTerm(item.name);
      this.$router.push("/choose?pzTerm="+item.name)
      var name=item.name
      this.getval(name)
      this.listval=name
      console.log(this.listval)
      this.getSearchStr()
    },
    // 点击历史记录跳到choose列表
    listSearch(item){
      this.savePzTerm(item);
      this.$router.push("/choose?pzTerm="+item)
    },
    getSearchStr(val){
        val=this.listval
    }
  }
};
</script>
<style lang="scss" scoped>
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
.hotLists{
  overflow: hidden;
}
.history_wrap {
  width: 671px;
  min-height: 700px;
  padding: 98px 34px 50px 45px;
  background: #fff;
  margin-top: 13px;
  font-size: 28px;
}
.history_wrap h3 {
  font-size: 28px;
  color: #333;
}
.history_list {
  margin-bottom: 114px;
}
.history_list span {
  display: inline-block;
}
.history_list span:nth-of-type(2) {
  width: 39px;
  height: 39px;
}
.history_list span:nth-of-type(2) {
  float: right;
}
.history_list span:nth-of-type(2) img {
  width: 100%;
}

.history_list ul li,
.history_new ul li {
  height: 55px;
  background: #ededed;
  border-radius: 80px;
  border: 2px solid #979797;
  // min-width: 113px;
  padding: 0 10px;
  color: #666;
  float: left;
  line-height: 55px;
  text-align: center;
  margin-right: 28px;
  margin-top: 28px;
}
.search_list {
  width: 750px;
  background: #fff;
  margin-top:84px;
}
.search_list ul li {
  min-height: 85px;
  line-height: 85px;
  border-bottom: 1px solid #eee;
  font-size: 26px;
  color: #666;
  margin-left: 39px;
}
</style>