<template>
  <c-drawer v-model="input" :title="type==='create'?'新增優惠券':'修改優惠券'"
            @ok="submitHandler"
            :displayDelete="type!=='create'"
            @delete="deleteHandler"
  >
    <h3>{{type==='create'?'新增優惠券':'修改優惠券'}}</h3>
    <a-form
      :form="form"
      @submit="submitHandler"
    >
      <c-form-item label="設定使用門檻">
        <a-input
          v-decorator="['role', { rules: [{ required: true, message: '請輸入資料' }] }]"
          type="number"
          placeholder="請輸入使用優惠券的門檻價格"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="設定優惠方式">
        <a-radio-group v-decorator="['method',{rules:[],initialValue:method}]"
                       @change="changeMethod"
                       :disabled="!editPermissioncheck()"
        >
          <a-radio :value="1">
            元
          </a-radio>
          <a-radio :value="2">
            折扣 %
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="折價單位">
        <a-input
          :addonAfter="method===1?'元':'％'"
          v-decorator="['discount', { rules: [{ required: true, message: '請輸入資料' },
          { validator: validateDiscountUnit }
          ] }]"
          type="number"
          :placeholder="method===1?'請輸入折扣金額':'0 ~ 100 百分比'"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="優惠券標題">
        <a-input
          v-decorator="['title', { rules: [{ required: true, message: '請輸入資料' }] }]"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="優惠券序號">
        <a-input
          v-decorator="['discount_code', { rules: [{ required: true, message: '請輸入資料' }] }]"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="優惠券圖片"
                   extra="圖片建議上傳尺寸 340 px x 230 px ， 格式 .jpg .png .svg"
      >
        <c-upload
          ref="uploads"
          :type="type"
          v-decorator="[
          'image_url',
          { rules: [
            { required: true, message: '請輸入資料' },
            ],
            ...mixinUpload,
          },
          ]"
          :disabled="!editPermissioncheck()"
        />

      </c-form-item>
      <!--使用期限-->
      <c-form-item label="使用期限">
        <a-radio-group
          :disabled="!editPermissioncheck()"
          v-decorator="['has_period',{rules:[{ required: true, message: '請輸入資料' }],initialValue:has_period}]"
          @change="(e)=>has_period=e.target.value"
        >
          <a-radio :value="false">
            無限制
          </a-radio>
          <a-radio :value="true">
            有
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item :wrapperCol="{span:19,offset:5}" v-if="has_period">

        <a-range-picker
          :disabled="!editPermissioncheck()"
          v-decorator="['time_list', { rules: [,
          { required: true, message: '請輸入資料' }
          ] }]"
        />
      </c-form-item>

      <!--會員使用次數-->
      <c-form-item label="會員使用次數">
        <a-radio-group
          :disabled="!editPermissioncheck()"
          v-decorator="['has_member_use_limit',{rules:[{ required: true, message: '請輸入資料' }],initialValue:has_member_use_limit}]"
          @change="(e)=>has_member_use_limit=e.target.value"
        >
          <a-radio :value="false">
            無限制
          </a-radio>
          <a-radio :value="true">
            有
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item :wrapperCol="{span:19,offset:5}" v-if="has_member_use_limit">
        <a-input
          v-decorator="['member_use_limit', { rules: [{ required: true, message: '請輸入資料' }] }]"
          type="number"
          placeholder="請輸入同一會員最多可使用次數"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>

      <!--優惠券使用次數-->
      <c-form-item label="優惠券使用次數">
        <a-radio-group
          :disabled="!editPermissioncheck()"
          v-decorator="['has_coupon_use_limit',{rules:[{ required: true, message: '請輸入資料' }],initialValue:has_coupon_use_limit}]"
          @change="(e)=>has_coupon_use_limit=e.target.value"
        >
          <a-radio :value="false">
            無限制
          </a-radio>
          <a-radio :value="true">
            有
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item :wrapperCol="{span:19,offset:5}" v-if="has_coupon_use_limit">
        <a-input
          v-decorator="['coupon_use_limit', { rules: [{ required: true, message: '請輸入資料' }] }]"
          type="number"
          placeholder="請輸入此優惠券最多可被使用次數"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>

      <!--針對會員發放-->
      <c-form-item label="針對會員發放">
        <a-radio-group
          :disabled="!editPermissioncheck()"
          v-decorator="['has_member_list',{rules:[{ required: true, message: '請輸入資料' }],initialValue:has_member_list}]"
          @change="(e)=>has_member_list=e.target.value"
        >
          <a-radio :value="false">
            無限制
          </a-radio>
          <a-radio :value="true">
            有
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item :wrapperCol="{span:19,offset:5}" v-if="has_member_list">
        <a-select
          mode="multiple"
          v-decorator="['member', { rules: [{ required: true, message: '請輸入資料' }] }]"
          style="width: 100%"
          placeholder="請選擇可使用此優惠券的會員"
          :filterOption="filterOption"
        >
          <a-select-option v-for="el of members" :key="el.id" :value="el.id">
            {{el.name}}
          </a-select-option>
        </a-select>
      </c-form-item>
    </a-form>

  </c-drawer>

