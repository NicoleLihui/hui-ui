<template>
  <div class="approval-img-box">
    <div
      ref="container"
      id="svgContainer"
      class="svg-container"
      :style="svgBox"
      @click.passive="clickBox($event)"
    ></div>
    <ExpandTable v-if="showTable" :table-data="currentList" :columns="tableCols" />
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import ExpandTable from '../../huiTable/index.vue'
import LogicFlow from '@logicflow/core'
import '@logicflow/core/dist/style/index.css'
import modelList from './models/index.js'
import tableCols from './config/index.js'
import transformObjforLogic from './utils/index.js'
import _ from 'lodash'
defineOptions({
  name: 'HuiApprovalImage',
  inheritAttrs: false,
})
const props = defineProps({
  approvalHistoryArray: {
    type: Array as PropType<timeItem[]>,
    default: () => [],
    require: true,
  },
  modelJsonData: {
    type: Object as PropType<ModelJson>,
    default: () => {},
    require: true,
  },
  nodeInfo: {
    type: Object as PropType<NodeInfo>,
    default: () => {},
    require: true,
  },
})
// interface
interface HistoryObj {
  [key: string]: AnyObj[]
}
// data
let svgObj = reactive({})
let historyResult = reactive<HistoryObj>({})
let showTable = ref(false)
let currentNodeId = ref('') // 当前table展示的审批节点id
let arrayObj = reactive<{ currentList: timeItem[]; flowInfo: HistoryObj }>({
  currentList: [],
  flowInfo: {},
})
const { currentList, flowInfo } = toRefs(arrayObj)
const normalAction = ['TG']
const abnormalAction = ['BH', 'ZZ', 'JLZZ', 'JLSC', 'SC']
const config = {
  stopScrollGraph: true,
  stopZoomGraph: true,
  stopMoveGraph: true,
  metaKeyMultipleSelected: true,
  edgeSelectedOutline: false, // 鼠标hover时显示边的外框
  keyboard: {
    enabled: true,
  },
  snapline: false,
  isSilentMode: true,
}
let svgBox = ref('height: 500px; width: 1000px')
// methods
function init() {
  const svgContainer: HTMLElement | null = document.querySelector('#svgContainer')
  if (svgContainer) {
    const bpmnContainer = new LogicFlow({
      container: svgContainer,
      ...config,
    })
    modelList.forEach((model: any) => {
      bpmnContainer.register(model)
    })
    transData()
    createEventListener(bpmnContainer)
    bpmnContainer.render(svgObj)
  }
}
// 先对流程节点中的流程进行分组
function filterHistory(list: timeItem[]) {
  enum nodeResult {
    backSkipNode = '驳回时已处理节点，系统自动执行',
    repeatSkipNode = '与历史节点审批人相同，系统自动执行',
  }
  list.map(h => {
    // 对于自动跳过的节点，增加说明文字
    if (h?.backSkipNode) {
      h.result = nodeResult.backSkipNode
    } else if (h?.repeatSkipNode) {
      h.result = nodeResult.repeatSkipNode
    }
    if (h?.taskDefinitionKey) {
      if (historyResult[h.taskDefinitionKey]) {
        historyResult[h.taskDefinitionKey].push(h)
      } else {
        historyResult[h.taskDefinitionKey] = [] // 第一次先初始化一个空数组
        historyResult[h.taskDefinitionKey].push(h)
      }
    }
    // 处理会签数据
    if (h?.signPersonInfo && Array.isArray(h.signPersonInfo)) {
      h.signPersonInfo.forEach(s => {
        s.isSignTask = true
      })
      // 如果是会签节点，这里需要递归调用
      filterHistory(h.signPersonInfo)
    }
  })
}
function getAssignList() {
  const history = _.cloneDeep(historyResult)
  for (let key in history) {
    history[key].forEach(item => {
      if (item?.assigneeList && item.assigneeList.length > 0) {
        item?.assigneeList.forEach((assigneeItem: any, index: number) => {
          const obj: AnyObj = {}
          obj.name = item?.name
          obj.userName = assigneeItem?.userName
          obj.createTime = item?.createTime
          obj.time = item?.time
          obj.message = item?.message || ''
          obj.flag = item?.flag
          if (item?.isSignTask) {
            obj.isSignTask = item.isSignTask
            obj.flag = item?.actionType === '' ? '' : item.flag
          }
          if (obj.time) {
            // 完成时间不为空，说明这个节点已经走过了
            obj.consumingTime = item.consumingTime || diffTime(obj.createTime, obj.time) // 后端没有返回用时就前端自己计算
            if (item?.userId && assigneeItem.userCode !== item.userId) {
              // 当assigneeList列表中的人员有不是节点经办人的人, 这个对应的任务已经被认领, 他这个状态应为取消状态
              obj.flag = 'cancel'
            } else {
              if (item?.assignMessage) {
                obj.assignMessage = item.assgnMessage
                obj.operation = item.operation
                obj.operationName = item.operationName
                // 前后加签时，节点还没有flag（需要加签人全部审批结束才有整个节点的结果），但此时节点审批人已经操作了“前/后加签”，可以给一个默认的flag为normal
                obj.flag = item.flag || 'normal'
              }
            }
          } else {
            // 说明节点没有完成
            obj.consumingTime = ''
          }
          obj.ifCurrentTask = item?.ifCurrentTask
          obj.id = item?.taskId + assigneeItem.userCode + index
          historyResult[key].push(Object.assign(assigneeItem, obj))
        })
        historyResult[key] = historyResult[key].filter(task => {
          return task.id
        })
      }
    })
  }
}
function getAssignMessage() {
  const history = _.cloneDeep(historyResult)
  for (let key in history) {
    history[key].forEach(item => {
      if (item?.assgnMessage && item.assgnMessage.length > 0) {
        item.assgnMessage.forEach((messageItem: AnyObj) => {
          const obj: AnyObj = {}
          obj.name = item?.operation
          obj.createTime = messageItem?.createTime || ''
          obj.time = messageItem?.finishTime || ''
          if (obj.time) {
            // 有time说明加签这个子任务已经完成
            obj.consumingTime = diffTime(obj.createTime, obj.time)
          } else {
            // 说明加签子任务没有完成
            obj.consumingTime = ''
          }
          obj.message = messageItem?.message || ''
          obj.id = item.id + messageItem?.createOrder // 唯一标识
          obj.flag = getAssignFlag(messageItem?.actionType)
          if (item.flag !== 'cancel') {
            if (item?.children && Array.isArray(item.children)) {
              item.children.push(Object.assign(messageItem, obj))
            } else {
              item.children = []
              item.children.push(Object.assign(messageItem, obj))
            }
          }
        })
      }
      if (item?.operationName) {
        item.message = item.message || item?.operation
      }
    })
  }
}
function getAssignFlag(actionType: string): string {
  let flag = ''
  enum Flag {
    y = 'normal',
    n = 'abnormal',
    o = 'others',
  }
  if (actionType) {
    if (normalAction.indexOf(actionType) >= 0) {
      flag = Flag.y
    } else if (abnormalAction.indexOf(actionType) >= 0) {
      flag = Flag.n
    } else {
      flag = Flag.o
    }
  }
  return flag
}
function timeFormat(time: string) {
  try {
    return time.replace(/-/g, '/')
  } catch (e) {
    return 0
  }
}
function diffTime(begin: string, end: string) {
  const beginTime = new Date(timeFormat(begin))
  const endTime = new Date(timeFormat(end))
  const dateDiff = endTime.getTime() - beginTime.getTime() // 时间差的毫秒数
  if (dateDiff) {
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) //计算出相差天数
    var leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000)) // 计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)
    return (
      (dayDiff ? dayDiff + '天' : '') +
      (hours ? hours + '小时' : '') +
      (minutes ? minutes + '分' : '') +
      (seconds ? seconds + '秒' : '')
    )
  } else {
    return ''
  }
}
function sortHistory(): HistoryObj {
  const res: AnyObj = {}
  Object.keys(historyResult).forEach(item => {
    res[item] = sortByTime(historyResult[item])
  })
  return res
}
function sortByTime(data: AnyObj) {
  // 时间最大值/最小值
  const maxTimeStr = '275760-09-13 08:00:00'
  const minTimeStr = ''
  // 避免没有时间的时候报错
  data.map((item: timeItem) => {
    if (!item?.time && !item.ifCurrentTask) {
      item.time = minTimeStr
    } else if (!item?.time && item.ifCurrentTask) {
      // 时间最大值
      item.time = maxTimeStr
    }
  })
  data.sort(function (a: timeItem, b: timeItem) {
    const time1 = a.time ? new Date(timeFormat(a.time)).getTime() : a.time
    const time2 = b.time ? new Date(timeFormat(b.time)).getTime() : b.time
    return time2 - time1
  })
  data.forEach((item: timeItem) => {
    if (item.time === maxTimeStr) {
      item.time = ''
    }
  })
  return data
}
function transData() {
  filterHistory(props.approvalHistoryArray)
  getAssignList()
  getAssignMessage()
  flowInfo.value = sortHistory()
  svgObj = transformObjforLogic(props.modelJsonData, flowInfo.value, props.nodeInfo)
  const height = props.modelJsonData.diagramHeight + 100
  const width = props.modelJsonData.diagramWidth + 60
  svgBox.value = 'height:' + height + 'px;' + 'width:' + width + 'px'
}
function createEventListener(bpmnContainer: any) {
  bpmnContainer.on('node:click', (model: AnyObj) => {
    currentNodeId.value = model.data.id
    currentList.value = []
    const noListTypes = [
      'StartEvent',
      'EndEvent',
      'SequenceFlow',
      'ExclusiveGateway',
      'ParallelGateway',
      'InclusiveGateway',
      'EventGateway',
    ]
    if (noListTypes.indexOf(model.data.type) !== -1) {
      hideTable()
      return
    } else {
      ;(flowInfo.value[currentNodeId.value] || []).forEach((item, index) => {
        currentList.value[index] = item
      })
      showTable.value = true
    }
  })
}
function clickBox(e: Event) {
  const el: HTMLElement | null = e.target as HTMLElement
  if (el && el.tagName === 'svg') {
    hideTable()
  }
}
function hideTable() {
  currentList.value = []
  currentNodeId.value = ''
  showTable.value = false
}
function refresh() {
  init()
}
defineExpose({ refresh })
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.approval-img-box {
  overflow: scroll;
  width: 100%;
  height: 100%;
  .table {
    width: 90%;
    margin: 20px 20px 40px;
  }
  .svg-container {
    padding: 20px;
    width: 1000px;
    height: 1000px;
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  &::-webkit-scrollbar {
    width: 8px; /*滚动条宽度*/
    height: 8px; /*滚动条高度*/
    background-color: white;
  }
  &::-webkit-scrollbar-track {
    height: 8px;
    width: 8px;
    background-color: #ffffff;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }
  /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 3px rgba(22, 22, 24, 0.3);
    background-color: rgba(221, 222, 224, 0.3); /*滚动条的背景颜色*/
    background-clip: padding-box;
    height: 8px;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }
}
</style>
