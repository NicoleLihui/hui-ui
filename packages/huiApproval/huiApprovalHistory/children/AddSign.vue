<template>
  <div class="add-sign-wrapper">
    <p class="opinion-item" v-for="(itemAddPerson, indexPer) in assignMessage" :key="indexPer">
      <span class="current-detail" v-if="itemAddPerson.actionType !== 'SC'">
        <span>
          {{ deptAndName(itemAddPerson) }}
        </span>
        <span :class="getStatus(itemAddPerson.actionType).class" v-if="itemAddPerson.finishTime">{{
          `（${getStatus(itemAddPerson.actionType).name} ${itemAddPerson.finishTime || ''}）`
        }}</span>
        <span class="approving" v-else-if="itemAddPerson.ifCurrentTask">（审批中）</span>
        <span v-else>（未审批）</span>
      </span>
      <el-button
        v-if="canRemove(itemAddPerson) && !approvaling(indexPer)"
        type="text"
        size="small"
        @click="handleAddRemove(itemAddPerson)"
        >移除加签</el-button
      >
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, PropType } from 'vue'
import { deptAndName } from '../utils/index'
const props = defineProps({
  assignMessage: {
    type: Array as PropType<
      {
        [modalTypeVisible: string]: any
      }[]
    >,
    default: () => [],
  },
  taskId: String,
})

const canRemove = computed((person: any): any => {
  const currentUser = localStorage.getItem('userCode')
  if (person.finishTime) {
    return false
  } else if (person.parentUserCode !== currentUser) {
    return false
  } else if (person.userCode === currentUser) {
    return false
  } else if (person.actionType === 'SC') {
    return false
  } else {
    return true
  }
})
const finishedNum = computed((): number => {
  return props.assignMessage.reduce((per: number, cur: any) => {
    if (cur?.actionType && cur.actionType !== 'SC') {
      per++
    }
    return per
  }, 0)
})
const approvaling = computed((index): any => index === finishedNum)
const getStatus = computed((code): any => {
  const statusText = [
    { code: 'TG', name: '通过', class: 'approved' },
    { code: 'BH', name: '驳回', class: 'backspacing' },
    { code: 'ZZ', name: '不同意', class: 'backspacing' },
    { code: 'SC', name: '被删除', class: 'normal' },
    { code: 'JLSC', name: '被删除', class: 'normal' },
    { code: 'JLZZ', name: '被终止', class: 'normal' },
  ]
  const defaultStatus = { code: 'WZ', name: '未知', class: 'normal' }
  const res = statusText.filter(item => item.code === code)
  if (res.length) return res[0]
  else return defaultStatus
})
const handleTaskRemove = inject<any>('handleTaskRemove')
const handleAddRemove = (data: any) => {
  // @ts-ignore
  ElMessageBox.confirm(`确定移除加签人${data.userName}吗？`, '提示')
    .then(() => {
      handleTaskRemove({ createOrder: data.createOrder, taskId: props.taskId })
    })
    .catch(() => {
      ElMessage('取消移除')
    })
}
</script>

<style lang="scss" scoped>
.add-sign-wrapper {
  margin: 14px 0;
}
.opinion-item {
  display: flex;
  margin: 0;

  .current-detail {
    flex: 1;
    line-height: 22px;
    .approved {
      color: #28ba75;
    }
    .approving {
      color: #1775ff;
    }
    .backspacing {
      color: #f5222d;
    }
    &:nth-child(1) {
      padding-top: 0;
    }
  }
  .el-button {
    padding: 0;
    height: 16px;
    width: 50px;
  }
}
</style>
