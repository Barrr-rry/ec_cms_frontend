<template>
  <c-drawer v-model="input" title="編輯備註"
            @ok="okCallback"
            :displayDelete="false"
            @delete="$emit('delete')"
  >
    <div class="h-100 to-flex-col">
      <a-form :form="form" @submit="okCallback">
        <c-form-item label="編輯備註">
          <a-input
            v-decorator="['remark', { rules: [
            { required: false, message: '請輸入資料', },
            ]}]"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6 }"
            placeholder="請輸入備註內容，限 300 個字"
          />
        </c-form-item>
      </a-form>
    </div>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"


  export default {
    mixins: [drawerMixin],
    props: {
      okCallback: {
        type: Function
      },
      items: {},
    },
  }
</script>

<style scoped>
</style>
