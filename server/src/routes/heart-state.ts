'use strict'

import * as Router from 'koa-router'
import * as HeartState from '../models/heart-state'

import { required } from '../lib/ajv'
import ValidateMiddleware from '../lib/middlewares/validate'

const router = new Router()

// 获取心率血压记录
router.get('heart-state', ValidateMiddleware({
  from: required('date-time'),
  to: 'date-time'
}, 'query'))

router.get('heart-state', async (ctx, next) => {
  ctx.result = await HeartState.getHeartStateRecords(ctx.session.openid, ctx.query.from, ctx.query.to)
})

// 添加心率血压记录
router.post('heart-state', ValidateMiddleware({
  heartRate: required('number'),
  systolic: required('number'),
  diastolic: required('number'),
  date: 'date-time',
  note: 'string'
}))

router.post('heart-state', async (ctx, next) => {
  ctx.result = (await HeartState.addHeartStateRecord(ctx.session.openid, ctx.request.body))._id
})

// 修改心率血压记录
router.post('heart-state', ValidateMiddleware({
  heartRate: 'number',
  systolic: 'number',
  diastolic: 'number',
  date: 'date-time',
  note: 'string'
}))

router.put('heart-state/:id', async (ctx, next) => {
  const _id: string = ctx.params.id
  await HeartState.editHeartStateRecord(ctx.session.openid, _id, ctx.request.body)
  ctx.result = null
})

// 删除心率血压记录
router.delete('heart-state/:id', async (ctx, next) => {
  const _id: string = ctx.params.id
  await HeartState.removeHeartStateRecord(_id)
  ctx.result = null
})

export default router
