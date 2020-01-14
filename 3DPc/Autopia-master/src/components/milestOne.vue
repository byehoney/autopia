<template>
  <div id="milestOne">
    <div class="milestSec">
      <div class="metalLeft">
        <img src="../assets/img/metalLeft.png" alt="">
      </div>
      <div class="metalRight">
        <img src="../assets/img/metalRight.png" alt="">
      </div>
      <div class="big_Num">
        <p class="numP" :key="1">{{year}}</p>
      </div>
      <div class="searchlight">
        <div class="searchlight_item1 inlineBlock"></div>
        <div class="searchlight_item2 inlineBlock"></div>
        <div class="searchlight_item3 inlineBlock"></div>
        <div class="searchlight_item4 inlineBlock"></div>
        <div class="searchlight_item5 inlineBlock"></div>
        <div class="searchlight_item6 inlineBlock"></div>
      </div>
      <div class="trophyBox">
        <p class="title">{{$t(title)}}</p>
        <p class="line"></p>
        <p class="note">{{$t(note)}}</p>
        <div class="trophy"></div>
      </div>
      <div class="car_slideShow">
        <el-carousel indicator-position="outside" @change="lunbo" arrow="never">
          <el-carousel-item v-for="(item,i) in urlList" :key="i" :name="item.year" :label="item.year">
            <img :src="item.img" alt="缺少图片资源">
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="milestSec2">
      <div class="trophyBox2">
        <p class="title">{{$t(title2)}}</p>
        <hr class="hrs" style="width: 100%;position: absolute;top: 50%;">
        <p class="note">{{$t(note2)}}</p>
      </div>
      <div class="zuoshoubi">
        <img src="../assets/m-img/zuoshoubi.png" alt="">
      </div>
      <div class="youshoubi">
        <img src="../assets/m-img/youshoubi.png" alt="">
      </div>
      <div class="big_Num">
        <p class="num2P" :key="1">{{year2}}</p>
      </div>
      <!--<mt-swipe :auto="3000" @change="lunbo2">
        <mt-swipe-item v-for="(item,i) in urlList2" :key="i" :name="item.year">
          <img :src="item.img" alt="" style="width: 100%;">
        </mt-swipe-item>
      </mt-swipe>-->
      <div class="car_slideShow">
        <el-carousel indicator-position="outside" @change="lunbo2" arrow="never" trigger="click">
          <el-carousel-item v-for="(item,i) in urlList2" :key="i" :name="item.year" :label="item.year" >
            <img :src="item.img" alt="缺少图片资源">
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "milestOne",
    data() {
      return {
        title: "messages.lichengbeibiaoti1",
        note: "messages.lichengbei2011wenzi",
        title2: "messages.lichengbeibiaoti1",
        note2: "messages.lichengbei2011wenzi",
        year: "2011",
        year2: "2011",
        key: 1,
        key2: 1,
        value2: 0,
        num: 0,
        urlList: [
          {
            id: 0,
            img: require("../assets/img/2011Car.png"),
            year: "2011",
            key: "0",
            title: "messages.lichengbeibiaoti1",
            note: "messages.lichengbei2011wenzi"
          },
          {
            id: 1,
            img: require("../assets/img/2012Car.png"),
            year: "2012",
            key: "1",
            title: "messages.lichengbeibiaoti2",
            note: "messages.lichengbei2012wenzi"
          },
          {
            id: 2,
            img: require("../assets/img/2013Car.png"),
            year: "2013",
            key: "2",
            title: "messages.lichengbeibiaoti3",
            note: "messages.lichengbei2013wenzi"
          },
          {
            id: 3,
            img: require("../assets/img/2015Car.png"),
            year: "2015",
            key: "3",
            title: "messages.lichengbeibiaoti4",
            note: "messages.lichengbei2015wenzi"
          },
          {
            id: 4,
            img: require("../assets/img/2016Car.png"),
            year: "2016",
            key: "4",
            title: "messages.lichengbeibiaoti5",
            note: "messages.lichengbei2016wenzi"
          },
          {
            id: 5,
            img: require("../assets/img/2018Car.png"),
            year: "2018",
            key: "5",
            title: "messages.lichengbeibiaoti6",
            note: "messages.lichengbei2018wenzi"
          },
        ],
        urlList2: [
          {
            id: 0,
            img: require("../assets/img/2011Car.png"),
            year: "2011",
            key: "0",
            title: "messages.lichengbeibiaoti1",
            note: "messages.lichengbei2011wenzi"
          },
          {
            id: 1,
            img: require("../assets/img/2012Car.png"),
            year: "2012",
            key: "1",
            title: "messages.lichengbeibiaoti2",
            note: "messages.lichengbei2012wenzi"
          },
          {
            id: 2,
            img: require("../assets/img/2013Car.png"),
            year: "2013",
            key: "2",
            title: "messages.lichengbeibiaoti3",
            note: "messages.lichengbei2013wenzi"
          },
          {
            id: 3,
            img: require("../assets/img/2015Car.png"),
            year: "2015",
            key: "3",
            title: "messages.lichengbeibiaoti4",
            note: "messages.lichengbei2015wenzi"
          },
          {
            id: 4,
            img: require("../assets/img/2016Car.png"),
            year: "2016",
            key: "4",
            title: "messages.lichengbeibiaoti5",
            note: "messages.lichengbei2016wenzi"
          },
          {
            id: 5,
            img: require("../assets/img/2018Car.png"),
            year: "2018",
            key: "5",
            title: "messages.lichengbeibiaoti6",
            note: "messages.lichengbei2018wenzi"
          },
        ],
        wordArray: [],
        currentWord: 0,
        currentWord2: 0,
        letters: [],
        words: "",
        words2: "",
        clockHeight5: {
          height: ""
        },
      }
    },
    watch: {
      'currentWord'(res) {
        setTimeout(this.animateActive, 100);
        setTimeout(this.animateNum, 900);
        this.words.className = "numP";
      },
      'currentWord2'(res) {
        setTimeout(this.animateActive2, 100);
        setTimeout(this.animateNum2, 900);
        this.words2.className = "num2P";
      }
    },
    methods: {
      lunbo(num1, num2) {
        this.currentWord = num1;
        this.title = this.urlList[num1].title;
        this.note = this.urlList[num1].note;
        this.key = this.urlList[num1].key;
      },
      lunbo2(num1, num2) {
        this.currentWord2 = num1;
        this.title2 = this.urlList2[num1].title;
        this.note2 = this.urlList2[num1].note;
        this.key2 = this.urlList2[num1].key;

      },
      animateActive() {
        this.words.className = "big_NumP";
      },
      animateActive2() {
        this.words2.className = "big_Num2P";
      },
      animateNum() {
        this.year = this.urlList[this.currentWord].year;
      },
      animateNum2() {
        this.year2 = this.urlList2[this.currentWord2].year;
      },

    },
    mounted() {
      this.words = document.getElementsByClassName('numP')[0];
      this.words2 = document.getElementsByClassName('num2P')[0];
    }
  }
</script>

<style scoped>
</style>
<!--element 插件样式-->
<style>

  .el-carousel__indicators--labels {
    -webkit-tap-highlight-color: transparent;
  }
</style>

