export const colLayout = { xl: 6, lg: 8, md: 8, sm: 8, xs: 12 }

export const paramsDataDefault = {
  input: {
    clearable: true,
    maxLength: 200,
  },
  textarea: {
    showWordLimit: true,
    maxLength: 1000,
    autoSize: { minRows: 2, maxRows: 5 },
  },
  number: {
    min: 0,
    max: 100,
    'controls-position': 'right',
    'value-on-clear': null,
  },
  select: {
    clearable: true,
  },
  'multi-select': {
    clearable: true,
    mutilple: true,
    'collapse-tags': true,
    'collapse-tags-tooltip': true,
  },
  'remote-select': {
    filterable: true,
    mutilple: true,
    remote: true,
    'collapse-tags': true,
    'collapse-tags-tooltip': true,
    'reserve-keyword': true,
    placeholder: '请输入关键字查询',
    'no-match-text': '暂无数据',
    'no-data-text': '暂无数据',
  },
  cascader: {
    clearable: true,
    'show-all-levels': false, // 默认不显示完整的路径，仅展示最后一级
    'collapse-tags': true, // 多选模式下折叠tag
    'collapse-tags-tooltip': true,
    props: {
      multiple: false,
      value: 'value',
      label: 'label',
      children: 'children',
    },
  },
  time: {
    'is-range': false, // 默认不是选择时间范围
    clearable: true,
    format: 'hh:mm:ss',
  },
  date: {
    type: 'date',
    clearable: true,
    format: 'YYYY-MM-DD',
    'value-format': 'YYYY-MM-DD',
    'disabled-date': function disabledDate(time: Date) {
      return time.getTime() > Date.now()
    },
  },
  'date-time': {
    type: 'datetime',
    clearable: true,
    format: 'YYYY-MM-DD hh:mm:ss',
    'value-format': 'YYYY-MM-DD hh:mm:ss',
    'disabled-date': function disabledDate(time: Date) {
      return time.getTime() > Date.now()
    },
  },
}
