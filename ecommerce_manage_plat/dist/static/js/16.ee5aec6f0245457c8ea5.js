webpackJsonp([16],{HYrh:function(e,t){},WVrS:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("Xxa5"),s=a.n(r),o=a("exGp"),n=a.n(o),c=a("1h8J"),l={data:function(){return{dialogVisible:!1,isEdit:!1,cform:{count:"",password:"",name:"",job:"",tel:"",role:[]},userName:"",curPage:1,page_size:10,total:0,tableData:[],curUserId:""}},mounted:function(){this.getData()},methods:{doSearch:function(){this.curPage=1,this.getData()},getData:function(){var e=this;return n()(s.a.mark(function t(){var a;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(c.d)({page:e.curPage,page_size:e.page_size,keywords:e.userName});case 2:0==(a=t.sent).code&&(e.tableData=a.data.data,e.total=a.data.total);case 4:case"end":return t.stop()}},t,e)}))()},handleCurrentChange:function(e){this.curPage=e,this.getData()},handleClose:function(){this.dialogVisible=!1,this.cform={count:"",password:"",name:"",job:"",tel:"",role:[]}},checkInfos:function(){var e=!0;return/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.cform.count)?6!=this.cform.password.trim().length?(this.$message({message:"密码格式不正确",type:"warning"}),e=!1):this.cform.name?this.cform.job?/^1[3456789]\d{9}$/.test(this.cform.tel)?e=!0:(this.$message({message:"联系电话格式不正确",type:"warning"}),e=!1):(this.$message({message:"职务不能为空",type:"warning"}),e=!1):(this.$message({message:"用户姓名不能为空",type:"warning"}),e=!1):(this.$message({message:"账号格式不正确",type:"warning"}),e=!1),e},doAdd:function(){this.dialogVisible=!0,this.isEdit=!1,this.curUserId=""},doEdit:function(e){var t=this;return n()(s.a.mark(function a(){var r;return s.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return t.dialogVisible=!0,t.isEdit=!0,t.curUserId=e.id,a.next=5,Object(c.c)({id:e.id});case 5:0==(r=a.sent).code&&(t.cform={count:r.data.account,password:r.data.password,name:r.data.username,job:r.data.workjob,tel:r.data.mobile,role:[]});case 7:case"end":return a.stop()}},a,t)}))()},opStatus:function(e,t){var a=this;return n()(s.a.mark(function r(){var o;return s.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,Object(c.L)({id:e.id,status:t});case 2:0==(o=r.sent).code?(a.$message({showClose:!0,message:"操作成功",type:"success"}),a.getData()):a.$message({showClose:!0,message:o.message,type:"error"});case 4:case"end":return r.stop()}},r,a)}))()},doOperate:function(e,t){var a=this;0==t?this.$confirm("此操作将停用该账户, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){a.opStatus(e,t)}):this.opStatus(e,t)},doConfirm:function(){var e=this;return n()(s.a.mark(function t(){var a,r;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e.checkInfos()){t.next=2;break}return t.abrupt("return");case 2:return a={},a=e.isEdit?{password:e.cform.password,username:e.cform.name,workjob:e.cform.job,mobile:e.cform.tel,id:e.curUserId}:{account:e.cform.count,password:e.cform.password,username:e.cform.name,workjob:e.cform.job,mobile:e.cform.tel},t.next=6,Object(c.w)(a);case 6:0==(r=t.sent).code?(e.$message({showClose:!0,message:"操作成功",type:"success"}),e.getData(),e.dialogVisible=!1):e.$message({showClose:!0,message:r.message,type:"error"});case 8:case"end":return t.stop()}},t,e)}))()}}},i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content"},[a("el-row",{staticClass:"mb2 hFlex"},[a("el-col",{attrs:{span:8}},[a("el-button",{attrs:{type:"primary"},on:{click:e.doAdd}},[e._v("新增管理员")])],1),e._v(" "),a("el-col",{staticClass:"end",attrs:{span:16}},[a("el-input",{staticClass:"mr2",staticStyle:{width:"150px"},attrs:{placeholder:"请输入用户名"},model:{value:e.userName,callback:function(t){e.userName=t},expression:"userName"}}),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.doSearch}},[e._v("查询")])],1)],1),e._v(" "),a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData}},[a("el-table-column",{attrs:{prop:"created_at",label:"注册时间"}}),e._v(" "),a("el-table-column",{attrs:{prop:"id",label:"编号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"account",label:"账号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"username",label:"姓名"}}),e._v(" "),a("el-table-column",{attrs:{prop:"workjob",label:"职务"}}),e._v(" "),a("el-table-column",{attrs:{prop:"mobile",label:"电话"}}),e._v(" "),a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){return e.doEdit(t.row)}}},[e._v("修改")]),e._v(" "),1==t.row.status?a("el-button",{attrs:{type:"text"},on:{click:function(a){return e.doOperate(t.row,0)}}},[e._v("停用")]):e._e(),e._v(" "),0==t.row.status?a("el-button",{attrs:{type:"text"},on:{click:function(a){return e.doOperate(t.row,1)}}},[e._v("启用")]):e._e()]}}])})],1),e._v(" "),a("el-pagination",{staticClass:"pubPagation",attrs:{"current-page":e.curPage,"page-size":10,layout:"prev, pager, next, jumper",total:e.total},on:{"current-change":e.handleCurrentChange,"update:currentPage":function(t){e.curPage=t},"update:current-page":function(t){e.curPage=t}}}),e._v(" "),a("el-dialog",{attrs:{title:e.isEdit?"修改管理员账号信息":"新增管理员账号",visible:e.dialogVisible,width:"30%","before-close":e.handleClose},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("el-form",{ref:"cform",attrs:{model:e.cform,"label-width":"120px"}},[a("el-form-item",{attrs:{label:"账号：",prop:"count"}},[a("el-input",{staticStyle:{width:"250px"},attrs:{disabled:e.isEdit,placeholder:"请输入电子邮箱"},model:{value:e.cform.count,callback:function(t){e.$set(e.cform,"count",t)},expression:"cform.count"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"密码：",prop:"password"}},[a("el-input",{staticStyle:{width:"250px"},attrs:{maxlength:6,minlength:6,placeholder:"请输入6位密码","show-password":""},model:{value:e.cform.password,callback:function(t){e.$set(e.cform,"password",t)},expression:"cform.password"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"姓名：",prop:"name"}},[a("el-input",{staticStyle:{width:"250px"},attrs:{placeholder:"请输入用户姓名"},model:{value:e.cform.name,callback:function(t){e.$set(e.cform,"name",t)},expression:"cform.name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"职务：",prop:"job"}},[a("el-input",{staticStyle:{width:"250px"},attrs:{placeholder:"请输入职务"},model:{value:e.cform.job,callback:function(t){e.$set(e.cform,"job",t)},expression:"cform.job"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"联系电话：",prop:"tel"}},[a("el-input",{staticStyle:{width:"250px"},attrs:{maxlength:11,minlength:11,placeholder:"请输入联系电话"},model:{value:e.cform.tel,callback:function(t){e.$set(e.cform,"tel",t)},expression:"cform.tel"}})],1)],1),e._v(" "),a("el-row",{staticClass:"hFlex"},[a("el-button",{staticClass:"mt2",attrs:{type:"primary"},on:{click:e.doConfirm}},[e._v(e._s(e.isEdit?"保存":"新增"))])],1)],1)],1)},staticRenderFns:[]};var u=a("VU/8")(l,i,!1,function(e){a("HYrh")},"data-v-566ccbfc",null);t.default=u.exports}});
//# sourceMappingURL=16.ee5aec6f0245457c8ea5.js.map