import {
  Chat,
  ChatListUtils,
  MessageInfoType,
  transform
} from '@/utils/ChatUtils'
export default {
  setFlushTokenTimerId: function(state, flushTokenTimerId) {
    state.flushTokenTimerId = flushTokenTimerId
  },
  clearFlushTokenTimerId: function(state) {
    clearTimeout(state.flushTokenTimerId)
  },
  setToken: function(state, token) {
    state.token = token
  },
  setUser: function(state, user) {
    state.user = user
  },
  setUserFriendList: function(state, userFriendList) {
    state.userFriendList = userFriendList
  },
  setChatGroupList: function(state, chatGroupList) {
    state.chatGroupList = chatGroupList
  },
  setChatMap: function(state, chatMap) {
    state.chatMap = chatMap
  },
  setWebsocket: function(state, websocket) {
    state.websocket = websocket
  },
  // 发送给服务器
  sendMessage: function(state, message) {
    const msg = {
      action: MessageInfoType.MSG_MESSAGE,
      message: message
    }
    state.websocket.send(JSON.stringify(msg))
  },
  resetUnRead: function(state) {
    if (typeof state.currentChat === 'string') {
      state.currentChat = {}
    }
    state.currentChat['unReadCount'] = 0
  },
  // 退出登录
  closeConnect: function(state) {
    state.websocket.heartReset()
    state.websocket.close()
  },
  // 退出后清除内存中的聊天信息
  clear: function(state) {
    state.messageList = []
    state.messageListMap = new Map()
  },
  // 保存到内存
  addMessage: function(state, message) {
    message.content = transform(message.content)
    state.messageList.push(message)
    state.messageListMap[message.channelId] = state.messageList
  },
  // 在用户姓名下展示收到的最后一条信息
  setLastMessage: function(state, message) {
    const list = ChatListUtils.getChatList(state.user.id)
    const tempChatList = list.map(function(chat) {
      if (String(chat.channelId) === String(message.channelId)) {
        chat.sign = message.content
        chat.signTime = message.createTime
      }
      return chat
    })
    // 放入缓存
    ChatListUtils.setChatList(state.user.id, tempChatList)
    state.chatList = tempChatList
  },
  setMessageList: function(state, messageList) {
    state.messageList = messageList
  },
  setMessageListMap: function(state, messageListMap) {
    state.messageListMap = messageListMap
  },
  addUnreadMessage: function(state, message) {
    message.content = transform(message.content)
    // 从内存中取聊天信息
    let cacheMessages = state.messageListMap[message.channelId]
    if (cacheMessages) {
      cacheMessages.push(message)
    } else {
      cacheMessages = []
      cacheMessages.push(message)
      state.messageListMap[message.channelId] = cacheMessages
    }
  },
  setCurrentChat: function(state, currentChat) {
    if (typeof currentChat !== 'string') {
      state.currentChat = currentChat
      state.currentChat['unReadCount'] = 0
      const tempChatList = state.chatList.map(function(chat) {
        if (String(chat.channelId) === String(currentChat.channelId)) {
          chat['unReadCount'] = 0
        }
        return chat
      })
      // 放入缓存
      ChatListUtils.setChatList(state.user.id, tempChatList)
    } else {
      state.currentChat = {}
    }
  },
  setChatList: function(state, chatList) {
    state.chatList = chatList
  },
  delChat: function(state, chat) {
    state.chatList = ChatListUtils.delChat(state.user.id, chat)
  },
  /**
   * 设置未读消息条数
   * @param state state
   * @param message 消息
   */
  setUnReadCount: function(state, message) {
    const tempChatList = []
    let tempChat = {}
    for (const chat of state.chatList) {
      if (String(chat.channelId) === String(message.channelId)) {
        if (!chat['unReadCount']) {
          chat['unReadCount'] = 0
        }
        chat['unReadCount'] = chat['unReadCount'] + 1
        // chat.avatar = state.chatMap.get(message.channelId)?.avatar
        tempChat = chat
      } else {
        tempChatList.push(chat)
      }
    }
    // 聊天列表没有此人的chat
    if (!tempChat.channelId) {
      // const groupChat = state.chatMap.get(message.channelId)
      tempChat = new Chat(
        message.senderId,
        message.channelId,
        message.type,
        String(message.type) === '1' ? message.username : message.name,
        message.avatar,
        1,
        message.content
      )
    }
    // 添加到聊天室列表的第一个
    tempChatList.unshift(tempChat)
    // 重新设置chatList
    state.chatList = tempChatList
    // 放入缓存
    ChatListUtils.setChatList(state.user.id, tempChatList)
  }
}
