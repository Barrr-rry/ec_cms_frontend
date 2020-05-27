<template>
  <c-drawer v-model="input" title="新增買就送活動商品"
            @ok="okHandler"
  >
    <h3>搜尋並加入</h3>
    <a-form
      :form="search_form"
      layout="inline"
      @submit="submitForm"
      class="row w-100"
    >
      <div class="col-12">
        <c-form-item label="選擇分類" class="w-100">
          <a-tree-select
            placeholder="請選擇分類"
            allowClear
            :maxTagCount="3"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            multiple
            treeDefaultExpandAll
            v-decorator="['category_ids', {
          initialValue:null,
          rules: [
            { required: false, message: '請選擇分類' },
            ] }]"
            :disabled="!editPermissioncheck()"
          >
            <a-tree-select-node :value="c1.value" :title="c1.label" :key="c1.fake_id"
                                v-for="c1 of categories"
            >
              <template v-if="c1.children">
                <a-tree-select-node :value="c2.value" :title="c2.label" :key="c2.fake_id"
                                    v-for="c2 of c1.children"
                                    :disabled="c2.children&&c2.children.length>0"
                >
                  <template v-if="c2.children">
                    <a-tree-select-node :value="c3.value" :title="c3.label" :key="c3.fake_id"
                                        v-for="c3 of c2.children"
                                        :disabled="c3.children&&c3.children.length>0"
                    ></a-tree-select-node>
                  </template>
                </a-tree-select-node>
              </template>
            </a-tree-select-node>
          </a-tree-select>
        </c-form-item>
      </div>

      <div class="col-12 row">
        <a-form-item label="快速查詢商品" class="col-8 mr-0px">
          <a-input
            v-decorator="['keywords', { rules: [
            ]}]"
            placeholder="請輸入商品編號、商品名稱"
            style="width: 250px"
          />
        </a-form-item>

        <div class="col-4 d-flex justify-content-end">
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
      </div>
    </a-form>
    <a-table :columns="columns" :dataSource="items"
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
      }),
      ...mapState('category', {
        flat_categories: state => {
          let ret = []

          function get_objects(items) {
            for (let item of items) {
              ret.push(item)
              if (item.sub_categories && item.sub_categories.length) {
                get_objects(item.sub_categories)
              }
            }
          }

          get_objects(state.items)
          return ret
        },
        categories: state => {
          let fake_id = 0

          function get_objects(items) {
            let ret = []
            for (let item of items) {
              let obj = {
                label: item.name,
                value: item.id,
                fake_id: fake_id++,
              }
              if (item.sub_categories && item.sub_categories.length) {
                let children = get_objects(item.sub_categories)
                obj.children = children
              }
              ret.push(obj)
            }
            return ret
          }

          return get_objects(state.items)
        }
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
    },
    mounted() {
      this.$store.dispatch('category/getList')
    }
  }
</script>

<style scoped>
</style>
