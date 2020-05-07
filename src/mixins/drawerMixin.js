import validator from "@/mixins/validator"
import vModel from "@/mixins/vModel"
import formMixin from "@/mixins/formMixin"

export default {
  mixins: [validator, vModel, formMixin],
  props: {
    // for create / update done callback init data
    initCallback: {
      type: Function,
      default: () => () => {
      }
    },
    // for update
    item: {
      default: null
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      table_name: '',
      update_field_keys: [],
      fake_data: null,
      default_api: null,
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.removeAllCUpload()
        return
      }
      this.resetFields()
      if (this.fake_data) {
        this.initFakeFields()
      }
      if (this.item) {
        this.initFields()
      }
    }
  },
  computed: {
    type() {
      return this.item ? 'update' : 'create'
    }
  },
  methods: {
    removeAllCUpload() {
      for (let key in this.$refs) {
        if (key.includes('upload')) {
          this.$refs[key].init()
        }
      }
    },
    _initFileds(val) {
      if (val) {
        this.$nextTick(() => {
          this.form.setFieldsValue(val)
        })
      }
    },
    initFields() {
      let obj = {}
      for (let key of this.update_field_keys) {
        obj[key] = this.item[key]
      }
      this._initFileds(obj)
    },
    initFakeFields() {
      this._initFileds(this.fake_data)
    },
    resetFields() {
      this.form.resetFields()
    },
    createValueTransfer(values) {
      return values
    },
    updateValueTransfer(values) {
      return this.createValueTransfer(values)
    },
    initData() {
    },
    deleteHandler(callback, err) {
      if (!this.editPermission()) {
        this.$message.warn('權限不足')
        callback()
        return
      }
      return this.defaultThenProcess(
        this.default_api.deleteData(this.item.id).then(() => {
          this.$message.success('刪除資料成功')
        }).finally(() => {
          callback()
        })
      )
    },
    apiSuccessHandler() {
      this.input = false
      this.initCallback()
    },
    apiFailHandler(err) {
      let fields = this.updateFailFields(err)
      this.form.setFields(fields)
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
    defaultThenProcess(process) {
      return process.then(() => {
        this.apiSuccessHandler()
      }).catch((err) => {
        this.apiFailHandler(err)
      })
    },
    removeBlankValue(values) {
      for (let key in values) {
        if (values[key] === '') {
          values[key] = null
        }
      }
      return values
    },
    updateHandler(e) {
      this.submitValidate(e, (values) => {
        values = this.removeBlankValue(values)
        values = this.updateValueTransfer(values)
        return this.defaultThenProcess(this.default_api.putData(this.item.id, values).then(() => {
          this.$message.success('更新資料成功')
        }))
      })

    },
    createHandler(e) {
      this.submitValidate(e, (values) => {
        values = this.removeBlankValue(values)
        values = this.createValueTransfer(values)
        return this.defaultThenProcess(this.default_api.postData(values).then(() => {
          this.$message.success('新增資料成功')
        }))
      })
    },
    submitHandler(e) {
      if (!this.editPermission()) {
        this.$message.warn('權限不足')
        return
      }
      if (this.type === 'create') {
        return this.createHandler(e)
      } else {
        return this.updateHandler(e)
      }
    },
    close() {
      this.input = false
    },
    editPermission() {
      return true
    }
  },
  created() {
    this.initData()
  }
}
