<template>
  <c-drawer v-model="input" title="庫存管理"
            @ok="submitHandler"
  >
    <a-form :form="form" @submit="submitHandler">
      <div class="flex-grow-1">
        <a-table :columns="columns" :dataSource="items"
                 :pagination="false"
                 :rowKey="record => record.id"
        >
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
      dataIndex: 'level1_spec',
    },
    {
      title: '顏色',
      align: 'center',
      dataIndex: 'level2_spec',
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
    },
  ]

  export default {
    mixins: [drawerMixin],
    data() {
      return {
        columns,
        default_api: this.$api.product,
        // for check to add
        // fake_data: {}
      }
    },
    computed: {
      items() {
        return this.item ? this.item.specifications_detail ? this.item.specifications_detail : [] : []
      }
    },
    methods: {
      editPermission() {
        return this.permissioncheck('permission_product_manage', 2)
      },
    }
  }
</script>

<style scoped>
</style>
