'use strict'

import db from '../lib/db'
import { Document, Schema } from 'mongoose'

export interface User extends Document {
  /** 等同于 openid */
  _id: string,
  nickName: string,
  gender: 0 | 1 | 2,
  language: string,
  city: string,
  province: string,
  country: string,
  avatarUrl: string
}

export const schema = new Schema({
  _id: String,
  nickName: String,
  gender: Number,
  language: String,
  city: String,
  province: String,
  country: String,
  avatarUrl: String
})

export default db.model<User>('user', schema)
