# HuiTools.Request

## 用途

> 使用 axios 封装的请求类
>
> 1. 可以配置是否使用全局等待和取消重复请求等功能
> 2. 依据 HUI 约定的 Rest 统一返回接口来统一处理响应，抛出失败的错误信息、处理状态码为 200 以外的异常

## 方法使用

### 基于[AxiosRequestConfig](https://axios-http.com/docs/req_config)拓展的参数

> 常用的参数 url、baseURL、method、params、data、headers、timeout
> 拓展的参数见下表：

| 参数名           | 类型     | 是否必须 | 说明                                                                                                                                                             |
| ---------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| requestOptions   | Object   | N        | interface RequestOptions { repeatRequestCancel?: boolean loading?: boolean }，分别解释： repeatRequestCancel: 防止重复发送统一请求 loading: 请求是否需要遮罩层； |
| tokenKey         | String   | Y        | 业务系统专门给 cookie 中存储的 token 定义的键名（key），例如投资系统为“HUI_investment”                                                                          |
| interceptorHooks | Function | N        | 当接口返回状态码为 401（token 无效或没有 token 导致权限校验失败的状态码），执行的函数例如：处理重新获取 token、跳转到登录页面等逻辑                              |

### 使用案例

```javascript
const Request = HuiTools.Request
const noAuth = () => {
  sessionStorage.clear()
  localStorage.clear()
  router.replace('/login')
}
// 实例化
const request = new Request({
  baseURL: 'http://10.10.20.3:18000', // 可以获取环境变量中配置的地址、proxy/nginx代理的前缀等
  headers: {},
  requestOptions: { repeatRequestCancel: true, loading: true }, // 初始化时给一个初始值, 可以在任意的实例中再修改这个配置
  tokenKey: 'toke_key',
  interceptorHooks: noAuth,
})
// 使用
export function getProjectList() {
  request.loading = false // 重新配置对应请求的loading，会覆盖实例化时传入的requestOptions.loading
  request.repeatRequestCancel = true // 重新配置对应请求的取消重复请求配置，会覆盖实例化时传入的requestOptions.repeatRequestCancel
  return request.request({
    method: 'GET',
    url: '/core/front/projectList',
  })
}

export function getProjectList3() {
  request.loading = false // 重新配置对应请求的loading，会覆盖实例化时传入的requestOptions.loading
  request.repeatRequestCancel = false // 重新配置对应请求的取消重复请求配置，会覆盖实例化时传入的requestOptions.repeatRequestCancel
  return request.get('/core/front/projectList', { headers: { test1: 'testheaders' } })
}
```
