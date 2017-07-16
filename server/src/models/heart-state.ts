'use strict'

import db from '../lib/db'
import { Document, Schema } from 'mongoose'

/** 心率血压记录 */
export interface HeartState extends Document {
  /** 本条记录对应患者的 openid */
  openid: string,

  /** 心率 */
  heartRate: number,

  /** 收缩压 */
  systolic: number,

  /** 舒张压 */
  diastolic: number,

  /** 心率血压记录时间 */
  date: Date,

  /** 备注 */
  note: string
}

export const schema = new Schema({
  openid: {
    type: String,
    index: true,
    required: true
  },
  heartRate: {
    type: Number,
    required: true
  },
  systolic: {
    type: Number,
    required: true
  },
  diastolic: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  note: {
    type: String,
    default: ''
  }
}, { toJSON: { versionKey: false } })

export const model = db.model<HeartState>('heart-state', schema)

// WARNING: 代码与 ./weight.ts getWeightRecords 重复
/** 获取某用户某时间范围的心率血压记录 */
export function getHeartStateRecords (openid: string, from: Date, to: Date = new Date()) {
  from = new Date(from)
  to = new Date(to)

  let $gte = from
  let $lte = to

  if (from > to) {
    $gte = to
    $lte = from
  }

  return model.find({ openid, date: { $gte, $lte } }, { openid: false }).sort({ date: -1 }).exec()
}

/** 添加心率血压记录 */
export function addHeartStateRecord (openid: string, { heartRate, systolic, diastolic, date = new Date(), note = '' }: Partial<HeartState>) {
  return new model({ openid, heartRate, systolic, diastolic, date, note }).save()
}

/** 删除心率血压记录 */
export function removeHeartStateRecord (_id: string) {
  return model.findByIdAndRemove(_id).exec()
}
