<template>
  <div class="content">
    <el-row>
      <el-col :span="24" class="top">
        <el-button-group>
          <el-button type="groupBtn" :class="['groupBtn',actTab==0?'active':'']" plain @click="changeType(0)">待处理</el-button>
          <el-button type="groupBtn" :class="['groupBtn',actTab==1?'active':'']" plain @click="changeType(1)">已处理</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-main v-show="actTab==0">
        <el-row class="searchArea">
            <el-col :span="4">待处理：{{total}}条</el-col>
            <el-col :span="20" class="searchGroup">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-select v-model="numOrder" placeholder="请选择">
                            <el-option
                                v-for="item in optionOne"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="7">
                        <el-select v-model="contetnOrder" placeholder="请选择">
                            <el-option
                                v-for="item in optionTwo"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="7">
                        <el-input v-model="nickName" placeholder="按被投诉用户昵称查询"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" @click="doSearch">查询</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%;margin-top:20px;">
            <el-table-column
            prop="create_time"
            label="投诉时间"
            >
            </el-table-column>
            <el-table-column
            label="投诉人"
            >
              <template slot-scope="scope">
                  <span>{{scope.row.user.nickname}}</span>
              </template>
            </el-table-column>
            <el-table-column
            label="被投诉人"
            >
              <template slot-scope="scope">
                  <span>{{scope.row.target_user.nickname}}</span>
              </template>
            </el-table-column>
            <el-table-column
            prop="target_biz_type"
            label="内容类型"
            >
            </el-table-column>
            <el-table-column
            prop="report_type"
            label="投诉类型"
            >

            </el-table-column>
            <!-- <el-table-column
            label="内容详情"
            >
            <template slot-scope="scope">
                <el-button
                @click.native.prevent="editRow(scope.$index, scope.row)"
                type="text"
                size="small">
                通过
                </el-button>
            </template>
            </el-table-column> -->
            <el-table-column
            prop="read_count"
            label="内容阅读量"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.target_biz_type=='用户'||scope.row.target_biz_type=='图片'">——</span>
                <span v-else>{{scope.row.read_count}}</span>
              </template>
            </el-table-column>
            <el-table-column
            prop="report_count"
            label="累计被投诉"
            >
              
            </el-table-column>
            <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
                <el-button
                v-if="scope.row.target_biz_type!='用户'"
                @click.native.prevent="setPass(scope.$index, scope.row,0)"
                type="text"
                size="small">
                审核不通过
                </el-button>
                <el-button
                  v-else
                  @click.native.prevent="setFob(scope.$index, scope.row)"
                  type="text"
                  size="small">
                  禁言
                </el-button>
                <el-button
                @click.native.prevent="setPass(scope.$index, scope.row,2)"
                type="text"
                size="small">
                忽略
                </el-button>
            </template>
            </el-table-column>
        </el-table>
    </el-main>
    <el-main v-show="actTab==1">
      <el-row class="searchArea">
            <el-col>已处理：{{total}}条</el-col>
            <el-col class="searchGroup">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-select v-model="numOrder" placeholder="请选择">
                            <el-option
                                v-for="item in optionOne"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="contetnOrder" placeholder="请选择">
                            <el-option
                                v-for="item in optionTwo"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <el-input v-model="nickName" placeholder="按被投诉用户昵称查询"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="doSearch">查询</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%;margin-top:20px;">
            <el-table-column
            prop="create_time"
            label="投诉时间"
            >
            </el-table-column>
            <el-table-column
            label="投诉人"
            >
              <template slot-scope="scope">
                  <span>{{scope.row.user.nickname}}</span>
              </template>
            </el-table-column>
            <el-table-column
            label="被投诉人"
            >
              <template slot-scope="scope">
                  <span>{{scope.row.target_user.nickname}}</span>
              </template>
            </el-table-column>
            <el-table-column
            prop="target_biz_type"
            label="内容类型"
            >
            </el-table-column>
            <el-table-column
            prop="report_type"
            label="投诉类型"
            >

            </el-table-column>
            <!-- <el-table-column
            label="内容详情"
            >
            <template slot-scope="scope">
                <el-button
                @click.native.prevent="editRow(scope.$index, scope.row)"
                type="text"
                size="small">
                通过
                </el-button>
            </template>
            </el-table-column> -->
            <el-table-column
            prop="read_count"
            label="内容阅读量"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.target_biz_type=='用户'||scope.row.target_biz_type=='图片'">——</span>
                <span v-else>{{scope.row.read_count}}</span>
              </template>
            </el-table-column>
            <el-table-column
            prop="report_count"
            label="累计被投诉"
            >
            </el-table-column>
            <el-table-column
            label="处理结果"
            >
               <template slot-scope="scope">
                <span v-if="scope.row.report_status==0">审核不通过</span>
                <span v-if="scope.row.report_status==1">审核通过</span>
                <span v-if="scope.row.report_status==2">忽略</span>
                <span v-if="scope.row.report_status==3">禁言</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
                <el-button
                @click.native.prevent="editRow(scope.$index, scope.row)"
                type="text"
                size="small">
                重新处理
                </el-button>
            </template>
            </el-table-column> -->
        </el-table>
    </el-main>
    <el-pagination
      class="pubPagation"
      @current-change="handleCurrentChange"
      :current-page.sync="curPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog :visible.sync="dialogVisible" >
      <img width="100%" :src="origionPic" alt="">
    </el-dialog>
    <el-dialog :visible.sync="forbiddenVisible" title="禁言设置" width="30%" center>
      <el-row class="mid mb3">
        <el-col :span="18" class="mid">
            <el-radio-group v-model="fType">
                <el-radio-button label="1">禁言3天</el-radio-button>
                <el-radio-button label="2">禁言7天</el-radio-button>
                <el-radio-button label="3">永久禁言</el-radio-button>
            </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="mid mb3">
        <el-col :span="16" class="mid">
            <el-input v-model="reason" placeholder="请输入理由"></el-input>
        </el-col>
      </el-row>
      <el-row class="mid">
        <el-col :span="16" class="mid">
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>

