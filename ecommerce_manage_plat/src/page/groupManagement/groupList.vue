<template>
    <div class="groupList">
        <div class="search">
            <h3>查询</h3>
            <div class="searchItem">
                <div class="columnHd">
                    <span>群名</span>
                    <el-input class="title" v-model="groupName" placeholder="ID/群名"></el-input>
                </div>
                <div class="columnHd">
                    <span> 群主</span>
                    <el-input class="title" v-model="groupLeader" placeholder="昵称"></el-input>
                </div>
                <div class="columnHd">
                    <span>选择省</span>
                    <el-select 
                      v-model="province"
                      @change="cityChanged"
                      value-key="areaCode"
                      placeholder="请选择">
                      <el-option
                        :key="''"
                        :label="'全部'"
                        :value="''">
                      </el-option>
                      <el-option
                        v-for="item in provinces"
                        :key="item.areaCode"
                        :label="item.ateaName"
                        :value="item.areaCode">
                      </el-option>
                    </el-select>
                </div>
                <div class="columnHd">
                    <span>选择市</span>
                    <el-select 
                      v-model="city"
                      @change="citySonChanged"
                      value-key="areaCode"
                      placeholder="请选择">
                      <el-option
                        :key="''"
                        :label="'全部'"
                        :value="''">
                      </el-option>
                      <el-option
                        v-for="item in cities"
                        :key="item.areaCode"
                        :label="item.ateaName"
                        :value="item.areaCode">
                      </el-option>
                    </el-select>
                </div>
            </div>
            <div class="searchItem">
                <div class="columnHd">
                    <span>审核日期</span>
                    <el-date-picker 
                      @change="change" 
                      v-model="time" 
                      type="daterange" 
                      value-format="yyyy-MM-dd"
                      range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                    </el-date-picker>
                </div>
                <div class="columnHd">
                    <span>排序</span>
                    <el-select v-model="order" placeholder="请选择">
                        <el-option v-for="item in orderList" :key="item.id" :label="item.cate_name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <!-- <div class="columnHd">
                    <span>状态</span>
                    <el-select v-model="status" placeholder="请选择">
                        <el-option v-for="item in statusList" :key="item.id" :label="item.cate_name" :value="item.id">
                        </el-option>
                    </el-select>
                </div> -->
            </div>
            <div class="searchItem">
                <div class="columnHd">
                    <span>推荐</span>
                    <el-select v-model="recomend" placeholder="请选择">
                        <el-option v-for="item in recomendList" :key="item.id" :label="item.cate_name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="search_auth">
            <div class="searchItem">
                <el-button @click="doReset">重置</el-button>
                <el-button @click="doSearch" type="primary">查询</el-button>
            </div>
        </div>
        <div class="list">
            <h3>群组</h3>
            <div>
                <el-table 
                  :data="tableData" 
                  style="width: 100%"
          
                  >
                    <el-table-column prop="group_id" label="群ID">
                    </el-table-column>
                    <el-table-column prop="owner_id" label="群主ID">
                        <!-- <template slot-scope="scope">
                            <span v-if="scope.row.online">在线</span>
                            <span v-else>下线</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="nickname" label="群主昵称">
                    </el-table-column>
                    <el-table-column prop="group_name" label="名称">
                        <template slot-scope="scope">
                          <el-popover
                            placement="top-start"
                            width="300"
                            trigger="hover"
                            >
                            <div class="msgPop">
                              <el-row class="msgTitle">{{scope.row.group_name}}</el-row>
                              <el-row class="msgSign">
                                <el-col v-for="(item,index) in scope.row.tags_name" :key="index">{{item}}</el-col>
                              </el-row>
                              <el-row>
                                <el-row class="mt2 wt">群介绍</el-row>
                                <el-row class="mt2">{{scope.row.group_desc}}</el-row>
                                <el-row class="mt2 wt">群规则</el-row>
                                <el-row class="mt2">{{scope.row.group_rule}}</el-row>
                              </el-row>
                            </div>
                            <span slot="reference">{{scope.row.group_name}}</span>
                          </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="城市" prop="areaName">
                      
                    </el-table-column>
                    <el-table-column prop="car_model_name" label="车系">
                    </el-table-column>
                    <el-table-column prop="group_member" label="成员">
                      <!-- <template slot-scope="scope">
                        <el-button @click="previewNum(scope.row, scope.$index)" type="text" size="small" v-if="!scope.row.hasPre">查看</el-button>
                        <el-button  type="text" size="small" v-else>{{scope.row.gNum}}</el-button>
                      </template> -->
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间">
                      
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.group_status==0">正常</span>
                            <span v-if="scope.row.group_status==1">禁言中</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="推荐">
                        <template slot-scope="scope">
                            <span v-if="scope.row.recommend==0">否</span>
                            <span v-if="scope.row.recommend==1">是</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- <el-button @click="forbidden(scope.row)" type="text" size="small">禁言</el-button> -->
                            <el-button @click="dissolution(scope.row)" type="text" size="small">解散</el-button>

                            <el-button type="text" size="small" @click="groupTop(scope.row,scope.row.recommend)">
                                <span v-if="scope.row.recommend==0">推荐</span>
                                <span v-else>取消推荐</span>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </div>
        <div class="content">
            <!-- <div>
                <el-checkbox v-model="allSelect" @change="selectChangeAll">全选</el-checkbox>
                <el-button @click="groupTopAll(1)" type="text" size="small">推荐</el-button>
                <el-button @click="groupTopAll(0)" type="text" size="small">取消推荐</el-button>
                <el-button @click="dissolutionAll(1)" type="text" size="small">禁言</el-button>
                <el-button @click="dissolutionAll(0)" type="text" size="small">取消禁言</el-button>
            </div> -->
            <el-pagination
              class="pubPagation"
              @current-change="handleCurrentChange"
              :current-page.sync="curPage"
              :page-size="10"
              layout="prev, pager, next, jumper"
              :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { toast, err } from '../../utils/message.js'
