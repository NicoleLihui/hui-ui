# HuiDictionary 组件

## 组件用途

> 字典模块，配置字典名及字典项

## 组件使用

### 组件参数说明

| 参数名    | 类型   | 是否必须 | 说明         |
| --------- | ------ | -------- | ------------ |
| urlPrefix | string | Y        | 请求地址前缀 |
| headers   | Object | Y        | 请求头       |

### 组件使用案例

```js
<HuiDictionary urlPrefix='http://10.10.20.13:19101/base' :headers='headers' />
```
