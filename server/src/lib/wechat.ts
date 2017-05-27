'use strict'

import { aesDecode, base64Decode, sha1 } from './util'

const config = require('../../config')

/** 解码微信用户数据 */
export function decodeUserInfo (sessionKey: string, userinfo: WechatUserInfoRaw): WechatUserInfo {
  if (sha1(userinfo.rawData + sessionKey) !== userinfo.signature) {
    throw new Error('Invalid wechat userinfo raw data')
  }

  const appId: string = config.wechat.appId
  const sessionKeyRaw = base64Decode(sessionKey)
  const encryptedDataRaw = base64Decode(userinfo.encryptedData)
  const ivRaw = base64Decode(userinfo.iv)

  const userinfoRaw = aesDecode(encryptedDataRaw, sessionKeyRaw, ivRaw)
  return JSON.parse(userinfoRaw)
}
