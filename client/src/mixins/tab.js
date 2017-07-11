'use strict'

import wepy from 'wepy'

export default class TabMixin extends wepy.mixin {
  data = {
    tabs: [],
    activeTab: 0
  }

  methods = {
    switchTab (e) {
      this.activeTab = typeof e === 'number' ? e : Number(e.currentTarget.dataset.index)

      const activeTab = this.tabs[this.activeTab]
      if (activeTab && activeTab.component) {
        try {
          // 如果组件没有 refresh 函数则会报错
          this.$invoke(activeTab.component, 'refresh')
        } catch (err) {}
      }
    }
  }

  switchTab (e) {
    this.$mixins.forEach(mixin => {
      if (mixin instanceof TabMixin) {
        mixin.methods.switchTab.call(this, e)
      }
    })
  }

  onLoad () {
    this.switchTab(0)
  }
}
