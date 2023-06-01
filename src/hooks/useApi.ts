import axios, { AxiosRequestConfig } from 'axios'

export interface PageParams {
  currPage: number
  pageSize: number
  total?: number
}

export interface Response<T = any> {
  code: number
  data: T
  message: string
  success: boolean
}

export interface PageResult<T = any> {
  current: number
  size: number
  total: number
  records: T[]
}

export default function useApi(
  prefix: string,
  headers?: {
    [key: string]: any
  }
) {
  const http = axios.create({
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...(headers || {}),
    },
    baseURL: prefix,
  })

  http.interceptors.response.use(res => {
    if (res.status === 200) {
      if (!res.data.success) {
        ElMessage.error(res.data.message)
        throw res
      }
      return res
    } else {
      throw res
    }
  })
  http.interceptors.request.use(req => {
    if (req.headers['Content-Type'] === 'x-www-form-urlencoded') {
      const formData = new FormData()
      Object.keys(req.data).map(i => {
        formData.set(i, req.data[i])
      })
      req.data = formData
    }
    return req
  })

  return {
    ...http,
    get<T = any>(url: string, params?: any, config?: AxiosRequestConfig<any>) {
      return http
        .get<Response<T>>(url, {
          ...config,
          params,
        })
        .then(res => res.data)
    },
    post<T = any>(url: string, params?: any, config?: AxiosRequestConfig<any>) {
      return http.post<Response<T>>(url, params, config).then(res => res.data)
    },
    delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig<any>) {
      return http
        .delete<Response<T>>(url, {
          ...config,
          params,
        })
        .then(res => res.data)
    },
    put<T = any>(url: string, params?: any, config?: AxiosRequestConfig<any>) {
      return http.put<Response<T>>(url, params, config).then(res => res.data)
    },
  }
}
