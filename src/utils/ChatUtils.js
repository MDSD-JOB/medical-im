// 格式化时间
export function formatDateTime(date) {
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  let second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

export function isGroupChat(chat) {
  return chat.type === '1'
}

/**
 * 毫秒转换友好的显示格式
 * 输出格式：21小时前
 * @param  {[type]} date 日期
 */
export function dateStr(date) {
  if (!date) return ''
  const now = new Date(date.split(' ')).getTime()
  // 获取js 时间戳
  let time = new Date().getTime()
  // 去掉 js 时间戳后三位
  time = parseInt((time - now) / 1000)
  // 存储转换值
  let s
  if (time < 60 * 10) {
    // 十分钟内
    return '刚刚'
  } else if (time < 60 * 60 && time >= 60 * 10) {
    // 超过十分钟少于1小时
    s = Math.floor(time / 60)
    return s + '分钟前'
  } else if (time < 60 * 60 * 24 && time >= 60 * 60) {
    // 超过1小时少于24小时
    s = Math.floor(time / 60 / 60)
    return s + '小时前'
  } else if (time < 60 * 60 * 24 * 3 && time >= 60 * 60 * 24) {
    // 超过1天少于3天内
    s = Math.floor(time / 60 / 60 / 24)
    return s + '天前'
  } else {
    // 超过3天
    // eslint-disable-next-line no-use-before-define
    const date = new Date(parseInt(date) * 1000)
    return (
      date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    )
  }
}

/**
 * 聊天会话
 */
export class Chat {
  constructor(
    senderId, // 发送者id
    channelId, // 频道id
    type, // 消息类型
    name, // 姓名
    avatar, // 头像
    unReadCount, // 未读消息数
    lastMessage // 最近消息
  ) {
    this.senderId = senderId
    this.channelId = channelId
    this.type = type
    this.name = name
    this.avatar = avatar
    this.unReadCount = unReadCount
    this.lastMessage = lastMessage
  }
}

/**
 * 图片加载完成处理函数
 * @param arr 图片的src集合
 * @returns {Promise}
 */
function preloadImages(arr) {
  let loadedImage = 0
  const images = []
  return new Promise(function(resolve, reject) {
    for (let i = 0; i < arr.length; i++) {
      images[i] = new Image()
      images[i].src = arr[i]
      images[i].onload = function() {
        loadedImage++
        if (loadedImage === arr.length) {
          resolve()
        }
      }
      images[i].onerror = function() {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject()
      }
    }
  })
}

/**
 * 图片加载完成，聊天对话框scroll拉到最下
 * @param id 容器id
 */
export function imageLoad(id) {
  scrollBottom(id)
  const messageBox = document.getElementById(id)
  if (messageBox) {
    const images = messageBox.getElementsByTagName('img')
    if (images) {
      const arr = []
      for (let i = 0; i < images.length; i++) {
        arr[i] = images[i].src
      }
      preloadImages(arr)
        .then(() => {
          scrollBottom(id)
        })
        .catch(function() {
          scrollBottom(id)
        })
    }
  }
}

/**
 * 滚动条到最下方
 * @param id 容器id
 */
function scrollBottom(id) {
  const div = document.getElementById(id)
  if (div) {
    div.scrollTop = div.scrollHeight
  }
}

export const faceUtils = {
  alt: [
    '[微笑]',
    '[嘻嘻]',
    '[哈哈]',
    '[可爱]',
    '[可怜]',
    '[挖鼻]',
    '[吃惊]',
    '[害羞]',
    '[挤眼]',
    '[闭嘴]',
    '[鄙视]',
    '[爱你]',
    '[泪]',
    '[偷笑]',
    '[亲亲]',
    '[生病]',
    '[太开心]',
    '[白眼]',
    '[右哼哼]',
    '[左哼哼]',
    '[嘘]',
    '[衰]',
    '[委屈]',
    '[吐]',
    '[哈欠]',
    '[抱抱]',
    '[怒]',
    '[疑问]',
    '[馋嘴]',
    '[拜拜]',
    '[思考]',
    '[汗]',
    '[困]',
    '[睡]',
    '[钱]',
    '[失望]',
    '[酷]',
    '[色]',
    '[哼]',
    '[鼓掌]',
    '[晕]',
    '[悲伤]',
    '[抓狂]',
    '[黑线]',
    '[阴险]',
    '[怒骂]',
    '[互粉]',
    '[心]',
    '[伤心]',
    '[猪头]',
    '[熊猫]',
    '[兔子]',
    '[ok]',
    '[耶]',
    '[good]',
    '[NO]',
    '[赞]',
    '[来]',
    '[弱]',
    '[草泥马]',
    '[神马]',
    '[囧]',
    '[浮云]',
    '[给力]',
    '[围观]',
    '[威武]',
    '[奥特曼]',
    '[礼物]',
    '[钟]',
    '[话筒]',
    '[蜡烛]',
    '[蛋糕]'
  ],
  faces: function() {
    const self = this
    const arr = {}
    for (let i = 0; i < self.alt.length; i++) {
      arr[self.alt[i]] = './static/face/' + i + '.gif'
    }
    return arr
  }
}

export function transform(content) {
  // 支持的html标签
  const html = function(end) {
    return new RegExp(
      '\\n*\\[' +
        (end || '') +
        '(code|pre|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)]\\n*',
      'g'
    )
  }
  const fa = faceUtils.faces()
  if (content) {
    content = content
      .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;') // XSS
      .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2')

      .replace(/face\[([^\s\\[\]]+?)]/g, function(face) {
        // 转义表情
        const alt = face.replace(/^face/g, '')
        return (
          '<img alt="' +
          fa[alt] +
          '" title="' +
          fa[alt] +
          '" src="' +
          fa[alt] +
          '">'
        )
      })
      .replace(/img\[([^\s]+?)]/g, function(img) {
        // 转义图片
        const href = img.replace(/(^img\[)|(]$)/g, '')
        return (
          '<img class="message-img" src="' +
          href +
          '" alt="消息图片不能加载" style="max-width:2.5rem;">'
        )
      })
      .replace(/file\([\s\S]+?\)\[[\s\S]*?]/g, function(str) {
        // 转义文件
        const href = (str.match(/file\(([\s\S]+?)\)\[/) || [])[1]
        const text = (str.match(/\)\[([\s\S]*?)]/) || [])[1]
        if (!href) return str
        return (
          '<a class="message-file" href="' +
          href +
          '"><i class="ivu-icon ivu-icon-md-arrow-down"></i>' +
          (text || href) +
          '</a>'
        )
      })
      .replace(/audio\[([^\s]+?)]/g, function(audio) {
        // 转义音频
        return (
          '<div class="message-audio" data-src="' +
          audio.replace(/(^audio\[)|(]$)/g, '') +
          '"><i class="layui-icon">&#xe652;</i><p>音频消息</p></div>'
        )
      })
      .replace(/video\[([^\s]+?)]/g, function(video) {
        // 转义音频
        return (
          '<div class="message-video"  data-src="' +
          video.replace(/(^video\[)|(]$)/g, '') +
          '"><i class="layui-icon">&#xe652;</i></div>'
        )
      })
      .replace(/a\([\s\S]+?\)\[[\s\S]*?]/g, function(str) {
        // 转义链接
        const href = (str.match(/a\(([\s\S]+?)\)\[/) || [])[1]
        const text = (str.match(/\)\[([\s\S]*?)]/) || [])[1]
        if (!href) return str
        return (
          '<a href="' + href + '" target="_blank">' + (text || href) + '</a>'
        )
      })
      .replace(html(), '<$1 $2>')
      .replace(html('/'), '</$1>') // 转移HTML代码
      .replace(/\n/g, '<br>') // 转义换行
  }
  return content
}

export const ChatListUtils = {
  listKey: '_chatList',
  setChatList: function(userId, chatList) {
    localStorage.setItem(userId + this.listKey, JSON.stringify(chatList))
  },
  // 从缓存中获取已经保存的会话
  getChatList: function(userId) {
    const str = localStorage.getItem(userId + this.listKey)
    if (!str) {
      return []
    }
    return JSON.parse(str)
  },
  // 删除聊天会话框
  delChat: function(userId, chat) {
    const tempChatList = []
    for (const item of this.getChatList(userId)) {
      if (String(item.channelId) !== String(chat.channelId)) {
        tempChatList.push(item)
      }
    }
    // 放入缓存
    this.setChatList(userId, tempChatList)
    return tempChatList
  },
  /**
   * 刷新会话列表
   * @param self 当前对象
   * @param user 用户
   * @param host 主机名
   * @param type 0 单聊 1 群聊
   * @returns {Chat} 当前会话
   */
  resetChatList: function(self, user, host, type, channelId) {
    const chatList = this.getChatList(self.$store.state.user.id)
    // 删除当前用户已经有的会话
    const newChatList = chatList.filter(function(element) {
      return String(element.channelId) !== String(channelId)
    })

    let avatar = user.avatar
    if (user.avatar?.indexOf(host) === 0) {
      avatar = user.avatar
    } else {
      avatar = host + user.avatar
    }

    // 重新添加会话，放到第一个
    const chat = new Chat(
      user.id,
      channelId,
      type,
      user.name,
      user.avatar,
      0,
      ''
    )
    newChatList.unshift(chat)
    this.setChatList(self.$store.state.user.id, chatList)
    self.$store.commit('setChatList', newChatList)
    return chat
  }
}

/**
 * 退出登录
 * @param self vue this对象
 */
export function logout(self) {
  self.$store.commit('closeConnect')
  self.$store.commit('clear')
  self.$store.commit('clearFlushTokenTimerId')
  self.$router.push({
    path: '/login',
    params: {}
  })
}

export const ErrorType = {
  TIMEOUT_ERROR: 9, // 超时
  TOKEN_ERROR: 401, // token 失效错误
  PARAM_ERROR: 400, // 参数错误
  FLUSH_TOKEN_ERROR: 7, // 刷新token错误
  SERVER_ERROR: 500, // 服务器错误
  NET_ERROR: 'TypeError: Failed to fetch' // 网络链接不通
}
// 信息的类型 MSG_PING 心跳 、MSG_READY 链接就绪  MSG_MESSAGE 消息
export const MessageInfoType = {
  MSG_PING: 'PING_MESSAGE',
  MSG_READY: 'READY_MESSAGE',
  MSG_MESSAGE: 'NEW_MESSAGE'
}
// 信息的目标类型 FRIEND 私聊 、CHAT_GROUP 群聊
export const MessageTargetType = {
  FRIEND: '1',
  CHAT_GROUP: '0'
}
