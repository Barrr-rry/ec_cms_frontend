<template>
  <c-drawer v-model="input" :title="type==='create'?'新增子分類內容':'編輯分類內容'"
            @ok="submitHandler"
            :displayDelete="category_delete_status"
            @delete="deleteHandler"
  >
    <h3>{{type==='create'?'新增子分類內容':'編輯分類內容'}}</h3>
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="請輸入分類中文名稱">
        <a-input
          v-decorator="['name', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="請輸入分類名稱"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="請輸入分類英文名稱">
        <a-input
                v-decorator="['en_name']"
                placeholder="請輸入分類名稱"
                :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="上傳圖標"
                   v-if="main_category||(item&&item.main_category)"
      >
        <c-upload
          ref="uploads"
          v-decorator="[
          'image_url',
          mixinUpload,
          ]"
          :type="type"
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
    props: {
      main_category: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        update_field_keys: ['name', 'en_name', 'image_url'],
        default_api: this.$api.category,
        // for check to add
        // fake_data: {}
      }
    },
    computed: {
      category_delete_status() {
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
      createValueTransfer(values) {
        if (this.main_category) {
          values.main_category = this.main_category
        }
        return values
      },
      getName() {
        return '分類'
      },
      deleteHandler(callback, err) {
        return this.defaultThenProcess(
                this.default_api.deleteData(this.item.id).then(() => {
                  callback()
                  this.$message.success('刪除分類成功')
                })
        )


      },
    }
  }
</script>

<style scoped>
</style>
