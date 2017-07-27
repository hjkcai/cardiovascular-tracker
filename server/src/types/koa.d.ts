import 'koa'

import { User } from '../models/user'

declare module 'koa' {
  interface Context {
    /** 自定义的 RESTful API 返回接口 */
    result?: any,

    session: WechatSession,

    friend?: User
  }
}
