# HuiTable 组件

## 组件用途

> 多功能表格组件，具备可调整表格列的顺序、配置展示表格的列、选中行等功能，同时在项目中展示统一风格、样式的表格。

## 组件使用

### 组件参数说明

| 参数名     | 类型                          | 是否必须 | 说明                                                                                                                   |
| :--------- | :---------------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------- |
| tableData  | Array                         | Y        | 表格数据                                                                                                               |
| columns    | Array                         | Y        | 表格列属性，支持大部分 Element plus 的 Table-column 属性（详见[columns 属性详细说明](#1)）                             |
| options    | Object                        | N        | 表格配置，支持大多数 Element plus 的 Table 属性（详见[options 属性详细说明](#2)）                                      |
| isLock     | Boolean                       | N        | 否展示表头部分的锁定图标，默认展示                                                                                     |
| selectable | function(row, index): boolean | N        | 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以编辑勾选，默认可勾选 |

<h4 id="1">columns属性详细说明</h4>

| 属性名              | 类型                                    | 是否必须 | 说明                                                                                                                                                                                                                                                                              |
| :------------------ | :-------------------------------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                | selection \| index \| expand \| actions | N        | selection：多选选择列 index：序号列 actions：操作按钮列 expand：信息展开列；不提供 type 时默认为普通数据列                                                                                                                                                                        |
| label               | String                                  | N        | 显示的标题                                                                                                                                                                                                                                                                        |
| prop                | String                                  | Y        | 字段名称，对应列内容的字段名                                                                                                                                                                                                                                                      |
| width               | String                                  | N        | 列宽度，为固定宽度                                                                                                                                                                                                                                                                |
| min-width           | Number                                  | N        | 对应列的最小宽度， 对应列的最小宽度， 与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列                                                                                                                                                   |
| align               | center \| left \| right                 | N        | 对齐方式                                                                                                                                                                                                                                                                          |
| sortable            | Boolean                                 | N        | 列是否可以排序                                                                                                                                                                                                                                                                    |
| fixed               | Boolean \| 'left' \| 'right'            | N        | 固定列，可以指定固定在左侧或者右侧                                                                                                                                                                                                                                                |
| format              | function                                | N        | 对当前行展示做特殊处理，返回 html 片段                                                                                                                                                                                                                                            |
| showOverflowTooltip | Boolean                                 | N        | 当内容过长被隐藏时显示 tooltip，默认为 true                                                                                                                                                                                                                                       |
| buttons             | Array                                   | N        | 当 type 为“actions”时有效，数组中的每一项包括{ name: '', command: '', type: '', disabled: boolean, children: [] }，name 为按钮名称，command 为点击按钮时提供的事件标识，disabled 按钮是否可点击，children 是一组拥有同样属性的按钮列表，当按钮过多时，children 里面的按钮折叠展示 |
| render              | Render Function                         | N        | 渲染函数，渲染这一列的每一行的单元格 使用内置的 component 组件可以支持 h 函数渲染和 txs 语法                                                                                                                                                                                      |
| children            | Array                                   | N        | 配置多级表头的数据集合, 具体用法可参考[element-plus](https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7)官网多级表头使用示例                                                                                                                     |

<h4 id="2">options属性详细说明</h4>

| 属性名              | 类型                                                      | 是否必须 | 说明                                                                                                                                                                                                    |
| :------------------ | :-------------------------------------------------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| height              | Number                                                    | N        | Table 的高度， 默认为自动高度（不展示滚动条）。 如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。          |
| settingTable        | Boolean                                                   | N        | 是否展示“设置表头”弹窗                                                                                                                                                                                  |
| tableId             | String                                                    | N        | 当 settingTable 为 true 时必须                                                                                                                                                                          |
| rowKey              | function(row) / string                                    | N        | 行数据的 Key，用来优化 Table 的渲染； 在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。 类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。 |
| highlightCurrentRow | Boolean                                                   | N        | 是否要高亮当前行，当表格监听单选属性时建议开启                                                                                                                                                          |
| stripe              | Boolean                                                   | N        | 是否为斑马纹 table                                                                                                                                                                                      |
| maxHeight           | String \| Number                                          | N        | table 的最大高度，超出这个设定值会展示纵向滚动条                                                                                                                                                        |
| border              | Boolean                                                   | N        | table 的纵向边，默认为 true                                                                                                                                                                             |
| showHeader          | Boolean                                                   | N        | 是否展示表头                                                                                                                                                                                            |
| reserveSelection    | Boolean                                                   | N        | 分页查询是否保持页与页之间的选中状态                                                                                                                                                                    |
| paginationConfig    | Object                                                    | N        | 配合分页组件使用，主要用于展示行号，示例：{total: 100, currentPage: 1, pageSize: 20}                                                                                                                    |
| rowStyle            | function({ row, rowIndex }) / object                      | N        | 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。                                                                                                                           |
| rowClassName        | function({ row, rowIndex }) / string                      | N        | 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。                                                                                                                           |
| cellStyle           | function({ row, column, rowIndex, columnIndex }) / object | N        | 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。                                                                                                                   |
| headerCellStyle     | function({ row, column, rowIndex, columnIndex }) / object | N        | 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。                                                                                                           |

### 组件方法

| 方法名             | 说明                                                                                                | 参数                                     |
| :----------------- | :-------------------------------------------------------------------------------------------------- | :--------------------------------------- |
| selection-change   | 当选项发生变化时会触发该事件                                                                        | 所有被选中的行组成的数组                 |
| current-change     | 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性 | 当前行                                   |
| select-rows        | 当用户手动勾选数据行的 Checkbox 时触发的事件                                                        | selection, row                           |
| select-all         | 当用户手动勾选全选 Checkbox 时触发的事件                                                            | selection                                |
| row-click          | 当某一行被点击时会触发该事件                                                                        | row，column，event                       |
| cell-click         | 当某个单元格被点击时会触发该事件                                                                    | row, column, cell, event                 |
| row-db-click       | 当某一行被双击时触发                                                                                | row, column, event                       |
| command            | 按钮组事件                                                                                          | command，row                             |
| select-cols-change | 弹窗调整展示列事件，不需要后端接口保存时不用监听这个事件                                            | 展示列的 prop 参数组成的数组，数组有顺序 |

<!-- ### 组件插槽

| name | 说明                                                                                              |
| ---- | ------------------------------------------------------------------------------------------------- |
| ctrl | 插槽列（见使用案例），默认会依次排列在 cols 列之后，插槽列不能用“设置表头”进行排序和控制显示/隐藏 | -->

### 组件使用案例

```js
<HuiTable
  :tableData="tableData"
  :columns="tableColumns"
  :options="tableConfig"
  :isLock="true"
  @selection-change="onSelectionChange"
  @current-change="onCurrentChange"
  @select-rows="onSelectRows"
  @select-all="onSelectAll"
  @row-click="onRowClick"
  @cell-click="onCellClick"
  @row-db-click="onRowDbClick"
  @command="onCommand"
>
</HuiTable>
```

<details>
  <summary>点击展开查看数据样例</summary>

```js
export const tableData = [
  {
    id: 1,
    date: '2016-05-02',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 2,
    date: '2016-05-04',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 3,
    date: '2016-05-01',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
    children: [
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ],
  },
  {
    id: 4,
    date: '2016-05-03',
    name: 'wangxiaohu',
    englishName: 'kobe',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 31,
    date: '2016-05-01',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    id: 32,
    date: '2016-05-01',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
export const tableConfig = {
  settingTable: true,
  tableId: 'HUI-UI-TEST',
  height: '200px',
  paginationConfig: {
    total: 100,
    currentPage: 2,
    pageSize: 100,
  },
}
export const tableColumns = [
  {
    type: 'expand',
    prop: 'expend',
    label: '展开',
    width: '50',
    align: 'center',
    render: ({ row, index }) => {
      return h(
        'div',
        {
          style: 'width: 480px; padding: 20px 30px; background: #fdfdfd; line-heigth:20px',
        },
        [
          h('h3', { style: 'font-weight: 500' }, [`展开信息-${index + 1}`]),
          h('div', {}, [h('p', `姓名：${row.name}`), h('p', `日期：${row.date}`), h('p', `地址：${row.address}`)]),
        ]
      )
    },
  },
  {
    type: 'index',
    prop: 'index',
    label: '序号',
    align: 'center',
  },
  {
    type: 'selection',
    prop: 'selection',
    label: '多选',
    width: '50',
    align: 'center',
  },
  {
    prop: 'date',
    label: '日期',
    sortable: true,
    minWidth: 120,
  },
  {
    prop: 'name',
    label: '姓名',
    minWidth: 120,
    format: (row: any) => {
      if (row?.englishName) {
        return `<span style="color: #1775ff">${row.name} - ${row.englishName}</span>`
      } else {
        return `<span>${row.name}</span>`
      }
    },
  },
  {
    prop: 'address',
    label: '地址',
    minWidth: 120,
  },
  {
    type: 'actions',
    prop: 'action',
    label: '操作',
    width: '180',
    buttons: [
      {
        name: '删除',
        command: 'delete',
        type: 'danger',
      },
      {
        name: '查看',
        command: 'detail',
        type: 'primary',
      },
      {
        name: '更多',
        command: '',
        type: 'primary',
        children: [
          {
            name: '附件',
            command: 'files',
            type: 'primary',
          },
          {
            name: '编辑',
            command: 'edit',
            type: 'primary',
          },
        ],
      },
    ],
  },
]
```

</details>
