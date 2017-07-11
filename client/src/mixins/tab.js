'use strict'

import wepy from 'wepy'

export default class TabMixin extends wepy.mixin {
  data = {
    tabs: [],
    activeTab: 0
  }

  methods = {
    switchTab (e) {
      // 这里调用的是下面的那个 switchTab 函数
      // 写法有点神奇
      this.switchTab(e)
    }
  }

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

  onLoad () {
    this.switchTab(0)
  }
}
