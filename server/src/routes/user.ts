'use strict'

import * as User from '../models/user'
import * as Router from 'koa-router'

const router = new Router()

// 获取完整用户信息
router.get('userinfo', async (ctx, next) => {
  ctx.result = await User.getUserInfo(ctx.session.openid)
})

// 修改用户信息
router.post('userinfo', async (ctx, next) => {
  interface UserInfoData {
    birthday: Date,
    height: number,
    disease: string[],
  }

  const data: UserInfoData = ctx.request.body
  await User.setUserInfo(ctx.session.openid, data)
  ctx.result = null
})

export default router
