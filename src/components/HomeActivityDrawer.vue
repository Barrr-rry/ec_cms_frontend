<template>
  <c-drawer v-model="input" :title="type==='create'?'新增首頁優惠文案':'修改首頁優惠文案'"
            @ok="submitHandler"
            :displayDelete="type!=='create'"
            @delete="deleteHandler"
  >
    <h3>{{type==='create'?'新增首頁優惠文案':'修改首頁優惠文案'}}</h3>
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="首頁優惠中文文案">
        <a-input
          v-decorator="['ch_name', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="建議 10 個字元內"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="首頁優惠英文文案">
        <a-input
          v-decorator="['en_name', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="建議 10 個字元內"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
    </a-form>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import {mapState} from 'vuex'

  let table_name = 'homeactivity'


  export default {
    mixins: [drawerMixin],
    components: {},
    data() {
      return {
        products: [],
        update_field_keys: [
          'ch_name',
          'en_name',
        ],
        default_api: this.$api.homeactivity,
        create_drawer: false,
      }
    },
    computed: {},
    watch: {},
    methods: {
      createValueTransfer(values) {
        // todo products create/update
        return values
      },
      initData() {
      },
      updateHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.updateValueTransfer(values)
          return this.defaultThenProcess(this.default_api.putData(this.item.id, values).then(() => {
            this.$message.success('更新j文案成功')
          }))
        })
      },
    }
  }
</script>

<style scoped>
</style>
