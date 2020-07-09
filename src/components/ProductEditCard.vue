<template>
  <a-card title="商品基本資訊">
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="商品名稱">
        <a-input
          v-decorator="['name', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="商品名稱"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="選擇品牌">
        <a-select
          v-decorator="['brand', {
          initialValue:brands.length?brands[0].id:null,
          rules: [
            { required: true, message: '請選擇品牌' },
            ] }]"
          placeholder="請新增品牌"
          :disabled="!editPermissioncheck()"
        >
          <a-select-option :value="brand.id" :key="brand.id" v-for="brand of brands">
            {{brand.en_name}}
          </a-select-option>
        </a-select>
      </c-form-item>
      <c-form-item label="選擇活動" v-show="configsetting.activity">
        <a-select
          v-decorator="['activity', {
          rules: [
            { required: false, message: '請選擇品牌' },
            ] }]"
          placeholder="請選擇活動"
          :disabled="!editPermissioncheck()"
        >
          <a-select-option :value="activity.id" :key="activity.id" v-for="activity of activity_list">
            {{activity.ch_name}}
          </a-select-option>
        </a-select>
      </c-form-item>
      <c-form-item label="排序順序">
        <a-input
          v-decorator="['order', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="排序順序"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="庫存數量"
                   v-if="configsetting.product_stock_setting===3&&configsetting.product_specifications_setting===1"
      >
        <a-input
          v-decorator="['quantity', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="庫存數量"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="庫存功能"
                   v-if="configsetting.product_stock_setting===2&&configsetting.product_specifications_setting===1"
      >
        <a-select
          :disabled="!editPermissioncheck()"
          v-decorator="['inventory_status', {
          initialValue:1,
          rules: [
            { required: true, message: '請選擇庫存' },
            ] }]"
          placeholder="請選擇庫存"
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
      </c-form-item>
      <c-form-item label="商品副標題">
        <a-input
          v-decorator="['sub_title']"
          placeholder="商品副標題"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="商品售價"
                   v-if="configsetting.product_specifications_setting===1"
      >
        <a-input
          v-decorator="['price',{
          rules: [
            { required: true, message: '請新增資料' },
            ] }]"
          type="number"
          placeholder="商品售價"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="商品原價"
                   v-if="configsetting.product_specifications_setting===1"
      >
        <a-input
          v-decorator="['fake_price']"
          placeholder="商品原價"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="商品重量" v-if="configsetting.weight&&configsetting.product_specifications_setting===1"
      >
        <a-input
          v-decorator="['weight',{
          rules: [
            { required: true, message: '請新增資料' },
            ] }]"
          type="number"
          placeholder="單位: 公斤"
          :disabled="!editPermissioncheck()"
          suffix="公斤"
        />
      </c-form-item>
      <c-form-item label="商品規格"
                   v-if="configsetting.product_specifications_setting===1"
      >
        <a-select
          mode="tags"
          placeholder="商品規格"
          v-decorator="[
                          'specifications',
                          { rules:
                                [
                                    { required: true, message: '請输入規格' }
                                ],
                            initialValue: ['一般']
                          }
                        ]"
          :disabled="!editPermissioncheck()"
        >
        </a-select>
      </c-form-item>
      <c-form-item label="自定義標籤">
        <a-select
          mode="tags"
          v-decorator="['tag', {
                rules: [
                  ] }]"
          placeholder="請新增標籤"
          :disabled="!editPermissioncheck()"
        >
          <a-select-option :value="tag.name" :key="tag.id" v-for="tag of tags">
            {{tag.name}}
          </a-select-option>
        </a-select>
      </c-form-item>
      <c-form-item label="選擇分類">
        <a-tree-select
          placeholder="請選擇分類"
          allowClear
          :maxTagCount="3"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          multiple
          treeDefaultExpandAll
          v-decorator="['category', {
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
    </a-form>
  </a-card>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import uploadMixin from "@/mixins/uploadMixin"
  import configsettingMixin from "@/mixins/configsettingMixin"
  import {mapState} from "vuex"

  export default {
    mixins: [configsettingMixin, drawerMixin, uploadMixin],
    data() {
      return {
        update_field_keys: ['name', 'brand', 'order', 'sub_title', 'tag', 'category', 'activity'],
        default_api: this.$api.product,
        // for check to add
        // fake_data: {}
      }
    },
    computed: {
      ...mapState('brand', {
        brands(state) {
          let items = state.items
          let ret = []
          for (let item of items) {
            for (let child of item.children) {
              ret.push(child)
            }
          }

          return ret
        }
      }),
      ...mapState('tag', {
        tags: state => state.items,
        tag_mapping: state => {
          let ret = {}
          for (let tag of state.items) {
            ret[tag.id] = tag.name
          }
          return ret
        },
        tag_reverse_mapping: state => {
          let ret = {}
          for (let tag of state.items) {
            ret[tag.name] = tag.id
          }
          return ret
        },
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
      }),
      ...mapState('activity', {
        activity_list: state => state.items,
      }),
    },
    methods: {
      createHandler(e) {
        return new Promise((resolve) => {
          this.submitValidate(e, (values) => {
            values = this.removeBlankValue(values)
            values = this.createValueTransfer(values)
            resolve(values)
          })
        })
      },
      updateHandler(e) {
        return new Promise((resolve) => {
          this.submitValidate(e, (values) => {
            values = this.removeBlankValue(values)
            values = this.updateValueTransfer(values)
            resolve(values)
          })
        })

      },
      createValueTransfer(values) {
        let ret = {...values}
        if (ret.tag) {
          let tag = ret.tag.map(el => this.tag_reverse_mapping[el])
          ret.tag = tag
        } else {
          ret.tag = []
        }
        if (!ret.category) {
          ret.category = []
        }
        if (this.configsetting.product_specifications_setting === 1) {

          // init specification 資料
          let specification_level1 = []
          let specifications_detail_data = []
          for (let spec of values.specifications) {
            specification_level1.push({
              name: spec
            })
            let detail = {
              level1_spec: spec,
            }
            for (let key of ['weight', 'price', 'fake_price', 'quantity', 'inventory_status']) {
              if (values.hasOwnProperty(key)) {
                detail[key] = values[key]
              }
            }
            specifications_detail_data.push(detail)
          }
          ret.specification_level1 = specification_level1
          ret.specifications_detail_data = specifications_detail_data
        }

        return ret
      },
      initFields() {
        let obj = {}
        if (this.configsetting.product_specifications_setting === 1) {
          obj = {
            specifications: [],
            // for loop to get
            price: null,
            fake_price: null,
          }
          // 確認weight 有加入
          if (this.configsetting.weight) {
            obj.weight = null
          }
          // 確認quantity
          if (this.configsetting.product_stock_setting === 3) {
            obj.quantity = null
          }
          // 確認inventory_status
          if (this.configsetting.product_stock_setting === 2) {
            obj.inventory_status = null
          }
          // 規格1 把price 這些欄位帶入
          for (let spec of this.item.specifications_detail) {
            obj.price = spec.price
            obj.fake_price = spec.fake_price
            obj.quantity = spec.quantity
            if (this.configsetting.weight) {
              obj.weight = spec.weight
            }
            if (this.configsetting.product_stock_setting === 3) {
              obj.quantity = spec.quantity
            }
            if (this.configsetting.product_stock_setting === 2) {
              obj.inventory_status = spec.inventory_status
            }
          }

          // 規格1 只會有一個規格
          for (let el of this.item.specifications) {
            if (el.level === 1) {
              obj.specifications.push(el.name)
            }
          }
        }

        for (let key of this.update_field_keys) {
          obj[key] = this.item[key]
        }
        obj.tag = obj.tag.map((el) => {
          let ret = this.tag_mapping[el]
          return ret
        })
        this._initFileds(obj)
      },
    },
    mounted() {
      if (this.item) {
        this.initFields()
      }
    }
  }
</script>

<style scoped>
</style>
