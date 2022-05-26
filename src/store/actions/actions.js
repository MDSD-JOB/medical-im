import storage from 'store'
import conf from '@/api'
import RequestUtils from '@/utils/RequestUtils'
import StoreUtils from '@/utils/StoreUtils'
import { ChatListUtils } from '@/utils/ChatUtils'
export default {
  // 登录
  GetPermission({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await RequestUtils.requestG(conf.getPermissionUrl())
        if (token && token.code === '-1') {
          reject(new Error('用户登录失败!'))
          commit('setToken', null)
        } else {
          resolve(token)
          StoreUtils.setToken(token)
          commit('setToken', token)
        }
      } catch (err) {
        reject(new Error(err))
      }
    })
  },
  // 获取权限
  GetAuthorize({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await RequestUtils.requestG(conf.getInitUrl())
        if (res && res.code === '0') {
          const json = res.result
          resolve(json)
          // 个人信息
          commit('setUser', json.user)
          //  当前聊天
          ChatListUtils.setChatList(json.user.id, [
            ...json.imUsers,
            ...json.imGroups
          ])
          // 群
          commit('setChatGroupList', json.imGroups)
          // 把群组封装到map中
          const chatMap = new Map()
          json.imGroups.forEach(group => {
            chatMap.set(group.id, group)
          })
          commit('setChatMap', chatMap)
        } else {
          reject(new Error('请求用户权限失败!'))
          commit('setUser', null)
          commit('setChatGroupList', null)
          commit('setChatMap', null)
        }
      } catch (err) {
        reject(new Error(err))
      }
    })
  },
  // 清除权限
  ClearPermission({ commit }) {
    return new Promise(async resolve => {
      commit('setToken', '')
      commit('setUser', null)
      commit('setChatGroupList', null)
      commit('setChatMap', null)
      storage.clearAll()
      resolve()
    })
  }
}
