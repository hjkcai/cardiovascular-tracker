'use strict'

import { Context, Middleware } from 'koa'
import UserError from '../errors'

/** API 响应通用格式 */
export interface ApiResponse {
  code: number,
  message?: string,
  data?: any
}

/** 生成一个请求错误响应 */
export function makeErrorResponse (ctx: Context, error: UserError): ApiResponse {
  ctx.status = error.statusCode || 500
  return ctx.body = {
    code: error.code || -1,
    message: error.message || 'Internal Server Error'
  }
}

/** 生成一个请求成功响应 */
export function makeSuccessResponse (ctx: Context): ApiResponse {
  return ctx.body = {
    code: 0,
    data: ctx.result === null ? undefined : ctx.result
  }
}

/** 格式化的 API 响应处理中间件 */
export default (async function ApiResponserMiddleware (ctx, next) {
  let error: Error | null = null
  await next().catch(err => { error = err })

  if (error != null) {
    if (error instanceof UserError) {
      // 如果得到用户定义的错误, 则返回这个错误给客户端
      makeErrorResponse(ctx, error)
    } else {
      // 否则向上层 middleware 抛出这个错误
      throw error
    }
  }

  // 如果下层路由直接设置了响应 body, 则不使用自定义的响应格式
  if (ctx.body == null && ctx.result !== undefined) {
    makeSuccessResponse(ctx)
  }
}) as Middleware
