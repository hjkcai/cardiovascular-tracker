'use strict'

import db from '../lib/db'
import { NotFoundError } from '../lib/errors'
import { Document, Schema } from 'mongoose'
import { randomString, removeUndefined, sha1 } from '../lib/util'

export interface Disease {
  name: string,
  onset: Date,
  detail: string
}

export interface Friend {
  uid: string,
  confirmed: boolean
}

export interface User extends Document {
  /** 等同于 openid */
  _id: string,

  /** sha1(_id + salt), 在分享时作为用户唯一标识 */
  uid: string,

  /** 生日 */
  birthday: Date | null,

  /** 身高 */
  height: number | null,

  /** 疾病情况 */
  diseases: Disease[],

  /** 亲友信息 */
  friends: Friend[],

  // 从微信获得的信息
  nickName: string,
  gender: 0 | 1 | 2,
  language: string,
  city: string,
  province: string,
  country: string,
  avatarUrl: string,
}

export const schema = new Schema({
  _id: String,
  uid: {
    type: String,
    index: true
  },
  birthday: {
    type: Date,
    default: null
  },
  height: {
    type: Number,
    default: null
  },
  diseases: {
    type: [{
      _id: false,
      name: String,
      onset: Date,
      detail: String
    }],
    default: () => []
  },
  friends: {
    type: [{
      _id: false,
      uid: String,
      confirmed: Boolean
    }],
    default: () => []
  },
  nickName: String,
  gender: Number,
  language: String,
  city: String,
  province: String,
  country: String,
  avatarUrl: String
}, { toJSON: { versionKey: false } })

export const model = db.model<User>('user', schema)

/** 获取用户信息 */
export function getUserInfo (openid: string, fullInfo = true) {
  let projection: any = { _id: false }
  if (!fullInfo) {
    Object.assign(projection, {
      uid: true,
      birthday: true,
      height: true,
      diseases: true
    })
  }

  return model.findById(openid, projection).exec()
}

/** 修改用户信息 (只能修改不是从微信获取的用户信息) */
export function setUserInfo (openid: string, { birthday, height, diseases }: Partial<User>) {
  return model.findByIdAndUpdate(openid, {
    $set: removeUndefined({ birthday, height, diseases })
  }).exec()
}

/** 更新微信用户信息. 如果用户不存在则新建 */
export async function updateWechatUserInfo (userinfo: WechatUserInfo) {
  let doc = await model.findById(userinfo.openId)
  if (doc) {
    Object.assign(doc, userinfo)
  } else {
    doc = new model(userinfo)
    doc._id = userinfo.openId
    doc.uid = sha1(userinfo.openId + randomString(6))
  }

  return doc.save()
}

/** 添加亲友, 返回双方是否已经是亲友 */
export async function addFriend (openid: string, friendUid: string) {
  const user = await model.findById(openid)
  const friend = await model.findOne({ uid: friendUid })

  if (!user || !friend) {
    throw new NotFoundError()
  }

  let confirmed = false
  for (const friendItem of user.friends) {
    if (friendItem.uid === friendUid) {
      if (friendItem.confirmed) return true

      friendItem.confirmed = true
      confirmed = true
      break
    }
  }

  friend.friends.push({ uid: user.uid, confirmed })
  await friend.save()
  return confirmed
}
