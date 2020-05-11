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
          >
            <a-form-item label="快速查詢商品">
              <a-input
                      v-decorator="['keywords', { rules: [
            ]}]"
                      placeholder="請輸入商品編號、商品名稱"
                      style="width: 250px"
              />
            </a-form-item>

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
          </a-form>
        </div>
        <div class="pb-24px">
          <a-button type="primary" @click="callbackCheck(()=>create_drawer=true,editPermission())">+ 新 增 商 品</a-button>
        </div>
        <a-table :columns="columns" :dataSource="items"
                 :loading="loading"
                 :pagination="pagination"
                 @change="handleChangePage"
                 :rowKey="record => record.id"
        >
          <div slot="inventory_status_display" slot-scope="text">
            <a-badge :status="statusBadge(text)" :text="text"></a-badge>
          </div>
          <div slot="operation" slot-scope="text, record">
            <a class="mr-24px" href="#"
               @click="openUpdateDrawer(record, ()=>product_info_drawer=true,)">商品資訊</a>
            <a class="mr-24px" href="#" @click="openUpdateDrawer(record, ()=>detail_info_drawer=true,)">詳細資訊</a>
            <a href="#" @click="openUpdateDrawer(record,null,)">編輯</a>
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
      sorter: true,
    },
    {
      title: '規格',
      dataIndex: 'specifications.nane',
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
    mixins: [pageMixin, tablePageMixin, searchFormMixin],
    components: {
      ProductDrawer,
      ProductInfoDrawer,
      ProductDetailInfoDrawer,
    },
    data() {
      return {
        columns,
        table_name,
        product_info_drawer: false,
        detail_info_drawer: false,
      }
    },
    methods: {
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
    },
    computed: {
      ...mapState(table_name, {
        items: state => state.items,
        raw_data: state => state.raw_data
      }),
    }
  }
</script>
<style>
</style>