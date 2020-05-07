<template>
  <c-drawer v-model="input" :title="type==='create'?'新增首頁大圖':'修改首頁大圖'"
            @ok="submitHandler"
            :displayDelete="type!=='create'"
            @delete="deleteHandler"
  >
    <h3>{{type==='create'?'新增首頁大圖':'修改首頁大圖'}}</h3>
    <a-form :form="form" @submit="submitHandler">
      <c-form-item label="大標題">
        <a-input
          v-decorator="['title_1', { rules: [] }]"
          placeholder="請輸入大標題 ， 如不輸入則隱藏文案"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="英文大標題">
        <a-input
          v-decorator="['title_2', { rules: [] }]"
          placeholder="請輸入大標題 ， 如不輸入則隱藏文案"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="副標題">
        <a-input
          v-decorator="['subtitle_1', { rules: [] }]"
          placeholder=" ( 標題上方小字 ) 請輸入副標題 ， 如不輸入則隱藏文案"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="英文副標題">
        <a-input
          v-decorator="['subtitle_2', { rules: [] }]"
          placeholder=" ( 標題上方小字 ) 請輸入副標題 ， 如不輸入則隱藏文案"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="敘述">
        <a-input
          v-decorator="['description_1', { rules: [] }]" type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          placeholder="請輸入描述 ， 如不輸入則隱藏文案"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="英文敘述">
        <a-input
          v-decorator="['description_2', { rules: [] }]" type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          placeholder="請輸入描述 ， 如不輸入則隱藏文案"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="按鈕名稱">
        <a-input
          v-decorator="['button_1', { rules: [] }]"
          placeholder=" 請輸入按鈕名稱 ， 如不輸入則隱藏按鈕"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="英文按鈕名稱">
        <a-input
          v-decorator="['button_2', { rules: [] }]"
          placeholder=" 請輸入按鈕名稱 ， 如不輸入則隱藏按鈕"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="連結">
        <a-input
          v-decorator="['link', { rules: [] }]"
          placeholder="請輸入連結網址 ， 首頁大圖與按鈕使用相同連結"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="大圖"
                   extra="圖片建議上傳尺寸 1920 px x 700 px ， 格式 .jpg .png .svg"
      >
        <c-upload
          :disabled="!editPermissioncheck()"
          ref="uploads_1"
          :type="type"
          v-decorator="[
          'bigimage',
          { rules: [
            { required: true, message: '請輸入資料' },
            ],
            ...mixinUpload,
          },

          ]"
        />
      </c-form-item>
      <c-form-item label="小圖"
                   extra="圖片建議上傳尺寸 576 px x 480 px ， 格式 .jpg .png .svg   如不顯示則不需上傳"
      >
        <c-upload
          :disabled="!editPermissioncheck()"
          ref="uploads_2"
          :type="type"
          v-decorator="[
          'smallimage',
          mixinUpload,
          ]"
        />

      </c-form-item>
      <c-form-item label="上架類型">
        <a-radio-group v-decorator="['display_type',{rules:[],initialValue:display_type}]"
                       @change="displayTypeHandler"
                       :disabled="!editPermissioncheck()"
        >
          <a-radio :value="true">
            持續顯示
          </a-radio>
          <a-radio :value="false">
            選擇區間
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="持續時間">
        <a-range-picker
          v-decorator="['rangePicker',{rules: [{ type: 'array', }]}]"
          :disabled="display_type || !editPermissioncheck()"
        />
      </c-form-item>
      <c-form-item label="啟用狀態">
        <a-radio-group v-decorator="['status',{rules:[],initialValue:true}]" :disabled="!editPermissioncheck()"
        >
          <a-radio :value="true">
            啟用
          </a-radio>
          <a-radio :value="false">
            停用
          </a-radio>
        </a-radio-group>
      </c-form-item>
      <c-form-item label="選擇排序">
        <a-input-number
          :min="1"
          v-decorator="['queue', { rules: [],initialValue: 1 }]"
          :disabled="!editPermissioncheck()"
        />
      </c-form-item>
    </a-form>
  </c-drawer>
</template>

<script>
  import drawerMixin from "@/mixins/drawerMixin"
  import uploadMixin from "@/mixins/uploadMixin"
  import momentMixin from "@/mixins/momentMixin"

  export default {
    mixins: [drawerMixin, uploadMixin, momentMixin],
    data() {
      return {
        display_type: true,
        update_field_keys: [
          'title_1',
          'title_2',
          'subtitle_1',
          'subtitle_2',
          'description_1',
          'description_2',
          'button_1',
          'button_2',
          'link',
          'bigimage',
          'smallimage',
          'display_type',
          'rangePicker',
          'status',
          'queue',
        ],
        default_api: this.$api.banner,
        // for check to add
        // fake_data: {}
      }
    },
    methods: {
      displayTypeHandler(e) {
        this.display_type = e.target.value
      },
      initFields() {
        let obj = {}
        for (let content of this.item.content) {
          for (let key in content) {
            if (!content.hasOwnProperty(key)) {
              continue
            }
            let initial_key = `${key}_${content.language_type}`
            if (!this.update_field_keys.includes(initial_key)) {
              continue
            }
            obj[initial_key] = content[key]
          }
        }
        for (let key in this.item) {
          if (!this.item.hasOwnProperty(key)) {
            continue
          }
          if (this.update_field_keys.includes(key)) {
            obj[key] = this.item[key]
          }
        }
        if (this.item.start_time && this.item.end_time) {
          obj.rangePicker = [this.toMoment(this.item.start_time), this.toMoment(this.item.end_time)]
        }
        this.display_type = this.item.display_type
        this._initFileds(obj)
      },
      createValueTransfer(values) {
        let language_obj = {}
        let ret = {}
        // update data picker
        if (values.display_type) {
          values.rangePicker = []
        }
        if (values.rangePicker.length) {
          values.start_time = this.toDateStr(values.rangePicker[0])
          values.end_time = this.toDateStr(values.rangePicker[1])
          delete values.rangePicker
        }
        for (let key in values) {
          if (/_\d/.test(key)) {
            let language_type = /\d/.exec(key)[0]
            if (!(language_type in language_obj)) {
              language_obj[language_type] = {}
            }
            let language_key = /[a-z]+/.exec(key)[0]
            language_obj[language_type][language_key] = values[key]
          } else {
            ret[key] = values[key]
          }
        }
        let content = []
        for (let key in language_obj) {
          language_obj[key].language_type = key
          content.push(language_obj[key])
        }
        ret.content = content
        return ret
      },
      updateValueTransfer(values) {
        values = this.createValueTransfer(values)
        for (let content of values.content) {
          for (let raw_data of this.item.content) {
            if (parseInt(content.language_type) === parseInt(raw_data.language_type)) {
              content.id = raw_data.id
            }
          }
        }
        return values
      },
      deleteHandler(callback, err) {
        return this.defaultThenProcess(
                this.default_api.deleteData(this.item.id).then(() => {
                  callback()
                  this.$message.success('刪除首頁大圖成功')
                })
        )


      },
      updateHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.updateValueTransfer(values)
          return this.defaultThenProcess(this.default_api.putData(this.item.id, values).then(() => {
            this.$message.success('更新首頁大圖成功')
          }))
        })


      },
      createHandler(e) {
        this.submitValidate(e, (values) => {
          values = this.removeBlankValue(values)
          values = this.createValueTransfer(values)
          return this.defaultThenProcess(this.default_api.postData(values).then(() => {
            this.$message.success('新增首頁大圖成功')
          }))
        })
      },
    }
  }
</script>

<style scoped>
</style>
