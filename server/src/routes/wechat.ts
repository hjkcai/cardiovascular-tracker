'use strict'

import User from '../models/user'
import * as jwt from 'jsonwebtoken'
import * as redis from '../lib/redis'
import * as Router from 'koa-router'
import * as wechat from '../lib/wechat'
import { randomString, sha1 } from '../lib/util'

const config = require('../../config')
const router = new Router()

// 微信登录 (wx.login 和 wx.getUserinfo 后执行)
router.post('login', async (ctx, next) => {
  interface LoginData {
    /** 微信登录获得的 code */
    code: string,

    /** 从微信获得的用户信息 */
    userinfo: WechatUserInfoRaw
  }

  const data: LoginData = ctx.request.body
  const session = await wechat.getSession(data.code)
  const userinfo = await wechat.decodeUserInfo(session.session_key, data.userinfo)

  // 保存用户信息
  await User.update({ _id: userinfo.openId }, { $set: userinfo }, { upsert: true })

  // 生成并保存 3rd session
  const newSession: WechatSession = {
    id: '',
    openid: session.openid,
    sessionKey: session.session_key,
    salt: randomString(6)
  }

  newSession.id = sha1(newSession.openid + newSession.sessionKey + newSession.salt)
  await redis.set(newSession.id, newSession, 'EX', session.expires_in)

  // 签发 jwt 并返回
  ctx.result = jwt.sign({ sub: newSession.id }, config.secret, { expiresIn: session.expires_in })
})

export default router
