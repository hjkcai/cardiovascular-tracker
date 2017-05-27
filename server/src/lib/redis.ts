'use strict'

import { app } from './logger'
import * as redis from 'redis'

const client = redis.createClient()
client.on('error', (err: any) => {
  app.fatal('Redis error:')
  app.fatal(err)
  process.exit()
})

export default client

export function getRedis (key: string) {
  return new Promise<any>((resolve, reject) => {
    client.get(key, (err, result) => {
      if (err) reject(err)
      else resolve(JSON.parse(result))
    })
  })
}

export function setRedis (key: string, value: any) {
  return new Promise<void>((resolve, reject) => {
    client.set(key, JSON.stringify(value), err => {
      if (err) reject(err)
      else resolve()
    })
  })
}
