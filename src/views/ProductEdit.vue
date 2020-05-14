<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>商品管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>商品列表</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="3">
          <span>{{type==='create'?'新增':'編輯'}}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>{{type==='create'?'新增商品':'編輯商品'}}</h3>
    </div>
    <div class="container-fluid pt-24px" v-if="!loading">
      <ProductEditCard
        class="mb-24px"
        :item="item"
        ref="product_edit_card"
      />
      <!--      <ProductUploadImage-->
      <!--        class="mb-24px"-->
      <!--        :item="itme"-->
      <!--      />-->
      <ProductInfoCard
        class="mb-24px"
        :item="item"
        ref="product_info_card"
      />
      <DetailInfoCard
        class="mb-24px"
        :item="item"
        ref="detail_info_card"
      />
      <div class="d-flex justify-content-end">
        <c-popover
          @ok="submitPopoup"
        >
          <template slot="content">
            <p>
              確定要發布嗎?
            </p>
          </template>
          <a-button class="mt-24px" type="primary" html-type="submit">
            確 定 發 布
          </a-button>
        </c-popover>

      </div>
    </div>

  </a-layout-content>
</template>
<script>
  import pageMixin from "@/mixins/pageMixin"
  import {mapState} from 'vuex'
  import ProductEditCard from "@/components/ProductEditCard"
  import ProductUploadImage from "@/components/ProductUploadImage"
  import ProductInfoCard from "@/components/ProductInfoCard"
  import DetailInfoCard from "@/components/DetailInfoCard"


  let table_name = 'product'
  export default {
    mixins: [pageMixin],
    components: {
      ProductEditCard,
      // ProductUploadImage,
      ProductInfoCard,
      DetailInfoCard
    },
    data() {
      let type = this.$route.params.id === 'create' ? 'create' : 'update'
      return {
        table_name,
        type,
        default_api: this.$api.product,
      }
    },
    computed: {
      ...mapState(table_name, {
        item: state => state.item,
      }),
    },

    methods: {
      submitPopoup(callback) {
        this.$refs.product_edit_card.submitHandler().then(values => {
          values.product_info = this.$refs.product_info_card.editor_data
          values.detail_info = this.$refs.product_info_card.editor_data
          if (this.type === 'update') {
            this.submitUpdate(values).then(() => {
              callback()
            })
          } else {
            this.submitCreate(values).then(() => {
              callback()
            })
          }
        })
      },
      submitUpdate(values) {
        return this.default_api.putData(this.$route.params.id, values)
      },
      submitCreate(values) {
        return this.default_api.postData(values)
      },
      initData() {
        let promise_list = [
          this.$store.dispatch('brand/getList'),
          this.$store.dispatch('tag/getList'),
          this.$store.dispatch('category/getList'),
        ]
        if (this.type !== 'create') {
          promise_list.push(this.$store.dispatch(`${this.table_name}/getRead`, this.$route.params.id))
        }

        this.loading = true
        Promise.all(promise_list).then(() => {
          this.loading = false
        })
      }

    }
  }
</script>
<style>
</style>