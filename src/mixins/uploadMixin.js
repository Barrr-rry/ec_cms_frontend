let normFile = (e) => {
  if (e.file.response) {
    return e.file.response.filename
  } else {
    return null
  }

}

let normFileList = (e) => {
  let ret = []
  if (e.file.response || e.fileList) {
    for (let file of e.fileList) {
      if (!file.response && file.status !== 'done') {
        break
      }
      let f = file.response ? file.response.filename : file.status === 'done' ? file.name : null
      ret.push(f)
    }
    return ret
  } else {
    return null
  }

}
export default {
  data() {
    return {
      mixinUpload: {
        valuePropName: 'file.response.filename',
        getValueFromEvent: normFile,
      },
      mixinMultipleUpload: {
        valuePropName: 'file.response.filename',
        getValueFromEvent: normFileList,
      },
    }
  }
}