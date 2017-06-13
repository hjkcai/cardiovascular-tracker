'use strict'

import * as Router from 'koa-router'
import * as Weight from '../models/weight'
import * as validators from '../lib/validators'

const router = new Router()

// 获取体重记录
router.get('weight', async (ctx, next) => {
  interface WeightQuery {
    from: Date,
    to: Date
  }

  const data: WeightQuery = ctx.query
  data.from = validators.validateDate('from', data)
  data.to = validators.validateDate('to', data)

  ctx.result = await Weight.getWeightRecords(ctx.session.openid, data.from, data.to)
})

export default router
