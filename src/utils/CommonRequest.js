import conf from '@/api/index.js'
import RequestUtils from './RequestUtils'

// 创建频道
export function getCreateEvent(param) {
  return RequestUtils.request(conf.getCreateEvent(), param).then(json => {
    if (json.code === '0') {
      return new Promise(resolve => {
        resolve(json.result)
      })
    } else {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(json.message || '创建失败，请重试！')
      })
    }
  })
}

// 删除频道
export function getDeleteEvent(channelId, param) {
  return RequestUtils.requestD(
    conf.getDeleteEvent() + '/' + channelId,
    param
  ).then(json => {
    if (json.code === '0') {
      return new Promise(resolve => {
        resolve(json.result)
      })
    } else {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(json.message || '删除失败，请重试！')
      })
    }
  })
}

// 退出频道
export function getLeaveEvent(param) {
  return RequestUtils.request(conf.getLeaveEvent(), param).then(json => {
    if (json.code === '0') {
      return new Promise(resolve => {
        resolve(json.result)
      })
    } else {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(json.message || '退出失败，请重试！')
      })
    }
  })
}

// 获取历史消息
export function getHistoryMessage(param) {
  return RequestUtils.request(conf.getHisUrl(), param).then(json => {
    if (json.code === '0') {
      return new Promise(resolve => {
        resolve(json.result)
      })
    } else {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(json.message || '获取失败，请重试！')
      })
    }
  })
}
