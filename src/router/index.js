import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes.config.js'

Vue.use(Router)

export default () => {
  return new Router({
    mode: 'history',
    routes
  })
}
