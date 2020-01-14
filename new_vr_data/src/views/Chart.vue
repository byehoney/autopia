<template>
  <div class="container">
    <div class="levalOne">
      <div class="leval_header">全国覆盖数据预览</div>
    </div>
    <div class="levalOne_box">
      <div class="levelOne_data">
        <div class="levelOne_num">
          <template v-for="(item,index) in totalUser.split('')">
            <span :key="index" v-if="item!=','" :class="[index==0?'first':'']">{{item}}</span>
            <span :key="index" v-else class="dots">,</span>
          </template>
          <img src="../images/unit.png" class="unit" alt>
          <span class="per">人</span>
        </div>
        <div class="levelOne_tip">全国总人数</div>
      </div>
      <div class="map" id="map"></div>
      <div class="map_tips">
        <img src="../images/t5.png" alt="">
        <img src="../images/b5.png" alt="">
      </div>
    </div>
    <div class="levelTwo_box">
      <div class="levelTwo_left">
        <div class="two_left_title">使用人数比例</div>
        <div id="chartOne" class="chartOne"></div>
      </div>
      <div class="levelTwo_right">
        <div class="two_right_title">用户年龄段TOP 7</div>
        <div id="chartTwo" class="chartTwo"></div>
      </div>
    </div>
    <div class="levelThreeBox">
      <div class="levelThree_title">用户手机型号TOP 5</div>
      <div id="chartThree" class="chartThree"></div>
    </div>
    <div class="levelFourBox">
      <div class="levelFour_title">每周日均净增人数</div>
      <div id="chartFour" class="chartFour"></div>
    </div>
    <div class="levelFive_box">
      <div class="levelFive_left">
        <div class="five_left_title">月度日均公众号阅读人数同比</div>
        <div id="chartFive" class="chartFive"></div>
      </div>
      <div class="levelFive_right">
        <div class="five_right_title">公众号阅读人数比例</div>
        <div id="chartSix" class="chartSix"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMapData, getMapDetailData, getHomeData } from "@/api/index";
