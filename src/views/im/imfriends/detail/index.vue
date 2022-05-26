<template>
  <med-view-container
    class="im-friends-detail-wrapper"
    title="详细资料"
    returnLabel="通讯录"
    @return="handleReturn"
  >
    <van-cell :title="chat.name">
      <template #icon>
        <van-image class="friends-avatar" :src="chat.avatar || defaultAvatar" />
      </template>
      <template #label>
        <p>手机号：{{ chat.phone }}</p>
      </template>
    </van-cell>
    <div class="info">
      <van-cell title="所属院区" value="苏州医院" />
      <van-cell title="所属诊室" value="心内科" />
    </div>
    <div class="btns">
      <van-button block class="sendMessage" @click="sendMessage">
        发消息
      </van-button>
      <van-button block class="sendVideo" @click="sendVideo">视频</van-button>
    </div>
  </med-view-container>
</template>

<script>
import conf from '@/api'
import { getCreateEvent } from '@/utils/CommonRequest'
import { MessageTargetType } from '@/utils/ChatUtils'
const { ChatListUtils } = require('@/utils/ChatUtils.js')
export default {
  name: 'imfriendsDetail',
  data() {
    return {
      chat: {}
    }
  },
  created() {
    this.chat = this.$route.query.chat
  },
  computed: {
    defaultAvatar() {
      if (this.chat.id === this.$store.state.user.id) {
        return require('@/assets/images/me.png')
      }
      return require('@/assets/images/other.png')
    }
  },
  methods: {
    sendMessage() {
      if (String(this.chat.id) !== String(this.$store.state.user.id)) {
        const param = {
          clientSecret: 'nlux3',
          clientSign: 'mdsd-im',

          fromUserId: this.$store.state.user.id,
          name: this.chat.name,
          toUserId: this.chat.id,
          toUserName: this.chat.name,
          type: MessageTargetType.FRIEND,
          userIds: [this.$store.state.user.id, this.chat.id]
        }
        getCreateEvent(param)
          .then(json => {
            const chat = ChatListUtils.resetChatList(
              this,
              this.chat,
              conf.getHostUrl(),
              MessageTargetType.FRIEND,
              json.channelInfoVo.channelId
            )
            this.$store.commit(
              'setCurrentChat',
              JSON.parse(JSON.stringify(chat))
            )
            this.$router.replace({
              path: `/imchat/detail/${json.channelInfoVo.channelId}`,
              query: {
                chat: { ...chat, phone: this.chat.phone },
                from: 'friends'
              }
            })
          })
          .catch(err => {
            this.$notify(err)
          })
      } else {
        this.$notify('不能跟自己说话哦！')
      }
    },
    sendVideo() {
      console.log('发送视频请求')
    },
    handleReturn() {
      this.$router.replace({
        path: `/imfriends/list`
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
@import "./index.less";
