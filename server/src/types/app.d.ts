/** 从 wx.getUserinfo 得到的用户信息数据 */
declare interface WechatUserInfoRaw {
  encryptedData: string,
  iv: string,
  rawData: string,
  signature: string
}

/** 从微信获得的用户数据 */
declare interface WechatUserInfo {
  openId: string,
  nickName: string,
  gender: 0 | 1 | 2,
  language: string,
  city: string,
  province: string,
  country: string,
  avatarUrl: string,
  unionId: string,
  watermark: {
      appid: string,
      timestamp: number
  }
}

/** 从微信服务器上取得的原始 session 数据 */
declare interface WechatSessionRaw {
  openid: string,
  session_key: string,
  expires_in: number,
  errcode: number,
  errmsg: string
}
