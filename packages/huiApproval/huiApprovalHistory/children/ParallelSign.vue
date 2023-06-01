<template>
  <p class="opinion-item" v-for="(itemAddPerson, indexPer) in signPersonInfo" :key="indexPer">
    <span v-if="itemAddPerson.assigneeList && itemAddPerson.assigneeList.length" class="current-detail">
      <span> {{ itemAddPerson.assigneeList[0].department }}-{{ itemAddPerson.assigneeList[0].userName }} </span>
      <span class="approved" v-if="itemAddPerson.actionType === 'TG'">{{
        `（通过 ${itemAddPerson.time || ''}）`
      }}</span>
      <span class="backspacing" v-else-if="itemAddPerson.actionType === 'ZZ'">{{
        `（不同意 ${itemAddPerson.time || ''}）`
      }}</span>
      <span class="backspacing" v-else-if="itemAddPerson.actionType === 'BH'">{{
        `（驳回 ${itemAddPerson.time || ''}）`
      }}</span>
      <span v-else-if="!itemAddPerson.actionType">（未审批）</span>
    </span>
  </p>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
const props = defineProps({
  signPersonInfo: {
    type: Array as PropType<
      {
        [modalTypeVisible: string]: any
      }[]
    >,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.opinion-item {
  display: flex;
  margin: 5px 0;
  .current-detail {
    flex: 1;
    .approved {
      color: #52c41a;
    }
    .approving {
      color: #1775ff;
    }
    .backspacing {
      color: #f5222d;
    }
  }
  .el-button {
    padding: 0;
    height: 16px;
    width: 50px;
  }
  &:last-child {
    margin-bottom: 10px;
  }
}
</style>
