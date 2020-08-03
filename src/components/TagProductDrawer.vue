<template>
  <c-drawer v-model="input" title="新增自定義標籤商品"
            @ok="okHandler"
  >
    <h3>搜尋並加入</h3>
    <a-form
      :form="search_form"
      layout="inline"
      @submit="submitForm"
    >
      <a-form-item label="快速查詢商品">
        <a-input
          v-decorator="['keywords', { rules: [
            ]}]"
          placeholder="請輸入商品編號、商品名稱"
          style="width: 200px"
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
    <a-table :locale="{emptyText:'目前無資料'}" :columns="columns" :dataSource="items"
             :loading="loading"
             :pagination="pagination"
             @change="handleChangePage"
             :rowKey="record => record.id"
             :rowSelection="{selectedRowKeys: selected_row_keys, onChange: onSelectChange}"
    >
    </a-table>
  </c-drawer>
</template>

<script>
  import pageMixin from "@/mixins/pageMixin"
  import vModel from "@/mixins/vModel"
  import {mapState} from 'vuex'
  import searchFormMixin from "@/mixins/searchFormMixin"
  import tablePageMixin from "@/mixins/tablePageMixin"

  let columns = [
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
    },
  ]
  let table_name = 'product'
  export default {
    mixins: [searchFormMixin, vModel, pageMixin, tablePageMixin],
    data() {
      return {
        columns,
        loading: true,
        table_name,
        params: {
          limit: 10,
          offset: 0,
          no_tag: true,
        }

      }
    },
    computed: {
      ...mapState(table_name, {
        items: state => state.items,
        raw_data: state => state.raw_data
      })
    },
    methods: {
      submitForm(val) {
        this.submit(val)
        this.selected_row_keys = []
      },
      okHandler() {
        let products = this.items.filter(item => this.selected_row_keys.includes(item.id))
        this.$emit('ok', products)
        this.input = false
      },
    }
  }
</script>

<style scoped>
</style>
