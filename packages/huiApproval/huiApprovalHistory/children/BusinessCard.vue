<template>
  <div class="card">
    {{ userName }}
    <el-tooltip effect="dark" placement="top-start" :v-if="userName != '-'">
      <template #content>
        <p>
          <HuiIcon iconName="icon-dianhua"></HuiIcon>
          {{ ' ' + positionAndPhone }}
        </p>
        <p>
          <HuiIcon iconName="icon-bumen-zhiwei"></HuiIcon>
          {{ ' ' + orgAndDept }}
        </p>
      </template>
      <HuiIcon iconName="icon-gerenxiangqing" class="icon-gerenxiangqing"></HuiIcon>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import HuiIcon from '../../../components/HuiIcon.vue'
const porps = defineProps<{
  userName: String
  positionAndPhone?: string
  orgAndDept?: string
}>()
</script>

<style lang="scss" scoped>
.card {
  display: inline-block;
  color: #888;
}

.tooltip-con {
  &-item {
    margin: 0;
    height: 20px;
    display: flex;
    align-items: center;
    font-size: 12px;

    > i {
      font-size: 10px;
      margin-right: 8px;
    }
  }
}

.icon-gerenxiangqing {
  font-size: 14px;
  margin-left: 4px;
  color: #888888;
}
</style>
