<template>
  <a-card title="上傳商品圖片">
    <a-form :form="form" @submit="submitHandler">
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
<!--      todo 規格功能還沒做-->
      <c-form-item label="規格圖片"
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
      <div class="d-flex justify-content-end">
        <c-popover
          @ok="submitPopoup"
        >
          <template slot="content">
            <p>
              確定要發布嗎?
            </p>
          </template>
          <a-button class="mt-24px" type="primary" html-type="submit">
            確 定 發 布
          </a-button>
        </c-popover>

      </div>
    </a-form>
  </a-card>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import uploadMixin from "@/mixins/uploadMixin"
  import {mapState} from "vuex";

  export default {
    mixins: [drawerMixin, uploadMixin],
    props: {
      title: {
        type: String,
        default: ''
      },
      item: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        update_field_keys: [
          'name', 'brand', 'sub_title', 'product_number', 'tag', 'category'
        ],
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
      editPermission() {
        return this.permissioncheck('permission_product_manage', 2)
      },
      submitPopoup(callback) {
        this.submitHandler()
        callback()
      },
      initData() {
        this.initFields()
        this.$store.dispatch('brand/firstInitList')
        this.$store.dispatch('tag/firstInitList')
        this.$store.dispatch('category/firstInitList')
      },
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
