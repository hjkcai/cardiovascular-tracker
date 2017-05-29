'use strict'

import * as jwt from 'jsonwebtoken'
import * as session from '../session'
import { Middleware } from 'koa'
import { TokenAuthorizationError } from '../errors'

const config = require('../../../config')

interface TokenContent {
  sub: string,
  iat: number,
  exp: number
}

/** jwt 验证 */
function verify (token: string) {
  return new Promise<TokenContent | null>((resolve, reject) => {
    jwt.verify(token, config.secret, (err: Error, result: any) => {
      if (err) resolve(null)
      else resolve(result)
    })
  })
}

export default (async function AuthMiddleware (ctx, next) {
  // 从 headers 中读取 token
  const tokenMatchResult = (ctx.headers['Authorization'] as string).match(/^Bearer (.*)$/)
  if (tokenMatchResult) {
    // 验证 token 是否有效
    const token = tokenMatchResult[1]
    const tokenContent = await verify(token)
    if (tokenContent) {
      // 获取 session
      ctx.session = await session.get(tokenContent.sub)
      return next()
    }
  }

  throw new TokenAuthorizationError()
}) as Middleware
