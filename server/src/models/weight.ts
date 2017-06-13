'use strict'

import db from '../lib/db'
import { removeUndefined } from '../lib/util'
import { Document, Schema } from 'mongoose'

/** 体重记录 */
export interface Weight extends Document {
  /** 本条记录对应患者的 openid */
  openid: string,

  /** 体重值 */
  value: number,

  /** 体重记录时间 */
  date: Date
}

export const schema = new Schema({
  openid: {
    type: String,
    index: true,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

export const model = db.model<Weight>('weight', schema)
