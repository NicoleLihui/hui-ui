<template>
  <ul class="hui-capacity-pager">
    <li class="gray-1 back-to" title="回到首页" @click="setCurrentPage('number', 1)" v-if="current !== 1">
      <el-icon :size="iconSize">
        <DArrowLeft />
      </el-icon>
    </li>
    <span class="prev" :class="{ disabled: current && current === 1 }" @click="setCurrentPage('prev')">
      <el-icon :size="iconSize">
        <ArrowLeft />
      </el-icon>
    </span>

    <li
      v-for="pager in pagers"
      :key="pager"
      :class="{ 'is-active': current === pager }"
      @click="setCurrentPage('number', pager)"
      class="number"
    >
      {{ pager }}
    </li>

    <span class="next" :class="{ disabled: nextDisabled }" @click="setCurrentPage('next')">
      <el-icon :size="iconSize">
        <ArrowRight />
      </el-icon>
    </span>
  </ul>
</template>

<script lang="ts" setup>
import { DArrowLeft, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
defineOptions({
  name: 'HuiCapacityPager',
  inheritAttrs: false,
})
const props = defineProps<{
  type?: 'slide' | 'scroll'
  currentPage: Number | String // 当前页
  total: Number | String // 当前页之后还有多少条数据
  capacity: Number | String // 查询池容量
  pageSize?: 10 | 20 | 50 | 100 | 500 | 1000 // 每页数据容量
}>()
type ChangeType = 'prev' | 'next' | 'number'
const emit = defineEmits(['page-change'])
const pagerCapacity = ref(props.pageSize || 20)
const pagerCount = Math.ceil(Number(props.capacity) / Number(pagerCapacity.value)) // 通过容量和每页数据容量计算出来展示几个按钮
const prevPagerCount = Math.ceil(pagerCount / 2) - 1 // 当前页(不包括当前页)之前有几页
const subPagerCount = pagerCount - prevPagerCount - 1 // 当前页(不包括当前页)之后有几页
const iconSize = 14
const rightTotalPages = computed(() => {
  return Math.ceil(Number(props.total) / pagerCapacity.value) - 1
})
let current = ref(Number(props.currentPage))
let nextDisabled = ref(false)

let pagers = computed(() => {
  let arr: number[] = []
  if (props.type && props.type === 'scroll') {
    if (rightTotalPages.value === 0) nextDisabled.value = true
    const capacityIndex = Math.ceil(current.value / pagerCount) - 1
    const startNumber = capacityIndex * pagerCount + 1
    console.log(startNumber)
    for (let i = startNumber; i <= current.value; i++) {
      arr.push(i)
    }
    console.log(arr, pagerCount - arr.length)
    let remindLen = pagerCount - arr.length <= rightTotalPages.value ? pagerCount - arr.length : rightTotalPages.value
    for (let i = 1; i <= remindLen; i++) {
      arr.push(current.value + i)
    }
  } else {
    // 默认使用滑动
    let subLength
    if (current.value <= prevPagerCount) {
      subLength = pagerCount - current.value > rightTotalPages.value ? rightTotalPages : pagerCount - current.value
    } else {
      subLength = rightTotalPages.value > subPagerCount ? subPagerCount : rightTotalPages.value
    }
    if (subLength === 0) nextDisabled.value = true // 当前剩余页码为0时 next按钮不能点击
    let preLength = pagerCount - subLength - 1

    if (current.value - preLength <= 0) preLength = current.value - 1
    // 剩余的数据量刚好是卡在最后一页
    for (let i = 1; i <= preLength; i++) {
      arr.unshift(current.value - i)
    }
    arr.push(current.value)
    for (let i = 1; i <= subLength; i++) {
      arr.push(current.value + i)
    }
  }
  return arr
})
const setCurrentPage = (type: ChangeType, pageNum: number | string = 1): void => {
  if (current.value === 1 && type === 'prev') return
  if (nextDisabled.value && type === 'next') {
    ElMessage.info('没有更多数据了')
    return
  }
  // 获取当前页码
  let num = current.value
  type === 'prev' ? num-- : type === 'next' ? num++ : (num = Number(pageNum))
  // 没有数据直接返回第一页
  if (props.total === 0) num = 1
  current.value = num
  emit('page-change', current.value)
}
</script>
<style lang="scss" scoped>
.hui-capacity-pager {
  li,
  span {
    display: inline-block;
    width: 28px;
    height: 28px;
    line-height: 28px;
    list-style: none;
    cursor: pointer;
    text-align: center;
    &:hover {
      color: $blue;
    }
  }
  li.is-active {
    color: $blue;
    border: 1px solid $blue;
    border-radius: 2px;
  }
  .disabled {
    cursor: not-allowed;
    color: $gray-1;
  }
  .prev:not(.disabled),
  .next:not(.disabled) {
    cursor: pointer;
    &:hover {
      color: $blue;
    }
  }
}
</style>
