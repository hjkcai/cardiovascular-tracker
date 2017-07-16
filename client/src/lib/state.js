'use strict'

import wepy from 'wepy'
import axios, { setToken } from '../lib/axios'

const state = {
  code: '',
  fontSize: 'normal'
}

export default state

export function unexceptedError (err) {
  // TODO: 上报错误
  wepy.showModal({
    title: '错误',
    content: `小程序遇到了无法处理的错误，请退出再打开小程序试试。若错误持续出现，请联系我们。\n${err}`
  })
}

export function login () {
  return _login().catch(err => unexceptedError(err))
}

async function _login () {
  let code, userinfo
  await wepy.showLoading({ title: '正在加载...', mask: true })

  if (state.code && await wepy.checkSession()) code = state.code
  else code = (await wepy.login()).code     // TODO: 错误处理

  while (true) {
    await wepy.getUserInfo().then(result => { userinfo = result })

    if (!userinfo) {
      await wepy.showModal({
        title: '提示',
        content: '心血管健康助力需要您的公开个人信息才能继续使用，请勾选用户信息权限'
      })

      await wepy.openSetting()
    } else break
  }

  const token = (await axios.post('login', { code, userinfo })).data
  if (token.code === 0) {
    setToken(token.data)
  } else {
    throw new Error(`登录错误: ${token.message} (${token.code})`)
  }

  await wepy.hideLoading()
}
