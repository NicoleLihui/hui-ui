const labelWidth = '120px'
const colLayout = { xl: 18, lg: 18, md: 24, sm: 24, xs: 24 }
const followOptions = [
  {
    label: '0',
    value: '不跟进',
  },
  {
    label: '1',
    value: '跟进',
  },
  {
    label: '2',
    value: '驳回',
  },
]
// '1': 项目启动 '0': 项目冻结
const judgeOptions = [
  {
    label: '1',
    value: '项目启动',
  },
  {
    label: '0',
    value: '项目冻结',
  },
]
const fileType = ['doc', 'docx', 'xlsx', 'xls', 'pdf', 'jpg', 'jpeg', 'png', 'gif']
const limit = 3
const limitSize = 200
const JSON_DATA = {
  list: [],
  config: {
    labelWidth: 100,
    labelPosition: 'right',
    size: 'small',
    customClass: '',
  },
}
export { labelWidth, colLayout, followOptions, judgeOptions, fileType, limit, limitSize, JSON_DATA }
