<template>
    <div class="groupMsg">
        <div class="search">
            <h3>查询</h3>
            <div class="searchItem">
                <div class="columnHd">
                    <span>群名</span>
                    <el-input class="title" v-model="groupName" placeholder="ID/群名"></el-input>
                </div>
                <div class="columnHd">
                    <span>类型</span>
                    <el-select v-model="type" placeholder="请选择">
                        <el-option v-for="item in typeList" :key="item.id" :label="item.cate_name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="columnHd">
                    <span>排序</span>
                    <el-select v-model="order" placeholder="请选择">
                        <el-option v-for="item in orderList" :key="item.id" :label="item.cate_name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="searchItem">
                <div class="columnHd">
                    <span>创建日期</span>
                    <el-date-picker 
                      @change="change" 
                      v-model="time" 
                      type="daterange" 
                      value-format="yyyy-MM-dd"
                      range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                    </el-date-picker>
                </div>
            </div>
            <div class="search_auth">
                <div class="searchItem">
                  <el-button @click="doReset">重置</el-button>
                  <el-button @click="doSearch" type="primary">查询</el-button>
                </div>
            </div>
        </div>
        <div class="newMsg">
            <el-button type="primary" @click="addGroupMsgFun">新增</el-button>
        </div>
        <div class="msgList">
            <el-tabs v-model="activeName2" type="card" @tab-click="changeTab">
                <el-tab-pane label="待发布列表" name="0">
                    <el-table :data="dataList" style="width: 100%">
                        <el-table-column prop="id" label="编号">
                        </el-table-column>
                        <el-table-column prop="type" label="类型">
                          <template slot-scope="scope">
                            <span v-if="scope.row.type==0">全部发送</span>
                            <span v-else>指定发送</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="information_title" label="群名称">
                          <template slot-scope="scope">
                      
                            <span>{{scope.row.group_name?scope.row.group_name:'--'}}</span>
        
                          </template>
                        </el-table-column>
                        <el-table-column prop="group_id" label="群ID">
                        </el-table-column>
                        <el-table-column prop="content" label="内容">
                        
                        </el-table-column>
                        <el-table-column prop="create_time" label="创建时间">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="release(scope.row)" type="text" size="small">发布</el-button>
                                <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>

                                <el-button type="text" size="small" @click="deleate(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                    <div class="content"> 
                      <el-pagination
                        class="pubPagation"
                        @current-change="handleCurrentChange"
                        :current-page.sync="curPage"
                        :page-size="10"
                        layout="prev, pager, next, jumper"
                        :total="total">
                      </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="已发布列表" name="1">
                    <el-table :data="dataList" style="width: 100%">
                        <el-table-column prop="id" label="编号">
                        </el-table-column>
                        <el-table-column prop="type" label="类型">
                            <template slot-scope="scope">
                              <span v-if="scope.row.type==0">全部发送</span>
                              <span v-else>指定发送</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="information_title" label="群名称">
                          <template slot-scope="scope">
                      
                            <span>{{scope.row.group_name?scope.row.group_name:'--'}}</span>
        
                          </template>
                        </el-table-column>
                        <el-table-column prop="group_id" label="群ID">
                        </el-table-column>
                        <el-table-column prop="content" label="内容">
                        </el-table-column>
                        <el-table-column prop="publish_time" label="发布时间">
                        </el-table-column>
                        <el-table-column prop="count" label="发布次数">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                              <el-button @click="tworelease(scope.row)" type="text" size="small">再次发送</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                    <div class="content"> 
                      <el-pagination
                        class="pubPagation"
                        @current-change="handleCurrentChange"
                        :current-page.sync="curPage"
                        :page-size="10"
                        layout="prev, pager, next, jumper"
                        :total="total">
                      </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog :visible.sync="dialogVisible" width="30%" title="系统消息" class="addmsg">
            <div>
                <el-radio v-model="msgType" label="1">向指定群发送</el-radio>
                <el-radio v-model="msgType" label="0">向所有群发送</el-radio>
            </div>
            <div>
                <el-input class="title" v-model="groupTypeID" placeholder="群ID" v-if="msgType=='1'"></el-input>
            </div>
            <div>
                <el-input type="textarea" :autosize="{ minRows: 10}" placeholder="请输入内容" v-model="msgDetail"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addGroupMsgApi">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { toast, err } from '../../utils/message.js'
