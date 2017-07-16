'use strict'

import * as d3TimeFormat from 'd3-time-format'

/** 解析日期 */
function parseDate (date) {
  let d = new Date(date)
  if (Number.isNaN(+d)) {
    d = new Date()
  }

  return d
}

/** 只保留一个日期的年、月、日 */
export function trimDate (date) {
  const d = parseDate(date)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

// 预定义的日期时间格式
const dateFormat = d3TimeFormat.timeFormat('%Y-%m-%d')
const timeFormat = d3TimeFormat.timeFormat('%H:%M')

/** 格式化日期 */
export function formatDate (date) {
  const d = parseDate(date)
  return dateFormat(d)
}

/** 格式化时间 */
export function formatTime (date) {
  const d = parseDate(date)
  return timeFormat(d)
}

/** 生成用于表单绑定的 change 函数 */
export function generateChangeMethods (parent, props) {
  const result = {}
  props.forEach(prop => {
    result[prop + 'Changed'] = function (e) {
      this[parent][prop] = e.detail.value
    }
  })

  return result
}
