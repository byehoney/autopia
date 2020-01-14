<template>
  <div>
    <ManageHeader :title="title" class="fixed"></ManageHeader>
    <div class="manageStock">
      <div class="manageStock_search">
        <span>
          <img src="../images/smallsousuo.png">
        </span>
        <span>
          <form @submit.prevent class="form">
            <input v-model="searchStr" @keypress="searchGoods" type="text" placeholder="请输入搜索内容">
          </form>
        </span>
        <span @click="doSearch">搜索</span>
      </div>
      <div class="top">
        <div class="left">
          <div class="inputArea">
            <span>天数</span>
            <form @submit.prevent @keypress="searchGoods" class="form">
              <input v-model="days" type="Number">
            </form>
          </div>
          <!-- <div :class="['date long',dateActive?'active':'']" @click="selDate">
              {{dateList[curDateIndex]}}
              <div class="dataList" v-if="showDateList">
                  <p :class="['dataItem',curDateIndex==index?'active':'']" @click="selCurDate($event,index)" v-for="(item,index) in dateList" :key="index">{{item}}</p>
              </div>
          </div> -->
          <div :class="['type',typeActive?'active':'']" @click="selType">
              {{typeList[curTypeIndex].text}}
              <div class="typeList" v-if="showTypeList">
                  <p :class="['typeItem',curTypeIndex==index?'active':'']" @click="selCurType($event,index)" v-for="(item,index) in typeList" :key="index">{{item.text}}</p>
              </div>
          </div>
          <div :class="['area',areaActive?'active':'']" @click="selArea" v-if="curTypeIndex==1">
              {{sel_value.substr(0,3).replace(',','')}}
          </div>
        </div>
        <div class="total" v-if="curTypeIndex==1&&list.length" >合计数：{{list[0].wdskhs}}</div>
      </div>
      <!-- 门店列表 -->
      <div class="manageChooseList">
        <ul
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
        >
          <template v-if="curTypeIndex==1">
            <li v-for="(item,index) in list" class="shop_list" :key="index">
              <div class="manageChoose_pic">
                <img src="../images/dianpu_m.png">
              </div>
              <div class="manageChoose_name">
                <p>门店名称：{{item.username}}</p>
                <p>注册地址：{{item.address}}</p>
              </div>
            </li>
          </template>
          <template v-if="curTypeIndex==0">
            <li v-for="(item,index) in list" class="manageStock_list" :key="index">
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
            </li>
          </template>
        </ul>
      </div>
    </div>
    <CityPicker :areaVisible="cityVisible" :setArea="handleSetArea" :cancel="handleCancel" global="manage"></CityPicker>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
import ManageHeader from "../components/ManageHeader";
import { reqNoCareGoods,reqWdxShop,getCoustomerCityList } from '@/api/index';
import CityPicker from "@/components/CityPicker";
export default {
  data() {
    return {
      title: "未动销查询",
      dateActive:true,
      typeActive:false,
      areaActive:false,
      showDateList:false,
      showTypeList:false,
      showAreaList:false,
      days:30,
      dateList:['近七天','近三十天','近三个月','近六个月'],
      typeList:[{text:'商品',sort:0},{text:'门店',sort:1}],
      areaList:[{regionCode: "", regionName: "全国"}],
      curDateIndex:0,
      curTypeIndex:0,
      curAreaIndex:0,
      searchStr:'',
      list:[],
      loading:false,
      moreLoading:false,
      hasMore:true,
      pageSize:10,
      pageNum:1,
      noData:false,//是否有数据
      cityVisible:false,
      sel_value:'全国',
      pCode:'',
      cCode:'',
      aCode:'',
    };
  },
  components: { ManageHeader,CityPicker },
  computed: {
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
  },
  async mounted() {
    this.loading = true;
    let defaulParams = {
      token:this.token,
      userId:this.userId,
      corpCode:this.corpCode,
      companyId:this.companyId,
      userRole:this.userRole,
    };        
    // let cities = await getCoustomerCityList({...defaulParams});
    // this.areaList = cities.data.list;
    this.getData();
  },
  destroyed() {
    console.log(this.pageNum)
    this.loading = false;
  },
  methods:{
    searchGoods(event){
      if (event.keyCode == 13) {
        event.preventDefault(); //禁止默认事件（默认是换行）
        this.getData();
      }
    },
    // handlerArea(){
    //     this.areaVisible = !this.areaVisible;
    // },
    handleSetArea(value,pCode,cCode,aCode){
        this.sel_value = value;
        this.pCode = pCode;
        this.cCode = cCode;
        this.aCode = aCode;
        this.cityVisible = false;
        this.loading = false;
        this.hasMore = true;
        this.list = [];
        this.pageNum = 1;
        this.getData();
    },
    handleCancel(){
        this.cityVisible = false;
    },
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
            pageNum:this.pageNum,
            day:this.days,
        }; 
        let res = '';
        if(this.curTypeIndex==0){
          res = await reqNoCareGoods({
            ...defaulParams,
            fullText:this.searchStr
          })
        }else{
           res = await reqWdxShop({
            ...defaulParams,
            fullText:this.searchStr,
            regionCode:this.aCode
          })
        }     
        this.moreLoading = false;
        this.loading = false;
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
        console.log(this.pageNum)
        this.pageNum = this.pageNum+1;
        this.getData();

    },
    selDate(){
        this.typeActive = false;
        this.dateActive = true;
        this.showTypeList = false;
        this.showDateList = true;
        this.showAreaList = false;
        this.areaActive = false;
        this.cityVisible = false;
    },
    selType(){
        this.typeActive = true;
        this.dateActive = false;
        this.showTypeList = true;
        this.showDateList = false;
        this.showAreaList = false;
        this.areaActive = false;
        this.cityVisible = false;
    },
    selArea(){
        this.typeActive = false;
        this.dateActive = false;
        this.showTypeList = false;
        this.showDateList = false;
        this.showAreaList = true;
        this.areaActive = true;
        this.cityVisible = !this.cityVisible;
    },
    selCurDate(e,index){
      e.stopPropagation();
      if(this.moreLoading){
          return;
      }
      this.loading = false;
      this.hasMore = true;
      this.curDateIndex = index;
      this.showDateList = false;
      this.list = [];
      this.pageNum = 1;
      this.getData();
    },
    selCurType(e,index){
        e.stopPropagation();
        if(this.moreLoading){
            return;
        }
        this.loading = false;
        this.hasMore = true;
        this.curTypeIndex = index;
        this.showTypeList = false;
        this.list = [];
        this.pageNum = 1;
        this.getData();
    },
    selCurArea(e,index){
      e.stopPropagation();
      if(this.moreLoading){
          return;
      }
      this.loading = false;
      this.hasMore = true;
      this.curAreaIndex = index;
      this.showAreaList = false;
      this.list = [];
      this.pageNum = 1;
      this.getData();
    },
  }
};
</script>

