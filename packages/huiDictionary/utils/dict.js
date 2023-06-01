// 01字典列表cols
export const dictCols = [
  {
    type: 'selection',
    prop: 'selection',
    label: '多选',
    width: '50',
    align: 'center',
  },
  {
    prop: 'dictName',
    label: '字典名称',
    minWidth: 200,
    searchType: 'input',
    searchable: true, // 是否作为查询项
  },
  {
    prop: 'dictCode',
    label: '字典编号',
    minWidth: 150,
    searchType: 'input',
    searchable: true, // 是否作为查询项
  },
  {
    prop: 'description',
    label: '描述',
    minWidth: 150,
  },
  {
    prop: 'createdBy',
    label: '创建人',
    minWidth: 150,
  },
  {
    prop: 'gmtCreate',
    label: '创建时间',
    minWidth: 200,
  },
  {
    prop: 'modifiedBy',
    label: '更新人',
    minWidth: 150,
  },
  {
    prop: 'gmtModified',
    label: '更新时间',
    minWidth: 200,
  },
  {
    type: 'actions',
    prop: 'action',
    label: '操作',
    width: '180',
    buttons: [
      {
        name: '编辑',
        command: 'edit',
        type: 'primary',
      },
      {
        name: '配置字典',
        command: 'config',
        type: 'primary',
      },
      {
        name: '删除',
        command: 'delete',
        type: 'danger',
      },
    ],
  },
]

export const multiOptions = [
  {
    name: '新增',
    command: 'add',
    type: 'primary',
    disabled: false,
  },
  {
    name: '导入',
    command: 'import',
    disabled: false,
  },
  {
    name: '导出',
    command: 'export',
    disabled: false,
  },
]
// 02字典项cols
export const dictItemCols = [
  {
    prop: 'label',
    label: '名称',
    minWidth: 200,
    searchType: 'input',
    searchable: true, // 是否作为查询项
  },
  {
    prop: 'value',
    label: '数据值',
    minWidth: 150,
    searchType: 'input',
  },
  {
    prop: 'parentName',
    label: '父级',
    minWidth: 150,
  },
  {
    prop: 'sortOrder',
    label: '排序',
    minWidth: 150,
  },
  {
    prop: 'description',
    label: '备注',
    minWidth: 150,
  },
  {
    type: 'actions',
    prop: 'action',
    label: '操作',
    width: '180',
    buttons: [
      {
        name: '编辑',
        command: 'edit',
        type: 'primary',
      },
      {
        name: '删除',
        command: 'delete',
        type: 'danger',
      },
    ],
  },
]
export const multiItemOptions = [
  {
    name: '新增',
    command: 'add',
    type: 'primary',
    disabled: false,
  },
]
