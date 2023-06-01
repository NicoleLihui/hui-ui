# HuiOrganize 组件

## 组件用途

> 选择XX公司的组织或部门

## 组件使用

### 组件参数说明

| 参数名                | 类型                                                                              | 是否必须 | 说明                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| model-value / v-model | Boolean                                                                           | Y        | 是否展示此弹层                                                                                                                                                                                                                                                                                                                                         |
| orgDeptTreeApi        | (params: { type: string; includeDept: boolean }) => Promise<OrganizeType / false> | Y        | 获取组织树数据的方法，当组件内部调用这个方法的时候，用户可以根据组件给出的请求参数调整与业务后端定义的请求值，并在这个函数中以 promise 的方式返回组织树数据，请求失败时需要用户在前端进行提示并返回 false 数据不渲染; interface OrganizeType { id: string name: string type: number parentId?: string $treeNodeId?: number children?: OrganizeType[] } |
| checkedKeysData       | Array                                                                             | N        | 多选时，用来回显的列表；内部可以是需要回显的 ID 值，也可以是对象，如 [ '001', '002', ... ] 或 [ { id: '001', ... }, { id: '002', ... }, ... ]                                                                                                                                                                                                          |
| currentNodeKey        | String Object                                                                     | N        | 单选时，用来回显的数据，可以是需要回显的 ID 值，也可以是对象，如 '001' 或 { id: '001', ... }                                                                                                                                                                                                                                                           |
| title                 | String                                                                            | N        | 弹层标题；默认 “项目归属”                                                                                                                                                                                                                                                                                                                              |
| multiple              | Boolean                                                                           | N        | 是否多选；默认 false                                                                                                                                                                                                                                                                                                                                   |
| includeDept           | Boolean                                                                           | N        | 是否仅包含组织，不包含部门；默认 false                                                                                                                                                                                                                                                                                                                 |
| draggable             | Boolean                                                                           | N        | 是否可以拖拽; 默认 false                                                                                                                                                                                                                                                                                                                               |

### 组件回调方法

| 方法名         | 说明                   | 参数                                              |
| -------------- | ---------------------- | ------------------------------------------------- |
| getCheckedData | 获取选择的数据         | 单选时返回参数为 Object；多选时，返回参数为 Array |
| closed         | 弹层关闭时调用         |                                                   |
| apiError       | 返回当前访问的接口数据 |                                                   |

### 组件使用案例

```js
<HuiOrganize :modelValue="visible" :orgDeptTreeApi="queryApi" @getCheckedData="getCheckedData" />

/**
 * orgDeptTreeApi参数使用案例
 * 方法接收子组件传过来的请求参数，在正式调用接口前可以根据与后端的约定扩增修改请求参数
 * 请求成功：按照组件需要的格式返回数据
 * 请求失败：返回异步的false
 **/
async function queryApi(params) {
  const response = await axios.get('/core/projectBaseInfo/manager/projects', { params: params })
  if (response.success) {
    const { data } = response
    Promise.resolve(data)
  } else {
    ElMessage.warning('组织数据请求失败。')
    Promise.resolve(false)
  }
}
```
