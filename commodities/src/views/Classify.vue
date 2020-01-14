<template>
  <div style="opacity:1">
    <LocalHeader/>
    <div class="class">
      <div class="class_header">
        <div class="class_header_left">
          <span></span>
          <span>更多分类</span>
          <router-link to="/" class="backHome">返回</router-link>
        </div>
        <!-- <div class="class_header_right">
            <span></span>
            <span>扫码文案</span>
        </div> -->
      </div>
      <div class="class_content">
        <ul class="left" :style="styleObj">
          <li v-for="(item,index) in list" :key="index" @click="changeClass(index,item.kindCode)" :class="[isActive==index?'active':'']">
            <div class="class_content_left">
              <div class="class_content_pic">
                <img :src="item.kindImage"/>
                <span>{{item.kindName}}</span>
              </div>
            </div>
            <!-- <div class="class_content_right " :class="isActive==index?active_bg:''">
              <div :class='isActive==index?is_active:""'></div>
              <span v-for="(data,index) in item.data" :key="index">{{data.name}}</span>
            </div> -->
          </li>
        </ul>
        <div class="right" :style="styleObj">
          <!-- <div class="factoryList" v-if="isActive==0">
            <div class="listItem">
              造型烟花
            </div>
            <div class="listItem">
              造型烟花
            </div>
            <div class="listItem">
              造型烟花
            </div>
          </div> -->
          <div class="typeList">
            <div :class="['typeItem',isFact?'factItem':'',cjItem==item.kindCode||flItem==item.kindCode?'active':'']" @click="setClass(item.kindCode)" v-for="(item,index) in branchList" :key="index">
              {{item.kindName}}
            </div>
          </div>
          <div class="btnGroup">
            <img @click="resetFilter" src="../images/sel_cancel.png" alt="">
            <img @click="confirmFilter" src="../images/sel_confirm.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LocalHeader from "../components/Header";
import {getMoreKindsMain,getMoreKindsBranch} from '@/api/index'
import { mapGetters,mapMutations,mapState } from 'vuex'
export default {
  components: {
    LocalHeader
  },
  data() {
    return {
      mainCode:'',
      cjItem:'',
      flItem:'',
      isFact:false,
      styleObj:{},
      isActive:0,
      is_active:"is_active",
      active_bg:"active_bg",
      list: [],
      branchList:[],
    };
  },
  computed:{
    ...mapState('login',['cjTermS','flTermS','mainCodeC','mainCodeS','lastFilterInfo']),
    ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
  },
  created(){
    this.styleObj = {
      height:(window.screen.height-93)+'px',
    }
  },
  mounted(){
    this.cjItem = this.lastFilterInfo.cjTermS;
    this.flItem = this.lastFilterInfo.flTermS;
    this.getMainClass();
    if(this.$route.query.code){
      this.changeClass(this.$route.query.index,this.$route.query.code)
    }
    // console.log(this.$route)
  },
  methods:{
    ...mapMutations('login',['saveFlTerm','saveCjTerm','saveLastFilterInfo','resetTerm']),
    changeClass(index,code){
      if(code == 'Factory'){
        this.isFact = true;
      }else{
        this.isFact = false;
      }
      this.mainCode = code;
      this.isActive=index;
      this.getBranch(code);
    },
    async getMainClass(){
      let defaulParams = {
        token:this.token,
        userId:this.userId,
        corpCode:this.corpCode,
        companyId:this.companyId,
        userRole:this.userRole,
      }; 
      let res = await getMoreKindsMain(defaulParams);
      this.list = res.data.list;
      if(this.list[0].kindCode=='Factory'){
         this.isFact = true;
      }else{
        this.isFact = false;
      }
      if(!this.$route.query.code&&!this.cjTermS&&!this.flTermS){
        this.getBranch(this.list[0].kindCode);
      }else if(!this.$route.query.code&&this.flTermS){
        // this.getBranch(this.mainCodeS);
        let index = this.list.findIndex((item)=>item.kindCode==this.mainCodeS);
        console.log(index)
        this.changeClass(index,this.mainCodeS)
      }else if(!this.$route.query.code&&this.cjTermS){
        this.isFact = true;
        let index = this.list.findIndex((item)=>item.kindCode==this.mainCodeC);
        this.changeClass(index,this.mainCodeC)
        // this.getBranch(this.mainCodeC);
      }
    },
    async getBranch(code){
      let defaulParams = {
          token:this.token,
          userId:this.userId,
          corpCode:this.corpCode,
          companyId:this.companyId,
          userRole:this.userRole,
      }; 
      let res = await getMoreKindsBranch({...defaulParams,kindCode:code});
      this.branchList = res.data.list
    },
    setClass(code){
      if(this.isFact){
        this.cjItem = code;
        this.saveCjTerm({cjTermS:code,mainCodeC:this.mainCode});
        // this.$router.push({name:'choose',query:{cjTerm:code}})
      }else{
        this.flItem = code;
        this.saveFlTerm({flTermS:code,mainCodeS:this.mainCode});
        // this.$router.push({name:'choose',query:{flTerm:code}})
      }
    },
    confirmFilter(){
      this.saveLastFilterInfo({
        flTermS:this.flTermS,
        cjTermS:this.cjTermS,
        mainCodeC:this.mainCodeC,
        mainCodeS:this.mainCodeS,
      })
      this.$router.push({name:'choose'})
    },
    resetFilter(){
      this.cjItem = '';
      this.flItem = '';
      this.resetTerm();
    }
  }
};
</script>

