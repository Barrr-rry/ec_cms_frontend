<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>分類管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>自定義管理</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>自定義標籤管理</h3>
      <div>編輯管理顯示在商品欄位的自定義標籤</div>
    </div>
    <div class="container-fluid pt-24px" v-if="!loading">
      <div class="row">
        <div class="col-3 pb-24px"
             v-if="permissioncheck('permission_catalog_manage',2)"
        >
          <create-card @click="create_drawer=true" style="height: 160px" title="新增自定義標籤"></create-card>
        </div>
        <div class="col-3 pb-24px" :key="item.id" v-for="item of items">
          <tag-card :item="item" @update="openUpdateDrawer(item)"
                    :initCallback="initData"
                    :class="item.tag_image_image_url.split('-')[0]+'-name'"
          ></tag-card>
        </div>
      </div>
    </div>

    <tag-drawer
      v-model="create_drawer"
      :initCallback="initData"
    ></tag-drawer>
    <tag-drawer
      v-model="update_drawer"
      :initCallback="initData"
      :item="target"
    >
    </tag-drawer>
  </a-layout-content>
</template>

<script>
  import CreateCard from "../components/CreateCard"
  import TagCard from "../components/TagCard"
  import TagDrawer from "../components/TagDrawer"
  import pageMixin from "@/mixins/pageMixin"
  import {mapState} from 'vuex'

  let table_name = 'tag'
  export default {
    mixins: [pageMixin],
    components: {
      CreateCard,
      TagCard,
      TagDrawer,
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
    methods: {},
  }
</script>
<style>
</style>