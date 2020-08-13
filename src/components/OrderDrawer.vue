<template>
  <c-drawer v-model="input" title="訂單編號"
            @ok="submitHandler"
            @delete="deleteHandler"
            v-if="item"
            deleteText="取 消 出 貨"
            :displayDelete="item&&!item.to_store&&item.simple_status_display!=='已取消'"
  >
    <h3>訂購人資料</h3>
    <table style="width: 400px" class="mb-24px order-table">
      <tr>
        <td class="text-right">會員姓名:</td>
        <td class="pl-16px">{{item.member_name}}</td>
      </tr>
      <tr>
        <td class="text-right">會員帳號:</td>
        <td class="pl-16px">{{item.member_account}}</td>
      </tr>
      <tr>
        <td class="text-right">付款方式:</td>
        <td class="pl-16px">{{item.pay_type?'貨到付款':'線上付款'}}</td>
      </tr>

    </table>
    <a-divider/>
    <h3>收件人資料</h3>
    <div class="d-flex justify-content-lg-between mb-24px">
      <table style="width: 400px" class="order-table">
        <tr>
          <td class="text-right">收貨人姓名:</td>
          <td class="pl-16px">{{item.shipping_name}}</td>
        </tr>
        <tr>
          <td class="text-right">收貨人電話:</td>
          <td class="pl-16px">{{item.phone}}</td>
        </tr>
        <tr>
          <td class="text-right">寄件編號:</td>
          <td class="pl-16px"><a href="">{{item.all_pay_logistics_id}}</a></td>
        </tr>
        <tr>
          <td class="text-right">出貨方式:</td>
          <td class="pl-16px">{{getStore(item)}}</td>
        </tr>
        <tr v-show="!item.to_store">
          <td class="text-right">郵遞區號:</td>
          <td class="pl-16px">{{item.shipping_area}}</td>
        </tr>
        <tr v-show="!item.to_store">
          <td class="text-right">收貨地址:</td>
          <td class="pl-16px">{{item.shipping_address}}</td>
        </tr>
        <tr v-show="item.to_store">
          <td class="text-right">取貨店名:</td>
          <td class="pl-16px">{{item.store_name}}({{item.address}})</td>
        </tr>
        <tr v-if=false>
          <td class="text-right">收貨人抬頭:</td>
          <td class="pl-16px">{{item.company_title}}</td>
        </tr>
        <tr v-if=false>
          <td class="text-right">收貨人統編:</td>
          <td class="pl-16px">{{item.bussiness_number}}</td>
        </tr>
        <tr>
          <td class="text-right">訂單備註:</td>
          <td class="pl-16px">{{item.order_remark}}</td>
        </tr>
        <tr>
          <td class="text-right pa-0px">
            <div>內部備註:</div>
          </td>
          <td class="pl-16px pb-0px">
            {{item.display_remark_date}}
            <br>
            {{item.remark}}
            <!--            <div>{{item.remark_date}}</div>-->
            <!--            <div>{{item.remark}}</div>-->
          </td>
        </tr>
      </table>
      <div class="d-flex align-content-end">
        <a-button
          @click="callbackCheck(()=>update_drawer=true,editPermission())">編 輯
        </a-button>
      </div>
    </div>
    <a-divider/>
    <h3>訂單資料</h3>
    <a-table :locale="{emptyText:'目前無資料'}" :columns="columns" :dataSource="products"
             :rowKey="record => record.id"
             :pagination="false"
             :showHeader="false"
    >
      <div slot="image" slot-scope="text,record">
        <img :src="img_path(record.productimages)" alt="" width="100" height="100">
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
      <div class="d-flex d-center gray-text">
        <div v-show="configsetting.weight">總重量: {{item.total_weight}} kg</div>
      </div>
      <div class="d-flex d-center gray-text">
        商品總金額: ${{item.product_price}}
      </div>
      <div class="d-flex d-center gray-text">
        運費: +${{item.freeshipping_price}}
      </div>
      <div class="d-flex d-center gray-text">
        優惠券折抵: -${{item.coupon_price}}
      </div>
      <div class="d-flex d-center gray-text">
        忠誠點數折抵: -${{item.reward_price}}
      </div>
      <div class="d-flex d-center gray-text">
        總計: ${{item.total_price}}
      </div>
      <div class="d-flex d-center gray-text" v-if="getSpec(item)">
        本次消費金額可獲得忠誠獎勵: <a href="">{{reward_target.point}}</a> 點
      </div>
      <div class="d-flex d-center gray-text" v-if="getSpec(item)">
        預計於 <a href="">{{reward_target.start_date}}</a> 發放
      </div>
      <div class="d-flex d-center">
        <a-button
          @click="callbackCheck(()=>reward_drawer=true,editPermission())"
          :disabled="!in_temp"
        >修 改
        </a-button>
      </div>
    </div>

    <order-remark-drawer
      v-if="type==='update'"
      v-model="update_drawer"
      :item="item"
      :okCallback="updateRemark"
      ref="drawer"
    ></order-remark-drawer>
    <order-reward-drawer
      v-if="type==='update'"
      v-model="reward_drawer"
      :item="item.rewrad[0]"
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
      in_temp() {
        return this.item.rewrad_temp.length > 0
      },
      reward_target() {
        if (this.in_temp) {
          return this.item.rewrad_temp[0]
        } else {
          return this.item.rewrad[0]
        }
      },
      products() {
        let ret = []
        if (!this.item) {
          return ret
        }
        return JSON.parse(this.item.product_shot)

      },
    },
    methods: {
      spec_name(record) {
        if (record.specification_detail.spec2_cn_name) {
          return `${record.specification_detail.spec1_cn_name} / ${record.specification_detail.spec2_cn_name}`
        }
        return record.specification_detail.spec1_cn_name
      },
      getSpec(record) {
        return record.shipping_status !== 400
      },
      editPermission() {
        return this.permissioncheck('permission_order_manage', 2)
      },
      deleteHandler(callback) {
        let values = {
          shipping_status: 400
        }
        return this.defaultThenProcess(
          this.default_api.putData(this.item.id, values).then(() => {
            callback()
          })
        )

      },
      updateReward() {
        if (!this.in_temp) {
          return
        }
        this.$refs.reward_drawer.form.validateFields((err, values) => {
          if (!err) {
            this.$api.rewardrecordtemp.putData(this.item.rewrad_temp[0].id, values).then(() => {
              this.item.rewrad_temp[0].point = values.point
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
            this.$api.order.putData(this.item.id, values).then((res) => {
              this.item.remark = values.remark
              this.item.display_remark_date = res.data.display_remark_date
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
          return '宅配'
        }
        let mapping = {
          'FAMI': '全家',
          'UNIMART': '7-11',
          'HILIFE': '萊爾富'
        }
        return `超商 ( ${mapping[obj.store_type]} )`
      },
      updateHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.updateValueTransfer(values)
          return this.defaultThenProcess(this.default_api.putData(this.item.id, values))
        })

      },
    }
  }
</script>

<style scoped>
</style>
