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
      <!--      <c-form-item label="規格圖片"-->
      <!--                   extra="圖片建議上傳尺寸 500 px x 500 px ， 格式 .jpg .png .svg"-->
      <!--      >-->
      <!--        <c-upload-->
      <!--                ref="uploads"-->
      <!--                :type="type"-->
      <!--                :multiple=true-->
      <!--                v-decorator="[-->
      <!--          'productimages',-->
      <!--          {-->
      <!--            ...mixinMultipleUpload,-->
      <!--          },-->

      <!--          ]"-->
      <!--                :disabled="!editPermissioncheck()"-->
      <!--        />-->
      <!--      </c-form-item>-->
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
      return {}
    },
    computed: {},
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
      editPermission() {
        return this.permissioncheck('permission_product_manage', 2)
      },
      createValueTransfer(values) {
        let data = []
        for (let productimage of values.productimages) {
          data.push(
            {
              "main_image": false,
              "image_url": productimage,
            }
          )
        }
        if (values.main_productimage) {
          data.push(
            {
              "main_image": true,
              "image_url": values.main_productimage,
            }
          )
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
            obj.productimages.push(el.image_url)
          }
        }
        // todo
        // for (let el of this.item.specifications) {
        //   obj.specifications.push(el.name)
        // }
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
