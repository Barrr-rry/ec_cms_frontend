<template>
  <div class="fill-width fill-height create-card d-flex d-center pointer" v-on="$listeners">
    <div class="gray-text">+ {{title}}</div>
  </div>
</template>

<script>
  export default {
    props:{
      title:{}
    },
    data() {
      return {}
    },
  }
</script>

<style scoped>
</style>
