/**
 * `WebsocketHeartbeatJs` constructor.
 *
 * @param {Object} opts
 * {
 *  url                  websocket链接地址
 *  pingTimeout 未收到消息多少秒之后发送ping请求，默认15000毫秒
    pongTimeout  发送ping之后，未收到消息超时时间，默认10000毫秒
    reconnectTimeout
    pingMsg ping 消息值
 * }
 * @api public
 */
import StoreUtils from './StoreUtils'

const { MessageInfoType } = require('./ChatUtils')

function WebsocketHeartbeatJs({
  url,
  pingTimeout = 20000,
  pongTimeout = 15000,
  reconnectTimeout = 5000,
  pingMsg = '{"action":' + MessageInfoType.MSG_PING + '}'
}) {
  this.opts = {
    url: url,
    pingTimeout: pingTimeout,
    pongTimeout: pongTimeout,
    reconnectTimeout: reconnectTimeout,
    pingMsg: pingMsg
  }
  this.ws = null // websocket实例

  // override hook function
  this.onclose = () => {}
  this.onerror = () => {}
  this.onopen = () => {}
  this.onmessage = () => {}
  this.onreconnect = () => {}

  this.createWebSocket()
}

WebsocketHeartbeatJs.prototype.createWebSocket = function() {
  try {
    if (this.ws != null) {
      return
    }
    const token = StoreUtils.getAccessToken()
    this.token = token
      .replace(/=/g, '%3D')
      .replace(/\+/g, '%2B')
      .replace(/[\s]/g, '%2F')
      .replace(/\?/g, '%3F')
    this.ws = new WebSocket(this.opts.url + '?token=' + token)
    this.initEventHandle()
  } catch (e) {
    this.reconnect()
    throw e
  }
}

WebsocketHeartbeatJs.prototype.initEventHandle = function() {
  this.ws.onclose = err => {
    console.log(111111111111111111, 'onclose', err)
    this.onclose()
    this.reconnect()
  }
  this.ws.onerror = error => {
    console.log(222222222222222, 'onerror', error)
    this.onerror(error)
    this.reconnect()
  }
  this.ws.onopen = () => {
    console.log(3333333333333333, 'onopen')
    this.onopen()
    // 心跳检测重置
    this.heartCheck()
  }
  this.ws.onmessage = event => {
    console.log(4444444444444, 'onmessage', event)
    this.onmessage(event)
    // 如果获取到消息，心跳检测重置
    // 拿到任何消息都说明当前连接是正常的
    this.heartCheck()
  }
}

WebsocketHeartbeatJs.prototype.reconnect = function() {
  if (this.lockReconnect || this.forbidReconnect) return
  this.lockReconnect = true
  this.onreconnect()
  // 没连接上会一直重连，设置延迟避免请求过多
  setTimeout(() => {
    this.createWebSocket()
    this.lockReconnect = false
  }, this.opts.reconnectTimeout)
}
WebsocketHeartbeatJs.prototype.send = function(msg) {
  this.ws.send(msg)
}
// 心跳检测
WebsocketHeartbeatJs.prototype.heartCheck = function() {
  this.heartReset()
  this.heartStart()
}
WebsocketHeartbeatJs.prototype.heartStart = function() {
  this.pingTimeoutId = setTimeout(() => {
    // 这里发送一个心跳，后端收到后，返回一个心跳消息，
    // onmessage拿到返回的心跳就说明连接正常
    this.ws.send(this.opts.pingMsg)
    // 如果超过一定时间还没重置，说明后端主动断开了
    this.pongTimeoutId = setTimeout(() => {
      // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      this.ws.close()
    }, this.opts.pongTimeout)
  }, this.opts.pingTimeout)
}
WebsocketHeartbeatJs.prototype.heartReset = function(e) {
  clearTimeout(this.pingTimeoutId)
  clearTimeout(this.pongTimeoutId)
}
WebsocketHeartbeatJs.prototype.close = function() {
  // 如果手动关闭连接，不再重连
  this.forbidReconnect = true
  this.ws.close()
}
if (window) window.WebsocketHeartbeatJs = WebsocketHeartbeatJs
export default WebsocketHeartbeatJs
