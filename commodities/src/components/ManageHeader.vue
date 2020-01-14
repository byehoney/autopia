<template>
  <div >
    <mt-header :title="title" class="manageHeader">
      <router-link to="" slot="left">
        <mt-button icon="back" @click="$router.go(-1)"></mt-button>
      </router-link>
      <!-- <mt-button icon="more" slot="right"></mt-button> -->
    </mt-header>
  </div>
</template>

<script>

export default {
    props:["title"],
    mounted(){
        console.log(this.title)
    }
};
</script>

<style scoped lang="scss">
.manageHeader{
    height: 93px;
    line-height: 93px;
    font-size: 30px;
    color:#333;
    background: #fff;
}
</style>
