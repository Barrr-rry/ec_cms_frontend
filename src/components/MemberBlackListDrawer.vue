<template>
  <c-drawer v-model="input" title="修改會員黑名單狀態"
            @ok="ok"
  >
    <div v-if="item">
      <h3>{{item.name}}</h3>
      <a-form :form="form" @submit="submitHandler">
        <c-form-item label="標註為黑名單">
          <a-radio-group v-decorator="['status',{rules:[],initialValue:true}]"
                         :disabled="!editPermission()"
          >
            <a-radio :value="true">
              是
            </a-radio>
            <a-radio :value="false">
              否
            </a-radio>
          </a-radio-group>
        </c-form-item>
        <c-form-item label="摘要">
          <a-input
            :disabled="!editPermission()"
            v-decorator="['description', { rules: [
            { required: true, message: '請輸入資料' },
            ]}]"
            placeholder="請輸入摘要內容"
          />
        </c-form-item>
        <div class="d-flex justify-content-end mb-24px">
          <a-button type="primary" html-type="submit">
            送 出
          </a-button>
          <a-button class="ml-12px" type="" @click="reset">
            重 置
          </a-button>
        </div>
      </a-form>
      <div class="flex-grow-1">
        <a-table :columns="columns" :dataSource="items"
                 :pagination="false"
                 :rowKey="record => record.id"
        >
          <div slot="status" slot-scope="text">
            <span v-if="text">是</span>
            <span v-else>否</span>
          </div>
        </a-table>
      </div>
    </div>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import momentMixin from "@/mixins/momentMixin"
  import moment from 'moment'

  const columns = [
    {
      title: '更新日期',
      align: 'center',
      dataIndex: 'create_at',
    },
    {
      title: '摘要',
      align: 'center',
      dataIndex: 'description',
    },
    {
      title: '是否為黑名單',
      align: 'center',
      dataIndex: 'status',
      scopedSlots: {customRender: 'status'},
    },
  ]

  export default {
    mixins: [momentMixin, drawerMixin],
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
        return this.item ? this.item.blacklist_record ? this.item.blacklist_record : [] : []
      }
    },
    methods: {
      editPermission() {
        return this.permissioncheck('permission_member_manage', 2)
      },
      apiSuccessHandler() {
        // overwrite
        // 不改input
        this.initCallback()
        this.reset()
      },
      ok() {
        this.input = false
      },
      reset() {
        this.form.resetFields()
      },
      updateHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values.member = this.item.id
          return this.defaultThenProcess(this.$api.blacklistrecord.postData(values).then(() => {
            this.$message.success('修改黑名單成功')
          }))
        })
      },
    }
  }
</script>

<style scoped>
</style>
