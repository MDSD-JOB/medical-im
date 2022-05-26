<template>
  <div class="recoder-wrapper">
    <input id="messageBtn" type="button" class="recoder" :value="value" />
    <van-popup v-model="timeShow" :overlay="false">
      <div>
        {{ minute >= 10 ? minute : "0" + minute }}:{{
          second >= 10 ? second : "0" + second
        }}
      </div>
      <div>手指上滑，取消发送</div>
    </van-popup>
  </div>
</template>

<script>
import Recorderx, { ENCODE_TYPE } from 'recorderx'
const rc = new Recorderx()
export default {
  name: 'ImAudioRecoder',
  data() {
    return {
      timeShow: false,
      value: '按住 说话',
      minute: 0,
      second: 0,
      jianting: 0,
      maikef: false,
      posStart: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.saveYyxiaoxi()
    })
  },
  methods: {
    saveYyxiaoxi() {
      // 获取语音发送变量
      if (this.jianting === 0) {
        this.btnElem = document.getElementById('messageBtn')
        this.initEvent()
      }
      this.jianting = 1 // 变量控制只执行一次initEvent()
    },
    // 点击发送语音 上滑取消语音逻辑
    initEvent() {
      this.btnElem.addEventListener('touchstart', event => {
        // event.preventDefault()// 阻止浏览器默认行为
        this.posStart = 0
        this.posStart = event.touches[0].pageY // 获取起点坐标
        this.value = '松开 发送'
        this.timeShow = true
        clearInterval(this.time)
        this.time = setInterval(this.timer1, 1000)
        this.handleBtnClick() // 开始录制语音
      })
      this.btnElem.addEventListener('touchmove', event => {
        event.preventDefault() // 阻止浏览器默认行为
        this.posMove = 0
        this.posMove = event.targetTouches[0].pageY // 获取滑动实时坐标
        if (this.posStart - this.posMove < 30) {
          this.value = '松开 发送'
        } else {
          this.value = '松开手指，取消发送'
        }
      })
      this.btnElem.addEventListener('touchend', event => {
        event.preventDefault()
        this.posEnd = 0
        this.posEnd = event.changedTouches[0].pageY // 获取终点坐标
        this.value = '按住 说话'
        if (this.posStart - this.posEnd < 30) {
          console.log('开始发送')
          this.send_voice()
        } else {
          console.log('取消发送')
        }
        this.cancel() // 录制语音清除缓存
        this.timeShow = false
        this.reset() // 时间归零
      })
    },
    // 发送语音时计时器函数
    timer1() {
      // 定义计时函数
      this.second = this.second + 1 // 秒
      if (this.second >= 60) {
        this.second = 0
        this.minute = this.minute + 1 // 分钟
      }

      if (this.minute >= 60) {
        this.minute = 0
        this.hour = this.hour + 1 // 小时
      }
    },
    // 录制语音
    handleBtnClick: function() {
      // const that = this
      // that.news_img = !that.news_img
      rc.start()
        .then(() => {
          this.maikef = true
          // that.news_img = !that.news_img
          console.log('开始录制')
        })
        .catch(error => {
          this.$notify('获取麦克风失败')
          this.maikef = false
          this.reset()
          this.timeShow = false
          console.log('Recording failed.', error)
        })
    },
    // 发送语音
    async send_voice() {
      rc.pause()
      const wav = rc.getRecord({
        encodeTo: ENCODE_TYPE.WAV,
        compressible: true
      })
      const formData = new FormData()
      formData.append('type', 'voice')
      formData.append('file', wav, Date.parse(new Date()) + '.wav')
      this.$emit('send', formData)
    },
    // 取消语音
    cancel: function() {
      rc.clear()
    },
    reset() {
      // 重置
      clearInterval(this.time)
      this.time = null
      this.hour = 0
      this.minute = 0
      this.second = 0
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
