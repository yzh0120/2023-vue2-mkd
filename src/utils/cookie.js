import Cookies from 'js-cookie'
//获取cookie
export function getCookie(name) {
  return Cookies.get(name)
}
//设置cookie
export function setCookie(name, value, expires = 1) {
  Cookies.set(name, value, {
    expires: expires
  })
}
//移除cookie
export function removeCookie(name) {
  return Cookies.remove(name)
}

export function getLocal(name) {
  return localStorage.getItem(name)
}

export function setLocal(name, val) {
  localStorage.setItem(name, val)
}

export function removeLocal(name) {
  return localStorage.removeItem(name)
}