import { complainList ,aduitTextState,complainFob} from '../../../api/getData.js'
export default {
  name: "audioAudit",
  data(){
      return{
        dialogVisible:false,//图片预览弹窗
        forbiddenVisible:false,//禁言弹窗
        origionPic:'',
        nickName:'',
        isPlay:false,//当前音频是否正在播放
        curPage:1,//当前页码
        total:0,//数据总数
        actTab:0,
        sh_type:0,
        curTime:'00分00秒',
        musicUrl:'http://images.81dd.cn/5fc46995d0b34fbf9c85bc35f222dec0',
        fTypeList:['禁言3天','禁言7天','永久禁言'],
        fType:1,
        curFType:0,
        reason:'',
        curRow:'',
        optionOne: [{
          value: '0',
          label: '阅读量由高到低'
        }, {
          value: '1',
          label: '累计被投诉量由高到低'
        }, {
          value: '2',
          label: '投诉时间由远到近'
        }],
        optionTwo: [{
          value: '0',
          label: '全部内容'
        }, {
          value: '1',
          label: '动态、活动、图片'
        }, {
          value: '2',
          label: '用户'
        }],
        numOrder: '0',//数量排序取值
        contetnOrder:'0',//内容排序取值
        tableData: []
      }
  },
  components: {

  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(){
      let res = await complainList({page:this.curPage,page_size:this.page_size,sh_type:this.sh_type,order_type:this.numOrder,order_content:this.contetnOrder,keyword:this.nickName});
      if(res.code==0){
        this.tableData = res.data.data;
        this.total = res.data.total;
      }
    },
    changeType(index){
      this.actTab = index;
      this.sh_type = index;
      this.curPage = 1;
      this.getData();
    },
    doSearch(){//搜索
      
      this.curPage = 1;
      this.getData();
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getData();
    },
    async handleConfirm(){
        if(!this.reason){
          this.$message({
              message: '请输入操作原因',
              type: 'warning'
          });
          return;
        }else{
          let res = await complainFob({
            report_target_owner_id:this.curRow.target_user.id,
            type:this.fType,
            remark:this.reason,
            id:this.curRow.report_id,
            report_status:3
          })
          this.forbiddenVisible = false;
          this.getData();
        }
    },
    async setPass(index,row,type){
      let res = await aduitTextState({id:row.report_id,report_status:type});
      if(res.code == 0){
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.getData();
      }else{
        this.$message.error(res.message);
      }
    },
    setFob(index,row){
      this.forbiddenVisible = true;
      this.curRow = row;
      this.fType = 1;
      this.reason = '';
    }
  },
};
</script>

<style lang="scss" scoped>
.content  .fGroup .el-button.active{
    background-color: #E6A23C!important;
    color: #fff!important;
}
.content .mb3{
    margin-bottom: 30px;
}
.content  .pubPagation{
  margin-top: 20px;
  float: right;
}
.content  .searchGroup{
  display: flex;
  justify-content: flex-end;
}
.content .searchArea{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content  .center{
  display: flex!important;
  justify-content: center!important;
  text-align: center;
}
.content .mid{
    display: flex!important;
    justify-content: center!important;
    align-items: center;
}
.content .audioBox{
  width: 40px;
  height: 40px;
  position: relative;
}
.content .audio{
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 40px;
  height: 40px;
}
.content .audioFile{
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}
.content .mb{
  margin-top: 50px;
}
.content .mb2{
  margin-top: 20px;
}
.content  .el-icon-video-pause,.content  .el-icon-video-play{
  font-size: 40px;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
.top{
  border-bottom: 1px solid #e5e5e5;
  .groupBtn{
    border-bottom: none!important;
  }
  .active{
    background-color: #409eff;
    color: #fff;
  }
}
</style>