'use strict'

import './lib/db'
import * as Koa from 'koa'
import router from './routes'

import ApiResponserMiddleware from './lib/middlewares/api-responser'
import LoggerMiddleware from './lib/middlewares/logger'

const app = new Koa()
app.use(LoggerMiddleware)
app.use(ApiResponserMiddleware)
app.use(router.routes())

export default app
