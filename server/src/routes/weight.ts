'use strict'

import * as Router from 'koa-router'
import * as Weight from '../models/weight'
import * as validators from '../lib/validators'

const router = new Router()

// 获取体重记录
router.get('weight', async (ctx, next) => {
  interface WeightQuery {
    from: Date,
    to?: Date
  }

  const data: WeightQuery = ctx.query
  data.from = validators.validateDate('from', data, true)
  data.to = validators.validateDate('to', data)

  ctx.result = await Weight.getWeightRecords(ctx.session.openid, data.from, data.to)
})

// 增加体重记录
router.post('weight', async (ctx, next) => {
  interface WeightData {
    value: number,
    date?: Date
  }

  const data: WeightData = ctx.request.body
  data.value = validators.validateNumber('value', data, true)
  data.date = validators.validateDate('date', data)

  ctx.result = (await Weight.addWeightRecord(ctx.session.openid, data.value, data.date))._id
})

// 删除某一天的体重记录
router.delete('weight', async (ctx, next) => {
  const date = validators.validateDate('date', ctx.query, true)
  await Weight.removeWeightRecord(ctx.session.openid, date)
  ctx.result = null
})

export default router
