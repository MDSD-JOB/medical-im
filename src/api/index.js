export default {
  http_protocol: 'http',
  ws_protocol: 'ws',
  token_path: '/mdsdim/oauth2/password', // 登录
  init: '/mdsdim/authority/getloginuserinfo', // 获取用户信息
  permission: `/mdsdim/oauth2/authorize?response_type=code&scope=openid&client_id=mdsd-im&client_secret=nlux3&redirect_uri=${window.GLOBAL_APP_API_HTTP_URL}:${window.GLOBAL_APP_API_HTTP_PORT}/mdsdim/oauth2/callback`,
  createEvent: '/mdsdim/channel/createEvent', // 创建一个聊天频道
  deleteEvent: '/mdsdim/channel/deleteEvent', // 删除频道
  leaveEvent: '/mdsdim/channel/leaveEvent', // 退出频道
  user: '/mdsdim/imuser/getUserByDeptIdAndName', // 获取当前院区下所有好友
  his_url: '/mdsdim/message/historyMessage', // 历史消息
  chat_users_url: '/api/user/chatUserList',
  file_url: '/cloud-rbac/file/file_upload_im?clientSign=cloud-rbac', // 文件上传
  getHostUrl: function() {
    return (
      this.http_protocol +
      '://' +
      window.GLOBAL_APP_API_HTTP_URL +
      ':' +
      window.GLOBAL_APP_API_HTTP_PORT
    )
  },
  getWsUrl: function() {
    return (
      this.ws_protocol +
      '://' +
      window.GLOBAL_APP_API_WS_URL +
      ':' +
      window.GLOBAL_APP_API_WS_PORT
    )
  },
  getFileUrl: function() {
    return (
      this.http_protocol +
      '://' +
      window.GLOBAL_APP_API_HTTP_URL +
      ':' +
      window.GLOBAL_APP_API_FILE_PORT +
      this.file_url
    )
  },
  getTokenUrl: function() {
    return this.getHostUrl() + this.token_path
  },
  getPermissionUrl: function() {
    return this.getHostUrl() + this.permission
  },
  getInitUrl: function() {
    return this.getHostUrl() + this.init
  },
  getCreateEvent: function() {
    return this.getHostUrl() + this.createEvent
  },
  getDeleteEvent: function() {
    return this.getHostUrl() + this.deleteEvent
  },
  getLeaveEvent: function() {
    return this.getHostUrl() + this.leaveEvent
  },
  getUserUrl: function() {
    return this.getHostUrl() + this.user
  },
  getChatUsersUrl: function() {
    return this.getHostUrl() + this.chat_users_url
  },
  getHisUrl: function() {
    return this.getHostUrl() + this.his_url
  },
  getRegisterUrl: function() {
    return this.getHostUrl() + this.register_url
  }
}
