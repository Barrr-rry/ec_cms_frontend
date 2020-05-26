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
      <a-card>
        <div class="pb-24px d-flex">
          <a-form
            :form="search_form"
            layout="inline"
            @submit="submit"
            class="row fill-width"
          >
            <a-form-item label="快速查詢商品" class="col-6 mr-0px">
              <a-input
                v-decorator="['keywords', { rules: [
            ]}]"
                placeholder="請輸入商品編號、商品名稱"
                style="width: 250px"
              />
            </a-form-item>

            <div class="col-6 d-flex justify-content-end">
              <a-form-item>
                <a-button type="primary" html-type="submit" block>
                  查 詢
                </a-button>
              </a-form-item>
              <a-form-item class="mr-0px">
                <a-button type="" @click="reset">
                  重 置
                </a-button>
              </a-form-item>
            </div>
          </a-form>
        </div>
        <div class="pb-24px">
          <a-button type="primary" @click="goNextRoute()">+ 新 增 商 品</a-button>
        </div>
        <a-table :columns="columns" :dataSource="items"
                 :loading="loading"
                 :pagination="pagination"
                 @change="handleChangePage"
                 :rowKey="record => record.id"
        >
          <div slot="price" slot-scope="text,record">{{getProductPriceRange(record)}}</div>
          <div slot="specifications_name" slot-scope="text,record">{{getProductSpecificationsName(record)}}</div>
          <div slot="inventory_status_display" slot-scope="text">
            <a-badge :status="statusBadge(text)" :text="text"></a-badge>
          </div>
          <div slot="operation" slot-scope="text, record">
            <a class="mr-24px" href="#"
               @click="openUpdateDrawer(record, ()=>product_info_drawer=true,)">商品資訊</a>
            <a class="mr-24px" href="#" @click="openUpdateDrawer(record, ()=>detail_info_drawer=true,)">詳細資訊</a>
            <router-link :to="`/products/${record.id}`">編輯</router-link>
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

    <Product-info-drawer
      v-model="product_info_drawer"
      :initCallback="initData"
      :item="target"
    ></Product-info-drawer>

    <ProductDetailInfoDrawer
      v-model="detail_info_drawer"
      :initCallback="initData"
      :item="target"
    ></ProductDetailInfoDrawer>

  </a-layout-content>
</template>

<script>
  import ProductDrawer from "../components/ProductDrawer"
  import ProductInfoDrawer from "@/components/ProductInfoDrawer"
  import ProductDetailInfoDrawer from "@/components/ProductDetailInfoDrawer"
  import pageMixin from "@/mixins/pageMixin"
  import tablePageMixin from "@/mixins/tablePageMixin"
  import searchFormMixin from "@/mixins/searchFormMixin"
  import {mapState} from 'vuex'

  const columns = [
    {
      title: '商品編號',
      dataIndex: 'product_number',
    },
    {
      title: '商品名稱',
      dataIndex: 'name',
    },
    {
      title: '商品金額',
      dataIndex: 'price',
      scopedSlots: {customRender: 'price'},
      sorter: true,
    },
    {
      title: '規格',
      dataIndex: 'specifications_name',
      scopedSlots: {customRender: 'specifications_name'},
    },
    {
      title: '商品銷量',
      dataIndex: 'order_count',
      sorter: true,
    },
    {
      title: '庫存狀況',
      dataIndex: 'inventory_status_display',
      scopedSlots: {customRender: 'inventory_status_display'},
    },
    {
      title: '編輯商品',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]

  let table_name = 'product'
  export default {
    components: {
      ProductDrawer,
      ProductInfoDrawer,
      ProductDetailInfoDrawer,
    },
    mixins: [pageMixin, tablePageMixin, searchFormMixin],
    data() {
      return {
        columns,
        table_name,
        product_info_drawer: false,
        detail_info_drawer: false,
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
      productStockProcess() {
        // 如果 product_stock_setting = 1 代表沒有庫存 columns 要刪掉
        if (this.configsetting.product_stock_setting in [1, 2]) {
          this.columns = this.columns.filter(x => x.title !== '庫存狀況')
          this.columns.length
        }
      },
      getProductSpecificationsName(item) {
        let ret = []
        for (let el of item.specifications) {
          if (el.level !== 1) {
            continue
          }
          ret.push(el.name)
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
      statusBadge(text) {
        let ret = 'default'
        let mapping = {
          error: ['缺貨'],
          warning: ['庫存緊張，不到十件'],
          success: ['有庫存'],
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
    },
    created() {
      this.productStockProcess()
    }
  }
</script>
<style>
</style>