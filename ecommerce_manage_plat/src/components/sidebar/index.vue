<template>
    <el-menu background-color="#304156" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :default-active="this.$route.path" router>
        <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-menu"></i>商品管理</template>
            <el-menu-item-group>
                <el-menu-item index="/goodsManage/brandManage">
                    品牌管理
                </el-menu-item>
                <el-menu-item index="/goodsManage/classifyManage">
                    分类管理
                </el-menu-item>
                <el-menu-item index="/goodsManage/goodsList">
                    商品管理
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-menu"></i>系统管理</template>
            <el-menu-item-group>
                <el-menu-item index="/systermManage/adminCounts">
                    管理员账号
                </el-menu-item>
                <el-menu-item index="/systermManage/supplierManage">
                    供应商管理
                </el-menu-item>
                <el-menu-item index="/systermManage/platPrice">
                    平台定价
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
            <template slot="title">
                <i class="el-icon-menu"></i>用户管理</template>
            <el-menu-item-group>
                <el-menu-item index="/userManage/userList">
                    用户列表
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
            <template slot="title">
                <i class="el-icon-menu"></i>订单管理</template>
            <el-menu-item-group>
                <el-menu-item index="/orderManage/orderList">
                    普通订单
                </el-menu-item>
                <el-menu-item index="/orderManage/afterSaleOrder">
                    售后订单
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="5">
            <template slot="title">
                <i class="el-icon-menu"></i>结算管理</template>
            <el-menu-item-group>
                <el-menu-item index="/settleManage/withDrawals">
                    用户提现
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="6">
            <template slot="title">
                <i class="el-icon-menu"></i>页面管理</template>
            <el-menu-item-group>
                <el-menu-item index="/pageManage/goodsRecommend">
                    商品推荐
                </el-menu-item>
                <el-menu-item index="/pageManage/iconManage">
                    ICON管理
                </el-menu-item>
                <!-- <el-menu-item index="/pageManage/adManage">
                    广告管理
                </el-menu-item> -->
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="7">
            <template slot="title">
                <i class="el-icon-menu"></i>数据管理</template>
            <el-menu-item-group>
                <el-menu-item index="/dataManage/DataBackLog">
                    数据看板
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.manage_page {
}
.el-menu {
  border-right-width: 0px;
}
</style>
