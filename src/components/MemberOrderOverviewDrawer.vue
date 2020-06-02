<template>
  <c-drawer v-model="input" :title="`${item.name}的訂單`"
            @ok="submitHandler"
            @delete="deleteHandler"
            v-if="item"
  >
    <h3>歷史訂單</h3>
    <a-table :columns="columns" :dataSource="item.order"
             :rowKey="record => record.id"
             :pagination="false"
             :showHeader="false"
    >
      <div slot="simple_status_display" slot-scope="text">
        <a-badge :status="statusBadge(text)" :text="text"></a-badge>
      </div>
      <div slot="order_detail" slot-scope="text, record">
        <h3>訂單編號 ： {{record.order_number}}</h3>
        <div>{{content(record.product_shot)}}</div>
        <div class="d-flex justify-content-between">
          <div>訂單日期 ： {{record.created_at}}</div>
          <div>金額 ： {{record.total_price}}</div>
        </div>
      </div>
      <div slot="operation" slot-scope="text, record">
        <a href="#" @click="openUpdateDrawer(record)">訂單總覽</a>
      </div>
    </a-table>
    <MemberOrderOverviewDetailDrawer
      v-model="update_drawer"
      :item="item"
      :order="target"
      ref="drawer"
    />

  </c-drawer>

</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import MemberOrderOverviewDetailDrawer from "@/components/MemberOrderOverviewDetailDrawer"

  const columns = [
    {
      title: '',
      width:'120px',
      dataIndex: 'simple_status_display',
      scopedSlots: {customRender: 'simple_status_display'},
    },
    {
      title: '',
      dataIndex: 'order_detail',
      scopedSlots: {customRender: 'order_detail'},
    },
    {
      title: '',
      width:'100px',
      dataIndex: 'operation',
      scopedSlots: {customRender: 'operation'},
    },
  ]


  export default {
    mixins: [drawerMixin],
    components: {
      MemberOrderOverviewDetailDrawer
    },
    data() {
      return {
        columns,
        update_drawer: false,
        default_api: this.$api.order,
        target: null,
      }
    },
    computed: {},
    methods: {
      content(product_shot) {
        let items = JSON.parse(product_shot)
        let ret = items.map(item => {
          let rett = ''
          for (let i in item.specifications_detail) {
            rett += `${item.name}/${item.specifications_detail[i].spec1_name}/${item.specifications_detail[i].spec2_name}/X${item.specifications_detail[i].quantity}/$${item.specifications_detail[i].price}`
          }
          return rett
        })

        return ret.join('、')
      },
      openUpdateDrawer(target, callback) {
        this.target = target
        if (!callback) {
          this.update_drawer = true
        } else {
          callback()
        }
      },
      statusBadge(text) {
        let ret = 'default'
        let mapping = {
          error: ['物流異常', '退貨待取'],
          warning: ['待出貨'],
          success: ['已取貨'],
          process: ['待取貨']
        }
        for (let key in mapping) {
          if (mapping[key].includes(text)) {
            ret = key
          }
        }
        return ret
      },
      getStore(obj) {
        if (!obj.to_store) {
          return '宅配'
        }
        let mapping = {
          'FAMI': '全家',
          'UNIMART': '7-11',
          'HILIFE': '萊爾富'
        }
        return `超商 ( ${mapping[obj.store_type]} )`
      },
      apiFailHandler(err) {
        this.input = false
        this.initCallback()
      },
      submitHandler(e) {
        this.input = false
      }
    }
  }
</script>

<style scoped>
</style>
