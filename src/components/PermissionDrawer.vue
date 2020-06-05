<template>
  <c-drawer v-model="input" :title="type==='create'?'新增管理角色':'修改管理角色'"
            @ok="submitHandler"
            :displayDelete="type!=='create'&&item&&!item.highest_permission"
            @delete="deleteHandler"
  >
    <h3>{{type==='create'?'角色權限資料':'角色權限資料'}}</h3>
    <a-form :form="form" @@submit="submitHandler">
      <c-form-item label="管理角色名稱">
        <a-input
          :disabled="!editPermissioncheck()"
          v-decorator="['name', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="請輸入欲新增角色的名稱"
        />
      </c-form-item>
      <c-form-item label="管理角色說明">
        <a-input
          :disabled="!editPermissioncheck()"
          v-decorator="['description', { rules: [
            ]}]"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          placeholder="請輸入欲新增角色的說明與備註"
        />
      </c-form-item>
      <c-form-item label="權限管理權限">
        <a-radio-group v-decorator="['role_manage',{rules:[],initialValue:1}]"
                       :disabled="is_hightest_permission || !editPermissioncheck()"
        >
          <a-radio :value="0">
            無權限
          </a-radio>
          <a-radio :value="1">
            檢視
          </a-radio>
          <a-radio :value="2">
            編輯
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="會員管理權限">
        <a-radio-group v-decorator="['member_manage',{rules:[],initialValue:1}]"
                       :disabled="is_hightest_permission || !editPermissioncheck()"
        >
          <a-radio :value="0">
            無權限
          </a-radio>
          <a-radio :value="1">
            檢視
          </a-radio>
          <a-radio :value="2">
            編輯
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="訂單管理權限">
        <a-radio-group v-decorator="['order_manage',{rules:[],initialValue:1}]"
                       :disabled="is_hightest_permission || !editPermissioncheck()"
        >
          <a-radio :value="0">
            無權限
          </a-radio>
          <a-radio :value="1">
            檢視
          </a-radio>
          <a-radio :value="2">
            編輯
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="文案管理權限">
        <a-radio-group v-decorator="['banner_manage',{rules:[],initialValue:1}]"
                       :disabled="is_hightest_permission || !editPermissioncheck()"
        >
          <a-radio :value="0">
            無權限
          </a-radio>
          <a-radio :value="1">
            檢視
          </a-radio>
          <a-radio :value="2">
            編輯
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="分類管理權限">
        <a-radio-group v-decorator="['catalog_manage',{rules:[],initialValue:1}]"
                       :disabled="is_hightest_permission || !editPermissioncheck()"
        >
          <a-radio :value="0">
            無權限
          </a-radio>
          <a-radio :value="1">
            檢視
          </a-radio>
          <a-radio :value="2">
            編輯
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="商品管理權限">
        <a-radio-group v-decorator="['product_manage',{rules:[],initialValue:1}]"
                       :disabled="is_hightest_permission || !editPermissioncheck()"
        >
          <a-radio :value="0">
            無權限
          </a-radio>
          <a-radio :value="1">
            檢視
          </a-radio>
          <a-radio :value="2">
            編輯
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="優惠管理權限" class="mb-48px">
        <a-radio-group v-decorator="['coupon_manage',{rules:[],initialValue:1}]"
                       :disabled="is_hightest_permission || !editPermissioncheck()"
        >
          <a-radio :value="0">
            無權限
          </a-radio>
          <a-radio :value="1">
            檢視
          </a-radio>
          <a-radio :value="2">
            編輯
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="管理權限說明">
        <c-form-item label="無權限" :labelCol="{span:3}" class="mb-0px">
          無法檢視與操作權限
        </c-form-item>
        <c-form-item label="檢視" :labelCol="{span:3}" class="mb-0px">
          僅可檢視，無法新增、編輯及刪除資料
        </c-form-item>
        <c-form-item label="編輯" :labelCol="{span:3}" class="mb-0px">
          可檢視、新增、編輯及刪除資料
        </c-form-item>
      </c-form-item>

    </a-form>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"

  export default {
    mixins: [drawerMixin],
    data() {
      return {
        update_field_keys: [
          'name',
          'description',
          'role_manage',
          'member_manage',
          'order_manage',
          'banner_manage',
          'catalog_manage',
          'product_manage',
          'coupon_manage',
        ],
        default_api: this.$api.permission,
        // for check to add
        // fake_data: {}
      }
    },
    computed: {
      is_hightest_permission() {
        if (this.item && this.item.highest_permission) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      getName() {
        return '權限'
      },
    }
  }
</script>

<style scoped>
</style>
