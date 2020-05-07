import Vue from 'vue'

let bus = new Vue({
  data() {
    return {
      // todo 不知道要解決什麼問題 如果需要應該改成 vuex 會更好
      has_popover: false,
      dropwon_trigger: false,
      timer: false,
      window: {
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    mobile_size() {
      return this.window.width < 768
    },
  },
  methods: {
    // todo 不知道要解決什麼問題
    closeDropdown() {
      this.dropwon_trigger = !this.dropwon_trigger
    },
    td_size_init() {
      let h = 98 * window.innerHeight / 1306
      window.$('.route-layout .desktop-layout .ant-table-tbody > tr > td').css({height: `${h}px`})
    },

    window_resize_listener() {
      window.$(window).resize(() => {
        if (this.timer === false) {
          setTimeout(() => {
            this.td_size_init()
            this.timer = false
          }, 400)
        }
        this.timer = true

      })
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight
    }

  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
})
Object.defineProperty(Vue.prototype, '$bus', {
  get() {
    return this.$root.bus
  }
})

export default bus