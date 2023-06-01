import { Table } from '@packages/huiTable/types/type'
import { PersonTypes } from '@packages/huiPerson/types/type'
import { OrganizeTypes } from '@packages/huiOrganize/types/type'
export declare namespace ProTable {
  type VNodeChild = import('vue').VNodeChild
  type SearchType =
    | 'input'
    | 'textarea'
    | 'number'
    | 'select'
    | 'multi-select'
    | 'remote-select'
    | 'cascader'
    | 'radio'
    | 'time'
    | 'date'
    | 'date-time'
    | 'person'
    | 'organize'
  type Size = 'large' | 'default' | 'small'
  type PageSize = number
  interface FlexObj {
    [key: string]: any
  }
  interface Request {
    (params: FlexObj): Promise<any>
  }
  type ButtonItem = Table.ButtonItem
  type Sort = Table.Sort
  interface ValueOption {
    label: string
    value: string
    children?: ValueOption[]
  }
  type ParamsData = Table.Column & {
    // 作为列的配置, 也作为查询项的配置, 查询表单支持'input' | 'select'(options) | 'date-piker' | 'slot' (自定义) | 'options' | 'checkbox' 几种类型
    // 对应列的类型。 如果设置了selection则显示多选框； 如果设置了 index 则显示该行的索引（从 1 开始计算）； 如果设置了 expand 则显示为一个可展开的按钮
    searchType?: SearchType // 查询项数据录入框类型
    searchable?: boolean // 是否作为查询项
    searchOptions?: any // 不同的searchType的数据录入框类型所绑定的参数，大多数在element-plus文档上都可以找到对应的数据录入框及其属性
    searchValue?: any // 默认展示的初始数据
    valueOptions?: ValueOption[] // 数据字典等
  }
  type Title = string
  type ProTableId = string
  type Options<T = any> = Table.Options<T>
  type ExtendElTable = Table.extendElTable
  interface PagerProps {
    total?: number
    currentPage: number
    pageSize: number
  }
  interface PersonProps {
    departApi: PersonTypes.DepartApi
    organizApi: PersonTypes.SlurUserApi
    slurUserApi: PersonTypes.SlurUserApi
    departByOrgIdApi: PersonTypes.DepartByOrgIdApi
    mdmUserByDeptIdApi: PersonTypes.MdmUserByDeptIdApi
    multiple: boolean
  }
  interface OrganizeProps {
    orgDeptTreeApi: OrganizeTypes.OrgDeptTreeApi
    multiple: boolean
  }
}
