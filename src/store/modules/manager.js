import {api, getCommit} from "./base"

let default_api = api.manager
export default {
  namespaced: true,
  state: {
    raw_data: null,
    _first_init: false,
    item: null,
    items: [],
    info: null,
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
    getInfo(context) {
      let commit = getCommit(context)
      return default_api.info().then(res => {
        let data = res.data
        commit('info', data)
      })
    },
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
