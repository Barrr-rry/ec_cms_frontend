import {axios} from "@/utils/request"

export default {
  table_name: '',
  getList(filter_obj) {
    let filter_str = ''
    if (filter_obj) {
      filter_str = '?'
      let querys = []
      for (let key in filter_obj) {
        querys.push(`${key}=${filter_obj[key]}`)
      }
      filter_str += querys.join('&')
    }
    return axios.get(`/${this.table_name}/${filter_str}`).catch((err) => {
      if ([401, 403].includes(err.response.status)) {
        window.location.href = '/nopermission'
      }
    })
  },
  putData(id, values) {
    return axios.put(`/${this.table_name}/${id}/`, values)
  },
  postData(values) {
    return axios.post(`/${this.table_name}/`, values)
  },
  getRead(id) {
    return axios.get(`/${this.table_name}/${id}/`)
  },
  deleteData(id) {
    return axios.delete(`/${this.table_name}/${id}/`)
  },

}