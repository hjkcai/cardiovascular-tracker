'use strict'

import * as User from '../../models/user'
import { Middleware } from 'koa'
import { NotFriendError } from '../errors'

/** 验证被请求的用户与请求者是朋友关系 */
export default (async function FriendValidationMiddleware (ctx, next) {
  const friendUid: string = ctx.params.friendUid
  const friend = await User.model.findOne({ uid: friendUid })
  const user = await User.model.findById(ctx.session.openid)

  if (
    !friend || !user ||
    !friend.friends.find(friend => friend.uid === user.uid) ||
    !user.friends.find(friend => friend.uid === friendUid)
  ) {
    throw new NotFriendError()
  }

  ctx.friend = friend
  return next()
}) as Middleware
