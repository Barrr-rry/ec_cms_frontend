export default {
  data() {
    return {
      loading: false,
      table_name: '',
      target: null,
      create_drawer: false,
      update_drawer: false,
    }
  },
  watch: {},
  methods: {
    openUpdateDrawer(target, callback, permission = true) {
      if (!permission) {
        this.$message.warn('權限不足')
        return
      }
      this.target = target
      if (!callback) {
        this.update_drawer = true
      } else {
        callback()
      }
    },
    getParams() {
      return null
    },
    initData() {
      this.loading = true
      // store action get data
      this.$store.dispatch(`${this.table_name}/getList`, this.getParams()).then(() => {
        this.loading = false
      })
    }
  },
  created() {
    this.initData()
  }
}
