<template>
    <el-dialog title="发动态" center v-if='dialogFormVisible' :visible.sync="dialogFormVisible" :destroy-on-close="true" :close-on-click-modal="false" class="pubForm">
        <el-form :model="ruleForm">
            <el-form-item label="" prop="desc">
                <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入动态内容"></el-input>
            </el-form-item>
            <el-form-item class="formItem" label="话题："  prop="type">
                <el-radio-group v-model="ruleForm.type">
                    <el-radio :label="item.topic_id" name="type" v-for="(item,index) in topicList" :key="index">#{{item.topic_name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-row class="pubPosition">
                <el-form-item label="经纬度：" prop="position">
                    <el-input type="text" v-model="ruleForm.position" placeholder="经度,纬度"></el-input>
                </el-form-item>
                <el-form-item label="地点名称：" prop="addr">
                    <el-input type="text" v-model="ruleForm.addr" placeholder="位置显示名"></el-input>
                </el-form-item>
                <el-form-item label="" prop="randomAddr" class="position">
                    <el-checkbox label="随机位置" name="randomAddr" v-model="ruleForm.randomAddr"></el-checkbox>
                </el-form-item> 
            </el-row>
            <el-upload
                class="upImg"
                :file-list="fileLists"
                :action="baseUrl+'/op/upload'"
                list-type="picture-card"
                :before-upload="beforeAvatarUpload"
                :on-success="handleSuccess"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-form-item class="formItem" label="发布用户：">
                <el-button @click="randUser">随机</el-button>
                <el-button @click="showUserPop">选择</el-button>
                <el-button type="text">{{selUser}}</el-button>
            </el-form-item>
            <el-form-item class="formItem" label="发布时间：">
                <el-button @click="nowPub">立即发布</el-button>
            </el-form-item>
            <el-form-item  label="定时发布：">
                <el-col :span="6">
                    <el-input type="text" v-model="ruleForm.pubTime" placeholder="请输入发布时间"></el-input>
                </el-col>
                <el-col :span="4"> <el-button style="margin-left:20px" @click="waitPub">定时发布</el-button></el-col>
            </el-form-item>
            <el-form-item class="formTip" label="时间格式：">
                <el-button type="text">格式：201908070908（即2019年8月7日9点08分）</el-button>
            </el-form-item>
        </el-form>
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
            </el-row> -->
            <!-- <el-divider></el-divider> -->
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
import { baseUrl } from '../config/env.js'
import { addDynamic ,editDynamic ,getTopicList ,getVirtulUserList ,getAutoRandUser,detailDynamic} from '../api/getData.js'
export default {
  name: "publishForm",
  data(){
    return{
        isEdit:false,//是否是编辑
        baseUrl:'',//上传图片路径
        dialogFormVisible:false,//表单弹框是否显示
        userDialogVisible:false,//用户选择弹出框
        feed_id:'',//动态id
        topicList:[],//话题列表
        selUser:'',//选中的发布用户  随机或者自选
        selUserId:'',//选择用户id
        imgStrs:[],//动态图片路径
        imgIds:[],//动态图片id
        fileLists:[],//图片存贮
        ruleForm: {
          desc: '',
          type:'',
          position:'',
          addr:'',
          randomAddr:false,
          pubTime:'',//定时发布时间
        },
        hisUser:[],//历史用户
        allUser:[]//全部用户
    }
  },
  async mounted() {
        this.baseUrl = baseUrl;
        let res = await getTopicList({page:1,page_size:1000,topic_name:'',recommend:1});
        if(res.code==0){
            this.topicList = res.data.data;
        }
  },
  methods: {
    beforeAvatarUpload(file){
        const isPic = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/swf' || file.type === 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isPic) {
          this.$message.error('上传图片格式有误!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isPic && isLt2M;
    },
    handleSuccess(response, file, fileList){
        this.imgStrs = fileList;
        let imgIds = [];
        fileList.map((item)=>{
            if(item.id){
                imgIds.push(item.id);
            }else{
                imgIds.push(item.response.data.id);
            }
        })
        this.imgIds = imgIds;
        if(fileList.length==12){
            document.querySelector('.el-upload--picture-card').style.display = 'none'
        }
    },
    handleRemove(file, fileList) {
        this.imgStrs = fileList;
        let imgIds = [];
        fileList.map((item)=>{
            imgIds.push(item.response.data.id);
        })
        this.imgIds = imgIds;
        if(fileList.length<12){
            document.querySelector('.el-upload--picture-card').style.display = 'inline-block'
        }
    },
    showDialogForm(params){
        this.dialogFormVisible = true;
        this.fileLists = [];
        if(params){
            this.isEdit = true;
            this.readDynamicInfo(params)
        }else{
            this.resetDynamicInfo();
            this.isEdit = false;
        }
    },
    async readDynamicInfo(cell){//回写动态信息
        let res = await detailDynamic({id:cell.feed_id});
        if(res.code==0){
            let row = res.data;
            this.selUser = row.nickname;//选中的发布用户  随机或者自选
            this.selUserId = row.feed_u_id;//选择用户id
            this.imgStrs = row.picture;//动态图片路径
            this.imgIds = row.feed_img.split(',');//动态图片id
            this.feed_id = row.feed_id;
            this.ruleForm = {
                desc: row.feed_content,
                type:row.feed_topic,
                position:row.feed_longitude+','+row.feed_latitude,
                addr:row.place_name,
                randomAddr:row.feed_longitude&&row.feed_latitude&&row.place_name?false:true,
                pubTime:row.release_time,//定时发布时间
            };
            this.fileLists = row.feed_img_array;
        }else{
            this.$message.error(res.message);
        }
    },
    resetDynamicInfo(){//重置动态信息  再次打开弹窗 清空
        this.selUser = '';//选中的发布用户  随机或者自选
        this.selUserId = '';//选择用户id
        this.imgStrs = [];//动态图片路径
        this.imgIds = [];//动态图片id
        this.ruleForm = {
          desc: '',
          type:'',
          position:'',
          addr:'',
          randomAddr:false,
          pubTime:'',//定时发布时间
        },
        this.fileLists = [];
        this.hisUser = [];//历史用户
        this.allUser = [];//全部用户
    },
    myIsNaN(value) {//判断是否为数字
        return typeof value === 'number' && !isNaN(value);
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
    checkPubInfo(){
        let {desc,type,position,addrrandomAddr,pubTime} = this.ruleForm;
        let checkResult = false;
        if(!this.ruleForm.desc&&!this.imgStrs.length){
            this.$message({
                message: '动态内容和动态图片最少上传一项',
                type: 'warning'
            });
            checkResult = false;
        }else if(!this.ruleForm.randomAddr&&!this.ruleForm.addr||!this.ruleForm.randomAddr&&!this.ruleForm.position){
            this.$message({
                message: '请完善动态发布位置信息',
                type: 'warning'
            });
            checkResult = false;
        }else if((!this.ruleForm.randomAddr&&isNaN(parseFloat(position.split(',')[0]))&&!this.ruleForm.randomAddr&&isNaN(parseFloat(position.split('，')[0])))||(!this.ruleForm.randomAddr&&isNaN(parseFloat(position.split(',')[1]))&&!this.ruleForm.randomAddr&&isNaN(parseFloat(position.split('，')[1]))) ){
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
    checkPubTime(){
        let { pubTime } = this.ruleForm;
        let reg = /^[0-9]*[1-9][0-9]*$/;
        let checkResult = false;
        let date = pubTime.substring(0,4)+'-'+pubTime.substring(4,6)+'-'+pubTime.substring(6,8)+' '+pubTime.substring(8,10)+':'+pubTime.substring(10,12);
        if(!pubTime){
            this.$message({
                message: '请输入发布时间',
                type: 'warning'
            });
            checkResult = false;
        }else if(pubTime.length!=12||!reg.test(pubTime)){
            this.$message({
                message: '发布时间格式有误',
                type: 'warning'
            });
            checkResult = false;
        }else if(new Date(date).getTime()<new Date().getTime()){
            this.$message({
                message: '发布时间小于当前时间',
                type: 'warning'
            });
            checkResult = false;
        }else{
            checkResult = true;
        }
        return checkResult;
    },
    nowPub(){//release_type 0 立即发布 1定时发布
        if(this.checkPubInfo()){//立即发布
            this.setPubInfo(0);
        }    
    },
    waitPub(){//release_type 0 立即发布 1定时发布
        if(this.checkPubInfo()&&this.checkPubTime()){//定时发布
            this.setPubInfo(1);
        }
    },
    async setPubInfo(type){
        let feed_longitude = "";
        let feed_latitude = "";
        if(!this.ruleForm.randomAddr){
            if(this.ruleForm.position.split(',').length==2){
                feed_longitude = this.ruleForm.position.split(',')[0];
                feed_latitude = this.ruleForm.position.split(',')[1];
            }else if(this.ruleForm.position.split('，').length==2){
                feed_longitude = this.ruleForm.position.split('，')[0];
                feed_latitude = this.ruleForm.position.split('，')[1];
            }else{
                this.$message({
                    message: '动态位置格式有误',
                    type: 'warning'
                });
                return;
            }
        }
        let res;
        if(!this.isEdit){
            let data = {
                feed_content:this.ruleForm.desc,
                place_type:this.ruleForm.randomAddr?1:0,
                feed_longitude:feed_longitude,
                feed_latitude:feed_latitude,
                place_name:this.ruleForm.addr,
                feed_topic:this.ruleForm.type,
                feed_img:this.imgIds.join(','),
                release_type:type,
                release_time:this.ruleForm.pubTime,
                feed_u_id:this.selUserId
            }
            res = await addDynamic(data);
        }else{
            let data = {
                feed_content:this.ruleForm.desc,
                place_type:this.ruleForm.randomAddr?1:0,
                feed_longitude:feed_longitude,
                feed_latitude:feed_latitude,
                place_name:this.ruleForm.addr,
                feed_topic:this.ruleForm.type,
                feed_img:this.imgIds.join(','),
                release_type:type,
                release_time:this.ruleForm.pubTime,
                feed_u_id:this.selUserId,
                id:this.feed_id
            }
            res = await editDynamic(data);
        }
        if(res.code==0){
            this.dialogFormVisible = false;
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.$parent.changeType(0);
        }else{
            this.$message.error(res.message);
        }
    },
    async showUserPop(){
        let res = await getVirtulUserList({page:1,page_size:1000});
        this.userDialogVisible = true;
        if(res.code==0){
            this.allUser = res.data.data;
        }
       
    }
  },
};
</script>

<style lang="scss" scoped>
// @import '../style/reset.scss';
.pubForm  .formTip .el-form-item__label{
    opacity: 0;
}
.pubForm .upImg{
    margin-bottom: 20px;
}
.pubForm  .el-upload--picture-card,.pubForm   .el-upload-list--picture-card .el-upload-list__item{
    width: 80px;
    height: 80px;
    line-height: 80px;
    position: relative!important;
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