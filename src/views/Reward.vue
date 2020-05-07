<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>優惠管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>忠誠獎勵管理</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>忠誠獎勵管理</h3>
    </div>
    <div class="container-fluid pt-24px">
      <a-card>
        <a-form :form="form" @submit="submitHandler">
          <c-form-item label="忠誠獎勵規則">
            <a-radio-group v-decorator="['status',{rules:[],initialValue:1}]"
            >
              <a-radio :value="1" :disabled="!editPermission()">
                滿 100 元 回饋 X 元
              </a-radio>
              <a-radio :value="2" :disabled="!editPermission()">
                折扣 % ( 請輸入0 ~ 100 數字 )
              </a-radio>
            </a-radio-group>
          </c-form-item>
          <c-form-item label="忠誠獎勵單位">
            <a-input
              v-decorator="['discount', { rules: [
              { required: true, message: '請輸入資料' },
              ]}]"
              placeholder=""
              style="width: 100px"
              type="number"
              :disabled="!editPermission()"
            />
          </c-form-item>
          <c-form-item label="忠誠獎勵天數">
            <a-input
              v-decorator="['still_day', { rules: [
              { required: true, message: '請輸入資料' },
              ]}]"
              placeholder=""
              style="width: 100px"
              type="number"
              :disabled="!editPermission()"
            />
          </c-form-item>
          <div class="d-flex justify-content-end">
            <a-button class="mt-24px" type="primary" html-type="submit">
              確 定
            </a-button>
          </div>
        </a-form>
      </a-card>
    </div>

  </a-layout-content>
</template>
<script>
  import pageMixin from "@/mixins/pageMixin"
  import {mapState} from 'vuex'


  let table_name = 'reward'
  export default {
    mixins: [pageMixin],
    components: {},
    data() {
      return {
        table_name,
        form: this.$form.createForm(this),
        update_field_keys: ['discount', 'status', 'still_day']
      }
    },
    computed: {
      ...mapState(table_name, {
        item: state => state.items,
      })
    },

    methods: {
      initFields() {
        let obj = {}
        for (let key of this.update_field_keys) {
          obj[key] = this.item[key]
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(obj)
        })
      },
      editPermission() {
        return this.permissioncheck('permission_coupon_manage', 2)
      },
      submitHandler(e, err) {
        if (e) {
          e.preventDefault()
        }
        if(!this.editPermission()){
          this.$message.warn('權限不足')
          return
        }
        this.form.validateFields((err, values) => {
          if (err) {
            return
          }
          this.$api.reward.postData(values).then(() => {
            this.$message.success('修改成功')
            this.$store.dispatch('reward/getList').then(() => this.initFields())
          })

        })
      },
    },
    created() {
      this.$store.dispatch('reward/getList').then(() => this.initFields())
    }
  }
</script>
<style>
</style>