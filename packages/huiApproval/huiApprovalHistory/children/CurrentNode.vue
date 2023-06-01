<template>
  <div class="current-item">
    <span class="node-name">{{ itemContent.name }}</span>
    <el-button type="primary" class="remind-btn" @click="remind(itemContent)" size="small">催</el-button>
    <div class="assignee-wrapper color888" v-for="(person, personIndex) in itemContent.assigneeList" :key="personIndex">
      <BusinessCard
        :userName="person.userName || '-'"
        placement="top"
        :positionAndPhone="positionAndPhone(person)"
        :orgAndDept="orgAndDept(person)"
      ></BusinessCard>
      <i class="border-right" v-if="personIndex !== itemContent.assigneeList.length - 1"></i>
    </div>
    <template v-if="itemContent.assignMessage && itemContent.assignMessage.length > 0">
      <div class="detail">
        <p class="add-person">加签意见：</p>
        <AddSignPerson :assign-message="itemContent.assignMessage" :task-id="itemContent.taskId" />
      </div>
    </template>
    <template v-if="itemContent.signPersonInfo && itemContent.signPersonInfo.length > 0">
      <div class="detail">
        <p class="add-person">会签意见：</p>
        <ParallelSign :sign-person-info="itemContent.signPersonInfo" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import BusinessCard from './BusinessCard.vue'
import AddSignPerson from './AddSign.vue'
import ParallelSign from './ParallelSign.vue'
import { positionAndPhone, orgAndDept } from '../utils/index'
const props = defineProps({
  itemContent: {
    type: Object,
    require: true,
    default: () => {},
  },
  processId: String,
})
const emit = defineEmits(['reminder'])
const remind = (remindItem: any) => {
  emit('reminder', remindItem)
}
</script>

<style lang="scss" scoped>
.current-item {
  width: 100%;
  .remind-btn {
    background-color: $blue;
    margin-left: 10px;
    border-radius: 12px;
    padding: 5px;
  }
  .node-name {
    font-weight: 600;
  }
  .detail {
    background: #f6f6f6;
    overflow: hidden;
    padding: 16px;
    margin-top: 12px;
  }
  .assignee-wrapper {
    display: inline-block;
    &:first-of-type {
      margin-left: 10px;
    }
    .border-right {
      display: inline-block;
      width: 1px;
      height: 14px;
      margin: 0 10px;
      border-right: 1px solid #888;
      vertical-align: text-bottom;
    }
  }
}
</style>
