'use strict'

import { Context } from 'koa'
import { inspect } from 'util'

/**
 * 生成一份 HTTP 请求完整记录
 */
export function dumpHttpRequest (ctx: Context) {
  let result = ctx.method.toUpperCase() + ' ' + ctx.originalUrl + '\n'
  result += ctx.req.rawHeaders.map((_, i, arr) => {
    if (i % 2 === 1) return ''
    return arr[i] + ': ' + arr[i + 1]
  }).filter(i => i).join('\n')

  if (ctx.body != null) {
    result += '\n\n'
    if (typeof ctx.body === 'object') {
      result += JSON.stringify(ctx.body)
    } else result += ctx.body
  }

  return result
}

/**
 * 保证 str 有至少 length 的长度. 如果没有, 则在 str 前面填充 char
 */
export function padStart (str: string, length: number, char: string = ' ') {
  if (str.length < length) {
    return Array.from({ length: length - str.length }, () => char).join('') + str
  } else return str
}
