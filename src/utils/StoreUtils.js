class StoreUtils {
  static setJson(key, json) {
    localStorage.setItem(key, JSON.stringify(json))
  }

  static getJson(key) {
    if (!key) return null
    return JSON.parse(localStorage.getItem(key))
  }

  static setValue(key, value) {
    localStorage.setItem(key, value)
  }

  static getValue(key) {
    return localStorage.getItem(key)
  }

  static setToken(token) {
    return StoreUtils.setJson('token', token)
  }

  static getToken() {
    return StoreUtils.getJson('token')
  }

  static getAccessToken() {
    const token = StoreUtils.getJson('token')
    if (token) return token.accessToken
    return ''
  }

  static getJwtToken() {
    const token = StoreUtils.getJson('token')
    if (token && typeof token === 'string') return token
    else if (token && token instanceof Object) return token.jwtToken
    return ''
  }

  static setUser(user) {
    return StoreUtils.setJson('user', user)
  }

  static getUser() {
    return StoreUtils.getJson('user')
  }

  static setChatGroupList(chatList) {
    StoreUtils.setJson('chatGroupList', chatList)
  }

  static getChatGroupList() {
    return StoreUtils.getJson('chatGroupList')
  }

  static setFriendList(friendList) {
    StoreUtils.setJson('friendList', friendList)
  }

  static getFriendList() {
    return StoreUtils.getJson('friendList')
  }
}

export default StoreUtils
