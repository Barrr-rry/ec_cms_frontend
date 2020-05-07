<template>
  <c-drawer v-model="input" title="重設密碼"
            @ok="submitHandler"
  >
    <a-form
      :form="form"
      @submit="submitHandler"
    >
      <c-form-item label="密碼">
        <a-input-password
          v-decorator="['password', { rules: [
                { validator: validatePassword },
                { required: true, message: '請輸入資料' },
                ]}]" type="password"
          placeholder="請輸入 6 - 12 個英數混合密碼"
        />
      </c-form-item>
      <c-form-item label="確認密碼">
        <a-input-password
          v-decorator="['passwordConfirm', { rules: [
                { validator: validateConfirmPassword },
                { required: true, message: '請輸入資料' },
                ]}]" type="password"
          placeholder="請再次輸入密碼"
        />
      </c-form-item>
    </a-form>
  </c-drawer>

</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import {mapState} from 'vuex'

  export default {
    mixins: [drawerMixin],
    props: {},
    data() {
      return {
        default_api: this.$api.manager,
        // for check to add
        // fake_data: {
        //   permission: 3,
        //   cn_name: "sdfsdf",
        //   en_name: "sdfdsfsd",
        //   email: "dsfsdf@conquers.co",
        //   password: "a123456",
        // }
      }
    },
    computed: {
      ...mapState('permission', {
        permissions: state => state.items
      })
    },
    methods: {
      submitHandler(e) {
        this.updateHandler(e)
      },
      apiSuccessHandler() {
        this.input = false
        this.initCallback()
        this.$message.success('重設密碼成功')
      },
    }
  }
</script>

<style scoped>
</style>