// import provinceCity from '../../utils/city.json'
import provinceCity from '../../utils/newCity.json'
import { getGroupList,setGroupRecomend,disMissGroup } from '../../api/getData.js'
export default {
  data() {
    return {
      showPop:false,
      desConent:'',
      province: '',
      city: '',
      provinces: [],
      cities: [],
      groupName: '',
      groupLeader: '',
      groupTitle:'',
      order: 0,
      status:0,
      recomend:2,
      orderList:[
        { id: 0, cate_name: '最近创建' },
        { id: 1, cate_name: '最早创建' },
        // { id: 2, cate_name: '成员最多' },
        // { id: 3, cate_name: '成员最少' },
      ],
      statusList: [
        { id: 0, cate_name: '全部' },
        { id: 1, cate_name: '正常' },
        // { id: 2, cate_name: '禁言中' }
      ],
      recomendList:[
        { id: 2, cate_name: '全部' },
        { id: 1, cate_name: '是' },
        { id: 0, cate_name: '否' },
      ],
      time: '',
      tableData: [],
      page_size:10,
      total:0,
      curPage:1,
      allSelect: false
    }
  },
  created() {
    
  },
  mounted() {
    this.provinces = provinceCity.provinces;
    this.getData();
  },
  methods: {
    async getData(){
      let res = await getGroupList({
        page:this.curPage,
        page_size:this.page_size,
        group_name:this.groupName,
        group_owner:this.groupLeader,
        province:this.province,
        city:this.city,
        start_time:this.time[0],
        end_time:this.time[1],
        orders:this.order,
        // status:this.status,
        recommend:this.recomend
      })
      if(res.code == 0){
        this.total = res.data.total;
        res.data.data.forEach(n => {
          n.hasPre = false;
          n.gNum = 0;
        });
        this.tableData = res.data.data;
      }

    },
    previewNum(row,index){
      this.$set(this.tableData[index],'hasPre',true);
      this.$set(this.tableData[index],'gNum',index);
    },
    enterPop(row, column, cell, event){
      
      this.showPop = !this.showPop;
      this.desConent = row.information_title;
    },
    leavePop(row, column, cell, event){
      this.showPop = false;
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getData();
    },
    doReset(){
      this.province = '';
      this.city = '';
      this.order = 0;
      this.status = 0;
      this.time = '';
      this.recomend = 2;
      this.groupName = '';
      this.groupLeader = '';
      this.curPage = 1;
    },
    doSearch(){
      this.curPage = 1;
      this.getData();
    },
    cityChanged(value) {
      if (value !== '') {
        for (var item of this.provinces) {
          if (item.areaCode === value) {
            this.province = item.areaCode;
            this.cities = item.childAreaCode
            this.city = ''
            break
          } else {
            continue
          }
        }
      } else {
        this.cities = []
        this.city = ''
      }
      
    },
    citySonChanged(value){
      if (value !== '') {
        for (var item of this.cities) {
          if (item.areaCode === value) {
            this.city = item.areaCode;
            break
          } else {
            continue
          }
        }
      } else {
        this.city = ''
      }
      
    },
    //   选择时间
    change(value) {
      
      
    },
    async recomendGroup(row,recommend){
      let res = await setGroupRecomend({id:row.id,recommend:recommend});
      if(res.code==0){
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.getData();
      }
    },
    async opDismissGroup(row){
      let res = await disMissGroup({owner_id:row.owner_id,group_id:row.group_id});
      if(res.code==0){
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.getData();
      }else{
        this.$message.error(res.message);
      }
    },
    // 推荐取消推荐操作
    groupTop(row,recommend) {
      
      if(recommend==0){
        this.recomendGroup(row,1);
        
      }else{
        this.$confirm('此操作将取消推荐该群, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.recomendGroup(row,0);
          }).catch(() => {
               
          });
      }
    },
    // 禁言取消禁言
    forbidden(item) {
      // toast(this, this.opDismissGroup(item), '此操作将取消禁言该群组, 是否继续?', item)
    },
    // 解散
    dissolution(item) {
      this.$confirm('此操作将解散该群, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.opDismissGroup(item);
      }).catch(() => {
            
      });
    },
  },
}
</script>
<style scoped>
.wt{
  font-weight: bold;
  font-size: 14px;
  color:#000
}
.msgTitle{
  display: flex;
  justify-content: center;
  align-items: center;
}
.msgSign{
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.content  .pubPagation{
    margin-top: 20px;
    float: right;
}
.searchItem {
  display: flex;
  margin-top: 20px;
}
.columnHd {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.columnHd span {
  margin-right: 5px;
}
.columnHd .title {
  width: 200px;
}
.search_auth .searchItem {
  display: flex;
  justify-content: center;
}
.block {
  text-align: right;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.mt2{
  margin-top: 10px;
}
</style>