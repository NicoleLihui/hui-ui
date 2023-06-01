<template>
  <el-timeline :class="[direction === 'right' ? 'on-right' : '', 'timeline-wrapper']">
    <el-timeline-item class="gray" v-if="!isEnd">
      <div class="head"></div>
    </el-timeline-item>
    <el-timeline-item v-if="!isShowAll && currentTaskList.length > 1" class="current">
      <div class="head">
        <span class="color333 node-name">待审批</span>
        <HuiIcon v-if="currentTaskList.length > 1" @click.native="showMore" icon-name="icon-zhankai"></HuiIcon>
      </div>
    </el-timeline-item>
    <template v-else-if="isShowAll && currentTaskList.length > 1">
      <el-timeline-item v-for="(curItem, index) in currentTaskList" class="current" :key="index">
        <div class="head">
          <CurrentNode
            :item-content="curItem"
            :process-id="processId"
            @removeTaskAction="handleTaskRemove"
            @reminder="remindHandler"
          />
          <HuiIcon v-if="index === 0" @click.native="showMore" icon-name="icon-shouqi"></HuiIcon>
        </div>
      </el-timeline-item>
    </template>
    <template v-else-if="!isShowAll && currentTaskList.length === 1">
      <el-timeline-item v-for="(curItem, index) in currentTaskList" class="current" :key="index">
        <div class="head">
          <CurrentNode
            :item-content="curItem"
            :process-id="processId"
            @removeTaskAction="handleTaskRemove"
            @reminder="remindHandler"
          />
        </div>
      </el-timeline-item>
    </template>
    <el-timeline-item
      v-for="item in historyTaskList"
      :key="item.taskId"
      :class="item.flag === 'abnormal' ? 'abnormal' : ''"
    >
      <HistoryNode :history-item="item">
        <template #files="fileItem">
          <slot name="file" v-bind="fileItem"></slot>
        </template>
      </HistoryNode>
    </el-timeline-item>
  </el-timeline>
</template>
<!-- vue3.2.34以上版本, 单文件组件会自动根据文件名生成对应的 name 选项 -->
<script lang="ts" setup>
import { PropType } from 'vue'
import HistoryNode from './children/HistoryNode.vue'
import CurrentNode from './children/CurrentNode.vue'
import HuiIcon from '../../components/HuiIcon.vue'
defineOptions({
  name: 'HuiApprovalHistory',
  inheritAttrs: false,
})
const props = defineProps({
  approvalHistoryData: { type: Array as PropType<timeItem[]>, default: () => [], require: true },
  processId: { type: String, default: '', require: true },
  direction: { type: String, default: 'bottom', validator: (value: string) => ['right', 'bottom'].includes(value) },
})
const emit = defineEmits({
  removeTask: data => {
    if (data) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  },
  remindHandler: (processId, taskId) => {
    if (processId && taskId) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  },
})
const arrObj = reactive<{ historyTaskList: timeItem[]; currentTaskList: timeItem[] }>({
  historyTaskList: [],
  currentTaskList: [],
})
const { historyTaskList, currentTaskList } = toRefs(arrObj)
let isEnd = ref(false)
let isShowAll = ref(false)

watch(
  () => props.approvalHistoryData,
  (val: timeItem[]) => {
    if (val) {
      historyTaskList.value = []
      currentTaskList.value = []
      val.forEach((timeline: timeItem) => {
        if (timeline.ifCurrentTask) currentTaskList.value.push(timeline)
        else if (timeline?.signPersonInfo && Array.isArray(timeline?.signPersonInfo)) {
          timeline.name = '会签节点'
          if (timeline?.signPersonInfo.some(s => s.ifCurrentTask)) {
            timeline.ifCurrentTask = true
            currentTaskList.value.push(timeline)
          } else {
            timeline.ifCurrentTask = false
            historyTaskList.value.unshift(timeline)
          }
        } else historyTaskList.value.unshift(timeline)
      })
      if (historyTaskList.value[0]?.ifProcessEnd) {
        isEnd.value = true
      }
    }
  },
  { deep: true, immediate: true } // 深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大。
)

function showMore() {
  isShowAll.value = !isShowAll.value
}
function handleTaskRemove({ createOrder, taskId }: any): void {
  const data = {
    createOrder,
    procInstId: props.processId,
    taskId,
  }
  emit('removeTask', data)
}
provide('handleTaskRemove', handleTaskRemove)
function remindHandler(curItem: any) {
  const taskId = getCurrentTaskId(curItem)
  // @ts-ignore
  ElMessageBox.confirm('此操作将给审批人发送待阅消息, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      emit('remindHandler', props.processId, taskId)
    })
    .catch(() => {
      // @ts-ignore
      ElMessage('已取消催办')
    })
}
function getCurrentTaskId(curItem: any) {
  let taskId = ''
  // 如果是普通节点，直接拿到节点的taskId即可
  if (curItem?.taskId) {
    taskId = curItem.taskId
  } else if (curItem?.signPersonInfo) {
    const taskItem = curItem?.signPersonInfo.find((i: any) => {
      return !i.actionType
    })
    taskId = taskItem.taskId
  } else {
    return false
  }
  return taskId
}
</script>

<style lang="scss" scoped>
:deep.on-right {
  .el-timeline-item__content {
    .history-item {
      display: flex;
      width: 100%;

      .title {
        width: 200px;
      }

      .detail-wrapper {
        flex: 1;
        margin: 0;
      }
    }
  }
}

:deep .el-timeline-item {
  padding-bottom: 36px;

  .el-timeline-item__content {
    text-align: left;
  }
}

:deep .el-timeline-item__node {
  border: 2px solid #fff;
  box-sizing: border-box;
  background-color: $green;
}

:deep .el-timeline-item__tail {
  border-color: $green;
}

:deep .gray {
  .el-timeline-item__node {
    background-color: #dcdcdc;
  }

  .el-timeline-item__tail {
    border-color: #dcdcdc;
  }
}

:deep .current {
  .head {
    display: flex;
  }

  .el-timeline-item__node {
    background-color: $blue;
  }

  .el-timeline-item__tail {
    border-color: $blue;
  }

  .icon-shouqi,
  .icon-zhankai {
    font-size: 12px;
    color: #888;
    margin-left: 8px;
    transform: scale(0.5, 0.5);
  }
}

:deep .abnormal {
  .el-timeline-item__node {
    background-color: $red;
  }

  .el-timeline-item__tail {
    border-color: $red;
  }
}

:deep .el-timeline-item__timestamp {
  display: none;
}

.timeline-wrapper {
  background: #fff;
  padding: 0;

  .node-name {
    font-weight: 600;
  }

  .name-card {
    margin-left: 5px;
    font-size: 16px;
  }

  .node-wrapper {
    text-align: left;
  }

  .color888 {
    color: #888;
  }

  .color333 {
    color: #333;
  }

  p {
    margin: 0;
  }
}
</style>
