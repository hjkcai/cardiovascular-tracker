'use strict'

import { Middleware } from 'koa'
import { ValidationFailureError } from '../errors'
import { ajv, fromSchema, Schema } from '../ajv'

/** 数据校验中间件 */
export default function ValidateMiddlewareFactory (schema: Schema) {
  const validator = ajv.compile(fromSchema(schema))
  return (function ValidateMiddleware (ctx, next) {
    if (ctx.request.body == null) throw new ValidationFailureError('Empty request body')
    else if (validator(ctx.request.body)) return next()
    else throw new ValidationFailureError(ajv.errorsText(validator.errors))
  }) as Middleware
}
