'use strict'

import { Middleware } from 'koa'
import { ValidationFailureError } from '../errors'
import { ajv, fromSchema, Schema } from '../ajv'

/** 数据校验中间件 */
export default function ValidateMiddlewareFactory (schema: Schema, type: 'body' | 'query' = 'body') {
  const validator = ajv.compile(fromSchema(schema))
  return (function ValidateMiddleware (ctx, next) {
    const data = type === 'body' ? ctx.request.body : ctx.query
    if (data == null) throw new ValidationFailureError('Empty data')
    else if (validator(data)) return next()
    else throw new ValidationFailureError(ajv.errorsText(validator.errors))
  }) as Middleware
}