import { getGroupMsgList ,addGroupMsg, editGroupMsg, delGroupMsg, pubGroupMsg} from '../../api/getData.js'
export default {
  data() {
    return {
      isEdit:false,
      curId:'',//当前编辑id
      order: 0,//排序
      type:2,//类型
      activeName2: 0,
      status:0,// 0 为代发布 1 已发布 默认代发布
      dialogVisible: false,
      //   系统消息
      msgDetail: '',
      groupName: '',
      groupTypeID: '',
      msgType: '1',
      time: '',
      allSelect: false,
      orderList:[
        { id: 0, cate_name: '最新发布' },
        { id: 1, cate_name: '最早发布' },
        { id: 2, cate_name: '发布次数最多' },
      ],
      typeList: [
        { id: 2, cate_name: '全部' },
        { id: 0, cate_name: '全部发送' },
        { id: 1, cate_name: '指定发送' }
      ],
      dataList:[],
      page_size:10,
      total:0,
      curPage:1,
    }
  },
  mounted(){
    this.getData();
  },
  methods: {
    async getData(){
      let res = await getGroupMsgList({
        page:this.curPage,
        page_size:this.page_size,
        status:this.status,
        sort:this.order,
        type:this.type,
        start_time:this.time[0],
        end_time:this.time[1],
        group_name:this.groupName,
        sort:this.order
      })
      this.dataList = res.data.data;
      this.total = res.data.total;
    },
    changeTab(tab){
      
      this.curPage = 1;
      this.status = tab.name;
      this.getData();
    },
    handleCurrentChange(curPage){
      this.curPage = curPage;
      this.getData();
    },
    doReset(){
      this.groupName = '';
      this.order = 0;
      this.type = 2;
      this.time = '';
      this.curPage = 1;

    },
    doSearch(){
      this.curPage = 1;
      this.getData();
    },
    //   选择时间
    change(value) {
      
      
    },
    async opPublish(item){
      let res = await pubGroupMsg({id:item.id,type:item.type});
      if(res.code ==0){
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.getData();
      }else{
        this.$message.error(res.message);
      }
    },
    //   待发布发布操作
    release(item) {
      this.$confirm('此操作将发布该条群消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.opPublish(item);
      }).catch(() => {
            
      });
    },
    // 新建资讯
    addGroupMsgFun() {
      this.isEdit = false;
      this.dialogVisible = true;
      this.msgType = '1';
      this.groupTypeID = '';
      this.msgDetail = '';
    },
    async addGroupMsgApi() {
      let reg = /^[0-9]*[1-9][0-9]*$/;
      if(this.msgType==1&&this.groupTypeID==''){
        this.$message({
          message: '请输入指定群的ID或名称',
          type: 'warning'
        });
        return;
      }else if(this.msgType==1&&!reg.test(this.groupTypeID)){
        this.$message({
          message: '群ID格式有误',
          type: 'warning'
        });
        return;
      }else if(!this.msgDetail){
        this.$message({
          message: '请输入推送内容',
          type: 'warning'
        });
        return;
      }
      let data = {};
      if(this.isEdit){
        if(this.msgType==1){
          data = {
            id:this.curId,
            type:this.msgType,
            group_id:this.groupTypeID,
            content:this.msgDetail
          }
        }else{
          data = {
            id:this.curId,
            type:this.msgType,
            content:this.msgDetail
          }
        }
        let res = await editGroupMsg(data);
        if(res.code == 0){
          this.getData();
          this.dialogVisible = false;
        }else{
          this.$message.error(res.message);
        }
      }else{
        if(this.msgType==1){
          data = {
            type:this.msgType,
            group_id:this.groupTypeID,
            content:this.msgDetail
          }
        }else{
          data = {
            type:this.msgType,
            content:this.msgDetail
          }
        }
        let res = await addGroupMsg(data);
        if(res.code == 0){
          this.getData();
          this.dialogVisible = false;
        }else{
          this.$message.error(res.message);
        }
      }
    },
    //   待发布编辑操作
    edit(item) {
      if(item.type==0){
        this.msgType = '0';
        this.groupTypeID = '';
        this.msgDetail = item.content;
      }else{
        this.msgType = '1';
        this.groupTypeID = item.group_id;
        this.msgDetail = item.content;
      }
      this.isEdit = true;
      this.dialogVisible = true;
      this.curId = item.id;
    },
    async opDelMsg(item){
      let  res = await delGroupMsg({id:item.id});
      if(res.code ==0){
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.getData();
      }else{
        this.$message.error(res.message);
      }
    },
    //   待发布删除操作
    deleate(item) {
      this.$confirm('此操作将删除该条群消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.opDelMsg(item);
      }).catch(() => {
            
      });
    },
    // 发布的取消发布
    norelease(item) {
      toast(this, null, '此操作将取消发布该消息, 是否继续?', item)
    },
    // 发布的再次发布
    tworelease(item) {
      this.release(item);
    },
    handleSizeChange() {},
    releaseAll() {}
  }
}
</script>
<style scoped>
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
.newMsg {
  text-align: right;
  margin-top: 20px;
}
.addmsg div {
  margin-top: 10px;
}
.mt2{
  margin-top: 10px;
}
</style>