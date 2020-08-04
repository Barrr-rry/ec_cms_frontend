export default {
  data() {
    return {
      _password: null,
      _phone: null,
    }
  },
  methods: {
    validateEnglish(rule, value, callback) {
      if(!value){
        callback()
        return
      }
      if (/^[a-z A-Z,.]+$/.test(value)) {
        callback()
      } else {
        callback('請輸入英文姓名')
      }
    },
    validatePassword(rule, value, callback) {
      let pattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,12}$/
      if (!new RegExp(pattern).test(value)) {
        callback('請輸入 6 - 12 個英數混合密碼')
      }
      this._paswwrod = value
      callback()
    },
    validateConfirmPassword(rule, value, callback) {
      if (this._paswwrod !== value) {
        callback('請輸入相同密碼')
      }
      callback()
    },
    validateDiscountUnit(rule, value, callback) {
      if (this.method === 1) {
        callback()

      } else {
        if (value > 100 || value < 0) {
          callback('請輸入0 ~ 100')
        }
        callback()
      }

    },
    validateStarttime(rule, value, callback) {
      this.start_time = value
      callback()
    },
    validateEndtime(rule, value, callback) {
      if (this.start_time > value) {
        callback('請輸入正確開始時間以及結束時間')
      }
      callback()

    },
    validatePhone(rule, value, callback) {
      this._phone = value
      callback()
    },
    validateCellPhone(rule, value, callback) {
      let re = /^09\d{8}$/
      if (typeof this._phone !== 'string' && typeof value !== 'string') {
        callback('電話手機兩者擇一')
      }
      if (re.test(value) || value == '') {
        callback()
      } else {
        callback('請輸入正確手機格式')
      }    },
    updateFailFields(err) {
      let data = err.response.data
      let fields = {}
      for (let key in data) {
        let erros = data[key].map(msg => {
          return {message: msg}
        })
        fields[key] = {
          value: '',
          errors: erros
        }

      }
      return fields

    }
  }
}