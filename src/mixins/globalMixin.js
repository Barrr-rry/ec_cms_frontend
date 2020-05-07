import {mapState} from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState('manager', {
      info: state => state.info
    }),
    edit_permission(){
      return this.editPermission()
    }
  },
  watch: {},
  methods: {
    callbackCheck(callback, permission = true) {
      if (!permission) {
        this.$message.warn('權限不足')
        return
      }
      callback()
    },
    editPermission(){
        return true
      },
    permissioncheck(key, permission_number) {
      let info = this.info
      return info && (info.permission_highest_permission || parseInt(info[key]) >= permission_number)
    },
    editPermissioncheck() {
      return this.permissioncheck('permission_role_manage',2)
    }
  },
  created() {
  }
}
