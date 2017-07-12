'use strict'

import db from '../lib/db'
import { removeUndefined } from '../lib/util'
import { Document, Schema } from 'mongoose'

export interface Disease {
  name: string,
  onset: Date,
  cure: Date
}

export interface User extends Document {
  /** 等同于 openid */
  _id: string,

  /** 生日 */
  birthday: Date | null,

  /** 身高 */
  height: number | null,

  /** 疾病情况 */
  disease: Disease[],

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
  birthday: {
    type: Date,
    default: null
  },
  height: {
    type: Number,
    default: null
  },
  disease: {
    type: [{
      _id: false,
      name: String,
      onset: Date,
      cure: Date
    }],
    default: []
  },
  nickName: String,
  gender: Number,
  language: String,
  city: String,
  province: String,
  country: String,
  avatarUrl: String
})

export const model = db.model<User>('user', schema)

/** 获取用户信息 */
export function getUserInfo (openid: string) {
  return model.findById(openid).exec()
}

/** 修改用户信息 (只能修改不是从微信获取的用户信息) */
export function setUserInfo (openid: string, { birthday, height, disease }: Partial<User>) {
  return model.findByIdAndUpdate(openid, {
    $set: removeUndefined({ birthday, height, disease })
  }).exec()
}

/** 更新微信用户信息. 如果用户不存在则新建 */
export function updateWechatUserInfo (userinfo: WechatUserInfo) {
  return model.findByIdAndUpdate(userinfo.openId, { $set: userinfo }, { upsert: true }).exec()
}
