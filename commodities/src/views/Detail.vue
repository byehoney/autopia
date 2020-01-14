<template>
  <div>
    <div class="detail_header">
      <img class="detail_back" @click="goBack" src="../images/publicback.png">
      <div class="detail_title">商品详情</div>
    </div>
    <div class="detail_loop">
      <div class="detsil_loop_center">
        <mt-swipe :auto="0" :show-indicators="true">
          <mt-swipe-item class="item"  v-for="(stem,index) in shopDetail.spList" :key="index">
            <!-- <video
              class="myVideo"
              playsinline="true"
              x5-playsinline="true"
              x-webkit-airplay="allow"
              webkit-playsinline="true" 
              x5-video-player-type="h5"
              x5-video-player-fullscreen="true"
              x5-video-orientation="landscape"
              :poster="shopDetail.yt"
              controls=""
            >
              <source :src="stem">
            </video> -->
            <video-player v-if="shopDetail.spList.length"  class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions[index]"
            ></video-player>
          </mt-swipe-item>
          <mt-swipe-item class="item" v-for="(item) in shopDetail.tpList" :key="item">
            <img :src="item?item:require('../images/default_logo.jpg')">
          </mt-swipe-item>
        </mt-swipe>
        <!-- <img :src="shopDetail.yt?shopDetail.yt:require('../images/default_logo.jpg')"> -->
      </div>
    </div>

    <div class="detail_content">
      <!-- 限时秒杀广告栏位 -->
      <div class="detail_content_onece fix" v-if="!contentShow">
        <div class="detail_content_onece_left">
          <ul>
            <li v-if="shopDetail.hdlx!='无'">
              <i class="unit">¥</i>
              {{shopDetail.cxj}}
            </li>
            <li>
              <p class="oPrice">¥ {{shopDetail.ptsj}}</p>
              <p>仅剩{{shopDetail.dqkc}}件</p>
            </li>
            <li>{{shopDetail.xgl==0||!shopDetail.xgl?'不限购':'限购'+shopDetail.xgl+'件'}}</li>
          </ul>
        </div>
        <div class="detail_content_onece_right">
          <ul>
            <li>
              <span>
                <img src="../images/clock.png">
              </span>
              <span>限时秒杀</span>
            </li>
            <li>
              <span>{{H}}</span>:
              <span>{{M}}</span>:
              <span>{{S}}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 限时秒杀广告栏位 -->
      <!-- 价格栏位 -->
      <div class="detail_content_one">
        <div class="detail_content_title">{{shopDetail.spmc}}</div>
        <div class="detail_content_content">
          <div class="detail_content_tag">
            <span v-if="shopDetail.sfzt&&shopDetail.sfzt!='false'">
              <img src="../images/detail_xing.png">
            </span>
            <span v-if="shopDetail.hdlx=='打折'&&shopDetail.cxj!=0&&shopDetail.ptsj!=0" class="dis">
              {{shopDetail.cxj|formatDis(shopDetail.ptsj)}}折
            </span>
            <div class="pro_mark">
              <div class="markIcon" v-if="shopDetail.mzbj">买赠</div>
              <div class="limitIcon" v-if="shopDetail.hdlx=='秒杀'">{{(!shopDetail.xgl||shopDetail.xgl==0)?'不限购':'限购'+shopDetail.xgl+'件'}}</div>
              <div class="stock" v-if="shopDetail.hdlx=='秒杀'">仅剩{{shopDetail.dqkc}}件</div>
            </div>
            <div class="detail_content_price" v-if="contentShow">
              <ul v-if="shopDetail.hdlx!='无'">
                <li class="oPrice">原价：¥ {{shopDetail.ptsj}}</li>
              </ul>
            </div>
            <div v-if="!contentShow">
              <div class="detail_content_price">
                <ul>
                  <li class="saleNum">销量：<span class="num">{{shopDetail.jxsl?item.jxsl:0}}件</span></li>
                </ul>
              </div>
              <div class="detail_content_price">
                <ul>
                  <li>
                    所在地区：
                    <a>{{shopDetail.szdq}}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="newprice" v-if="contentShow"><i class="unit">¥</i> {{shopDetail.cxj}}</div>
        <div style="clear:both"></div>
      </div>
      <!-- 库存 -->
      <div v-if="!contentShow">
        <div class="storesave fix">
          <div class="storesave_left">
            <ul>
              <li></li>
              <li>限时限量 疯狂抢购</li>
            </ul>
          </div>
          <div class="storesave_right">
            <ul>
              <li>库存：</li>
              <li>{{shopDetail.dqkc}}</li>
            </ul>
          </div>
        </div>
        <div class="storesave_list fix">
          <ul>
            <li>优惠</li>
            <li>{{shopDetail.hdlx}}</li>
          </ul>
        </div>
        <div class="storesave_list bd fix" v-if="shopDetail.hdname">
          <ul>
            <li>活动</li>
            <li>{{shopDetail.hdname}}</li>
          </ul>
        </div>
      </div>
      <!-- 所在地区 -->
      <div class="detail_content_two" v-if="contentShow">
        <div class="detail_content_two_left">
          <ul>
            <li>
              <span>所在地区：</span>
              <span>{{shopDetail.szdq}}</span>
            </li>
            <li>
              <span>销量：</span>
              <span>{{shopDetail.ljsl?shopDetail.ljsl:0}} 件</span>
            </li>
          </ul>
        </div>
        <div style="clear:both"></div>
        <div class="detail_content_add" v-if="commonShow">
          <ul>
            <li>
              <span>优惠</span>
              <span>{{shopDetail.hdlx}}</span>
            </li>
            <li v-if="shopDetail.hdname">
              <span>活动</span>
              <span>{{shopDetail.hdname}}</span>
            </li>
          </ul>
        </div>
        <div class="detail_content_two_right">
          <!-- <img src="../images/detail_shop.png"> -->
        </div>
        <div style="clear:both"></div>
      </div>
      <!-- 商品信息栏位 -->
      <!-- <div class="detail_content_three" v-if="contentShow">
        <div class="detail_content_three_header">
          <span></span>
          <span>商品信息</span>
        </div>
        <div class="detail_content_three_desc">
          <ul>
            <li>
              <p>商品名称：{{shopDetail.spmc}}</p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
            </li>
            <li>
              <p>最小包装：{{shopDetail.xbz}}g</p>
              <p>采集量:{{shopDetail.cjl}}</p>
              <p>中包装:{{shopDetail.zbz}}</p>
              <p></p>
              <p></p>
            </li>
            <li>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
            </li>
          </ul>
        </div>
      </div> -->
      <!-- 秒杀 -->
      <div class="detail_content_three" >
        <div class="detail_content_three_header">
          <span></span>
          <span class="infoTitle">商品信息</span>
        </div>
        <div class="detail_content_three_desc">
          <ul>
            <li>
              <p>商品名称：{{shopDetail.spmc}}</p>
              <p>通用名称：{{shopDetail.tymc}}</p>
              <p>生产厂家：{{shopDetail.cj}}</p>
              <p>销售单位：{{shopDetail.dw}}</p>
              <p v-if="shopDetail.hlgg">产品规格：{{shopDetail.bzgg}}</p>
              <p>最小包装：{{shopDetail.xbz}}</p>
              <p>中包装:{{shopDetail.zbz}}</p>
              <p>立方:{{shopDetail.lifang}}</p>
              <!-- <p>辅量:{{shopDetail.fuliang}}</p> -->
              <p>库存：{{shopDetail.dqkc>0?'有':'无'}}</p>
              <p v-if="shopDetail.kczjxq">[最近效期]： {{shopDetail.kczjxq}}</p>
              <p>[限购量]：{{shopDetail.xgl>0?shopDetail.xgl:'不限购'}}</p>
              <p>[集采量]：{{shopDetail.cjl}}</p>
              <p v-if="shopDetail.pzwh">[国药准字]： {{shopDetail.pzwh}}</p>
            </li>
            <!-- <li>
              <p v-if="shopDetail.bzgg">[规格]： {{shopDetail.bzgg}}</p>
              <p v-if="shopDetail.pzwh">[批准文号]： {{shopDetail.pzwh}}</p>
              <p v-if="shopDetail.gjwm">[国家本位码]： {{shopDetail.gjwm}}</p>
              <p v-if="shopDetail.kczjxq">[最近效期]： {{shopDetail.kczjxq}}</p>
              <p></p>
            </li>
            <li>
              <p>最小包装：{{shopDetail.xbz}}</p>
              <p>采集量:{{shopDetail.cjl}}</p>
              <p>中包装:{{shopDetail.zbz}}</p>
              <p></p>
              <p></p>
            </li> -->
          </ul>
        </div>
      </div>

      <!-- 底部 -->
      <div class="footer_guide fix">
        <div class="footer_guide_left fix">
          <ul>
            <li @click="goShopCar">
              <img src="../images/shopcar.png">
              <p class="badge" v-if="buyNum>0">{{buyNum}}</p>
            </li>
            <li>
              <img src="../images/kefu.png">
            </li>
          </ul>
        </div>
        <div class="footer_guide_right fix">
          <ul>
            <li @click="handlerClick('add')">
              <span>加入购物车</span>
            </li>
            <li @click="handlerClick('buy')">
              <span>立即购买</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- popup弹出框 -->
    <div>
      <mt-popup v-model="popupVisible" position="bottom" class="detail_popup_content">
        <div class="detail_popup">
          <div class="detail_popup_title">
            <span>{{shopDetail.spmc}}</span>
            <span @click="popupVisible = !popupVisible">
              <img src="../images/close.png">
            </span>
          </div>
          <div class="detail_popup_price">¥{{shopDetail.cxj}}</div>
          <div class="detail_popup_num">
            <div class="detail_popup_num_left">购买数量</div>
            <div class="detail_popup_num_right">
              <ul>
                <li @click="reduce">-</li>
                <li @click="popInput">{{shopnum}}</li>
                <li @click="add">+</li>
              </ul>
            </div>
          </div>
          <div>
            <span>单品合计：</span>
            <span>¥{{money}}</span>
          </div>
        </div>
        <div class="detail_popup_num_shop" @click="confirmOper">确定</div>
      </mt-popup>
    </div>
    <div class="mask" v-show="showInput">
      <div class="inputModal">
        <p class="title">修改购买数量</p>
        <div class="funArea">
          <div class="reduce" @click="popReduce">-</div>
          <input type="number" min="1" v-model="num" class="num">
          <div class="add" @click="popAdd">+</div>
        </div>
        <div class="btnGroup">
          <div class="cancel btn" @click="closeInput">取消</div>
          <div class="confirm btn" @click="confirmInput">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import { Toast } from "mint-ui";
