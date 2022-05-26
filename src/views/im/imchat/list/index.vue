<template>
  <div class="im-imchat-wrapper">
    <van-search v-model="searchKey" placeholder="请输入搜索联系人" />
    <!-- <van-pull-refresh v-model="refreshing" > -->
    <van-list v-if="chatList.length">
      <im-msg-item v-for="(item, idx) in chatList" :key="idx" :msgObj="item" />
    </van-list>
    <!-- </van-pull-refresh> -->
    <van-empty description="暂无聊天记录" v-else />
  </div>
</template>

<script>
import ImMsgItem from './im-msg-item'
import { ChatListUtils } from '@/utils/ChatUtils'
export default {
  name: 'imchat',
  components: { ImMsgItem },
  data() {
    return {
      loading: false,
      refreshing: false,
      searchKey: ''
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
    chatList: {
      get: function() {
        let arr = this.$store.state.chatList
        if (this.searchKey) {
          arr = arr.filter(item => item.name.indexOf(this.searchKey) !== -1)
        }
        return arr
      },
      set: function(chatList) {
        this.$store.commit('setChatList', chatList)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
