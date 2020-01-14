<template>
  <div style="opacity:1">
    <ManageHeader :title="title" class="fixed"></ManageHeader>
    <div class="userInfo">
        <img src="../images/manage_local_icon.png" alt="">
        <div class="info">
            <p class="detail">{{companyName}}</p>
            <p class="detail">{{userNmae}} {{mobile}}</p>
            <p class="detail">{{address}}</p>
        </div>
    </div>
    <div class="goodsInfo">
        <div class="goodsItem" v-for="(item,index) in list" :key="index">
            <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
            <div class="infos">
                <p class="name">{{item.name}}</p>
                <p class="fName">{{item.cj}}</p>
                <p class="scale">规格：{{item.hlgg}} 数量：{{item.cgl}}</p>
                <p class="tags">
                    <span class="tag" v-if="item.cgjg<item.yj&&item.cgjg!=0&&item.yj!=0">{{item.cgjg|formatDis(item.yj)}}折</span>
                    <span  v-else>&nbsp;</span>
                </p>
                <p class="price">
                    <span class="nPrice">￥{{item.cgjg}}</span>
                    <span class="oPrice">{{item.yj}}</span>
                </p>
            </div>
        </div>
    </div>
    <div class="orderInfo" v-if="list.length">
        <div class="orderTop">
            <p class="info">订单编号：{{orderId}}</p>
            <p class="info">下单时间：{{time}}</p>
            <p class="info">订单备注：{{note}}</p>
            <p class="info price">￥{{list[0].sfk}}</p>
        </div>
        <div class="orderBot">
            <p class="info">
                <span>总件数：</span>
                <span>{{list[0].count}}</span>
            </p>
            <p class="info">
                <span>商品总额：</span>
                <span>￥{{list[0].money}}</span>
            </p>
            <p class="info">
                <span>立减：</span>
                <span class="red">￥{{list[0].ljmoney}}</span>
            </p>
            <p class="info">
                <span>实付款：</span>
                <span class="red">￥{{list[0].sfk}}</span>
            </p>
            <!-- <div class="btn">待出库</div> -->
        </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { mapGetters } from 'vuex'
import ManageHeader from "../components/ManageHeader";
import { reqManageOrderDetail } from '@/api/index';
export default {
  data() {
    return {
      title: "订单详情",
      companyName:'',
      userNmae:'',
      mobile:'',
      address:'',
      list:[],
      orderId:'',
      time:'',
      note:'',
      money:0,
      sfk:0,
      ljmoney:0,
      count:0
    };
  },
  filters:{
    formatDis(nPrice,oPrice){
        return Math.floor((parseFloat(nPrice)/parseFloat(oPrice))*100)/10
    },
    formatPro(data){
        return data.split('%')[0]*200/100
    }
  },
  components: { ManageHeader },
  computed: {
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
  },
  async mounted() {
    let defaulParams = {
        token:this.token,
        userId:this.userId,
        corpCode:this.corpCode,
        companyId:this.companyId,
        userRole:this.userRole,
    };
    let res = await reqManageOrderDetail({
        ...defaulParams,
        startTime:this.$route.query.startTime,
        endTime:this.$route.query.endTime,
        orderData:this.$route.query.orderData,
        orderId:this.$route.query.id,
        pageNum:1,
        pageSize:100
    })
    this.list = res.data.list;
    this.companyName = res.data.list[0].companyname;
    this.userNmae = res.data.list[0].userid;
    this.mobile = res.data.list[0].mobile;
    this.address = res.data.list[0].address;
    this.orderId = res.data.list[0].orderid;
    this.time = res.data.list[0].time;
    this.note = res.data.list[0].ddbz;
    this.money = res.data.money;
    this.sfk = res.data.sfk;
    this.ljmoney = res.data.ljmoney;
    this.count = res.data.count;
  },
  methods:{
  
  }
};
</script>

<style scoped lang="scss">
.orderInfo{
    background-color: #fff;
    .orderTop{
        border-bottom: 2px solid #ebebeb;
        padding: 23px 51px 31px 0;
        margin-left: 39px;
        .info{
            font-size:24px;
            color:rgba(102,102,102,1);
            line-height:31px;
            letter-spacing:1px;
            margin-bottom: 16px;
            &.price{
                text-align: right;
            }
        }
    }
    .orderBot{
        padding: 34px 51px 33px 0;
        margin-left: 39px;
        display: flex;
        flex-direction: column;
        .info{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size:24px;
            color:rgba(102,102,102,1);
            line-height:31px;
            letter-spacing:1px;
            margin-bottom: 16px;
            .red{
                color: #FF0000;
            }
        }
        .btn{
            width:145px;
            height:50px;
            background:rgba(255,255,255,1);
            border-radius:35px;
            border:2px solid rgba(74,144,226,1);
            text-align: center;
            line-height:50px;
            font-size:22px;
            color:rgba(74,144,226,1);
            letter-spacing:2px;
            align-self: flex-end;
            margin-top: 80px;
        }
    }
}
.goodsInfo{
    background: #fff;
    .goodsItem{
        margin-left: 40px;
        border-bottom: 2px solid #ebebeb;
        display: flex;
        align-items: center;
        padding: 34px 51px 31px 0;
        img{
            width:200px;
            height:224px;
            object-fit: scale-down;
            margin-right: 37px;
        }
        .infos{
            .name{
                font-size:26px;
                color:rgba(51,51,51,1);
                line-height:35px;
                letter-spacing:2px;
                margin-bottom: 20px;
            }
            .fName,.scale{
                font-size:18px;
                color:rgba(102,102,102,1);
                line-height:24px;
                letter-spacing:1px;
                margin-bottom: 5px;
            }
            .tags{
                display:flex;
                .tag{
                    display: inline-block;
                    padding:0 5px;
                    border:2px solid #FF220A;
                    border-radius:4px;
                    font-size:18px;
                    color:rgba(255,34,10,1);
                    height: 30px;
                    line-height:30px;
                    letter-spacing:1px;
                    margin-bottom: 39px;
                }
            }
            .price{
                display: flex;
                align-items: center;
                .nPrice{
                    font-size:28px;
                    color:rgba(102,102,102,1);
                    line-height:37px;
                    margin-right: 22px;
                }
                .oPrice{
                    font-size:18px;
                    color:rgba(153,153,153,1);
                    line-height:24px;
                    letter-spacing:1px;
                }
            }
        }
    }
}
.userInfo{
    display: flex;
    width: 100%;
    height: 178px;
    align-items: center;
    background-color: #fff;
    margin-top: 100px;
    border-bottom: 2px solid #ebebeb;
    img{
        width: 48px;
        height: 59px;
        margin: 0 26px 0 40px;
    }
    p.detail{
        font-size:24px;
        color:rgba(51,51,51,1);
        line-height:31px;
        letter-spacing:1px;
        margin-bottom: 13px;
    }
}
.fixed{
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
}
</style>
