<!--注册选择角色-->
<template>
    <div class="reg_container" style="opacity:1">
        <TopNav></TopNav>  
        <div class="info_area">
            <div class="sel" @click="selActor">
                <p class="label">我是</p>
                <div class="actor">
                    <p>{{this.sel_value}}</p>
                    <img class="right_icon" src="../images/arrow_right.png" alt="">
                </div>
            </div>
            <div class="sel" @click="selCompany" v-if="showCompany">
                <p class="label">公司</p>
                <div class="actor">
                    <p>{{this.sel_company}}</p>
                    <img class="right_icon" src="../images/arrow_right.png" alt="">
                </div>
            </div>
            <div class="sel" @click="selPart" v-if="showPart">
                <p class="label">部门</p>
                <div class="actor">
                    <p>{{this.sel_part}}</p>
                    <img class="right_icon" src="../images/arrow_right.png" alt="">
                </div>
            </div>
            <input v-model="pasOne" class="input" type="password" placeholder="请输入密码" maxlength="16">
            <input v-model="pasTwo" class="input" type="password" placeholder="请再次输入密码" maxlength="16">
            <!-- <p class="tip">设置您的密码（密码长度需为6-16位字母数字组合）</p> -->
        </div>
        <div class="nextBtn" @click="goNext">下一步</div>
        <mt-popup
            v-model="popupVisible"
            position="bottom"
            class="regPop"
        >
            <mt-picker value-key="userName" :slots="slots" @change="onValuesChange" showToolbar v-if="showPicker1">
                <div class="barContent">
                    <div @click="handleCancel()" class="cancel">取消</div>
                    <div class="tip">请选择</div>
                    <div @click="handleConfirm()" class="sure">确认</div>
                </div>
            </mt-picker>
            <mt-picker value-key="sygsname" :slots="slots1" @change="onCompanyChange" showToolbar v-if="showPicker2">
                <div class="barContent">
                    <div @click="handleCompanyCancel()" class="cancel">取消</div>
                    <div class="tip">请选择</div>
                    <div @click="handleCompanyConfirm()" class="sure">确认</div>
                </div>
            </mt-picker>
            <mt-picker value-key="cjname" :slots="slots1" @change="onCompanyChange" showToolbar v-if="showPicker3">
                <div class="barContent">
                    <div @click="handleCompanyCancel()" class="cancel">取消</div>
                    <div class="tip">请选择</div>
                    <div @click="handleCompanyConfirm()" class="sure">确认</div>
                </div>
            </mt-picker>
            <mt-picker value-key="bmname" :slots="slots2" @change="onPartChange" showToolbar v-if="showPicker4">
                <div class="barContent">
                    <div @click="handlePartCancel()" class="cancel">取消</div>
                    <div class="tip">请选择</div>
                    <div @click="handlePartConfirm()" class="sure">确认</div>
                </div>
            </mt-picker>
        </mt-popup>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import TopNav from '@/components/TopNav'
