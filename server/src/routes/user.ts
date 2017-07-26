'use strict'

import * as User from '../models/user'
import * as Router from 'koa-router'
import { required } from '../lib/ajv'
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

// 获取亲友信息
router.get('friends', async (ctx, next) => {
  ctx.result = await User.getFriends(ctx.session.openid)
})

// 发起添加亲友请求, 返回双方是否已经是亲友
router.post('friend', ValidateMiddleware({ uid: required('string') }))
router.post('friend', async (ctx, next) => {
  ctx.result = await User.addFriend(ctx.session.openid, ctx.request.body.uid)
})

// 删除亲友
router.delete('friend', ValidateMiddleware({ uid: required('string') }, 'query'))
router.delete('friend', async (ctx, next) => {
  await User.removeFriend(ctx.session.openid, ctx.query.uid)
  ctx.result = null
})

export default router
