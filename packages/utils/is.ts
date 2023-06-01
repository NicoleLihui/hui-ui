/**
 * 是否是url,不包含ip
 * @param  {string} path
 * @returns boolean
 */
export const isUrl = (path: string): boolean => {
  const reg = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
  return reg.test(path)
}
/**
 * @description 是否是 http+ip:端口号， ip， ip:端口号
 * @param  {string} path
 * @returns boolean
 */
export const isIpPort = (path: string): boolean => {
  const reg =
    /^(http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?|^((http:\/\/|https:\/\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(:\d{0,5})?(\/.*)?$/
  return reg.test(path)
}

/**
 * @param  {string|number|symbol} key
 * @param  {object} object
 * @returns keyiskeyoftypeofobject
 */
export const isValidKey = (key: string | number | symbol, object: object): key is keyof typeof object => {
  return key in object
}
