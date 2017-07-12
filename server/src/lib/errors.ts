'use strict'

/** 自定义错误 */
export default class UserError extends Error {
  /** 错误编号 */
  code: number

  /** 该错误对应的 HTTP 响应码 */
  statusCode: number

  constructor (message: string, code: number = -1, statusCode: number = 500) {
    super(message)
    this.code = code
    this.name = 'UserError'
    this.statusCode = statusCode
  }
}

/** token 验证失败 */
export class TokenAuthorizationError extends UserError {
  constructor () {
    super('Invalid token', 1, 401)
  }
}

/** 微信用户信息验证失败 */
export class WechatUserInfoError extends UserError {
  constructor () {
    super('Invalid wechat userinfo', 100, 400)
  }
}

/** 微信 session 获取失败 */
export class WechatSessionError extends UserError {
  constructor (message: string) {
    super(message, 101, 401)
  }
}

/** 无效的用户输入 */
export class InvalidUserInputError extends UserError {
  constructor (field: string, value: any) {
    super(`Invalid ${field}: ${value}`, 102, 400)
  }
}

/** 用户输入验证失败 */
export class ValidationFailureError extends UserError {
  constructor (message: string) {
    super(message, 103, 400)
  }
}