<style lang="scss" scoped>
.backHome{
  float: right;
  margin-right: 38px;
  color: #E32323;
  position: relative;
}
.class {
  background: #e5e5e5;
  /* padding-top: 13px; */
}
.class_header {
  width: 100%;
  min-height: 114px;
  background: #fff;
  margin-top: 88px;
  color: #333333;
  font-size: 28px;
  line-height: 114px;
  /* padding-left: 40px; */
}
.class_header_left{
  margin-left: 40px;
  margin-bottom: 10px;
}
.class_header span:nth-of-type(1) {
  background: url("../images/home/block.png") center 5px no-repeat;
  display: inline-block;
  width: 10px;
  height: 25px;
  margin-right: 8px;
}
.left .active{
  background-color: #fff;
}
.class_content{
  display: flex;
  .left{
    overflow-y: scroll;
  }
  .right{
    flex: 1;
    background-color: #fff;
    position: relative;
    overflow-y: scroll;
    .btnGroup{
      position: fixed;
      width: 524px;
      right: 0;
      bottom: 0;
      display: flex;
      img{
        width: 50%;
        height: 98px;
      }
    }
    .factoryList{
      width: 100%;
      .listItem{
        margin-left: 20px;
        border-bottom: 2px solid #e5e5e5;
        font-size: 24px;
        color: #666;
        height: 80px;
        line-height: 80px;
        padding-left: 20px;
        text-align: center;
      }
    }
    .typeList{
      padding: 0 20px 150px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .typeItem{
        width: 200px;
        font-size: 24px;
        color: #666;
        text-align: center;
        padding-top: 60px;
        &.factItem{
          width: 100%;
          border-bottom: 2px solid #ebebeb;
          padding-top: 30px;
          padding-bottom: 30px;
        }
        &.active{
          color: #E32323;
        }
      }
    }
  }
}
.class_content ul li {
  min-height: 241px;
  border-bottom: 1px solid #d8d8d8;
}
.class_content_left {
  // background: #d8d8d8;
  float: left;
  width: 225px;
  padding-top: 30px;
  min-height: 211px;
}
.is_active {
  width: 0;
  height: 0;
  border-width: 20px 20px 20px 0;
  border-style: solid;
  border-color: transparent #eb4546 transparent transparent; /*透明 灰 透明 透明 */
  position: absolute;
  left: -22px;
  top: 93px;
}
.active_bg {
  background: #fff !important;
}
.class_content_right {
  float: left;
  width: 464px;
  min-height: 187px;
  font-size: 24px;
  color: #666;
  padding-left: 61px;
  padding-top: 54px;
  position: relative;
  background: #e5e5e5;
}
.class_content_right span {
  display: inline-block;
  min-width: 120px;
  line-height: 45px;
}
.class_content_right span:nth-of-type(1) {
  color: #b43726;
}
.class_content_pic {
  border-radius: 50%;
  font-size: 26px;
  text-align: center;
  display: flex;
  align-items:center;
  flex-direction: column;
  // margin-left: 40px;
}
.class_content_pic img {
  width: 115px;
  height: 115px;
  margin-bottom: 16px;
}
</style>
