<template>
  <div class="components">
    <div class="center">
      <img class="avatar" :src="src">
    </div>
    <div class="center">
      <vue-core-image-upload
        class="btn btn-primary"
        :crop="true"
        @imagechanged="imagechanged"
        @imageuploading="imageuploading"
        @imageuploaded="imageuploaded"
        :max-file-size="5242880"
        text=上传身份证
        url="http://101.198.151.190/api/upload.php"
      ></vue-core-image-upload>
    </div>
  </div>
</template>

<script>
import VueCoreImageUpload from "vue-core-image-upload";
export default {
  components: {
    VueCoreImageUpload
  },
  data() {
    return {
      src:
        "http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png",
      step: 0
    };
  },
  methods: {
    imagechanged() {
      this.step += 1;
    },
    imageuploading() {
      this.step += 1;
    },
    imageuploaded(res) {
      this.step += 1;
      this.src = res.data.src;
    }
  }
};
</script>
 <style>
.circle-bar {
  display: inline-block;
  width: 100px;
  height: 20px;
  border-radius: 10px;
  background-color: #999;
}
.circle-bar.active {
  background-color: #2ecc71;
}
</style>