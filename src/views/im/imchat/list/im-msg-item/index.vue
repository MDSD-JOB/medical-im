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
          <van-image
            fit="cover"
            :src="msgObj.avatar || defaultAvatar(msgObj)"
          />
        </van-badge>
      </template>
      <template #right-icon>
        <i class="iconfont icon-bell-mute-" v-if="msgObj.mute" />
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
      <van-button square type="danger" text="删除" @click="delChat(msgObj)" />
    </template>
  </van-swipe-cell>
</template>

<script>
import conf from '@/api'
import { ChatListUtils } from '@/utils/ChatUtils'
import { getDeleteEvent } from '@/utils/CommonRequest'
export default {
  name: 'ImMsgItem',
  props: {
    msgObj: {
      type: Object,
      required: true
    }
  },
  computed: {
    unReadCount() {
      if (Number(this.msgObj.unReadCount) > 0 && !this.msgObj.status) {
        return this.msgObj.unReadCount
      }
      return null
    }
  },
  methods: {
    defaultAvatar(item) {
      if (String(item.type) === '0') {
        return require('@/assets/images/group.png')
      }
      return item.senderId === this.$store.state.user.id
        ? require('@/assets/images/me.png')
        : require('@/assets/images/other.png')
    },
    toggleMsgRead(e, bool, item) {
      item.status = bool
      console.log('切换已读/未读', item)
    },
    delChat(chat) {
      getDeleteEvent(chat.channelId, {
        clientSecret: 'nlux3',
        clientSign: 'mdsd-im'
      }).then(() => {
        this.$notify({ type: 'success', message: '删除成功！' })
        this.$store.commit('delChat', chat)
      })
    },
    showChat(user) {
      if (String(user.id) !== String(this.$store.state.user.id)) {
        const chat = ChatListUtils.resetChatList(
          this,
          user,
          conf.getHostUrl(),
          user.type,
          user.channelId
        )
        this.$store.commit('setCurrentChat', JSON.parse(JSON.stringify(chat)))
        this.$router.push({
          path: `/imchat/detail/${user.channelId}`,
          query: {
            chat: user
          }
        })
      } else {
        this.$notify('不能跟自己说话哦！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
