<template>
  <div style="opacity:1" :class="[popupVisible?'popContainer':'']">
    <mt-header title="购物车" class="shopCar_header">
      <router-link to="" slot="left">
        <mt-button @click.native="$router.go(-1)" icon="back" class="text"></mt-button>
      </router-link>
      <mt-button title="管理" slot="right" class="text">
        <span @click="complete">{{result?'管理':'完成'}}</span>
      </mt-button>
    </mt-header>
    <div class="list_shopcar fix" >
      <!--普通 -->
      <div class="area">
        <div class="list_shopcar_title" v-if="head">
          <div class="list_shopcar_name">
            <div
              class="list_shopcar_circle"
              :class="checkedAll?'checked':''"
              @click="chooseAll"
            ></div>
            <span>{{head.syname}}</span>
          </div>
          <div class="list_shopcar_desc">每日采集额:{{head.cje}}</div>
        </div>
        <div class="list_shopcar_content fix" v-for="(list,index) in list" :key="index">
          <div class="contentTop">
            <div class="list_shopcar_circle" :class="list.checked?'checked':''" @click="chooseSingle(index,'common')"></div>
            <div class="com_add">
              <div class="com_add_top" v-if="list.schemetype=='秒杀'">
                <p class="ms">秒杀</p>
                <p class="ms_des">距离活动结束时间还剩</p>
                <p class="ms_time">{{H}}</p>
                <p class="ms_time">{{M}}</p>
                <p class="ms_time">{{S}}</p>
              </div>
              <div class="com_add_bottom">
                <div class="list_shopcar_pic" @click="goDetail(list.productcode)">
                  <img :src="list.imgurl?list.imgurl:require('../images/default_logo.jpg')">
                </div>
                <div class="list_shopcar_com fix">
                  <div class="list_shopcar_com_top fix">
                    <div class="list_shopcar_com_top_title">
                      <p>{{list.promotionflag=='套餐'?list.cartproductsuitename:list.formalname}}</p>
                      <p>{{list.promotionflag=='套餐'?'&nbsp;':list.factory}}</p>
                      <p>{{list.promotionflag=='套餐'?'&nbsp;':'规格：'+list.specification}}</p>
                      <p class="oPrice">原价:¥ {{list.platformprice}}</p>
                    </div>
                  </div>
                  <div class="list_shopcar_com_bottom fix">
                    <div class="list_shopcar_com_price">¥ {{list.price}}</div>
                    <div class="list_shopcar_com_num">
                      <ul>
                        <li @click="reduce('common',index,list.minpack)">-</li>
                        <li @click="popInput('common',index,list.minpack,list.stock)">
                          {{list.quantity}}
                        </li>
                        <li @click="add('common',index,list.minpack,list.stock)">+</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <p class="errTip" v-if="list.showTip">{{list.errTip}}</p>
            </div>
          </div>
          <!-- 普通商品买赠活动 -->
          <!-- <div class="shop_gift" v-if="list.giveflag!='无'">
            <div class="shop_gift_top">
              <div class="shop_gift_left">
                <h3>商品活动</h3>
              </div>
              <div class="shop_gift_right">
                <p>累积购买可获赠品，点击查看更多活动规则</p>
                <div class="activity" v-show="list.showAct">
                  <p v-for="(name,index) in list.givename.split(',')" :key="index">{{name}}</p>
                </div>
              </div>
              <img :class="['arrIcon',list.showAct?'act':'']" src="../images/arrow_down.png" @click="showAct('common',index)">
            </div>
          </div>
          <div class="shop_gift" v-if="list.canSelGift">
            <div class="shop_gift_bottom">
              <router-link to="/choosegift">选择赠品</router-link>
            </div>
          </div> -->
          <!-- 普通商品买赠活动结束 -->
        </div>
      </div>
      <!-- 满赠 -->
      <div v-for="(mzlist,index) in mzList" :key="index" class="area act">
        <div class="list_shopcar_title">
          <div class="list_shopcar_name">
            <div
              class="list_shopcar_circle"
              :class="mzlist[0].allChecked?'checked':''"
              @click="blockChoose(index)"
            ></div>
            <span class="actName">{{mzlist[0].buyName}}</span>
          </div>
        </div>
        <div class="list_shopcar_content fix" v-for="(pmlist,jIndex) in mzlist" :key="jIndex">
          <div class="contentTop">
            <div class="list_shopcar_circle" :class="pmlist.checked?'checked':''" @click="chooseSingle(index,'mz',jIndex)"></div>
            <div class="com_add">
              <div class="com_add_bottom">
                <div class="list_shopcar_pic" @click="goDetail(pmlist.productcode)">
                  <img :src="pmlist.imgurl?pmlist.imgurl:require('../images/default_logo.jpg')">
                </div>
                <div class="list_shopcar_com fix">
                  <div class="list_shopcar_com_top fix">
                    <div class="list_shopcar_com_top_title">
                      <p>{{pmlist.formalname}}</p>
                      <p>{{pmlist.factory}}</p>
                      <p>规格：{{pmlist.specification}}</p>
                      <p class="oPrice">原价:¥ {{pmlist.platformprice}}</p>
                    </div>
                  </div>
                  <div class="list_shopcar_com_bottom fix">
                    <div class="list_shopcar_com_price">¥ {{pmlist.price}}</div>
                    <div class="list_shopcar_com_num">
                      <ul>
                        <li @click="reduce('mzlist',index,pmlist.minpack,jIndex)">-</li>
                        <li @click="popInput('mzlist',index,pmlist.minpack,pmlist.stock,jIndex)">
                          {{pmlist.quantity}}
                        </li>
                        <li @click="add('mzlist',index,pmlist.minpack,pmlist.stock,jIndex)">+</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p class="errTip" v-if="pmlist.showTip">{{pmlist.errTip}}</p>
          <div class="shop_gift" v-if="pmlist.giveflag!='无'">
            <div class="shop_gift_top">
              <div class="shop_gift_left">
                <h3>商品活动</h3>
              </div>
              <div class="shop_gift_right">
                <p>累积购买可获赠品，点击查看更多活动规则</p>
                <div class="activity" v-show="pmlist.showAct">
                  <p v-for="(name,index) in pmlist.givename.split(',')" :key="index">{{name}}</p>
                </div>
              </div>
              <img :class="['arrIcon',pmlist.showAct?'act':'']" src="../images/arrow_down.png" @click="showAct('mzlist',index,jIndex)">
            </div>
          </div>
          <div class="shop_gift" v-if="mzList[index][0].canSelGift&&jIndex==mzList[index].length-1">
            <div class="shop_gift_bottom">
              <span @click="chooseGift(index,mzList[index][0].productcode,mzList[index][0].numberormny,mzList[index][0].userBuyNum,mzList[index][0].userBuyMoney)">{{mzList[index][0].selGifts.length==0?'选择赠品':'已选择'}}</span>
            </div>
          </div>
        </div>
      </div>


      <!-- 脚部 -->
    </div>
    <!-- 一个商品结束 -->
    <div>
      <div class="giftTip" v-if="giftTipShow">
        {{gitTipText}}
      </div>
      <mt-tabbar fixed class="shop_footer">
        <div class="shop_footer_left" @click="chooseAll()">
          <span :class="checkedAll?'checked':'first'"></span>
          <span>全选</span>
        </div>
        <div class="shop_footer_right" v-if="result">
          <div class="shop_footer_price">
            <span>合计：</span>
            <span>¥</span>
            <span>{{sumMoney.toFixed(2)}}</span>
          </div>
          <div class="shop_footer_result" @click="goNext">
            <span>结算</span>
            <span>({{sumNum}})</span>
          </div>
        </div>
        <div class="shop_footer_right" v-else>
          <div class="remove" @click="del()">删除</div>
        </div>
      </mt-tabbar>
    </div>
    <!-- 添加数量输入器 -->
    <div class="mask" v-show="showInput">
      <div class="inputModal">
        <p class="title">修改购买数量</p>
        <div class="funArea">
          <div class="reduce" @click="popReduce">-</div>
          <input type="number" min="1" v-model="inputNum" class="num">
          <div class="add" @click="popAdd">+</div>
        </div>
        <div class="btnGroup">
          <div class="cancel btn" @click="closeInput">取消</div>
          <div class="confirm btn" @click="confirmInput">确定</div>
        </div>
      </div>
    </div>
    <div class="mask" v-if="showErr">
      <div class="tipModal">
        <p class="text">{{errText}}</p>
        <p class="confirm" @click="closeTip">确定</p>
      </div>
    </div>
    <mt-popup
      class="gitPop"
      @touchmove.stop="" 
      v-model="popupVisible"
      position="bottom">
      <div class="gift_wrap">
        <div class="nav">
          <img @click="closePop" src="../images/leftArrow.png" class="leftIcon" alt="">
          <span class="title">选择赠品</span>
        </div>
        <div class="shopgift_list" v-for="(item,index) in giftList" :key="index">
          <div class="gift_des">{{item[0].hdms}}</div>
          <div class="shopgift_list_content" v-for="(gTerm,gIndex) in item" :key="gIndex">
            <div
              class="list_shopcar_circle"
              :class="gTerm.checked?'checked':''"
              @click="checkgift(index,gIndex)"
            ></div>
            <div class="shopgift_list_pic">
              <img alt="" :src="gTerm.url?gTerm.url:require('../images/default_logo.jpg')"/>
            </div>
            <div class="shopgift_list_text">
              <div class="shopgift_text_top">
                <h3>{{gTerm.zpmc}}</h3>
                <p>{{gTerm.cj}}</p>
                <p>规格：{{gTerm.guige}}</p>
              </div>
              <div class="shopgift_text_bottom">
                <ul>
                  <li>￥{{gTerm.zpjj}}</li>
                  <li>{{gTerm.zssl>0?gTerm.zssl+'件':'无库存'}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div class="footer_guide fix">
          <div class="footer_guide_left fix">
            <p class="badge">
              已选择
              <span>{{giftNum}} </span>件
            </p>
          </div>
          <div class="footer_guide_right fix">
            <ul>
              <li @click="clear">
                <span>清空</span>
              </li>
              <li @click="confirmGift">
                <span>确定</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { getCarList,delFromCar ,getGiftList,getCarTip,settleAcount,recordCartNum} from "@/api/index";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      popupVisible:false,//赠品弹出
      showInput:false,
      timer:null,
      H:'00',
      M:'00',
      S:'00',
      result:true,//购物车编辑态控制
      head:{},//头部数据
      list:[],//普通list
      mzList:[],//买赠list
      checkedAll:false,//是否全选
      sumMoney:0,//总金额
      sumNum:0,//总选择数
      total:0,//购物车总商品数量
      inputNum:0,//弹出输入框内数字
      curNum:1,//确定后购物商品数量
      curType:'',//当前选择的是普通  还是 满赠
      curIndex:'',//当前选择商品index
      curLimit:0,//当前商品最少购买量
      curMax:0,//当前商品最大购买量
      curJindex:0,//当前满赠活动中商品index
      showErr:false,//错误提示弹窗显示
      errText:'',//错误提示文案
      giftTipShow:false,//是否显示可选择赠品文案
      gitTipText:'',
      giftList:[],//可选择赠品列表
      giftNum:0,//选择赠品的数量
      curGiftIndex:0,//当前选择赠品活动index
      canClick:true,
      canSelMz:0,
      scrollTop:0,//页面滚动的距离
    };
  },
  computed: {
    ...mapState('login',['orderInfo','user']),
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole']),
  },
  methods: {
    ...mapMutations('login',['saveOrderInfo']),
    async del(){
      this.remberShopCar();//删除前缓存购物车数据
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole
      };
      let jsonStr = '';
      if(!this.checkedAll){
        let selPro = [];
        this.list.forEach((item,index)=>{
          if(item.checked){
            if(item.promotionflag=='套餐'){
              selPro.push({data:item.promotioncode,type:2});
            }else{
              selPro.push({data:item.productcode,type:1});
            }
          }
        })
        this.mzList.forEach((item,index)=>{
          item.forEach((pterm,jIndex)=>{
            if(pterm.checked){
              selPro.push({data:pterm.productcode,type:1})
            }
          })
        })
        jsonStr = JSON.stringify(selPro);
      }else{
        jsonStr = JSON.stringify([{"data":"","type":"3"}]);
      }
      
      let res = await delFromCar({...defaulParams,jsonStr:jsonStr});
      if(res.code==0){
        this.sumMoney = 0;//总金额
        this.sumNum = 0;//总选择数
        this.total = 0;//购物车总商品数量
        this.getData();
        Toast({
            message: "删除成功", //弹窗内容
            position: "middle", //弹窗位置
            duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
        });
      }
    },
    closeTip(){
      this.showErr = false;
    },
    async goNext(){//订单结算
      if(!this.canClick){
        return;
      }
      this.canClick = false;
      if(this.sumMoney<this.head.cje||parseFloat(this.sumMoney)==0){
        this.showErr = true;
        this.errText = '无效的采集额';
        this.canClick = true;
        return 
      }else{
        this.showErr = false;
      }
      this.isShowTip();
      if(document.getElementsByClassName('errTip').length>0){
        let top = document.getElementsByClassName('errTip')[0].offsetTop-document.body.scrollTop;
        window.scrollTo(0,top-200);
        this.canClick = true;
        return;
      }
      this.saveOrderInfo({list:this.list,mzList:this.mzList});
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole
      };
      let res = await getCarTip({...defaulParams,money:this.sumMoney});
      if(res.code == 0&&res.data.hdms){
        this.giftTipShow = true;
        this.gitTipText = res.data.hdms;
        this.canSelMz =1;
      }
      setTimeout(()=>{
        this.giftTipShow = false;
        this.submitCar(defaulParams);
      },2000)
    },
    async submitCar(defaulParams){
      let suits=[];
      let items = [];
      this.list.forEach((item,index)=>{
        if(item.checked){
          if(item.promotionflag=='套餐'){
            suits.push({billSub:item.subcode,suiteCode:item.promotioncode,buyNumber:item.quantity})
          }else{
            items.push({billSub:item.subcode,itemCode:item.productcode,quantity:item.quantity,price:item.price,buyNumber:0})
          }
        }
      })
      this.mzList.forEach((item)=>{
        item.forEach(pterm=>{
          if(pterm.checked){
            items.push({billSub:pterm.subcode,itemCode:pterm.productcode,quantity:pterm.quantity,price:pterm.price,buyNumber:0})
          }
        })
      })
      let jsonStr = JSON.stringify({suites:suits,items:items});
      let result =  await settleAcount({...defaulParams,jsonStr:jsonStr});
      this.$router.push({name:'confirmOrders',query:{money:this.sumMoney.toFixed(3),canSelMz:this.canSelMz,type:1}});
    },
    isShowTip(){
      let result = 0;
      this.list.forEach((item,index)=>{
        if(item.checked){
          if(item.quantity<item.packnumber){
            // this.showErr = true;
            // this.errText="无效的采集量";
            this.$set(this.list[index],'errTip','无效的采购量 采购量'+item.packnumber);
            this.$set(this.list[index],'showTip',true)
            result++; 
          }else if(item.minpack!=0&&(item.quantity%item.minpack!=0)){
            // this.showErr = true;
            // this.errText="无效的采集量";
            this.$set(this.list[index],'errTip','无效的采购量 采购量应为'+item.minpack+'的整数倍');
            this.$set(this.list[index],'showTip',true)
            result++; 
          }else if(item.quantity>item.stock&&item.promotionflag=='无'){
            // this.showErr = true;
            // this.errText="库存不足";
            this.$set(this.list[index],'errTip','库存不足 库存'+item.stock);
            this.$set(this.list[index],'showTip',true)
            result++; 
          }else if((parseInt(item.quantity)>item.promotionremainquantity)&&item.promotionflag=='套餐'){
            // this.showErr = true;
            // this.errText="库存不足";
            this.$set(this.list[index],'errTip','库存不足 库存'+item.promotionremainquantity);
            this.$set(this.list[index],'showTip',true)
            result++; 
          }else if(item.maxpackquantity!='NA'&&item.quantity>item.maxpackquantity){
            // this.showErr = true;
            // this.errText = '超过今日限购量';
            this.$set(this.list[index],'errTip','超过今日限购量 今日限购量'+item.maxpackquantity);
            this.$set(this.list[index],'showTip',true)
            result++; 
          }
          // else if(item.quantity>item.promotionnum&&item.schemetype=='秒杀'){
          //   // this.showErr = true;
          //   // this.errText = '超过秒杀单店限购量';
          //   this.$set(this.list[index],'errTip','超过秒杀单店限购量');
          //   this.$set(this.list[index],'showTip',true)
          //   result++; 
          // }
          else{
            this.showErr = false;
            this.$set(this.list[index],'showTip',false);
            result = 0;
          }
        }else{
          result--;
          this.showErr = false;
          this.$set(this.list[index],'showTip',false);
        }
      })

      this.mzList.forEach((pterm,jIndex)=>{
        pterm.forEach((item,index)=>{
          if(item.checked){
            if(item.quantity<item.packnumber){
              // this.showErr = true;
              // this.errText = '无效的采集量';
              this.$set(this.mzList[jIndex][index],'errTip','无效的采购量 采购量'+item.packnumber);
              this.$set(this.mzList[jIndex][index],'showTip',true)
              result++; 
            }else if(item.minpack!=0&&(item.quantity%item.minpack!=0)){
              // this.showErr = true;
              // this.errText = '无效的采集量';
              this.$set(this.mzList[jIndex][index],'errTip','无效的采购量 采购量应为'+item.minpack+'的整数倍');
              this.$set(this.mzList[jIndex][index],'showTip',true)
              result++; 
            }else if(item.quantity>item.stock){
              // this.showErr = true;
              // this.errText = '库存不足';
              this.$set(this.mzList[jIndex][index],'errTip','库存不足 库存'+item.stock);
              this.$set(this.mzList[jIndex][index],'showTip',true)
              result++; 
            }else if(item.maxpackquantity!='NA'&&item.quantity>item.maxpackquantity){
              // this.showErr = true;
              // this.errText = '超过今日限购量';
              this.$set(this.mzList[jIndex][index],'errTip','超过今日限购量 今日限购量'+item.maxpackquantity);
              this.$set(this.mzList[jIndex][index],'showTip',true)
              result++; 
            }else{
              this.showErr = false;
              this.$set(this.mzList[jIndex][index],'showTip',false);
              result = 0;
            }
          }else{
            result--;
            this.showErr = false;
            this.$set(this.mzList[jIndex][index],'showTip',false);
          }
        })
      })
      // setTimeout(()=>{
      //   let top = document.getElementsByClassName('errTip')[0].offsetTop;
      //   this.top = top;
      // },1000)
      return result;
    },
    showAct(type,index,jIndex){
      if(type == 'common'){
        this.$set(this.list[index],'showAct',!this.list[index].showAct);
      }else{
        this.$set(this.mzList[index][jIndex],'showAct',!this.mzList[index][jIndex].showAct);
      }
    },
    popInput(type,index,limit,max,jIndex){
      this.curType = type;
      this.curIndex = index;
      this.curLimit = limit;
      this.curMax = max;
      this.curJindex = jIndex;
      this.showInput = true;
      if(type=='common'){
        this.inputNum = this.list[index].quantity;
      }else{
        this.inputNum = this.mzList[index][jIndex].quantity;
      }
    },
    popReduce(){
      if(this.inputNum>this.curLimit){
        this.inputNum = parseInt(this.inputNum)-parseInt(this.curLimit);
      }
    },
    popAdd(){
      if(this.inputNum<=this.curMax){
        this.inputNum = parseInt(this.inputNum)+parseInt(this.curLimit);
      }
    },
    closeInput(){
      this.showInput = false;
    },
    confirmInput(){
      this.showInput = false;
      if(this.curType == 'common'){
        this.$set(this.list[this.curIndex],'quantity',this.inputNum>0?this.inputNum:this.curLimit);
        if(this.list[this.curIndex].checked){
          this.sumMoney = 0;
          this.sumNum = 0;
          this.countMoney();
        }
      }else{
        this.$set(this.mzList[this.curIndex][this.curJindex],'quantity',this.inputNum>0?this.inputNum:this.curLimit);
        if(this.mzList[this.curIndex][this.curJindex].checked){
          this.sumMoney = 0;
          this.sumNum = 0;
          this.countMoney();
        }
      }

    },
    reduce(type,index,limit,jIndex){
      if(type=='common'){
        // parseInt(this.list[index].quantity)>1?parseInt(this.list[index].quantity)--:1;
        if(parseInt(this.list[index].quantity)>parseInt(limit)){
          this.$set(this.list[index],'quantity',parseInt(this.list[index].quantity)-parseInt(limit));
        }
        if(this.list[index].checked){
          this.sumMoney = 0;
          this.sumNum = 0;
          this.countMoney();
        }
      }else{
        if(parseInt(this.mzList[index][jIndex].quantity)>parseInt(limit)){
          this.$set(this.mzList[index][jIndex],'quantity',parseInt(this.mzList[index][jIndex].quantity)-parseInt(limit));
        }
        if(this.mzList[index][jIndex].checked){
          this.sumMoney = 0;
          this.sumNum = 0;
          this.countMoney();
        }
      }
    },
    add(type,index,limit,max,jIndex){
      if(type=='common'){
        if(parseInt(this.list[index].quantity)<parseInt(max)){
          this.$set(this.list[index],'quantity',parseInt(this.list[index].quantity)+parseInt(limit));
        }
        if(this.list[index].checked){
          this.sumMoney = 0;
          this.sumNum = 0;
          this.countMoney();
        }
      }else{
        if(parseInt(this.mzList[index][jIndex].quantity)<parseInt(max)){
          this.$set(this.mzList[index][jIndex],'quantity',parseInt(this.mzList[index][jIndex].quantity)+parseInt(limit));
        }
        if(this.mzList[index][jIndex].checked){
          this.sumMoney = 0;
          this.sumNum = 0;
          this.countMoney();
        }
      }
    },
    chooseSingle(index,type,jIndex){//勾选单个商品
      this.sumMoney = 0;
      this.sumNum =0;
      if(type=='common'){
        this.$set(this.list[index],'checked',!this.list[index].checked);
      }else{
        this.$set(this.mzList[index][jIndex],'checked',!this.mzList[index][jIndex].checked);
        let checkMzNum = 0;//买赠活动单品选择数
        this.mzList[index].forEach((pterm,pIndex)=>{
          if(pterm.checked){
            checkMzNum ++;
          }
        })
        if(checkMzNum == this.mzList[index].length){
          this.$set(this.mzList[index][0],'allChecked',true);
        }else{
          this.$set(this.mzList[index][0],'allChecked',false);
        }
      }
      this.countMoney();
    },
    blockChoose(curIndex){//买赠块级选择  可全选该块商品
      this.sumMoney = 0;
      this.sumNum =0;
      if(this.mzList[curIndex][0].allChecked){
        this.mzList[curIndex].forEach((pterm,jIndex)=>{
          this.$set(this.mzList[curIndex][jIndex],'allChecked',false);
          this.$set(this.mzList[curIndex][jIndex],'checked',false);
        })
      }else{
        this.mzList[curIndex].forEach((pterm,jIndex)=>{
          this.$set(this.mzList[curIndex][jIndex],'allChecked',true);
          this.$set(this.mzList[curIndex][jIndex],'checked',true);
        })
      }
      
      this.countMoney();
    },
    chooseAll(){//全选
      this.sumMoney = 0;
      this.sumNum =0;
      this.checkedAll = !this.checkedAll;
      this.list.forEach((item,index)=>{
        if(this.checkedAll){
          item.checked = true;
        }else{
          item.checked = false;
        }
      })
      this.mzList.forEach((item,index)=>{
        item.forEach((pterm,jIndex)=>{
          if(this.checkedAll){
            pterm.checked = true;
            pterm.allChecked = true;
          }else{
            pterm.checked = false;
            pterm.allChecked = false;
          }
        })
      })
      setTimeout(()=>{
        this.countMoney();
      },100)
    },
    countMoney(){//计算金额   以及   是否勾选全选
      this.list.forEach((item,index)=>{
        if(item.checked){
          this.sumNum ++;
          this.sumMoney += parseInt(item.quantity)*(parseInt(item.price*1000))/1000;
        }
      })
      this.mzList.forEach((item,index)=>{
        item.forEach((pterm,jIndex)=>{
          if(pterm.checked){
            this.sumNum++;
            this.sumMoney += parseInt(pterm.quantity)*(parseInt(pterm.price*1000))/1000;
          }
        })
      })
      this.countTotal();
      this.isShowGift();
      this.isShowTip();
      if(this.sumNum==this.total){
        this.checkedAll = true;
      }else{
        this.checkedAll = false;
      }
    },
    countTotal(){//计算购买商品总数
      this.total = 0;
      this.list.forEach((item,index)=>{
        this.total++;
      })
      this.mzList.forEach((item,index)=>{
        item.forEach((pterm,jIndex)=>{
          this.total++;
        })
      })
    },
    isShowGift(){
      this.mzList.forEach((item,index)=>{
        let totalNum = 0;
        let totalMoney = 0;
        item.forEach((pterm,jIndex)=>{
          if(pterm.checked){
            totalNum+=parseInt(pterm.quantity);
            totalMoney+=parseInt(pterm.quantity)*(parseInt(pterm.price*1000))/1000;
          }
          if(pterm.numberormny == '数量满足'&&pterm.satisfyNumber<=totalNum){
            this.$set(this.mzList[index][0],'canSelGift',true);
          }else if(pterm.numberormny == '金额满足'&&pterm.satisfyNumber<=totalMoney){
            this.$set(this.mzList[index][0],'canSelGift',true);
          }else{
            this.$set(this.mzList[index][0],'canSelGift',false);
            this.$set(this.mzList[index][0],'selGifts',this.mzList[index][0].selGifts);
          }
          this.$set(this.mzList[index][0],'userBuyNum',totalNum);
          this.$set(this.mzList[index][0],'userBuyMoney',totalMoney);
          // else{
          //   this.$set(this.mzList[index][0],'canSelGift',false);
          //   this.$set(this.mzList[index][0],'selGifts',[]);
          // }
        })
      })
    },
    complete(){//点击编辑  缓存购物车数据
      this.result = !this.result;
    },
    count() {
      let msIndex = this.list.findIndex((item,index,arr)=>(item.schemetype=='秒杀'));
      if(msIndex==-1){
        return;
      }
      let endTime = this.list[msIndex]['promotionendtime'].split(':');
      this.timer = setInterval(() => {
        let nowH = new Date().getHours();
        let nowM = new Date().getMinutes();
        let nowS = new Date().getSeconds();  
        
        let leftsecond =  (parseInt(endTime[0]) * 60 * 60 + parseInt(endTime[1])*60 + parseInt(endTime[2])) - (nowH * 60 * 60 + nowM * 60 + nowS);
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
    async getData(){
      console.log(this.orderInfo)
      let defaulParams = {
        token: this.token,
        userId: this.userId,
        corpCode: this.corpCode,
        companyId: this.companyId,
        userRole: this.userRole
      };
      let res = await getCarList(defaulParams);
      if(res.code==0){
        res.data.list.forEach((item,index)=>{
          item.checked = false;
          item.showAct = true;
          item.showTip = false;
          item.errTip = '';
          this.orderInfo.list.forEach((pterm,pIndex)=>{
            if(pterm.productcode==item.productcode){
              item.checked = pterm.checked;
            }
          })
        })
        
        res.data.mzList.forEach((item,index)=>{
          item.forEach((pterm,pIndex)=>{
            pterm.checked = false;
            pterm.allChecked = false;
            pterm.showAct = true;
            pterm.canSelGift = false;
            pterm.showTip = false;
            pterm.errTip = '';
            pterm.selGifts=[];
            pterm.userBuyNum = 0;
            pterm.userBuyMoney = 0; 
            this.orderInfo.mzList.forEach((jTtem,jIndex)=>{
              jTtem.forEach((hterm,hIndex)=>{
                if(hterm.productcode == pterm.productcode&&hterm.buyCode==pterm.buyCode){
                  pterm.checked = hterm.checked;
                  pterm.allChecked = hterm.allChecked;
                  pterm.showAct = hterm.showAct;
                  pterm.canSelGift = hterm.canSelGift;
                  pterm.showTip = hterm.showTip;
                  pterm.errTip = hterm.errTip;
                  console.log(hterm.selGifts)
                  pterm.selGifts = hterm.selGifts;
                  pterm.userBuyNum = hterm.userBuyNum;
                  pterm.userBuyMoney = hterm.userBuyMoney; 
                }
              })
            })
          })
        })
        


        this.head = res.data.head;
        this.list = res.data.list;
        this.mzList = res.data.mzList;

        console.log('2222.....');
        console.log(this.mzList)
        if(this.list.length){
          this.count();
        }
        this.countMoney();
      }
    },
    chooseGift(index,id,type,userBuyNum,userBuyMoney){
      if(document.documentElement&&document.documentElement.scrollTop){
        this.scrollTop=document.documentElement.scrollTop;
      }else if(document.body){
        this.scrollTop=document.body.scrollTop;
      }
      this.popupVisible = true;
      this.curGiftIndex = index;
      let selGifts = this.mzList[index][0].selGifts;
      this.getGiftData(index,id,selGifts,type,userBuyNum,userBuyMoney);
    },
    confirmGift(){
      this.popupVisible = false;
      let selGift = [];
      this.giftList.forEach((item)=>{
        item.forEach(pterm=>{
          if(pterm.checked){
            selGift.push(pterm);
          }
        })
      })
      this.mzList[this.curGiftIndex].forEach((item,index)=>{
        this.$set(this.mzList[this.curGiftIndex][index],'selGifts',selGift);
      })
      setTimeout(()=>{
        window.scrollTo(0,this.scrollTop);
      },100)
    },
    async getGiftData(index,id,selGifts,type,userBuyNum,userBuyMoney){
      let defaulParams = {
        token:this.token,
        userId:this.userId,
        corpCode:this.corpCode,
        companyId:this.companyId,
        userRole:this.userRole,
      }; 
      let res = await getGiftList({...defaulParams,productId:id,count:userBuyNum,money:userBuyMoney});
      if(res.code ==0){
        res.data.list.forEach(item => {
          item.forEach((pterm)=>{
            pterm.checked = false;
          })
        });
        this.giftList = res.data.list;
        if(selGifts&&selGifts.length){
          this.giftList.forEach((item,index)=>{
            item.forEach((pterm,pIndex)=>{
              selGifts.forEach((sterm,sIndex)=>{
                if(sterm.zpbm==pterm.zpbm){
                  this.$set(this.giftList[index][pIndex],'checked',true);
                }
              })
            })
          })
          // selGifts.forEach((item,index)=>{
          //   let gIndex = this.giftList.findIndex((pterm)=>pterm.zpbm==item.zpbm);
          //   this.$set(this.giftList[gIndex],'checked',true)
          // })
        }
        this.countGiftNum();
        // if(type=='数量满足'){
        //   this.$set(this.giftList[0],'userGiftNum',parseInt(parseInt(userBuyNum)/parseInt(this.giftList[0].mzsl)));
        // }else if(type=='金额满足'){
        //   this.$set(this.giftList[0],'userGiftNum',parseInt(parseFloat(userBuyMoney)/parseFloat(this.giftList[0].mzsl)));
        // }
        // if(selGifts&&selGifts.length){
        //   selGifts.forEach((item,index)=>{
        //     let gIndex = this.giftList.findIndex((pterm)=>pterm.zpbm==item.zpbm);
        //     this.$set(this.giftList[gIndex],'checked',true)
        //   })
        // }
      }
    },
    clear(){
      this.giftList.forEach((item)=>{
        item.forEach(pterm=>{
          pterm.checked = false;
        })
      })
      this.countGiftNum();
    },
    countGiftNum(){
      let num = 0;
      this.giftList.forEach((item,index)=>{
        item.forEach((pterm)=>{
          if(pterm.checked){
            num ++;
          }
        })
      })
      this.giftNum = num;
    },
    checkgift(index,gIndex) {
      if(this.giftList[index][gIndex].zssl>0){
        let hdbm = this.giftList[index][gIndex].hdbm;
        let selNum = 0;
        this.giftList.forEach((item,index)=>{
          item.forEach((gterm,gIndex)=>{
            if(gterm.hdbm!=hdbm){
              this.$set(this.giftList[index][gIndex],'checked',false)
            }else{
              if(gterm.checked){
                selNum++;
              }
            }
          })
        })
        if(selNum<this.giftList[index][gIndex].zpkxpgs){
          this.$set(this.giftList[index][gIndex],'checked',!this.giftList[index][gIndex].checked);
        }else{
          if(this.giftList[index][gIndex].checked){
            this.$set(this.giftList[index][gIndex],'checked',false);
          }else{
            Toast({
              message: "该活动只能选择"+this.giftList[index][gIndex].zpkxpgs+'种赠品', //弹窗内容
              position: "middle", //弹窗位置
              duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
            });
          }
        }
        this.countGiftNum();
      }else{
        Toast({
            message: "该品暂无库存", //弹窗内容
            position: "middle", //弹窗位置
            duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
        });
      }
    },
    async saveCartNum(id,type,num){
      let defaulParams = {
        token:this.token,
        userId:this.userId,
        corpCode:this.corpCode,
        companyId:this.companyId,
        userRole:this.userRole,
      }; 
      let res = await recordCartNum({...defaulParams,productId:id,type:type,num:num})
    },
    closePop(){
      this.popupVisible = false;
      setTimeout(()=>{
        window.scrollTo(0,this.scrollTop);
      },100)
    },
    remberShopCar(){//缓存购物车数据
      let defaulParams = {
        token:this.token,
        userId:this.userId,
        corpCode:this.corpCode,
        companyId:this.companyId,
        userRole:this.userRole,
      };
      let jsonStr = {ptData:[],hdData:[]};
      this.list.forEach((item)=>{
        if(item.promotionflag=='套餐'){
          jsonStr.hdData.push({id:'',code:item.promotioncode,num:item.quantity});
        }else{
          jsonStr.ptData.push({id:item.productcode,num:item.quantity,code:''})
        }
      })
      this.mzList.forEach((item)=>{
        item.forEach((pterm)=>{
          jsonStr.hdData.push({id:pterm.productcode,num:pterm.quantity,code:pterm.buyCode});
        })
      })
      recordCartNum({...defaulParams,jsonStr:JSON.stringify(jsonStr)});
    },
    goDetail(id){
      // this.$router.push({name:'detail',query:{id:id}})
    }
  },
  // activated() {/**  */
  //   if (!this.$route.meta.canKeep) {
  //     this.checkedAll = false;//是否全选
  //     this.sumMoney = 0;//总金额
  //     this.sumNum = 0;//总选择数
  //     this.total = 0;//购物车总商品数量
  //     this.list = [];
  //     this.mzsl = [];
  //     this.head = {};
  //     this.getData();
  //   }
  // },
  // beforeRouteEnter (to, from, next) {/**  */
  //   if(from.name == 'detail'){
  //     to.meta.canKeep = true;
  //     // to.meta.keepAlive = true;
  //     next()   
  //   }else{
  //     to.meta.canKeep = false;
  //     // to.meta.keepAlive = false;
  //     next();
  //   }
  // },
  mounted() {
    this.getData();
  },
  destroyed(){
    clearInterval(this.timer);
    this.remberShopCar();
    this.saveOrderInfo({list:this.list,mzList:this.mzList});
  },  
};
</script>

<style lang="scss" scoped>
.popContainer{
  overflow: hidden;
  height: 100vh;
}
.mint-popup-bottom{
  width: 100%;
  height: 100%;
  background-color: #ebebeb;
}
.act .errTip{
  margin-left: 47px;
}
.giftTip{
  width:100%;
  height:60px;
  line-height: 60px;
  background:rgba(251,161,161,1);
  font-size:20px;
  font-family:MicrosoftYaHei;
  color:rgba(255,255,255,1);
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 98px;
  z-index: 100;
}
.tipModal{
  width:552px;
  height:334px;
  background:rgba(28,28,28,1);
  border-radius:8px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -276px;
  margin-top: -167px;
  .text{
    text-align: center;
    color: #fff;
    font-size: 30px;
    margin-top: 100px;
  }
  .confirm{
    text-align: right;
    padding-right: 80px;
    font-size: 30px;
    color: rgba(74,144,226,1);
    margin-top: 100px;
  }
}
.errTip{
  font-size:20px;
  color:#E32323;
  line-height:26px;
  padding-bottom: 31px;
  font-weight: 500;
}
.area{
  margin-bottom: 10px;
  padding-left: 38px;
  background-color: #fff;
}
.contentTop{
  display: flex;
  align-items: center;
}
.com_add_bottom{
  overflow: hidden;
  padding-bottom: 20px;
}
.com_add_top{
    display: flex;
    align-items: center;
    padding-left: 10px;
    margin-bottom: 20px;
    .ms{
        font-size:20px;
        color:#E32323;
        line-height:26px;
        margin-right: 27px;
    }
    .ms_time{
        width:34px;
        height:34px;
        line-height: 34px;
        text-align: center;
        border-radius:6px;
        border:2px solid rgba(153,153,153,1);
        margin-left: 10px;
    }
}
.shopCar_header {
  background: #ffffff;
  min-height: 89px;
  color: #333333;
  border-bottom: 1px solid #dcdcdc;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 100;
}
.text {
  font-size: 24px;
  color: #999;
}
.list_shopcar {
  // padding-left: 38px;
  background: #ebebeb;
  min-height: 547px;
  margin-bottom: 120px;
  margin-top: 88px;
}
.list_shopcar_title {
  min-height: 54px;
  padding-top: 20px;
  font-size: 26px;
  color: #666;
  line-height: 40px;
  font-weight: 900;
  border-bottom: 1px solid #d8d8d8;
}
.list_shopcar_name {
  float: left;
  .actName{
    display: inline-block;
    width: 6rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.list_shopcar_name span:nth-of-type(2) {
  display: inline-block;
  width: 26px;
  height: 23px;
  background: url("../images/car_dianpu.png") no-repeat center;
  background-size: 100%;
  margin-right: 8px;
}
.list_shopcar_desc {
  float: right;
  font-size: 18px;
  color: #666666;
  margin-right: 23px;
  font-weight: 400;
}
.list_shopcar_content {
  padding-top: 21px;
  font-size: 24px;
  color: #666;
  min-height: 200px;
  border-bottom: 1px solid #d8d8d8;
  background: #fff;
}
.list_shopcar_content:last-child {
  border-bottom: none;
}
.list_shopcar_circle {
  width: 40px;
  height: 40px;
  background: url("../images/car_circle.png") no-repeat center;
  background-size: 100%;
  margin-right: 8px;
  float: left;
  margin-right: 11px;
}
.list_shopcar_com_bottom {
  width: 380px;
}
.checked {
  background: url("../images/car_checkcircle.png") no-repeat center;
  background-size: 100% 100%;
  margin-right: 11px;
}
.com_add {
  min-height: 219px;
  // border-bottom: 1px solid #d8d8d8;
}
.list_shopcar_pic {
  width: 220px;
  height: 176px;
  // background: #ccc;
  float: left;
  margin-right: 28px;
}
.list_shopcar_pic img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}
.list_shopcar_com {
  float: left;
  line-height: 35px;
  /* min-height: 70px; */
}
.list_shopcar_com_top {
  /* margin-bottom: 25px; */
}
.list_shopcar_com_top_title {
  // float: left;
  display: flex;
  flex-direction: column;
}
.list_shopcar_com_top_title p {
  width: 380px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  font-size: 18px;
  &.oPrice{
    text-decoration: line-through;
    font-size: 18px;
    color: #999;
  }
}
.list_shopcar_com_top_title p:first-child {
  font-size: 26px;
}
.list_shopcar_com_top_gift {
  float: right;
  color: #E32323;
  font-size: 18px;
}
.gift_tips {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
.gift_tips_gift {
  height: 40px;
  overflow: hidden;
}
.gift_tips_menu {
  position: relative;
}
.gift_tips_menu_up {
  display: block;
  position: absolute;
  top: 17px;
  height: 10px;
  width: 10px;
  transform: rotate(316deg);
  -webkit-transform: rotate(316deg);
  border-left: 2px solid transparent;
  border-bottom: 2px solid transparent;
  border-right: 2px solid #999999;
  border-top: 2px solid #999999;
}
.gift_tips_menu_down {
  display: block;
  position: absolute;
  top: 10px;
  height: 10px;
  width: 10px;
  transform: rotate(316deg);
  -webkit-transform: rotate(316deg);
  border-left: 2px solid #999;
  border-bottom: 2px solid #999;
  border-right: 2px solid transparent;
  border-top: 2px solid transparent;
}
.shop_gift {
  margin-left: 47px;
  // width: 618px;
  min-height: 40px;
  margin-top: 12px;
  margin-bottom: 15px;
  line-height: 40px;
  font-size: 20px;
  padding-right: 37px;
}
.shop_gift_top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #999;
  margin-bottom: 18px;
  .shop_gift_right {
    width: 460px;
  }
  .arrIcon {
    width: 24px;
    height: 15px;
    &.act{
      transform: rotate(180deg)
    }
  }
}
.shop_gift_left h3 {
  color: #E32323;
  font-weight: 400;
  width: 120px;
  margin-right: 26px;
}
.shop_gift_bottom {
  width: 104px;
  height: 43px;
  border: 1px solid #4a90e2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 2px solid #4a90e2;
  border-radius: 5px;
}
.shop_gift_bottom span {
  color: #4a90e2;
}
.list_shopcar_com_price {
  float: left;
  margin-top: 10px;
  font-size: 28px;
  color: #E32323;
}
.list_shopcar_com_num {
  float: right;
}
.list_shopcar_com_num ul li {
  width: 48px;
  height: 48px;
  float: left;
  border: 1px solid #ccc;
  line-height: 47px;
  text-align: center;
}
.list_shopcar_com_num ul li:nth-of-type(2) {
  width: 80px;
}
.list_shopcar_com_num ul li input {
  width: 70px;
  height: 43px;
  /* border: 1px solid #ccc; */
  /* border-left:none;
  border-top:none; */
  text-align: center;
}
.list_shopcar_com_num ul li:nth-of-type(2),
.list_shopcar_com_num ul li:nth-of-type(3) {
  border-left: none;
}
.shop_footer {
  background: #fff !important;
  min-height: 98px;
  font-size: 26px;
  line-height: 98px;
  color: #666;
}
.shop_footer_left {
  width: 244px;
  height: 98px;
  float: left;
}
.shop_footer_left span {
  display: inline-block;
}
.shop_footer_left span.first {
  width: 40px;
  height: 40px;
  margin-right: 11px;
  position: relative;
  top: 10px;
  background: url("../images/car_circle.png") no-repeat left 50%;
  background-size: 100% 100%;
}
.shop_footer_left span.checked{
  top: 10px;
}
.checked {
  width: 40px;
  height: 40px;
  margin-right: 11px;
  position: relative;
  /* top: 10px; */
  background: url("../images/car_checkcircle.png") no-repeat left 50%;
  background-size: 100% 100%;
}
/*  */
.shop_footer_right {
  width: 650px;
  float: left;
}
.remove {
  width: 134px;
  height: 68px;
  line-height: 70px;
  text-align: center;
  color: #E32323;
  font-size: 28px;
  border: 2px solid #E32323;
  border-radius: 50px;
  float: right;
  margin-top: 15px;
  margin-right: 39px;
}
.shop_footer_price {
  float: left;
  // margin-left: 90px;
}
.shop_footer_price span {
  color: #E32323;
}
.shop_footer_price span:first-child {
  color: #333;
}
.shop_footer_result {
  width: 244px;
  height: 98px;
  background: url("../images/result.png") no-repeat top;
  background-size: 100%;
  color: #fff;
  float: right;
}
.shop_footer_result img {
  width: 100%;
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
.gitPop{
  min-height: 100vh;
  // padding-bottom: 100px;
}
.gift_wrap {
  background: #fff;
  height: 85vh;
  overflow-y: scroll;
  margin-top: 93px;
  .nav{
        width: 100%;
        height: 88px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        .leftIcon{
            width: 17px;
            height: 30px;
            position: absolute;
            top: 29px;
            left: 30px;
        }
        .title{
            font-size: 30px;
        }
    }
  .shopgift_list .shopgift_list_content:last-child{
    border: none;
  }
  .shopgift_header {
    background: #fff;
    color: #333333;
    font-size: 30px;
    .text {
      font-size: 30px;
    }
  }
  .list_shopcar_circle {
    width: 40px;
    height: 40px;
    background: url("../images/car_circle.png") no-repeat center;
    background-size: 100%;
    margin-right: 8px;
    float: left;
  }
  .checked {
    background: url("../images/car_checkcircle.png") no-repeat center;
    background-size: 100%;
  }
  .shopgift_subheader {
    min-height: 42px;
    line-height: 42px;
    color: #8b572a;
    background: #ffe6bc;
    margin-bottom: 19px;
    h3 {
      font-size:26px;
      color:rgba(51,51,51,1);
      line-height:35px;
      letter-spacing:2px;
    }
  }
  .shopgift_list {
    min-height: 221px;
    font-size: 18px;
    background: #fff;
    margin-bottom: 10px;
    border-bottom: 2px solid #ebebeb;
    &:last-child{
      border: none;
    }
    .gift_des{
      // width: 100%;
      min-height: 60px;
      line-height: 60px;
      background:rgba(255,230,188,1);
      padding-left: 38px;
      font-size:20px;
      color:rgba(139,87,42,1);
    }
    .shopgift_list_content {
      display: flex;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 26px;
      padding-top: 40px;
      padding-right: 40px;
      padding-left: 45px;
    }
    .shopgift_list_pic {
      width: 220px;
      height: 176px;
      // background: #ccc;
      margin-right: 26px;
      img{
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
    }
    .shopgift_text_top h3 {
      font-size: 24px;
      color: #666;
      line-height: 40px;
    }
    .shopgift_text_top p {
      color: #999;
      line-height: 35px;
    }
  }
  .shopgift_text_bottom {
    color: #999;
    margin-top: 46px;
    ul{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .shopgift_text_bottom ul li {
    float: left;
    height: 40px;
    width: 180px;
  }
  .shopgift_text_bottom ul li:nth-of-type(2) {
    float: right;
    text-align: center;
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
    font-size: 32px;
  }
  .badge {
    font-size: 26px;
    text-align: center;
    color: #666;
    line-height: 95px;
    span {
      color: #E32323;
      font-size: 26px;
    }
  }
  .iconfont {
    font-size: 22px;
  }
}
</style>

