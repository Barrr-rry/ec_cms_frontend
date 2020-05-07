<template>
  <a-badge :status="status" :text="text"/>
</template>

<script>
  export default {
    props: {
      status: {
        default: 'success'
      },
      error_text:{
        type: String,
        default: '停用中'
      },
    },
    data() {
      return {}
    },
    computed: {
      text() {
        let type = {
          success: '啟用中',
          error: this.error_text
        }
        return type[this.status]
      }
    },
  }
</script>

<style scoped>
</style>
