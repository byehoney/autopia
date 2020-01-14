<template>
  <div>
    <div class="search">
      <el-button type="primary" @click="newColumn()">新建栏目</el-button>
      <el-select v-model="linevalue" placeholder="请选择" clearable>
        <el-option v-for="item in lineType" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="typevalue" placeholder="所属分类" clearable>
        <el-option v-for="item in searchType" :key="item.id" :label="item.cate_name" :value="item.id">
        </el-option>
      </el-select>
      <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchinput">
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="online" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.online">在线</span>
          <span v-else>下线</span>
        </template>
      </el-table-column>
      <el-table-column prop="theme_name" label="栏目名称">
      </el-table-column>
      <el-table-column prop="atype" label="头像">
        <template slot-scope="scope">
          <img class="typeImg" :src="scope.row.theme_img" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="日期">
      </el-table-column>
      <el-table-column prop="category_name" label="所属分类">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="infodeleted(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="editInfo(scope.row)" type="text" size="small">编辑</el-button>
          <p></p>
          <el-button @click="outline(scope.row)" type="text" size="small" v-if="scope.row.online">下线</el-button>
          <el-button @click="inline(scope.row)" type="text" size="small" v-if="!scope.row.online">上线</el-button>
          <el-button type="text" size="small">
            <span v-if="!scope.row.istop" @click="columnTop(scope.row)">置顶</span>
            <span @click="columnTop(scope.row)" v-else>取消置顶</span>
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
      <el-pagination layout="prev, pager, next" @current-change="handleSizeChange" :total="total" :page-size="page_size">
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
      linevalue: '', //上线栏目
      searchType: [],
      typevalue: '', //分类
      searchinput: '', //搜索
      page_size: 10,
      total: 10
    }
  },
  mounted() {
    this.columnList()
  },
  methods: {
    //新建栏目
    newColumn() {
      this.$router.push({ path: '/infomanage/newColumn/add' })
    },
    columnList() {
      let data = {
        page: this.page,
        page_size: this.page_size,
        cate_id: this.typevalue,
        theme_name: this.searchinput,
        online: this.linevalue
      }
      this.$get('/op/informationTheme/list', data).then(res => {
        this.tableData = res.data.list.data
        this.total = res.data.list.total
        this.searchType = res.data.cate_list
      })
    },
    //点击搜索
    search() {
      this.page = 1
      this.columnList()
    },
    //删除
    infodeleted(item) {
      toast(this, this.deletdApi, '此操作将删除线该栏目, 是否继续?', item)
    },
    deletdApi(item) {
      this.$post('/op/informationTheme/del', { id: item.id }).then(res => {
        this.columnList()
      })
    },
    //编辑
    editInfo(data) {
      this.$router.push({ path: '/infomanage/newColumn/' + data.id })
    },
    //下线
    outline(item) {
      toast(this, this.isOnlineApi, '此操作将下线该栏目, 是否继续?', item)
    },
    isOnlineApi(item) {
      let data = { id: item.id, online: item.online ? 0 : 1 }
      this.$post('/op/informationTheme/online', data).then(res => {
        this.columnList()
      })
    },
    //上线
    inline(item) {
      toast(this, this.isOnlineApi, '此操作将上线该栏目, 是否继续?', item)
    },
    //置顶
    columnTop(item) {
      let msg = item.istop
        ? '此操作将取消置顶该栏目, 是否继续?'
        : '此操作将置顶该栏目, 是否继续?'
      toast(this, this.typeIsTopAPi, msg, item)
    },
    typeIsTopAPi(item) {
      let data = { id: item.id, istop: item.istop ? 0 : 1 }
      this.$post('/op/informationTheme/isTop', data).then(res => {
        this.columnList()
      })
    },
    // 分页
    handleSizeChange(page) {
      this.page = page
      this.columnList()
    }
  }
}
</script>
<style scoped>
.search {
  display: flex;
  margin-bottom: 50px;
}
.typeImg {
  width: 100px;
  height: 100px;
}
.block {
  text-align: right;
  margin-top: 20px;
}
</style>