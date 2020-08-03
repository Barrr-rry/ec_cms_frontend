<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>權限管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>權限設定</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>權限設定</h3>
      <div>管理角色的權限</div>
    </div>
    <div class="container-fluid pt-24px" v-if="!loading">
      <a-card>
        <div class="pb-24px">
          <a-button type="primary"
                    @click="callbackCheck(()=>create_drawer=true,permissioncheck('permission_role_manage',2))">
            + 新 增 管 理 角 色
          </a-button>
        </div>
        <a-table :columns="columns" :dataSource="items"
                 :loading="loading"
                 :pagination="false"
                 :rowKey="record => record.id"
                 :locale="{emptyText:'目前無資料'}"
        >
          <div slot="operation" slot-scope="text, record">
            <a href="#" @click="openUpdateDrawer(record,()=>update_drawer=true,)">編輯</a>
            <a-divider type="vertical"/>
            <c-popover
              @ok="deleteHandler(record,$event)"
            >
              <template slot="content">
                <p>
                  <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
                  確定要刪除資料嗎?
                </p>
              </template>
              <a href="#" style="color: #f5222d" @click="item=record">刪除</a>
            </c-popover>
          </div>
        </a-table>
      </a-card>
    </div>
    <permission-drawer
      v-model="create_drawer"
      :initCallback="initData"
    ></permission-drawer>

    <permission-drawer
      v-model="update_drawer"
      :initCallback="initData"
      :item="target"
    ></permission-drawer>

  </a-layout-content>
</template>

<script>
  import PermissionDrawer from "../components/PermissionDrawer"
  import pageMixin from "@/mixins/pageMixin"
  import {mapState} from 'vuex'

  const columns = [
    {
      title: '角色名稱',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]

  let table_name = 'permission'
  export default {
    mixins: [pageMixin],
    components: {
      PermissionDrawer
    },
    data() {
      return {
        columns,
        table_name,
        default_api: this.$api.permission
      }
    },
    computed: {
      ...mapState(table_name, {
        items: state => state.items
      })
    },
    methods: {
      deleteHandler(item, callback) {
        if (!this.permissioncheck('permission_role_manage', 2)) {
          this.$message.warn('權限不足')
          callback()
          return
        }
        this.$api.permission.deleteData(item.id).then(() => {
          callback()
          this.initData()
          this.$message.success('刪除權限成功')
        }).catch(() => {
          this.$message.error('請確認該權限是否還有使用者在該權限裡')
          callback()
        })
      },
      NoPermission(item, callback) {
        if (this.item && this.item.role_manage == 0) {
          this.$router.push('/nopermission')
        }
      }
    },
  }
</script>
<style>
</style>