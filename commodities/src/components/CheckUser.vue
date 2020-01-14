<template>
  <div>
    <p @click="show">单列</p>
    <awesome-picker
      ref="picker"
      :data="picker.data"
      :anchor="picker.anchor"
      :textTitle="picker.textTitle"
      :textConfirm="picker.textConfirm"
      :textCancel="picker.textCancel"
      :colorTitle="picker.colorTitle"
      :colorConfirm="picker.colorConfirm"
      :colorCancel="picker.colorCancel"
      :swipeTime="picker.swipeTime"
      @cancel="handlePickerCancel"
      @confirm="handlePickerConfirm"
    ></awesome-picker>
  </div>
</template>

<script>
const data1 = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];
export default {
  data() {
    return {
      picker: {
        anchor: [],
        textTitle: "单列选择器",
        data: [data1]
      }
    };
  },
  methods: {
    show() {
      this.$refs.picker.show();
    }
  }
};
</script>

<style>
</style>
