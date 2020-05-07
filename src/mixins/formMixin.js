export default {
  methods: {
    updateFailFields(err) {
      if (err.response.status === 403) {
        this.$message.error('權限不足')
        return
      }
      let data = err.response.data
      let fields = {}
      for (let key in data) {
        if (!data.hasOwnProperty(key)) {
          continue
        }
        let erros = data[key].map(msg => {
          return {message: msg}
        })
        fields[key] = {
          value: '',
          errors: erros
        }

      }
      if (data.non_field_errors) {
        for (let msg of data.non_field_errors) {
          this.$message.error(msg).then(() => {
          })
        }
      }
      return fields

    },
  }
}