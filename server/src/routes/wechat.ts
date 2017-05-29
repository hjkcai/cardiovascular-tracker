'use strict'

import * as User from '../models/user'
import * as Router from 'koa-router'
import * as wechat from '../lib/wechat'
import * as session from '../lib/session'

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

  // 读取或生成 3rd session
  let serverSession = await session.checkSession(wechatSession)
  if (serverSession == null) {
    serverSession = await session.newSession(wechatSession)
  }

  // 返回 jwt token
  ctx.result = serverSession.token
})

export default router
