'use strict'

import * as Ajv from 'ajv'
import { ValidationFailureError } from './errors'

export const ajv = new Ajv()

/** 表示原始 ajv 的 schema */
export class RawSchema {
  schema: any

  constructor (schema: any) {
    this.schema = schema
  }
}

export type SingleRule = string | RawSchema | Schema
export type Rule = SingleRule | SingleRule[]

/** 类似于 mongoose 的 schema 定义 */
export interface Schema {
  [key: string]: Rule
}

/** 将单条规则转换为 ajv schema */
export function fromRule (rule: Rule): any {
  if (rule instanceof RawSchema) {
    return rule.schema
  } else if (typeof rule === 'string') {
    if (/^(number|integer|string|boolean|array|object|null)$/.test(rule)) {
      return { type: rule }
    } else {
      return { type: 'string', format: rule }
    }
  } else if (Array.isArray(rule)) {
    return { type: 'array', items: fromRule(rule[0]) }
  } else {
    return fromSchema(rule)
  }
}

/** 将多条规则转换为 ajv schema */
export function fromSchema (schema: Schema) {
  const result: any = { type: 'object', properties: {} }
  Object.keys(schema).forEach(key => {
    result.properties[key] = fromRule(schema[key])
  })

  return result
}
