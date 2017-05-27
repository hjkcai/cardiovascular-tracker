'use strict'

const path = require('path')

module.exports = {
  db: {
    name: 'test',
    uri: 'mongodb://localhost'
  },
  logs: path.join(__dirname, 'logs'),
  port: 3000,
  secret: '',
  wechat: {
    appId: '',
    appSecret: ''
  }
}
