# HuiUploadSlice 分片上传组件

## 组件用途

> 通过点击上传文件，将文件分片上传

## 组件使用

### 组件参数说明

| 参数名        | 类型     | 是否必须 | 说明                                                                                                                                            | 默认值     |
| ------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| fileListApi   | string   | Y        | 获取已上传的文件列表地址 API                                                                                                                    | -          |
| fileCheckApi  | string   | Y        | 检测文件是否已上传或已有切片地址 API                                                                                                            | -          |
| fileChunkApi  | string   | Y        | 上传切片地址 API                                                                                                                                | -          |
| fileDeleteApi | string   | Y        | 删除文件或切片地址 API                                                                                                                          | -          |
| headers       | object   | N        | 设置上传的请求头部                                                                                                                              | -          |
| label         | string   | N        | 按钮文案                                                                                                                                        | '上传附件' |
| drag          | Boolean  | N        | 是否拖拽                                                                                                                                        | false      |
| suffix        | string[] | N        | 上传格式，用户格式校验， 如：['png', 'jpg', 'rar']                                                                                              | []         |
| accept        | string   | N        | 上传文件的系统弹窗可展示的[文件格式](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept)，原生属性,如'.jpg,.png,.xlsx' | -          |
| showTips      | boolean  | N        | 是否显示描述信息 ｜ true                                                                                                                        |
| limit         | number   | N        | 最大允许上传数量，同时会显示在描述信息 tips 里                                                                                                  | -          |
| fileSize      | number   | N        | 允许的文件大小限制(M)，同时会显示在描述信息 tips 里                                                                                             | -          |
| disabled      | boolean  | N        | 是否禁用                                                                                                                                        | false      |

<!-- | fileDownloadApi | string   | Y        | 文件下载地址API                                    | -          |
| withCredentials | boolean  | N        | 支持发送 cookie 凭证信息                           | false      | -->

### 插槽

| 名称    | 描述           | 类型 |
| ------- | -------------- | ---- |
| default | 自定义默认内容 |      |

<!-- ### 组件暴露方法

| 方法名   | 说明             |
| -------- | ---------------- |
| getFiles | 获取已上传的文件 | --> |

### 组件使用案例

```js
<HuiUploadSlice :fileListApi="" :fileCheckApi="" />
```
