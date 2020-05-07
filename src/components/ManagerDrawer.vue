<template>
  <!--    todo user_info-->
  <c-drawer v-model="input" :title="type==='create'?'新增管理帳號':'修改管理帳號'"
            @ok="submitHandler"
            :displayDelete="type!=='create'&&editPermission()"
            @delete="deleteHandler"
  >
    <h3>{{type==='create'?'新增管理帳號':'修改管理帳號'}}</h3>
    <a-form
      :form="form"
      @submit="submitHandler"
    >
      <c-form-item label="選擇權限">
        <a-select
          :disabled="!editPermission()"
          v-decorator="['permission', {
          initialValue:permissions.length?permissions[0].id:null,
          rules: [
            { required: true, message: '請選擇權限' },
            ] }]"
          placeholder="請新增權限"
        >
          <a-select-option :value="permission.id" :key="permission.id" v-for="permission of permissions">
            {{permission.name}}
          </a-select-option>
        </a-select>
      </c-form-item>
      <c-form-item label="中文姓名">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['cn_name', { rules: [
            { required: true, message: '請輸入中文姓名' },
            ] }]"
          placeholder="請輸入中文姓名"
        />
      </c-form-item>
      <c-form-item label="英文姓名">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['en_name', { rules: [
            { required: false, message: '請輸入英文姓名' },
            { validator: validateEnglish }
            ] }]"
          placeholder="請輸入英文姓名"
        />
      </c-form-item>
      <c-form-item label="帳號（ 信箱 ）">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['email', { rules: [
                { required: true, message: '請輸入帳號' },
                { type: 'email', message: '請輸入正確 Email 格式' }
                ] }]"
          placeholder="請輸入 E-mail （  登入帳號 ）"
        />
      </c-form-item>
      <c-form-item label="密碼" v-if="type==='create'">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['password', { rules: [
            { required: true, message: '請輸入密碼' },
            { validator: validatePassword }
            ]}]" type="password"
          placeholder="請輸入 6 - 12 個英數混合密碼"
        />
      </c-form-item>
      <c-form-item label="內部備註">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['remarks', { rules: [] }]" type="textarea"
          placeholder="請輸入備註（ 選填 ）"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </c-form-item>
      <c-form-item label="啟用狀態">
        <a-radio-group v-decorator="['status',{rules:[],initialValue:true}]"
                       :disabled="!editPermission()"
        >
          <a-radio :value="true">
            啟用
          </a-radio>
          <a-radio :value="false">
            停用
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="密碼" v-if="type==='update'">
        <a href="#" @click="callbackCheck(()=>update_drawer=true,editPermission())">重設密碼</a>
      </c-form-item>
    </a-form>
    <password-drawer
      v-if="type==='update'"
      v-model="update_drawer"
      :initCallback="initData"
      :item="item"
    ></password-drawer>

  </c-drawer>

</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import {mapState} from 'vuex'
  import PasswordDrawer from "@/components/PasswordDrawer"

  export default {
    mixins: [drawerMixin],
    components: {
      PasswordDrawer,
    },
    data() {
      return {
        update_drawer: false,
        update_field_keys: [
          'permission', 'cn_name', 'en_name', 'email', 'remarks', 'status'
        ],
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
      editPermission(){
        return this.permissioncheck('permission_role_manage',2)
      },
      initData() {
        this.$store.dispatch('permission/firstInitList')
      },
      deleteHandler(callback, err) {
        return this.defaultThenProcess(
                this.default_api.deleteData(this.item.id).then(() => {
                  callback()
                  this.$message.success('刪除帳號成功')
                })
        )


      },
      updateHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.updateValueTransfer(values)
          return this.defaultThenProcess(this.default_api.putData(this.item.id, values).then(() => {
            this.$message.success('更新帳號成功')
          }))
        })

      },
      createHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.createValueTransfer(values)
          return this.defaultThenProcess(this.default_api.postData(values).then(() => {
            this.$message.success('新增帳號成功')
          }))
        })
      },
    }
  }
</script>

<style scoped>
</style>
