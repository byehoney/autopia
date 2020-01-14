<template>
  <div>
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
        <li>
          <span>门店名称:</span>
          <span>
            <input v-model="searchStr" type="text" placeholder="请输入门店名称">
          </span>
        </li>
      </ul>
      <div class="choosebtn" @click="doSearch">查询</div>
    </div>
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
        </li>
      </ul>
    </div>
    <awesome-picker
      ref="picker"
      :textTitle="picker.textTitle"
      :type="picker.type"
      :anchor="picker.anchor"
      :colorConfirm="picker.colorConfirm"
      @cancel="handlePickerCancel"
      @confirm="handlePickerConfirm"
    ></awesome-picker>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
import ManageHeader from "../components/ManageHeader";
import { reqManageNewAdd } from '@/api/index';
export default {
  data() {
    return {
      title: "今日新增客户",
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
    doSearch(){
      if(this.start&&!this.end){
        Toast({
            message: "请选择结束时间",
            position: "middle",
            duration: 2000
        });
        return;
      }else if(!this.start&&this.end){
        Toast({
            message: "请选择开始时间",
            position: "middle",
            duration: 2000
        });
        return;
      }else if(this.start&&this.end){
        let start = document.getElementById('start').innerText;
        let end = document.getElementById('end').innerText;
        if(new Date(this.end).getTime()<new Date(this.start).getTime()){
          Toast({
              message: "开始时间大于结束时间",
              position: "middle",
              duration: 2000
          });
          return;
        }
      }
      this.hasMore = true;
      this.pageNum = 1;
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
        let res = await reqManageNewAdd({
          ...defaulParams,
          fullText:this.searchStr,
          startTime:this.start,
          endTime:this.end
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
  }
};
</script>

<style scoped lang="scss">
.fixed{
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
}
.manageChoose {
  width: 711px;
  min-height: 462px;
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
        line-height: 90px;
      }
    }
  }
  ul li:nth-of-type(3) {
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
  }
}
.manageChooseList {
  font-size: 22px;
  color: #333333;
  background: #fff;
  margin-top: 10px;
  padding-left: 42px;
  ul li {
    display: flex;
    height: 100px;
    padding-top: 38px;
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
      p {
        line-height: 40px;
      }
    }
  }
}
</style>
