# HuiUpload 组件

## 组件用途

> 通过点击上传文件

## 组件使用

### 组件参数说明

| 参数名          | 类型         | 是否必须 | 说明                                                                                                                                            | 默认值     |
| --------------- | ------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| action          | string       | Y        | 上传的地址，请求 URL                                                                                                                            | -          |
| headers         | object       | N        | 设置上传的请求头部                                                                                                                              | -          |
| data            | object       | N        | 上传时附带的额外参数                                                                                                                            | -          |
| label           | string       | N        | 按钮文案                                                                                                                                        | '上传附件' |
| name            | string       | N        | 上传的文件字段名                                                                                                                                | 'file'     |
| drag            | Boolean      | N        | 是否拖拽                                                                                                                                        | false      |
| fileList        | UploadFile[] | N        | 默认已上传文件列表，格式：[{name: '文件名', uid: 123, status: 'success'}]                                                                       | []         |
| suffix          | string[]     | N        | 上传格式，用于格式校验， 如：['png', 'jpg', 'rar']                                                                                              | []         |
| accept          | string       | N        | 上传文件的系统弹窗可展示的[文件格式](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept)，原生属性,如'.jpg,.png,.xlsx' |            |
| showTips        | boolean      | N        | 是否显示描述信息                                                                                                                                | true       |
| limit           | number       | N        | 最大允许上传数量，同时也会显示在描述信息 tips 里                                                                                                | 10         |
| multiple        | boolean      | N        | 是否支持多选                                                                                                                                    | false      |
| showFileList    | boolean      | N        | 是否显示文件列表                                                                                                                                | false      |
| withCredentials | boolean      | N        | 支持发送 cookie 凭证信息                                                                                                                        | false      |
| fileSize        | number       | N        | 允许的文件大小限制(M)，同时也会显示在描述信息 tips 里                                                                                           | 200        |
| disabled        | boolean      | N        | 是否禁用                                                                                                                                        | false      |

### 组件回调方法

| 方法名     | 说明                                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| on-success | 上传成功的回调， 返回数据信息和文件，请自行处理上传结果提示                        |
| on-error   | 上传失败的回调，返回错误信息和文件，请自行处理错误结果提示                         |
| on-remove  | 删除文件的回调，返回文件，请自行处理文件的删除操作，可用 handleRemoveFile 方法删除 |

### 插槽

| 名称    | 描述           | 类型 |
| ------- | -------------- | ---- |
| default | 自定义默认内容 |      |

### 组件暴露方法

| 方法名           | 说明         | 参数类型          |
| ---------------- | ------------ | ----------------- | ---------------------- |
| handleRemoveFile | 手动移除文件 | (file: UploadFile | UploadRawFile) => void |

### 组件使用案例

```js
<HuiUpload action="xxx" @on-success="handleSuccess" @on-error="handleError" />
```
