export default {
  token: {},
  // 当前的用户
  user: {},
  websocket: {},
  // 内存中的聊天记录
  messageListMap: new Map(),
  // 聊天群的映射 id->chat
  chatMap: new Map(),
  messageList: [],
  // 当前聊天窗口
  currentChat: {},
  // 所有的聊天窗口
  chatList: [],
  // 好友列表
  userFriendList: [],
  // 刷新token 定时器
  flushTokenTimerId: null,
  // 群组列表
  chatGroupList: []
}
