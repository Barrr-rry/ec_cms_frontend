<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>商品管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>商品列表</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>商品列表</h3>
    </div>
    <div class="container-fluid pt-24px">
      <a-card class="mb-20px">
        <div>
          <a-form
            :form="search_form"
            layout="inline"
            @submit="submit"
            class="row fill-width"
          >
            <div class="col-4 mr-0px">
              <a-form-item label="查詢商品" class="search-input">
                <a-input
                  v-decorator="['keywords', { rules: [
            ]}]"
                  placeholder="請輸入商品編號、商品名稱、商品貨號"
                  style="width: 280px"
                />
              </a-form-item>
            </div>

            <div class="col-2 ">
              <a-form-item label="商品狀態" class="w-100 d-flex l-form-select">
                <a-select
                  v-decorator="['status', { rules: [] }]"
                  placeholder="請選擇"
                  style="width: 120px"
                >
                  <a-select-option :value="2">
                    全部
                  </a-select-option>
                  <a-select-option :value="1">
                    上架中
                  </a-select-option>
                  <a-select-option :value="0">
                    已下架
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <div class="col-2 " v-show="configsetting.product_stock_setting == 3">
              <a-form-item label="庫存狀態" class="w-100 d-flex l-form-select">
                <a-select
                  v-decorator="['inventory_status', { rules: [] }]"
                  placeholder="請選擇"
                  style="width: 120px"
                >
                  <a-select-option :value="0">
                    全部
                  </a-select-option>
                  <a-select-option :value="1">
                    庫存充足
                  </a-select-option>
                  <a-select-option :value="3">
                    庫存不足
                  </a-select-option>
                  <a-select-option :value="2">
                    無庫存
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <div class="col-2 " v-show="configsetting.product_stock_setting === 2">
              <a-form-item label="庫存狀態" class="w-100 d-flex l-form-select">
                <a-select
                  v-decorator="['inventory_status_2', { rules: [] }]"
                  placeholder="請選擇"
                  style="width: 120px"
                >
                  <a-select-option :value="0">
                    全部
                  </a-select-option>
                  <a-select-option :value="1">
                    有庫存
                  </a-select-option>
                  <a-select-option :value="2">
                    無庫存
                  </a-select-option>
                  <a-select-option :value="3">
                    預購品
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <div class="col-4 d-flex justify-content-end">
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
        <div class="d-flex">
          <a-button type="primary" @click="goNextRoute()">+ 新 增 商 品</a-button>
          <c-popover
            @ok="updateSelectedHandler($event,{status:true})"
          >
            <template slot="content">
              <p>
                確定要上架選擇的商品嗎?
              </p>
            </template>
            <div class="ml-12px">
              <a-button :disabled="selectedStatusDisabledCheck(true)"
              >上 架
              </a-button>
            </div>
          </c-popover>
          <c-popover
            @ok="updateSelectedHandler($event,{status:false})"
          >
            <template slot="content">
              <p>
                確定要下架選擇的商品嗎?
              </p>
            </template>
            <div class="ml-12px">
              <a-button :disabled="selectedStatusDisabledCheck(false)"
              >下 架
              </a-button>
            </div>
          </c-popover>
          <c-popover
            @ok="deleteSelectedItems"
          >
            <template slot="content">
              <p>
                <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
                確定要刪除選擇的商品嗎?
              </p>
            </template>
            <div class="ml-12px">
              <a-button :disabled="!selected_row_keys.length">刪 除</a-button>
            </div>
          </c-popover>
        </div>
        <div class="pt-16px pb-16px p-member-info-box">
          <a-alert type="info" showIcon>
            <div slot="message">
              已選擇 <a href="#">{{selected_row_keys.length}}</a> 項 <a href="#" v-if="selected_row_keys.length"
                                                                    @click="selected_row_keys = []">清空</a>
            </div>
          </a-alert>
        </div>
        <a-table :columns="columns" :dataSource="items"
                 :loading="loading"
                 :pagination="pagination"
                 @change="handleChangePage"
                 :rowKey="record => record.id"
                 :rowSelection="{selectedRowKeys: selected_row_keys, onChange: onSelectChange}"
        >
          <div slot="price" slot-scope="text,record">{{getProductPriceRange(record)}}</div>
          <div slot="specifications_name" slot-scope="text,record">{{getProductSpecificationsName(record)}}</div>
          <div slot="status_display" slot-scope="text">
            <a-badge :status="statusBadge(text)" :text="text"></a-badge>
          </div>
          <div slot="inventory_status_display" slot-scope="text">
            <a-badge :status="InventoryStatusBadge(text)" :text="text"></a-badge>
          </div>
          <div slot="operation" slot-scope="text, record">
            <a href="#" @click="openUpdateDrawer(record, ()=>specification_drawer=true,)" v-show="configsetting.product_stock_setting!=1">庫存管理</a>
            <a-divider type="vertical"/>
            <router-link :to="`/products/${record.id}`">編輯商品</router-link>
            <a-divider type="vertical"/>

            <c-popover
              @ok="changeStatus(record,$event)"
            >
              <template slot="content">
                <p>
                  <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
                  確定要{{record.status?'下架':'上架'}}嗎?
                </p>
              </template>
              <a href="#" @click="item=record">{{record.status?'下架':'上架'}}</a>
            </c-popover>
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
    <product-drawer
      v-model="create_drawer"
      :initCallback="initData"
    ></product-drawer>

    <product-drawer
      v-model="update_drawer"
      :initCallback="initData"
      :item="target"
    ></product-drawer>


    <ProductSpecificationDrawer
      v-model="specification_drawer"
      :initCallback="initData"
      :item="target"
    ></ProductSpecificationDrawer>

  </a-layout-content>
</template>

