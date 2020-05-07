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
    computed: {
      computed_value() {
        return this.$attrs['data-__field'].value
      }
    },
    watch: {
      computed_value(val) {
        if (this.type === 'create') {
          return
        }
        let files = []
        if (val) {
          this.$nextTick(() => {
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

          })
        }
        this.$nextTick(() => {
          this.$refs.file.sFileList = files
        })
      }
    },
    methods: {
      init() {
        this.$nextTick(() => {
          this.$refs.file.sFileList = []
        })
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>