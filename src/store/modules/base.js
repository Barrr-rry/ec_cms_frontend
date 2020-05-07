import {api} from "@/api"
import _ from 'lodash'

let getCommit = (context) => {
  let _commit = _.partial(context.commit, 'changeValue')
  return ((key, value) => _commit({key, value}))
}


let base = (default_api) => {
  return {
    namespaced: true,
    state: {
      raw_data: null,
      _first_init: false,
      item: null,
      items: []
    },
    mutations: {
      changeValue(state, obj) {
        let {key, value} = obj
        state[key] = value
      },
      resetValue(state) {
        state = {
          _first_init: false,
          item: null,
          items: []
        }
      },
      firstInitReset(state) {
        state._first_init = false
      }
    },
    actions: {
      getList(context, filter_obj) {
        let commit = getCommit(context)
        return default_api.getList(filter_obj).then(res => {
          let data = res.data
          if (res.data.results !== undefined) {
            data = res.data.results
            commit('raw_data', res.data)
          }
          commit('items', data)
        })
      },
      firstInitList(context) {
        let commit = getCommit(context)
        if (context.state._first_init) {
          return
        }
        commit('_first_init', true)

        return default_api.getList().then(res => {
          let data = res.data
          if (res.data.results !== undefined) {
            data = res.data.results
            commit('raw_data', res.data)
          }
          commit('items', data)
        })
      },
      getRead(context, id) {
        let commit = getCommit(context)
        return default_api.getRead(id).then(res => {
          commit('item', res.data)
        })
      }
    },
    modules: {}
  }

}
export {
  getCommit,
  _,
  api,
  base
}