import {getActorList,getCompanyList,getPartList,getFactoryList} from '@/api/index'
import {mapMutations, mapState} from 'vuex'
export default {
    data(){
        return{
            showCompany:false,//是否显示公司选择
            showPart:false,//是都显示部门选择
            showPicker1:false,//角色选择picker
            showPicker2:false,//公司选择picker
            showPicker3:false,//厂家选择picker
            showPicker4:false,//厂家部门选择picker
            pasOne:'',//密码
            pasTwo:'',//重复密码
            popupVisible:false,//展示popup
            set_value:'',//角色滑动变化值文字显示部分
            sel_value:'请选择',//角色选择的值文字显示部分
            userRole:'',//选定角色编码
            setRole:'',//滑动角色编码
            set_company:'',//公司滑动变化值文字显示部分
            sel_company:'请选择',//公司选择的值文字显示部分
            userCompany:'',//选定公司编码
            setCompany:'',//滑动公司编码
            set_part:'',//部门滑动变化值文字显示部分
            sel_part:'请选择',//部门选择的值文字显示部分
            userPart:'',//选定部门编码
            setPart:'',//滑动部门编码
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }   
            ],
            slots1: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }   
            ],
            slots2: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }   
            ]
        }
    },
    components:{
        TopNav
    },
    computed:{
        ...mapState('register',['roleInfo'])
    },
    async mounted(){
        console.log(this.$store.state.register)
        let res = await getActorList();
        this.$set(this.slots[0],'values',res.data.list)
        if(this.roleInfo.userRoleCode){
            this.userRole = this.roleInfo.userRoleCode;
            this.sel_value = this.roleInfo.userRoleName;
            this.pasOne = this.roleInfo.psw;
            this.pasTwo = this.roleInfo.psw;
            if(this.userRole!=''&&this.userRole!='06'&&this.userRole!='07'){
                this.getCompany(this.userRole);
                if(this.roleInfo.companyCode){
                    this.sel_company = this.roleInfo.companyName;
                    this.userCompany = this.roleInfo.companyCode;
                    if(this.userRole=='04'||this.userRole=='05'||this.userRole=='09'||this.userRole=='10'){
                        this.showCompany = true;
                        this.showPart = false;
                    }else if(this.userRole=='03'||this.userRole=='08'){
                        this.showCompany = true;
                        this.showPart = true;
                        if(this.roleInfo.partCode){
                            this.sel_part = this.roleInfo.partName;
                            this.userPart = this.roleInfo.partCode;
                            this.getPart(this.userCompany);
                        }
                    }
                }
            }
        }
    },
    methods:{
        ...mapMutations('register',['saveRole']),
        selActor(){
            this.popupVisible = true;
            this.showPicker1 = true;
            this.showPicker2 = false;
            this.showPicker3 = false;
            this.showPicker4 = false;
        },
        selCompany(){
            this.popupVisible = true
            this.showPicker1 = false;
            if(this.userRole=='04'||this.userRole=='05'||this.userRole=='09'||this.userRole=='10'){
                this.showPicker2 = true;
                this.showPicker3 = false;
                this.showPicker4 = false;
            }else if(this.userRole=='03'||this.userRole=='08'){
                this.showPicker2 = false;
                this.showPicker3 = true;
                this.showPicker4 = false;
            }
        },
        selPart(){
            this.popupVisible = true;
            this.showPicker1 = false;
            this.showPicker2 = false;
            this.showPicker3 = false;
            this.showPicker4 = true;
        },
        handleCancel(){
            this.popupVisible = false;
        },
        handleConfirm() {//选择角色
            this.popupVisible = false;
            this.sel_value = this.set_value;
            this.userRole = this.setRole;
            this.sel_company = '请选择';//公司选择的值文字显示部分
            this.userCompany = '';//选定公司编码
            this.sel_part = '请选择';//部门选择的值文字显示部分
            this.userPart = '';//选定部门编码
            // 根据选择角色 判断是商业角色 还是 工厂角色  或者店长 店员
            if(this.userRole=='04'||this.userRole=='05'||this.userRole=='09'||this.userRole=='10'){
                this.showCompany = true;
                this.showPart = false;
                this.getCompany(this.userRole);
            }else if(this.userRole=='03'||this.userRole=='08'){
                this.showCompany = true;
                this.showPart = true;
                this.getCompany(this.userRole);
            }else{
                this.showCompany = false;
                this.showPart = false;
            }
        },
        onValuesChange(picker, values){
            if(!values.length||!values[0]){
                return
            }
            this.set_value = values[0].userName;
            this.setRole = values[0].userRole;
        },
        handleCompanyCancel(){
            this.popupVisible = false;
        },
        handleCompanyConfirm(){
            this.popupVisible = false;
            this.sel_company = this.set_company;
            this.userCompany = this.setCompany;
            if(this.userRole=='03'||this.userRole=='08'){
                this.getPart(this.userCompany)
            }
        },
        onCompanyChange(picker, values){
            if(!values||!values.length||!values[0]){
                return
            }
            if(this.userRole=='04'||this.userRole=='05'||this.userRole=='09'||this.userRole=='10'){
                this.set_company = values[0].sygsname;
                this.setCompany = values[0].sygscode;
            }else if(this.userRole=='03'||this.userRole=='08'){
                this.set_company = values[0].cjname;
                this.setCompany = values[0].cjcode;
            }
        },
        handlePartCancel(){
            this.popupVisible = false;
        },
        handlePartConfirm(){
            this.popupVisible = false;
            this.sel_part = this.set_part;
            this.userPart = this.setPart;
        },
        onPartChange(picker, values){
            if(!values.length||!values[0]){
                return
            }
            this.set_part = values[0].bmname;
            this.setPart = values[0].bmcode;
        },
        async getCompany(userRole){
            if(userRole=='04'||userRole=='05'||userRole=='09'||userRole=='10'){
                let res = await getCompanyList();
                this.$set(this.slots1[0],'values',res.data.list)
                console.log(this.slots1)   
            }else if(userRole=='03'||userRole=='08'){
                let res = await getFactoryList();
                this.$set(this.slots1[0],'values',res.data.list)
                console.log(res)
            }
        },
        async getPart(userCompany){
            let res = await getPartList({cjCode:userCompany});
            this.$set(this.slots2[0],'values',res.data.list);
        },
        checkFull(){
            let result = false;
            if(!this.userRole){
                result = false;
            }else{
                result = true;
            }
            if(this.userRole=='04'||this.userRole=='05'||this.userRole=='09'||this.userRole=='10'){
               if(!this.userCompany){
                   result = false;
               }else{
                   result = true;
               }
            }else if(this.userRole=='03'||this.userRole=='08'){
                if(!this.userCompany||!this.userPart){
                    result = false;
                }else{
                    result = true;
                }
            }
            return result;
        },
        goNext(){
            let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
            if(this.sel_value == '请选择'){
                Toast({
                    message: "请选择用户角色",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else if(!this.pasOne.trim()){
                Toast({
                    message: "请输入密码",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else if(!this.pasTwo.trim()){
                Toast({
                    message: "请再次输入密码",
                    position: "middle",
                    duration: 2000
                });
                return;
            }
            // else if(this.pasOne.trim().length<6){
            //     Toast({
            //         message: "密码长度须为6-16位",
            //         position: "middle",
            //         duration: 2000
            //     });
            // }else if(!reg.test(this.pasOne.trim())||!reg.test(this.pasTwo.trim())){
            //     Toast({
            //         message: "密码须为6-16位字母数字的组合",
            //         position: "middle",
            //         duration: 2000
            //     });
            // }
            else if(this.pasOne.trim()!=this.pasTwo.trim()){
                Toast({
                    message: "两次输入密码不同",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else if(!this.checkFull()){
                Toast({
                    message: "请完善信息",
                    position: "middle",
                    duration: 2000
                });
                return;
            }else{
                let data = {
                    userRoleCode:this.userRole,//用户注册角色编码
                    userRoleName:this.sel_value,//用户注册 角色名称
                    psw:this.pasOne,//用户注册用户密码
                    companyCode:this.userCompany,//用户注册  公司角色  厂家角色时 code
                    companyName:this.sel_company,//用户注册  公司名称
                    partCode:this.userPart,//用户注册 厂家角色时 部门code
                    partName:this.sel_part,//用户注册 部门名称
                }
                this.saveRole(data);
                if(this.userRole=='06'||this.userRole=='07'){
                    this.$router.push({name:'joinShop'});
                }else{
                    this.$router.push({name:'salerInfo',query:{unique:true}});
                }
                
                console.log(this.$store.state.register)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .regPop{
        width: 100vw;
    }
    .reg_container{
        width: 100vw;
        height: 100vh;
        background:rgba(235,235,235,1);
        .info_area{
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 153px;
            .sel{
                width:559px;
                height:98px;
                padding-left: 17px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(155,155,155,1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size:30px;
                color:#333;
                letter-spacing:3px;
                margin-bottom: 39px;
                .label{
                    width: 120px
                }
                .actor{
                    display: flex;
                    align-items: center;
                    p{
                        width: 400px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        text-align: right;
                    }
                }
                .right_icon{
                    width: 17px;
                    height: 30px;
                    position: relative;
                    top: 5px;
                    margin-left: 17px;
                    margin-right: 20px;
                }
            }
            .input{
                width:559px;
                height:98px;
                line-height: 98px;
                padding-left: 17px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(155,155,155,1);
                color:#333;
                font-size:30px;
                // color:rgba(235,235,235,1);
                letter-spacing:3px;
                margin-bottom: 39px;
            }
            .tip{
                font-size:20px;
                color:rgba(245,166,35,1);
                line-height:26px;
                letter-spacing:2px;
                margin-top: -12px;
                margin-bottom: 152px;
            }
        }
        .nextBtn{
            width: 576px;
            height: 98px;
            line-height: 98px;
            text-align: center;
            font-size:36px;
            color:rgba(255,255,255,1);
            letter-spacing:3px;
            background-color: #FFC004;
            margin: 0 auto;
        }
        .picker-toolbar{
            height: 96px;
            border-bottom: 2px solid #ebebeb;
        }
        .barContent{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 38px;
            color:#666;
            .cancel,.sure{
                height: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding:0 30px;
                font-size:26px;
                color:rgba(102,102,102,1);
                letter-spacing:2px;
            }
            .sure{
                color:#E32323;
            }
            .tip{
                font-size:30px;
                color:rgba(51,51,51,1);
                letter-spacing:3px;
            }
        }
        .slot1{
            width: 100vw;
            .picker-item{
                font-size:30px;
                color:rgba(51,51,51,1);
                height: 78px;
                line-height:78px;
                letter-spacing:3px;
            }
        }
    }
</style>
