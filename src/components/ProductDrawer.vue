<template>
  <c-drawer v-model="input" :title="type==='create'?'新增商品內容':'編輯商品內容'"
            @ok="submitHandler"
            :displayDelete="type!=='create'"
            @delete="deleteHandler"
  >
    <h3>{{type==='create'?'新增商品內容':'編輯商品內容'}}</h3>
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
      <c-form-item label="庫存狀況 ">
        <a-radio-group v-decorator="['inventory_status',{rules:[],initialValue:1}]"
                       :disabled="!editPermissioncheck()"
        >
          <a-radio :value="1">
            有庫存
          </a-radio>
          <a-radio :value="2">
            無庫存
          </a-radio>
          <a-radio :value="3">
            預購品
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="商品副標題">
        <a-input
          v-decorator="['sub_title']"
          placeholder="商品副標題"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="商品售價">
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
      <c-form-item label="商品原價">
        <a-input
          v-decorator="['fake_price']"
          placeholder="商品原價"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="商品重量">
        <a-input
          v-decorator="['weight',{
          rules: [
            { required: true, message: '請新增資料' },
            ] }]"
          type="number"
          placeholder="單位: 公斤"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="商品規格">
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
      <c-form-item label="上傳主要圖片"
                   extra="圖片建議上傳尺寸 500 px x 500 px ， 格式 .jpg .png .svg"
      >
        <c-upload
          ref="uploads"
          :type="type"
          v-decorator="[
          'main_productimage',
          {
            ...mixinUpload,
            rules:[
            { required: true, message: '請選擇標籤' },
            ]
          },

          ]"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="上傳圖片"
                   extra="圖片建議上傳尺寸 500 px x 500 px ， 格式 .jpg .png .svg"
      >
        <c-upload
          ref="uploads"
          :type="type"
          :multiple=true
          v-decorator="[
          'productimages',
          {
            ...mixinMultipleUpload,
          },

          ]"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
    </a-form>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import uploadMixin from "@/mixins/uploadMixin"
  import {mapState} from "vuex";

  export default {
    mixins: [drawerMixin, uploadMixin],
    data() {
      return {
        update_field_keys: ['name', 'brand', 'inventory_status', 'sub_title',
          'price', 'fake_price', 'weight', 'tag',
          'category'],
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
      })
    },
    methods: {
      displayRender({labels}) {
        return labels[labels.length - 1];
      },
      createValueTransfer(values) {
        let ret = {...values}
        if (Array.isArray(ret.specifications)) {
          ret.specifications = ret.specifications.map(name => {
            return {
              name
            }
          })
        }
        let productimages = []
        if (ret.productimages) {
          for (let image of ret.productimages) {
            productimages.push({
              image_url: image,
              main_image: false,
            })
          }
        }
        if (ret.main_productimage) {
          productimages.push({
            image_url: ret.main_productimage,
            main_image: true,
          })
        }
        ret.productimages = productimages
        if (ret.tag) {
          let tag = ret.tag.map(el => this.tag_reverse_mapping[el])
          ret.tag = tag
        } else {
          ret.tag = []
        }
        if (!ret.category) {
          ret.category = []
        }

        return ret
      },
      initData() {
        this.$store.dispatch('brand/firstInitList')
        this.$store.dispatch('tag/firstInitList')
        this.$store.dispatch('category/firstInitList')
      },
      initFields() {

        let obj = {
          specifications: [],
          productimages: [],
          main_productimage: null,
        }
        for (let el of this.item.productimages) {
          if (el.main_image) {
            obj.main_productimage = el.image_url
          } else {
            obj.productimages.push(el.image_url)
          }
        }
        for (let el of this.item.specifications) {
          obj.specifications.push(el.name)
        }

        for (let key of this.update_field_keys) {
          obj[key] = this.item[key]
        }
        obj.tag = obj.tag.map((el) => {
          return this.tag_mapping[el]
        })

        this._initFileds(obj)
      },
      deleteHandler(callback, err) {
        return this.defaultThenProcess(
          this.default_api.deleteData(this.item.id).then(() => {
            callback()
            this.$message.success('刪除商品成功')
          })
        )


      },
      updateHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.updateValueTransfer(values)
          return this.defaultThenProcess(this.default_api.putData(this.item.id, values).then(() => {
            this.$message.success('更新商品成功')
          }))
        })

      },
      createHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.createValueTransfer(values)
          return this.defaultThenProcess(this.default_api.postData(values).then(() => {
            this.$message.success('新增商品成功')
          }))
        })
      },
    }
  }
</script>

<style scoped>
</style>