<style scoped lang="scss">
.inputArea{
  width: 150px;
  font-size:22px;
  color:#F5A623;
  letter-spacing:2px;
  display: flex;
  align-items: center;
  span{
    flex-shrink: 0;
  }
  input{
    width: 100px;
    border: none;
    outline: none;
    font-size:22px;
    color:#F5A623;
    padding-left: 20px;
  }
}
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
  .top{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 31px 37px 31px 0 ;
    height: 30px;
    // border-bottom: 2px solid #ebebeb;
    .left{
      display: flex;
      align-items: center;
    }
    .total{
        font-size:22px;
        color:#F5A623;
        line-height:29px;
        letter-spacing:2px;
        // margin-left: 65px;
    }
    .date{
      font-size:20px;
      color:rgba(245,166,35,1);
      line-height:26px;
      letter-spacing:2px;
    }
    .date,.type,.area{
        position: relative;
        width: 115px;
        font-size:22px;
        color:#F5A623;
        letter-spacing:2px;
        padding-left: 26px;
        &.long{
            width: 150px;
        }
        &.active{
            color: #F5A623;
            &::after{
                  border-color:#F5A623 transparent transparent transparent;
            }
        }
        .dataList,.typeList{
            position: absolute;
            left: 0;
            top: 0.6rem;
            border: 2px solid #ebebeb;
            background-color: #fff;
        }
        &::after{
            content: '';
            display: inline-block;
            width: 0; 
            height: 0;
            border-width: 13px;
            border-style: solid;
            border-color:#F5A623 transparent transparent transparent;
            position: absolute;
            top: 0;
            right: 0;
            top: 5px;
            right: 0;
        }
    }
    .dataList{
        .dataItem{
            padding-left: 26px;
            width: 189px;
            height: 75px;
            font-size:22px;
            font-family:MicrosoftYaHei;
            color:#666;
            letter-spacing:2px;
            line-height: 75px;
            border-bottom: 2px solid #ebebeb;
            &.active{
                background-color: #F5A623;
                color:#fff;   
            }
            &:last-child{
                border: none;
            }
        }
    }
    .typeList{
        .typeItem{
            padding-left: 26px;
            width: 189px;
            height: 75px;
            line-height: 75px;
            font-size:22px;
            color:rgba(102,102,102,1);
            letter-spacing:2px;
            border-bottom: 2px solid #ebebeb;
            &:last-child{
                border: none;
            }
            &.active{
                background-color: #F5A623;
                color:#fff;   
            }
        }
    }
}
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
    margin-bottom: 20px;
    border-bottom: 1px solid #dcdcdc;
    &.shop_list{
      padding-bottom:26px; 
    }
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
      p {
        line-height: 40px;
      }
    }
  }
}
</style>
