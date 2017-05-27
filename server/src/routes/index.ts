'use strict'

import * as glob from 'glob'
import * as path from 'path'
import * as Router from 'koa-router'

const router = new Router()

// 读取 routes 文件夹下的所有 js 文件
const routes = glob.sync(path.join(__dirname, '!(index).js'))

// 逐个加入主路由中
for (const route of routes) {
  const subrouter: Router | null = require(route).default
  if (subrouter instanceof Router) {
    router.use(subrouter.routes())
  }
}

export default router
