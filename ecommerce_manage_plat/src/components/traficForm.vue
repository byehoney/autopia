<template>
    <el-dialog title="上报交通路况" center :visible.sync="dialogFormVisible"  :close-on-click-modal="false" class="traficForm">
        <el-row :gutter="10">
            <el-col :span="4" v-for="(item,index) in traficTags" :key="index">
                <el-button :class="[actIndex==index?'active':'']" type="warning" plain @click="selTraficType(index,item.id)">{{item.tag_name}}</el-button>
            </el-col>
        </el-row>
        <el-row class="rowItem">
            <el-col :span="4">
                坐标：
            </el-col>
            <el-col :span="3.2">
                <el-input v-model="position" placeholder="经度,纬度"></el-input>
            </el-col>
            <el-col :span="4" class="title">
                地点名称：
            </el-col>
            <el-col :span="3.2">
                <el-input v-model="addr" placeholder="位置显示名"></el-input>
            </el-col>
        </el-row>
        <el-row class="rowItem">
            <el-col :span="4">
                发布用户：
            </el-col>
            <el-col :span="4">
                <el-button @click="randUser">随机</el-button>
            </el-col>
            <el-col :span="4">
                <el-button @click="showUserPop">选择</el-button>
            </el-col>
             <el-col :span="4">
                <el-button type="text">{{selUser}}</el-button>
            </el-col>
        </el-row>
        <el-row class="btnItem">
            <el-button type="primary" @click="speedReport">快速上报</el-button>
        </el-row>
        <el-dialog
            title="用户选择"
            :modal="false"
            :visible.sync="userDialogVisible"
            width="30%"
            center>
            <!-- <el-row>
                <el-col :span="24">最近使用过的</el-col>
            </el-row>
            <el-row>
               <el-button type="text" v-for="(item,index) in hisUser" :key="index" @click="handleSelUser(item.id,item.nickname)">{{item.nickname}}</el-button>
            </el-row>
            <el-divider></el-divider> -->
            <el-row>
                <el-col :span="24">全部</el-col>
            </el-row>
            <el-row>
               <el-button type="text" v-for="(item,index) in allUser" :key="index" @click="handleSelUser(item.id,item.nickname)">{{item.nickname}}</el-button>
            </el-row>
        </el-dialog>
    </el-dialog>
</template>
<script>
import {getVirtulUserList ,getAutoRandUser,roadTagList ,reportTrafic} from '../api/getData.js'
export default {
  name: "traficForm",
  data(){
    return{
        dialogFormVisible:false,//表单弹框是否显示
        userDialogVisible:false,//用户选择弹出框
        traficTags:['交警路检','违停贴条','免费停车','交警拍照','交通事故','严重拥堵'],
        rc_type:'',//上报标签id
        actIndex:0,//选择上报交通类型
        selUser:'',//选中的发布用户  随机或者自选
        selUserId:'',//选中用户id
        hisUser:['张三','李四'],//历史用户
        allUser:['张三','李四','王五'],//全部用户
        position:'',
        addr:'',
    }
  },
  methods: {
    showDialogForm(params){
        this.resetTrafic();
        this.getRoadTag();
        this.dialogFormVisible = true;
    },
    resetTrafic(){
        this.rc_type = '';
        this.actIndex = 0;
        this.selUser = '';
        this.selUserId = '';
        this.position = '';
        this.addr = '';

    },
    handleSelUser(id,nickname){
        this.selUser = nickname;
        this.selUserId = id;
        this.userDialogVisible = false;
    },
    async randUser(){//随机用户
        let res = await getAutoRandUser();
        this.selUser = res.data.nickname;
        this.selUserId = res.data.id;
    },
    async showUserPop(){
        let res = await getVirtulUserList({page:1,page_size:1000});
        this.userDialogVisible = true;
        if(res.code==0){
            this.allUser = res.data.data;
        }
    },
    selTraficType(index,id){
        this.actIndex = index;
        this.rc_type = id;
    },
    async getRoadTag(){
        let res = await roadTagList();
        this.traficTags = res.data;
        this.rc_type = this.traficTags[0]['id'];
    },
    checkTraficInfo(){
        let checkResult = false;
        if(!this.addr||!this.position){
            this.$message({
                message: '请完善动态发布位置信息',
                type: 'warning'
            });
            checkResult = false;
        }else if((isNaN(parseFloat(this.position.split(',')[0]))&&isNaN(parseFloat(this.position.split('，')[0])))||(isNaN(parseFloat(this.position.split(',')[1]))&&isNaN(parseFloat(this.position.split('，')[1]))) ){
            this.$message({
                message: '动态位置格式有误',
                type: 'warning'
            });
            checkResult = false;
        }else if(!this.selUser){
            this.$message({
                message: '请选择发布用户',
                type: 'warning'
            });
            checkResult = false;
        }else{
            checkResult = true;
        }
        return checkResult;
    },
    async speedReport(){//快速上报
        if(this.checkTraficInfo()){
            let feed_longitude = "";
            let feed_latitude = "";
            if(this.position.split(',').length==2){
                feed_longitude = this.position.split(',')[0];
                feed_latitude = this.position.split(',')[1];
            }else if(this.position.split('，').length==2){
                feed_longitude = this.position.split('，')[0];
                feed_latitude = this.position.split('，')[1];
            }else{
                this.$message({
                    message: '动态位置格式有误',
                    type: 'warning'
                });
                return;
            } 
            let res = await reportTrafic({
                rc_type:this.rc_type,
                position:feed_longitude+','+feed_latitude,
                position_name:this.addr,
                feed_u_id:this.selUserId
            });
            if(res.code == 0){
                this.dialogFormVisible = false;
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
                this.$parent.changeType(1);
            }else{
                this.$message.error(res.message);
            }
        }
    }
  },
};
</script>

<style lang="scss" scoped>
.traficForm  .el-button--warning.is-plain.active{
    background-color: #E6A23C;
    color: #fff;
}
.traficForm  .rowItem{
    display: flex;
    align-items: center;
    margin-top: 20px;
}
.traficForm  .btnItem{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
}
.traficForm  .title{
    margin-left: 20px;
}
.pubForm  .formTip .el-form-item__label{
    opacity: 0;
}
.pubForm  .upImg{
    margin-bottom: 20px;
}
.pubForm  .el-upload--picture-card,.pubForm   .el-upload-list--picture-card .el-upload-list__item{
    width: 80px;
    height: 80px;
    line-height: 80px;
    position: relative;
}
.pubForm  .el-upload__text{
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    line-height: 120px;
}
.pubPosition{
    display: flex;
    align-items: center;
}
.pubPosition  .el-form-item{
    display: flex;
    margin-right: 20px;
}
.pubForm  .formItem{
    display: flex!important;
    align-items: center!important;
}
.pubForm  .el-radio__input{
    display: none;
}
.pubForm .formItem  .el-form-item__label{
    flex-shrink: 0;
}
</style>