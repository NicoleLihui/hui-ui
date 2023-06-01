<template>
  <div class="history-item">
    <div class="title">
      <span class="color333 node-name">
        {{ historyItem.name }}
        <i v-if="historyItem.operation">{{ historyItem.operation }}</i>
      </span>
      <span class="color888 sub-name">
        {{ historyItem.subName }}
      </span>
      <ElTooltip effect="dark" v-if="historyItem.backSkipNode || historyItem.repeatSkipNode">
        <template #content>
          <p>
            <HuiIcon iconName="icon-info1"></HuiIcon>
            原因：
            <span v-if="historyItem.backSkipNode">驳回时已处理节点</span>
            <span v-else>与历史节点审批人相同</span>
            ，系统自动执行
          </p>
        </template>
        <span class="tag">自动执行</span>
      </ElTooltip>
    </div>
    <div class="detail-wrapper">
      <div v-if="historyItem.time" class="detail">
        <template v-if="historyItem.flag === 'normal' || historyItem.flag === 'abnormal'">
          <p class="approval-person" v-for="(person, index) in historyItem.assigneeList" :key="index">
            <BusinessCard
              :userName="person.userName || '-'"
              placement="top"
              :positionAndPhone="positionAndPhone(person)"
              :orgAndDept="orgAndDept(person)"
            ></BusinessCard>
            <span v-show="historyItem.status != 0" class="fr time color888">
              {{ historyItem.time || '' }}
            </span>
          </p>
        </template>
        <template v-if="historyItem.assignMessage && historyItem.assignMessage.length > 0">
          <p class="add-person">加签意见：</p>
          <AddSign :assignMessage="historyItem.assignMessage" />
        </template>
        <div class="opinion" v-if="historyItem.approvalFormValueJson">
          <template v-if="historyItem.approvalFormValueJson.approvalMessage !== historyItem.message">{{
            historyItem.message
          }}</template>
          <Opinion :approval-form-value-json="historyItem.approvalFormValueJson">
            <template #fileList="fileItem">
              <slot name="files" v-bind="fileItem"></slot>
            </template>
          </Opinion>
        </div>
        <div class="opinion" v-if="historyItem.handlerFormDefJson">
          <!-- 支持 FormMaking 表单回显 -->
          <template>
            <span>
              <fm-generate-form
                :compact-read="true"
                :data="historyItem.handlerFormDefJson"
                :value="historyItem.handlerFormValueJson"
              />
            </span>
          </template>
        </div>
        <div class="opinion" v-if="!historyItem.approvalFormValueJson && historyItem.message">
          {{ historyItem.message }}
        </div>
      </div>
      <div class="detail" v-if="historyItem.signPersonInfo && historyItem.signPersonInfo.length > 0">
        <p class="add-person">会签意见：</p>
        <ParallelSign :sign-person-info="historyItem.signPersonInfo" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BusinessCard from './BusinessCard.vue'
import AddSign from './AddSign.vue'
import Opinion from './Opinion.vue'
import { positionAndPhone, orgAndDept } from '../utils/index'
import ParallelSign from './ParallelSign.vue'
import HuiIcon from '../../../components/HuiIcon.vue'
const props = defineProps({
  historyItem: {
    type: Object,
    require: true,
    default: () => {},
  },
})
</script>

<style lang="scss" scoped>
.title {
  .tag {
    display: inline-block;
    padding: 0 5px;
    margin: 0 5px;
    height: 24px;
    line-height: 24px;
    border: 1px solid #ddd;
    color: $gray-text;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
  }

  .node-name {
    font-weight: 600;
  }

  .sub-name {
    font-size: 12px;
  }
}

.detail {
  background: #f6f6f6;
  overflow: hidden;
  padding: 16px;
  margin-top: 12px;

  .approval-person {
    height: 16px;
    line-height: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
  }

  .time {
    font-size: 12px;
  }

  .opinion {
    background: #fff;
    margin-top: 16px;
    padding: 6px 10px;
    text-align: left;
  }

  .add-person {
    vertical-align: top;
    margin-bottom: 10px;
    font-weight: 600;
  }
}
</style>
