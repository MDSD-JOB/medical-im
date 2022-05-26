<template>
  <div class="im-imchat-wrapper">
    <van-pull-refresh v-model="refreshing" v-if="chatGroupList.length">
      <van-list>
        <im-msg-item
          v-for="(item, idx) in chatGroupList"
          :key="idx"
          :msgObj="item"
        />
      </van-list>
    </van-pull-refresh>
    <van-empty description="暂无群组" v-else />
  </div>
</template>

<script>
import ImMsgItem from './im-msg-item'
import { ChatListUtils } from '@/utils/ChatUtils'
export default {
  name: 'imgroups',
  components: { ImMsgItem },
  data() {
    return {
      loading: false,
      refreshing: false
    }
  },
  activated() {
    // if (this.$route.query.chat) {
    //   this.$store.commit(
    //     'setCurrentChat',
    //     JSON.parse(JSON.stringify(this.$route.query.chat))
    //   )
    // }

    // 重新设置chatList
    this.$store.commit(
      'setChatList',
      ChatListUtils.getChatList(this.$store.state.user.id)
    )
  },
  computed: {
    currentChat: {
      get: function() {
        return this.$store.state.currentChat
      },
      set: function(currentChat) {
        this.$store.commit(
          'setCurrentChat',
          JSON.parse(JSON.stringify(currentChat))
        )
      }
    },
    chatGroupList: {
      get: function() {
        return this.$store.state.chatGroupList
      },
      set: function(chatGroupList) {
        this.$store.commit('setChatList', chatGroupList)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
