'use strict'

import { InvalidUserInputError } from './errors'

export interface Transformer<T> {
  (value: any): T
}

export interface Validator<T> {
  (value: T): boolean
}

/**
 * 验证某个值经过转换后是否符合某个条件.
 * 如果符合则返回这个值, 否则抛出异常
 *
 * @param field 要验证的值的名称 (用于显示在错误信息中)
 * @param value 要验证的值
 * @param throwIfFalsy 在转换值之后, 如果结果是 falsy 值时是否报错
 * @param transformer 转换器
 * @param validator 验证器
 */
export function validate<T> (
  field: string,
  value: any,
  throwIfFalsy: boolean,
  transformer: Transformer<T> | null,
  validator: Validator<T> | null
) {
  const transformedValue: T = transformer ? transformer(value) : value

  if (
    (throwIfFalsy && !transformedValue) ||
    (validator && !validator(transformedValue))
  ) {
    throw new InvalidUserInputError(field, value)
  }

  return transformedValue
}

/** 验证并转换日期型数据 */
export function validateDate (field: string, obj: any, throwIfFalsy: boolean = false) {
  return validate(field, obj[field], throwIfFalsy, v => new Date(v), v => Number.isNaN(+v))
}

/** 验证并转换数字型数据 */
export function validateNumber (field: string, obj: any, throwIfFalsy: boolean = false) {
  return validate(field, obj[field], throwIfFalsy, Number, Number.isNaN)
}

/** 验证并转换数组型数据 */
export function validateArray (field: string, obj: any) {
  return validate<any[]>(field, obj[field], true, null, Array.isArray)
}
