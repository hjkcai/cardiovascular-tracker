'use strict'

import axios from 'axios'
import { aesDecode, base64Decode, sha1 } from './util'

const config = require('../../config')
const appId: string = config.wechat.appId
const appSecret: string = config.wechat.appSecret

/** 解码微信用户数据 */
export function decodeUserInfo (sessionKey: string, userinfo: WechatUserInfoRaw): WechatUserInfo {
  if (sha1(userinfo.rawData + sessionKey) !== userinfo.signature) {
    throw new Error('Invalid wechat userinfo raw data')
  }

  const sessionKeyRaw = base64Decode(sessionKey)
  const encryptedDataRaw = base64Decode(userinfo.encryptedData)
  const ivRaw = base64Decode(userinfo.iv)

  const userinfoRaw = aesDecode(encryptedDataRaw, sessionKeyRaw, ivRaw)
  return JSON.parse(userinfoRaw)
}

/** 获得微信 session */
export async function getSession (code: string) {
  const session: WechatSession = (await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
    params: {
      appid: appId,
      secret: appSecret,
      js_code: code,
      grant_type: 'authorization_code'
    }
  })).data

  if (session.errmsg) {
    throw new Error(session.errmsg)
  }

  return session
}
