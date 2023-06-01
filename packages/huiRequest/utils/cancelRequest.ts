import axios, { AxiosRequestConfig } from 'axios'
// 用map来收集请求的接口, 只要是请求地址, 请求方式, 请求参数一样, 就认为是重复发送的请求
const pendingMap = new Map()
// 拓展 axios 请求配置，加入我们自己的配置
export interface RequestOptions {
  repeatRequestCancel?: boolean
  loading?: boolean
  proxy?: boolean
}

// 拓展自定义请求配置
export interface ExpandAxiosRequestConfig extends AxiosRequestConfig {
  interceptorHooks?: Function
  requestOptions?: RequestOptions
  tokenKey?: string
}

/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns String
 */
function getPendingKey(config: ExpandAxiosRequestConfig) {
  let { url, method, params, data } = config
  if (typeof data === 'string') data = JSON.parse(data) // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}
/**
 * 储存每个请求的唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config
 */
function addPending(config: ExpandAxiosRequestConfig) {
  const pendingKey = getPendingKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken(cancel => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel)
      }
    })
}

/**
 * 删除重复的请求
 * @param {*} config
 */
function removePending(config: ExpandAxiosRequestConfig) {
  const pendingKey = getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey)
    cancelToken(pendingKey)
    pendingMap.delete(pendingKey)
  }
}

export default {
  getPendingKey,
  addPending,
  removePending,
}
