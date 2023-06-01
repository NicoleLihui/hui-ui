# HuiPager 组件

## 组件用途

> 当数据量过多时，使用分页分解数据。

## 组件使用

### 组件参数说明

| 参数名      | 类型   | 是否必须 | 说明                                                      |
| ----------- | ------ | -------- | --------------------------------------------------------- |
| total       | Number | Y        | 总条目数                                                  |
| currentPage | Number | Y        | 当前页码                                                  |
| pageSize    | Number | Y        | 每页展示的条目数                                          |
| list        | Array  | Y        | 当前页的列表数据                                          |
| pageSizes   | Array  | N        | 每页展示的条目数可选值，默认 [10, 20, 50, 100, 500, 1000] |

### 组件方法

| 方法名   | 说明                                                                       | 参数 |
| -------- | -------------------------------------------------------------------------- | ---- |
| callback | 页码组件的每页限制条数改变、当前页改变，父组件监听到，会触发请求列表的事件 | 无   |

### 组件使用案例

```js
<HuiPager
  :total="total"
  v-model:currentPage="currentPage"
  v-model:pageSize="pageSize"
  :list="[]"
  @callback="onCallback"
></HuiPager>
```
