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

  refreshActiveTab () {
    const activeTab = this.tabs[this.activeTab]
    if (activeTab && activeTab.component) {
      this.$invoke(activeTab.component, 'refresh')
    }
  }

  switchTab (e, forceRefresh = false) {
    const newActiveTab = Number((e && typeof e === 'object') ? e.currentTarget.dataset.index : e)
    if (forceRefresh || newActiveTab !== this.activeTab) {
      // 有些时候数据没有应用更改, 所以手动 $apply
      this.activeTab = newActiveTab
      this.$apply()

      this.refreshActiveTab()
      this.$emit('tabChanged', this.activeTab, this)
    }
  }
}
