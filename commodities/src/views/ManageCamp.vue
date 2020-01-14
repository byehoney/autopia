<template>
  <div class="managecamp">
    <div class="manageHeader">
      <img @click="goBack" src="../images/arrow_left_white.png" class="leftIcon" alt>
      <div class="inputArea">
        <form @submit.prevent class="form">
          <input
            v-model="searchStr"
            @keypress="searchShop"
            type="text"
            placeholder="请输入搜索内容"
            class="input"
          >
        </form>
      </div>
      <span @click="doSearch">搜索</span>
    </div>
    <!-- 搜索框结束 -->
    <div class="tabs">
      <div class="subNav">
        <ul>
          <li :class="listCheck==1?'active':''" @click="checkType(1)">销量</li>
          <li @click="checkType(2)" :class="listCheck==2?'active':''">
            <span>价格</span>
            <span>
              <p class="top" :class="sort==0?'topactive':''"></p>
              <p class="down" :class="sort==1?'downactive':''"></p>
            </span>
          </li>
          <li @click="checkType(3)" :class="listCheck==3?'active':''">主推</li>
        </ul>
      </div>
    </div>
    <!-- 导航结束 -->
    <div
      class="dataList"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
    >
      <div class="camp_list" v-for="(item,index) in list" :key="index">
        <div class="camp_list_content">
          <div class="camp_list_left">
            <img :src="item.url?item.url:require('../images/default_logo.jpg')">
          </div>
          <div class="camp_list_right">
            <div class="camp_list_right_top">
              <h3>{{item.tyname}}</h3>
              <p>{{item.cj}}</p>
              <p>规格：{{item.hlgg}}</p>
              <p>单位：{{item.danwei}}</p>
            </div>
            <div class="camp_list_right_bottom">
              <div class="camp_list_right_bottom_left">
                <ul>
                  <li v-if="item.dqkc>0">仅剩{{item.dqkc}}件</li>
                  <li v-if="!item.dqkc||item.dpkc==0">无库存</li>
                  <li>¥{{item.ptsj}}</li>
                </ul>
              </div>
              <div class="camp_list_right_bottom_right">
                <p>已销:{{item.yssl?item.yssl:0}}件</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getManageMerchandise } from "@/api/index";
import { mapGetters } from "vuex";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      searchStr: "",
      listCheck: 1,
      loading: false,
      list: [],
      moreLoading: false,
      pageSize: 10,
      pageNum: 1,
      noData: false, //是否有数据
      hasMore: true,
      type: 1,
      sort:-1,
    };
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
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    searchShop(event) {
      if (event.keyCode == 13) {
        event.preventDefault(); //禁止默认事件（默认是换行）
        this.pageNum = 1;
        this.list = [];
        this.getCamp();
      }
    },
    doSearch() {
      this.pageNum = 1;
      this.list = [];
      this.getCamp();
    },
    async getCamp() {
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      let res = null;
      if(this.type==2){
        res = await getManageMerchandise({
          ...defaulParams,
          type: this.type,
          sort:this.sort,
          fullText: this.searchStr
        });
      }else{
         res = await getManageMerchandise({
          ...defaulParams,
          type: this.type,
          fullText: this.searchStr
        });
      }
      this.loading = false;
      if (res.code == 0) {
        if (!res.data.list.length) {
          this.hasMore = false;
          this.moreLoading = false;
          if (this.pageNum != 1) {
            Toast({
              message: "已经到底了~",
              position: "middle",
              duration: 2000
            });
          } else {
            Toast({
              message: "暂无数据",
              position: "middle",
              duration: 2000
            });
          }
          return;
        } else {
          this.hasMore = true;
          this.moreLoading = false;
        }
        this.list = [...this.list, ...res.data.list];
      }
    },
    loadMore() {
      if (this.moreLoading || !this.hasMore) {
        return;
      }
      this.pageNum = this.pageNum + 1;
      this.getCamp();
    },
    checkType(index) {
      this.listCheck = index;
      this.type = index;
      if (index == 2) {
        if(this.sort==-1){
          this.sort = 0;
        }else if(this.sort==0){
          this.sort = 1;
        }else{
          this.sort = 0;
        }
      }else{
        this.sort = -1;
      }
      this.loading = false;
      this.hasMore = true;
      this.list=[];
      this.pageNum = 1;
      this.getCamp(index);
    }
  },
  mounted() {
    this.loading = true;
    this.getCamp();
  },
  destroyed() {
    this.loading = false;
  },
};
</script>

