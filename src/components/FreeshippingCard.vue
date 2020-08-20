<template>
  <a-card :title="item.backstage_name">
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="地區">

        {{item.location===1?'國內':'海外'}}
      </c-form-item>
      <c-form-item label="開關">
        <a-radio-group v-decorator="['enable',{rules:[
        { required: true, message: '請輸入資料' },
        ]}]"
                       :disabled="!editPermission()"
        >
          <a-radio :value="true">
            開
          </a-radio>
          <a-radio :value="false">
            關
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="是否串接物流" v-if="item.backstage_name.indexOf('海外')">
        <a-radio-group v-decorator="['use_ecpay_delivery',{rules:[
        { required: true, message: '請輸入資料' },
        ]}]"
                       :disabled="!editPermission()"
                       v-model="use_ecpay_delivery"
        >
          <a-radio :value="true">
            是（綠界物流）
          </a-radio>
          <a-radio :value="false">
            否（賣家自行寄出）
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="是否開通取貨付款" v-if="item.backstage_name.indexOf('海外')">
        <a-radio-group v-decorator="['cash_on_delivery',{rules:[
        { required: true, message: '請輸入資料' },
        ]}]"
                       :disabled="!editPermission()"
                       v-model="cash_on_delivery"
        >
          <a-radio :value="1" :disabled="item.backstage_name==='宅配到府' && this.use_ecpay_delivery">
            是
          </a-radio>
          <a-radio :value="0">
            否（僅接受線上付款後超取）
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="設定運費">
        <a-input
          v-decorator="['price', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder=""
          style="width: 200px"
          type="number"
          :disabled="!editPermission()"
        />
      </c-form-item>
      <c-form-item label="設定免運金額">
        <a-input
          v-decorator="['role', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder=""
          style="width: 200px"
          type="number"
          :disabled="!editPermission()"
        />
      </c-form-item>
      <c-form-item label="免運規則中文標題">
        <a-input
          v-decorator="['title', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder=""
          :disabled="!editPermission()"
        />
      </c-form-item>
      <c-form-item label="免運規則英文標題">
        <a-input
                v-decorator="['en_title', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
                placeholder=""
                :disabled="!editPermission()"
        />
      </c-form-item>
      <c-form-item label="設定使用規則" v-if="configsetting.weight">
        出貨商品總重量高於
        <a-input
          v-decorator="['weight', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder=""
          style="width: 100px"
          type="number"
          :disabled="!editPermission()"
        />
        公斤時不可使用
      </c-form-item>
      <div class="d-flex justify-content-end">
        <c-popover
          @ok="submitPopoup"
        >
          <template slot="content">
            <p>
              確定要更改嗎?
            </p>
          </template>
          <a-button class="mt-24px" type="primary" html-type="submit">
            更改
          </a-button>
        </c-popover>

      </div>
    </a-form>
  </a-card>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import configsettingMixin from "@/mixins/configsettingMixin"

  export default {
    mixins: [drawerMixin, configsettingMixin],
    props: {
      title: {
        type: String,
        default: ''
      },
      item: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        update_field_keys: [
          'title', 'en_title', 'role', 'weight', 'price', 'enable', 'use_ecpay_delivery', 'cash_on_delivery'
        ],
        default_api: this.$api.freeshipping,
        // for check to add
        // fake_data: {}
        use_ecpay_delivery: false,
        cash_on_delivery: false
      }
    },
    watch: {
    },
    methods: {
      editPermission() {
        return this.permissioncheck('permission_coupon_manage', 2)
      },
      submitPopoup(callback) {
        this.submitHandler()
        callback()
      },
      initData() {
        this.initFields()
      }
    }
  }
</script>

<style scoped>
</style>
