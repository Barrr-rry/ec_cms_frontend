import Vue from 'vue'
import base from "./base"
import {axios} from "@/utils/request"
import mergeDeep from "@/utils/merge_deep"


export default mergeDeep(base, {
  table_name: 'manager',
  login(values) {
    return axios.post(`/${this.table_name}/login/`, values).then(res => {
      Vue.ls.set('token', res.data.token)
    })
  },
  info(values) {
    return axios.get(`/${this.table_name}/info/`, values)
  },
})
