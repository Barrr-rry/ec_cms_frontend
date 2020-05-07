<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>會員管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>會員列表</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>會員資料查詢</h3>
    </div>
    <div class="container-fluid pt-24px">
      <a-card>
        <div class="pb-24px d-flex">
          <a-form
                  :form="search_form"
                  class="w-100 row"
                  layout="inline"
                  @submit="submit"
          >
            <div class="col-5">
              <a-form-item label="快速查詢會員">
                <a-input
                        v-decorator="['keywords', { rules: [
            ]}]"
                        placeholder="請輸入會員編號、電話、信箱、姓名"
                        style="width: 250px"
                />
              </a-form-item>
            </div>
            <div class="col-4">
              <a-form-item label="帳號狀態">
                <a-select
                        v-decorator="['status', { rules: [] }]"
                        placeholder="請選擇狀態"
                        style="width: 110px"
                >
                  <a-select-option :value="1">
                    啟用中
                  </a-select-option>
                  <a-select-option :value="0">
                    停用中
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <!--button-->
            <div class="col-3 d-flex justify-content-end">
              <a-form-item>
                <a-button type="primary" html-type="submit" block>
                  查 詢
                </a-button>
              </a-form-item>
              <a-form-item>
                <a-button type="" @click="reset">
                  重 置
                </a-button>
              </a-form-item>
            </div>
            <!--button-->

          </a-form>
        </div>
        <div class="pb-24px d-flex">
          <a-button type="primary" @click="callbackCheck(()=>create_drawer=true,editPermission())">+ 新 增</a-button>
          <a-button type="primary" class="ml-24px" v-if=false>匯 出 已 選 擇 會 員</a-button>
        </div>
        <div class="mb-24px" style="height: 39px">
          <a-alert type="info" showIcon v-if="selected_row_keys.length">
            <span slot="message">已選擇 <span class="primary-color">{{selected_row_keys.length}}</span> 項
              <a href="#" class="ml-24px" @click="selected_row_keys = []">清空</a>
            </span>
          </a-alert>
        </div>
        <a-table :columns="columns" :dataSource="items"
                 :loading="loading"
                 :pagination="pagination"
                 @change="handleChangePage"
                 :rowKey="record => record.id"
                 :rowSelection="{selectedRowKeys: selected_row_keys, onChange: onSelectChange}"

        >
          <div slot="status" slot-scope="text">
            <c-badge :status="text?'success':'error'"></c-badge>
          </div>

          <div slot="operation" slot-scope="text, record">
            <a href="#" @click="openUpdateDrawer(record,()=>overview_drawer=true)">歷史訂單</a>
            <a class="ml-24px" href="#" @click="openUpdateDrawer(record,null)">總覽</a>
          </div>
        </a-table>
      </a-card>
    </div>
    <member-drawer
      v-model="create_drawer"
      :initCallback="initData"
    >
    </member-drawer>
    <member-drawer
      v-model="update_drawer"
      :initCallback="initData"
      :item="target"
    ></member-drawer>
    <MemberOrderOverviewDrawer
      v-model="overview_drawer"
      :initCallback="initData"
      :item="target"
    ></MemberOrderOverviewDrawer>


  </a-layout-content>
</template>
<script>
  import pageMixin from "@/mixins/pageMixin"
  import tablePageMixin from "@/mixins/tablePageMixin"
  import {mapState} from 'vuex'
  import MemberDrawer from "../components/MemberDrawer"
  import searchFormMixin from "@/mixins/searchFormMixin"
  import MemberOrderOverviewDrawer from "@/components/MemberOrderOverviewDrawer"

  const columns = [
    {
      title: '會員編號',
      dataIndex: 'member_number',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: '會員帳號',
      dataIndex: 'account',
    },
    {
      title: '電話',
      dataIndex: 'phone',
    },
    {
      title: '手機',
      dataIndex: 'cell_phone',
    },
    {
      title: '加入時間',
      dataIndex: 'join_at',
      sorter: true,
    },
    {
      title: '忠誠點數',
      dataIndex: 'returns',
      sorter: true,
    },
    {
      title: '狀態',
      dataIndex: 'status',
      scopedSlots: {customRender: 'status'},
      sorter: true,
    },

    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]


  let table_name = 'member'
  export default {
    mixins: [pageMixin, tablePageMixin, searchFormMixin],
    components: {
      MemberDrawer,
      MemberOrderOverviewDrawer
    },
    data() {
      return {
        columns,
        table_name,
        overview_drawer: false
      }
    },
    computed: {
      ...mapState(table_name, {
        items: state => state.items,
        raw_data: state => state.raw_data
      })
    },

    methods: {
      editPermission() {
        return this.permissioncheck('permission_member_manage', 2)
      },
      handleTableChange(pagination, filters, sorter) {
        console.log(pagination);
        const pager = {...this.pagination};
        pager.current = pagination.current;
        this.pagination = pager;
        this.fetch({
          results: pagination.pageSize,
          page: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters,
        });
      }
    }
  }
</script>
<style>
</style>