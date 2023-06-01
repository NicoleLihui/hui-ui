<template>
  <div :class="['title-container', title ? 'title-icon' : '']">
    <span class="title">{{ title }}</span>
    <div class="multi-btns">
      <template v-for="btn in multiOptions">
        <el-dropdown v-if="btn.children" class="dropdown-btns" type="primary" @command="handleMutilBtns">
          <el-button type="primary">{{ btn.name }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <template v-for="dropdown in btn.children">
                <el-dropdown-item :command="dropdown.command">{{ dropdown.name }}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          v-else
          :disabled="btn.disabled"
          :type="btn.type"
          :key="btn.command"
          @click="handleMutilBtns(btn.command)"
          >{{ btn.name }}</el-button
        >
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ProTable } from '../types/type'
defineOptions({
  name: 'ProTableTitle',
  inheritAttrs: false,
})
const props = defineProps<{
  title?: ProTable.Title
  multiOptions?: ProTable.ButtonItem[]
}>()
interface EmitEvent {
  (e: 'multiCommand', command: string, rows?: any[]): void
} // 表格批量操作按钮点击事件
const emits = defineEmits<EmitEvent>()

function handleMutilBtns(command: string) {
  emits('multiCommand', command)
}
</script>

<style lang="scss" scoped>
.title-container {
  display: flex;
  position: relative;
  width: 100%;
  height: 42px;

  .title {
    width: 50%;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .multi-btns {
    flex: 1;
    text-align: right;
    .dropdown-btns {
      margin-left: 12px;
    }
  }
}
.title-icon {
  @include table-title($blue);
  .title {
    position: absolute;
    left: 15px;
    height: 42px;
    line-height: 42px;
    font-size: 16px;
  }
}
</style>
