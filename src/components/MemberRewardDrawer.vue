<template>
  <c-drawer v-model="input" title="修改會員回饋金"
            @ok="submitHandler"
  >
    <div v-if="item">
      <h3>{{item.name}}</h3>
      <a-form :form="form" @submit="submitHandler">
        <c-form-item label="目前回饋點數" v-if="item">
          <a href="#">{{item.returns}}</a> 點
        </c-form-item>
        <c-form-item label="目前回饋點數到期日" v-if="item">
          <a href="#">{{item.reward_end_date}}</a>
        </c-form-item>
        <c-form-item label="修改回饋點數">
          <a-input-group compact
          >
            <a-select default-value="+"
                      v-model="positive"
            >
              <a-select-option value="+">
                +
              </a-select-option>
              <a-select-option value="-">
                -
              </a-select-option>
            </a-select>
            <a-input
              type="number"
              style="width: 542px"
              placeholder="請輸入數字"
              :disabled="!editPermission()"
              v-decorator="['point', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
            />
          </a-input-group>
        </c-form-item>
        <c-form-item label="修改回饋到期日">
          <a-date-picker
            :disabled="!editPermission()"
            v-decorator="['end_date', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
            placeholder="請選擇回饋到期日"
          />
        </c-form-item>
        <c-form-item label="摘要">
          <a-input
            :disabled="!editPermission()"
            v-decorator="['desc', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
            placeholder="請輸入摘要內容"
          />
        </c-form-item>
        <div class="flex-grow-1">
          <a-table :columns="columns" :dataSource="items"
                   :pagination="false"
                   :rowKey="record => record.id"
          >
            <div slot="point" slot-scope="text">
              <span v-show="text>0">+</span>
              {{text}}
            </div>
          </a-table>
        </div>
      </a-form>
    </div>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import momentMixin from "@/mixins/momentMixin"

  const columns = [
    {
      title: '更新日期',
      align: 'center',
      dataIndex: 'created_at',
    },
    {
      title: '摘要',
      align: 'center',
      dataIndex: 'desc',
    },
    {
      title: '回饋點數變動',
      align: 'center',
      dataIndex: 'point',
      scopedSlots: {customRender: 'point'},
    },
    {
      title: '回饋點數餘額',
      align: 'center',
      dataIndex: 'total_point',
    },
  ]

  export default {
    mixins: [momentMixin, drawerMixin],
    data() {
      return {
        positive: '+',
        columns,
        default_api: this.$api.member,
        // for check to add
        // fake_data: {}
      }
    },
    computed: {
      items() {
        return this.item ? this.item.reward ? this.item.reward : [] : []
      }
    },
    methods: {
      editPermission() {
        return this.permissioncheck('permission_member_manage', 2)
      },
      createValueTransfer(values) {
        if (this.positive === '-') {
          values.point = -values.point
        }
        values.end_date = this.toDateStr(values.end_date)
        return values
      },
      updateHandler(e) {
        this.submitValidate(e, (values) => {
          console.log(values, this.positive)
          values = this.removeBlankValue(values)
          values = this.createValueTransfer(values)
          values.member = this.item.id
          return this.defaultThenProcess(this.$api.rewardrecord.postData(values).then(() => {
            this.$message.success('新增會員回饋金成功')
          }))
        })
      },
    }
  }
</script>

<style scoped>
</style>
