<template>
  <div></div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    const redirect = this.$route.query.goTo || "/";
    setTimeout(() => {
      this.$router.push({ path: redirect });
    }, 0);
    // console.log(redirect)
  }
};
</script>