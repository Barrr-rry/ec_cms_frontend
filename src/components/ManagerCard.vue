<template>
  <a-card class="manage-card pointer" v-on="$listeners ">
    <div class="d-flex h-100 w-100">
      <div class="manage-card-image-box">
        <img src="/img/user.svg" width="75" height="75">
      </div>
      <div class="manage-card-content to-flex-col">
        <h3 class="manager-card-h3">{{item.cn_name}} ( {{item.en_name}} )</h3>
        <div class="gray-text flex-grow-1">{{item.permission_name}}</div>
        <c-badge :status="item.status?'success':'error'"></c-badge>
      </div>
    </div>
  </a-card>
</template>

<script>
  export default {
    props: {
      item: {}
    },
    data() {
      return {}
    },
    computed: {},
    methods: {}
  }
</script>

<style scoped>
</style>
