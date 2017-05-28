'use strict'

const path = require('path')

module.exports = {
  db: {
    name: 'cardiovascular-tracker',
    uri: 'mongodb://localhost'
  },
  logs: path.join(__dirname, 'logs'),
  port: 3000,
  secret: '',
  ssl: {
    key: '',
    cert: ''
  },
  wechat: {
    appId: '',
    appSecret: ''
  }
}