<script>
  import ProductDrawer from "../components/ProductDrawer"
  import ProductSpecificationDrawer from "@/components/ProductSpecificationDrawer"
  import pageMixin from "@/mixins/pageMixin"
  import tablePageMixin from "@/mixins/tablePageMixin"
  import searchFormMixin from "@/mixins/searchFormMixin"
  import {mapState} from 'vuex'

  const columns = [
    {
      title: '排序',
      dataIndex: 'order',
    },
    {
      title: '商品名稱',
      dataIndex: 'cn_name',
    },
    {
      title: '商品編號',
      dataIndex: 'product_number',
    },
    {
      title: '商品售價',
      dataIndex: 'price',
      scopedSlots: {customRender: 'price'},
      sorter: true,
    },
    {
      title: '商品規格',
      dataIndex: 'specifications_name',
      scopedSlots: {customRender: 'specifications_name'},
    },
    {
      title: '商品庫存',
      dataIndex: 'specifications_quantity',
      scopedSlots: {customRender: 'specifications_quantity'},
    },
    {
      title: '商品總銷量',
      dataIndex: 'order_count',
      sorter: true,
    },
    {
      title: '商品狀態',
      dataIndex: 'status_display',
      scopedSlots: {customRender: 'status_display'},
    },
    {
      title: '庫存狀態',
      dataIndex: 'inventory_status_display',
      scopedSlots: {customRender: 'inventory_status_display'},
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]

  let table_name = 'product'
  export default {
    components: {
      ProductDrawer,
      ProductSpecificationDrawer
    },
    mixins: [pageMixin, tablePageMixin, searchFormMixin],
    data() {
      return {
        columns,
        table_name,
        specification_drawer: false,
        product_info_drawer: false,
        detail_info_drawer: false,
        default_api: this.$api.product,
      }
    },
    computed: {
      ...mapState('configsetting', {
        configsetting: state => state.item
      }),
      ...mapState(table_name, {
        items: state => state.items,
        raw_data: state => state.raw_data
      }),
    },
    methods: {
      selectedStatusDisabledCheck(type) {
        if (!this.selected_row_keys.length) {
          return true
        }
        let filters = this.items.filter(x => this.selected_row_keys.includes(x.id) && x.status !== type)
        return filters.length === 0

      },
      changeStatus(item, callback) {
        this.default_api.putData(item.id, {status: !item.status}).then(() => {
          callback()
          let msg = ''
          if (!item.status) {
            msg = '商品下架成功'
          } else {
            msg = '商品上架成功'
          }
          this.$message.success(msg)
          this.initData()
        })
      },
      deleteHandler(item, callback) {
        this.default_api.deleteData(item.id).then(() => {
          callback()
          this.$message.success('刪除商品成功')
          this.initData()
        })
      },
      productStockProcess() {
        // 如果 product_stock_setting = 1 代表沒有庫存 columns 要刪掉
        if (this.configsetting.product_stock_setting === 1) {
          this.columns = this.columns.filter(x => x.title !== '庫存狀態')
          this.columns = this.columns.filter(x => x.title !== '商品庫存')
          this.columns.length
        }
        if (this.configsetting.product_stock_setting === 2) {
          this.columns = this.columns.filter(x => x.title !== '商品庫存')
          this.columns.length
        }
      },
      getProductSpecificationsName(item) {
        let ret = []
        for (let el of item.specifications) {
          if (el.level !== 1) {
            continue
          }
          ret.push(el.cn_name)
        }
        return ret.join('/')
      },
      getProductPriceRange(item) {
        let max_price = null
        let min_price = null
        for (let el of item.specifications_detail) {
          if (max_price === null && min_price === null) {
            max_price = el.price
            min_price = el.price
            continue
          }
          if (max_price < el.price) {
            max_price = el.price
          }
          if (min_price > el.price) {
            min_price = el.price
          }
        }
        return max_price !== max_price ? `${min_price} ~ ${max_price}` : `${max_price}`
      },
      editPermission() {
        return this.permissioncheck('permission_product_manage', 2)
      },
      InventoryStatusBadge(text) {
        let ret = 'default'
        let mapping = {
          error: ['無庫存'],
          warning: ['庫存不足', '預購品'],
          success: ['庫存充足', '有庫存'],
        }
        for (let key in mapping) {
          if (mapping[key].includes(text)) {
            ret = key
          }
        }
        return ret
      },
      statusBadge(text) {
        let ret = 'default'
        let mapping = {
          success: ['上架中'],
          warning: ['已下架'],
        }
        for (let key in mapping) {
          if (mapping[key].includes(text)) {
            ret = key
          }
        }
        return ret
      },
      goNextRoute(callback) {
        if (!this.permissioncheck('permission_product_manage', 2)) {
          this.$message.warn('權限不足')
          callback()
          return
        }
        this.$router.push(`/products/create`)

      },
      deleteSelectedItems(callback) {
        if (!this.editPermission()) {
          this.$message.warn('權限不足')
          callback()
          return
        }
        callback()
        this.$axios.all(this.selected_row_keys.map(id => {
          debugger
          return this.default_api.deleteData(id)
        })).then(() => {
          this.selected_row_keys = []
          this.initData()
        }).catch((err) => {
          this.popoverCatch(err)
        })
      },
      updateSelectedHandler(callback, values) {
        if (!this.editPermission()) {
          this.$message.warn('權限不足')
          callback()
          return
        }
        callback()
        this.$axios.all(this.selected_row_keys.map(id => {
          return this.default_api.putData(id, values)
        })).then(() => {
          this.selected_row_keys = []
          this.initData()
        }).catch((err) => {
          this.popoverCatch(err)
        })
      },
    },
    created() {
      this.productStockProcess()
    }
  }
</script>
<style>
</style>