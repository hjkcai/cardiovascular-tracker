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

export default function AuthMiddlewareFactory (skips: RegExp[]) {
  return (async function AuthMiddleware (ctx, next) {
    // 跳过符合 skips 规则的路由
    if (skips.some(rule => rule.test(ctx.url))) {
      return next()
    }

    // 从 headers 中读取 token
    const authorization: string = ctx.headers['authorization']
    const tokenMatchResult = authorization && authorization.match(/^Bearer (.*)$/)
    if (tokenMatchResult) {
      // 验证 token 是否有效
      const token = tokenMatchResult[1]
      const tokenContent = await verify(token)
      if (tokenContent) {
        // 获取 session
        const savedSession = await session.get(tokenContent.sub)
        if (savedSession) {
          ctx.session = savedSession
        }

        // 额外保存 token 信息
        ctx.state.user = tokenContent

        return next()
      }
    }

    throw new TokenAuthorizationError()
  }) as Middleware
}
