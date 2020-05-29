<template>
  <c-drawer v-model="input" title="進階篩選"
            @ok="submitHandler"
  >
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="回饋金點數">
        <a-input
          class="col-4"
          :disabled="!editPermission()"
          v-decorator="['reward_upper', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
          placeholder="0"
        />
        點 ～
        <a-input
          class="col-4"
          :disabled="!editPermission()"
          v-decorator="['reward_lower', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
          placeholder="100"
        />
        點
      </c-form-item>
      <h3>{{'時間區間篩選'}}</h3>
      <c-form-item>
        <a-range-picker
          style="padding-left: 90px"
          class="col-11"
          :disabled="!editPermission()"
        />
        內
      </c-form-item>
      <c-form-item label="消費金額">
        <a-input
          class="col-4"
          :disabled="!editPermission()"
          v-decorator="['local', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
          placeholder="0"
        />
        元 ～
        <a-input
          class="col-4"
          :disabled="!editPermission()"
          v-decorator="['local', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
          placeholder="100"
        />
        元
      </c-form-item>
      <c-form-item label="消費次數">
        <a-input
          class="col-4"
          :disabled="!editPermission()"
          v-decorator="['local', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
          placeholder="0"
        />
        次 ～
        <a-input
          class="col-4"
          :disabled="!editPermission()"
          v-decorator="['local', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
          placeholder="100"
        />
        次
      </c-form-item>
    </a-form>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"

  export default {
    mixins: [drawerMixin],
    data() {
      return {
        default_api: this.$api.member,
        // for check to add
        // fake_data: {}
      }
    },
    methods: {
      editPermission() {
        return this.permissioncheck('permission_member_manage', 2)
      },
    }
  }
</script>

<style scoped>
</style>
