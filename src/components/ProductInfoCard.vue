<template>
  <a-card title="編輯中文商品資訊">
    <div class="row">
      <div class="col-12">
        <ckeditor :editor="editor" v-model="editor_data" :config="editorConfig"
                  :disabled="!editPermissioncheck()"></ckeditor>
      </div>
      <!--新的版型不需要顯示-->
      <!--      <div class="col-6">-->
      <!--        <div class="custom-desc" v-html="editor_data"></div>-->
      <!--      </div>-->

    </div>
  </a-card>
</template>

<script>
  import ckeditorMixin from "@/mixins/ckeditorMixin"
  import drawerMixin from "@/mixins/drawerMixin"
  import {mapState} from "vuex";

  export default {
    mixins: [drawerMixin, ckeditorMixin],
    props: {},
    data() {
      return {
        product_key: 'cn_product_info',
      }
    },
    computed: {}
  }
</script>

<style scoped>
</style>
