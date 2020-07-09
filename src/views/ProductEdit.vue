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
      <ProductUploadImage
        class="mb-24px"
        :item="item"
        ref="product_upload_image"
        :specifications_image="specifications_image"
      />
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
      <div class="d-flex justify-content-center align-items-center">
        <a-button @click="$router.go(-1)" class="mr-8px">
          取消
        </a-button>
        <c-popover
          @ok="submitPopoup"
        >
          <template slot="content">
            <p>
              確定要發布嗎?
            </p>
          </template>
          <a-button class="ml-8px" type="primary" html-type="submit">
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
      ProductUploadImage,
      ProductInfoCard,
      DetailInfoCard,
      SpecificationCard,
      SpecificationMergeCard,
    },
    data() {
      let type = this.$route.params.id === 'create' || this.$route.params.id === undefined ? 'create' : 'update'
      return {
        init_merge: false,
        table_name,
        type,
        default_api: this.$api.product,
        specifications_image: [],
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
        this.initImages()
        this.initTable()
      },
      initImages() {
        let spec1_table = this.$refs.spec_level1.cacheData
        this.specifications_image = spec1_table
      },
      initTable() {
        let data = []
        let key = 0
        // first init
        if (!this.init_merge) {
          this.init_merge = true
          // 會有可能沒有資料 ex: type=create
          if (this.item) {
            for (let el of this.item.specifications_detail) {
              // key1,key 2 是比較 到時候價錢等 不會跟著變動被刪除
              let spec1 = this.$refs.spec_level1.cacheData.filter(x => x.id === el.level1_spec)[0]
              let spec2 = this.$refs.spec_level2.cacheData.filter(x => x.id === el.level2_spec)[0]
              if (!spec2) {
                spec2 = {
                  key: null
                }
              }
              data.push({
                id: el.id,
                key: key++,
                key1: spec1.key,
                key2: spec2.key,
                inventory_status: el.inventory_status,
                level1_spec: el.spec1_name,
                level2_spec: el.spec2_name,
                fake_price: el.fake_price,
                price: el.price,
                product: el.product,
                product_code: el.product_code,
                quantity: el.quantity,
                weight: el.weight,
              })
            }
          }
        } else {
          let cacheData = [...this.$refs.spec_merge.cacheData]
          let spec1_table = this.$refs.spec_level1.cacheData
          let spec2_table = this.$refs.spec_level2.cacheData
          // 更新 has_level2_spec 狀態
          this.$refs.spec_merge.has_level2_spec = true
          if (!spec2_table.length) {
            spec2_table = [{key: null, name: null}]
            this.$refs.spec_merge.has_level2_spec = false
          }
          for (let spec1 of spec1_table) {
            for (let spec2 of spec2_table) {
              let target = cacheData.filter(x => x.key1 === spec1.key && x.key2 === spec2.key)[0]
              if (!target) {
                target = {
                  id: null,
                  fake_price: null,
                  price: null,
                  inventory_status: null,
                  weight: null,
                  quantity: null,
                }
              }
              data.push({
                id: target.id,
                key: key++,
                key1: spec1.key,
                key2: spec2.key,
                level1_spec: spec1.name,
                level2_spec: spec2.name,
                fake_price: target.fake_price,
                price: target.price,
                inventory_status: target.inventory_status,
                weight: target.weight,
                quantity: target.quantity,

              })
            }
          }
        }
        this.$refs.spec_merge.cacheData = [...data]
        this.$refs.spec_merge.data = [...data]
      },
      initTableAfterSubtmitFailed() {
        let data = []
        let key = 0
        let cacheData = [...this.$refs.spec_merge.cacheData]
        let spec1_table = this.$refs.spec_level1.cacheData
        let spec2_table = this.$refs.spec_level2.cacheData
        // 更新 has_level2_spec 狀態
        this.$refs.spec_merge.has_level2_spec = true
        if (!spec2_table.length) {
          spec2_table = [{key: null, name: null}]
          this.$refs.spec_merge.has_level2_spec = false
        }
        let idx = 0
        for (let spec1 of spec1_table) {
          for (let spec2 of spec2_table) {
            let target = cacheData[idx]
            idx += 1
            if (!target) {
              target = {
                id: null,
                fake_price: null,
                price: null,
                inventory_status: null,
                weight: null,
                quantity: null,
                product_code: null,
              }
            }
            data.push({
              id: target.id,
              key: key++,
              key1: spec1.key,
              key2: spec2.key,
              level1_spec: spec1.name,
              level2_spec: spec2.name,
              fake_price: target.fake_price,
              price: target.price,
              inventory_status: target.inventory_status,
              weight: target.weight,
              quantity: target.quantity,
              product_code: target.product_code,

            })
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
            let obj = {
              name: el.name,
            }
            if (el.id) {
              obj.id = el.id
            }
            specification_level1.push(obj)
          }
          values.specification_level1 = specification_level1
          // 規格2
          let specification_level2 = []
          for (let el of this.$refs.spec_level2.cacheData) {
            let obj = {
              name: el.name,
            }
            if (el.id) {
              obj.id = el.id
            }
            specification_level2.push(obj)
          }
          values.specification_level2 = specification_level2
          // 規格細節
          let specifications_detail_data = [...this.$refs.spec_merge.cacheData]
          for (let el of specifications_detail_data) {
            // remove key
            for (let key of ['key', 'key1', 'key2']) {
              if (el.hasOwnProperty(key)) {
                delete el[key]
              }
            }
          }
          values.specifications_detail_data = specifications_detail_data
        }
        return values
      },
      submitPopoup(callback) {
        let promise_list = [
          this.$refs.product_upload_image.submitHandler(),
          this.$refs.product_edit_card.submitHandler()
        ]
        Promise.all(promise_list).then(value_list => {
          let values = {}
          for (let v of value_list) {
            values = {...v, ...values}
          }
          if (this.configsetting.product_specifications_setting==2){
            values.level1_title = this.$refs.spec_level1.name
            if (this.$refs.spec_level2.name) {
              values.level2_title = this.$refs.spec_level2.name
            }
          }
          values = this.mergeSpecificationValues(values)
          values.product_info = this.$refs.product_info_card.editor_data
          values.detail_info = this.$refs.detail_info_card.editor_data
          for (let detail_data of values.specifications_detail_data) {
            if (detail_data.price === '' || detail_data.price === null) {
              this.$message.warning('請輸入商品售價')
              this.initTableAfterSubtmitFailed()
              callback()
              return
            }
            if (detail_data.quantity === '' || detail_data.quantity === null) {
              this.$message.warning('請輸入商品數量')
              this.initTableAfterSubtmitFailed()
              callback()
              return
            }
          }
          if (this.type === 'update') {
            this.submitUpdate(values).then(() => {
              callback()
            }).catch((err) => {
              let message = '其他錯誤'
              try {
                message = err.response.data.non_field_errors[0]
              } catch (e) {
                console.log('error:', err.response.data)
              }
              this.$message.warning(message)
              this.initTableAfterSubtmitFailed()
              callback()
            })
          } else {
            this.submitCreate(values).then(() => {
              callback()
            }).catch((err) => {
              let message = '其他錯誤'
              try {
                message = err.response.data.non_field_errors[0]
              } catch (e) {
                console.log('error:', err.response.data)
              }
              this.$message.warning(message)
              this.initTableAfterSubtmitFailed()
              callback()
            })
          }
        }).catch(()=>{
          this.$message.warning('請確認輸入資料')
          callback()
        })
      },
      submitUpdate(values) {
        return this.default_api.putData(this.$route.params.id, values).then(() => {
          this.$message.success('更新商品成功')
          setTimeout(() => {
            this.$router.push('/products')
          }, 500)
        })
      },
      submitCreate(values) {
        return this.default_api.postData(values).then(() => {
          this.$message.success('新增商品成功')
          setTimeout(() => {
            this.$router.push('/products')
          }, 500)
        })
      },
      initData() {
        let promise_list = [
          this.$store.dispatch('brand/getList'),
          this.$store.dispatch('tag/getList'),
          this.$store.dispatch('category/getList'),
          this.$store.dispatch('activity/getList'),
        ]
        if (this.type === 'create') {
          this.$store.commit(`${this.table_name}/changeValue`, {
            key: 'item',
            value: null
          })
        } else {
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