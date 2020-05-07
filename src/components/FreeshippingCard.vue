<template>
  <a-card :title="item.backstage_name">
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="設定運費">
        <a-input
          v-decorator="['price', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder=""
          style="width: 200px"
          type="number"
          :disabled="!editPermission()"
        />
      </c-form-item>
      <c-form-item label="設定免運金額">
        <a-input
          v-decorator="['role', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder=""
          style="width: 200px"
          type="number"
          :disabled="!editPermission()"
        />
      </c-form-item>
      <c-form-item label="免運規則標題">
        <a-input
          v-decorator="['title', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder=""
          :disabled="!editPermission()"
        />
      </c-form-item>
      <c-form-item label="設定使用規則">
        出貨商品總重量高於
        <a-input
          v-decorator="['weight', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder=""
          style="width: 100px"
          type="number"
          :disabled="!editPermission()"
        />
        公斤時不可使用
      </c-form-item>
      <div class="d-flex justify-content-end">
        <c-popover
          @ok="submitPopoup"
        >
          <template slot="content">
            <p>
              確定要更改嗎?
            </p>
          </template>
          <a-button class="mt-24px" type="primary" html-type="submit">
            更改
          </a-button>
        </c-popover>

      </div>
    </a-form>
  </a-card>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"

  export default {
    mixins: [drawerMixin],
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
          'title', 'role', 'weight', 'price'
        ],
        default_api: this.$api.freeshipping,
        // for check to add
        // fake_data: {}
      }
    },
    methods: {
      editPermission() {
        return this.permissioncheck('permission_coupon_manage', 2)
      },
      submitPopoup(callback) {
        this.submitHandler()
        callback()
      },
      initData() {
        this.initFields()
      }
    }
  }
</script>

<style scoped>
</style>
