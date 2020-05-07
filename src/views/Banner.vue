<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>文案管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>首頁大圖管理</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>首頁大圖列表管理</h3>
      <div>管理首頁大圖的資訊</div>
    </div>
    <div class="container-fluid pt-24px">
      <div class="row">
        <div class="col-3 pb-24px"
             v-if="permissioncheck('permission_banner_manage', 2)"
        >
          <create-card
            @click="create_drawer=true" style="height: 400px" title="新增首頁大圖"></create-card>
        </div>
        <div class="col-3 pb-24px" v-for="banner in items" :key="banner.id">
          <banner-card :banner="banner"
                       @click="openUpdateDrawer(banner,null,)"
                       style="height: 400px"
          ></banner-card>
        </div>
      </div>
    </div>
    <banner-drawer
      v-model="create_drawer"
      :initCallback="initData"
    ></banner-drawer>

    <banner-drawer
      v-model="update_drawer"
      :initCallback="initData"
      :item="target"
    ></banner-drawer>
  </a-layout-content>
</template>

<script>
  import CreateCard from "../components/CreateCard"
  import BannerCard from "../components/BannerCard"
  import {mapState} from 'vuex'
  import pageMixin from "@/mixins/pageMixin"
  import BannerDrawer from "@/components/BannerDrawer"

  let table_name = 'banner'
  export default {
    mixins: [pageMixin],
    components: {
      CreateCard,
      BannerCard,
      BannerDrawer,
    },
    data() {
      return {
        table_name,
      }
    },
    methods: {
      NoPermission(item, callback) {
        debugger
        if (this.item && this.item.role_manage == 0) {
          this.$router.push('/nopermission')
        }
      }
    },
    computed: {
      ...mapState(table_name, {
        items: state => state.items
      })
    }
  }
</script>
