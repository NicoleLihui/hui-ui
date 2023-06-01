# HuiFiles 组件

## 组件用途

> 提供了附件上传之后或详情的文件展示列表

## 组件使用

### 组件参数说明

| 参数名       | 类型    | 是否必须 | 说明                                                                                    | 默认值                                   |
| ------------ | ------- | -------- | --------------------------------------------------------------------------------------- | ---------------------------------------- |
| downloadUrl  | String  | N        | 文件下载地址, 不传则下载触发回调                                                        | -                                        |
| headers      | Object  | N        | 下载接口需要设置接口的请求头部                                                          | -                                        |
| fileList     | Array   | N        | 文件展示列表数据，格式：{fileId: xx, fileName: xx}                                      | []                                       |
| readOnly     | Boolean | N        | 是否只读                                                                                | false                                    |
| spliceParam  | Boolean | N        | 是否拼接 fileId 到 url 上，如：域名/api/${fileId}, 默认为 域名/api?fileId=${fileId}     | false                                    |
| defaultProps | Object  | N        | 指定 fileId,fileName 为文件列表需要展示的某个属性值，如{fileId: 'id', fileName: 'name'} | {fileId: 'fileId', fileName: 'fileName'} |

### 组件回调方法

| 方法名      | 说明                                                                   | 参数               |
| ----------- | ---------------------------------------------------------------------- | ------------------ |
| on-preview  | 点击文件名称触发的回调,返回当前 file， 可搭配 HuiPreview 组件使用       | file: 当前文件对象 |
| on-remove   | 删除文件的回调,返回当前 file                                           | file: 当前文件对象 |
| on-download | 如若不传 downloadUrl，则触发下载文件的回调，自行处理下载,返回当前 file | file: 当前文件对象 |

### 组件使用案例

```js
<HuiFiles :file-list="[]" />
```
