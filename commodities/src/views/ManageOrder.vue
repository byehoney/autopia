<template>
  <!-- 今日订单 -->
  <div class="order_wrap">
    <ManageHeader :title="title" class="fixed"></ManageHeader>
    <div class="manageChoose">
      <ul>
        <li @click="show('S')">
          <span>开始时间:</span>
          <span v-if="start" id="start">
            {{start}}
          </span>
          <span v-else>
            请选择开始时间
          </span>
        </li>
        <li @click="show('E')">
          <span>结束时间:</span>
          <span v-if="end" id="end">
            {{end}}
          </span>
          <span v-else>
            请选择结束时间
          </span>
        </li>
        <li class="left">
          <span>订单号:</span>
          <span>
            <input v-model="orderId" type="text" placeholder="请输入订单号">
          </span>
        </li>
        <li class="left">
          <span>门店:</span>
          <span>
            <input v-model="companyName" type="text" placeholder="请输入门店">
          </span>
        </li>
        <li class="left" @click="handlerArea">
          <span>选择地区:</span>
          <span>
            {{sel_value}}
          </span>
        </li>
        <li @click="showFirst">
          <span>只显示今日首单:</span>
          <img src="../images/manage_unCheck.png" v-if="!checked" class="check" />
          <img src="../images/manage_checked.png" v-if="checked" class="check" />
        </li>
      </ul>
      <div class="choosebtn" @click="doSearch">查询</div>
    </div>
    <!-- 订单 -->
    <div class="manage_order"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
    >
      <div class="order_num fix">
        <ul>
          <li>今日首单数：{{sds}}单</li>
          <li>合计订单数：{{ordernum}}单</li>
        </ul>
      </div>
      <div class="order_list" v-for="(item,index) in list" :key="index" @click="geDetail(item.orderid)">
        <div class="order_list_top">
          <div class="order_list_top_left">
            <span>
              <img src="../images/manage_menu.png">
            </span>
            <span>订单{{item.orderid}}</span>
          </div>
          <div class="order_list_top_right">
            {{item.orderstatus}}
          </div>
        </div>
        <div class="order_list_middle">
          <div class="order_list_middle_left">店铺名称：</div>
          <div class="order_list_middle_center">
            <p>{{item.companyname}}</p>
            <!-- <p>{{item.address}}</p> -->
          </div>
          <div class="order_list_middle_right" v-if="item.sdbj=='首单'">
            <img src="../images/manage_soudan.png">
          </div>
        </div>
        <div class="order_list_bottom">
          <ul>
            <li>
              联系人：
              <span>{{item.username}}</span>
            </li>
            <li>
              <p>
                联系电话：
                <span>{{item.mobile}}</span>
              </p>
              <p>￥{{item.money}}</p>
            </li>
          </ul>
        </div>
        <div class="order_list_bottoms">
          <ul>
            <li>
              总件数：
              <span>{{item.count}}</span>
            </li>
            <li>
              下单时间:
              <span>{{item.time}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- <ManageBottom></ManageBottom> -->
    <awesome-picker
      ref="picker"
      :textTitle="picker.textTitle"
      :type="picker.type"
      :anchor="picker.anchor"
      :colorConfirm="picker.colorConfirm"
      @cancel="handlePickerCancel"
      @confirm="handlePickerConfirm"
    ></awesome-picker>
    <CityPicker global="manage" :areaVisible="areaVisible" :setArea="handleSetArea" :cancel="handleCancel"></CityPicker>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
import ManageHeader from "../components/ManageHeader";
import ManageBottom from "../components/ManageTabBarBottom";
import CityPicker from "@/components/CityPicker";
import { reqManageFirstOrder } from '@/api/index'
export default {
  data() {
    return {
      title: "今日订单",
      areaVisible:false,
      sel_value:'请选择地区',
      pCode:'',
      cCode:'',
      aCode:'',
      start:this.getNowFormatDate() ,
      end:this.getNowFormatDate(),
      curDate:'',
      Y: "",
      M: "",
      D: "",
      picker: {
        anchor: [],
        textTitle: "选择日期",
        type: "date",
        colorConfirm:"#007AFF"
      },
      checked: false,
      orderId:'',
      companyName:'',
      loading:false,
      list:[],
      moreLoading:false,
      pageSize:10,
      pageNum:1,
      noData:false,//是否有数据
      hasMore:true,
      sds:0,
      ordernum:0
    };
  },
  components: { ManageHeader, ManageBottom,CityPicker },
  computed: {
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
  },
  mounted(){
    this.loading = true;
    this.getData();
  },
  destroyed() {
    this.loading = false;
  },
  methods: {
    geDetail(id){
      this.$router.push({
        name:'manageOrderDetail',
        query:{
          id:id,
          startTime:this.start,
          endTime:this.end,
          orderData:this.checked,
          pageSize:this.pageSize,
          pageNum:this.pageNum
        }
      })
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    doSearch(){
      this.hasMore = true;
      this.pageNum=1;
      this.list = [];
      this.getData();
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
      let res = await reqManageFirstOrder({
        ...defaulParams,
        startTime:this.start,
        endTime:this.end,
        orderData:this.checked,
        regionCode:this.aCode,
        companyName:this.companyName,
        orderId:this.orderId
      })
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
          this.sds = this.list[0].sds;
          this.ordernum = this.list[0].ordernum;
      }
    },
    loadMore(){
        if(this.moreLoading||!this.hasMore){
            return;
        }
        this.pageNum = this.pageNum+1;
        this.getData();
    },
    showFirst(){
      this.checked = !this.checked;
    },
    handlerArea(){
        this.areaVisible = !this.areaVisible;
    },
    handleSetArea(value,pCode,cCode,aCode){
        this.sel_value = value;
        this.pCode = pCode;
        this.cCode = cCode;
        this.aCode = aCode;
        this.areaVisible = false;
    },
    handleCancel(){
        this.areaVisible = false;
    },
    show(type) {
      this.curDate = type;
      this.$refs.picker.show();
    },
    handlePickerCancel(){

    },
    handlePickerConfirm(v) {
      console.log(v)
      this.Y = parseInt(v[0].value)>9?parseInt(v[0].value):'0'+parseInt(v[0].value);
      this.M = parseInt(v[1].value)>9?parseInt(v[1].value):'0'+parseInt(v[1].value);
      this.D = parseInt(v[2].value)>9?parseInt(v[2].value):'0'+parseInt(v[2].value);
      this.picker.anchor = v;
      this.$refs.picker.display=false;
      if(this.curDate == 'S'){
        this.start = this.Y + '-' +this.M + '-'+ this.D;    
      }else{
        this.end = this.Y + '-' +this.M + '-'+ this.D; 
      }
    },
  }
};
</script>

<style scoped lang="scss">
.order_wrap {
  padding-bottom: 138px;
}
.fixed{
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
}
.manageChoose {
  width: 711px;
  min-height: 762px;
  font-size: 28px;
  padding-left: 39px;
  background: #fff;
  margin-top: 100px;
  ul li {
    display: flex;
    width: 100%;
    height: 91px;
    line-height: 91px;
    justify-content: space-between;
    border-bottom: 1px solid #dcdcdc;
    span {
      margin-right: 39px;
      input {
        width: 100%;
        border: none;
        line-height: 80px;
      }
    }
    .check {
      width: 39px;
      height: 39px;
      border: 1px solid #dcdcdc;
      margin-top: 20px;
      margin-right: 44px;
    }
  }
  ul li.left {
    justify-content: left;
  }
  .choosebtn {
    width: 384px;
    height: 90px;
    background: -webkit-linear-gradient(top, #fad961, #f76b1c);
    border-radius: 50px;
    color: #fff;
    text-align: center;
    line-height: 90px;
    margin-top: 39px;
    margin-left: 149px;
    margin-bottom: 48px;
  }
}
.manage_order {
  font-size: 26px;
  padding: 0px 39px;
  color: #666;
  .order_num {
    margin-bottom: 26px;
    ul li {
      float: left;
    }
    ul li:nth-of-type(2) {
      float: right;
    }
  }
  .order_list {
    width: 674px;
    min-height: 276px;
    background: #fff;
    padding-top: 21px;
    font-size: 22px;
    margin-bottom: 26px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .order_list_top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 21px;
      padding: 0px 27px;
      .order_list_top_left {
        display: flex;
        line-height: 40px;
        span {
          display: inline-flex;
        }
        span:nth-of-type(1) {
          width: 38px;
          height: 38px;
          margin-right: 10px;
          img {
            width: 100%;
          }
        }
        span:nth-of-type(2) {
          font-size: 26px;
        }
      }
      .order_list_top_right {
        width: 100px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border: 2px solid #ff0304;
        color: #ff0304;
        border-radius: 4px;
        img {
          width: 100%;
        }
      }
    }
    .order_list_middle {
      display: flex;
      margin-bottom: 10px;
      color: #999999;
      padding: 0px 27px;
      .order_list_middle_left {
        width: 150px;
        color: #666;
      }
      .order_list_middle_center {
        width: 500px;
        font-size: 22px;
      }
      .order_list_middle_right {
        width: 68px;
        height: 34px;
        margin-left: 90px;
        img {
          width: 100%;
        }
      }
    }
    .order_list_bottom {
      display: flex;
      border-bottom: 1px solid #dcdcdc;
      padding: 0 0 10px 26px;
      ul li {
        display: flex;
        line-height: 40px;
        span {
          color: #999;
        }
        p {
          span {
            color: #999;
          }
        }
      }
      p:nth-of-type(2) {
        margin-left: 210px;
        color: #ff0304;
      }
    }
    .order_list_bottoms {
      // display: flex;
      padding: 0px 27px;
      ul{
        display: flex;
        justify-content: space-between;
      }
      ul li {
        // float: left;
        line-height: 65px;
        span {
          color: #999;
        }
      }
      ul li:nth-of-type(2) {
        margin-left: 51px;
      }
    }
  }
}
</style>
