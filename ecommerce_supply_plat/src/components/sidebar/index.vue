<template>
    <el-menu background-color="#304156" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :default-active="this.$route.path" router>
        <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-menu"></i>商品管理</template>
            <el-menu-item-group>
                <el-menu-item index="/goodsManage/goodsList">
                    商品列表
                </el-menu-item>
                <el-menu-item index="/goodsManage/goodsStock">
                    草稿箱
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-menu"></i>订单管理</template>
            <el-menu-item-group>
                <el-menu-item index="/orderManage/orderList">
                    订单管理
                </el-menu-item>
                <el-menu-item index="/orderManage/afterSaleOrder">
                    售后管理
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
            <template slot="title">
                <i class="el-icon-menu"></i>结算管理</template>
            <el-menu-item-group>
                <el-menu-item index="/settleManage/settleAcount">
                    设置提现账户
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
