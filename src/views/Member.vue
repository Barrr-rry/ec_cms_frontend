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
              <a href="#" @click="callbackCheck(()=>filter_drawer=true,editPermission())" class="mt-2">進階篩選</a>
            </div>
            <!--button-->

          </a-form>
        </div>
        <div class="pb-24px d-flex">
          <a-button type="primary" @click="callbackCheck(()=>create_drawer=true,editPermission())">+ 新 建</a-button>
          <a-button type="primary" @click="export_member(false)" class="ml-12px"
                    :disabled="!selected_row_keys.length"
          >匯 出 已 選 擇 會 員
          </a-button>
          <a :href="export_link" ref="export_link" style="display: none">yo</a>
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

          <span slot="account" slot-scope="text, record">
            {{text}}
            <a-tag
              :color="'red'"
              class="mr-12px"
              v-if="record.in_blacklist"
            >
              {{ '黑名單' }}
            </a-tag>
            <a-tag
              :color="'volcano'"
              class="mr-12px"
              v-if="record.was_in_blacklist && !record.in_blacklist"
            >
              {{ '曾是黑名單' }}
            </a-tag>
          </span>

          <div slot="status" slot-scope="text">
            <c-badge :status="text?'success':'error'"></c-badge>
          </div>

          <div slot="operation" slot-scope="text, record">
            <a href="#" @click="openUpdateDrawer(record,()=>overview_drawer=true)">歷史訂單</a>
            <a class="ml-24px" href="#" @click="openUpdateDrawer(record,()=>reward_drawer=true)">回饋金管理</a>
            <a class="ml-24px" href="#" @click="openUpdateDrawer(record,null)">總覽</a>
          </div>
        </a-table>
      </a-card>
    </div>
    <member-drawer
      v-model="create_drawer"
      :initCallback="initData"
    ></member-drawer>
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
    <MemberFilterDrawer
      v-model="filter_drawer"
      :initCallback="initData"
      :vm="this"
      ref="filterdrawer"
    ></MemberFilterDrawer>
    <MemberRewardDrawerDrawer
      v-model="reward_drawer"
      :initCallback="initData"
      :item="target"
    ></MemberRewardDrawerDrawer>


  </a-layout-content>
</template>
<script>
  import pageMixin from "@/mixins/pageMixin"
  import tablePageMixin from "@/mixins/tablePageMixin"
  import {mapState} from 'vuex'
  import MemberDrawer from "../components/MemberDrawer"
  import searchFormMixin from "@/mixins/searchFormMixin"
  import MemberOrderOverviewDrawer from "@/components/MemberOrderOverviewDrawer"
  import MemberFilterDrawer from "@/components/MemberFilterDrawer"
  import MemberRewardDrawerDrawer from "@/components/MemberRewardDrawer"

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
      scopedSlots: {customRender: 'account'},
    },
    {
      title: '註冊時間',
      dataIndex: 'join_at',
      sorter: true,
    },
    {
      title: '回饋點數',
      dataIndex: 'returns',
      sorter: true,
    },
    {
      title: '消費次數',
      dataIndex: 'order_count',
      sorter: true,
    },
    {
      title: '消費金額',
      dataIndex: 'pay_total',
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
      MemberOrderOverviewDrawer,
      MemberFilterDrawer,
      MemberRewardDrawerDrawer
    },
    data() {
      return {
        export_link: null,
        reward_drawer: false,
        columns,
        table_name,
        overview_drawer: false,
        filter_drawer: false
      }
    },
    computed: {
      ...mapState(table_name, {
        items: state => state.items,
        raw_data: state => state.raw_data
      })
    },

    methods: {
      reset() {
        this.params = {
          limit: 10,
          offset: 0,
        }

        this.search_form.resetFields()
        this.initData()
        this.$refs.filterdrawer.reset()
      },
      initData() {
        this.loading = true
        // store action get data
        this.$store.dispatch(`${this.table_name}/getList`, this.getParams()).then(() => {
          this.loading = false
          if (this.target) {
            this.target = this.items.filter(x => x.id === this.target.id)[0]
          }
        })
      },
      export_member(all) {
        this.search_form.validateFields((err, values) => {
          if (err) {
            return
          }
          for (let k in values) {
            if (values[k] === undefined) {
              delete values[k]
            }
          }
          if (!all) {
            values.ids = this.selected_row_keys.join(',')
          }
          this.$api.exportmember.getList(values).then((res) => {
            this.export_link = this.$axios.baseURL.replace('/api/', '/media/') + res.data.file_name
            this.$nextTick(() => {
              this.$refs.export_link.click()
              this.export_link = null
            })
          })
        })
      },
      editPermission() {
        return this.permissioncheck('permission_member_manage', 2)
      },
      handleTableChange(pagination, filters, sorter) {
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