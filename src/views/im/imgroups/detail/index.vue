<template>
  <med-view-container
    class="im-chat-detail-wrapper"
    :title="chat.name"
    returnLabel="聊天"
    @return="handleReturn"
  >
    <template #bottom-part>
      <div class="input">
        <van-icon name="volume-o" @click="switchRecoder" v-if="recorderFlag" />
        <i class="iconfont icon-keyboard" @click="switchRecoder" v-else />
        <div class="inputs" v-if="recorderFlag">
          <im-img-uploader @imgSend="imgSend" />
          <van-field
            v-model="messageContent"
            type="textarea"
            rows="1"
            :autosize="{ maxHeight: 40 }"
          />
          <van-button type="primary" round @click="textSend">发送</van-button>
        </div>
        <div class="recorders" v-else>
          <im-audio-recoder @send="voiceSend" />
        </div>
      </div>
    </template>
    <div id="message-box" class="scroll-wrapper">
      <section class="chat-detail clearfix">
        <div
          :class="{
            chat: true,
            cleft: item.senderId !== $store.state.user.id,
            cright: item.senderId === $store.state.user.id
          }"
          v-for="(item, idx) in messageList"
          :key="idx"
        >
          <van-image class="avatar" :src="item.avatar" />
          <im-audio-player
            @click="playFlag = !playFlag"
            v-if="item.msgType === 'm'"
            :class="{
              audioleft: item.senderId !== $store.state.user.id,
              audioright: item.senderId === $store.state.user.id
            }"
            :src="item.content"
            v-model="playFlag"
          />
          <div class="content" v-else>
            <span>{{ item.username }}</span>
            <span>{{ dateStr(item.createTime || "") }}</span>
            <pre class="text" v-html="item.content" />
          </div>
        </div>
      </section>
    </div>
  </med-view-container>
</template>

<script>
import conf from '@/api'
import { imageLoad, transform } from '@/utils/ChatUtils'
import { getHistoryMessage } from '@/utils/CommonRequest'
import {
  ImImgUploader,
  ImAudioPlayer,
  ImAudioRecoder
} from '@/views/im/components'

export default {
  name: 'imchatDetail',
  components: {
    ImImgUploader,
    ImAudioPlayer,
    ImAudioRecoder
  },
  data() {
    return {
      chat: {},
      messageContent: '',
      recorderFlag: true,
      playFlag: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data'
      },
      hasSend: false
    }
  },
  created() {
    this.chat = this.$route.query.chat
  },
  computed: {
    messageList: {
      get: function() {
        return this.$store.state.messageList
      },
      set: function(messageList) {
        this.$store.commit('setMessageList', messageList)
      }
    }
  },
  methods: {
    switchRecoder() {
      this.recorderFlag = !this.recorderFlag
    },
    // 发送图片
    imgSend(item) {
      this.messageContent += item.fileUrl
    },
    // 发送文字
    textSend() {
      const currentUser = this.$store.state.user
      const time = new Date()
      const content = this.messageContent
      if (content !== '' && content !== '\n') {
        if (content.length > 2000) {
          this.$notify('不能超过2000个字符')
        } else {
          const currentMessage = {
            clientSecret: 'nlux3',
            clientSign: 'mdsd-im',
            channelId: this.chat.channelId,
            name: this.chat.name,
            senderId: currentUser.id, // 发送者id
            avatar: currentUser.avatar,
            username: currentUser.name,
            createTime: this.formatDateTime(time),
            content: this.messageContent, // 发送内容
            msgType: 'w', // 消息类型 w文字 m媒体
            type: this.chat.type
          }
          console.log(currentMessage)
          this.send(currentMessage)
        }
      }
    },
    // 发送语音
    voiceSend(formData) {
      fetch(conf.getFileUrl(), {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(res => {
          console.log('发送语音文件返回值', res)
          if (res.code === '0') {
            const currentUser = this.$store.state.user
            const time = new Date()
            const content = res.result.fileUrl
            const currentMessage = {
              channelId: this.chat.channelId,
              senderId: currentUser.id,
              createTime: this.formatDateTime(time),
              avatar: currentUser.avatar,
              name: currentUser.name,
              content: content || '语音文件',
              msgType: 'm'
            }
            this.send(currentMessage)
          }
        })
    },
    // 发送消息的基础方法
    send(message) {
      this.$store.commit('sendMessage', message)
      message.createTime = this.formatDateTime(new Date(message.createTime))
      this.$store.commit('addMessage', message)
      this.messageContent = ''
      this.hasSend = true
      // 每次滚动到最底部
      this.$nextTick(() => {
        imageLoad('message-box')
      })
    },
    getHistoryMessage(pageNo) {
      if (!pageNo) {
        pageNo = 1
      }
      const param = {
        clientSecret: 'nlux3',
        clientSign: 'mdsd-im',
        channelId: this.$route.params.id,
        userId: this.$store.state.user.id,
        pageNo: pageNo,
        size: 100
      }
      getHistoryMessage(param).then(json => {
        const list = json.map(element => {
          element.content = transform(element.content)
          element.createTime = this.formatDateTime(
            new Date(element.createTime)
          )
          if (element.avatar && element.avatar.indexOf('http') === -1) {
            element.avatar = conf.getHostUrl() + element.avatar
          }

          return {
            avatar: element.avatar || '',
            username: element.senderName,
            createTime: element.createTime,
            content: element.content,
            senderId: element.senderId,
            channelId: this.chat.channelId
          }
        })
        this.messageList = list.reverse()
        this.$nextTick(() => {
          imageLoad('message-box')
        })
      })
    },
    handleReturn() {
      this.$store.commit('setCurrentChat', JSON.parse(JSON.stringify({})))
      if (this.hasSend) {
        this.$router.replace({
          path: `/imchat/list`,
          query: {
            hasSend: true
          }
        })
      } else {
        this.$router.go(-1)
      }
    }
  },
  watch: {
    // 监听每次 chat 的变化
    chat() {
      this.messageList = []
      // 从内存中取聊天信息
      // eslint-disable-next-line standard/computed-property-even-spacing
      const cacheMessages = this.$store.state.messageListMap[
        this.chat.channelId
      ]
      if (cacheMessages) {
        this.messageList = cacheMessages
      } else {
        this.getHistoryMessage(1)
      }
      // 每次滚动到最底部
      this.$nextTick(() => {
        imageLoad('message-box')
      })
    }
  },
  mounted() {
    // 每次滚动到最底部
    this.$nextTick(() => {
      imageLoad('message-box')
    })
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
