<template>
  <div class="audio__wrap">
    <audio controls :src="src" ref="audioPlayer" style="display:none"></audio>
    <div class="self__audio" @click="playAudioHandler">
      <!-- 时间显示 -->
      <div class="audio__duration">{{ duration }}"</div>
      <!-- 动画样式 -->
      <div class="audio__trigger">
        <div
          :class="{
            'wifi-symbol': true,
            'wifi-symbol--avtive': isPlaying
          }"
        >
          <div class="wifi-circle second"></div>
          <div class="wifi-circle third"></div>
          <div class="wifi-circle first"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImAudioPlayer',
  data() {
    return {
      isPlaying: false,
      duration: ''
    }
  },
  props: {
    src: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    value: {
      // 监听控制播放停止
      handler(newValue, oldValue) {
        if (!this.value) {
          this.isPlaying = false
          this.$refs.audioPlayer.load()
        }
      }
    }
  },
  methods: {
    playAudioHandler() {
      this.isPlaying = !this.isPlaying
      const player = this.$refs.audioPlayer
      if (this.isPlaying) {
        player.load()
        player.play()
      } else {
        player.pause()
      }
      setTimeout(() => {
        this.isPlaying = false
        this.$emit('input', false)
      }, (this.duration ? this.duration : 0) * 1000)
    }
  },
  mounted() {
    const player = this.$refs.audioPlayer
    player.load()
    const vm = this
    player.oncanplay = function() {
      vm.duration = Math.ceil(player.duration)
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
