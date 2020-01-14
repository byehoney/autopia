<template>
  <div style="opacity:1">
    <ManageHeader :title="title" class="fixed"></ManageHeader>
    <div class="manageStock">
      <div class="manageStock_search">
        <span>
          <img src="../images/smallsousuo.png">
        </span>
        <span>
          <form @submit.prevent class="form">
            <input v-model="searchStr" @keypress="searchGoods" type="text" placeholder="商品名称">
          </form>
        </span>
        <span @click="doSearch">搜索</span>
      </div>
      <div class="manageStock_tips">库存不足30天销量</div>
      <div class="manageStock_content"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <div class="manageStock_list" v-for="(item,index) in list" :key="index">
          <div class="manageStock_list_pic">
            <img :src="item.yurl?item.yurl:require('../images/default_logo.jpg')">
          </div>
          <div class="manageStock_list_content">
            <div>
              <h3>{{item.tyname}}</h3>
              <p>{{item.cj}}</p>
              <p>规格：{{item.hlgg}}</p>
            </div>
            <div class="manageStock_list_price">
              <p>库存：{{item.stock}}件</p>
              <p>￥{{item.ptsj}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
import ManageHeader from "../components/ManageHeader";
import { reqNotFullStock } from '@/api/index'
export default {
  data() {
    return {
      title: "缺货商品",
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
        let res = await reqNotFullStock({
          ...defaulParams,
          fullText:this.searchStr
        })
        this.hasMore = true;
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
  padding-left: 39px;
  margin-top: 100px;
  padding-top: 15px;
  .manageStock_search {
    width: 674px;
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
        width: 500px;
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
    margin-bottom:29px;
  }
  .manageStock_list {
    display: flex;
    padding-bottom:34px;
    border-bottom:1px solid #dcdcdc;
    margin-bottom:34px;
    .manageStock_list_pic {
      width: 200px;
      height: 210px;
      margin-right:26px;
      img{
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
    }
    .manageStock_list_content {
      h3 {
        color: #333;
        font-size: 26px;
        line-height: 40px;
      }
      p {
        font-size: 18px;
        color: #666;
        line-height: 40px;
      }
    }
    .manageStock_list_price {
      margin-top:20px;
      p {
        font-size: 18px;
        color: #666;
      }
      p:nth-of-type(2){
        font-size: 32px;
        font-weight: bold;
      }
    }
  }
}
</style>
