'use strict'

import { http } from '../logger'
import { dumpHttpRequest, padStart } from '../util'
import { makeErrorResponse } from './api-responser'
import { Middleware } from 'koa'

/** 判定为较慢响应的毫秒数 */
const SLOW_RESPONSE = 300

/** 判定为无法接受的响应的毫秒数 */
const UNACCEPTABLE_RESPONSE = 1000

export default (async function LoggerMiddleware (ctx, next) {
  let error: any
  let messages: any[] = []
  let logLevel = 'info'

  const start = Date.now()
  await next().catch(err => { error = err })    // 捕获异常并计算响应时间
  const time = Date.now() - start

  if (error != null) {
    logLevel = 'error'
    messages.push(error)

    // 如果上层路由抛错且没有设置响应内容, 则使用默认响应内容
    if (ctx.body == null) {
      makeErrorResponse(ctx, error)
    }
  } else if (time >= SLOW_RESPONSE && time < UNACCEPTABLE_RESPONSE) {
    logLevel = 'warn'
    messages.push('Warning: Response time is too long')
  } else if (time >= UNACCEPTABLE_RESPONSE) {
    logLevel = 'error'
    messages.push('Error: Response time is unacceptable')
  }

  // 如果出错, 记录完整的HTTP请求
  if (logLevel === 'error') {
    messages.push('HTTP request dump:\n' + dumpHttpRequest(ctx))
  }

  http[logLevel](
    padStart(ctx.method.toUpperCase(), 6),
    ctx.originalUrl,
    '-',
    ctx.status,
    time + 'ms',
    '-',
    ctx.headers['user-agent'] || '[No User-Agent]'
  )

  messages.forEach(message => http[logLevel](message))
}) as Middleware