<style scoped lang="scss">
.managecamp {
  background: #fff;
}
.manageHeader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 93px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(
    180deg,
    rgba(0, 122, 255, 1) 0%,
    rgba(24, 152, 247, 1) 100%
  );
  .leftIcon {
    width: 17px;
    height: 30px;
  }
  .inputArea {
    width: 506px;
    height: 58px;
    background-color: #fff;
    border-radius: 30px;
    position: relative;
  }
  .input {
    width: 506px;
    height: 58px;
    background-color: #fff;
    font-size: 22px;
    color: #999;
    line-height: 30px;
    letter-spacing: 2px;
    border: none;
    outline: none;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 30px;
    padding-left: 21px;
  }
  span {
    font-size: 28px;
    color: rgba(255, 255, 255, 1);
    line-height: 37px;
    letter-spacing: 2px;
  }
}
.tabs{
  position: fixed;
  top: 93px;
  left: 0;
  width: 100%;
  background-color: #fff;
}
.subNav {
  // display: flex;
  font-size: 28px;
  // margin-top: 93px;
  height: 91px;
  line-height: 91px;
  padding: 0 46px;
  border-bottom: 1px solid #dcdcdc;
  ul {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    li {
      span {
        display: inline-block;
        p.top {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 10px 13px 10px;
          border-color: transparent transparent #cccccc transparent;
          margin-bottom:3px;
        }
        p.down {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 13px 10px 0 10px;
          border-color: #ccc transparent transparent transparent;
        }
        p.topactive{
          border-color: transparent transparent #f5a623 transparent;
        }
        p.downactive{
          border-color: #f5a623 transparent transparent transparent;
        }
      }
      span:nth-of-type(2) {
        width: 18px;
        height: 22px;
        margin-left: 7px;
        img {
          width: 100%;
        }
      }
    }
    .active {
      color: #f5a623;
    }
  }
}
.dataList{
  margin-top: 185px;
}
.camp_list {
  min-height: 200px;
  padding: 27px 0px 27px 42px;
  .camp_list_content {
    display: flex;
    border-bottom: 1px solid #dcdcdc;
    padding-bottom: 30px;
  }
  .camp_list_left {
    width: 200px;
    height: 210px;
    overflow: hidden;
    // background: #dcdcdc;
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }
  .camp_list_right {
    width: 460px;
    margin-left: 26px;
    min-height: 220px;
    line-height: 30px;
    .camp_list_right_top {
      margin-bottom: 30px;
      h3 {
        font-size: 26px;
        margin-bottom: 10px;
        color: #333;
      }
      p {
        font-size: 18px;
        color: #666;
      }
    }
    .camp_list_right_bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      .camp_list_right_bottom_left {
        ul li {
          font-size: 18px;
          line-height: 40px;
          min-width: 117px;
          height: 24px;
          color: #ff220a;
          border: 1px solid #ff220a;
          line-height: 24px;
          border-radius: 5px;
          text-align: justify;
        }
        ul li:nth-of-type(1) {
          text-align: center;
        }
        ul li:nth-of-type(2) {
          font-size: 32px;
          border: none;
          margin-top: 20px;
          color: #333;
          font-weight: bold;
        }
      }
      .camp_list_right_bottom_right {
        p {
          color: #333;
          font-size: 18px;
          margin-top: 45px;
        }
      }
    }
  }
}
</style>
