import Vue from 'vue'
import axios from 'axios'

// 创建 axios 实例
let baseURL = process.env.VUE_APP_API_URL
const service = axios.create({
  // todo http -> https
  baseURL: baseURL,
  timeout: 60000 // 请求超时时间
})
service.all = axios.all

const err = (error) => {
  if (error.response.status === 401) {
    window.location.href = '/login'
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get('token')
  if (token) {
    config.headers['Authorization'] = `Token ${token}`
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response
}, err)
service.baseURL = baseURL

const installer = {
  vm: {},
  install(Vue) {
    Vue.prototype.$axios = service
  }
}

export {
  installer as VueAxios,
  service as axios
}

