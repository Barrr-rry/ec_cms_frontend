import camelCase from 'lodash/camelCase'

const files = require.context(
  '@/api/modules',
  true,
  /^.*\.js$/
)
let api = {}

for (let file of files.keys()) {
  let module_name = camelCase(file.replace(/(\.\/|\.js)/g, ''))
  if (['base', 'index'].includes(module_name)) {
    continue
  }
  api[module_name] = files(file).default


}
export default api
