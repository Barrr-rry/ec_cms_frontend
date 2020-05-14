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
      <SpecificationCard
        v-if="configsetting.product_specifications_setting===2"
        :item="item"
        :level="1"
        class="mb-24px"
        ref="spec_level1"
        @onChange="specChange"
      />
      <SpecificationCard
        v-if="configsetting.product_specifications_setting===2"
        :item="item"
        :level="2"
        class="mb-24px"
        ref="spec_level2"
        @onChange="specChange"
      />
      <SpecificationMergeCard
        v-if="configsetting.product_specifications_setting===2"
        :item="item"
        class="mb-24px"
        ref="spec_merge"

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
  import SpecificationCard from "@/components/SpecificationCard"
  import SpecificationMergeCard from "@/components/SpecificationMergeCard"
  import configsettingMixin from "@/mixins/configsettingMixin"


  let table_name = 'product'
  export default {
    mixins: [configsettingMixin, pageMixin],
    components: {
      ProductEditCard,
      // ProductUploadImage,
      ProductInfoCard,
      DetailInfoCard,
      SpecificationCard,
      SpecificationMergeCard,
    },
    data() {
      let type = this.$route.params.id === 'create' ? 'create' : 'update'
      return {
        init_merge: false,
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
      initSpecMergeData() {
        this.initColumns()
        this.initTable()
      },
      initTable() {
        let data = []
        let key = 0
        // first init
        if (!this.init_merge) {
          this.init_merge = true
          for (let el of this.item.specifications_detail) {
            data.push({
              key: key++,
              inventory_status: el.inventory_status,
              level1_spec: el.spec1_name,
              level2_spec: el.spec2_name,
              price: el.price,
              product: el.product,
              product_code: el.product_code,
              quantity: el.quantity,
              weight: el.weight,
            })
          }
        } else {
          let spec1_table = this.$refs.spec_level1.cacheData
          // todo 可能只有一個
          let spec2_table = this.$refs.spec_level2.cacheData
          for (let spec1 of spec1_table) {
            for (let spec2 of spec2_table) {
              data.push({
                key: key++,
                level1_spec: spec1.name,
                level2_spec: spec2.name,
                // todo
                fake_price: null,
                price: null,
                inventory_status: null,
                weight: null,
                quantity: null,

              })
            }
          }
        }
        this.$refs.spec_merge.cacheData = [...data]
        this.$refs.spec_merge.data = [...data]
      },
      initColumns() {
        let target1 = this.$refs.spec_merge.columns.filter(x => x.dataIndex === 'level1_spec')[0]
        target1.title = this.$refs.spec_level1.name
        let target2 = this.$refs.spec_merge.columns.filter(x => x.dataIndex === 'level2_spec')[0]
        target2.title = this.$refs.spec_level2.name
        this.$refs.spec_merge.has_level2 = !!this.$refs.spec_level2.cacheData.length
      },
      specChange() {
        this.initSpecMergeData()
      },
      mergeSpecificationValues(values) {
        // 詳細規格
        if (this.configsetting.product_specifications_setting === 2) {
          // 規格1
          let specification_level1 = []
          for (let el of this.$refs.spec_level1.cacheData) {
            specification_level1.push({
              name: el.name
            })
          }
          values.specification_level1 = specification_level1
          // 規格2
          let specification_level2 = []
          for (let el of this.$refs.spec_level2.cacheData) {
            specification_level2.push({
              name: el.name
            })
          }
          values.specification_level2 = specification_level2
          // 規格細節
          let specifications_detail_data = [...this.$refs.spec_merge.cacheData]
          for (let el of specifications_detail_data) {
            if (el.hasOwnProperty('key')) {
              delete el['key']
            }
          }
          values.specifications_detail_data = specifications_detail_data
        }
        return values
      },
      submitPopoup(callback) {
        this.$refs.product_edit_card.submitHandler().then(values => {
          values = this.mergeSpecificationValues(values)
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
          this.$nextTick(() => {
            this.initSpecMergeData()
          })

        })
      }

    }
  }
</script>
<style>
</style>