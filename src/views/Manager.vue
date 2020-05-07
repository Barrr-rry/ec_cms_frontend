<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>權限管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>帳號管理</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>帳號管理</h3>
      <div>管理後台人員帳號</div>
    </div>
    <div class="container-fluid pt-24px" v-if="!loading">
      <div class="row">
        <div class="col-3 pb-24px"
             v-if="permissioncheck('permission_role_manage',2)"
        >
          <create-card @click="create_drawer=true" style="height: 140px" title="新增管理帳號"></create-card>
        </div>
        <div class="col-3 pb-24px" :key="item.id" v-for="item of items">
          <manager-card style="height: 140px" :item="item"
                        @click="openUpdateDrawer(item,null,)"></manager-card>
        </div>
      </div>
    </div>

    <manager-drawer
      v-model="create_drawer"
      :initCallback="initData"
    ></manager-drawer>
    <manager-drawer
      v-model="update_drawer"
      :initCallback="initData"
      :item="target"
    >
    </manager-drawer>
  </a-layout-content>
</template>

<script>
  import CreateCard from "../components/CreateCard"
  import ManagerCard from "../components/ManagerCard"
  import ManagerDrawer from "../components/ManagerDrawer"
  import pageMixin from "@/mixins/pageMixin"
  import {mapState} from 'vuex'

  let table_name = 'manager'
  export default {
    mixins: [pageMixin],
    components: {
      CreateCard,
      ManagerCard,
      ManagerDrawer,
    },
    data() {
      return {
        table_name
      }
    },
    computed: {
      ...mapState(table_name, {
        items: state => state.items
      }),
      ...mapState('manager', {
        info: state => state.info
      }),
    },
    methods: {},
  }
</script>
<style>
</style>