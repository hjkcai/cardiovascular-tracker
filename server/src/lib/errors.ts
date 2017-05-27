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

/** 微信用户信息验证失败 */
export class WechatUserInfoError extends UserError {
  constructor () {
    super('Invalid wechat userinfo', 1, 400)
  }
}

/** 微信 session 获取失败 */
export class WechatSessionError extends UserError {
  constructor (message: string) {
    super(message, 2, 401)
  }
}
