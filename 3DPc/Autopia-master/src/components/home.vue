<template>
  <div id="home">
    <div id="info"></div>
    <!--<div class="killBox">
      <div class="huxideng_1"></div>
      <div class="huxideng_2"></div>
      <div class="huxideng_3"></div>
      <div class="huxideng_4"></div>
      <div class="huxideng_5"></div>
      <div class="huxideng_6"></div>
      <div class="huxideng_7"></div>
      <div class="huxideng_8"></div>
      <div class="huxideng_9"></div>
      <div class="huxideng_10"></div>
      <div class="clock_img1">
        <img src="../assets/img/greenCar.png" alt="" :style="clockHeight">
      </div>
      <div class="clock_img2">
        <img src="../assets/img/better.png" alt="" :style="clockHeight2">
      </div>
      <div class="clock_img3">
        <img src="../assets/img/yingmu.png" alt="" :style="clockHeight3">
      </div>
    </div>-->
  </div>
</template>

<script>
  import {init,animate} from "../../static/VR"
  export default {
    name: "home",
    data() {
      return {}
    },
    methods:{
    },
    mounted(){
      init();
      animate()
    },
    created(){
    }
  }
</script>

<style scoped>
</style>
