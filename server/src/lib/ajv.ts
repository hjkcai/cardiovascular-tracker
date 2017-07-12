'use strict'

import * as Ajv from 'ajv'
import { ValidationFailureError } from './errors'

export type SingleRule = string | RawSchema | RequiredField | Schema
export type Rule = SingleRule | SingleRule[]

/** 类似于 mongoose 的 schema 定义 */
export interface Schema {
  [key: string]: Rule
}

/** 表示原始 ajv 的 schema */
class RawSchema {
  data: any

  constructor (data: any) {
    this.data = data
  }
}

/** 表示必填字段 */
class RequiredField {
  data: any

  constructor (data: any) {
    this.data = data
  }
}

export const ajv = new Ajv()
export const raw = (data: any) => new RawSchema(data)
export const required = (data: any) => new RequiredField(data)

/** 将单条规则转换为 ajv schema */
export function fromRule (rule: Rule): any {
  if (rule instanceof RawSchema) {
    return rule.data
  } else if (rule instanceof RequiredField) {
    return fromRule(rule.data)
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
export function fromSchema (schema: Schema): any {
  const result = {
    type: 'object',
    properties: {} as any,
    required: [] as string[]
  }

  Object.keys(schema).forEach(key => {
    if (schema[key] instanceof RequiredField) {
      result.required.push(key)
    }

    result.properties[key] = fromRule(schema[key])
  })

  return result
}
