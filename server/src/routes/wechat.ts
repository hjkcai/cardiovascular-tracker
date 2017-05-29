'use strict'

import * as jwt from 'jsonwebtoken'
import * as User from '../models/user'
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
  const wechatSession = await wechat.getSession(data.code)
  const userinfo = await wechat.decodeUserInfo(wechatSession.session_key, data.userinfo)

  // 保存用户信息
  await User.updateWechatUserInfo(userinfo)

  // 先读取是否有已经保存的 session
  const serverSessionKey = wechatSession.openid + wechatSession.session_key
  let serverSession: WechatSession | undefined = await redis.get(serverSessionKey)
  if (serverSession == null) {
    // 生成并保存新的 session
    serverSession = {
      id: '',
      openid: wechatSession.openid,
      sessionKey: wechatSession.session_key,
      salt: randomString(6),
      token: ''
    }

    serverSession.id = sha1(serverSessionKey + serverSession.salt)
    serverSession.token = jwt.sign({ sub: serverSession.id }, config.secret, { expiresIn: wechatSession.expires_in })

    await redis.set(serverSessionKey, serverSession, 'EX', wechatSession.expires_in)
    await redis.set(serverSession.id, serverSession, 'EX', wechatSession.expires_in)
  }

  // 签发 jwt 并返回
  ctx.result = serverSession.token
})

export default router
