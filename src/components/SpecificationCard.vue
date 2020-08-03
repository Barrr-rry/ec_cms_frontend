<template>
  <a-card :title="title">
    <div class="row">
      <c-form-item label="規格中文名稱" class="col-5">
        <a-input
                placeholder="規格中文名稱"
                :disabled="!editPermissioncheck()"
                v-model="cn_name"
        />
      </c-form-item>
      <c-form-item label="規格英文名稱" class="col-5">
        <a-input
                placeholder="規格英文名稱"
                :disabled="!editPermissioncheck()"
                v-model="en_name"
        />
      </c-form-item>
    </div>
    <a-button type="primary"
              @click="addToTable"
              class="mb-3 ml-1">
      + 新 增 項 目
    </a-button>
    <a-table :columns="columns" :data-source="data"
             :pagination="false"
             :rowKey="record => record.key"
             :locale="{emptyText:'目前無資料'}"
    >
      <template
        v-for="col in ['name', 'en_name']"
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
<!--      <template-->
<!--              v-for="col in ['en_name']"-->
<!--              :slot="col"-->
<!--              slot-scope="text, record"-->
<!--      >-->
<!--        <div :key="col">-->
<!--          <a-input-->
<!--                  v-if="record.editable"-->
<!--                  style="margin: -5px 0"-->
<!--                  :value="text"-->
<!--                  @change="e => handleChange(e.target.value, record.key, col)"-->
<!--          />-->
<!--          <template v-else>-->
<!--            {{ text }}-->
<!--          </template>-->
<!--        </div>-->
<!--      </template>-->
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
            <a-popconfirm title="確定刪除?" @confirm="() => remove(record.key)"
                          okText="確定" cancelText="取消"
            >
            <a :disabled="editingKey !== ''">刪除</a>
          </a-popconfirm>

        </span>
        </div>
      </template>
    </a-table>
  </a-card>
</template>

<script>
  const columns = [
    {
      title: '中文名稱',
      dataIndex: 'name',
      scopedSlots: {customRender: 'name'},
    },
    {
      title: '英文名稱',
      dataIndex: 'en_name',
      scopedSlots: {customRender: 'en_name'},
    },
    {
      width: '120px',
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]

  export default {
    name: "SpecificationCard",
    props: {
      item: {
        type: Object,
        default: null,
      },
      level: {
        type: Number,
        default: 1,
      }
    },
    data() {
      // init name
      let name = this.item ? this.item[`level${this.level}_title`] : null
      let en_name = this.item ? this.item[`level${this.level}_en_title`] : null
      // init spec data
      let key = 0
      let data = []
      if (this.item) {
        for (let el of this.item.specifications) {
          if (el.level === this.level) {
            el.key = key++
            data.push(el)
          }
        }
      }

      // 實際的資料
      this.cacheData = data.map(item => ({...item}))
      return {
        name,
        en_name,
        key,
        data,
        columns,
        editingKey: '',
      }
    },
    watch: {
      name() {
        this.$emit('onChange')
      },
      en_name() {
        this.$emit('onChange')
      }
    },
    computed: {
      title() {
        return this.level === 1 ? '商品規格一' : '商品規格二（選填）'
      }
    },
    methods: {
      addToTable() {
        let obj = {
          key: this.key++,
          name: '未輸入',
          en_name: '未輸入'
        }
        this.cacheData.push(obj)
        this.data.push(obj)
        this.$emit('onChange')
      },
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
      remove(key) {
        let newData = [...this.data]
        newData = newData.filter(x => x.key !== key)
        this.data = [...newData]
        this.cacheData = [...newData]
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


