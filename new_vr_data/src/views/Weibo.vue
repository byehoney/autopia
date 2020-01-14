<template>
    <div class="container">
        <div class="floors" v-for="(item,index) in dataList" :key="index">
            <div class="title">{{item.oName}}</div>
            <div class="floor_detail">
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/xinzengfensishu.png" alt="">
                        <span>新增粉丝</span>
                    </div>
                    <div class="item_bottom">{{item.newUserCnt}}</div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/fensi.png" alt="">
                        <span>总粉丝</span>
                    </div>
                    <div class="item_bottom">
                        {{item.totalUserCnt}}
                        <span class="light" v-if="item.totalUserCnt>=10000000">(千万级)</span>
                        <span class="light" v-if="item.totalUserCnt>=1000000&&item.totalUserCnt<10000000">(百万级)</span>
                    </div>
                </div>
                <div class="detailItem" v-if="item.pType!=3">
                    <div class="item_top">
                        <img src="../images/zan-copy.png" alt="">
                        <span>总获赞</span>
                    </div>
                    <div class="item_bottom">{{item.totalPraiseCnt}}</div>
                </div>
            </div>
        </div>
        <!-- <div class="floors">
            <div class="title">深夜v姐</div>
            <div class="floor_detail">
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/xinzengfensishu.png" alt="">
                        <span>新增粉丝</span>
                    </div>
                    <div class="item_bottom">64789</div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/fensi.png" alt="">
                        <span>总粉丝</span>
                    </div>
                    <div class="item_bottom">
                        64789
                        <span class="light">(千万级)</span>  
                    </div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/zan-copy.png" alt="">
                        <span>总获赞</span>
                    </div>
                    <div class="item_bottom">64789</div>
                </div>
            </div>
        </div>
        <div class="floors">
            <div class="title">汽车女巫</div>
            <div class="floor_detail">
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/xinzengfensishu.png" alt="">
                        <span>新增粉丝</span>
                    </div>
                    <div class="item_bottom">64789</div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/fensi.png" alt="">
                        <span>总粉丝</span>
                    </div>
                    <div class="item_bottom">
                        64789
                        <span class="light">(千万级)</span>  
                    </div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/zan-copy.png" alt="">
                        <span>总获赞</span>
                    </div>
                    <div class="item_bottom">64789</div>
                </div>
            </div>
        </div>
        <div class="floors">
            <div class="title">实验室</div>
            <div class="floor_detail">
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/xinzengfensishu.png" alt="">
                        <span>新增粉丝</span>
                    </div>
                    <div class="item_bottom">64789</div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/fensi.png" alt="">
                        <span>总粉丝</span>
                    </div>
                    <div class="item_bottom">
                        64789
                        <span class="light">(千万级)</span>  
                    </div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/zan-copy.png" alt="">
                        <span>总获赞</span>
                    </div>
                    <div class="item_bottom">64789</div>
                </div>
            </div>
        </div>
        <div class="floors">
            <div class="title">上车不许笑</div>
            <div class="floor_detail">
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/xinzengfensishu.png" alt="">
                        <span>新增粉丝</span>
                    </div>
                    <div class="item_bottom">64789</div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/fensi.png" alt="">
                        <span>总粉丝</span>
                    </div>
                    <div class="item_bottom">
                        64789
                        <span class="light">(千万级)</span>  
                    </div>
                </div>
                <div class="detailItem">
                    <div class="item_top">
                        <img src="../images/zan-copy.png" alt="">
                        <span>总获赞</span>
                    </div>
                    <div class="item_bottom">64789</div>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
import { getOtherData } from '../api/index' 
export default {
    data(){
        return{
            dataList:[]
        }
    },
    mounted() {
        document.getElementById("left").style.height = '698px';
        document.getElementById("tabs").style.height = '698px';
        this.getData();
    },
    methods: {
        async getData(){
            let res = await getOtherData();
            let list = [];
            res.otherDataList.forEach(item => {
                if(item.pType==2||item.pType==3){
                    list.push({oName:item.oName,newUserCnt:item.newUserCnt,totalPraiseCnt:item.totalPraiseCnt,totalUserCnt:item.totalUserCnt,pType:item.pType});
                }
            });
            this.dataList = list;
        }
    },
}
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
.container {
  width: 752px;
  margin: 0 auto;
  float: left;
  overflow: hidden;
  padding: 0 32px 0 36px;
  background-color: #fff;
}
.floors{
    border-bottom: 1px solid #E5E5E5;
}
.floors:last-child{
    border:none;
}
.floors .title{
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #333333;
    letter-spacing: 0.91px;
    padding-top: 30px;
    margin-bottom: 47px;
}
.floor_detail{
    display: flex;
    align-items: center;
    justify-content: space-around;
    
}
.floor_detail img{
    margin-right: 16px;
}
.detailItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
}
.detailItem .item_top{
    display: flex;
    align-items: center;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #333333;
    letter-spacing: 1.78px;
}
.detailItem .item_bottom{
    font-family: PingFangSC-Regular;
    font-size: 44px;
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 40px;
}
.light{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #1BC787;
    letter-spacing: 0.64px;
}
</style>