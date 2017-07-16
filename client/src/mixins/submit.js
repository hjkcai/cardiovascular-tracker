'use strict'

import wepy from 'wepy'

export default class SubmitMixin extends wepy.mixin {
  methods = {
    async submit (e) {
      await this.$loading('正在提交...')

      try {
        await this.submit(e.detail.value)
      } catch (err) {
        await this.$modal('错误', err.message)
      }

      await this.$loading()
      await wepy.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1000,
        mask: true
      })
    }
  }
}
