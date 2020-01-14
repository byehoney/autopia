<template>
    <div class="container">
        <div class="topFix">
            <!-- <div class="header">
                <div class="header_logo"></div>
                <input class="header_input" type="text" placeholder="请输入烟花名称" value="" disabled>
                <img class="selIcon" src="../images/sel_ld_icon.png" alt="">
                <div class="header_search"></div>
            </div> -->
            <LocalHeader pScan="scan"/>
            <div class="selBar">
                <div :class="['selBar_item',{'active':curType==index}]" 
                     @click="changeType(index)"
                     v-for="(item,index) in typeList"
                     :key="index"
                     >
                    {{item}}
                </div>
            </div>
        </div>
        <div
        class="scrollBox"
        
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
            <div class="ms_area" v-if="curType==3">
                <div class="ms_content">
                    <div :class="['ms_item',(now>=8&&now<12)?'active':'']">
                        <div class="time">8:00</div>
                        <div class="state" v-if="now>=8&&now<12">抢购中</div>
                        <div class="state" v-else-if="now<8">即将开始</div>
                        <div class="state" v-else>已结束</div>
                    </div>
                    <div :class="['ms_item',(now>=12&&now<16)?'active':'']">
                        <div class="time">12:00</div>
                        <div class="state" v-if="now>=12&&now<16">抢购中</div>
                        <div class="state" v-else-if="now<12">即将开始</div>
                        <div class="state" v-else>已结束</div>
                    </div>
                    <div :class="['ms_item',(now>=16&&now<20)?'active':'']">
                        <div class="time">16:00</div>
                        <div class="state" v-if="now>=16&&now<20">抢购中</div>
                        <div class="state" v-else-if="now<16">即将开始</div>
                        <div class="state" v-else>已结束</div>
                    </div>
                </div>
                <p class="tip">抢购中 数量有限哦</p>
            </div>
            <div v-for="(item,index) in list" :key="index" @click="goDetail(item.spbm)">
                <div class="scrollItem" v-if="curType==0||curType==1||curType==2">
                    <div class="left">
                        <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
                        <img v-if="item.hdlx=='秒杀'" class="ms_icon" src="../images/ms_icon.png" alt="">
                        <img v-if="item.tgsl>0" class="ms_icon" src="../images/group_icon.png" alt="">
                    </div>
                    <div class="right">
                        <div class="name">{{item.spmc}}</div>
                        <div class="factory">{{item.cj}}</div>
                        <div class="size">规格：{{item.hlgg}}</div>
                         <div class="factory">团购数量：{{item.tgsl}}</div>
                        <div class="item_bot">
                            <div class="bot_left">
                                <!-- <div class="discount" v-if="curType==0||curType==1">{{item.cxj|formatDis(item.ptsj)}}折</div> -->
                                <div class="star_dis">
                                    <div class="giftIcon" v-if="item.mzbj">买赠</div>
                                    <div class="discount" v-if="item.hdlx=='打折'&&item.cxj!=0&&item.ptxj!=0">{{item.cxj|formatDis(item.ptsj)}}折</div>
                                    <div class="starIcon" v-if="item.hdlx=='星选'">星选</div>
                                    <div class="limitIcon" v-if="item.hdlx=='秒杀'">{{item.xlg?'限购'+item.xlg+'件':'不限购'}}</div>
                                    <div class="stock" v-if="item.hdlx=='秒杀'&&item.stovk>0">仅剩{{item.stock}}件</div>
                                    <img src="../images/noStock.png" v-if="item.stock<=0" class="noStockIcon" alt="">
                                </div>
                                <div class="price">
                                    <span class="nPrice" v-if="item.hdlx&&item.hdlx!='无'">￥{{item.cxj}}</span>
                                    <span class="oPrice" v-if="item.hdlx&&item.hdlx!='无'">{{item.ptsj}}</span>
                                    <span class="sPrice" v-if="!item.hdlx||item.hdlx=='无'">￥{{item.ptsj}}</span>
                                </div>
                            </div>
                            <div class="bot_right" @click="buyPro($event,item)">
                                <img class="car" src="../images/choose_car.png" alt="">
                                <div class="saled">已销：{{item.ys?item.ys:0}}件</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="curType==3">
                    <div class="scrollItem ms_item">
                        <div class="left">
                            <div class="limt">限{{item.ddxgl}}件</div>
                            <img :src="item.url?item.url:require('../images/default_logo.jpg')" alt="">
                            <img v-if="item.hdlx=='秒杀'" class="ms_icon" src="../images/ms_icon.png" alt="">
                        </div>
                        <div class="right">
                            <div class="name">{{item.spmc}}</div>
                            <div class="factory">{{item.cj}}</div>
                            <div class="size">规格：{{item.hlgg}}</div>
                            <div class="progress">
                                <div class="pro_bar">
                                    <div class="barInner" :style="{'width':formatPro(item.yszb)+'rem'}"></div>
                                </div>
                                <div class="status">{{item.yszb}}</div>
                            </div>
                            <div class="star_dis">
                                <div class="giftIcon" v-if="item.mzbj">买赠</div>
                                <div class="discount" v-if="item.hdlx=='打折'&&item.cxj!=0&&item.ptsj!=0">{{item.cxj|formatDis(item.ptsj)}}折</div>
                                <div class="starIcon" v-if="item.hdlx=='星选'">星选</div>
                                <div class="limitIcon" v-if="item.hdlx=='秒杀'">{{item.xlg?'限购'+item.xlg+'件':'不限购'}}</div>
                                <div class="stock" v-if="item.hdlx=='秒杀'&&item.stock>0">仅剩{{item.stock}}件</div>
                                <img src="../images/noStock.png" v-if="item.stock<=0" class="noStockIcon" alt="">
                            </div>
                            <div class="Info">
                                <div class="infoLeft">
                                    <div class="price">
                                        <span class="nPrice" v-if="item.hdlx&&item.hdlx!='无'">￥{{item.cxj}}</span>
                                        <span class="oPrice" v-if="item.hdlx&&item.hdlx!='无'">{{item.ptsj}}</span>
                                        <span class="sPrice" v-if="!item.hdlx||item.hdlx=='无'">￥{{item.ptsj}}</span>
                                    </div>

                                </div>
                                <div class="infoRight">
                                    <p class="right_top">马上抢</p>
                                    <div class="saled">已销：{{item.ys?item.ys:0}}件</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <TabBarBottom curTab="choose"/>
    </div>
