<template>
  <med-view-container
    scroll
    :title="tabList[active].title"
    :left-arrow="false"
    return-label=""
  >
    <keep-alive>
      <router-view />
    </keep-alive>
    <template #right>
      <i class="iconfont icon-shutdown" @click="logoutFlag = true"></i>
    </template>
    <template #bottom-part>
      <van-tabbar v-model="active" active-color="#333bd2" @change="onChange">
        <van-tabbar-item
          v-for="item in tabList"
          :key="item.title"
          :icon="item.icon"
          :to="item.path"
        >
          {{ item.title }}
          <template #icon>
            <i
              class="tabbar-icon"
              :class="{ iconfont: true, [item.icon]: true }"
            ></i>
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </template>
    <van-popup v-model="logoutFlag">
      <p>是否确认退出？</p>
      <div class="btns">
        <van-button @click="cancel">取消</van-button>
        <van-button type="danger" @click="logout">确认</van-button>
      </div>
    </van-popup>
  </med-view-container>
</template>

<script>
import { logout } from '@/utils/ChatUtils'
import storage from 'store'
export default {
  data() {
    return {
      logoutFlag: false,
      active: storage.get('tabbarIdx') || 0,
      tabList: [
        {
          title: '消息',
          icon: 'icon-liaotian',
          path: '/imchat/list'
        },
        // {
        //   title: '群组',
        //   icon: 'icon-group',
        //   path: '/imgroups/list'
        // },
        {
          title: '通讯录',
          icon: 'icon-tongxunlu1',
          path: '/imfriends/list'
        }
      ]
    }
  },
  created() {
    if (this.$route.query.from === 'friends' || this.$route.query.hasSend) {
      this.active = 0
    }
  },
  methods: {
    onChange(val) {
      storage.set('tabbarIdx', val)
    },
    cancel() {
      this.logoutFlag = false
    },
    logout() {
      // todo: 上线修改
      const isProd = ['prod', 'production'].includes(process.env.NODE_ENV)
      if (isProd) {
        logout(this)
      } else {
        this.$bridge.callhandler('finishPager', {}, async data => {})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabbar-item {
  .iconfont.tabbar-icon {
    font-size: 46px;
  }
  &.van-tabbar-item--active {
    .iconfont.tabbar-icon {
      font-size: 50px;
    }
  }
}

/deep/ .med-view-container-body {
  padding-top: 0 !important;
  margin-top: 120px;
}
.van-popup {
  width: 80%;
  text-align: center;
  border-radius: 30px;
  padding: 30px;
  p {
    font-size: 36px;
    line-height: 80px;
  }
  .btns {
    display: flex;
    align-self: center;
    justify-content: center;
    .van-button {
      margin: 0 10px;
      padding: 15px 50px;
      height: auto;
      border-radius: 60px;
      &:nth-of-type(1) {
        background-color: #444fdb;
        border-color: #444fdb;
        color: #fff;
      }
    }
  }
}
</style>
