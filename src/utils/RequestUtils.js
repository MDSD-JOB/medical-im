import conf from '@/api/index.js'
import StoreUtils from './StoreUtils'
import WebsocketHeartbeatJs from './WebsocketHeartbeatJs'
import { logout, ErrorType, imageLoad, MessageInfoType } from './ChatUtils'

class RequestUtils {
  constructor() {
    this.instance = null
    this.isRefreshing = false
    this.subscribers = []
  }

  /**
   * 单例构造方法，构造一个广为人知的接口，供用户对该类进行实例化
   * @returns {RequestUtils}
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new RequestUtils()
    }
    return this.instance
  }

  /**
   * 带token的请求
   * @param url 请求路径
   * @param options 请求参数
   * @returns {Promise<Response | never>}
   */
  request(url, options) {
    const self = this
    const jwtToken = StoreUtils.getJwtToken()
    return self
      .timeoutFetch(
        fetch(url, {
          method: 'POST',
          model: 'cros', // 跨域
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'jwt-token': jwtToken
          },
          body: JSON.stringify(options)
        }),
        5000
      )
      .then(response => {
        return self.checkStatus(response, url, options)
      })
      .then(response => {
        return response.json()
      })
  }

  requestG(url, options) {
    const self = this
    const jwtToken = StoreUtils.getJwtToken()
    console.log('jwtToken', jwtToken)
    return self
      .timeoutFetch(
        fetch(url, {
          method: 'Get',
          model: 'cros', // 跨域
          headers: {
            'jwt-token': jwtToken
          }
        }),
        5000
      )
      .then(response => {
        return self.checkStatus(response, url, options)
      })
      .then(response => {
        return response.json()
      })
  }

  requestD(url, options) {
    const self = this
    const jwtToken = StoreUtils.getJwtToken()
    return self
      .timeoutFetch(
        fetch(url, {
          method: 'Delete',
          model: 'cros', // 跨域
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'jwt-token': jwtToken
          },
          body: JSON.stringify(options)
        }),
        5000
      )
      .then(response => {
        return self.checkStatus(response, url, options)
      })
      .then(response => {
        return response.json()
      })
  }
  /**
   * 检查token 是否失效，如果失效，刷新token
   * @param response 拦截的请求 response
   * @param url 请求路径
   * @param options 请求参数
   * @returns {Promise<any>|*}
   */
  checkStatus(response, url, options) {
    // eslint-disable-next-line no-console
    const self = this
    if (response && response.status === 401) {
      // eslint-disable-next-line no-console
      // 这个Promise函数很关键
      const p = new Promise(resolve => {
        self.addSubscriber(() => {
          resolve(self.request(url, options))
        })
      })
      // eslint-disable-next-line no-console
      // 刷新token的函数,这需要添加一个开关，防止重复请求
      if (!self.isRefreshing) {
        self.isRefreshing = true
        self.flushToken()
      }
      return p
    } else {
      return response
    }
  }

  /**
   * 重新执行token 失效的函数
   */
  onAccessTokenFetched() {
    const self = this
    // eslint-disable-next-line no-console
    self.subscribers.forEach(callback => {
      callback()
    })
    self.subscribers = []
  }

  /**
   * 把请求的token 失效的函数放到 subscribers
   * @param callback 请求的token 失效的函数
   */
  addSubscriber(callback) {
    const self = this
    // eslint-disable-next-line no-console
    self.subscribers.push(callback)
    // eslint-disable-next-line no-console
  }

  /**
   * 用户登录的方法
   * @param username 用户名
   * @param password 密码
   * @returns {Promise<Response>} 登录状态
   */
  login(username, password, vue) {
    const self = this
    const url = `${conf.getTokenUrl()}?username=${username.trim()}&password=${password.trim()}&grant_type=password&client_id=mdsd-im&client_secret=nlux3`
    return fetch(url, {
      method: 'POST',
      model: 'cros',
      headers: {
        Accept: 'application/json'
      }
    })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          return new Promise((resolve, reject) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('服务器错误')
          })
        }
      })
      .then(json => {
        if (json.code === '0') {
          const token = json.result
          // StoreUtils.setToken(token)
          vue.$store.commit('setToken', token)
          self.isRefreshing = false
          setTimeout(function() {
            self.isRefreshing = true
            // self.flushToken(vue)
          }, (json.expires_in - 10) * 1000)
          return new Promise(resolve => {
            resolve(token)
          })
        } else {
          return new Promise((resolve, reject) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('登陆失败，请重试！')
          })
        }
      })
  }

  /**
   * 刷新token
   * @returns {Promise<Response | never>}
   */
  flushToken(vue) {
    const self = this
    self.isRefreshing = true
    const param = new FormData()
    param.set('client_id', 'v-client')
    param.set('client_secret', 'v-client-ppp')
    param.set('grant_type', 'refresh_token')
    param.set('scope', 'select')
    param.set('refresh_token', StoreUtils.getToken().refresh_token)

    return fetch(conf.getTokenUrl(), {
      method: 'POST',
      model: 'cros', // 跨域
      headers: {
        Accept: 'application/json'
      },
      body: param
    })
      .then(response => {
        // eslint-disable-next-line no-console
        if (response.status === 200) {
          return response.json()
        } else {
          return new Promise((resolve, reject) => {
            reject(ErrorType.FLUSH_TOKEN_ERROR)
          })
        }
      })
      .then(json => {
        // StoreUtils.setToken(json)
        vue.$store.commit('setToken', json)
        // 把token 失效后的请求重新执行
        self.onAccessTokenFetched()
        self.isRefreshing = false

        // 清除原先的刷新缓存的定时器
        vue.$store.commit('clearFlushTokenTimerId')
        // 刷新token 定时器
        const flushTokenTimerId = setTimeout(function() {
          // self.flushToken(vue)
        }, (json.expires_in - 10) * 1000)
        // 将定时器存储到 $store
        vue.$store.commit('setFlushTokenTimerId', flushTokenTimerId)
      })
  }

  timeoutFetch(fetchPromise, timeout) {
    let abortFn = null

    // 这是一个可以被reject的promise
    const abortPromise = new Promise(function(resolve, reject) {
      abortFn = function() {
        reject(ErrorType.TIMEOUT_ERROR)
      }
    })

    // 这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    const abortAblePromise = Promise.race([fetchPromise, abortPromise])

    setTimeout(function() {
      abortFn()
    }, timeout)

    return abortAblePromise
  }

  /**
   * websocket 连接处理
   * @param self vue
   */
  webSocketOperation(self) {
    const websocketHeartbeatJs = new WebsocketHeartbeatJs({
      url: conf.getWsUrl()
    })
    websocketHeartbeatJs.onopen = function() {
      websocketHeartbeatJs.send('{"action":' + MessageInfoType.MSG_READY + '}')
    }

    websocketHeartbeatJs.onmessage = function(event) {
      const data = event.data
      const sendInfo = JSON.parse(data)
      // 真正的消息类型
      if (sendInfo.action === MessageInfoType.MSG_MESSAGE) {
        const message = sendInfo.message
        // 如果图片不带域名，加上域名
        if (message.avatar && message.avatar.indexOf('http') === -1) {
          message.avatar = conf.getHostUrl() + message.avatar
        }
        message.createTime = self.formatDateTime(new Date(message.createTime))
        // 接受人是当前的聊天窗口
        if (
          String(message.channelId) ===
          String(self.$store.state.currentChat.channelId)
        ) {
          if (String(message.senderId) !== self.$store.state.user.id) {
            self.$store.commit('addMessage', message)
          }
        } else {
          self.$store.commit('setUnReadCount', message)
          self.$store.commit('addUnreadMessage', message)
        }

        self.$store.commit('setLastMessage', message)
        // 每次滚动到最底部
        self.$nextTick(() => {
          imageLoad('message-box')
        })
      }
    }

    websocketHeartbeatJs.onreconnect = function() {
      console.log('已断开，尝试重连...')
    }

    let count = 0
    websocketHeartbeatJs.onerror = function() {
      // RequestUtils.getInstance()
      //   .flushToken(self)
      //   .catch(error => {
      //     count++
      //     if (ErrorType.NET_ERROR === error.toString()) {
      //       self.$Message.error('网络断开，正在重连...')
      //     } else if (ErrorType.FLUSH_TOKEN_ERROR === error) {
      //       count = 25
      //     }
      //   })
      // 重连次数大于24 退出登录
      if (count > 24) {
        console.log('重连失败，请重新登录！')
        count = 0
        logout(self)
      }
    }
    self.$store.commit('setWebsocket', websocketHeartbeatJs)
  }
}

export default RequestUtils.getInstance()
