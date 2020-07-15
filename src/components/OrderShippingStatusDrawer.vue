<template>
  <c-drawer v-model="input" title="自行出貨"
            @ok="submitHandler"
            okText="確 定 出 貨"
  >
    <h3>出貨內容</h3>
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="出貨單號">
        <a-input
          v-decorator="['all_pay_logistics_id', { rules: [
            { required: true, message: '請輸入出貨單號' },
            ]}]"
          placeholder="請輸入出貨單號"
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
        update_field_keys: ['all_pay_logistics_id'],
        default_api: this.$api.order,
        // for check to add
        // fake_data: {}
      }
    },
    computed: {},
    methods: {
      updateValueTransfer(values) {
        values.shipping_status = 2
        return values
      },
    }
  }
</script>

<style scoped>
</style>
