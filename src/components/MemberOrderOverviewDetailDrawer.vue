<template>
  <c-drawer v-model="input" title="訂單編號"
            @delete="deleteHandler"
            v-if="item&&order"
            deleteText="取 消 出 貨"
            :displayDelete="item&&order&&!order.to_store&&order.simple_status_display!=='已取消'"
  >
    <h3>訂購人資料</h3>
    <table style="width: 400px" class="mb-24px order-table">
      <tr>
        <td class="text-right">會員姓名:</td>
        <td class="pl-16px">{{item.name}}</td>
      </tr>
      <tr>
        <td class="text-right">會員帳號:</td>
        <td class="pl-16px">{{item.account}}</td>
      </tr>
      <tr>
        <td class="text-right">付款方式:</td>
        <td class="pl-16px">{{order.pay_type?'貨到付款':'線上付款'}}</td>
      </tr>

    </table>
    <a-divider/>
    <h3>收件人資料</h3>
    <div class="d-flex justify-content-lg-between mb-24px">
      <table style="width: 400px" class="order-table">
        <tr>
          <td class="text-right">收貨人姓名:</td>
          <td class="pl-16px">{{order.shipping_name}}</td>
        </tr>
        <tr>
          <td class="text-right">收貨人電話:</td>
          <td class="pl-16px">{{order.phone}}</td>
        </tr>
        <tr v-show="order.to_store">
          <td class="text-right">寄件編號:</td>
          <td class="pl-16px"><a href="">{{order.all_pay_logistics_id}}</a></td>
        </tr>
        <tr>
          <td class="text-right">出貨方式:</td>
          <td class="pl-16px">{{getStore(order)}}</td>
        </tr>
        <tr v-show="!order.to_store">
          <td class="text-right">郵遞區號:</td>
          <td class="pl-16px">{{order.shipping_area}}</td>
        </tr>
        <tr v-show="!order.to_store">
          <td class="text-right">收貨地址:</td>
          <td class="pl-16px">{{order.shipping_address}}</td>
        </tr>
        <tr v-show="order.to_store">
          <td class="text-right">取貨店名:</td>
          <td class="pl-16px">{{order.store_name}}({{order.address}})</td>
        </tr>
        <tr v-if=false>
          <td class="text-right">收貨人抬頭:</td>
          <td class="pl-16px">{{order.company_title}}</td>
        </tr>
        <tr v-if=false>
          <td class="text-right">收貨人統編:</td>
          <td class="pl-16px">{{order.bussiness_number}}</td>
        </tr>
        <tr>
          <td class="text-right">訂單備註:</td>
          <td class="pl-16px">{{order.order_remark}}</td>
        </tr>
        <tr>
          <td class="text-right pa-0px">
            <div>內部備註:</div>
          </td>
          <td class="pl-16px pb-0px">
            {{order.display_remark_date}}
            <br>
            {{order.remark}}
            <!--            <div>{{item.remark_date}}</div>-->
            <!--            <div>{{item.remark}}</div>-->
          </td>
        </tr>
      </table>
      <div class="d-flex align-content-end">
        <a-button @click="callbackCheck(()=>update_drawer=true,editPermission())">編 輯</a-button>
      </div>
    </div>
    <a-divider/>
    <h3>訂單資料</h3>
    <a-table :columns="columns" :dataSource="products"
             :rowKey="record => record.id"
             :pagination="false"
             :showHeader="false"
             :locale="{emptyText:'目前無資料'}"
    >
      <div slot="image" slot-scope="text,record">
        <img :src="img_path(record.productimages)" alt="" style="width: auto; height: auto; max-height: 150px">
      </div>
      <div slot="name" slot-scope="text,record">
        <h3>{{record.name}}</h3>
        <div>規格: {{spec_name(record)}}</div>
      </div>
      <div slot="price" slot-scope="text,record">
        <div>金額: {{record.specification_detail.price|commaFormat}}</div>
        <div v-show="configsetting.weight">重量: {{record.specification_detail.weight}}</div>
      </div>
      <div slot="quantity" slot-scope="text,record">
        <div>數量: {{record.quantity}}</div>
      </div>
      <div slot="total" slot-scope="text,record">
        <div>小計: ${{record.quantity*record.specification_detail.price|commaFormat}}</div>
      </div>
    </a-table>
    <div class="mt-24px">
      <div class="d-flex d-center gray-text" v-if="configsetting.weight">
        總重量: {{order.total_weight}} kg
      </div>
      <div class="d-flex d-center gray-text">
        商品總金額: ${{order.product_price}}
      </div>
      <div class="d-flex d-center gray-text">
        運費: +${{order.freeshipping_price}}
      </div>
      <div class="d-flex d-center gray-text">
        優惠券折抵: -${{order.coupon_price}}
      </div>
      <div class="d-flex d-center gray-text">
        忠誠點數折抵: -${{order.reward_price}}
      </div>
      <div class="d-flex d-center gray-text">
        總計: ${{order.total_price}}
      </div>
      <div class="d-flex d-center gray-text" v-if="getSpec(order)">
        本次消費金額可獲得回饋金: <a href="">{{order.rewrad_temp[0].point}}</a> 點
      </div>
      <div class="d-flex d-center gray-text" v-if="getSpec(order)">
        預計於 <a href="">{{order.rewrad_temp[0].start_date}}</a> 發放
      </div>
      <div class="d-flex d-center">
        <a-button @click="callbackCheck(()=>reward_drawer=true,editPermission())">修 改</a-button>
      </div>
    </div>

    <order-remark-drawer
            v-if="type==='update'"
            v-model="update_drawer"
            :item="order"
            :okCallback="updateRemark"
            ref="drawer"
    ></order-remark-drawer>
    <order-reward-drawer
            v-if="type==='update'"
            v-model="reward_drawer"
            :item="order.rewrad_temp[0]"
            :okCallback="updateReward"
            ref="reward_drawer"
    ></order-reward-drawer>

  </c-drawer>

