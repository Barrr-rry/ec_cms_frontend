export default {
  data() {
    return {
      params: {
        limit: 10,
        offset: 0,
      }
    }
  },
  methods: {
    handleChangePage(pagination, filters, sorter) {
      if (sorter&&sorter.field) {
        let sign = sorter.order === "descend" ? '-' : ''
        this.params.order_by = `${sign}${sorter.field}`
      } else {
        if (this.params.order_by) {
          delete this.params.order_by
        }
      }
      console.log(this.params)
      this.params.offset = (pagination.current - 1) * this.params.limit
      this.initData()
    },
    getParams() {
      return this.params
    },
  },
  computed: {
    pagination() {
      return {
        current: (this.params.offset / this.params.limit) + 1,
        pageSize: this.params.limit,
        total: this.raw_data ? this.raw_data.count : 0,
      }
    },
  }
}
