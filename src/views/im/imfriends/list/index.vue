<template>
  <div class="im-friends-wrapper">
    <van-search v-model="searchKey" placeholder="请输入搜索联系人" />
    <van-index-bar
      :sticky="false"
      :index-list="indexList"
      v-if="userFriendList.length"
    >
      <van-checkbox-group v-model="result">
        <div v-for="(item, index) in userFriendList" :key="index">
          <van-index-anchor :index="item.letter" />
          <div class="friend-cell" v-for="(user, idx) in item.list" :key="idx">
            <van-checkbox :name="user.id"> </van-checkbox>
            <van-cell :title="user.name" @click.stop="goUser(user)">
              <template #icon>
                <van-image
                  class="friends-avatar"
                  :src="user.avatar || defaultAvatar(user)"
                />
              </template>
            </van-cell>
          </div>
        </div>
      </van-checkbox-group>
    </van-index-bar>
    <van-empty description="暂无联系人" v-else />
    <div class="groupBtn" v-if="result.length > 1" @click="groupFlag = true">
      创建群聊
    </div>
    <van-action-sheet v-model="groupFlag" title="创建群聊">
      <div class="content">
        <van-field
          label="群聊名称"
          v-model="groupName"
          placeholder="请输入名称"
        >
          <template #button>
            <van-button size="small" type="primary" @click="goGroup">
              确定
            </van-button>
          </template>
        </van-field>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { MessageTargetType } from '@/utils/ChatUtils'
import RequestUtils from '@/utils/RequestUtils'
import { getCreateEvent } from '@/utils/CommonRequest'
import conf from '@/api'
const { ChatListUtils } = require('@/utils/ChatUtils.js')
export default {
  name: 'imfriends',
  data() {
    return {
      result: [],
      groupFlag: false,
      groupName: '',
      searchKey: ''
    }
  },
  computed: {
    userFriendList: {
      get: function() {
        let arr = this.$store.state.userFriendList.map(item => {
          return {
            ...item,
            checked: false
          }
        })
        arr = arr.filter(item => item.id !== this.$store.state.user.id)
        if (this.searchKey) {
          arr = arr.filter(item => item.name.indexOf(this.searchKey) !== -1)
        }
        return this.pySegSort(arr)
      },
      set: function(userFriendList) {
        this.$store.commit('setUserFriendList', userFriendList)
      }
    },
    indexList() {
      if (this.userFriendList.length) {
        const arr = this.userFriendList.map(item => item.letter)
        return arr
      }
      return []
    }
  },
  created() {
    RequestUtils.request(conf.getUserUrl(), {
      hosId: this.$store.state.user.hosId // 医院id
    }).then(jsonp => {
      const json = jsonp.result
      this.$store.commit('setUserFriendList', json)
    })
  },
  methods: {
    goUser(chat) {
      this.$router.push({
        path: `/imfriends/detail/${chat.id}`,
        query: {
          chat
        }
      })
    },
    goGroup() {
      if (!this.groupName) {
        this.$notify('请输入群聊名称！')
        return
      }
      const arr = this.$store.state.userFriendList.filter(item => {
        return this.result.indexOf(item.id) !== -1
      })
      const arrs = arr.map(item => item.id)
      const user = {
        id: arrs.join(),
        avatar: '',
        name: this.groupName
      }
      const param = {
        clientSecret: 'nlux3',
        clientSign: 'mdsd-im',
        fromUserId: this.$store.state.user.id,
        name: this.groupName,
        type: MessageTargetType.CHAT_GROUP,
        userIds: [this.$store.state.user.id, ...this.result]
      }
      getCreateEvent(param)
        .then(json => {
          const chat = ChatListUtils.resetChatList(
            this,
            user,
            conf.getHostUrl(),
            MessageTargetType.CHAT_GROUP,
            json.channelInfoVo.channelId
          )
          const tempGroupChatList = [
            {
              channelId: json.channelInfoVo.channelId,
              name: this.groupName,
              type: 0
            },
            ...this.$store.state.chatGroupList
          ]
          this.$store.commit('setChatGroupList', tempGroupChatList)
          this.$store.commit(
            'setCurrentChat',
            JSON.parse(JSON.stringify(chat))
          )

          this.$router.replace({
            path: `/imchat/detail/${json.channelInfoVo.channelId}`,
            query: {
              chat,
              from: 'friends'
            }
          })
        })
        .catch(err => {
          this.$notify(err)
        })
    },
    defaultAvatar({ id }) {
      if (id === this.$store.state.user.id) {
        return require('@/assets/images/me.png')
      }
      return require('@/assets/images/other.png')
    },
    pySegSort(arr) {
      if (!String.prototype.localeCompare) return null
      const letters = 'ABCDEFGHJKLMNOPQRSTWXYZ '.split('')
      const zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('')
      const segs = []
      letters.map((el, i) => {
        const cur = { letter: el, list: [] }
        arr.map(item => {
          const firstIdx = item.name.slice(0, 1).toUpperCase()
          if (
            item.name.startsWith(el) ||
            item.name.startsWith(el.toLowerCase())
          ) {
            cur.list.push(item)
          } else if (
            !letters.includes(firstIdx) &&
            item.name.localeCompare(zh[i]) >= 0 &&
            item.name.localeCompare(zh[i + 1]) < 0
          ) {
            cur.list.push(item)
          }
        })
        if (cur.list.length !== 0) {
          cur.list.sort(function(a, b) {
            return a.name.localeCompare(b.name, 'zh')
          })
          segs.push(cur)
        }
      })
      return segs
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
