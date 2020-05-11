<template>
  <a-card class="manage-card pointer" v-on="$listeners "
  >
    <div class="d-flex h-100 w-100" style="position:relative">
      <div class="manage-card-image-box">
        <div v-show="item.tag_image_image_url=='label-green'">
          <img src="/img/product-label/label-green.svg" class="img">
          <div class="label">{{item.name}}</div>
        </div>
        <div v-show="item.tag_image_image_url=='label-pink'">
          <img src="/img/product-label/label-pink.svg" class="img">
          <div class="label">{{item.name}}</div>
        </div>
        <div v-show="item.tag_image_image_url=='label-yellow'">
          <img src="/img/product-label/label-yellow.svg" class="img">
          <div class="label">{{item.name}}</div>
        </div>
        <div v-show="item.tag_image_image_url=='ribbon-green'">
          <img src="/img/product-label/ribbon-green.svg" class="img">
          <div class="ribbon">{{item.name}}</div>
        </div>
        <div v-show="item.tag_image_image_url=='ribbon-orange'">
          <img src="/img/product-label/ribbon-orange.svg" class="img">
          <div class="ribbon">{{item.name}}</div>
        </div>
        <div v-show="item.tag_image_image_url=='ribbon-pink'">
          <img src="/img/product-label/ribbon-pink.svg" class="img">
          <div class="ribbon">{{item.name}}</div>
        </div>
        <div v-show="item.tag_image_image_url=='ribbon-yellow'">
          <img src="/img/product-label/ribbon-yellow.svg" class="img">
          <div class="ribbon">{{item.name}}</div>
        </div>
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
