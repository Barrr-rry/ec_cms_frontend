<template>
  <c-drawer v-model="input" :title="type==='create'?'新增品牌內容':'編輯品牌內容'"
            @ok="submitHandler"
            :displayDelete="brand_delete_status"
            @delete="deleteHandler"
  >
    <h3>{{type==='create'?'新增品牌內容':'編輯品牌內容'}}</h3>
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="品牌英文名稱">
        <a-input
          v-decorator="['en_name', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="品牌英文名稱"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="品牌中文名稱">
        <a-input
          v-decorator="['cn_name']"
          placeholder="品牌中文名稱"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="顯示在首頁">
        <a-radio-group v-decorator="['index',{rules:[],initialValue:true}]" :disabled="!editPermissioncheck()"
        >
          <a-radio :value="true">
            是
          </a-radio>
          <a-radio :value="false">
            否
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="顯示在目錄">
        <a-radio-group v-decorator="['menu',{rules:[],initialValue:true}]" :disabled="!editPermissioncheck()"
        >
          <a-radio :value="true">
            是
          </a-radio>
          <a-radio :value="false">
            否
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="上傳品牌圖標"
                   extra="圖片建議上傳尺寸 65 px x 55 px ， 格式 .jpg .png .svg"
      >
        <c-upload
          ref="uploads"
          :type="type"
          v-decorator="[
          'image_url',
          {
            ...mixinUpload,
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

  export default {
    mixins: [drawerMixin, uploadMixin],
    data() {
      return {
        update_field_keys: ['en_name', 'cn_name', 'index', 'menu', 'image_url'],
        default_api: this.$api.brand,
        // for check to add
        // fake_data: {}
      }
    },
    computed: {
      brand_delete_status() {
        let ret = true
        let item = this.item

        if (!item) {
          ret = false
          return ret
        }
        if ((item.children && item.children.length) || item.has_product) {
          ret = false
        }
        return ret
      }
    },
    methods: {
      deleteHandler(callback, err) {
        return this.defaultThenProcess(
                this.default_api.deleteData(this.item.id).then(() => {
                  callback()
                  this.$message.success('刪除品牌分類成功')
                })
        )


      },
      updateHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.updateValueTransfer(values)
          return this.defaultThenProcess(this.default_api.putData(this.item.id, values).then(() => {
            this.$message.success('更新品牌分類成功')
          }))
        })

      },
      createHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.createValueTransfer(values)
          return this.defaultThenProcess(this.default_api.postData(values).then(() => {
            this.$message.success('新增品牌分類成功')
          }))
        })
      },
    }
  }
</script>

<style scoped>
</style>
