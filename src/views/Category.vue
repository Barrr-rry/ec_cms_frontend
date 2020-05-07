<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>分類管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>主分類管理</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>主分類管理</h3>
      <div>編輯與管理所有的分類目錄</div>
    </div>
    <div class="container-fluid pt-24px" v-if="!loading">
      <a-card>
        <div class="pb-24px d-flex" v-if="false">
          <a-button type="primary" @click="callbackCheck(()=>create_drawer=true,editPermission())">+ 新 增 主 分 類
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
            <a v-if="record.level<3"
               class="ml-24px" href="#" @click="openUpdateDrawer(record,()=>create_sub_drawer=true,editPermission())">新增子分類</a>
          </div>
        </a-table>
      </a-card>
    </div>

    <category-drawer
      v-model="create_drawer"
      :initCallback="initData"
    >
    </category-drawer>
    <category-drawer
      v-model="update_drawer"
      :initCallback="initData"
      :item="target"
    />
    <category-drawer
      v-model="create_sub_drawer"
      :initCallback="initData"
      :main_category="target?target.id:null"
    >
    </category-drawer>


  </a-layout-content>
</template>
<script>
  import pageMixin from "@/mixins/pageMixin"
  import {mapState} from 'vuex'
  import CategoryDrawer from "@/components/CategoryDrawer"

  const columns = [
    {
      title: '分類名稱',
      dataIndex: 'name',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]


  let table_name = 'category'
  export default {
    mixins: [pageMixin],
    components: {
      CategoryDrawer,
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
        items(state) {
          let items = state.items
          let fake_id = 0

          function itemLoop(categories, level = 1) {
            let ret = []
            for (let item of categories) {
              if (item.sub_categories && item.sub_categories.length) {
                item['children'] = itemLoop(item.sub_categories, level + 1)
              }
              item.fake_id = fake_id++
              item.level = level
              ret.push(item)
            }
            return ret
          }

          let ret = itemLoop(items)
          return ret
        },
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