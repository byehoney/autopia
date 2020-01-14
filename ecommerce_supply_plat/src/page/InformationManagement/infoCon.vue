<template>
  <div>
    <div class="search">
      <el-button type="primary" @click="newInfo()">新建资讯</el-button>
      <el-select v-model="linevalue" placeholder="请选择" clearable>
        <el-option v-for="item in lineType" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="typevalue" placeholder="请选择" clearable>
        <el-option v-for="item in searchType" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchinput">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="type" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.online">在线</span>
          <span v-else>下线</span>
        </template>
      </el-table-column>
      <el-table-column prop="information_title" label="标题">
      </el-table-column>
      <el-table-column label="内容性质">
        <template slot-scope="scope">
          <span v-if="scope.row.type">视频</span>
          <span v-else>图文</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="日期">
      </el-table-column>
      <el-table-column prop="theme_name" label="所属栏目">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="infodeleted(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="editInfo(scope.row)" type="text" size="small">编辑</el-button>
          <p></p>
          <el-button @click="outline(scope.row)" type="text" size="small" v-if="scope.row.online">下线</el-button>
          <el-button @click="inline(scope.row)" type="text" size="small" v-if="!scope.row.online">上线</el-button>
          <el-button type="text" size="small">
            <span v-if="!scope.row.istop" @click="infoTop(scope.row)">置顶</span>
            <span @click="infoTop(scope.row)" v-else>取消置顶</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作日期-角色">
        <template slot-scope="scope">
          <span>{{scope.row.modify_time}}</span>-
          <span>{{scope.row.operate_user}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination layout="prev, pager, next" @current-change="handleSizeChange" :current-page="page" :total="total" :page-size="page_size">
      </el-pagination>
    </div>
  </div>

</template>
<script>
import { toast, err } from '../../utils/message.js'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      lineType: [
        {
          value: '1',
          label: '上线'
        },
        {
          value: '0',
          label: '下线'
        }
      ],
      linevalue: '', //上线
      searchType: [
        { value: '0', label: '图文' },
        { value: '1', label: '视频' }
      ],
      typevalue: '', //分类
      searchinput: '', //搜索
      page_size: 10,
      page: 1,
      total: 1000
    }
  },
  mounted() {
    this.infoListApi()
  },
  methods: {
    //新建
    newInfo() {
      this.$router.push({ path: '/infomanage/newInfo/' + 'add' })
    },
    // 资讯列表
    infoListApi() {
      let data = {
        page: this.page,
        page_size: this.page_size,
        online: this.linevalue,
        type: this.typevalue,
        keyword: this.searchinput
      }
      this.$get('/op/information/list', data).then(res => {
        this.tableData = res.data.list.data
        this.total = res.data.list.total
      })
    },
    //点击搜索
    search() {
      this.infoListApi()
    },
    //删除
    infodeleted(item) {
      toast(this, this.delApi, '此操作将删除该资讯, 是否继续?', item)
    },
    delApi(item) {
      let data = { id: item.id }
      this.$post('/op/information/del', data).then(() => {
        this.infoListApi()
      })
    },
    //编辑
    editInfo(data) {
      this.$router.push({ path: '/infomanage/newInfo/' + data.id })
    },
    //下线
    outline(item) {
      toast(this, this.isOnlineApi, '此操作将下线该资讯, 是否继续?', item)
    },
    isOnlineApi(item) {
      let data = { id: item.id, online: item.online ? 0 : 1 }
      this.$post('/op/information/online', data).then(res => {
        this.infoListApi()
      })
    },
    //上线
    inline(item) {
      toast(this, this.isOnlineApi, '此操作将上线该资讯, 是否继续?', item)
    },
    //置顶
    //置顶
    infoTop(item) {
      let msg = item.istop
        ? '此操作将取消置顶该资讯, 是否继续?'
        : '此操作将置顶该资讯, 是否继续?'
      toast(this, this.typeIsTopAPi, msg, item)
    },
    typeIsTopAPi(item) {
      let data = { id: item.id, istop: item.istop ? 0 : 1 }
      this.$post('/op/information/isTop', data).then(res => {
        this.infoListApi()
      })
    },
    // 分页
    handleSizeChange(page) {
      this.page = page
      this.infoListApi()
    }
  }
}
</script>
<style scoped>
.search {
  display: flex;
  margin-bottom: 50px;
}
.block {
  text-align: right;
  margin-top: 20px;
}
</style>