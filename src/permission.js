import storage from 'store'
import Router from './router'
import Store from './store'

const router = new Router()
const store = new Store()
const isProd = ['prod', 'production'].includes(process.env.NODE_ENV)

const allowList = ['Login', '404']

router.beforeEach(async (to, from, next) => {
  const jwtToken = to.query.token || storage.get('token') || null
  storage.set('token', jwtToken)
  if (allowList.includes(to.name)) {
    next()
  } else {
    // todo: 上线修改
    if (!isProd && jwtToken && from.path === '/') {
      store
        .dispatch('GetPermission')
        .then(() => {
          store
            .dispatch('GetAuthorize')
            .then(() => {
              next()
            })
            .catch(() => {
              store.dispatch('ClearPermission').then(() => {
                next({
                  path: '/404',
                  query: {
                    message: '获取权限失败，请重试！'
                  }
                })
              })
            })
        })
        .catch(() => {
          store.dispatch('ClearPermission').then(() => {
            next({
              path: '/404',
              query: {
                message: '登录失败，请重试！'
              }
            })
          })
        })
    } else if (jwtToken) {
      next()
    } else {
      next({ name: 'Login' })
    }
  }
})

export { router, store }
