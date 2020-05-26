<template>
  <a-card class="activity-card pointer h-100" v-on="$listeners ">
    <div class="d-flex h-100 w-100">
      <div>
        <a-icon type="tag"/>
      </div>
      <div class="activity-card-content flex-grow-1 ml-12px">
        <h3 class="mb-12px">{{item.ch_name}}</h3>
        <div class="gray-text">
          使用中商品 : 25 個
        </div>
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
        default_api: this.$api.activity,
      }
    },
    computed: {},
    methods: {
      editPermission() {
        return this.permissioncheck('permission_coupon_manage', 2)
      }
    }
  }
</script>

<style scoped>
</style>
