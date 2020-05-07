<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>優惠管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>運費管理</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>運費管理</h3>
      <div>管理運費規則與免運優惠</div>
    </div>
    <div class="container-fluid pt-24px">
      <FreeshippingCard
        v-for="item of items"
        :key="item.id"
        :title="item.logistics_type_text"
        class="mb-24px"
        :item="item"
      />
    </div>

  </a-layout-content>
</template>
<script>
  import pageMixin from "@/mixins/pageMixin"
  import {mapState} from 'vuex'
  import FreeshippingCard from "@/components/FreeshippingCard"


  let table_name = 'freeshipping'
  export default {
    mixins: [pageMixin],
    components: {
      FreeshippingCard
    },
    data() {
      return {
        table_name
      }
    },
    computed: {
      ...mapState(table_name, {
        items: state => state.items,
      })
    },

    methods: {}
  }
</script>
<style>
</style>