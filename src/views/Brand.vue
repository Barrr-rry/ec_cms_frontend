<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>分類管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>品牌分類管理</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>品牌分類管理</h3>
      <div>編輯與管理品牌分類目錄</div>
    </div>
    <div class="container-fluid pt-24px" v-if="!loading">
      <a-card>
        <div class="pb-24px d-flex">
          <a-button type="primary" @click="callbackCheck(()=>create_drawer=true,editPermission())">+ 新 增 品 牌 分 類
          </a-button>
        </div>
        <a-table :columns="columns" :dataSource="items"
                 :loading="loading"
                 :pagination="false"
                 :rowKey="record => record.fake_id"
        >
          <div slot="status" slot-scope="text">
            <c-badge :status="text?'success':'error'"/>
          </div>

          <div slot="operation" slot-scope="text, record">
            <a href="#" @click="openUpdateDrawer(record,null,)">編輯</a>
          </div>
        </a-table>
      </a-card>
    </div>

    <brand-drawer
      v-model="create_drawer"
      :initCallback="initData"
    ></brand-drawer>

    <brand-drawer
      v-model="update_drawer"
      :initCallback="initData"
      :item="target"
    ></brand-drawer>


  </a-layout-content>
</template>
<script>
  import pageMixin from "@/mixins/pageMixin"
  import {mapState} from 'vuex'
  import BrandDrawer from "@/components/BrandDrawer"

  const columns = [
    {
      title: '字首',
      dataIndex: 'name',
    },
    {
      title: '品牌名稱',
      dataIndex: 'en_name',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]


  let table_name = 'brand'
  export default {
    mixins: [pageMixin],
    components: {
      BrandDrawer,
    },
    data() {
      return {
        create_sub_drawer: false,
        columns,
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
        return this.permissioncheck('permission_catalog_manage', 2)
      }
    }
  }
</script>
<style>
</style>