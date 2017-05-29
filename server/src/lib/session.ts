'use strict'

import * as jwt from 'jsonwebtoken'
import * as redis from './redis'
import { randomString, sha1 } from '../lib/util'

const config = require('../../config')

/** 检查 session 是否存在, 存在则返回 */
export function checkSession (wechatSession: WechatSessionRaw): Promise<WechatSession | null> {
  return redis.get(wechatSession.openid + wechatSession.session_key)
}

/** 新建一个 session */
export async function newSession (wechatSession: WechatSessionRaw) {
  const serverSessionKey = wechatSession.openid + wechatSession.session_key
  const serverSession: WechatSession = {
    id: '',
    openid: wechatSession.openid,
    sessionKey: wechatSession.session_key,
    salt: randomString(6),
    token: ''
  }

  serverSession.id = sha1(serverSessionKey + serverSession.salt)
  serverSession.token = jwt.sign({ sub: serverSession.id }, config.secret, { expiresIn: wechatSession.expires_in })

  await redis.set(serverSessionKey, serverSession, 'EX', wechatSession.expires_in)
  await redis.set(serverSession.id, serverSession, 'EX', wechatSession.expires_in)

  return serverSession
}
