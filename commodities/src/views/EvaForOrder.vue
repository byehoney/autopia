<template>
  <div class="hasEvaContainer">
    <TopNav></TopNav>
    <div class="evaArea">
      <div class="top">
        <div class="shopArea">
          <div class="shopImg">
            <img :src="url" alt>
          </div>
          <div class="tip">分享你的使用体验吧</div>
        </div>
        <div class="inputArea">
          <mt-field label placeholder="请输入您对本产品的评价" type="textarea" rows="4" v-model="evaContent"></mt-field>
        </div>
        <div class="upArea">
          <div class="selectPic">
            <UploadImages :setList="setImgList" :multiple="true" :max="6" :list="imgList" ref="upload"></UploadImages>
          </div>
          <div class="up_tip">上传晒图</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <mt-cell title="物流服务评价">
        <img class="star" slot="icon" src="../images/waite_get.png" width="24" height="24">
      </mt-cell>
      <mt-cell title="快递包装">
        <img
          class="star"
          v-for="(star,index) in packStars"
          :key="index"
          :src="star.src"
          @click="rating(index,packStars,packNum,'packNum','packStars')"
          alt="星星图片"
        >
      </mt-cell>
      <mt-cell title="送货速度">
        <img
          class="star"
          v-for="(star,index) in speedStars"
          :key="index"
          :src="star.src"
          @click="rating(index,speedStars,speedNum,'speedNum','speedStars')"
          alt="星星图片"
        >
      </mt-cell>
      <mt-cell title="配送员服务">
        <img
          class="star"
          v-for="(star,index) in sendStars"
          :key="index"
          :src="star.src"
          @click="rating(index,sendStars,sendNum,'sendNum','sendStars')"
          alt="星星图片"
        >
      </mt-cell>
    </div>
    <div class="nextBtn" @click="sendEva">提交</div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from "@/components/TopNav";
import UploadImages from "@/components/UploadImages";
let starOffImg = require("@/images/star_grey.png");
let starOnImg = require("@/images/eva_star.png");
import {evaForOrder} from '@/api/index'
import {mapGetters} from 'vuex'
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      id:'',
      url:'',
      evaContent: "",
      imgList: [],
      packNum:5,
      speedNum:5,
      sendNum:5,
      packStars: [
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        }
      ],
      speedStars: [
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        }
      ],
      sendStars: [
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        },
        {
          src: starOnImg,
          active: true
        }
      ]
    };
  },
  components: {
    TopNav,
    UploadImages
  },
  computed:{
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
  },
  mounted() {
    this.id = this.$route.query.id;
    this.url = this.$route.query.url;
    console.log(this.id,this.url)
  },
  methods: {
    setImgList(list){
      this.imgList = list;
    },
    async sendEva(){
      if(!this.evaContent.trim()){
        Toast({
            message: "请输入评价内容",
            position: "middle",
            duration: 2000
        });
        return;
      }
      let defaulParams = {
        token:this.token,
        userId:this.userId,
        corpCode:this.corpCode,
        companyId:this.companyId,
        userRole:this.userRole,
        comment:this.evaContent,
        orderId:this.id,
        url:this.imgList.join(','),
        bzpj:this.packNum,
        shsdpj:this.speedNum,
        psypj:this.sendNum  
      };
      let res = await evaForOrder(defaulParams);   
      if(res.code==0){
        Toast({  
            message: "评价成功",
            position: "middle",
            duration: 2000
        });
        setTimeout(()=>{
          this.$router.go(-1)
        },3000)
      }
    },
    rating(index, type,starNum,score,arr) {
        var total = type.length; // 星星总数
        var idx = index + 1; // 这代表选的第idx颗星-也代表应该显示的星星数量
        // 进入if说明页面为初始状态
        if (starNum === 0) {
          starNum = idx;
          var count = 0;
          for (var i = 0; i < idx; i++) {
            type[i].src = starOnImg;
            type[i].active = true;
            if (type[i].active) {
              count++;
            }
          }
          this[arr] = type;
          this[score] = count;
        } else {
          // 如果再次点击当前选中的星级-仅取消掉当前星级，保留之前的。
          if (idx == starNum) {
            for (var i = index; i < total; i++) {
              if (i != 0) {
                type[i].src = starOffImg;
                type[i].active = false;
              }
            }
          }
          // 如果小于当前最高星级，则直接保留当前星级
          if (idx < starNum) {
            for (var i = idx; i < type.length; i++) {
              if (i != 0) {
                type[i].src = starOffImg;
                type[i].active = false;
              }
            }
          }
          // 如果大于当前星级，则直接选到该星级
          if (idx > starNum) {
            for (var i = 0; i < idx; i++) {
              type[i].src = starOnImg;
              type[i].active = true;
            }
          }

          var count = 0; // 计数器-统计当前有几颗星
          for (var i = 0; i < total; i++) {
            if (type[i].active) {
              count++;
            }
          }
          this[arr] = type;
          this[score] = count;
          console.log( this.packNum,this.speedNum,this.sendNum)
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
  padding-bottom: 120px;
  .nav {
    border-bottom: 2px solid #ebebeb;
  }
  .evaArea {
    padding: 118px 41px 10px 39px;
    background-color: #fff;
    .mint-field.is-textarea {
      height: 99%;
    }
    .top {
      .shopArea {
        display: flex;
        .shopImg {
          width: 168px;
          height: 140px;
          overflow: hidden;
          // background:rgba(235,235,235,1);
          img {
            // width: 100%;
            object-fit: scale-down;
            width: 100%;
            height: 100%;
          }
        }
        .tip {
          font-size: 24px;
          color: rgba(51, 51, 51, 1);
          line-height: 31px;
          letter-spacing: 2px;
          margin-left: 28px;
          align-self: flex-end;
        }
      }
      .inputArea {
        width: 658px;
        height: 264px;
        margin: 55px auto 38px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(151, 151, 151, 1);
        .mint-cell-wrapper {
          background: none;
          .mint-field.is-textarea .mint-cell-value {
            padding: 0;
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
  .nextBtn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 98px;
    line-height: 98px;
    text-align: center;
    font-size:36px;
    color:rgba(255,255,255,1);
    letter-spacing:3px;
    background-color: #FFC004;
    margin: 0 auto;
  }
}
</style>