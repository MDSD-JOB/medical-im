<template>
  <van-uploader
    class="im-img-uploader-wrapper"
    :before-read="beforeRead"
    :after-read="afterRead"
  >
    <van-icon name="photo-o" />
  </van-uploader>
</template>

<script>
import StoreUtils from '@/utils/StoreUtils'
import conf from '@/api'
export default {
  name: 'ImImgUploader',
  data() {
    return {
      imgFormat: ['jpg', 'jpeg', 'png', 'gif'],
      fileFormat: [
        'doc',
        'docx',
        'jpg',
        'jpeg',
        'png',
        'gif',
        'xls',
        'xlsx',
        'pdf',
        'gif',
        'exe',
        'msi',
        'swf',
        'sql',
        'apk',
        'psd',
        'txt'
      ],
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data'
      }
    }
  },
  methods: {
    beforeRead(file) {
      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png' &&
        file.type !== 'image/gif'
      ) {
        this.$notify('请上传图片文件！')
        return false
      }
      return true
    },
    afterRead(file) {
      const formData = new FormData()
      formData.append('access_token', StoreUtils.getAccessToken())
      formData.append('type', 'image')
      formData.append('file', file.file)
      fetch(conf.getFileUrl(), {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(res => {
          if (res.code === '0') {
            const path = res.result.fileUrl
            const fileId = res.result.fileId
            const fileName = file.file.name
            // 文件后缀
            const suffix = fileName.substring(
              fileName.lastIndexOf('.') + 1,
              fileName.length
            )
            // 上传文件路径
            let fileUrl = ''
            // 文件
            if (this.imgFormat.indexOf(suffix) === -1) {
              fileUrl = 'file(' + path + ')[' + fileName + ']'
            } else {
              fileUrl = 'img[' + path + ']'
            }
            this.$emit('imgSend', { fileUrl, fileId })
          } else {
            this.$notify('上传失败，请重试')
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
