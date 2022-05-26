import Vue from 'vue'
import App from './App.vue'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import 'lib-flexible/flexible.js'

import _ from 'lodash'
import moment from 'vue-moment'
import storage from 'store'
import { router, store } from './permission'

import './components/special/MedSvg'
import './plugins/vant'
import components from './plugins/components'
import Bridge from './utils/bridge.js'
import { dateStr, formatDateTime } from './utils/ChatUtils.js'

import './assets/styles/index.less'
import './assets/iconfonts/iconfont.css'

Vue.prototype.$bridge = Bridge
Vue.prototype._ = _
Vue.prototype._storage = storage

Vue.use(moment)
Vue.use(components)
Vue.prototype.formatDateTime = formatDateTime
Vue.prototype.dateStr = dateStr
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
