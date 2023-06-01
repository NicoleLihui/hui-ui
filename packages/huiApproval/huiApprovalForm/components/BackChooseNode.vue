<template>
  <el-dialog
    class="pop-win"
    :title="'驳回至指定节点'"
    v-if="dialogVisible"
    :visible="dialogVisible"
    @close="closeDialog"
  >
    <el-form ref="dialogForm" :model="formData">
      <el-form-item
        prop="targetActivityId"
        :rules="[
          {
            required: true,
            message: '请选择节点',
            trigger: 'change',
          },
        ]"
      >
        <el-radio-group v-model="formData.targetActivityId">
          <el-radio v-for="(i, index) in nodeList" :key="index" :label="i.nodeId" style="display: block">{{
            i.nodeName
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="handleDialog(dialogForm)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { PropType } from 'vue'
import { NodeItem, BackNode } from '../types/types'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  nodeList: {
    type: Array as PropType<NodeItem[]>,
    default: () => [],
  },
})

const emit = defineEmits(['update:dialogVisible', 'saveBackNode'])
let dialogForm = ref<FormInstance>()
let formData = reactive<BackNode>({
  targetActivityId: '',
  targetActivityName: '',
})
const closeDialog = () => {
  emit('update:dialogVisible', false)
}
const handleDialog = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      formData.targetActivityName = getNodeName()
      emit('saveBackNode', formData)
    } else {
      console.log('error submit', fields)
    }
  })
}
function getNodeName() {
  let name = ''
  props.nodeList.forEach(n => {
    if (n.nodeId === formData.targetActivityId) {
      name = n.nodeName
    }
  })
  return name
}
</script>

<style lang="scss" scoped>
:deep(.pop-win) {
  > div.el-dialog {
    width: 800px;

    .el-dialog__body {
      padding: 10px 20px 30px 30px;
    }
  }
}
</style>
