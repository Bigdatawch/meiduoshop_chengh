export function validateUsername(username) {
  const re = /^[a-zA-Z0-9_-]{5,20}$/
  const re2 = /^[0-9]+$/
  if (re.test(username) && !re2.test(username)) {
    return { valid: true, message: '' }
  }
  return { valid: false, message: '请输入5-20个字符的用户名且不能为纯数字' }
}

export function validatePassword(password) {
  const len = password.length
  if (len < 8 || len > 20) {
    return { valid: false, message: '密码长度为8-20个字符' }
  }
  return { valid: true, message: '' }
}

export function validateMobile(mobile) {
  const re = /^1[345789]\d{9}$/
  if (re.test(mobile)) {
    return { valid: true, message: '' }
  }
  return { valid: false, message: '您输入的手机号格式不正确' }
}

export function validateEmail(email) {
  const re = /^[a-z0-9][\w\.\-]*@[a-z0-9\-]+(\.[a-z]{2,5}){1,2}$/
  if (re.test(email)) {
    return { valid: true, message: '' }
  }
  return { valid: false, message: '邮箱格式不正确' }
}