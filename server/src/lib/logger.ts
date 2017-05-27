'use strict'

import * as log4js from 'log4js'
import * as path from 'path'

const config = require('../../config.js')
const meta = require('../../package.json')

log4js.configure({
  appenders: [
    { type: 'console' },
    {
      type: 'logLevelFilter',
      level: 'ALL',
      maxLevel: 'WARN',
      appender: {
        type: 'dateFile',
        filename: path.join(config.logs, meta.name + '.log')
      }
    },
    {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: {
        type: 'dateFile',
        filename: path.join(config.logs, meta.name + '-errors.log')
      }
    }
  ]
})

export const app = log4js.getLogger('app')
export const http = log4js.getLogger('http')
