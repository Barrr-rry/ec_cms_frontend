export default {
  data() {
    return {
      search_form: this.$form.createForm(this),
      selected_row_keys: [],
      params: {
        limit: 10,
        offset: 0,
      }
    }
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selected_row_keys = selectedRowKeys
    },
    getParams() {
      return this.params
    },
    reset() {
      this.params = {
        limit: 10,
        offset: 0,
      }

      this.search_form.resetFields()
      this.initData()
    },
    submit(e) {
      if (e) {
        e.preventDefault()
      }
      this.search_form.validateFields((err, values) => {
        if (err) {
          return
        }
        console.log(values)
        for (let k in values) {
          if (values[k] === undefined) {
            delete values[k]
          }
        }
        console.log(values)
        this.table_loading = true
        this.$store.dispatch(`${this.table_name}/getList`, values).then(() => {
          this.table_loading = false
        })

      })
    },
  },
}