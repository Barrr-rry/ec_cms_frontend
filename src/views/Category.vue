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
        <div class="pb-24px d-flex">
          <c-popover
            @ok="updateSelectedHandler($event)"
          >
            <template slot="content">
              <p>
                <a-form
                  :form="activity_form"
                  layout="inline"
                  class="w-100 d-flex justify-content-between"
                >
                  <a-form-item label="活動名稱" class="w-100 d-flex l-form-select">
                    <a-select
                      v-decorator="['activity', {initialValue:1 }]"
                      placeholder="請選擇活動名稱"
                    >
                      <a-select-option :value="el.id" v-for="el of activity_list" :key="el.id">
                        {{el.ch_name}}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-form>
              </p>
            </template>
            <div class="ml-12px">
              <a-button :disabled="!selected_row_keys.length">新 增 活 動</a-button>
            </div>
          </c-popover>
          <c-popover
            @ok="updatedelSelectedHandler($event)"
          >
            <template slot="content">
              <p>
                確定要移除套用活動嗎
              </p>
            </template>
            <div class="ml-12px">
              <a-button :disabled="!selected_row_keys.length">不 套 用 活 動</a-button>
            </div>
          </c-popover>
        </div>
        <a-table :columns="columns" :dataSource="items"
                 :loading="loading"
                 :pagination="false"
                 :rowKey="record => record.fake_id"
                 :rowSelection="{selectedRowKeys: selected_row_keys, onChange: onSelectChange}"
                 :locale="{emptyText:'目前無資料'}"
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
  import searchFormMixin from "@/mixins/searchFormMixin"

  const columns = [
    {
      title: '分類名稱',
      dataIndex: 'name',
    },
    {
      title: '活動',
      dataIndex: 'activity_name',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]


  let table_name = 'category'
  export default {
    mixins: [pageMixin, searchFormMixin],
    components: {
      CategoryDrawer,
    },
    data() {
      return {
        activity_form: this.$form.createForm(this),
        create_sub_drawer: false,
        columns,
        table_name,
        // fake_id: id
        fake_id_mapping: {},
      }
    },
    computed: {
      ...mapState(table_name, {
        items(state) {
          let items = state.items
          let fake_id = 0
          this.fake_id_mapping = {}
          let self = this

          function itemLoop(categories, level = 1) {
            let ret = []
            for (let item of categories) {
              if (item.sub_categories && item.sub_categories.length) {
                item['children'] = itemLoop(item.sub_categories, level + 1)
              }
              item.fake_id = fake_id++
              self.fake_id_mapping[item.fake_id] = item.id
              item.level = level
              ret.push(item)
            }
            return ret
          }

          let ret = itemLoop(items)
          return ret
        },
      }),
      ...mapState('activity', {
        activity_list: state => state.items
      })

    },
    methods: {
      updateSelectedHandler(callback) {
        this.activity_form.validateFields((err, values) => {
          let ids = []
          for (let key of this.selected_row_keys) {
            ids.push(this.fake_id_mapping[key])
          }
          values.ids = ids
          this.$api.activity.category(values).then(() => {
            callback()
            this.$message.success('更新成功')
            this.selected_row_keys = []
            setTimeout(() => {
              location.reload()
            }, 500)
          })
        })
      },
      updatedelSelectedHandler(callback) {
        this.activity_form.validateFields((err, values) => {
          let ids = []
          for (let key of this.selected_row_keys) {
            ids.push(this.fake_id_mapping[key])
          }
          values.ids = ids
          this.$api.activity.del_category(values).then(() => {
            callback()
            this.$message.success('更新成功')
            this.selected_row_keys = []
            setTimeout(() => {
              location.reload()
            }, 500)
          })
        })
      },
      initData() {
        this.loading = true
        // store action get data
        this.$store.dispatch(`activity/getList`)
        this.$store.dispatch(`${this.table_name}/getList`, this.getParams()).then(() => {
          this.loading = false
        })
      },
      editPermission() {
        return this.permissioncheck('permission_catalog_manage', 2)
      }
    }
  }
</script>
<style>
</style>