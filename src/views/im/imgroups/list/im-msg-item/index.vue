<template>
  <van-swipe-cell class="im-msg-item-wrapper">
    <van-cell
      :class="{ mute: msgObj.mute }"
      :title="msgObj.name"
      :label="msgObj.sign"
      :value="dateStr(msgObj.signTime || '')"
      @click.stop="showChat(msgObj)"
    >
      <template #icon>
        <van-badge :content="unReadCount" :dot="!msgObj.status && msgObj.mute">
          <van-image fit="cover" :src="msgObj.avatar || defaultAvatar" />
        </van-badge>
      </template>
      <template #right-icon>
        <i class="iconfont icon-bell-mute-" v-if="msgObj.mute"></i>
      </template>
    </van-cell>
    <template #right>
      <!-- <van-button
        :class="{ 'msg-no-red': msgObj.status }"
        square
        type="primary"
        :text="msgObj.status ? '标为未读' : '标为已读'"
        @click="toggleMsgRead($event, !msgObj.status, msgObj)"
      /> -->
      <van-button
        square
        type="danger"
        text="退出"
        @click="quitChatGroup(msgObj)"
      />
    </template>
  </van-swipe-cell>
</template>

<script>
import conf from '@/api'
import { MessageTargetType, ChatListUtils } from '@/utils/ChatUtils'
import { getLeaveEvent } from '@/utils/CommonRequest'

export default {
  name: 'ImMsgItem',
  props: {
    msgObj: {
      type: Object,
      required: true
    }
  },
  computed: {
    defaultAvatar() {
      return require('@/assets/images/group.png')
    },
    unReadCount() {
      if (Number(this.msgObj.unReadCount) > 0 && !this.msgObj.status) {
        return this.msgObj.unReadCount
      }
      return null
    }
  },
  methods: {
    toggleMsgRead(e, bool, item) {
      item.status = bool
      console.log('切换已读/未读', item)
    },
    quitChatGroup(chat) {
      getLeaveEvent({
        clientSecret: 'nlux3',
        clientSign: 'mdsd-im',
        channelId: chat.channelId,
        sendBroadcast: true,
        senderId: this.$store.state.user.id,
        imChannelUserVos: [this.$store.state.user.id]
      }).then(() => {
        this.$notify({ type: 'success', message: '退出成功！' })
        const tempGroupChatList = []
        for (const item of this.$store.state.chatGroupList) {
          if (String(item.channelId) !== String(chat.channelId)) {
            tempGroupChatList.push(item)
          }
        }
        // 放入缓存
        this.$store.commit('setChatGroupList', tempGroupChatList)
      })
    },
    showChat(user) {
      const chat = ChatListUtils.resetChatList(
        this,
        user,
        conf.getHostUrl(),
        MessageTargetType.CHAT_GROUP,
        user.channelId
      )
      this.$store.commit('setCurrentChat', JSON.parse(JSON.stringify(chat)))
      this.$router.push({
        path: `/imgroups/detail/${user.channelId}`,
        query: {
          chat: user
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
