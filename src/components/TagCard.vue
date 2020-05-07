<template>
  <a-card class="manage-card pointer" v-on="$listeners "
  >
    <div class="d-flex h-100 w-100">
      <div class="manage-card-image-box">
        <a-icon type="user"/>
      </div>
      <div class="manage-card-content to-flex-col">
        <h3>{{item.name}}</h3>
        <div class="gray-text flex-grow-1">使用中: {{item.products.length}} 個商品</div>
      </div>
    </div>
    <template class="ant-card-actions" slot="actions">
      <div class="pointer" @click="callbackCheck(()=>$emit('update'),)">編輯</div>
      <c-popover
        @ok="deleteHandler"
      >
        <template slot="content">
          <p>
            <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
            確定要刪除資料嗎?
          </p>
        </template>
        <div class="pointer">刪除</div>
      </c-popover>
    </template>
  </a-card>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"

  export default {
    mixins: [drawerMixin],
    props: {
      item: {}
    },
    data() {
      return {
        default_api: this.$api.tag,
      }
    },
    computed: {},
    methods: {
      editPermission() {
        return this.permissioncheck('permission_catalog_manage', 2)
      }
    }
  }
</script>

<style scoped>
</style>
