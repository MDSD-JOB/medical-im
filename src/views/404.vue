<template>
  <div class="no-permission-wrapper">
    {{ msg }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: ''
    }
  },
  created() {
    this.msg = this.$route.query.message || '授权错误，关闭重试！'
  }
}
</script>

<style lang="less" scoped>
.no-permission-wrapper {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
}
</style>
