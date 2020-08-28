<template>
  <c-drawer v-model="input" title="庫存管理"
            @ok="submitHandler"
  >
    <a-form :form="form" @submit="submitHandler">
      <div class="flex-grow-1">
        <a-table :locale="{emptyText:'目前無資料'}" :columns="computed_columns" :dataSource="temp_items"
                 :pagination="false"
                 :rowKey="record => record.id"
        >
          <template slot="quantity" slot-scope="text, record">
            <a-input
              :value="text"
              @change="e => handleChange(e.target.value, record)"
            />
          </template>
          <template slot="inventory_status" slot-scope="text, record">
            <a-select
              :value="text"
              @change="e => handleChange_status(e, record)"
            >
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
          </template>
        </a-table>
      </div>
    </a-form>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import {mapState} from "vuex";

  const columns = [
    {
      title: '商品貨號',
      align: 'center',
      dataIndex: 'product_code',
    },
    {
      title: '顏色',
      align: 'center',
      dataIndex: 'spec2_cn_name',
    },
    {
      title: '尺寸',
      align: 'center',
      dataIndex: 'spec1_cn_name',
    },
    {
      title: '原價（NTD）',
      align: 'center',
      dataIndex: 'fake_price',
    },
    {
      title: '售價（NTD）',
      align: 'center',
      dataIndex: 'price',
    },
    {
      title: '庫存數量',
      align: 'center',
      dataIndex: 'quantity',
      scopedSlots: {customRender: 'quantity'},
    },
    {
      title: '庫存狀態',
      align: 'center',
      dataIndex: 'inventory_status',
      scopedSlots: {customRender: 'inventory_status'},
    },
  ]

  export default {
    mixins: [drawerMixin],
    data() {
      return {
        columns,
        default_api: this.$api.product,
        temp_items: [],
        // for check to add
        // fake_data: {}
      }
    },
    computed: {
      ...mapState('configsetting', {
        configsetting: state => state.item
      }),
      computed_columns() {
        let ret = this.columns
        if (this.configsetting.product_stock_setting===2) {
          ret = ret.filter(x => x.title !== '庫存數量')
        }
        if (this.configsetting.product_specifications_setting===1) {
          ret = ret.filter(x => x.dataIndex !== 'spec2_cn_name')
        }
        if (this.configsetting.product_stock_setting===3) {
          ret = ret.filter(x => x.title !== '庫存狀態')
        }
        return ret
      },
    },
    watch: {
      item() {
        this.temp_items = this.item ? this.item.specifications_detail ? this.item.specifications_detail : [] : []
      }
    },
    methods: {
      updateHandler() {
        this.$axios.all(this.temp_items.map(el => {
          console.log(this.temp_items)
          console.log(el)
          return this.$api.specificationdetail.putData(el.id, {quantity: el.quantity, inventory_status: el.inventory_status})
        })).then(() => {
          this.initData()
          this.input = false
          this.$message.success('修改商品庫存成功')
        }).catch((err) => {
        })
      },
      handleChange(value, item) {
        item.quantity = value
      },
      handleChange_status(value, item) {
        item.inventory_status = value
      },
      editPermission() {
        return this.permissioncheck('permission_product_manage', 2)
      },
    },
  }

</script>

<style scoped>
</style>
