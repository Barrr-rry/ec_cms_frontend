import {base, api, getCommit} from "./base"
import mergeDeep from "@/utils/merge_deep"

export default mergeDeep(base(api.configsetting), {
  actions: {
    getList(context, filter_obj) {
      let commit = getCommit(context)
      return api.configsetting.getList(filter_obj).then(res => {
        let data = res.data
        commit('item', data)
      })
    },
  }
})