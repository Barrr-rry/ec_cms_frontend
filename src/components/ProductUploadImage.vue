<template>
  <a-card title="上傳商品圖片">
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="上傳主要圖片"
                   extra="圖片建議上傳尺寸 500 px x 500 px ， 格式 .jpg .png .svg"
      >
        <c-upload
          ref="uploads"
          :multiple="false"
          v-decorator="[
          'main_productimage',
          {
            ...mixinUpload,
            rules:[
            { required: true, message: '請選擇圖片' },
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
      <c-form-item
        v-for="el in specifications_image"
        :key="el.key"
        :label="el.cn_name"
        extra="圖片建議上傳尺寸 500 px x 500 px ， 格式 .jpg .png .svg"
      >
        <c-upload
          ref="uploads"
          :type="type"
          v-decorator="[
          `specifications_image_${el.key}`,
          {
            ...mixinUpload,
            rules:[
            { required: false, message: '請選擇圖片' },
            ]
          },

          ]"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
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
      specifications_image: {
        type: Array,
        default: () => []
      },
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
        is_first_init: true,
        last_obj: null,
      }
    },
    watch: {
      'specifications_image.length'() {
        let obj = {}
        for (let el of this.specifications_image) {
          let target = null
          let key = `specifications_image_${el.key}`
          // 第一次init 且有資料
          if (this.is_first_init && this.item) {
            target = this.item.productimages.filter(x => x.specification === el.id)[0]
          }
          let image_url = this.form.getFieldValue(key)
          if (image_url) {
            target = {
              image_url
            }
          }
          if (target) {
            obj[key] = target.image_url
          } else {
            obj[key] = null
          }
        }
        this.is_first_init = false
        this.last_obj = obj
        this.$nextTick(() => {
          this.form.setFieldsValue(obj)
        })
      }
    },
    computed: {},
    methods: {
      createHandler(e) {
        return new Promise((resolve, reject) => {
          this.submitValidate(e, (values) => {
            values = this.removeBlankValue(values)
            values = this.createValueTransfer(values)
            resolve(values)
          }).catch(() => {
            reject()
          })
        })
      },
      updateHandler(e) {
        return new Promise((resolve, reject) => {
          this.submitValidate(e, (values) => {
            values = this.removeBlankValue(values)
            values = this.updateValueTransfer(values)
            resolve(values)
          }).catch(() => {
            reject()
          })
        })

      },
      editPermission() {
        return this.permissioncheck('permission_product_manage', 2)
      },
      createValueTransfer(values) {
        let data = []
        if (values.productimages) {
          for (let productimage of values.productimages) {
            data.push(
              {
                "main_image": false,
                "image_url": productimage,
              }
            )
          }
        }
        if (values.main_productimage) {
          data.push(
            {
              "main_image": true,
              "image_url": values.main_productimage,
            }
          )
        }
        for (let el of this.specifications_image) {
          data.push({
            "main_image": false,
            "specification_cn_name": el.cn_name,
            "specification_en_name": el.en_name,
            "image_url": values[`specifications_image_${el.key}`],
          })
        }
        return {
          productimages: data
        }
      },
      initFields() {

        let obj = {
          productimages: [],
          main_productimage: null,
        }

        for (let el of this.item.productimages) {
          if (el.main_image) {
            obj.main_productimage = el.image_url
          } else {
            if (!el.specification) {
              obj.productimages.push(el.image_url)
            }
          }
        }

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
