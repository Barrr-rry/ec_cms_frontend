<template>
  <c-drawer v-model="input" title="庫存管理"
            @ok="submitHandler"
  >
    <a-form :form="form" @submit="submitHandler">
      <div class="flex-grow-1">
        <a-table :columns="columns" :dataSource="temp_items"
                 :pagination="false"
                 :rowKey="record => record.id"
        >
          <template slot="quantity" slot-scope="text, record">
            <a-input
              :value="text"
              @change="e => handleChange(e.target.value, record)"
            />
          </template>
        </a-table>
      </div>
    </a-form>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"

  const columns = [
    {
      title: '商品貨號',
      align: 'center',
      dataIndex: 'product_code',
    },
    {
      title: '尺寸',
      align: 'center',
      dataIndex: 'spec1_name',
    },
    {
      title: '顏色',
      align: 'center',
      dataIndex: 'spec2_name',
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
    computed: {},
    watch: {
      item() {
        this.temp_items = this.item ? this.item.specifications_detail ? this.item.specifications_detail : [] : []
      }
    },
    methods: {
      updateHandler() {
        this.$axios.all(this.temp_items.map(el => {
          return this.$api.specificationdetail.putData(el.id, {quantity: el.quantity})
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
      editPermission() {
        return this.permissioncheck('permission_product_manage', 2)
      },
    }
  }
</script>

<style scoped>
</style>
