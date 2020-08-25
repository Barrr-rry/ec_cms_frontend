<template>
  <c-drawer v-model="input" :title="type==='create'?'新增會員資料':'修改會員資料'"
            @ok="submitHandler"
            :displayDelete="type!=='create'&&editPermission
            ()"
            @delete="deleteHandler"
  >
    <h3>{{type==='create'?'新增會員資料':'修改會員資料'}}</h3>
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="目前回饋點數" v-if="item">
        <a href="#">{{item.returns}}</a> 點
      </c-form-item>
      <c-form-item label="會員編號" v-if="type!=='create'">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['member_number', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
          placeholder="請輸入會員編號"
        />
      </c-form-item>
      <c-form-item label="會員所在地">
        <!--        <a-input-->
        <!--                :disabled="!editPermission()"-->
        <!--                v-decorator="['local', { rules: [-->
        <!--            { required: true, message: '請輸入資料' },-->
        <!--            ]}]"-->
        <!--                placeholder="請輸入會員所在地"-->
        <!--        />-->
        <a-select
          v-decorator="['local', {
          rules: [
            { required: true, message: '請輸入資料' },
            ] }]"
          placeholder="請輸入會員所在地"
          :disabled="!editPermission()"
        >
          <a-select-option value="台灣" :key="1">
            台灣
          </a-select-option>
          <a-select-option value="海外" :key="2">
            海外
          </a-select-option>
        </a-select>
      </c-form-item>
      <c-form-item label="會員姓名">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['name', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="請輸入真實姓名"
        />
      </c-form-item>
      <c-form-item label="會員帳號（信箱）">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['account', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="請輸入Email"
        />
      </c-form-item>
      <c-form-item label="會員狀態">
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
      <c-form-item label="會員密碼"
                   v-if="type==='create'"
      >
        <a-input
          :disabled="!editPermission()"
          type="password"
          v-decorator="['password', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="請輸入6-12個英數混合密碼"
        />
      </c-form-item>
      <c-form-item label="LINE ID">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['line_id', { rules: [
          { required: false, message: '請輸入資料' },
            ]}]"
          placeholder="請輸入LINE ID"
        />
      </c-form-item>
      <c-form-item label="會員電話">
        <div class="row">
          <div class="col-3">
            <a-input
              :disabled="!editPermission()"
              placeholder="區碼"
              style="width: 100%"
              v-model="phone.area"
            />
          </div>
          <div class="col-6 p0">
            <a-input
              :disabled="!editPermission()"
              placeholder="電話"
              style="width: 100%"
              v-model="phone.local"
            />
          </div>
          <div class="col-3">
            <a-input
              :disabled="!editPermission()"
              placeholder="分機"
              style="width: 100%"
              v-model="phone.ext"
            />
          </div>
        </div>
      </c-form-item>
      <c-form-item label="會員手機">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['cellphone', { rules: [
          { required: true, message: '請輸入資料' },
          { validator: validateCellPhone }
            ]}]"
          placeholder="請輸入手機，格式（0912345678）"
        />
      </c-form-item>
      <c-form-item label="會員生日">
        <a-date-picker
          :format="dateFormat"
          :disabled="!editPermission()"
          v-decorator="['birthday', { rules: [
          { required: false, message: '請輸入資料' },
            ]}]"
          placeholder="請輸入生日"
        />
      </c-form-item>
      <c-form-item label="會員身材" class="row" v-show="item.hheight">
        身高:<a href="#">{{item.hheight}}</a>公分 /
        體重:<a href="#">{{item.wweight}}</a>公斤 /
        BMI:<a href="#">{{item.bbmi}}</a>
      </c-form-item>
      <c-form-item label="性別">
        <a-radio-group v-decorator="['gender',{rules:[],initialValue:true}]"
                       :disabled="!editPermission()"
        >
          <a-radio :value="1">
            男
          </a-radio>
          <a-radio :value="2">
            女
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="內部備註">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['remarks', { rules: [
            ]}]"
          placeholder="請輸入內部備註"
          :autosize="{ minRows: 2, maxRows: 6 }"
          type="textarea"
        />
      </c-form-item>
    </a-form>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import momentMixin from "@/mixins/momentMixin"

  export default {
    mixins: [drawerMixin, momentMixin],
    data() {
      return {
        dateFormat: 'YYYY-MM-DD',
        phone: {
          area: '',
          local: '',
          ext: ''
        },
        update_field_keys: [
          'member_number', 'name', 'account', 'local', 'line_id', 'phone', 'cellphone', 'status', 'remarks', 'birthday', 'wweight', 'hheight', 'bbmi', 'gender'],
        default_api: this.$api.member,
        // for check to add
        // fake_data: {}
      }
    },
    methods: {
      editPermission() {
        return this.permissioncheck('permission_member_manage', 2)
      },
      createValueTransfer(values) {
        let phone = ''
        if (this.phone.area && this.phone.local && this.phone.ext) {
          phone = `${this.phone.area}-${this.phone.local}#${this.phone.ext}`
        } else if (this.phone.area && this.phone.local) {
          phone = `${this.phone.area}-${this.phone.local}`
        } else if (this.phone.ext && this.phone.local) {
          phone = `${this.phone.local}#${this.phone.ext}`
        } else if (this.phone.local) {
          phone = `${this.phone.local}`
        } else {
          phone = ''
        }
        values.phone = phone
        values.birthday = this.toDateStr(values.birthday)
        return values
      },
      initFields() {
        let obj = {}
        for (let key of this.update_field_keys) {
          obj[key] = this.item[key]
        }
        try {
          let other = this.item.phone.split('-')
          obj.birthday = this.toMoment(obj.birthday)
          let area = other[0]
          other = other[1]
          other = other.split('#')
          let local = other[0]
          let ext = other[1]
          this.phone = {
            area,
            local,
            ext
          }
          // eslint-disable-next-line no-empty
        } catch (e) {

        }
        this._initFileds(obj)
      },
      deleteHandler(callback, err) {
        return this.defaultThenProcess(
          this.default_api.deleteData(this.item.id).then(() => {
            callback()
            this.$message.success('刪除會員成功')
          })
        )


      },
      updateHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.updateValueTransfer(values)
          return this.defaultThenProcess(this.default_api.putData(this.item.id, values).then(() => {
            this.$message.success('更新會員成功')
          }))
        })

      },
      createHandler(e) {
        this.submitValidate(e, (values) => {
          let phone = values.phone
          if (phone) {
            values.phone = `${phone.area}-${phone.local}#${phone.ext}`
          }
          values = this.removeBlankValue(values)
          values = this.createValueTransfer(values)
          return this.defaultThenProcess(this.default_api.postData(values).then(() => {
            this.$message.success('新增會員成功')
          }))
        })
      },
    }
  }
</script>

<style scoped>
</style>
