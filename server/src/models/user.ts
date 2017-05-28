'use strict'

import db from '../lib/db'
import { Document, Schema } from 'mongoose'

export interface User extends Document {
  /** 等同于 openid */
  _id: string,

  /** 生日 */
  birthday: Date | null,

  /** 身高 */
  height: number | null,

  /** 疾病情况 */
  disease: string,

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
    type: String,
    default: ''
  },
  nickName: String,
  gender: Number,
  language: String,
  city: String,
  province: String,
  country: String,
  avatarUrl: String
})

export default db.model<User>('user', schema)
