'use strict'

import db from '../lib/db'
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

// WARNING: 代码与 ./heart-state.ts getHeartStateRecords 重复
/** 获取某用户某时间范围的体重记录 */
export function getWeightRecords (openid: string, from: Date, to: Date = new Date()) {
  let $gte = from
  let $lte = to

  if (from > to) {
    $gte = to
    $lte = from
  }

  return model.find({ openid, date: { $gte, $lte } }, { openid: false }).sort({ date: -1 }).exec()
}

/** 删除某一天的体重记录 */
export async function removeWeightRecord (openid: string, date: Date) {
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
  const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
  await model.remove({ openid, date: { $gte: dayStart, $lte: dayEnd} }).exec()
}

/** 添加一条体重记录 */
export async function addWeightRecord (openid: string, value: number, date: Date = new Date()) {
  // 删除当天的记录
  await removeWeightRecord(openid, date)

  // 创建新记录
  return new model({ openid, value, date }).save()
}
