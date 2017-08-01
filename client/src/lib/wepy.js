'use strict'

import wepy from 'wepy'
import axios from './axios'
import events from './events'

export function $modal (title, content, showCancel = false) {
  return wepy.showModal({
    title,
    content,
    showCancel
  }).then(data => data.confirm)
}

export function $loading (title, mask = true) {
  if (title) {
    return wepy.showLoading({ title, mask })
  } else {
    return wepy.hideLoading()
  }
}

export const $http = axios

export function $navigateTo (key, url) {
  if (key && !url) {
    url = key
    key = undefined
  }

  return wepy.navigateTo({ url }).then(() => key && new Promise(resolve => events.once(key, resolve)))
}

export function $navigateBack (key, ...args) {
  if (key) {
    events.emit(key, ...args)
  }

  return wepy.navigateBack()
}

Object.assign(wepy.component.prototype, {
  $modal,
  $loading,
  $http,
  $navigateTo,
  $navigateBack,
  $globalEvents: events
})
