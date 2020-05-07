<template>
  <c-drawer v-model="input" :title="type==='create'?'新增優惠券':'修改優惠券'"
            @ok="submitHandler"
            :displayDelete="type!=='create'"
            @delete="deleteHandler"
  >
    <h3>{{type==='create'?'新增優惠券':'修改優惠券'}}</h3>
    <a-form
      :form="form"
      @submit="submitHandler"
    >
      <c-form-item label="折價門檻">
        <a-input
          v-decorator="['role', { rules: [{ required: true, message: '請輸入資料' }] }]"
          type="number"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="折價方式">
        <a-radio-group v-decorator="['method',{rules:[],initialValue:method}]"
                       @change="changeMethod"
                       :disabled="!editPermissioncheck()"
        >
          <a-radio :value="1">
            元
          </a-radio>
          <a-radio :value="2">
            折扣 %
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="折價單位">
        <a-input
          :addonAfter="method===1?'元':'％'"
          v-decorator="['discount', { rules: [{ required: true, message: '請輸入資料' },
          { validator: validateDiscountUnit }
          ] }]"
          type="number"
          :placeholder="method===1?'請輸入折扣金額':'0 ~ 100 百分比'"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="優惠券標題">
        <a-input
          v-decorator="['title', { rules: [{ required: true, message: '請輸入資料' }] }]"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="優惠券序號">
        <a-input
          v-decorator="['discount_code', { rules: [{ required: true, message: '請輸入資料' }] }]"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="優惠券圖片"
                   extra="圖片建議上傳尺寸 340 px x 230 px ， 格式 .jpg .png .svg"
      >
        <c-upload
          ref="uploads"
          :type="type"
          v-decorator="[
          'image_url',
          { rules: [
            { required: true, message: '請輸入資料' },
            ],
            ...mixinUpload,
          },
          ]"
          :disabled="!editPermissioncheck()"
        />

      </c-form-item>
      <c-form-item label="啟用日期">
        <a-date-picker
          :disabled="!editPermissioncheck()"
          placeholder="啟用日期"
          v-decorator="['start_time', { rules: [
          { required: true, message: '請輸入資料' },
          { validator: validateStarttime }
          ] }]"></a-date-picker>
      </c-form-item>
      <c-form-item label="到期日期">
        <a-date-picker
          :disabled="!editPermissioncheck()"
          placeholder="到期日期"
          v-decorator="['end_time', { rules: [{ validator: validateEndtime },
          { required: true, message: '請輸入資料' }
          ] }]"
        ></a-date-picker>
      </c-form-item>
    </a-form>

  </c-drawer>

</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import uploadMixin from "@/mixins/uploadMixin"
  import momentMixin from "@/mixins/momentMixin"

  export default {
    mixins: [drawerMixin, uploadMixin, momentMixin],
    components: {},
    data() {
      return {
        update_drawer: false,
        update_field_keys: ['role', 'method', 'discount', 'title', 'discount_code', 'image_url', 'start_time', 'end_time'],
        default_api: this.$api.coupon,
        method: 1,
        start_time: null,
        end_time: null,
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
    methods: {
      changeMethod(e) {
        this.method = e.target.value
      },
      initFields() {
        let obj = {}
        for (let key in this.item) {
          if (!this.item.hasOwnProperty(key)) {
            continue
          }
          if (this.update_field_keys.includes(key)) {
            obj[key] = this.item[key]
          }
        }
        obj.start_time = this.toMoment(this.item.start_time)
        obj.end_time = this.toMoment(this.item.end_time)

        this.method = this.item.method
        this.start_time = obj.start_time
        this.end_time = obj.end_time

        this._initFileds(obj)
      },
      createValueTransfer(values) {
        values.start_time = this.toDateStr(values.start_time)
        values.end_time = this.toDateStr(values.end_time)
        return values
      },
      deleteHandler(callback, err) {
        return this.defaultThenProcess(
          this.default_api.deleteData(this.item.id).then(() => {
            callback()
            this.$message.success('刪除優惠券成功')
          })
        )


      },
      updateHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.updateValueTransfer(values)
          return this.defaultThenProcess(this.default_api.putData(this.item.id, values).then(() => {
            this.$message.success('更新優惠券成功')
          }))
        })


      },
      createHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.createValueTransfer(values)
          return this.defaultThenProcess(this.default_api.postData(values).then(() => {
            this.$message.success('新增優惠券成功')
          }))
        })

      },
      submitValidate(e, callback) {
        if (e) {
          e.preventDefault()
        }
        this.form.validateFields((err, values) => {
          if (err) {
            return
          }
          callback(values)

        })
      },
    }
  }
</script>

<style scoped>
</style>
