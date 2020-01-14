<template>
    <div class="baseContainer" style="opacity:1">
        <TopNav/>
        <div class="baseBox">
            <div class="baseItem atv">
                <div class="left">头像</div>
                <div class="right">
                    <div class="atv_box">
                        <input @change="fileChange($event)" type="file" id="upload_file" class="upload_file"  accept="image/*"/>
                        <!-- <div class="atv_outer"> -->
                            <img :src="imgStr" class="atv" alt="">
                        <!-- </div> -->
                    </div>
                   <img src="../images/arrow_right.png" class="right_icon" alt="">
                </div>
            </div>
            <router-link to="/modiName" tag="div">
                <div class="baseItem">
                    <div class="left">姓名</div>
                    <div class="right">
                        <div class="right_text">
                            {{name}}
                        </div>
                        <img src="../images/arrow_right.png" class="right_icon" alt="">
                    </div>
                </div>
            </router-link>
            <router-link to="/modiTel" tag="div">
                <div class="baseItem">
                    <div class="left">手机</div>
                    <div class="right">
                        <div class="right_text">
                            {{tel}}
                        </div>
                    <img src="../images/arrow_right.png" class="right_icon" alt="">
                    </div>
                </div>
            </router-link>
            <div class="baseItem noBorder">
                <div class="left">所属门店</div>
                <div class="right">
                    <div class="right_text">
                        {{shop}}
                    </div>
                   <img src="../images/arrow_right.png" class="right_icon" alt="">
                </div>
            </div>
            <div class="line"></div>
            <div class="baseItem noBorder" @click="addRelateCompany">
                <div class="left">添加关联门店</div>
                <div class="right">
                   <img src="../images/arrow_right.png" class="right_icon" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {uploadImage,getUploadToken,getCompanyInfo} from '@/api/index'
import { mapState ,mapActions,mapGetters} from 'vuex';
import {updateUserInfo} from '@/api/index';
import TopNav from '@/components/TopNav.vue';
export default {
    data(){
        return{
            imgStr: '',
            name:'',
            tel:'',
            shop:'',
            file:'',
            tokenUp:'',
            file_key:'',
            key:'',
            domain:'http://yanhuawang.rydltech.com/',
        }
    },
    components:{
        TopNav
    },
    computed:{
        ...mapState('login',['user','token']),
        ...mapGetters('login',['token','userId','corpCode','companyId','userRole'])
    },
    async mounted(){
        let defaulParams = {
            token:this.token,
            userId:this.userId,
            corpCode:this.corpCode,
            companyId:this.companyId,
            userRole:this.userRole,
        };
        this.imgStr = this.user.userHp;
        this.name = this.user.userName;
        this.tel = this.user.mobile;
        this.getToken();
        let res =  await getCompanyInfo(defaulParams);
        this.shop = res.data.cvName;
    },
    methods:{
        ...mapActions('login',['setAtv']),
        async getToken(){
            let res = await getUploadToken({suffix:'1'});
            this.tokenUp = res.data.token;
            this.key = res.data.imgUrl;
        },
        chooseType() {
            document.getElementById('upload_file').click();
        },
        async uploadAtv(imgStr){
            let defaulParams = {
                token:this.token,
                userId:this.userId,
                corpCode:this.corpCode,
                companyId:this.companyId,
                userRole:this.userRole,
            };
            let res = await updateUserInfo({...defaulParams,data:imgStr,type:1});
            if(res.code == 0){
                this.imgStr = imgStr;
                this.setAtv(this.imgStr);
            }
        },
        upload(e){
            var data = new FormData();//重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
            data.append('token', this.tokenUp);
            data.append('file',this.file)
            data.append('key',this.key+this.file_key)
            uploadImage(data,(res)=>{
                this.uploadAtv(this.domain+res.key)
            })
        },
        fileChange(e) {
            if (!e.target.files[0].size) return;
            this.file= e.target.files[0]
            this.file_key = e.target.files[0].name
            e.target.value = ''
            this.upload();
        },
        addRelateCompany(){
            this.$router.push({name:'joinShop',query:{addRelate:true}})
        }   
    }
}
</script>
<style lang="scss">
    html{
        background-color: #ebebeb;
    }
    .baseContainer {
        background-color: #fff;
        .nav{
            border-bottom: 2px solid #ebebeb;
        }
        .baseBox{
            display: flex;
            flex-direction: column;
            padding-top: 92px;
            .baseItem{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-left: 5%;
                padding:36px 47px 41px 0;  
                border-bottom: 2px solid #D8d8d8;
                &.noBorder{
                    border:none;
                }
                &.atv{
                    padding:30px 47px 30px 0;
                }
                .left{
                    font-size:26px;
                    color:rgba(102,102,102,1);
                    line-height:35px;
                    letter-spacing:3px;
                }
                .right{
                    display: flex;
                    align-items: center;
                    .right_text{
                        font-size:26px;
                        color:rgba(153,153,153,1);
                        line-height:35px;
                        letter-spacing:3px;
                        margin-right: 30px;
                    }
                    .right_icon{
                        width: 17px;
                        height: 30px;
                    }
                    .atv_box{
                        width:126px;
                        height:126px;
                        background:linear-gradient(85deg,rgba(255,98,56,1) 0%,rgba(255,18,64,1) 100%);
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-left: 80px;
                        margin-right: 43px;
                        position: relative;
                        overflow: hidden;
                        .upload_file{
                            position: absolute;
                            width:126px;
                            height:126px;
                            top: 0;
                            left:0;
                            opacity: 0;
                            z-index: 100;
                            background-color: #fff;
                            font-size:12px;
                        }
                        .atv_outer{
                            width:118px;
                            height:118px;
                            border-radius: 50%;
                            overflow: hidden;
                        }
                        .atv{
                            width:126px;
                            object-fit: scale-down;
                        }
                    }
                }
            }
            .line{
                width: 100%;
                height: 10px;
                background-color: #ebebeb;
            }
        }
    }
</style>

