<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>優惠管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>回饋金管理</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>回饋金管理</h3>
    </div>
    <div class="container-fluid pt-24px">
      <a-card>
        <a-form :form="form" @submit="submitHandler">
          <c-form-item label="回饋金規則">
            <a-radio-group v-decorator="['status',{rules:[],initialValue:1}]"
                           v-model="status"
            >
              <a-radio :value="1" :disabled="!editPermission()">
                滿額回饋
              </a-radio>
              <a-radio :value="2" :disabled="!editPermission()">
                折扣
              </a-radio>
            </a-radio-group>
          </c-form-item>
          <c-form-item label="回饋條件（元）" v-show="this.status==1">
            <a-input
              v-decorator="['pay_to', { rules: [
              { required: true, message: '請輸入資料' },
              ]}]"
              placeholder=""
              style="width: 100px"
              type="number"
              :disabled="!editPermission()"
            />
          </c-form-item>
          <c-form-item label="回饋點數" v-if="status==1" >
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
          <c-form-item label="回饋比例" v-else>
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
          <c-form-item label="回饋金有效天數">
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
          <c-form-item label="回饋金生效天數">
            <a-input
                    v-decorator="['start_day', { rules: [
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
        update_field_keys: ['discount', 'status', 'still_day', 'start_day', 'pay_to'],
        status: 0
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
        this.status = obj.status
        this.$nextTick(() => {
          this.form.setFieldsValue(obj)
        })
      },
      editPermission() {
        return this.permissioncheck('permission_coupon_manage', 2)
      },
      submitHandler(e) {
        if (e) {
          e.preventDefault()
        }
        if (!this.editPermission()) {
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