# HuiApprovalHistory 组件

## 组件用途

> 通过在流程审批页面引入流程历史组件，展示流程的历史节点及当前节点、处理人等信息。

## 组件使用

### 组件参数说明

| 参数名              | 类型   | 是否必须 | 说明                                                                                     |
| ------------------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| approvalHistoryData | Array  | Y        | 由流程引擎获取审批历史信息，其中包括当前节点及历史节点的审批人、审批意见、审批附件等信息 |
| direction           | String | N        | 可选值：bottom/right，默认值：bottom                                                     |
| processId           | String | Y        | 当前流程的流程实例 id                                                                    |

### 组件方法

| 方法名        | 说明                           | 参数                                                                                                                                                                                               |
| ------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| removeTask    | 处理当前加签列表中移除加签事件 | { taskId: '', params: { procInstId: '', createOrder: '' } }，taskId 为当前任务标识请求时放在请求路径中，params 作为请求参数，其中包括当前流程实例标识（procInstId）、当前加签人标识（createOrder） |
| remindHandler | 处理当前流程任务催办事件       | procInstId, taskId，分别为当前流程实例标识（procInstId），当前任务标识（taskId），请求时分别放在请求参数和路径中                                                                                   |

### 组件插槽

| name | 说明                                                                 |
| ---- | -------------------------------------------------------------------- |
| file | 在插槽中呈现文件信息，并处理文件下载等，审批节点没有附件信息时不展示 |

### 组件使用案例

```js
<HuiApprovalHistory
  :approvalHistoryData="approvalHistoryData"
  :processId="processId"
  @removeTask="onRemoveTask"
  @remindHandler="onRemindHandler"
></HuiApprovalHistory>
```
