'use strict'

import * as User from '../models/user'
import * as Router from 'koa-router'
import ValidateMiddleware from '../lib/middlewares/validate'

const router = new Router()

// 获取部分用户信息
router.get('userinfo', async (ctx, next) => {
  ctx.result = await User.getUserInfo(ctx.session.openid, false)
})

// 修改用户信息
router.post('userinfo', ValidateMiddleware({
  birthday: 'date-time',
  height: 'number',
  diseases: [{
    name: 'string',
    onset: 'date-time',
    detail: 'string'
  }]
}))

router.post('userinfo', async (ctx, next) => {
  await User.setUserInfo(ctx.session.openid, ctx.request.body)
  ctx.result = null
})

export default router
