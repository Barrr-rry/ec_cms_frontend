<template>
  <a-card class="banner-card pointer" v-on="$listeners ">
    <img :src="img_path" class="banner-card-img">
    <div class="banner-card-content pa-24px">
      <h3>{{normDataText('title')}}</h3>
      <div class="gray-text">{{normDataText('subtitle')}}</div>
      <div class="mt-24px primary-color">順序 : {{banner.queue}}</div>
      <div class="banner-card-content-footer flex-grow-1 d-flex align-items-end justify-content-between">
        <a-badge :status="banner.display_status?'success':'error'" :text="banner.display_text"></a-badge>
        <div class="banner-card-content-footer-end_time gray-text" v-if="!banner.display_type">
          於 {{banner.end_time}} 到期
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
  export default {
    props: {
      banner: {}
    },
    data() {
      return {}
    },
    computed: {
      img_path() {
        if (this.banner.bigimage) {
          return this.$axios.baseURL.replace('/api/', '/media/') + this.banner.bigimage
        } else {
          return null
        }

      }
    },
    methods: {
      normDataText(key) {
        let val = null
        for (let content of this.banner.content) {
          if (content.language_type === 1) {
            val = content[key]
            break
          }
        }
        return val ? val : '無'
      }
    }
  }
</script>

<style scoped>
</style>
