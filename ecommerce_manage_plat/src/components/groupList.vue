<template>
    <div class="recommend">
        <el-row class="mb2">
            <el-col :span="8"  class="searchArea">
                <el-input v-model="actId" placeholder="要推荐的车友群ID" class="mr2"></el-input>
                <el-button type="primary">推 荐</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            prop="date"
            label="车友群ID"
            width="180">
            </el-table-column>
            <el-table-column
            prop="name"
            label="群名称"
            width="180">
            </el-table-column>
             <el-table-column
            prop="date"
            label="群简介"
            width="180">
            </el-table-column>
            <el-table-column
            prop="date"
            label="群成员"
            width="180">
            </el-table-column>
            <el-table-column
            prop="date"
            label="推荐时间"
            width="180">
            </el-table-column>
            <el-table-column
            label="排序"
            width="200">
            <template slot-scope="scope">
                <el-button
                    @click.native.prevent="updateRow(scope.$index, scope.row,'up')"
                    size="small" 
                    v-if="scope.$index>0"
                >
                上移
                </el-button>
                <el-button
                    @click.native.prevent="updateRow(scope.$index, scope.row,'down')"
                    size="small"
                    v-if="scope.$index<tableData.length-1"
                >
                下移
                </el-button>
            </template>
            </el-table-column>
            <el-table-column
            label="达人榜"
            width="200">
            <template slot-scope="scope">
                <el-button
                    @click.native.prevent="updateRow(scope.$index, scope.row,'cancel')"
                    size="small" 
                    type="text"
                    v-if="scope.$index>0"
                >
                撤销推荐
                </el-button>
            </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
  name: "recommendList",
  data(){
    return{
        actId:'',//活动id
        tableData: []
    }
  },
  methods: {
    updateRow(index,row,type){
     
    },
  },
};
</script>

<style lang="scss" scoped>
  .recommend  .pubPagation{
    margin-top: 20px;
    float: right;
  }
  .recommend .searchArea{
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .mr2{
      margin-right: 20px;
  }
  .mb2{
      margin-bottom: 20px;
  }
</style>