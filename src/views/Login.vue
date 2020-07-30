<template>
  <a-layout class="h100vh l-login d-flex d-center">
    <div class="l-login-box">
      <div class="container-fluid to-flex-col align-items-center">
        <img class="l-login-box-logo mb-16px" src="/img/conquers_280x40px.svg" alt="">
        <h1 class="mb-24px">EC 後台管理系統</h1>
        <a-form :form="form" @submit="handleSubmit" class="w-100">
          <a-form-item>
            <a-input
              v-decorator="[
                'email',
                { rules: [
                { required: true, message: '請輸入帳號' },
                { type: 'email', message: '請輸入正確 Email 格式' }
                ] },
              ]"
              placeholder="帳號"
            >
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="[
                'password',
                { rules: [{ required: true, message: '請輸入密碼' }] },
              ]"
              type="password"
              placeholder="密碼"
            >
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button class="mt-24px" type="primary" html-type="submit" block>
              登入
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </a-layout>
</template>

<script>
  export default {
    data() {
      return {
        form: this.$form.createForm(this),
      }
    },
    methods: {
      handleSubmit(e) {
        if (e) {
          e.preventDefault()
        }
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$api.manager.login(values).then(() => {
              this.$router.push('/')
            }).catch((err) => {
              this.$message.error(err.response.data)
              this.form.setFieldsValue({password: null})
            })
          }

        })

      }
    }
  }
</script>
<style>
</style>