var echarts = require("echarts");
import china from "echarts/map/json/china.json";
echarts.registerMap("china", china);
import { setTimeout } from "timers";
export default {
  data() {
    return { 
      totalUser: "0",
      mapData: [
        { name: "北京", value: 0 },
        { name: "天津", value: 0 },
        { name: "河北", value: 0 },
        { name: "山西", value: 0 },
        { name: "内蒙古", value: 0 },
        { name: "辽宁", value: 0 },
        { name: "吉林", value: 0 },
        { name: "黑龙江", value: 0 },
        { name: "上海", value: 0 },
        { name: "江苏", value: 0 },
        { name: "浙江", value: 0 },
        { name: "安徽", value: 0 },
        { name: "福建", value: 0 },
        { name: "江西", value: 0 },
        { name: "山东", value: 0 },
        { name: "河南", value: 0 },
        { name: "湖北", value: 0 },
        { name: "湖南", value: 0 },
        { name: "广东", value: 0 },
        { name: "广西", value: 0 },
        { name: "海南", value: 0 },
        { name: "重庆", value: 0 },
        { name: "四川", value: 0 },
        { name: "贵州", value: 0 },
        { name: "云南", value: 0 },
        { name: "西藏", value: 0 },
        { name: "陕西", value: 0 },
        { name: "甘肃", value: 0 },
        { name: "青海", value: 0 },
        { name: "宁夏", value: 0 },
        { name: "新疆", value: 0 },
        { name: "台湾", value: 0 },
        { name: "香港", value: 0 },
        { name: "澳门", value: 0 }
      ],
      rankData: [
        { name: "北京", value: 0 },
        { name: "天津", value: 0 },
        { name: "河北", value: 0 },
        { name: "山西", value: 0 },
        { name: "内蒙古", value: 0 },
        { name: "辽宁", value: 0 },
        { name: "吉林", value: 0 },
        { name: "黑龙江", value: 0 },
        { name: "上海", value: 0 },
        { name: "江苏", value: 0 },
        { name: "浙江", value: 0 },
        { name: "安徽", value: 0 },
        { name: "福建", value: 0 },
        { name: "江西", value: 0 },
        { name: "山东", value: 0 },
        { name: "河南", value: 0 },
        { name: "湖北", value: 0 },
        { name: "湖南", value: 0 },
        { name: "广东", value: 0 },
        { name: "广西", value: 0 },
        { name: "海南", value: 0 },
        { name: "重庆", value: 0 },
        { name: "四川", value: 0 },
        { name: "贵州", value: 0 },
        { name: "云南", value: 0 },
        { name: "西藏", value: 0 },
        { name: "陕西", value: 0 },
        { name: "甘肃", value: 0 },
        { name: "青海", value: 0 },
        { name: "宁夏", value: 0 },
        { name: "新疆", value: 0 },
        { name: "台湾", value: 0 },
        { name: "香港", value: 0 },
        { name: "澳门", value: 0 }
      ],
      myMap: "",
      myChartOne: "",
      totalSexUser: 0,
      ageRangeData: [],
      phoneData: [], //手机型号对应数据
      phoneType: [], //手机型号
      Max: 0, //最大值
      Min: 0 //最小值
    };
  },
  mounted() {
    document.getElementById("left").style.height = '1696px';
    document.getElementById("tabs").style.height = '1696px';
    this.getData();
    this.getDetailData();
    this.reqHomeData();
  },
  methods: {
    async reqHomeData(){
      let res = await getHomeData({});
      this.userDatas = res.userDatas;
      this.dateDatas = res.dateDatas;
      this.seriesArr = res.seriesArr;
      this.datas = res.datas;
      this.newAdd = res.userDataDto.newUserVirtual;
      this.cancelNum = res.userDataDto.cancelUserVirtual;
      this.purAdd = res.userDataDto.increaseUserVirtual;
      this.dimensionArr = res.dimensionArr;
      this.myChartFour = echarts.init(document.getElementById('chartFour'));
      this.myChartFive = echarts.init(document.getElementById('chartFive'));
      this.myChartSix = echarts.init(document.getElementById('chartSix'));
      this.$nextTick(()=>{
        this.createChartFour();
        this.createChartFive();
        this.createChartSix();
      })
    },
    format(num) {
      var reg = /\d{1,3}(?=(\d{3})+$)/g;
      return (num + "").replace(reg, "$&,");
    },
    async getDetailData(province) {
      let res = await getMapDetailData({ province: province });
      this.totalSexUser =
        parseInt(res.sexDatas[0].provinceWomanUsers) +
        parseInt(res.sexDatas[0].provinceManUsers); //总用户
      this.manNum = res.sexDatas[0].provinceManUsers; //男性
      this.womenNum = res.sexDatas[0].provinceWomanUsers; //女性
      this.ageRangeData = res.ageDatas;
      let phoneData = [];
      let phoneType = [];
      res.modelDatas.forEach(item => {
        phoneData.push(parseInt(item.provinceModelsCnt));
        phoneType.push(item.provinceModelsName);
      });
      this.phoneData = phoneData;
      this.phoneType = phoneType;
      setTimeout(() => {
        this.createChartOne();
        this.createChartTwo();
        this.createChartThree();
      }, 1000);
    },
    async getData() {
      let data = await getMapData();
      this.totalUser = this.format(parseInt(data.totalUserCnt));
      let mapData = [];
      let NumData = [];
      data.datas.forEach((item, index) => {
        NumData.push(parseInt(item.provinceUsers));
        this.$set(this.mapData[index], "value", item.provinceUsers);
      });
      data.newdatas.forEach((item, index) => {
        this.$set(this.rankData[index], "value", item.provinceUsers);
      });
      this.Min = Math.min(...NumData);
      this.Max = Math.max(...NumData);
      this.myMap = echarts.init(document.getElementById("map"));
      this.myChartOne = echarts.init(document.getElementById("chartOne"));
      this.myChartTwo = echarts.init(document.getElementById("chartTwo"));
      this.myChartThree = echarts.init(document.getElementById("chartThree"));

      setTimeout(() => {
        this.createMap();
        this.createChartOne();
        this.createChartTwo();
        this.createChartThree();
      }, 1000);

      let _this = this;
      this.myMap.on("click", function(param) {
        //地图点击事件
        _this.getDetailData(param.name);
      });
    },
    createMap() {
      var _this = this;
      function randomData() {
        return Math.round(Math.random() * 1578);
      }
      var data = this.mapData;
      var rankData = this.rankData;
      var geoCoordMap = {
        北京: [116.43129, 39.910729],
        天津: [117.217569, 39.142711],
        河北: [114.471629, 38.072976],
        山西: [112.594672, 37.865931],
        内蒙古: [112.594672, 37.865931],
        辽宁: [123.442493, 41.824481],
        吉林: [125.328558, 43.917716],
        黑龙江: [126.584568, 45.7131],
        上海: [121.435697, 31.159077],
        江苏: [118.803473, 32.094434],
        浙江: [120.219903, 30.297247],
        安徽: [117.207507, 31.880361],
        福建: [119.324868, 26.121133],
        江西: [115.925769, 28.668253],
        山东: [116.899811, 36.676015],
        河南: [113.663944, 34.752497],
        湖北: [114.261631, 30.625963],
        湖南: [113.072392, 28.153181],
        广东: [113.332792, 23.157355],
        广西: [108.320724, 22.832727],
        海南: [110.169265, 20.034225],
        重庆: [106.554988, 29.556178],
        四川: [104.082087, 30.703073],
        贵州: [106.681128, 26.62651],
        云南: [102.847501, 25.026682],
        西藏: [91.077201, 29.629539],
        陕西: [108.969588, 34.283682],
        甘肃: [103.899165, 36.035819],
        青海: [101.822678, 36.626463],
        宁夏: [106.125328, 38.410183],
        新疆: [87.592656, 43.787367],
        台湾: [120.61098, 23.463369],
        香港: [114.161404, 22.364461],
        澳门: [113.553889, 22.221267]
      };

      function convertData(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      }

      let option = {
        tooltip: {
          backgroundColor: "transparent",
          formatter(params) {
            const name = params.name;
            const value =
              params.data && params.data.value ? params.data.value : 0;
            let text = "";
            text =
              '<div style="width:132px;height:87px;background: url(https://cms-img.oss-cn-hangzhou.aliyuncs.com/wechat/planet/tip_bg_new.png);background-size:100% 100%;">' +
              '<div style="padding-top:18px;margin-left:14px;"><img src="https://cms-img.oss-cn-hangzhou.aliyuncs.com/wechat/planet/data_local.png" style="width:12px;height:16px;position:relative;top:1px;">' +
              '<span style="color:#00FFA1;font-size:18px;margin-left:10px">' +
              name +
              "</span></div>" +
              '<div style="margin-left:14px;margin-top:12px;color:#fff;opacity:0.8">人数:' +
              value +
              "</div></div>";
            return text;
          }
        },
        visualMap: {
          min: this.Min,
          max: this.Max,
          itemWidth:7,
          itemHeight:110,
          left: "left",
          top: "bottom",
          text: ["高", "低"],
          seriesIndex: [1],
          show: true,
          textStyle: {
            color: "#000"
          },
          inRange: {
            color: ["#E9F8F3", "#1BC787"]
          },
          hoverLink: false,
          // formatter: function (value) {
          //     return value; // 范围标签显示内容。
          // },
          calculable: true
        },
        geo: {
          map: "china",
          roam: false,
          zoom: 1.2,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: "rgba(0,0,0,0.5)"
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)"
            },
            emphasis: {
              areaColor: "#00FFA1",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 5,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(data),
            symbolSize: 20,
            // symbol:
            //   "path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z",
            symbol: "none",
            symbolRotate: 60,
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: false
              },
              emphasis: {
                show: true
              }
            },
            tooltip: {
              formatter: function(params) {
                return params.name + ":" + params.value[2];
              }
            },
            itemStyle: {
              normal: {
                color: "#F06C00"
              }
            }
          },
          //区域颜色
          {
            type: "map",
            map: china,
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: "#031525",
                borderColor: "#3B5077"
              },
              emphasis: {
                areaColor: "#2B91B7"
              }
            },
            animation: false,
            data: data
          },
          {
            name: "Top 5",
            type: "effectScatter",
            tooltip: {
              backgroundColor: "transparent",
              formatter(params) {
                const name = params.name;
                const value = params.value[2] ? params.value[2] : 0;
                let text = "";
                text =
                  '<div style="width:152px;height:87px;background: url(https://cms-img.oss-cn-hangzhou.aliyuncs.com/wechat/planet/tip_bg_new.png);background-size:100% 100%;">' +
                  '<div style="padding-top:18px;margin-left:14px;"><img src="https://cms-img.oss-cn-hangzhou.aliyuncs.com/wechat/planet/data_local.png" style="width:12px;height:16px;position:relative;top:1px;">' +
                  '<span style="color:#00FFA1;font-size:18px;margin-left:10px">' +
                  name +
                  "</span></div>" +
                  '<div style="margin-left:14px;margin-top:12px;color:#fff;opacity:0.8">净增人数:' +
                  value +
                  "</div></div>";
                return text;
              }
            },
            coordinateSystem: "geo",
            itemStyle: {
              opacity: 0
            },
            data: convertData(
              rankData
                .sort(function(a, b) {
                  return b.value - a.value;
                })
                .slice(0, 5)
            ),
            symbolSize: function(val) {
              return 10;
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke"
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: function(params) {
                  return params.name + ":" + params.value[2];
                },
                position: "right",
                show: false //bug：设置为true造成top5的省份名称重影
              }
            },
            // tooltip:{
            //   formatter:function(params){
            //     return params.name+':'+params.value[2]
            //   }
            // },
            itemStyle: {
              normal: {
                color: "#F6B834",
                shadowBlur: 5,
                shadowColor: "#F6B834"
              }
            },
            zlevel: 2
          },
          {
            name: "Last 5",
            type: "effectScatter",
            coordinateSystem: "geo",
            itemStyle: {
              opacity: 0
            },
            data: convertData(
              rankData
                .sort(function(a, b) {
                  return a.value - b.value;
                })
                .slice(0, 5)
            ),
            symbolSize: function(val) {
              return 10;
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke"
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: function(params) {
                  return params.name + ":" + params.value[2];
                },
                position: "right",
                show: false //bug：设置为true造成top5的省份名称重影
              }
            },
            tooltip: {
              backgroundColor: "transparent",
              formatter(params) {
                const name = params.name;
                const value = params.value[2] ? params.value[2] : 0;
                let text = "";
                text =
                  '<div style="width:152px;height:87px;background: url(https://cms-img.oss-cn-hangzhou.aliyuncs.com/wechat/planet/tip_bg_new.png);background-size:100% 100%;">' +
                  '<div style="padding-top:18px;margin-left:14px;"><img src="https://cms-img.oss-cn-hangzhou.aliyuncs.com/wechat/planet/data_local.png" style="width:12px;height:16px;position:relative;top:1px;">' +
                  '<span style="color:#00FFA1;font-size:18px;margin-left:10px">' +
                  name +
                  "</span></div>" +
                  '<div style="margin-left:14px;margin-top:12px;color:#fff;opacity:0.8">净增人数:' +
                  value +
                  "</div></div>";
                return text;
              }
            },
            // tooltip:{
            //   formatter:function(params){
            //     return params.name+':'+params.value[2]
            //   }
            // },
            itemStyle: {
              normal: {
                color: "#48F4F7",
                shadowBlur: 5,
                shadowColor: "#48F4F7"
              }
            },
            zlevel: 1
          },
          {
            name: "用户数",
            type: "map",
            geoIndex: 0,
            // tooltip: {show: false},
            data: this.mapData
          }
        ]
      };
      _this.myMap.setOption(option, true);
    },
    createChartOne() {
      this.myChartOne.setOption(
        {
          tooltip: {
            // trigger: 'axis'
          },
          legend: {
            show: false,
            itemWidth: 15, //图例的宽度
            itemHeight: 15, //图例的高度
            itemGap: 25,
            orient: "vertical",
            right: "right",
            top: "center",
            icon: "rect",
            selectedMode: false, //取消图例上的点击事件
            data: ["男性", "女性"]
          },
          color: ["#47A0FF","#4ECBCB"], //扇形区域以及列表颜色
          // 设置环形中间的数据。默认center为中间，如果图表位置变化了，中间文字是不变的。
          // graphic: [
          //   {
          //     type: "text",
          //     left: "center",
          //     top: "45%",
          //     style: {
          //       fill: "#ccc",
          //       // text: "人口总数",
          //       fontSize: 12,
          //       fontWeight: "lighter"
          //     }
          //   },
          //   {
          //     type: "text",
          //     left: "center",
          //     top: "55%",
          //     z: 10,
          //     style: {
          //       text: this.totalSexUser,
          //       fill: "#fff",
          //       fontSize: 18,
          //       fontWeight: "lighter"
          //     }
          //   }
          // ],
          series: [
            {
              type: "pie",
              radius: ["30%", "45%"], //两个表示环
              center: ["50%", "55%"],
              labelLine: {
                //设置延长线的长度
                normal: {
                  length: 5 //设置延长线的长度
                  // length2: 10,//设置第二段延长线的长度
                }
              },
              label: {
                normal: {
                  // formatter: '{man|} {per|{d}%} {b}\n{hr|}\n{a|}',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
                  formatter: params => {
                    let str = "";
                    if (params.name == "男性") {
                      str =
                        "{woman|}"+ 
                        "{a|"+params.name +
                        "}"+
                        "\n{per|" +
                        params.percent +
                        "%} " ;
                    } else {
                      str =
                        "{man|}"+
                        "{a|"+params.name +
                        "}"+
                        "\n{per|" +
                        params.percent +
                        "%} " ;
                    }
                    return str;
                  },
                  padding: [0, -10], //取消hr线跟延长线之间的间隙
                  rich: {
                    man: {
                      height: 12,
                      align: "left",
                      backgroundColor: {
                        image: require("../images/woman.png")
                      }
                    },
                    woman: {
                      height: 12,
                      align: "left",
                      backgroundColor: {
                        image: require("../images/man.png")
                      }
                    },
                    cir: {
                      width: 12,
                      height: 12,
                      backgroundColor: "#3089dc",
                      borderRadius: [12, 12, 12, 12]
                    },
                    a: {
                      color: "#999",
                      lineHeight: 20, //设置最后一行空数据高度，为了能让延长线与hr线对接起来
                      align: "center"
                    },
                    hr: {
                      //设置hr是为了让中间线能够自适应长度
                      borderColor: "auto", //hr的颜色为auto时候会主动显示颜色的
                      width: "105%",
                      borderWidth: 0.5,
                      height: 0.5
                    },
                    per: {
                      //用百分比数据来调整下数字位置，显的好看些。如果不设置，formatter最后一行的空数据就不需要
                      padding: [4, 0],
                      align: "center",
                      fontWeight:'bold',
                      fontSize:14,
                      color:'#000'
                    }
                  }
                }
              },
              data: [
                {
                  value: this.manNum,
                  name: "男性"
                },
                {
                  value: this.womenNum,
                  name: "女性"
                }
              ],
              itemStyle: {
                borderWidth:3,
                borderColor:'#fff',
                emphasis: {
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        },
        true
      );
    },
    createChartTwo() {
      this.myChartTwo.setOption(
        {
          // title: {
          //   text: "用户年龄段TOP 7",
          //   textStyle: {
          //     color: "#00FFA1",
          //     fontSize: 12,
          //     fontWeight: "lighter"
          //   },
          //   left: 20,
          //   top: 20
          // },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: ["用户年龄段分布"],
            show: false
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "2%",
            top:"3%",
            containLabel: true
          },
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.01],
            // interval: 0,
            axisLabel: {
              interval: 0,
              rotate: 45,
              textStyle: {
                color: "#8B8B8B" //坐标值得具体的颜色
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(191,191,191,0.3)"
              }
            },
            splitLine: {
              lineStyle: {
                type: "dotted",
                opacity: 0.3
              },
              onZero: false
            }
          },
          yAxis: {
            type: "category",
            axisLabel: {
              textStyle: {
                color: "#8B8B8B" //坐标值得具体的颜色
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(191,191,191,0.3)"
              },
              onZero: false
            },
            data: [
              "49以上",
              "40~49",
              "35~39",
              "30~34",
              "25~29",
              "18~24",
              "18岁以下"
            ]
          },
          series: [
            {
              name: "用户年龄段分布",
              type: "bar",
              barWidth: 15,
              barGap: '80%',
              data: [
                {
                  value: this.ageRangeData[6].provinceAgeCnt,
                  itemStyle: { color: "#FFAE54" }
                },
                {
                  value: this.ageRangeData[5].provinceAgeCnt,
                  itemStyle: { color: "#BD8FFF" }
                },
                {
                  value: this.ageRangeData[4].provinceAgeCnt,
                  itemStyle: { color: "#47A0FF" }
                },
                {
                  value: this.ageRangeData[3].provinceAgeCnt,
                  itemStyle: { color: "#1BC787" }
                },
                {
                  value: this.ageRangeData[2].provinceAgeCnt,
                  itemStyle: { color: "#F8D24A" }
                },
                {
                  value: this.ageRangeData[1].provinceAgeCnt,
                  itemStyle: { color: "#F3667C" }
                },
                {
                  value: this.ageRangeData[0].provinceAgeCnt,
                  itemStyle: { color: "#4ECBCB" },
                }
              ]
            }
          ]
        },
        true
      );
    },
    createChartThree() {
      this.myChartThree.setOption(
        {
          // title: {
          //   text: "用户手机型号TOP 5",
          //   textStyle: {
          //     color: "#00FFA1",
          //     fontSize: 12,
          //     fontWeight: "lighter"
          //   },
          //   left: 20,
          //   top: 20
          // },
          color: '#1BC787',
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: "3%",
            right: "3%",
            bottom: "3%",
            top:"10%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: this.phoneType,
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                textStyle: {
                  color: "rgba(0,0,0,1)" //坐标值得具体的颜色
                },
                interval: 0,
                rotate: 45
              },
              axisLine: {
                lineStyle: {
                  color: "#fff"
                }
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              axisLabel: {
                textStyle: {
                  color: "#b4b4b4" //坐标值得具体的颜色
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#ebebeb"
                },
                onZero: false
              },
              splitLine: {
                lineStyle: {
                  type: "dotted",
                  opacity: 0.3
                },
                onZero: false
              }
            }
          ],
          series: [
            {
              name: "用户数",
              type: "bar",
              barWidth: "30",
              data: this.phoneData
            }
          ]
        },
        true
      );
    },
    createChartFour() {
      this.myChartFour.setOption({
        // title: {
        //   text: "每周日均净增人数",
        //   left: 20,
        //   top: -5,
        //   textStyle: {
        //     color: "#00FFA1",
        //     fontSize: 12,
        //     letterSpacing: 2,
        //     fontWeight: "lighter"
        //   }
        // },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "10%",
          top:"5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          position: "top",
          // offset: -20,
          splitLine: { show: false }, //去除网格线
          axisLine: {
            show: true,
            lineStyle:{
              color:'#ebebeb'
            }
          },
          axisTick:{
            show:false
          },
          axisLabel: {
            textStyle: {
              color: "rgba(0,0,0,1)", //坐标值得具体的颜色
              fontSize:8,
            },
            rotate: 45
          },
          data: this.dateDatas
        },
        yAxis: {
          type: "value",
          splitLine: { show: false }, //去除网格线
          axisLine: {
            show: true,
            lineStyle:{
              color:'#ebebeb'
            }
          },
          axisTick:{
            show:false
          },
          offset: 0,
          axisLabel: {
            textStyle: {
              color: "#4b4b4b", //坐标值得具体的颜色
              fontSize:10
            }
          }
        },
        series: [
          {
            data: this.userDatas,
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2,
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "#1BC787" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#1BC787" // 100% 处的颜色
                      }
                    ],
                    global: false // 缺省为 false
                  }
                }
              }
            }
          }
        ]
      });
    },
    createChartSix(){
        this.myChartSix.setOption({
            // title:{
            //     text:'昨日净增人数比例',
            //     left: 20,
            //     top: 20,
            //     textStyle: {
            //         color: '#00FFA1',
            //         fontSize: 12,
            //         letterSpacing: 2,
            //         fontWeight:'lighter'
            //     }
            // },
            tooltip : {
                // trigger: 'axis'
            },
            legend: {
                show:false,
                itemWidth: 15, //图例的宽度
                itemHeight: 15, //图例的高度
                itemGap: 25,
                orient: 'vertical',
                right: 'right',
                top:'center',
                icon: "rect",
                selectedMode: false, //取消图例上的点击事件
                data: ['昨日新增', '昨日取关']
            },
            color: ['#F8D24A','#F3667C'],//扇形区域以及列表颜色
            // 设置环形中间的数据。默认center为中间，如果图表位置变化了，中间文字是不变的。
            // graphic:[{
            //     type:'text',
            //     left:'center',
            //     top:'60%',
            //     style:{
            //         fill:'#000',
            //         text:'净增人数',
            //         fontSize:9,
            //         fontWeight:'lighter',
            //     }
            // },{
            //     type:'text',
            //     left:'center',
            //     top:'50%',
            //     z:10,
            //     style:{
            //         text:this.purAdd,
            //         fill:'#000',
            //         fontSize:20,
            //         fontWeight:'600'
            //     }
            // }],
            series: [{
                type: 'pie',
                radius: ['30%', '45%'],//两个表示环
                center: ['50%', '55%'],
                labelLine: {//设置延长线的长度
                    normal: {
                        length: 5,//设置延长线的长度
                        // length2: 10,//设置第二段延长线的长度
                    }
                },
                label: {
                    normal: {
                        // formatter: '{d}% \n\n {b} \n\n',
                        formatter: '{per|{d}%} \n{a|{b}}',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
                        padding: [0, -10],//取消hr线跟延长线之间的间隙
                        rich: {
                            cir:{
                                width:12,
                                height:12,
                                backgroundColor:'#3089dc',
                                borderRadius:[12,12,12,12]
                            },
                            a: {
                                color: '#c8c8c8',
                                lineHeight: 20,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
                                align: 'center'
                            },
                            hr: {//设置hr是为了让中间线能够自适应长度
                                borderColor: 'auto',//hr的颜色为auto时候会主动显示颜色的
                                width: '105%',
                                borderWidth: 0.5,
                                height: 0.5,
                            },
                            per: {//用百分比数据来调整下数字位置，显的好看些。如果不设置，formatter最后一行的空数据就不需要
                                padding: [4, 0],
                                fontWeight:'bold',
                                color:'#333',
                                fontSize:14
                            }
                        }
                    }
                },
                data: [{
                        value: this.newAdd,
                        name: '昨日新增'
                    },
                    {
                        value: this.cancelNum,
                        name: '昨日取关'
                    }
                ],
                itemStyle: {
                    borderWidth:3,
                    borderColor:'#fff',
                    emphasis: {
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        })
    },
    createChartFive(){
        this.myChartFive.setOption({
            // title:{
            //     text:'月度日均公众号阅读人数同比',
            //     left: 20,
            //     top: 16,
            //     textStyle: {
            //         color: '#00FFA1',
            //         opacity:0.5,
            //         fontSize:12,
            //         fontWeight:'lighter'
            //     }
            // },
            tooltip : {
                // trigger: 'axis'
            },
            grid: {
              left: "5%",
              right: "3%",
              bottom: "10%",
              top:"20%",
              containLabel: true
            },
            legend: {
                top:14,
                itemGap: 50,
                itemWidth: 12,
                itemHeight: 12,
                data: [
                    {
                        name:'2018',
                        textStyle:{
                            color: '#000',
                            fontSize:12,
                            padding:[0,5]
                        }
                    },
                    {
                        name:'2019',
                        textStyle:{
                            color: '#000',
                            fontSize:12,
                            padding:[0,5]
                        }
                    }
                ]
            },
            xAxis: [
                {
                    type: 'category',
                    splitLine:{show: false},//去除网格线
                    axisLine: {
                        show:true,
                        lineStyle:{
                          color:'#ebebeb'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: 'rgba(0,0,0,1)',//坐标值得具体的颜色
                            fontSize:10
                        }
                    },
                    axisTick: {show: false},
                    // data: ['一月', '二月','三月', '四月','五月', '六月','七月', '八月','九月', '十月','十一月', '十二月']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitLine:{show: false},//去除网格线
                    axisLine: {
                        show:true,
                        lineStyle:{
                          color:'#ebebeb'
                        }
                    },
                    axisTick:{
                      show:false
                    },
                    offset:10,
                    axisLabel: {
                        textStyle: {
                            color: '#b4b4b4',//坐标值得具体的颜色
                            fontSize:10
                        }
                    },
                }
            ],
            dataset: {
                dimensions: this.dimensionArr,
                source: this.datas
            },
            series: this.seriesArr
            // series: [
            //     {   
            //         name:'2018',
            //         type: 'bar',
            //         barWidth:'8px',
            //         barGap:'100%',
            //         itemStyle:{
            //             barBorderRadius:[5,5,3,3],
            //             color:'#C3E8DB' 
            //         },
            //         // data: [320, 332,320, 332,320, 332,320, 332,320, 332,320, 332]
            //     },
            //     {
            //         name:'2019',
            //         type: 'bar',
            //         barWidth:'8px',
            //         barGap:'100%',
            //         itemStyle:{
            //             barBorderRadius:[5,5,3,3],
            //             color:'#1BC787' 
            //         },
            //         // data: [220, 182,220, 182,220, 182,220, 182,220, 182,220, 182]
            //     }
            // ]
        })
    }
  }
};
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
.map_tips{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 50px;
}
.map_tips img{
  margin-left: 20px;
}
.levalOne {
  width: 810px;
  height: 51px;
  line-height: 51px;
  background-color: #fff;
  padding-left: 10px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #292c2e;
  border-bottom: 1px solid #e8e8e8;
}
.levalOne_box {
  width: 820px;
  height: 424px;
  background-color: #fff;
  position: relative;
}
.levelOne_data {
  position: absolute;
  top: 0;
  left: 26px;
}
.levelOne_num {
  font-family: PingFangSC-Regular;
  font-size: 30px;
  color: #000000;
  letter-spacing: 0;
  position: relative;
}
.levelOne_num .unit {
  position: absolute;
  width: 24px;
  height: 12px;
  top: 12px;
  left: 35px;
}
.levelOne_num .per {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #898989;
  letter-spacing: 0;
  text-align: center;
  margin-left: 4px;
}
.levelOne_num .first {
  font-family: PingFangSC-Semibold;
  font-size: 60px;
  color: #000000;
  letter-spacing: 0;
  margin-right: 26px;
}
.levelOne_tip {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #898989;
  letter-spacing: 0;
}
.levelTwo_box,.levelFive_box {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.levelTwo_left,.levelFive_right {
  background-color: #fff;
  width: 246px;
  height: 285px;
}
.levelTwo_left,.levelFive_left{
  margin-right: 20px;
}
.levelTwo_right,.levelFive_left {
  background-color: #fff;
  width: 553px;
  height: 285px;
}
.two_left_title,
.two_right_title,.five_left_title,.five_right_title {
  padding-left: 10px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #292c2e;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #e8e8e8;
}
.levelTwo_left .chartOne,.levelFive_right .chartSix {
  width: 246px;
  height: 243px;
  background-color: #fff;
}
.levelTwo_right .chartTwo ,.levelFive_left .chartFive{
  width: 553px;
  height: 243px;
}
.levelThreeBox,
.levelFourBox {
  width: 820px;
  height: 285px;
  background-color: #fff;
  margin-top: 20px;
}
.levelThree_title,
.levelFour_title {
  padding-left: 10px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #292c2e;
  border-bottom: 1px solid #e8e8e8;
  height: 40px;
  line-height: 40px;
}
.levelThreeBox .chartThree,
.levelFourBox .chartFour {
  width: 820px;
  height: 243px;
}
.mapArea {
  position: relative;
}
.tips {
  position: absolute;
  width: 100%;
  top: 34px;
  left: 0;
  text-align: center;
}
.tips img {
  margin-right: 34px;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.tipBox {
  display: block;
  width: 132px;
  height: 87px;
  background: url("../images/tip_bg_new.png") no-repeat 0 0;
  background-size: 100% 100%;
}
.container {
  width: 820px;
  margin: 0 auto;
  float: left;
  overflow: hidden;
}
.map {
  width: 700px;
  height: 397px;
  margin: 0 auto;
}
.numArea {
  width: 100%;
  text-align: center;
  margin-top: 44px;
}
.numArea p {
  display: inline-block;
  width: 42px;
  height: 54px;
  line-height: 54px;
  text-align: center;
  background: url("../images/num_bg.png") no-repeat 0 0;
  background-size: 100% 100%;
  font-size: 50px;
  font-family: "LED";
  color: rgba(0, 255, 187, 1);
  line-height: 54px;
  letter-spacing: 6px;
  margin-right: 16px;
}
.numArea .dot {
  width: 8px;
  height: 18px;
  margin-right: 16px;
}
.areaHead {
  width: 425px;
  height: 57px;
  background: url("../images/area_bg.png") no-repeat 0 0;
  background-size: 100% 100%;
  text-align: center;
  line-height: 57px;
  font-size: 26px;
  font-family: PingFangSC-Medium;
  /* font-weight: 500; */
  color: rgba(255, 255, 255, 1);
  letter-spacing: 2px;
  margin: 0 auto;
}
</style>