import { getChooseDetail,addToCar ,getCartNum,buyCheckNum,nowBuy} from "@/api/index";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      num:1,//计数
      shopnum: 1,//实际购买数
      money:0,
      popupVisible: false,
      shopDetail: [],
      contentShow: true,
      commonShow: true,
      showInput:false,
      H:'00',
      M:'00',
      S:'00',
      type:'',//add  添加购物车   buy  购买
      buyNum:0,
      playerOptions : []
    };
  },
  components: {
    videoPlayer
  },
  filters:{
      formatDis(nPrice,oPrice){
          return Math.floor((parseFloat(nPrice)/parseFloat(oPrice))*100)/10
      },
    },
  computed: {
    ...mapState("login", ["user"]),
    ...mapGetters("login", [
      "token",
      "userId",
      "corpCode",
      "companyId",
      "userRole"
    ])
  },
  methods: {
    goBack(){
      this.$router.go(-1);
    },
    goShopCar(){
      this.$router.push({name:'newShopCar'})
    },
    async confirmOper(){
      // if((this.shopnum>this.shopDetail.dqkc)&&this.this.shopDetail.dqkc){
      //   Toast({
      //     message: "库存不足", //弹窗内容
      //     position: "middle", //弹窗位置
      //     duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
      //   });
      //   return;
      // }else if(this.shopDetail.xbz&&(this.shopnum%this.shopDetail.xbz!=0)){
      //   Toast({
      //     message: "购买数量应为最小销售数量的整数倍", //弹窗内容
      //     position: "middle", //弹窗位置
      //     duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
      //   });
      //   return;
      // }else if(this.shopDetail.cjl&&this.shopnum<this.shopDetail.cjl){
      //   Toast({
      //     message: "购买数量应大于集采量", //弹窗内容
      //     position: "middle", //弹窗位置
      //     duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
      //   });
      //   return;
      // }else if(this.shopnum<this.shopDetail.cjl){
      //   Toast({
      //     message: "购买数量超过今日剩余可下单数量", //弹窗内容
      //     position: "middle", //弹窗位置
      //     duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
      //   });
      //   return;
      // }
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole,
        productId: this.$route.query.id
      };
      if(this.type == 'add'){
        let res = await buyCheckNum({...defaulParams,productId:this.shopDetail.priductid,num:this.shopnum});
        if(res.code==0&&res.data.ckeckResult=="true"){
          let jsonStr = "";
          if((this.shopDetail.mzbj&&this.shopDetail.mzbj.indexOf('买赠')>-1)||(this.shopDetail.mzbj&&(this.shopDetail.mzbj.indexOf('满额赠')>-1))){//买赠 满额赠
            jsonStr = JSON.stringify(
              [{
                mzhdlx:'买赠',
                pzlx:false,
                ghsbm:this.shopDetail.ghsbm,
                hdbm:this.shopDetail.mzhdbm,//活动编码
                jghdlx:this.shopDetail.hdlx,
                productId:this.shopDetail.priductid,
                cartNum:this.shopnum,
                pzdj:this.shopDetail.hdlx=='无'?this.shopDetail.ptsj:this.shopDetail.cxj,
                pzyj:this.shopDetail.ptsj,
                mobile:this.user.mobile
              }]
            )
          }else{//普通
            jsonStr = JSON.stringify(
              [{
                mzhdlx:'无',
                pzlx:false,
                ghsbm:this.shopDetail.ghsbm,
                jghdlx:this.shopDetail.hdlx,
                productId:this.shopDetail.priductid,
                cartNum:this.shopnum,
                pzdj:this.shopDetail.hdlx=='无'?this.shopDetail.ptsj:this.shopDetail.cxj,
                pzyj:this.shopDetail.ptsj,
                mobile:this.user.mobile
              }]
            )
          }
          let result = await addToCar({...defaulParams,jsonStr:jsonStr});
          if(result.code == 0){
            Toast({
              message: "加入购物车成功", //弹窗内容
              position: "middle", //弹窗位置
              duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
            });
            this.num = 1;
            this.shopnum = 1;
            this.popupVisible = false;
            this.getShopCarNum();
          }
        }else if(res.code==0&&res.data.ckeckResult!="true"){
          Toast({
            message: res.data.ckeckResult, 
            position: "middle", 
            duration: 2000
          });
        }
      }else{
        if(this.money<this.shopDetail.cje){
          Toast({
            message: '无效的采集额 采集额'+this.shopDetail.cje, 
            position: "middle", 
            duration: 2000
          });
          return;
        }
        let res = await buyCheckNum({...defaulParams,productId:this.shopDetail.priductid,num:this.shopnum});
        if(res.code==0&&res.data.ckeckResult=="true"){
          let jsonStr = {
            mzhdlx:'无',
            pzlx:false,
            jghdlx:this.shopDetail.hdlx,
            productId:this.shopDetail.priductid,
            cartNum:this.shopnum,
            pzdj:this.shopDetail.hdlx=='无'?this.shopDetail.ptsj:this.shopDetail.cxj,
            pzyj:this.shopDetail.ptsj,
            mobile:this.user.mobile
          }
          let result = await nowBuy({
            ...defaulParams,
            jsonStr:JSON.stringify(jsonStr)
          })
          if(result.code == 0){
            this.$router.push({name:'confirmOrders',query:{money:this.money,type:0}});
          }
        }else if(res.code==0&&res.data.ckeckResult!="true"){
          Toast({
            message:res.data.ckeckResult,
            position: "middle", 
            duration: 2000 
          });
        }
      }
    },
    async getShopCarNum(){
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole,
      };
      let res = await getCartNum(defaulParams);
      if(res.code==0){
        this.buyNum = res.data.countitem;
      }
    },  
    popReduce(){
      if(this.num<=1){
        this.num = 1;
      }else{
        this.num = this.num-1;
      }
  
    },
    popAdd(){
      this.num = this.num+1;
    },
    popInput(index,jIndex){
      this.showInput = true;
      this.num = this.shopnum;
    },
    closeInput(){
      this.showInput = false;
    },
    confirmInput(){
      this.showInput = false;
      this.shopnum = this.num;
      this.countMoney();
    },
    countMoney(){
      this.money = parseInt(this.shopnum)*(parseFloat(this.shopDetail.cxj)*1000)/1000;
    },
    count() {
      this.timer = setInterval(() => {
        let nowH = new Date().getHours();
        let nowM = new Date().getMinutes();
        let nowS = new Date().getSeconds();
        let endTime = this.shopDetail.endtime.split(':');
        let leftsecond =  (parseInt(endTime[0]) * 60 * 60 + parseInt(endTime[1])*60 + parseInt(endTime[2])) - (nowH * 60 * 60 + nowM * 60 + nowS);
        // console.log(leftsecond)
        // leftsecond--;
        if (leftsecond >= 0) {
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
          this.H = "00";
          this.M = "00";
          this.S = "00";
          clearInterval(this.timer);
        }
      }, 1000);
    },
    addshop() {
      Toast({
        message: "加入购物车成功", //弹窗内容
        position: "middle", //弹窗位置
        duration: 300 //弹窗时间毫秒,如果值为-1，则不会消失
      });
      this.shopnum += 1;
    },
    handlerClick(type) {
      this.type = type;
      this.popupVisible = true;
      this.countMoney();
    },
    add() {
      this.shopnum += 1;
      this.countMoney();
    },
    reduce() {
      this.shopnum <= 1 ? (this.shopnum = 1) : this.shopnum--;
      this.countMoney();
    },
    async getShopDetail() {
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole,
        productId: this.$route.query.id
      };
      let result = await getChooseDetail(defaulParams);
      this.shopDetail = result.data;
      let options = [];
      result.data.spList.forEach(item => {
        options.push({
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '4:3', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            src: item,  // 路径
          }],
          poster: result.data.yt, //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            // timeDivider: true,
            // durationDisplay: true,
            // remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        })
      });
      this.playerOptions = options;
      if (this.shopDetail.hdlx == "秒杀") {
        this.contentShow = false;
        this.count();
      } else {
        this.commonShow = true;
        this.contentShow = true;
      }
    }
  },
  deactivated() {
    this.loading = true;
  },
  mounted() {
    // if (this.shopDetail.sfzt == "true") {
    //   this.$router.push({ name: "flashdetail", query: { id: id } });
    // }
    this.getShopDetail();
    this.getShopCarNum();
  }
};
</script>

