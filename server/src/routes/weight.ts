'use strict'

import * as Router from 'koa-router'
import * as Weight from '../models/weight'

import { required } from '../lib/ajv'
import ValidateMiddleware from '../lib/middlewares/validate'
import FriendValidationMiddleware from '../lib/middlewares/friend'

const router = new Router()

// 获取体重记录
router.get('weight', ValidateMiddleware({
  from: required('date-time'),
  to: 'date-time'
}, 'query'))

router.get('weight', async (ctx, next) => {
  ctx.result = await Weight.getWeightRecords(ctx.session.openid, ctx.query.from, ctx.query.to)
})

// 获取朋友的体重记录
router.get('weight/:friendUid', FriendValidationMiddleware)
router.get('weight/:friendUid', ValidateMiddleware({
  from: required('date-time'),
  to: 'date-time'
}, 'query'))

router.get('weight/:friendUid', async (ctx, next) => {
  if (ctx.friend) {
    ctx.result = await Weight.getWeightRecords(ctx.friend._id, ctx.query.from, ctx.query.to)
  }
})

// 增加体重记录
router.post('weight', ValidateMiddleware({
  value: required('number'),
  date: 'date-time',
  note: 'string'
}))

router.post('weight', async (ctx, next) => {
  const data = ctx.request.body
  ctx.result = (await Weight.addWeightRecord(ctx.session.openid, data))._id
})

// 删除某一天的体重记录
router.delete('weight', ValidateMiddleware({ date: 'date-time' }, 'query'))
router.delete('weight', async (ctx, next) => {
  await Weight.removeWeightRecord(ctx.session.openid, ctx.query.date)
  ctx.result = null
})

export default router
