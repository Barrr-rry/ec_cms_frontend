import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  data() {
    return {
      default_api: this.$api.product,
      editor: ClassicEditor,
      editor_data: ``,
      editorConfig: {
        toolbar: ['heading', 'insertTable'],
        heading: {
          // 設定 Heading 內的樣式，可新增多個
          options: [
            {
              model: 'paragraph',
              title: '內文',
              view: {
                name: 'p',
                classes: ''
              },
            },
            {
              model: 'li',
              title: '標號',
              view: 'li',
              class: 'li'
            },
            {
              model: '斜體',
              title: '斜體',
              view: 'em',
              class: 'em'
            },
            {
              model: '標題一',
              view: {
                name: 'p',
                classes: 'strong'
              },
              title: '標題一',
              class: 'strong'
            },
            {
              model: '紅色內文',
              view: {
                name: 'div',
                classes: 'red'
              },
              title: '紅色內文',
              class: 'red'
            },
          ]
        },
      },
      product_key: null,
    }
  },
  computed: {},
  methods: {
    initFields() {
      this.editor_data = this.item[this.product_key] || ''
    },
    submitHandler() {
      let values = {
        [this.product_key]: this.editor_data
      }
      return this.defaultThenProcess(this.default_api.putData(this.item.id, values))
    },
  }
}
