'use strict'

import * as User from '../models/user'
import * as Router from 'koa-router'
import { InvalidUserInputError } from '../lib/errors'

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
    disease: string[]
  }

  const data: Any<UserInfoData> = ctx.request.body

  if (data.birthday != null) {
    data.birthday = new Date(data.birthday)
    if (Number.isNaN(data.birthday.valueOf())) {
      throw new InvalidUserInputError('birthday', data.birthday)
    }
  }

  if (data.height != null) {
    data.height = Number.parseInt(data.height)
    if (Number.isNaN(data.height)) {
      throw new InvalidUserInputError('height', data.height)
    }
  }

  if (data.disease != null && !Array.isArray(data.disease)) {
    throw new InvalidUserInputError('disease', data.disease)
  }

  await User.setUserInfo(ctx.session.openid, data)
  ctx.result = null
})

export default router
