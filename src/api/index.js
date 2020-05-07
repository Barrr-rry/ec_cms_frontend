import modules from './modules'

const api = {
  ...modules
}
const installer = {
  vm: {},
  install(Vue) {
    Vue.prototype.$api = api
  }
}

export {
  installer as VueAPI,
  api,
}
