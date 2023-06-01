# HuiApprovalImage 组件

## 组件用途

> 展示流程图，流程图上包含节点审批进度、节点处理详情等信息。

## 组件使用

### 组件参数说明

| 参数名               | 类型   | 是否必须 | 说明                                                                                     |
| -------------------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| approvalHistoryArray | Array  | Y        | 由流程引擎获取审批历史信息，其中包括当前节点及历史节点的审批人、审批意见、审批附件等信息 |
| modelJsonData        | Object | Y        | 流程图的节点、连线及流程图整体布局的信息                                                 |
| nodeInfo             | Object | Y        | 流程图的节点状态                                                                         |

### 组件使用案例

```js
<template>
  <HuiApprovalImage :approvalHistoryArray="approvalHistoryArray" :modelJsonData="modelJsonData" :nodeInfo="nodeInfo" />
</template>
```
