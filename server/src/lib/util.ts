'use strict'

import { Context } from 'koa'
import { inspect } from 'util'
import { createDecipheriv, createHash } from 'crypto'

/** 生成一份 HTTP 请求完整记录 */
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

/** 保证 str 有至少 length 的长度. 如果没有, 则在 str 前面填充 char */
export function padStart (str: string, length: number, char: string = ' ') {
  if (str.length < length) {
    return Array.from({ length: length - str.length }, () => char).join('') + str
  } else return str
}

/** base64 解码 */
export function base64Decode (target: string) {
  return Buffer.from(target, 'base64')
}

/** aes-128-cbc 解码 */
export function aesDecode (target: Buffer, key: Buffer, iv: Buffer) {
  const decipher = createDecipheriv('aes-128-cbc', key, iv)
  decipher.setAutoPadding(true)

  return decipher.update(target, 'binary', 'utf8') + decipher.final('utf8')
}

/** 计算 sha1 值 */
export function sha1 (content: string | Buffer) {
  return createHash('sha1').update(content).digest('hex')
}

/** 生成随机字符串 */
export function randomString (length: number) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''

  for (let i = length; i > 0; i--) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }

  return result
}
