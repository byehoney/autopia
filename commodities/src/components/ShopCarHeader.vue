<!--购物车头部组件-->
<template>
  <div>
    <mt-header title="购物车" class="shopCar_header">
      <router-link to="/" slot="left">
        <mt-button icon="back" class="text"></mt-button>
      </router-link>
      <mt-button title="管理" slot="right" class="text">
        <span @click="complete">{{result?'管理':'完成'}}</span>
      </mt-button>
    </mt-header>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      result: true
    };
  },
  computed: {
    ...mapState("shopCar", ["fetchData"])
  },
  methods: {
    ...mapMutations("shopCar", ["manage"]),
    complete() {
        this.result = !this.result;
        this.manage(this.result);
    }
  },
  mounted() {
    this.result = this.fetchData.is_success;
  }
};
</script>

<style scoped>
.shopCar_header {
  background: #ffffff;
  min-height: 89px;
  color: #333333;
  border-bottom: 1px solid #dcdcdc;
}
.text {
  font-size: 24px;
  color: #999;
}
</style>
