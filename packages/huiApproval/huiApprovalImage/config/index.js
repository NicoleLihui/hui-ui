const tableCols = [
  {
    prop: 'name',
    label: '节点名称',
    minWidth: 120,
  },
  {
    prop: 'userName',
    label: '处理人',
    minWidth: 120,
  },
  {
    prop: 'createTime',
    label: '接收时间',
    minWidth: 150,
  },
  {
    prop: 'time',
    label: '处理时间',
    minWidth: 150,
  },
  {
    prop: 'consumingTime',
    label: '当前任务耗时',
    minWidth: 120,
  },
  {
    prop: 'message',
    label: '审核信息',
    minWidth: 180,
  },
  {
    key: 'flag',
    label: '审核结果',
    minWidth: 120,
    format: function (row) {
      return `<span>${getStatus(row)}</span>`
    },
  },
]

function getStatus(row) {
  let result = ''
  const flagDict = {
    cancel: '任务被认领',
    normal: '通过',
    abnormal: '未通过',
    others: '其他(转办、被删除等操作)',
  }
  if (row.flag) {
    result = flagDict[row.flag]
  } else {
    result = '未审批'
  }
  return result
}

export default tableCols
