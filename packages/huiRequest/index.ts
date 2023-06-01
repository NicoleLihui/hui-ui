import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { startLoading, closeLoading } from './utils/servicesHelper'
import cancelRequest from './utils/cancelRequest'
import { getToken, setToken } from './utils/auth'

export type Result<T = any> = {
  success: boolean
  code: number
  message: string
  data: T
}

// 拓展 axios 请求配置，加入我们自己的配置
interface RequestOptions {
  repeatRequestCancel?: boolean
  loading?: boolean
}

// 拓展自定义请求配置
interface ExpandAxiosRequestConfig extends AxiosRequestConfig {
  interceptorHooks?: Function
  requestOptions?: RequestOptions
  tokenKey?: string
}

// 导出request类, 用户自定义传入配置来创建实例
export class Request {
  [x: string]: any
  // axios实例
  // instance: AxiosInstance
  // 2个请求配置 repeatRequestCancel: 防止重复发送统一请求 loading: 请求是否需要遮罩层
  // loading: boolean
  // repeatRequestCancel: boolean
  constructor(config: ExpandAxiosRequestConfig) {
    const baseConfig: ExpandAxiosRequestConfig = {
      timeout: 60 * 1000,
      headers: {},
      timeoutErrorMessage: '请求超时请稍后重试',
      requestOptions: {
        repeatRequestCancel: false,
        loading: false,
      },
      tokenKey: 'token',
      interceptorHooks: this.noAuthDefault,
    }
    this.instance = axios.create(Object.assign(baseConfig, config))
    const { tokenKey, interceptorHooks, requestOptions } = config
    this.loading = requestOptions?.loading || false
    this.repeatRequestCancel = requestOptions?.repeatRequestCancel || false
    // 请求拦截
    this.interceptors(tokenKey, interceptorHooks)
  }

  interceptors(tokenKey: string = 'token', interceptorHooks: Function = this.noAuthDefault) {
    this.instance.interceptors.request.use(
      (requestConfig: ExpandAxiosRequestConfig): any => {
        cancelRequest.removePending(requestConfig)
        this.repeatRequestCancel && cancelRequest.addPending(requestConfig)
        if (this.loading) startLoading()
        // 添加额外的请求头
        let token = tokenKey && getToken(tokenKey)
        if (token) {
          if (requestConfig?.headers) requestConfig.headers['Authorization'] = 'Bearer ' + token
          else {
            requestConfig.headers = {}
            requestConfig.headers['Authorization'] = 'Bearer ' + token
          }
        }
        return requestConfig
      },
      (error: any) => {
        return Promise.reject(error)
      }
    )

    // 返回拦截
    this.instance.interceptors.response.use(
      (res: AxiosResponse): Promise<Result> | undefined => {
        cancelRequest.removePending(res.config)
        if (this.loading) closeLoading()
        const accessToken = res.headers['access_token']
        if (accessToken) tokenKey && setToken(accessToken, tokenKey)
        const result: Result<any> = res.data
        const SUCCESS_CODE = 0
        const FAIL_CODE = -1
        if (result.code === SUCCESS_CODE) {
          return Promise.resolve(result)
        } else if (result.code === FAIL_CODE) {
          ElMessage.warning(result.message)
          return Promise.reject(result)
        }
      },
      (err: AxiosError) => {
        err.config && cancelRequest.removePending(err.config)
        if (this.loading) closeLoading()
        const { response } = err
        if (response) {
          // 请求已发出，但是不在2xx的范围
          this.errorHandle(response, interceptorHooks || this.noAuthDefault)
          return Promise.reject(response.data)
        } else {
          // 处理断网的情况
          if (err.name === 'CanceledError') return
          else {
            ElMessage.warning('网络连接异常，请稍后再试！')
            return
          }
        }
      }
    )
  }

  private noAuthDefault() {
    sessionStorage.clear()
    localStorage.clear()
  }
  /**
   * http握手错误
   * @param res 响应回调,根据不同响应进行不同操作
   */
  errorHandle(res: any, noAuth: Function = this.noAuthDefault) {
    // 状态码判断
    switch (res.status) {
      case 400:
        ElMessage.warning('请求错误（400）')
        break
      case 401:
        ElMessage.warning('无权限访问（401）')
        // 401需要处理重新登录获取token等逻辑
        noAuth()
        break
      case 403:
        ElMessage.warning('拒绝访问')
        break
      case 404:
        ElMessage.warning('请求的资源不存在')
        break
      case 500:
        ElMessage.warning('服务器错误（500）')
        break
      default:
        ElMessage.warning(`连接错误（${res.status}）!`)
    }
  }
  // 定义请求方法
  request<T = any>(config: ExpandAxiosRequestConfig): Promise<Result<T>> {
    return this.instance.request(config)
  }

  get<T = any>(url: string, config?: ExpandAxiosRequestConfig): Promise<Result<T>> {
    return this.instance.get(url, config)
  }

  post<T = any>(url: string, data?: any, config?: ExpandAxiosRequestConfig): Promise<Result<T>> {
    return this.instance.post(url, data, config)
  }

  put<T = any>(url: string, data?: any, config?: ExpandAxiosRequestConfig): Promise<Result<T>> {
    return this.instance.put(url, data, config)
  }

  delete<T = any>(url: string, config?: ExpandAxiosRequestConfig): Promise<Result<T>> {
    return this.instance.delete(url, config)
  }
}
