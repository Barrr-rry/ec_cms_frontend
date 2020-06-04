import base from "./base"
import mergeDeep from "@/utils/merge_deep"
import {axios} from "@/utils/request"


export default mergeDeep(base, {
  table_name: 'activity',
  category(values) {
    return axios.post(`/${this.table_name}/category/`, values)
  },
})
