'use strict'

import app from './app'
import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
import { app as appLogger } from './lib/logger'

const config = require('../config')
const port = Number.parseInt(process.env.PORT || config.port || '3000')

// 在开发环境下使用 https 服务器
// 因为小程序一定要使用 https
let server: http.Server | https.Server
if (process.env.NODE_ENV === 'development') {
  server = https.createServer({
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert)
  }, app.callback())
} else {
  server = http.createServer(app.callback())
}

server.listen(port)
server.on('listening', () => {
  appLogger.info(`Server started at port ${port}`)
})

// 确保错误日志通过 logger 输出
function fatalErrorHandler (message: string) {
  return (err: Error) => {
    appLogger.fatal(message + ':')
    appLogger.fatal(err as any)
    server.close(() => process.exit(1))
  }
}

server.on('error', fatalErrorHandler('Error during server startup'))
process.on('uncaughtException', fatalErrorHandler('Uncaught exception'))
process.on('unhandledRejection', fatalErrorHandler('Unhandled promise rejection'))
