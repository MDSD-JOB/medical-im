<template>
  <div
    :class="'icon ss-icon-' + iconType"
    :style="'width:' + size + ';height:' + size"
  ></div>
</template>

<script>
export default {
  name: 'Icon',
  data() {
    return {}
  },
  props: {
    iconType: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: '28px'
    }
  }
}
</script>

<style scoped lang="less">
.icon {
  position: relative;
  vertical-align: middle;
  display: inline-block;
  background-size: contain;
  outline: none;
  background-repeat: no-repeat;
}
</style>
