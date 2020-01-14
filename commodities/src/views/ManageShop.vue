<template>
  <div>
    <ManageHeader :title="title" class="fixed"></ManageHeader>
    <div class="manageStock">
      <div class="manageStockName">门店名称:</div>
      <div class="manageStock_search">
        <span>
          <img src="../images/smallsousuo.png">
        </span>
        <span>
          <form @submit.prevent class="form">
            <input v-model="searchStr" @keypress="searchGoods" type="text" placeholder="门店名称">
          </form>
        </span>
      </div>
       <div class="choosebtn" @click="doSearch">查询</div>
      <!-- 门店列表 -->
      <div class="manageChooseList">
        <ul 
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
        >
          <li v-for="(item,index) in list" :key="index">
            <div class="manageChoose_pic">
              <img src="../images/dianpu_m.png">
            </div>
            <div class="manageChoose_name">
              <p>门店名称：{{item.companyname}}</p>
              <p>注册地址：{{item.address}}</p>
            </div>
            <img class="today_icon" v-if="item.sfjrwcl=='是'" src="../images/manage/today_icon.png" alt="">
          </li>
        </ul>
       
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
import ManageHeader from "../components/ManageHeader";
import { reqNoCareShop } from '@/api/index';//待修改
export default {
  data() {
    return {
      title: "未处理采购门店",
      searchStr:'',
      loading:false,
      list:[],
      moreLoading:false,
      pageSize:10,
      pageNum:1,
      noData:false,//是否有数据
      hasMore:true,
    };
  },
  components: { ManageHeader },
  computed: {
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
  },
  mounted() {
    this.loading = true;
    this.getData();
  },
  destroyed() {
    this.loading = false;
  },
  methods: {
    doSearch(){
      this.hasMore = true;
      this.pageNum = 1;
      this.list = [];
      this.getData();
    },
    searchGoods(event){
      if (event.keyCode == 13) {
        event.preventDefault(); //禁止默认事件（默认是换行）
        this.hasMore = true;
        this.pageNum = 1;
        this.list = [];
        this.getData();
      }
    },
    async getData(){
        let defaulParams = {
            token:this.token,
            userId:this.userId,
            corpCode:this.corpCode,
            companyId:this.companyId,
            userRole:this.userRole,
            pageSize:this.pageSize,
            pageNum:this.pageNum
        };      
        let res = await reqNoCareShop({
          ...defaulParams,
          fullText:this.searchStr
        })
        this.loading = false;
        this.moreLoading = false;
        if(res.code == 0){
            if(!res.data.list.length){
                this.hasMore = false;
                this.moreLoading = false;
                if(this.pageNum!=1){
                    Toast({
                        message: "已经到底了~",
                        position: "middle",
                        duration: 2000
                    });
                }else{
                    Toast({
                        message: "暂无数据",
                        position: "middle",
                        duration: 2000
                    });
                }
                return;
            }else{
                this.hasMore = true;
                this.moreLoading = false;
            }
            this.list = [...this.list,...res.data.list];
        }
    },
    loadMore(){
        if(this.moreLoading||!this.hasMore){
            return;
        }
        this.pageNum = this.pageNum+1;
        this.getData();
    }
  },
};
</script>

<style scoped lang="scss">
.fixed{
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
}
.manageStock {
  background: #fff;
  margin-top: 100px;
  padding-left: 39px;
  padding-top: 20px;
  padding-bottom: 20px;
  .manageStockName{
      font-size: 22px;
      float: left;
      line-height: 40px;
      margin-top:10px;
      margin-right:20px;
  }
  .manageStock_search {
    width: 551px;
    height: 43px;
    background: #ebebeb;
    border-radius: 40px;
    display: flex;
    justify-content: space-between;
    padding-top: 15px;
    margin-bottom: 24px;
    span {
      color: #007aff;
      margin-left: 23px;
      font-size: 22px;
      input {
        width: 450px;
        height: 35px;
        background: none;
        border: none;
      }
    }
    span:nth-of-type(1) {
      width: 26px;
      height: 26px;
      img {
        width: 100%;
        margin-top: 5px;
      }
    }
    span:nth-of-type(3) {
      font-size: 26px;
      margin-right: 23px;
    }
  }
  .manageStock_tips {
    font-size: 20px;
    color: #f5a623;
    margin-bottom: 29px;
    ul li {
      float: left;
      margin-right: 29px;
      span {
        display: inline-block;
        width: 0;
        height: 0;
        border-width: 10px 10px 0;
        border-style: solid;
        border-color: #f5a623 transparent transparent; /*灰 透明 透明 */
      }
    }
    ul li:last-child {
      float: right;
      margin-right: 39px;
    }
  }
}
.manageChooseList {
  font-size: 22px;
  color: #333333;
  background: #fff;

  ul li {
    display: flex;
    // height: 100px;
    // margin-bottom: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #dcdcdc;
    .manageChoose_pic {
      width: 40px;
      height: 36px;
      margin-right: 20px;
      margin-top: 20px;
      img {
        width: 100%;
      }
    }
    .manageChoose_name {
      width: 500px;
      p {
        line-height: 40px;
      }
    }
    .today_icon{
      width: 100px;
      height: 34px;

    }
  }
}
.choosebtn {
  width: 384px;
  height: 90px;
  font-size:28px;
  background: -webkit-linear-gradient(top, #fad961, #f76b1c);
  border-radius: 50px;
  color: #fff;
  text-align: center;
  line-height: 90px;
  margin-top: 39px;
  margin-left: 149px;
  margin-bottom:69px;
}
</style>
