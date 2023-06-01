import type { ElTable } from 'element-plus'
import type { ColumnCls, ColumnStyle, CellStyle } from 'element-plus'
export declare namespace Table {
  type VNodeChild = import('vue').VNodeChild
  type Type = 'selection' | 'index' | 'expand' | 'actions'
  type Size = 'large' | 'default' | 'small'
  type Align = 'center' | 'left' | 'right'
  type Command = string
  type Order = 'ascending' | 'descending'
  interface ButtonItem {
    name: string
    command: Command
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''
    disabled?: boolean
    children?: ButtonItem[]
  }
  interface Sort {
    prop: string
    order: Order
    init?: any
    silent?: any
  }
  interface Column<T = any> {
    // 对应列的类型。 如果设置了selection则显示多选框； 如果设置了 index 则显示该行的索引（从 1 开始计算）； 如果设置了 expand 则显示为一个可展开的按钮
    type?: Type
    label?: string
    prop: string
    slot?: string // 自定义插槽
    width?: string
    minWidth?: number
    align?: Align
    showOverflowTooltip?: boolean
    buttons?: ButtonItem[]
    render?: (row?: any, index?: number) => VNodeChild // 渲染函数，渲染这一列的每一行的单元格 使用内置的component组件可以支持h函数渲染和txs语法
    sortable?: boolean | 'custom' // 对应列是否可以排序， 如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件
    fixed?: boolean | 'left' | 'right'
    children?: Column<T>[] // 配置多级表头的数据集合, 具体用法可参考多级表头使用示例。
    format?: (row: T, column?: any, scope?: any) => string
  }

  interface Options<T> {
    height?: string | number
    // Table 的高度， 默认为自动高度。 如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。
    stripe?: boolean // 是否为斑马纹 table
    maxHeight?: string | number // Table 的最大高度。 合法的值为数字或者单位为 px 的高度。
    size?: Size // Table 的尺寸
    border?: boolean // Table 的纵向边
    showHeader?: boolean // 是否显示表头
    tooltipEffect?: 'dark' | 'light' // tooltip effect 属性
    paginationConfig?: Pagination // 分页器配置项，详情见下方 paginationConfig 属性,
    rowStyle?: ColumnStyle<T> // 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
    rowClassName?: ColumnCls<T> // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
    cellStyle?: CellStyle<any> | undefined // 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。
    headerCellStyle?: CellStyle<any> | undefined // 表头单元格的style样式，是一个object为所有表头单元格设置一样的 Style。注：CSSProperties类型就是一个对象，像正常在style中写css一样 {color: #f00}
    defaultSort?: Sort // 默认的排序列的 prop 和顺序。 它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序。
    rowKey?: string // 行数据的 Key，用来优化 Table 的渲染。
    highlightCurrentRow?: boolean // 是否要高亮当前行
    tableId?: string
    settingTable?: boolean // 是否展示“表头设置”功能弹窗
    reserveSelection?: boolean // 分页查询是否保持页与页之间的选中状态
  }
  interface Pagination {
    total?: number // 总条目数
    currentPage: number // 当前页数，支持 v-model 双向绑定
    pageSize: number // 每页显示条目个数，支持 v-model 双向绑定
  }
  type TableRef = typeof ElTable
  type extendElTable = TableRef & {
    paginationConfig?: Pagination
    tableId?: string
    settingTable?: boolean
    reserveSelection?: boolean
  }
}
