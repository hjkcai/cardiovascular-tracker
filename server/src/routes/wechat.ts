'use strict'

import * as jwt from 'jsonwebtoken'
import * as redis from '../lib/redis'
import * as Router from 'koa-router'
import * as wechat from '../lib/wechat'
import { randomString ,sha1 } from '../lib/util'

const config = require('../../config')
const router = new Router()

// 微信登录 (wx.login 后执行)
router.post('login', async (ctx, next) => {
  interface LoginData {
    code: string
  }

  const data: LoginData = ctx.body
  const session = await wechat.getSession(data.code)

  const newSession = {
    id: '',
    openid: session.openid,
    sessionKey: session.session_key,
    salt: randomString(6)
  }

  newSession.id = sha1(newSession.openid + newSession.sessionKey + newSession.salt)
  await redis.set(newSession.id, newSession, 'EX', session.expires_in)

  ctx.result = jwt.sign({ sub: newSession.id }, config.secret, { expiresIn: session.expires_in })
})

export default router
