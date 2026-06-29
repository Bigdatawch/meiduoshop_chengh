export function getCookie(name) {
  const r = document.cookie.match('\\b' + name + '=([^;]*)\\b')
  return r ? r[1] : undefined
}

export function setCookie(name, value, days) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toGMTString()
  }
  document.cookie = name + '=' + value + expires + '; path=/'
}

export function deleteCookie(name) {
  setCookie(name, '', -1)
}