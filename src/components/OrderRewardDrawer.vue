<template>
  <c-drawer v-model="input" title="編輯忠誠獎勵"
            @ok="okCallback"
            :displayDelete="false"
            @delete="$emit('delete')"
  >
    <div class="h-100 to-flex-col">
      <a-form :form="form" @submit="okCallback">
        <c-form-item label="編輯忠誠獎勵">
          <a-input
            v-decorator="['point', { rules: [
            { required: false, message: '請輸入資料', },
            ]}]"
            type="number"
            placeholder="請輸入忠誠獎勵"

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
    data() {
      return {
        update_field_keys: ['point']
      }
    },
    methods: {
    },
  }
</script>

<style scoped>
</style>
