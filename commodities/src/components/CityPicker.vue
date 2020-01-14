<template>
  <div class="index">
    <div class="page-content">
      <!-- <mt-cell class="sel_text" title="所在地区" :value="areaString" is-link @click.native="handlerArea"></mt-cell> -->
      <!-- <div class="sel_item">
        <div class="sel_shop" @click="handlerArea">
          <div class="left">所在地区</div>
          <div class="right">
            <span>{{areaString}}</span>
            <img src="../images/arrow_right.png" alt>
          </div>
        </div>
      </div> -->
      <mt-popup :closeOnClickModal="false" v-model="areaVisible" class="area-class" position="bottom">
        <mt-picker
          :slots="slots"
          :showToolbar="true"
          ref="picker"
          value-key="name"
          @change="onValuesChange"
        >
          <div class="barContent">
            <div @click="handleCancel" class="cancel">取消</div>
            <div class="tip">选择省市区</div>
            <div @click="handleConfirm" class="sure">确认</div>
          </div>
        </mt-picker>
      </mt-popup>
    </div>
  </div>
</template>

<script>
// // 导入数据
// import data from "@/utils/pca_code.json";
// let index = 0;
// let index2 = 0;
// // 初始化省
// let province = data.map(res => {
//   return res.name;
// });
// // 初始化市
// let city = data[index].children.map(res => {
//   return res.name;
// });
// // 初始化区
// let area = data[index].children[index2].children.map(res => {
//   return res.name;
// });
import {getCityList,getAllCitys} from '@/api/index';
let pCode = '';
let cCode = '';
let aCode = '';
export default {
  name: "index",
  data() {
    return {
      // areaVisible: false,
      data:[],
      index:0,
      index2:0,
      index3:0,
      province:[],
      city:[],
      area:[],
      areaString: "请选择",
      slots: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot4"
        },
        {
          flex: 1,
          values: [],
          className: "slot5",
          textAlign: "center"
        }
      ],
      Slot: "选择省市区"
    }
  },
  props:['areaVisible','setArea','cancel','global'],
  async mounted() {
    let res = '';
    if(this.global=='manage'){
      res = await getAllCitys();
    }else{
      res = await getCityList();
    }
    
    // if(this.global=='manage'){
    //   // this.data = [{regionCode:'',regionName:'全国',children:[{regionCode:'',regionName:'全国',children:[{regionCode:'',regionName:'全国'}]}]}].concat(res.data.list);
    // }else{
      this.data = res.data.list;
    // }
    this.province = this.data.map(res => {
        return res.regionName;
    });
    this.city = this.data[this.index].children.map(res => {
            return  res.regionName;
    });
    this.area = this.data[this.index].children[this.index2].children.map(res => {
        return res.regionName;
    });
    this.$set(this.slots[0],'values',this.province);
    this.$set(this.slots[2],'values',this.city);
    this.$set(this.slots[4],'values',this.area)
  },
  methods: {
    handleConfirm() {
      this.areaString =
        this.$refs.picker.getValues()[0] +
        "," +
        this.$refs.picker.getValues()[1] +
        "," +
        this.$refs.picker.getValues()[2];
      if(this.$refs.picker.getValues()[0]=='全国'){
        this.areaString = '全国'
      }
      this.setArea(this.areaString,pCode,cCode,aCode)
    },
    handleCancel() {
      this.cancel();
    },
    onValuesChange(picker, values) {
      if(values[0]==undefined||values[1]==undefined||!values[2]==undefined){
          return
      }
      this.$nextTick(()=>{
        let one = values[0];
        let two = values[1];
        let three = values[2];
        this.index = this.province.indexOf(one);
        pCode = this.data[this.index].regionCode;
        if (this.index >= 0 && this.province.length > 0) {
            this.city = this.data[this.index].children.map(res => {
                return res.regionName;
            });
            picker.setSlotValues(1, this.city);
            two = values[1];
        }
        this.index2 = this.city.indexOf(two);
        this.index3 = this.area .indexOf(three);
        if(this.data[this.index].children[this.index2]){
            cCode = this.data[this.index].children[this.index2].regionCode;
            if(this.data[this.index].children[this.index2].children[this.index3]){
                aCode = this.data[this.index].children[this.index2].children[this.index3].regionCode;
            }
        }
        if (this.index2 >= 0 && this.city.length > 0) {
            this.area = this.data[this.index].children[this.index2].children.map(res => {
            return res.regionName;
            });
            picker.setSlotValues(2, this.area);
            three = values[2];
        }
        // this.areaString = values.join(',')
        console.log(this.areaString)
        console.log(pCode,cCode,aCode)
      })
    }
  }
};
</script>
<style scoped lang="scss">
.page-content {
  .sel_item {
    padding-left: 39px;
    background-color: #fff;
  }
  .sel_shop {
    height: 122px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26px;
    color: rgba(102, 102, 102, 1);
    line-height: 35px;
    letter-spacing: 1px;
    border-bottom: 2px solid #ebebeb;
    .right {
      display: flex;
      align-items: center;
      span {
        margin-right: 30px;
      }
      img {
        width: 17px;
        height: 30px;
        position: relative;
        top: 2px;
        margin-right: 47px;
      }
    }
  }
  .sel_text {
    font-size: 26px;
    color: rgba(102, 102, 102, 1);
    letter-spacing: 1px;
  }
  .mint-cell {
    height: 122px;
    display: flex;
    align-items: center;
    padding: 0 47px 0 39px;
    .mint-cell-wrapper {
      height: 100%;
      border-bottom: 2px solid #ebebeb;
      padding: 0;
    }
  }
}
.area-class {
  width: 100%;
  height: 35%;
}
.picker .picker-toolbar {
  height: 96px !important;
  border-bottom: 2px solid #ebebeb;
}
.barContent {
  width: 100%;
  height: 96px;
  border-bottom: 2px solid #ebebeb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 38px;
  color: #666;
  background-color: #fff;
  .cancel,
  .sure {
    height: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
    font-size: 26px;
    color: rgba(102, 102, 102, 1);
    letter-spacing: 2px;
  }
  .sure {
    color: #ff0000;
  }
  .tip {
    font-size: 30px;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 3px;
  }
}
</style>
