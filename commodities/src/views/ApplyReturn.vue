<template>
  <div class="hasEvaContainer">
    <TopNav></TopNav>
    <div class="orderInfo">
      <span>订单编号：</span>
      <span>{{$route.query.orderId}}</span>
    </div>
    <div class="evaArea">
      <div class="top">
        <div class="selArea">
          <div class="selItem" v-for="(item,index) in reasons" :key="index" @click="selReason(index)">
            <img src="../images/car_circle.png" v-if="!item.checked" alt>
            <img src="../images/car_checkcircle.png" v-else alt>
            <p>{{item.reason}}</p>
          </div>
        </div>
        <div class="tipArea">
          <p class="tip_title">留言</p>
          <div class="tip_text">
            <textarea v-model="evaContent" placeholder="填写您要退货的详细原因"></textarea>
          </div>
        </div>
        <div class="upArea">
          <div class="selectPic">
            <UploadImages
              :setList="setImgList"
              :multiple="true"
              :max="6"
              :list="imgList"
              ref="upload"
            ></UploadImages>
          </div>
          <div class="up_tip">上传晒图</div>
        </div>
      </div>
    </div>
    <div class="nextBtn" @click="sendEva">提交</div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from "@/components/TopNav";
import UploadImages from "@/components/UploadImages";
import { backGOods } from "@/api/index";
import {mapGetters} from 'vuex'
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      reasons:[{reason:'质量问题',checked:false},{reason:'物流速度太慢',checked:false},{reason:'其他原因',checked:false}],
      evaContent: "",
      imgList: [],
      flag:'',//退货理由
    };
  },
  components: {
    TopNav,
    UploadImages
  },
  computed:{
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
  },
  methods: {
    selReason(index){
      this.reasons.forEach((item,index)=>{
        item.checked = false;
      })
      this.$set(this.reasons[index],'checked',!this.reasons[index].checked);
      this.flag = this.reasons[index].reason;
    },
    setImgList(list) {
      this.imgList = list;
    },
    async sendEva() {
      let defaulParams = {
        token:this.token,
        userId:this.userId,
        corpCode:this.corpCode,
        companyId:this.companyId,
        userRole:this.userRole,
      };
      let res = await backGOods({
        ...defaulParams,
        productId:this.$route.query.id,
        orderId:this.$route.query.orderId,
        comment:this.evaContent,
        flag:this.flag
      })
      if(res.code==0){
        Toast({  
            message: "提交成功",
            position: "middle",
            duration: 2000
        });
        setTimeout(()=>{
          this.$router.go(-1)
        },2100)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.hasEvaContainer {
  width: 100vw;
  min-height: 100vh;
  background: rgba(235, 235, 235, 1);
//   padding-bottom: 120px;
  .nav {
    border-bottom: 2px solid #ebebeb;
  }
  .orderInfo {
    height: 136px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 43px 0 48px;
    background-color: #fff;
    padding-top: 92px;
    font-size: 30px;
    color: rgba(51, 51, 51, 1);
    line-height: 40px;
    letter-spacing: 3px;
    margin-bottom: 7px;
  }
  .evaArea {
    padding: 0 0 10px 46px;
    background-color: #fff;
    .top {
        .selArea{
            .selItem{
                width: 100%;
                border-bottom: 2px solid #e9e9e9;
                font-size:26px;
                color:rgba(102,102,102,1);
                line-height:35px;
                letter-spacing:1px;
                display: flex;
                align-items: center;
                height: 104px;
                img{
                    width: 40px;
                    height: 40px;
                    margin-right: 28px;
                }
            }
        }
        .tipArea{
            .tip_title{
                font-size:26px;
                color:rgba(51,51,51,1);
                line-height:35px;
                letter-spacing:2px;
                padding-top: 45px;
                padding-bottom: 24px;
            }
            .tip_text{
                width:662px;
                height:184px;
                border:2px solid rgba(151,151,151,1);
                margin-bottom: 62px;
                padding-top: 5px;
                textarea{
                    width: 624px;
                    height: 146px;
                    border: none;
                    outline: none;
                    font-size:24px;
                    color:rgba(155,155,155,1);
                    line-height:31px;
                    letter-spacing:2px;
                    resize:none;
                    padding: 16px 0;
                    margin: 0 16px;
                }
            }
        }
        .upArea {
            // display: flex;
            margin-bottom: 34px;
            .selectPic {
            width: 100%;
            }
            .upBox {
            width: 168px;
            height: 124px;
            border-radius: 12px;
            border: 2px solid rgba(235, 235, 235, 1);
            background: url("../images/upload_icon.png") no-repeat center center;
            background-size: 87px 63px;
            }
            .up_tip {
            align-items: flex-end;
            font-size: 24px;
            color: rgba(51, 51, 51, 1);
            line-height: 31px;
            letter-spacing: 2px;
            display: flex;
            margin-left: 28px;
            }
        }
    }
  }
  .bottom {
    margin-top: 10px;
    .star {
      width: 36px;
      height: 34px;
      margin-right: 15px;
    }
  }
  .nextBtn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 98px;
    line-height: 98px;
    text-align: center;
    font-size: 36px;
    color: rgba(255, 255, 255, 1);
    letter-spacing: 3px;
    background-color: #FFC004;
    margin: 0 auto;
  }
}
</style>