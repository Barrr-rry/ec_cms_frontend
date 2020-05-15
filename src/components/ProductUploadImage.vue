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
      return {
        default_api: this.$api.product,
      }
    },
    computed: {},
    methods: {
      editPermission() {
        return this.permissioncheck('permission_product_manage', 2)
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
