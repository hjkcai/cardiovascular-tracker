'use strict'

import wepy from 'wepy'
import axios from './axios'

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

Object.assign(wepy.component.prototype, {
  $modal,
  $loading,
  $http
})
