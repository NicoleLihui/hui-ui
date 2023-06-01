import { getCookie, setCookie, removeCookie } from 'typescript-cookie'

export function getToken(tokenKey: string) {
  return getCookie(tokenKey)
}

export function setToken(tokenKey: string, token: string) {
  return setCookie(tokenKey, token)
}

export function removeToken(tokenKey: string) {
  return removeCookie(tokenKey)
}
