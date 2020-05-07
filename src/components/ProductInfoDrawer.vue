<template>
  <c-drawer v-model="input" title="商品資訊"
            @ok="submitHandler"
  >
    <div class="row">
      <div class="col-6">
        <ckeditor :editor="editor" v-model="editor_data" :config="editorConfig" :disabled="!editPermissioncheck()"></ckeditor>
      </div>
      <div class="col-6">
        <div class="custom-desc" v-html="editor_data"></div>
      </div>

    </div>

  </c-drawer>

</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import ckeditorMixin from "@/mixins/ckeditorMixin"

  export default {
    mixins: [drawerMixin, ckeditorMixin],
    props: {},
    data() {
      return {
        product_key: 'product_info',
      }
    },
    computed: {},
  }
</script>

<style scoped>
</style>
