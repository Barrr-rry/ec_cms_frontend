<template>
  <a-card title="規格詳情">
    <a-table :columns="computed_columns" :data-source="data"
             :pagination="false"
             :rowKey="record => record.key"
    >
      <template
        v-for="col in edit_columns"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
        <span v-if="record.editable">
          <a class="mr-8px" @click="() => save(record.key)">保存</a>
          <a-popconfirm title="確定取消?" @confirm="() => cancel(record.key)"
                        okText="確定" cancelText="取消"
          >
            <a>取消</a>
          </a-popconfirm>
        </span>
          <span v-else>
          <a class="mr-8px" :disabled="editingKey !== ''" @click="() => edit(record.key)">編輯</a>
        </span>
        </div>
      </template>
    </a-table>
  </a-card>
</template>

<script>
  import configsettingMixin from "@/mixins/configsettingMixin"

  const columns = [
    // level1_spec
    {
      title: '',
      dataIndex: 'level1_spec',
      scopedSlots: {customRender: 'level1_spec'},
    },
    // level2_spec
    {
      title: '',
      dataIndex: 'level2_spec',
      scopedSlots: {customRender: 'level2_spec'},
    },
    {
      title: '原價（ NTD ）',
      dataIndex: 'fake_price',
      scopedSlots: {customRender: 'fake_price'},
    },
    {
      title: '售價（ NTD )',
      dataIndex: 'price',
      scopedSlots: {customRender: 'price'},
    },
    // 有可能是 inventory_status 庫存功能
    {
      title: '庫存數量',
      dataIndex: 'quantity',
      scopedSlots: {customRender: 'quantity'},
    },
    // config 判斷
    {
      title: '重量（ Kg ）',
      dataIndex: 'weight',
      scopedSlots: {customRender: 'weight'},
    },
    {
      title: '商品貨號',
      dataIndex: 'product_code',
      scopedSlots: {customRender: 'product_code'},
    },
    {
      width: '120px',
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]

  export default {
    name: "SpecificationMergeCard",
    mixins: [configsettingMixin],
    props: {
      item: {
        type: Object,
        default: null,
      },
    },
    data() {
      let edit_columns = [
        'fake_price', 'price', 'quantity', 'inventory_status',
        'weight', 'product_code'
      ]
      let data = []
      let key = 0
      // 實際的資料
      this.cacheData = data.map(item => ({...item}))
      return {
        edit_columns,
        // 顯示level 2 name
        has_level2_spec: true,
        name,
        key,
        data,
        columns,
        editingKey: '',
      }
    },
    watch: {
      name() {
        this.$emit('onChange')
      }
    },
    computed: {
      computed_columns() {
        let columns = [...this.columns]
        if (!this.has_level2) {
          columns = columns.filter(x => x.dataIndex !== 'level2')
        }
        if (!this.configsetting.weight) {
          columns = columns.filter(x => x.dataIndex !== 'weight')
        }
        // 沒有庫存
        if (this.configsetting.product_stock_setting === 1) {
          columns = columns.filter(x => x.dataIndex !== 'quantity')
        }
        // 只有庫存文案顯示
        if (this.configsetting.product_stock_setting === 2) {
          let target = columns.filter(x => x.dataIndex === 'quantity')[0]
          if (target) {
            target.dataIndex = 'inventory_status'
            target.scopedSlots = {customRender: 'inventory_status'}
            target.title = '庫存功能'
          }
        }
        return columns
      },
    },
    methods: {
      handleChange(value, key, column) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target[column] = value
          this.data = newData
        }
      },
      edit(key) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        this.editingKey = key
        if (target) {
          target.editable = true
          this.data = newData
        }
      },
      save(key) {
        const newData = [...this.data]
        const newCacheData = [...this.cacheData]
        const target = newData.filter(item => key === item.key)[0]
        const targetCache = newCacheData.filter(item => key === item.key)[0]
        if (target && targetCache) {
          delete target.editable
          this.data = newData
          Object.assign(targetCache, target)
          this.cacheData = newCacheData
        }
        this.editingKey = ''
        this.$emit('onChange')
      },
      cancel(key) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        this.editingKey = ''
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
          delete target.editable
          this.data = newData
        }
      },
    }
  }
</script>

<style scoped>

</style>