<style scoped lang="scss">
.myVideo{
  width: 100%;
  height: 100%;
}
.pro_mark{
  display: flex;
  align-items: center;
  margin-top: 12px;
  .markIcon{
    height: 30px;
    font-size:18px;
    color:#E32323;
    line-height:30px;
    box-sizing: border-box;
    border: 2px solid #E32323;
    padding: 0 10px;
    margin-right: 8px;
    border-radius:4px
  }
  .limitIcon{
    height:30px;
    background:#E32323;
    border-radius:4px;
    line-height: 30px;
    font-size:18px;
    color:rgba(255,255,255,1);
    margin-right: 8px;
    padding: 0 10px;
  }
  .stock{
    height: 30px;
    font-size:18px;
    color:#E32323;
    line-height:30px;
    box-sizing: border-box;
    border: 2px solid #E32323;
    padding: 0 10px;
    border-radius:4px
  }
}
.mint-toast.is-placemiddle{
  z-index: 10000!important;
}
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
.detail_header {
  width: 750px;
  min-height: 100px;
  background: #E32323;
  font-size: 30px;
  line-height: 100px;
  position: fixed;
  color: #fff;
  top: 0;
  left: 0;
}
.detail_back {
  position: absolute;
  margin-left: 46px;
  width: 17px;
  height: 30px;
  top: 35px;
}
.detail_title {
  text-align: center;
}
.detail_loop {
  width: 100%;
  min-height: 630px;
  background: #fff;
  margin-bottom: 6px;
  padding: 37px 0;
  margin-top:100px;
}
.detsil_loop_center {
  width:100%;
  height: 630px;
  margin: 0 auto;
  background: #f6f6f6;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.detail_content {
  width: 750px;
  min-height: 199px;
  padding-bottom: 100px;
}
.detail_content_onece {
  min-height: 117px;
  background: linear-gradient(to right, #ff6238, #ff1240);
  padding: 0;
}
.detail_content_onece_left {
  width: 480px;
  float: left;
  ul{
    display: flex;
    justify-content: space-between;
    align-items: center;
    li{
      flex-shrink: 0;
    }
  }
}
.detail_content_onece_left ul li {
  // width: 110px;
  float: left;
  font-size: 22px;
  margin-left: 46px;
  color: #fff;
  .oPrice {
    text-decoration: line-through;
  }
}
.detail_content_onece_left .unit {
  font-size: 24px;
  font-style: normal;
}
.detail_content_onece_left ul li:nth-of-type(1) {
  font-size: 50px;
  margin-top: 30px;
}
.detail_content_onece_left ul li:nth-of-type(2) {
  margin-top: 15px;
}
.detail_content_onece_left ul li:nth-of-type(2) p {
  line-height: 45px;
}
.detail_content_onece_left ul li:nth-of-type(3) {
  margin-top: 45px;
  margin-right: 30px;
  // width: 120px;
}
.detail_content_onece_right {
  width: 260px;
  min-height: 117px;
  float: right;
  background: url("../images/detail_flash.png") no-repeat top;
  background-size: 100%;
  line-height: 0;
}
.detail_content_onece_right ul li {
  margin-left: 60px;
  font-size: 30px;
  color: #fff;
  margin-top: 20px;
}
.detail_content_onece_right span {
  display: inline-block;
  font-size: 0.3rem;
}
.detail_content_onece_right ul li span:nth-of-type(1) {
  width: 26px;
  height: 26px;
  margin-right: 10px;
  font-size: 40px;
}
.detail_content_onece_right span img {
  width: 100%;
  vertical-align: middle;
  /* margin-right:10px; */
}
.detail_content_onece_right ul li:nth-of-type(2) {
  margin-left: 80px;
}
.detail_content_onece_right ul li:nth-of-type(2) span {
  display: inline-block;
  width: 33px;
  height: 33px;
  line-height: 33px;
  text-align: center;
  font-size: 22px;
  background: #db9d53;
}
// 秒杀样式
.detail_content_one,
.detail_content_two,
.detail_content_three {
  margin-bottom: 6px;
  background: #fff;
  padding: 24px 46px;
}
.detail_content_title {
  font-size: 34px;
  color: #333;
}
.detail_content_tag {
  // height: 43px;
  line-height: 43px;
  margin-bottom: 20px;
}
.detail_content_tag span {
  display: inline-block;
  width: 60px;
  height: 30px;
  margin-right: 10px;
  &.dis{
    width: 64px;
    height: 28px;
    line-height: 30px;
    text-align: center;
    border: 2px solid #E32323;
    color:#E32323;
    border-radius: 5px;
    position: relative;
    top: -5px;
  }
}
.detail_content_tag span img {
  width: 100%;
  vertical-align: top;
}
.detail_content_price {
  min-height: 61px;
  line-height: 61px;
  .oPrice{
    text-decoration: line-through;
  }
  .saleNum{
    text-decoration: none!important;
    .num{
      color:#E32323;
      font-size:22px;
    }
  }
}
.detail_content_price:first-child ul li {
  text-decoration: line-through;
}
.detail_content_price ul li {
  float: left;
}
.detail_content_price ul li:nth-of-type(1) {
  font-size: 22px;
  color: #999999;
}
.detail_content_price ul li:nth-of-type(2) {
  font-size: 28px;
  color: #E32323;
  float: right;
}
/* 库存 */
.storesave {
  width: 656px;
  min-height: 70px;
  background: #ffefef;
  line-height: 70px;
  color: #E32323;
  padding: 0 47px;
  font-size: 24px;
}
.storesave_left,
.storesave_right {
  float: left;
}
.storesave_left ul li,
.storesave_right ul li {
  float: left;
}
.storesave_right ul li:nth-of-type(1) {
  color: #999;
}
.storesave_left ul li:nth-of-type(1) {
  width: 44px;
  height: 44px;
  background: url("../images/miao.png") no-repeat center center;
  background-size: 100% 100%;
  margin-right: 24px;
  margin-top: 10px;
}
.storesave_right {
  float: right;
}
.storesave_list {
  min-height: 70px;
  background: #fff;
  line-height: 70px;
  border-bottom: 1px solid #ededed;
}
.bd {
  margin-bottom: 5px;
  border-bottom: none;
}
.storesave_list ul li {
  float: left;
  font-size: 22px;
  color: #666;
  margin-left: 49px;
}
.storesave_list ul li:nth-of-type(1) {
  color: #E32323;
}
.detail_content_two_left {
  width: 610px;
  font-size: 22px;
  color: #999999;
  float: left;
  line-height: 39px;
}
.detail_content_two_left ul li {
  float: left;
}
.detail_content_two_left ul li:nth-of-type(2) {
  float: right;
}
.detail_content_two_left span:nth-of-type(2) {
  color: #E32323;
}
.detail_content_add ul li {
  line-height: 30px;
  color: #666;
}
.detail_content_add ul li span:nth-of-type(1) {
  color: #E32323;
  margin-right: 25px;
}
.detail_content_two_right {
  width: 173px;
  float: left;
}
.detail_content_two_right img {
  width: 100%;
}
.detail_content_three {
  min-height: 648px;
}
.detail_content_three_header {
  font-size: 28px;
  color: #333;
  margin-bottom: 31px;
  display: flex;
  align-items: center;
  .infoTitle{
    font-size:28px;
    color:rgba(102,102,102,1);
    line-height:37px;
    letter-spacing:2px;
  }
}
.detail_content_three_header span:nth-of-type(1) {
  background: url("../images/home/block.png") no-repeat center;
  display: inline-block;
  width: 10px;
  height: 25px;
  margin-right: 8px;
}
.detail_content_three_desc {
  color: #666;
  font-size: 26px;
}
.detail_content_three_desc ul li {
  margin-bottom: 30px;
  line-height: 35px;
}
/* 底部样式 */
.footer_guide {
  border-top: 5px solid #e4e4e4;
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 1px;
  background-color: #fff;
  width: 100%;
  height: 95px;
  line-height: 95px;
}
.footer_guide_left {
  width: 262px;
  float: left;
  min-height: 100px;
}
.footer_guide_left ul li {
  width: 62px;
  height: 62px;
  float: left;
  margin-left: 49px;
}
.footer_guide_right ul li span {
  font-size: 30px;
}
.footer_guide_left ul li:nth-of-type(1) {
  position: relative;
}
.footer_guide_left ul li:nth-of-type(2) {
  width: 49px;
  height: 62px;
  float: left;
}
.footer_guide_left ul li img,
.footer_guide_right ul li img {
  width: 100%;
}
.footer_guide_right {
  width: 488px;
  float: left;
  text-align: center;
  color: #fff;
}
.footer_guide_right ul li {
  width: 244px;
  height: 100px;
  line-height: 50px;
  float: left;
  background: url("../images/resultgray.png") no-repeat top;
  background-size: 100% 100%;
}
.footer_guide_right ul li:nth-of-type(2) {
  background: url("../images/result.png") no-repeat top;
  background-size: 100% 100%;
}
.on {
  color: #02a774;
}
span {
  display: inline-block;
  font-size: 22px;
}
.badge {
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-weight: 500;
  border-radius: 50%;
  background: #F5A41A;
  position: absolute;
  z-index: 100;
  top: 10px;
  right: -20px;
  font-size: 20px;
  text-align: center;
  color: #fff;
}
.iconfont {
  font-size: 22px;
}
.detail_popup_content {
  width: 100%;
  font-size: 28px;
}
.detail_popup {
  width: 675px;
  height: 451px;
  color: #333;
  padding: 44px 30px 0 45px;
}
.detail_popup_title {
  font-size: 28px;
  min-height: 50px;
  margin-bottom: 24px;
}
.detail_popup_title span:nth-of-type(2) {
  /* float:right; */
  display: inline-block;
  width: 50px;
  height: 50px;
  float: right;
}
.detail_popup_title span img {
  width: 100%;
  vertical-align: middle;
}
.detail_content_content {
  float: left;
}
.newprice {
  float: right;
  font-size: 50px;
  color: #E32323;
  margin-top: 30px;
  // font-weight: bold;
  .unit{
    font-style: normal;
    font-size: 36px;
  }
}
.detail_popup_price {
  margin-bottom: 24px;
}
.detail_popup_num {
  border-top: 3px dashed #ccc;
  border-bottom: 3px dashed #ccc;
  line-height: 88px;
  min-height: 88px;
  margin-bottom: 24px;
}
.detail_popup_num_shop {
  position: fixed;
  bottom: 0;
  text-align: center;
  line-height: 100px;
  color: #fff;
  background: #E32323;
  width: 750px;
  font-size: 30px;
}
.detail_popup_num_left {
  float: left;
}
.detail_popup_num_right {
  float: right;
  width: 180px;
  height: 50px;
}
.detail_popup_num_right ul li {
  float: left;
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  line-height: 50px;
  margin-top: 15px;
  text-align: center;
  cursor: pointer;
}
.mask{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.3);
    z-index: 10000;
    .inputModal{
      width: 500px;
      height: 300px;
      background-color: #fff;
      border-radius: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -150px;
      margin-left: -250px;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      .btnGroup{
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 80px;
        border-top: 2px solid #ebebeb;
        .btn{
          width: 50%;
          text-align: center;
          line-height: 80px;
          font-size: 26px;
          &.confirm{
            background-color: #E32323;
            color: #fff;
            padding-right: 2px;
          }
        }
      }
      .title{
        font-size: 26px;
        color: rgba(102, 102, 102, 1);
        line-height: 35px;
        letter-spacing: 2px;
        text-align: center;
        padding: 30px 0;
      }
      .funArea{
        display: flex;
        align-items: center;
        justify-content: center;
        .reduce,.add{
          width: 50px;
          height: 50px;
          border: 2px solid #ebebeb;
          font-size: 26px;
          line-height: 50px;
          text-align: center;
        }
        .num{
          width: 100px;
          height: 50px;
          border-left: none;
          border-right: none;
          border-top: 2px solid #ebebeb;
          border-bottom: 2px solid #ebebeb;
          text-align: center;
          font-size: 26px;
          line-height: 50px;
          outline: none;
          color:#333;
        }
      }
    }
  }
</style>
