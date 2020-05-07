<template>
  <a-card class="banner-card pointer" v-on="$listeners ">
    <img :src="img_path" class="banner-card-img">
    <div class="banner-card-content pa-24px">
      <div>折扣碼: {{item.discount_code}}</div>
      <div>{{item.title}}</div>
      <div class="banner-card-content-footer flex-grow-1 d-flex align-items-end justify-content-between">
        <c-badge :status="item.status?'success':'error'" error_text="已到期"></c-badge>
        <div class="banner-card-content-footer-end_time gray-text">
          於 {{item.end_time}} 到期
        </div>
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
    computed: {
      img_path() {
        if (this.item.image_url) {
          return this.$axios.baseURL.replace('/api/', '/media/') + this.item.image_url
        } else {
          return null
        }

      }
    },
    methods: {}
  }
</script>

<style scoped>
</style>