</template>

<script>
import { Toast } from "mint-ui";
import SimpleCropper from "../components/SimpleCropper"
import TabBarBottom from '@/components/TabBarBottom'
import LocalHeader from "@/components/Header";
import {getChooseList,addToCar} from '@/api/index'
import {mapState,mapGetters} from 'vuex'
export default {
    data(){
        return{
            flTerm:'',
            pzTerm:'',
            cjTerm:'',
            sort:0,//按价格排序是  0  正序  1  倒序
            scrollTop:0,
            now:new Date().getHours(),
            typeList:['销量','价格','团购','秒杀'],
            curType:0,
            list:[],
            loading:false,//是否开启下拉加载
            moreLoading:false,
            pageSize:10,
            pageNum:1,
            hasMore:true,
        }
    },
    computed:{
        ...mapState('login',['user','flTermS','cjTermS','pzTermS','lastFilterInfo']),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    filters:{
        formatDis(nPrice,oPrice){
            return Math.floor((parseFloat(nPrice)/parseFloat(oPrice))*100)/10
        },
        formatPro(data){
            return data.split('%')[0]*200/100
        }
    },
    components:{
        LocalHeader,
        TabBarBottom
    },
    activated(){
        console.log(this)
        this.loading = false;
        if (!this.$route.meta.canKeep) {
            let showTab = this.$route.query.showTab?this.$route.query.showTab:'';
            // let flTerm = this.$route.query.flTerm?this.$route.query.flTerm:'';
            // let cjTerm = this.$route.query.cjTerm?this.$route.query.cjTerm:'';
            // let pzTerm = this.$route.query.pzTerm?this.$route.query.pzTerm:'';
            let flTerm = this.lastFilterInfo.flTermS;
            let cjTerm = this.lastFilterInfo.cjTermS;
            let pzTerm = this.pzTermS;
            if(showTab!=''&&showTab!=undefined){
                this.curType = showTab;
            }else{
                this.curType = 0;
            }
            if(flTerm!=''&&flTerm!=undefined){
                this.flTerm = flTerm;
            }else{
                 this.flTerm = '';
            }
            if(pzTerm!=''&&pzTerm!=undefined){
                this.pzTerm = pzTerm;
            }else{
                 this.pzTerm = '';
            }
            if(cjTerm!=''&&cjTerm!=undefined){
                this.cjTerm = cjTerm;
            }else{
                 this.cjTerm = '';
            }
            window.scrollTo(0, 1);
            this.loading = false;
            this.list = [];
            this.hasMore = true;
            this.pageNum = 1;
            this.getData();
        } 
    },
    deactivated(){
        this.loading = true;
    },
    mounted(){
        // let showTab = this.$router.history.current.query.showTab;
        // let flTerm = this.$router.history.current.query.flTerm;
        // if(showTab!=''&&showTab!=undefined){
        //     this.curType = showTab;
        // }
        // if(flTerm!=''&&flTerm!=undefined){
        //     this.flTerm = flTerm;
        // }
        // this.list = [];
        // this.getData();
    },
    beforeRouteLeave(to, from, next){
        let position = window.scrollTop
        sessionStorage.setItem('top',position);
        next()
    },
    beforeRouteEnter (to, from, next) {
        if(from.name == 'detail'||from.name=='public'){
            to.meta.canKeep = true;
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.$nextTick(function(){
                    let position = sessionStorage.getItem('top') //返回页面取出来
                    // console.log("beforeRouteEnter moments update: ", position);
                    // document.getElementsByClassName('scrollBox')[0].scroll(0, position)
                    window.scrollTo({ 
                        top: position, 
                        behavior: "instant" 
                    });
                })
            })   
        }else{
            to.meta.canKeep = false;
            next();
        }
    },
    methods:{
        formatPro(data){
            return data.split('%')[0]*2/100
        },
        changeType(index){
            if(this.moreLoading){
                return;
            }
            if(index==1&&this.sort==0){
                this.sort = 1;
            }else if(index==1&&this.sort==1){
                this.sort = 0;
            }
            this.loading = false;
            this.curType = index;
            this.hasMore = true;
            this.pageNum = 1;
            this.list = [];
            this.getData();
        },
        async getData(){
            this.moreLoading = true;
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            };
            let data ={
                ...defaulParams,
                pageSize:this.pageSize,
                pageNum:this.pageNum,
                corpCode:this.user.corpCode ,
                companyId:this.user.companyId,
                type:parseInt(this.curType)+1,
                flTerm:this.flTerm,
                pzTerm:this.pzTerm,
                cjTerm:this.cjTerm,
                sort:this.sort,
            }
            let res = await getChooseList(data);
            this.moreLoading = false;
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
            }
            this.list = [...this.list,...res.data.list];
          
            // console.log(this.loading)
        },
        loadMore() {
            if(this.moreLoading||!this.hasMore){
                return;
            }
            this.pageNum = this.pageNum+1;
            this.getData();
        },
        goDetail(id){   
            this.$router.push({name:'detail',query:{id:id}});
        },
        async buyPro(e,item){
            e.stopPropagation();
            let defaulParams = {
                token: this.token,
                userId: this.userId,
                corpCode: this.corpCode,
                companyId: this.companyId,
                userRole: this.userRole,
            };
            let jsonStr = "";
            if((item.mzbj&&item.mzbj.indexOf('买赠')>-1)||(item.mzbj&&(item.mzbj.indexOf('满额赠')>-1))){//买赠 满额赠
                jsonStr = JSON.stringify(
                    [{
                        mzhdlx:'买赠',
                        pzlx:false,
                        ghsbm:'',
                        hdbm:item.mzhdbm,//活动编码
                        jghdlx:item.hdlx,
                        productId:item.spbm,
                        cartNum:item.zxxsbz,
                        pzdj:item.hdlx=='无'?item.ptsj:item.cxj,
                        pzyj:item.ptsj,
                        mobile:this.user.mobile
                    }]
                )
            }else{
                jsonStr = JSON.stringify(
                    [{
                    mzhdlx:'无',
                    pzlx:false,
                    jghdlx:item.hdlx,
                    productId:item.spbm,
                    cartNum:item.zxxsbz,
                    pzdj:item.hdlx=='无'?item.ptsj:item.cxj,
                    pzyj:item.ptsj,
                    mobile:this.user.mobile
                    }]
                )
            }
            let res = await addToCar({...defaulParams,jsonStr:jsonStr});
            if(res.code == 0){
                Toast({
                    message: "加入购物车成功", //弹窗内容
                    position: "middle", //弹窗位置
                    duration: 1000 //弹窗时间毫秒,如果值为-1，则不会消失
                });
            }
        }
    }
}
</script>

