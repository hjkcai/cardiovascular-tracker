'use strict'

import * as User from '../models/user'
import * as Router from 'koa-router'
import ValidateMiddleware from '../lib/middlewares/validate'

const router = new Router()

// 获取完整用户信息
router.get('userinfo', async (ctx, next) => {
  ctx.result = await User.getUserInfo(ctx.session.openid)
})

// 修改用户信息
router.post('userinfo', ValidateMiddleware({
  birthday: 'date-time',
  height: 'number',
  disease: [{
    name: 'string',
    onset: 'date-time',
    cure: 'date-time'
  }]
}))

router.post('userinfo', async (ctx, next) => {
  await User.setUserInfo(ctx.session.openid, ctx.request.body)
  ctx.result = null
})

export default router
