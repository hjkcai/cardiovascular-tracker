'use strict'

import * as Router from 'koa-router'
import * as HeartState from '../models/heart-state'
import * as validators from '../lib/validators'

const router = new Router()

// 获取心率血压记录
router.get('heart-state', async (ctx, next) => {
  interface HeartStateQuery {
    from: Date,
    to?: Date
  }

  const data: HeartStateQuery = ctx.query
  data.from = validators.validateDate('from', data, true)
  data.to = validators.validateDate('to', data)

  ctx.result = await HeartState.getHeartStateRecords(ctx.session.openid, data.from, data.to)
})

// 添加心率血压记录
router.post('heart-state', async (ctx, next) => {
  interface HeartStateData {
    heartRate: number,
    systolic: number,
    diastolic: number,
    date?: Date
  }

  const data: HeartStateData = ctx.request.body
  data.heartRate = validators.validateNumber('heartRate', data, true)
  data.systolic = validators.validateNumber('systolic', data, true)
  data.diastolic = validators.validateNumber('diastolic', data, true)
  data.date = validators.validateDate('date', data)

  ctx.result = (await HeartState.addHeartStateRecord(ctx.session.openid, data))._id
})

// 删除心率血压记录
router.delete('heart-state/:id', async (ctx, next) => {
  const _id: string = ctx.params.id
  await HeartState.removeHeartStateRecord(_id)
  ctx.result = null
})

export default router
