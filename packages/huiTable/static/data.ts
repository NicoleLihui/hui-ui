import { Table } from '../types/type'
export const tableData: AnyObj[] = [
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
export const tableConfig: Table.Options<any> = {
  settingTable: true,
  tableId: 'HUIUI-TEST',
  height: 'calc(100vh - 200px)',
  paginationConfig: {
    total: 100,
    currentPage: 2,
    pageSize: 100,
  },
}
export const tableColumns: Table.Column[] = [
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
