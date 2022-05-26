import Vue from 'vue'
import MedSvg from './index.vue' // svg组件

// 注册到全局
Vue.component('med-svg', MedSvg)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@assets/icons', false, /\.svg$/)
requireAll(req)
