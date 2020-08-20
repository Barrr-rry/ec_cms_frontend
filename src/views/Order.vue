<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>訂單管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>訂單列表</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>訂單查詢</h3>
    </div>
    <div class="container-fluid pt-24px">
      <a-card class="mb-20px">
        <div class="pb-24px d-flex">
          <a-form
            :form="search_form"
            class="w-100 row"
            layout="inline"
            @submit="submit"
          >
            <div class="col-4">
              <a-form-item label="快速查詢訂單" class="search-input">
                <a-input
                  v-decorator="['keywords', { rules: [
              ]}]"
                  placeholder="請輸入訂單編號、收件人"
                />
              </a-form-item>
            </div>
            <div class="col-3">
              <a-form-item label="物流狀態" class="w-100 d-flex l-form-select">
                <a-select
                  v-decorator="['to_store', { rules: [] }]"
                  placeholder="請選擇物流方式"
                >
                  <a-select-option :value="1">
                    超商取貨
                  </a-select-option>
                  <a-select-option :value="0">
                    宅配到府
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="col-3">
              <a-form-item label="訂單狀態" class="w-100 d-flex l-form-select">
                <a-select
                  v-decorator="['simple_status', { rules: [] }]"
                  placeholder="請選擇訂單狀態"
                >
                  <a-select-option :value="2">
                    付款失敗
                  </a-select-option>
                  <a-select-option :value="1">
                    待出貨
                  </a-select-option>
                  <a-select-option :value="0">
                    未付款
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="col-2 d-flex justify-content-end">
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
          </a-form>
        </div>
      </a-card>
      <a-card>
        <div class="pb-24px d-flex">
          <a-button type="primary" @click="export_order(false)"
                    :disabled="!selected_row_keys.length"
          >匯 出 已 選 擇 訂 單
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
        <a-table :locale="{emptyText:'目前無資料'}" :columns="columns" :dataSource="items"
                 :loading="loading"
                 :pagination="pagination"
                 @change="handleChangePage"
                 :rowKey="record => record.id"
                 :rowSelection="{selectedRowKeys: selected_row_keys, onChange: onSelectChange}"
        >
          <span slot="shipping_name" slot-scope="text, record">
            {{text}}
            <a-tag
                    :color="'red'"
                    class="mr-12px avoid-pointer"
                    v-if="record.in_blacklist"
            >
              {{ '黑名單' }}
            </a-tag>
            <a-tag
                    :color="'volcano'"
                    class="mr-12px avoid-pointer"
                    v-if="record.was_in_blacklist && !record.in_blacklist"
            >
              {{ '曾是黑名單' }}
            </a-tag>
          </span>
          <div slot="simple_status_display" slot-scope="text">
            <a-badge :status="statusBadge(text)" :text="text"></a-badge>
          </div>
          <div slot="store_method" slot-scope="text, record">
            {{getStore(record)}}
          </div>
          <div slot="total_price" slot-scope="text">
            {{text|commaFormat}}
          </div>

          <div slot="operation" slot-scope="text, record">
            <a href="#" @click="openUpdateDrawer(record)">訂單總覽</a>
            <a href="#" class="ml-24px" @click="openUpdateDrawer(record,()=>update_shipping_drawer=true)"
               v-if="(!record.to_store||!record.use_ecpay_delivery)&&record.shipping_status===1"
            >自行出貨</a>
            <!--            <c-popover-->
            <!--              @ok="changeStatus(record,$event)"-->
            <!--            >-->
            <!--              <template slot="content">-->
            <!--                <p>-->
            <!--                  <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>-->
            <!--                  確定要執行出貨嗎?-->
            <!--                </p>-->
            <!--              </template>-->
            <!--              <a class="ml-24px" href="#"-->
            <!--                 v-if="!record.to_store&&record.shipping_status===1"-->
            <!--              >執行出貨</a>-->
            <!--            </c-popover>-->

          </div>
        </a-table>
      </a-card>
    </div>
    <order-drawer
      v-model="update_drawer"
      :initCallback="initData"
      :item="target"
    >
    </order-drawer>
    <OrderShippingStatusDrawer
      v-model="update_shipping_drawer"
      :initCallback="initData"
      :item="target"
    >
    </OrderShippingStatusDrawer>


  </a-layout-content>
</template>
<script>
  import pageMixin from "@/mixins/pageMixin"
  import tablePageMixin from "@/mixins/tablePageMixin"
  import {mapState} from 'vuex'
  import OrderDrawer from "@/components/OrderDrawer"
  import OrderShippingStatusDrawer from "@/components/OrderShippingStatusDrawer"
  import searchFormMixin from "@/mixins/searchFormMixin"


  const columns = [
    {
      title: '訂單編號',
      dataIndex: 'order_number',
    },
    {
      title: '收件人',
      dataIndex: 'shipping_name',
      scopedSlots: {customRender: 'shipping_name'},
    },
    {
      title: '訂單金額',
      dataIndex: 'total_price',
      scopedSlots: {customRender: 'total_price'},
    },
    {
      title: '物流方式',
      dataIndex: 'store_method',
      scopedSlots: {customRender: 'store_method'},
    },
    {
      title: '店名',
      dataIndex: 'store_name',
    },
    {
      title: '訂單日期',
      dataIndex: 'created_at',
      sorter: true,
    },
    {
      title: '訂單狀態',
      dataIndex: 'simple_status_display',
      scopedSlots: {customRender: 'simple_status_display'},
      sorter: true,
    },
    {
      title: '當前貨態',
      dataIndex: 'shipping_status_display',
    },

    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]


  let table_name = 'order'
  export default {
    mixins: [pageMixin, tablePageMixin, searchFormMixin],
    components: {
      OrderDrawer,
      OrderShippingStatusDrawer,
    },
    data() {
      return {
        columns,
        table_name,
        export_link: null,
        update_shipping_drawer: false,
      }
    },
    computed: {
      ...mapState(table_name, {
        items: state => state.items,
        raw_data: state => state.raw_data
      })
    },

    methods: {
      export_order(all) {
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
          this.$api.exportorder.getList(values).then((res) => {
            this.export_link = this.$axios.baseURL.replace('/api/', '/media/') + res.data.file_name
            this.$nextTick(() => {
              this.$refs.export_link.click()
              this.export_link = null
            })
          })
        })
      },
      statusBadge(text) {
        let ret = 'default'
        let mapping = {
          error: ['物流異常', '退貨待取', '取號失敗'],
          warning: ['待出貨', '取號成功', '等待付款'],
          success: ['已取貨', '已出貨'],
          process: ['待取貨']
        }
        for (let key in mapping) {
          if (mapping[key].includes(text)) {
            ret = key
          }
        }
        return ret
      },
      changeStatus(obj, callback) {
        this.$api.order.putData(obj.id, {
          shipping_status: 2,
        }).then(() => {
          this.initData()
        })
        callback()
      },
      getStore(obj) {
        if (!obj.to_store) {
          return '宅配到府'
        }
        let mapping = {
          'FAMI': '全家',
          'UNIMART': '7-11',
          'HILIFE': '萊爾富'
        }
        return `超商 ( ${mapping[obj.store_type]} )`
      },
      content(product_shot) {
        let items = JSON.parse(product_shot)
        let ret = items.map(item => {
          return `${item.name}/${item.specification.name}/X ${item.quantity}/$${item.total_price}`
        })

        return ret.join('、')
      }
    }
  }
</script>
<style>
</style>