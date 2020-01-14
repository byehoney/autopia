<template>
  <div>
    <div>
      <span>{{D}}天</span>
      <span>{{H}}:</span>
      <span>{{M}}:</span>
      <span>{{S}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      D: 0,
      H: 0,
      M: 0,
      S: 0
    };
  },
  mounted() {
    this.countTime();
  },
  methods: {
    countTime() {
      this.timer = setInterval(() => {
        let endtime = new Date("2019/05/08,14:52:12").getTime();
        let nowtime = new Date().getTime();
        let leftsecond = parseInt((endtime - nowtime) / 1000);
        if (leftsecond >= 0) {
          this.D =
            parseInt(leftsecond / 3600 / 24) < 10
              ? "0" + parseInt(leftsecond / 3600 / 24)
              : parseInt(leftsecond / 3600 / 24);
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
          this.D = 0;
          this.H = "00";
          this.M = "00";
          this.S = "00";
          // clearInterval(this.timer);
        }
      }, 1000);
    }
  }
};
</script>

<style>
</style>
