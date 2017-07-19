'use strict'

import wepy from 'wepy'

export default class FontSizeMixin extends wepy.mixin {
  data = {
    fontSize: ''
  }

  onLoad () {
    this.fontSize = this.$state.fontSize
    this.fontSizeChangedHandler = () => {
      this.fontSize = this.$state.fontSize
      this.$apply()
    }

    this.$globalEvents.on('fontSizeChanged', this.fontSizeChangedHandler)
  }

  onUnload () {
    this.$globalEvents.off('fontSizeChanged', this.fontSizeChangedHandler)
  }
}
