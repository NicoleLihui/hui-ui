# HuiTools.OnlinePreview

## 用途

> 基本支持主流办公文档和多种文件格式在线预览，如 jpg,jpeg,png,gif,doc,docx,Excel,pdf,txt,zip,rar,tar,gzip 等等

## 方法使用

### 参数 arguments 说明

| 参数名        | 类型   | 是否必须 | 说明                                       |
| ------------- | ------ | -------- | ------------------------------------------ |
| previewOrigin | String | Y        | 预览域名                                   |
| downloadUrl   | String | Y        | 下载地址，如是文件流，则需要传 params 参数 |
| params        | Object | N        | 下载参数，如是文件流，则需要传此参数       |

### 方法使用案例

```js
// 普通文件下载url预览
HuiTools.OnlinePreview({
  previewOrigin: 'https://fileview.net.cn',
  downloadUrl: 'http://127.0.0.1:8080/file/test.txt',
})
// http/https下载流url预览
HuiTools.OnlinePreview({
  previewOrigin: 'https://fileview.net.cn',
  downloadUrl: 'http://127.0.0.1:8080/filedownload',
  params: {
    fileId: 1,
    fullfilename: 'test.txt',
  },
})
```
