<template>
  <c-drawer v-model="input" :title="type==='create'?'新增買就送活動':'修改買就送活動'"
            @ok="submitHandler"
            :displayDelete="type!=='create'"
            @delete="deleteHandler"
  >
    <h3>{{type==='create'?'新增買就送活動':'修改買就送活動'}}</h3>
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="買">
        <a-select
          v-decorator="['buy_count', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
        >
          <a-select-option :value="i" v-for="i in 10" :key="i">
            {{i}}
          </a-select-option>
        </a-select>
      </c-form-item>
      <c-form-item label="送">
        <a-select
          v-decorator="['give_count', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
        >
          <a-select-option :value="i" v-for="i in 10" :key="i">
            {{i}}
          </a-select-option>
        </a-select>
      </c-form-item>
      <c-form-item label="活動中文名稱">
        <a-input
          v-decorator="['ch_name', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="建議 10 個字元內"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="活動英文名稱">
        <a-input
          v-decorator="['en_name', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
          placeholder="建議 20 個字元內"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <div class="row">
        <div class="col-6 mb-24px" v-if="permissioncheck('permission_catalog_manage',2)">
          <create-card style="height: 160px" title="新增"
                       @click="create_drawer=true"
          ></create-card>
        </div>
        <div class="col-6 mb-24px"
             v-for="product of products"
             :key="product.id"
        >
          <tag-product-card
            style="height: 160px"
            :item="product"
            @delete="removeProduct(product.id)"
          ></tag-product-card>
        </div>
      </div>
    </a-form>
    <tag-product-drawer
      v-model="create_drawer"
      @ok="productHandler"
    ></tag-product-drawer>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import {mapState} from 'vuex'
  import CreateCard from "@/components/CreateCard"
  import TagProductCard from "@/components/TagProductCard"
  import TagProductDrawer from "@/components/TagProductDrawer"


  export default {
    mixins: [drawerMixin],
    components: {
      CreateCard,
      TagProductCard,
      TagProductDrawer,
    },
    data() {
      return {
        products: [],
        update_field_keys: [
          'buy_count',
          'give_count',
          'ch_name',
          'en_name',
        ],
        default_api: this.$api.activity,
        create_drawer: false,
        // for check to add
        // fake_data: {}
      }
    },
    computed: {},
    watch: {
      input(val) {
        if (val && this.type === 'update') {
          this.products = this.item.products
        }
      }
    },
    methods: {
      createValueTransfer(values) {
        // todo products create/update
        return values
      },
      productHandler(selected_items) {
        this.products.push(...selected_items)
      },
      removeProduct(id) {
        this.products = this.products.filter(item => item.id !== id)
      },
      initData() {
      },
      deleteHandler(callback, err) {
        return this.defaultThenProcess(
          this.default_api.deleteData(this.item.id).then(() => {
            this.$message.success('刪除自定義標籤成功')
          }).finally(() => {
            callback()
          })
        )


      },
      updateHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.updateValueTransfer(values)
          values.product_ids = this.products.map(x => x.id)
          return this.defaultThenProcess(this.default_api.putData(this.item.id, values).then(() => {
            this.$message.success('更新自定義標籤成功')
          }))
        })
      },
      createHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.createValueTransfer(values)
          values.product_ids = this.products.map(x => x.id)
          return this.defaultThenProcess(this.default_api.postData(values).then(() => {
            this.$message.success('新增自定義標籤成功')
          }))
        })
      },
    }
  }
</script>

<style scoped>
</style>
