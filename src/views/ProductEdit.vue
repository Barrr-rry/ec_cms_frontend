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
    <div class="container-fluid pt-24px">
<!--      todo 抓不到item-->
      <ProductEditCard
        class="mb-24px"
        :item="items[0]"
      />
      <ProductUploadImage
        class="mb-24px"
        :item="items[0]"
      />
      <ProductInfoCard
        class="mb-24px"
        :item="items[0]"
      />
      <DetailInfoCard
        class="mb-24px"
        :item="items[0]"
      />
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
      ProductUploadImage,
      ProductInfoCard,
      DetailInfoCard
    },
    data() {
      // todo 抓不到id
      // let loading = !!this.$route.params.id
      let type = 'update'
      // if (loading) {
      //   type = 'update'
      // }
      return {
        table_name,
        type
      }
    },
    computed: {
      ...mapState(table_name, {
        item: state => state.item,
        items: state => state.items,
      }),
    },

    methods: {
      // todo
      // initData() {
      //   this.initData()
      //   this.$store.dispatch('product/getRead')
      // }
    }
  }
</script>
<style>
</style>