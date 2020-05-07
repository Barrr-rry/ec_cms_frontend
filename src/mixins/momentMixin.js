import moment from "moment"


export default {
  data() {
    return {
      dateFormat: 'YYYY-MM-DD'
    }
  },
  methods: {
    toMoment(val) {
      return moment(val, this.dateFormat)
    },
    toDateStr(val) {
      return val.format(this.dateFormat)
    },
  }
}