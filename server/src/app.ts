'use strict'

import './lib/db'
import router from './routes'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'

import AuthMiddleware from './lib/middlewares/auth'
import ApiResponserMiddleware from './lib/middlewares/api-responser'
import LoggerMiddleware from './lib/middlewares/logger'

const app = new Koa()
app.use(LoggerMiddleware)
app.use(bodyParser())
app.use(ApiResponserMiddleware)
app.use(AuthMiddleware(/\/login$/))
app.use(router.prefix('/api').routes())

export default app