</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import uploadMixin from "@/mixins/uploadMixin"
  import momentMixin from "@/mixins/momentMixin"
  import {mapState} from 'vuex'

  export default {
    mixins: [drawerMixin, uploadMixin, momentMixin],
    components: {},
    data() {
      return {
        update_drawer: false,
        update_field_keys: [
          'role',
          'method',
          'discount',
          'title',
          'discount_code',
          'image_url',
          'has_period',
          'has_member_use_limit',
          'member_use_limit',
          'has_coupon_use_limit',
          'coupon_use_limit',
          'has_member_list',
        ],
        default_api: this.$api.coupon,
        method: 1,
        has_period: false,
        has_member_use_limit: false,
        has_coupon_use_limit: false,
        has_member_list: false,
        start_time: null,
        end_time: null,
        // for check to add
        // fake_data: {
        //   permission: 3,
        //   cn_name: "sdfsdf",
        //   en_name: "sdfdsfsd",
        //   email: "dsfsdf@conquers.co",
        //   password: "a123456",
        // }
      }
    },
    computed: {
      ...mapState('member', {
        members: state => state.items
      })
    },
    methods: {
      filterOption(input, option) {
        return option.componentOptions.children[0].text.includes(input)
      },
      changeMethod(e) {
        this.method = e.target.value
      },
      initFields() {
        let obj = {}
        for (let key in this.item) {
          if (!this.item.hasOwnProperty(key)) {
            continue
          }
          if (this.update_field_keys.includes(key)) {
            obj[key] = this.item[key]
          }
        }

        this.method = this.item.method
        this.has_period = this.item.has_period
        if (this.has_period) {
          let time_list = []
          time_list.push(this.toMoment(this.item.start_time))
          time_list.push(this.toMoment(this.item.end_time))
          obj.time_list = time_list
        }
        this.has_member_use_limit = this.item.has_member_use_limit
        if (this.has_member_use_limit) {
          obj.member_use_limit = this.item.member_use_limit
        }
        this.has_coupon_use_limit = this.item.has_coupon_use_limit
        if (this.has_coupon_use_limit) {
          obj.coupon_use_limit = this.item.coupon_use_limit
        }
        this.has_member_list = this.item.has_member_list
        if (this.has_member_list) {
          obj.member = this.item.member
        }

        this._initFileds(obj)
      },
      createValueTransfer(values) {
        if (values.time_list && values.time_list.length) {
          values.start_time = this.toDateStr(values.time_list[0])
          values.end_time = this.toDateStr(values.time_list[1])
        }
        return values
      },
      getName() {
        return '優惠券'
      },
      submitValidate(e, callback) {
        if (e) {
          e.preventDefault()
        }
        this.form.validateFields((err, values) => {
          if (err) {
            return
          }
          callback(values)

        })
      },
    },
    mounted() {
      this.$store.dispatch('member/getList')
    }
  }
</script>

<style scoped>
</style>
