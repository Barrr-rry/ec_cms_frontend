<template>
  <c-drawer v-model="input" title="進階篩選"
            @ok="submitHandler"
  >
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="回饋金點數">
        <div class="row">
          <a-form-item>
            <a-input
              class="col-4"
              :disabled="!editPermission()"
              v-decorator="['reward_lower', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
              placeholder="0"
            />
          </a-form-item>
          點 ～
          <a-form-item>
            <a-input
              class="col-4"
              :disabled="!editPermission()"
              v-decorator="['reward_upper', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
              placeholder="100"
            />
          </a-form-item>
          點
        </div>
      </c-form-item>
      <h3>{{'時間區間篩選'}}</h3>
      <c-form-item>
        <a-range-picker
          style="padding-left: 90px"
          class="col-11"
          v-decorator="['range_date', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
          :disabled="!editPermission()"
        />
        內
      </c-form-item>
      <c-form-item label="消費金額">
        <div class="row">
          <a-form-item>
            <a-input
              class="col-4"
              :disabled="!editPermission()"
              v-decorator="['money_lower', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
              placeholder="0"
            />
          </a-form-item>
          元 ～
          <a-form-item>
            <a-input
              class="col-4"
              :disabled="!editPermission()"
              v-decorator="['money_upper', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
              placeholder="100"
            />
          </a-form-item>
          元
        </div>
      </c-form-item>
      <c-form-item label="消費次數">
        <div class="row">
          <a-form-item>
            <a-input
              class="col-4"
              :disabled="!editPermission()"
              v-decorator="['order_count_lower', { rules: [
                  { required: false, message: '請輸入資料' },
                  ]}]"
              placeholder="0"
            />
          </a-form-item>
          次 ～
          <a-form-item>
            <a-input
              class="col-4"
              :disabled="!editPermission()"
              v-decorator="['order_count_upper', { rules: [
                  { required: false, message: '請輸入資料' },
                  ]}]"
              placeholder="100"
            />
          </a-form-item>
          次
        </div>
      </c-form-item>
    </a-form>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import momentMixin from "@/mixins/momentMixin"

  export default {
    mixins: [drawerMixin, momentMixin],
    props: {
      vm: {
        type: Object,
      }
    },
    data() {
      return {
        default_api: this.$api.member,
        update_field_keys: [],
        // for check to add
        // fake_data: {}
      }
    },
    methods: {
      editPermission() {
        return this.permissioncheck('permission_member_manage', 1)
      },
      updateValueTransfer(values) {
        for (let key in values) {
          if (values[key] === undefined || values[key] === null) {
            delete values[key]
          }
        }
        // moment 轉成date str 格式
        if (values.range_date) {
          values.start_date = this.toDateStr(values.range_date[0])
          values.end_date = this.toDateStr(values.range_date[1])
          delete values.range_date
        }
        return values
      },
      createHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.updateValueTransfer(values)

          this.vm.params = {offset: 0, limit: 10, ...values}
          this.vm.initData()
          this.$message.success('查詢成功')
          this.input = false
        })

      },
    }
  }
</script>

<style scoped>
</style>
