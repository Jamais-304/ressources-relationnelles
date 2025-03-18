import Cookies from 'js-cookie'

export function setToken(name: string, token: string, expires = 14) {
  Cookies.set(name, token, { expires, secure: true, sameSite: 'Strict' })
}

export function getToken(name: string) {
  return Cookies.get(name)
}

export function removeToken(name: string | undefined) {
  if (name) {
    Cookies.remove(name)
  }
}
