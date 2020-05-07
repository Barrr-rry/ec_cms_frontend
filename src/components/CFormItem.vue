<template>
  <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"
               v-on="$listeners" v-bind="$attrs"
  >
    <slot></slot>
  </a-form-item>
</template>

<script>
  export default {
    props: {
      labelCol: {
        default: () => {
          return {span: 5}
        }
      },
      wrapperCol: {
        default: () => {
          return {span: 19}
        }
      }
    },
    data() {
      return {}
    },
  }
</script>

<style scoped>
</style>
