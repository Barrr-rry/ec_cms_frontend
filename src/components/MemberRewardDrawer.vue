<template>
  <c-drawer v-model="input" title="修改會員回饋金"
            @ok="submitHandler"
  >
    <h3>{{item.name}}</h3>
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="目前回饋點數" v-if="item">
        <a href="#">{{item.returns}}</a> 點
      </c-form-item>
      <c-form-item label="目前回饋點數到期日" v-if="item">
        <a href="#">{{item.reward_end_date}}</a>
      </c-form-item>
      <c-form-item label="修改回饋點數">
        <a-input-group compact>
          <a-select default-value="Option1">
            <a-select-option value="Option1">
              +
            </a-select-option>
            <a-select-option value="Option2">
              -
            </a-select-option>
          </a-select>
          <a-input
                  style="width: 542px"
                  :disabled="!editPermission()"
                  v-decorator="['name', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
                  placeholder="請輸入數字"
          />
        </a-input-group>
      </c-form-item>
      <c-form-item label="修改回饋到期日">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['name', { rules: [
            { required: false, message: '請輸入資料' },
            ]}]"
          placeholder="請選擇回饋到期日"
        />
      </c-form-item>
      <c-form-item label="摘要">
        <a-input
          :disabled="!editPermission()"
          v-decorator="['account', { rules: [
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
            <d v-show="text>0">+</d>{{text}}
          </div>
        </a-table>
      </div>
    </a-form>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"

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
    mixins: [drawerMixin],
    data() {
      return {
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
      deleteHandler(callback, err) {
        return this.defaultThenProcess(
          this.default_api.deleteData(this.item.id).then(() => {
            callback()
            this.$message.success('刪除會員成功')
          })
        )


      },
      createHandler(e) {
        this.submitValidate(e, (values) => {
          let phone = values.phone
          if (phone) {
            values.phone = `${phone.area}-${phone.local}#${phone.ext}`
          }
          values = this.removeBlankValue(values)
          values = this.createValueTransfer(values)
          return this.defaultThenProcess(this.default_api.postData(values).then(() => {
            this.$message.success('新增會員成功')
          }))
        })
      },
    }
  }
</script>

<style scoped>
</style>
