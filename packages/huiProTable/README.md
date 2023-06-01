# HuiProTable 组件

## 组件用途

> HuiProTable 在 HuiTable 的基础之上进行了封装，预设了一些行为，体现为带查询项和分页的列表

## 组件使用

### 组件参数说明

| 参数名           | 类型                                                                                                                                                                                                                                                                                                                                               | 是否必须                            | 说明                                                                                                                                                                                                                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| request          | function(params: {}): Prommise<{ current: number, total: number, records: [] } / false>                                                                                                                                                                                                                                                            | Y                                   | 获取表格数据的方法，当组件内部调用这个方法的时候，用户可以根据组件给出的请求参数调整与业务后端定义的请求值，并在这个函数中以 promise 的方式返回表格数据和分页信息，请求失败时需要用户在前端进行提示并返回 false 表格数据不渲染                                                                                      |
| paramsData       | [HuiTable.columns]('../huiTable//README.md') & { searchType?: 'input' / 'textarea' / 'number' / 'select' / 'multi-select' / 'cascader' / 'radio' / 'time' / 'date' / 'date-time' / 'person' / 'organize' , searchable?: boolean, searchOptions?: any, searchValue?: any, valueOptions?: { label: string, value: string, children?: ValueOption }[] } | Y                                   | 表格的列配置，新增的参数为查询表单相关的配置，具体解释为：searchType 查询项数据录入框类型；searchable 是否作为查询项；searchOptions 不同的 searchType 的数据录入框类型所绑定的参数，大多数在 element-plus 文档上都可以找到对应的数据录入框及其属性；searchValue 初始查询数据；valueOptions 数据字典等（需规范格式） |
| title            | string                                                                                                                                                                                                                                                                                                                                             | N                                   | 表格标题                                                                                                                                                                                                                                                                                                            |
| multiOptions     | { name: string, command: Command, type?: 'primary'/'success' / 'warning' / 'danger' / 'info' / '', disabled?: boolean, children?: ButtonItem[] } []                                                                                                                                                                                                | N                                   | 表格标题同一行靠右侧的操作按钮，用来批量操作表格数据，此时应当展示表格多选列（selection）                                                                                                                                                                                                                           |
| proTableId       | string                                                                                                                                                                                                                                                                                                                                             | Y                                   | 在项目中表格的唯一标识                                                                                                                                                                                                                                                                                              |
| searchTable      | boolean                                                                                                                                                                                                                                                                                                                                            | N                                   | 是否展示查询表单                                                                                                                                                                                                                                                                                                    |
| selectable       | (row: any, index: number) => boolean                                                                                                                                                                                                                                                                                                               | N                                   | [HuiTable]('../huiTable//README.md')的选项，表示表格有多选列时，根据行数据，判断本行是否可被选中的方法，返回布尔值                                                                                                                                                                                                    |
| settingTable     | boolean                                                                                                                                                                                                                                                                                                                                            | N                                   | [HuiTable.options]('../huiTable//README.md')的选项，是否展示“表头设置”功能弹窗                                                                                                                                                                                                                                        |
| reserveSelection | boolean                                                                                                                                                                                                                                                                                                                                            | N                                   | [HuiTable.options]('../huiTable//README.md')的选项，分页查询是否保持页与页之间的选中状态                                                                                                                                                                                                                              |
| personProps      | { departApi, organizApi, slurUserApi, departByOrgIdApi, mdmUserByDeptIdApi, multiple: boolean }                                                                                                                                                                                                                                                    | Y（使用‘person’类型的输入框时必传） | 参考[HuiPerson 组件]('../huiPerson/README.md')                                                                                                                                                                                                                                                                        |
| organizeProps    | { orgDeptTreeApi }, multiple: boolean }                                                                                                                                                                                                                                                                                                            | Y(使用‘organize’类型的输入框时必传) | 参考[HuiOrganize 组件]('../huiOrganize/README.md')                                                                                                                                                                                                                                                                    |

### 组件方法

| 方法名             | 说明                                                                 | 参数                                     |
| ------------------ | -------------------------------------------------------------------- | ---------------------------------------- |
| multiCommand       | 根据按钮的 command 来批量操作选中的行数据                            | 按钮的 command，选中的行                 |
| command            | 行按钮组的点击事件                                                   | 按钮的标识 command，行数据 row           |
| searchFormReset    | 如果插槽中的表单需要接收“重置”事件，重置插槽表单值，需要接收这个事件 | ——                                       |
| select-cols-change | 弹窗调整展示列事件，不需要后端接口保存时不用监听这个事件             | 展示列的 prop 参数组成的数组，数组有顺序 |

### 组件暴露方法

| 方法名       | 说明         | 参数                                       |
| ------------ | ------------ | ------------------------------------------ |
| getTableData | 刷新列表数据 | 当列表数据有变化时需要用户调用刷新列表数据 |
| resetForm    | 重置查询项   | 用户可以调用直接重置查询项为初始值         |

### 组件插槽

| name | 说明                                             |
| ---- | ------------------------------------------------ |
| form | 放在查询表单之后，可以放置一些有联动关系的查询项 |

#### 使用插槽，为了使插槽与主表单保持一致，需要：

> 在父组件中额外增加如下的 scss 样式实现响应式布局
> 需要监听“searchFormReset”事件，点击“重置”按钮时，插槽中的表单字段需要用户自行重置
> 插槽带来了灵活性，但同时也增加了使用复杂性，建议组件提供的输入类型可以满足需求的情况下不使用插槽

```scss
@media screen and (max-width: 1920px) {
  .el-form-item {
    width: 25%;
  }
}

@media screen and (max-width: 1440px) {
  .el-form-item {
    width: 33.3%;
  }
}

@media screen and (max-width: 1080px) {
  .el-form-item {
    width: 33.3%;
  }
}

@media screen and (max-width: 768px) {
  .el-form-item {
    width: 50%;
  }
}
```

### 组件使用案例

```js
<HuiProTable
  :request="requestTableData"
  :paramsData="paramsData"
  :title="'投资列表'"
  :multiOptions="multiOptions"
  :proTableId="tableId"
  @multiCommand="onMultiCommand"
  @searchFormReset="onsSearchFormReset"
>
  <template #form>
    <el-form-item prop="slot" label="插槽字段">
      <el-input v-model="inputvalue"></el-input>
    </el-form-item>
  </template>
</HuiProTable>
```
