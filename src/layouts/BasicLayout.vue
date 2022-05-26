<template>
  <transition :name="transitionName">
    <router-view class="transition-view" />
  </transition>
</template>

<script>
import RequestUtils from '@/utils/RequestUtils'
export default {
  data() {
    return {
      transitionName: 'slide-left',
      router_data: []
    }
  },
  created() {
    RequestUtils.webSocketOperation(this)
  },
  beforeRouteUpdate(to, from, next) {
    let isBack = false
    this.router_data.map((res, index) => {
      if (to.path === res) {
        isBack = true
        this.router_data.splice(index, 1)
      }
    })

    if (isBack) {
      this.transitionName = 'slide-right'
    } else {
      this.router_data.push(from.path)
      this.transitionName = 'slide-left'
    }
    this.$router.isBack = false
    next()
  }
}
</script>

<style scoped>
.transition-view {
  position: absolute;
  width: 100%;
  transition: all 0.5s ease;
}
.slide-left-enter,
.slide-right-leave-active {
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}
</style>
