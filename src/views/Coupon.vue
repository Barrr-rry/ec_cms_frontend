<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>優惠管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>優惠券管理</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>優惠券管理</h3>
      <div>管理優惠券的圖文資訊與優惠內容</div>
    </div>
    <div class="container-fluid pt-24px" v-if="!loading">
      <div class="row">
        <div class="col-3 pb-24px" v-if="editPermission()">
          <create-card @click="create_drawer=true" style="height: 320px" title="新增優惠券"></create-card>
        </div>
        <div class="col-3 pb-24px" :key="item.id" v-for="item of items">
          <coupon-card style="height: 320px" :item="item" @click="openUpdateDrawer(item,null,)"></coupon-card>
        </div>
      </div>
    </div>

    <coupon-drawer
      v-model="create_drawer"
      :initCallback="initData"
    ></coupon-drawer>
    <coupon-drawer
      v-model="update_drawer"
      :initCallback="initData"
      :item="target"
    >
    </coupon-drawer>
  </a-layout-content>
</template>

<script>
  import CreateCard from "../components/CreateCard"
  import CouponCard from "../components/CouponCard"
  import CouponDrawer from "../components/CouponDrawer"
  import pageMixin from "@/mixins/pageMixin"
  import {mapState} from 'vuex'

  let table_name = 'coupon'
  export default {
    mixins: [pageMixin],
    components: {
      CreateCard,
      CouponCard,
      CouponDrawer,
    },
    data() {
      return {
        table_name
      }
    },
    computed: {
      ...mapState(table_name, {
        items: state => state.items
      })
    },
    methods: {
      editPermission() {
        return this.permissioncheck('permission_coupon_manage', 2)
      },
    },
  }
</script>
<style>
</style>