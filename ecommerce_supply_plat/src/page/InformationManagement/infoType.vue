<template>
  <div>
    <div class="search">
      <el-button type="primary" @click="newType()">新建分类</el-button>
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
      <el-table-column prop="cate_name" label="分类名称">
      </el-table-column>
      <el-table-column prop="theme_num" label="包含栏目数">
      </el-table-column>
      <el-table-column prop="create_time" label="创建日期">
      </el-table-column>
      <el-table-column prop="user_id" label="创建人">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="typedeleted(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="editType(scope.row)" type="text" size="small">编辑</el-button>
          <p></p>
          <el-button @click="outline(scope.row)" type="text" size="small" v-if="scope.row.online">下线</el-button>
          <el-button @click="inline(scope.row)" type="text" size="small" v-if="!scope.row.online">上线</el-button>
          <el-button type="text" size="small">
            <span v-if="!scope.row.recommend" @click="typeTop(scope.row)">推荐</span>
            <span @click="typeTop(scope.row)" v-else>取消推荐</span>
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
      page: 1,
      total: null
    }
  },
  mounted() {
    this.typeList()
  },
  methods: {
    // 请求分类列表
    typeList(nopage) {
      this.$get('/op/informationCate/list', {
        page: this.page,
        page_size: this.page_size
      }).then(res => {
        
        this.total = res.data.total
        this.tableData = res.data.data
      })
    },
    //新建栏目
    newType() {
      this.toEditType()
    },
    addEditTypeApi(data) {
      let url = data.id
        ? '/op/informationCate/saveData'
        : '/op/informationCate/addData'
      this.$post(url, data).then(res => {
        this.typeList()
      })
    },
    //删除
    typedeleted(item) {
      toast(this, this.deleteTypeApi, '此操作将删除该分类, 是否继续?', item)
    },
    // 删除接口
    deleteTypeApi(item) {
      let data = { id: item.id }
      this.$post('/op/informationCate/del', data).then(res => {
        this.typeList()
      })
    },
    //编辑
    editType(data) {
      this.toEditType(data)
    },
    // 编辑添加混合编写
    toEditType(type) {
      let value = type ? type.cate_name : ''
      this.$prompt(!type ? '新建分类' : '修改分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: value
      })
        .then(({ value }) => {
          if (type) {
            this.addEditTypeApi({ cate_name: value, id: type.id })
          } else {
            this.addEditTypeApi({ cate_name: value })
          }
        })
        .catch(() => {})
    },
    //下线
    outline(item) {
      toast(this, this.isOnlineApi, '此操作将下线该分类, 是否继续?', item)
    },
    isOnlineApi(item) {
      let data = { id: item.id, online: item.online ? 0 : 1 }
      this.$post('/op/informationCate/online', data).then(res => {
        this.typeList()
      })
    },
    //上线
    inline(item) {
      toast(this, this.isOnlineApi, '此操作将上线该分类, 是否继续?', item)
    },
    //置顶
    typeTop(item) {
      let msg = item.recommend
        ? '此操作将取消推荐该分类, 是否继续?'
        : '此操作将推荐该分类, 是否继续?'
      toast(this, this.typeIsTopAPi, msg, item)
    },
    typeIsTopAPi(item) {
      let data = { id: item.id, recommend: item.recommend ? 0 : 1 }
      this.$post('/op/informationCate/recommend', data).then(res => {
        this.typeList()
      })
    },
    // 分页
    handleSizeChange(page) {
      this.page = page
      this.typeList('nopage')
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