<template>
  <a-card class="manage-card pointer" v-on="$listeners "
  >
    <div class="d-flex w-100">
      <div class="manage-card-image-box">
<!--        <a-icon type="user"/>-->
        <img :src="img_path(item.productimages)" alt="" style="width: auto; height: auto; max-width: 80%; max-height: 80%;">
      </div>
      <div class="manage-card-content to-flex-col">
        <div class="gray-text flex-grow-1">
          <div class="mb-24px manage-card-name">{{item.cn_name}}</div>
          <div>商品編號: {{item.product_number}}</div>
        </div>
      </div>
    </div>
    <div class="d-flex d-center">
      <c-popover
        @ok="$emit('delete',$event)"
      >
        <template slot="content">
          <p>
            <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
            確定要刪除資料嗎?
          </p>
        </template>
        <a-button
          v-if="permissioncheck('permission_catalog_manage',2)"
          type="danger" ghost
        >刪 除
        </a-button>
      </c-popover>
    </div>
  </a-card>
</template>

<script>

  export default {
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
        img_path(images) {
            let path = ''
            for (let img of images) {
                if (img.main_image) {
                    path = img.image_url
                }
            }
            return this.$axios.baseURL.replace('/api/', '/media/') + path
        },
    }
  }
</script>

<style scoped>
</style>
