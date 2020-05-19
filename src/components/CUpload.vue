<template>
  <a-upload
    name="file"
    :multiple="multiple"
    :action="$axios.baseURL+'file/'"
    accept=".svg,.jpg,.jpeg,.png"
    list-type="picture"
    v-on="$listeners"
    v-bind="$attrs"
    ref="file"
    :file-list="fileList"
    @change="handleChange"
  >
    <a-button>
      <a-icon type="upload"/>
      Upload
    </a-button>
  </a-upload>
</template>

<script>
  export default {
    name: "CUpload",
    props: {
      type: {
        type: String,
        default: 'create'
      },
      multiple: {
        type: Boolean,
        defualt: false,

      }
    },
    data() {
      return {
        fileList: [],
        init: false,
      }
    },
    computed: {
      computed_value() {
        return this.$attrs['data-__field'].value
      }
    },
    watch: {
      computed_value(val) {
        if (!val) {
          return
        }
        if (this.init) {
          return
        }
        this.init = true
        let files = []
        if (!val) {
          this.fileList = files
          return
        }
        if (!val.hasOwnProperty('fileList')) {
          if (!Array.isArray(val)) {
            files = [{
              uid: val,
              name: val,
              status: 'done',
              url: this.$axios.baseURL.replace('/api/', '/media/') + val
            }]
          } else {
            for (let v of val) {
              files.push({
                uid: v,
                name: v,
                status: 'done',
                url: this.$axios.baseURL.replace('/api/', '/media/') + v
              })
            }
          }
        } else {
          files = val.fileList ? val.fileList : []
        }
        if (!this.multiple && files.length) {
          files = [files[files.length - 1]]
        }
        files = files.filter(x => x.status !== 'removed')
        this.fileList = files
      }
    },
    methods: {
      handleChange(info) {
        let files = info.fileList
        if (!this.multiple && files.length) {
          files = [files[files.length - 1]]
        }
        this.fileList = files
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>