</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import OrderRemarkDrawer from "@/components/OrderRemarkDrawer"
  import OrderRewardDrawer from "@/components/OrderRewardDrawer"
  import configsettingMixin from "@/mixins/configsettingMixin"

  const columns = [
    {
      title: '圖片',
      dataIndex: 'image',
      scopedSlots: {customRender: 'image'},
    },
    {
      title: '名稱',
      dataIndex: 'name',
      scopedSlots: {customRender: 'name'},
    },
    {
      title: '金額',
      dataIndex: 'price',
      scopedSlots: {customRender: 'price'},
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      scopedSlots: {customRender: 'quantity'},
    },
    {
      title: '小計',
      dataIndex: 'total',
      scopedSlots: {customRender: 'total'},
    },
  ]


  export default {
    mixins: [drawerMixin, configsettingMixin],
    components: {
      OrderRemarkDrawer,
      OrderRewardDrawer,
    },
    props: {
      order: {
        type: Object,
        default: null
      },
    },
    data() {
      return {
        columns,
        update_drawer: false,
        reward_drawer: false,
        default_api: this.$api.order,
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
      products() {
        let ret = []
        if (!this.order) {
          return ret
        }
        return JSON.parse(this.order.product_shot)

      },
    },
    methods: {
      spec_name(record){
        if(record.specification_detail.spec2_name){
          return `${record.specification_detail.spec1_name}/${record.specification_detail.spec2_name}`
        }
        return record.specification_detail.spec1_name
      },
      getSpec(record){
        if(record.shipping_status != 400){
          return true
        }
        return false
      },
      editPermission() {
        return this.permissioncheck('permission_member_manage', 2)
      },
      deleteHandler(callback) {
        let values = {
          shipping_status: 400
        }
        return this.defaultThenProcess(
                this.default_api.putData(this.order.id, values).then(() => {
                  callback()
                })
        )

      },
      updateReward() {
        this.$refs.reward_drawer.form.validateFields((err, values) => {
          if (!err) {
            this.$api.rewardrecord.putData(this.order.rewrad[0].id, values).then(() => {
              this.order.rewrad[0].point = values.point
              this.reward_drawer = false
            }).catch((err) => {
              this.$message.error(err.response.data)
            })
          }

        })
      },
      updateRemark() {
        this.$refs.drawer.form.validateFields((err, values) => {
          if (!err) {
            this.$api.order.putData(this.order.id, values).then((res) => {
              this.order.remark = values.remark
              this.order.display_remark_date = res.data.display_remark_date
              this.update_drawer = false
            }).catch((err) => {
              this.$message.error(err.response.data)
            })
          }

        })
      },
      img_path(images) {
        let path = ''
        for (let img of images) {
          if (img.main_image) {
            path = img.image_url
          }
        }
        return this.$axios.baseURL.replace('/api/', '/media/') + path
      },
      getStore(obj) {
        if (!obj.to_store) {
          return '宅配到府'
        }
        let mapping = {
          'FAMI': '全家',
          'UNIMART': '7-11',
          'HILIFE': '萊爾富'
        }
        return `超商 ( ${mapping[obj.store_type]} )`
      }
    }
  }
</script>

<style scoped>
</style>