<style scoped lang="scss">
    body{
        background-color: #fcfcfc;
    }
    .container{
        display: flex;
        flex-direction: column;
        padding-bottom: 100px;
    }
    .topFix{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
    }
    // .header{
    //     width: 100vw;
    //     height: 88px;
    //     // padding: 15px 0;
    //     background:linear-gradient(182deg,rgba(245,81,81,0.89) 0%,rgba(195,41,24,1) 100%);
    //     display: flex;
    //     justify-content: space-around;
    //     align-items: center;
    //     // flex: 1;
    //     .header_logo{
    //         width: 91px;
    //         height: 58px;
    //         background: url('../images/gg_icon.png') no-repeat 0 0;
    //         background-size: 100% 100%;
    //         margin-left: 27px;
    //         margin-right: 21px;
    //     }
    //     .header_input{
    //         width: 429px;
    //         height: 58px;
    //         background-color: #fff;
    //         border-radius:29px;
    //         border:none;
    //         font-size:22px;
    //         font-family:MicrosoftYaHeiLight;
    //         color:rgba(153,153,153,1);
    //         line-height:30px;
    //         letter-spacing:2px;
    //         padding-left: 27px;
    //     }
    //     .selIcon{
    //         width: 46px;
    //         height: 40px;
    //         margin-left: 30px;
    //     }
    //     .header_search{
    //         width: 18px;
    //         height: 58px;
    //         background: url('../images/home/home_list.png') no-repeat 0 0;
    //         background-size: contain;
    //         flex: 1;
    //         margin-left: 30px;
    //     }
    // }
    .selBar{
        width:100vw;
        height:93px;
        background:rgba(255,255,255,1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        margin-top: 88px;
        // flex: 1;
        .selBar_item{
            width: 25%;
            height: 93px;
            line-height: 93px;
            font-size:28px;
            font-family:'MicrosoftYaHeiLight';
            color:rgba(51,51,51,1);
            letter-spacing:2px;
            text-align: center;
             &.active{
                color: #E32323;
            }
        }
    }
    .scrollBox{
        margin-top: 187px;
        background-color: #fff;
        .scrollItem{
            display: flex;
            // justify-content: space-between;
            align-items: center;
            padding: 27px 24px 26px 46px;
            border-bottom: 2px solid #eee;
            .noStockIcon{
                width: 97px;
                height: 30px;
            }
            &.ms_item .Info{
                margin-top: 21px;
                position: relative;
                .infoRight{
                    position: absolute;
                    right: 0;
                    top: -85px;
                }
                .oPrice{
                    line-height: 39px;
                }
            }
            .left{
                width: 200px;
                height: 210px;
                // overflow: hidden;
                margin-right: 48px;
                position: relative;
                .ms_icon{
                    position: absolute;
                    width: 45px;
                    height: 47px;
                    top: 0;
                    right: 5px;
                }
                img{
                    width: 100%;
                    height: 100%;
                    object-fit: scale-down;
                }
            }
            .right{
                display: flex;
                flex-direction: column;
                flex: 1;
                .name{
                    font-size:28px;
                    font-family:'MicrosoftYaHeiLight';
                    color:rgba(51,51,51,1);
                    line-height:37px;
                    letter-spacing:2px;
                    margin-bottom: 11px;
                    width: 453px;
                    overflow: hidden;
                    white-space: nowrap;
                    word-break: break-all;
                    text-overflow: ellipsis;
                }
                .factory{
                    font-size:22px;
                    font-family:'MicrosoftYaHeiLight';
                    color:rgba(51,51,51,1);
                    line-height:30px;
                    letter-spacing:2px;
                    margin-bottom: 11px;
                    width: 453px;
                    overflow: hidden;
                    white-space: nowrap;
                    word-break: break-all;
                    text-overflow: ellipsis;
                }
                .size{
                    font-size:18px;
                    color:rgba(102,102,102,1);
                    line-height:24px;
                    letter-spacing:1px;
                    margin-bottom: 10px;
                }
                .star_dis{
                    display: flex;
                    width: 350px;
                    flex-wrap: wrap;
                    margin-top: 7px;
                    height: 30px;
                    .giftIcon{
                        width: 60px;
                        height: 30px;
                        line-height: 26px;
                        color: #E32323;
                        font-size: 18px;
                        border: 2px solid  #E32323;
                        text-align: center;
                        border-radius: .05rem;
                        margin-right: 10px;
                        margin-bottom: 10px;
                        box-sizing: border-box
                    }
                    .limitIcon{
                        height: 30px;
                        font-size:18px;
                        color:rgba(255,255,255,1);
                        line-height:30px;
                        background:#E32323;
                        border-radius:4px;
                        text-align: center;
                        padding: 0 8px;
                        margin-right: 6px;
                        margin-bottom: 10px;
                        box-sizing: border-box
                    }
                    .stock{
                        height: 30px;
                        font-size:18px;
                        color:#E32323;
                        line-height:26px;
                        border-radius:4px;
                        border:2px solid #E32323;
                        text-align: center;
                        padding: 0 8px;
                        margin-bottom: 10px;
                        box-sizing: border-box;
                        margin-right: 6px;
                    }
                    .starIcon{
                        width: 60px;
                        height: 30px;
                        background-color: #F8E71C;
                        font-size: 18px;
                        line-height: 30px;
                        text-align: center;
                        color: #E32323;
                        border-radius: .05rem;
                        border: 2px solid #F8E71C;
                        margin-bottom: 10px;
                        box-sizing: border-box
                    }
                }
                .discount{
                    width: 68px;
                    height: 30px;
                    line-height: 30px;
                    color: #E32323;
                    font-size: 18px;
                    border: 2px solid  #E32323;
                    text-align: center;
                    border-radius: .05rem;
                    margin-right: 10px;
                    box-sizing: border-box
                }
                .item_bot{
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    // height: 100px;
                    .bot_left{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        .star_dis{
                            display: flex;
                            width: 350px;
                            flex-wrap: wrap;
                            .starIcon{
                                width: 60px;
                                height: 30px;
                                background-color: #F8E71C;
                                font-size: 18px;
                                line-height: 30px;
                                text-align: center;
                                color:  #E32323;
                                border-radius: .05rem;
                                margin-right: 10px;
                                border: 2px solid #F8E71C;
                                box-sizing: border-box
                            }
                        }
                        .discount{
                            width: 68px;
                            height: 30px;
                            line-height: 30px;
                            color:  #E32323;
                            font-size: 18px;
                            border: 2px solid  #E32323;
                            text-align: center;
                            border-radius: .05rem;
                            box-sizing: border-box
                            // padding: 5px;
                            // margin-bottom: 40px;
                        }
                        .price{
                            display: flex;
                            align-items: flex-end;
                            margin-top: 40px;
                            .nPrice{
                                font-size:32px;
                                font-family:'MicrosoftYaHei-Bold';
                                font-weight:bold;
                                color: #E32323;
                                line-height:42px;
                                margin-right: 18px;
                            }
                            .oPrice{
                                font-size:18px;
                                font-family:'MicrosoftYaHeiLight';
                                color:rgba(153,153,153,1);
                                line-height:33px;
                                letter-spacing:1px;
                                text-decoration: line-through;
                            }
                            .sPrice{
                                font-size:32px;
                                font-family:'MicrosoftYaHeiLight';
                                font-weight:bold;
                                color: #E32323;
                                line-height:42px;
                                letter-spacing:1px;
                                margin-right: 18px;
                            }
                        }
                    }
                    .bot_right{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        position: absolute;
                        top: 8px;
                        right: 0;
                        .car{
                            width: 62px;
                            height: 62px;
                            margin-bottom: 11px;
                        }
                        .saled{
                            font-size:18px;
                            font-family:'MicrosoftYaHeiLight';
                            color:rgba(51,51,51,1);
                            line-height:24px;
                            letter-spacing:1px;
                        }
                    }
                }
            }
        }
        .ms_area{
            width: 100vw;
            height: 248px;
            border-bottom: 2px solid #e5e5e5;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .tip{
                font-size:24px;
                font-family:'MicrosoftYaHei-Bold';
                font-weight:bold;
                color:rgba(51,51,51,1);
                line-height:31px;
                letter-spacing:2px;
                align-self: flex-start;
                padding-left: 43px;
                margin-top: 21px;
                margin-bottom: 22px;
            }
            .ms_content{
                width: 664px;
                height: 138px;
                // background-color: #fce9eb;
                // border: 2px dashed #ccc;
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin-top: 36px;
                .ms_item{
                    height: 100%;
                    width: 215px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background-color: #e4e4e4;
                    margin:0 7px; 
                    position: relative;
                    .time{
                        font-size:32px;
                        font-family:'MicrosoftYaHei-Bold';
                        font-weight:bold;
                        color:rgba(153,153,153,1);
                        line-height:42px;
                        letter-spacing:3px;
                        text-align: center;
                        margin-bottom: 5px;
                    }
                    .state{
                        font-size:24px;
                        font-family:'MicrosoftYaHei';
                        color:rgba(153,153,153,1);
                        line-height:31px;
                        letter-spacing:3px;
                        text-align: center;
                    }
                    &.active{
                        position: relative;
                        background: url('../images/ms_bd.png') no-repeat 0 0;
                        background-size: cover;
                        .time{
                            color: #E32323;
                            font-family:'MicrosoftYaHei-Bold';
                            font-weight: bold;
                            
                        }
                        .state{
                            color:  #E32323;
                            font-family:'MicrosoftYaHei-Bold';
                            font-weight: bold;
                        }
                        &:after{
                            content: '';
                            width:0;
                            height:0;
                            border-width:0 15px 25px;
                            border-style:solid;
                            border-color:transparent transparent #E32323;/*透明 透明  灰*/
                            margin:40px auto;
                            position:absolute;
                            bottom: -39px;
                            left: 50%;
                            margin-left: -20px;
                        }
                    }
                }
                .ms_item{
                    position: relative;
                    .limt{
                        font-size:20px;
                        font-family:'MicrosoftYaHei';
                        color: #E32323;
                        line-height:26px;
                    }
                }
            }
        }
        .ms_item{
            position: relative;
            .left{
                position: relative;
                .ms_icon{
                    position: absolute;
                    width: 45px;
                    height: 47px;
                    top: 0;
                    right: 5px;
                }
            }
            .limt{
                font-size:20px;
                font-family:'MicrosoftYaHei';
                color: #E32323;
                line-height:43px;
                position: absolute;
                bottom: 8px;
                left: -46px;
                width: 126px;
                height: 43px;
                background: url('../images/ms_limit_bg.png') no-repeat 0 0;
                background-size: contain;
                text-align: center;

            }
            .progress{
                display: flex;
                align-items: center;
                font-size:20px;
                font-family:'MicrosoftYaHeiLight';
                color:rgba(51,51,51,1);
                line-height:27px;
                letter-spacing:2px;
                .pro_bar{
                    width: 200px;
                    height: 11px;
                    background-color: #e7e7e7;
                    position: relative;
                    margin-right: 24px;
                    border-radius: 10px;
                    .barInner{
                        width: 120px;
                        height: 11px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background-color:  #FF0304;
                        border-radius: 10px;
                    }
                }
                .status{
                    margin-right: 21px;
                }
                .saled{
                     align-self: flex-end;
                }
            }
            .Info{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 49px;
                .infoLeft{
                    display: flex;
                    flex-direction: column;
                    .size{
                        font-size:20px;
                        font-family:'MicrosoftYaHeiLight';
                        color:rgba(51,51,51,1);
                        line-height:27px;
                        letter-spacing:2px;
                        margin-bottom: 10px;
                    }
                    .price{
                        display: flex;
                        align-items: flex-end;
                        margin-bottom: 20px;
                        margin-top: 40px;
                        .nPrice{
                            font-size:32px;
                            font-family:'MicrosoftYaHei-Bold';
                            font-weight:bold;
                            color: #E32323;
                            line-height:42px;
                            margin-right: 18px;
                        }
                        .oPrice{
                            font-size:18px;
                            font-family:'MicrosoftYaHeiLight';
                            color:rgba(153,153,153,1);
                            line-height:33px;
                            letter-spacing:1px;
                            text-decoration: line-through;
                        }
                        .sPrice{
                            font-size:32px;
                            font-family:'MicrosoftYaHeiLight';
                            font-weight:bold;
                            color: #E32323;
                            line-height:42px;
                            letter-spacing:1px;
                            margin-right: 18px;
                        }
                    }
                }
                .infoRight{
                    .right_top{
                        width: 125px;
                        height: 60px;
                        line-height: 60px;
                        text-align: center;
                        font-size: 30px;
                        color: #fff;
                        background:linear-gradient(85deg,rgba(255,98,56,1) 0%,rgba(255,18,64,1) 100%);
                        border-radius: 10px;
                    }
                    .saled{
                        margin-top: 32px;
                        font-size:18px;
                        color:rgba(51,51,51,1);
                        line-height:24px;
                        letter-spacing:1px;
                    }
                }
            }
        }
    }
</style>
