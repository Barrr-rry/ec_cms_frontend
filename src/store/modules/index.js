import camelCase from 'lodash/camelCase'

const files = require.context(
  '@/store/modules',
  true,
  /^.*\.js$/
)
let modules = {}

for (let file of files.keys()) {
  let module_name = camelCase(file.replace(/(\.\/|\.js)/g, ''))
  if (['index', 'base'].includes(module_name)) {
    continue
  }
  modules[module_name] = files(file).default


}
export default modules
