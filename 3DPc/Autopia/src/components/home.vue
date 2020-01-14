<template>
  <div id="home">
    <div id="info"></div>
  </div>
</template>

<script>
  import {init,animate} from "../../static/VR"
  export default {
    name: "home",
    data() {
      return {

      }
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
