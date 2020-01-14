<template>
  <!-- 今日订单 -->
  <div class="order_wrap">
    <ManageHeader :title="title" class="fixed"></ManageHeader>
    <div class="companyList">
        <div class="companyItem">
            <div class="itemDes">公司编码：10</div>
            <div class="itemDes">公司名称：10</div>
            <div class="itemDes">岗位名称：10</div>
        </div>
    </div>
    <div class="btn">保存</div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
import ManageHeader from "../components/ManageHeader";
export default {
  data() {
    return {
      title: "公司岗位",
    };
  },
  components: { ManageHeader},
  computed: {
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
  },
  mounted(){
   
  },
  methods: {
    
  }
};
</script>

<style scoped lang="scss">
    .order_wrap{
        padding-bottom: 120px;
    }
    .companyList{
        background-color: #fff;
        border-top: 2px solid #ebebeb;
    }
    .companyItem{
        background-color: #fff;
        padding-left: 40px;
        line-height: 114px;
        font-size:26px;
        font-family:MicrosoftYaHei;
        color:rgba(102,102,102,1);
        line-height:114px;
        margin-bottom: 10px;
        .itemDes{
            border-bottom: 2px solid #ebebeb;
        }
    }
    .btn{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 98px;
        line-height: 98px;
        background-color: #F5A623;
        font-size:30px;
        font-family:MicrosoftYaHei;
        color:rgba(255,255,255,1);
        text-align: center;
    }
</style>
