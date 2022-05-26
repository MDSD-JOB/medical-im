<template>
  <div class="im-login-form-wrapper">
    <div class="login-form-section">
      <van-image :src="require('@/assets/images/login/logo.png')" />
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          border
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          border
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import conf from '@/api'
import RequestUtils from '@/utils/RequestUtils'
import StoreUtils from '@/utils/StoreUtils'
import { ErrorType, ChatListUtils } from '@/utils/ChatUtils'
export default {
  name: 'Login',
  data() {
    return {
      username: 'admin',
      password: 'admin',
      showErr: false,
      err: ''
    }
  },
  created() {
    this.clear()
  },
  methods: {
    clear() {
      this._storage.clearAll()
      localStorage.clear()
    },
    onSubmit() {
      RequestUtils.login(this.username.trim(), this.password.trim(), this)
        .then(token => {
          StoreUtils.setToken(token)
          return RequestUtils.requestG(conf.getInitUrl())
        })
        .then(jsonp => {
          const json = jsonp.result
          // 个人信息
          this.$store.commit('setUser', json.user)
          // 当前聊天
          ChatListUtils.setChatList(json.user.id, [
            ...json.imUsers,
            ...json.imGroups
          ])
          // 群
          this.$store.commit('setChatGroupList', json.imGroups)
          // 把群组封装到map中
          const chatMap = new Map()
          json.imGroups.forEach(group => {
            chatMap.set(group.id, group)
          })
          this.$store.commit('setChatMap', chatMap)
          // 跳转到index 页面
          this.$router.push({ name: 'index' })
        })
        .catch(error => {
          this.showErr = true
          if (ErrorType.NET_ERROR === error.toString()) {
            this.err = '服务通讯失败，请检查服务设置'
          } else {
            this.err = error.toString()
          }
          this.$notify(this.err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
