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

/** 预定义的日期格式 */
const dateFormat = d3TimeFormat.timeFormat('%Y-%m-%d')

/** 格式化日期 */
export function formatDate (date) {
  const d = parseDate(date)
  return dateFormat(d)
}
