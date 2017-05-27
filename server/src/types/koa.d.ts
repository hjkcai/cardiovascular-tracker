import 'koa'

declare module 'koa' {
  interface Context {
    /** 自定义的 RESTful API 返回接口 */
    result?: any
  }
}
