import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import '@/assets/sass/main.sass'
import eventBus from './eventBus'
import {VueAxios} from "@/utils/request"
import {VueAPI} from "@/api"
import Storage from 'vue-ls'
import CFormItem from "./components/CFormItem"
import CDrawer from "./components/CDrawer"
import CBadge from "./components/CBadge"
import CPopover from "@/components/CPopover"
import CUpload from "@/components/CUpload"
import CKEditor from '@ckeditor/ckeditor5-vue'
import globalMixin from "@/mixins/globalMixin"

Vue.mixin(globalMixin)

Vue.component('CFormItem', CFormItem)
Vue.component('CDrawer', CDrawer)
Vue.component('CBadge', CBadge)
Vue.component('CPopover', CPopover)
Vue.component('CUpload', CUpload)

// todo 正式要改掉
Vue.config.productionTip = false
Vue.use(VueAxios)
Vue.use(VueAPI)
Vue.use(Antd)
Vue.use(CKEditor)

let options = {
  namespace: 'vuejs__',
  name: 'ls',
  storage: 'local',
};

Vue.use(Storage, options)


Vue.filter('commaFormat', function (value) {
  // 加上千分位符號
  return value
    .toString()
    .replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
      return pre + groupOf3Digital.replace(/\d{3}/g, ',$&')
    })
})

new Vue({
  data() {
    return {
      bus: eventBus
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
