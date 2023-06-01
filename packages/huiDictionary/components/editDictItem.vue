<template>
  <el-dialog
    :title="title"
    v-model="visible"
    :append-to-body="true"
    class="pop-win"
    width="640px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroyOnClose
  >
    <el-form
      class="amv-form"
      label-position="right"
      label-width="100px"
      :rules="rules"
      ref="itemForm"
      :model="formInfo"
    >
      <el-form-item label="名称:" prop="label">
        <el-input v-model="formInfo.label" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="数据值:" prop="value">
        <el-input v-model="formInfo.value" placeholder="请输入数据值" />
      </el-form-item>
      <el-form-item label="父级:" prop="parentInfo">
        <el-select
          v-model="formInfo.parentInfo"
          value-key="value"
          placeholder="请选择父级"
          class="width-max"
          @change="handleChangParentCode"
        >
          <el-option v-for="item in parentList" :key="item.id" :label="item.label" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序:" prop="sortOrder">
        <el-input v-model="formInfo.sortOrder" maxlength="4" placeholder="请输入数值" />
      </el-form-item>
      <el-form-item label="备注:" prop="description">
        <el-input v-model="formInfo.description" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button class="btn-pop" @click="close()">取消</el-button>
      <el-button class="btn-pop" type="primary" :loading="uploadLoading" @click="addDict(itemForm)">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import useDict from '../hooks/useDictionary'

defineOptions({
  name: 'EditDictItem',
  inheritAttrs: false,
})
const props = withDefaults(
  defineProps<{
    parentCode: string
  }>(),
  {
    parentCode: '',
  }
)

const emit = defineEmits(['saveSuccessed'])

const { editItem } = useDict()

const title = '新增字典项'
const visible = ref(false)
// 提交加载状态
const uploadLoading = ref(false)
const itemForm = ref()
let parentList = reactive<any[]>([])
const formInfo = reactive<{
  label: string
  value: string
  description: string
  parentCode: string
  parentName: string
  sortOrder: string | number
  dictCode: string
  id: string | number
  parentInfo: {
    label: string
    value: string
  }
}>({
  label: '',
  value: '',
  description: '',
  parentCode: '',
  parentName: '',
  sortOrder: '',
  dictCode: '',
  id: '',
  parentInfo: {
    label: '',
    value: '',
  },
})
const rules = {
  label: [{ required: true, message: '请输入名称', trigger: 'change' }],
  value: [{ required: true, message: '请输入数据值', trigger: 'change' }],
}
// 打开弹窗
const open = (
  list: any[],
  item:
    | {
        label: string
        value: string
        description: string
        parentCode: string
        parentName: string
        sortOrder: string | number
        dictCode: string
        id: string | number
      }
    | undefined
) => {
  if (item) {
    formInfo.description = item.description
    formInfo.value = item.value
    formInfo.label = item.label
    formInfo.parentCode = item.parentCode
    formInfo.sortOrder = item.sortOrder
    formInfo.dictCode = item.dictCode
    formInfo.id = item.id
    formInfo.parentInfo = {
      label: item.parentName,
      value: item.parentCode,
    }
  } else {
    formInfo.description = ''
    formInfo.value = ''
    formInfo.label = ''
    formInfo.parentCode = ''
    formInfo.sortOrder = ''
    formInfo.dictCode = ''
    formInfo.id = ''
    formInfo.parentInfo = {
      label: '',
      value: '',
    }
  }
  parentList = list.filter(dictItem => {
    return dictItem.value !== item?.value
  })
  visible.value = true
}

// 导出方法
defineExpose({
  open,
})

const handleChangParentCode = item => {
  formInfo.parentCode = item.value
  formInfo.parentName = item.label
}
// 关闭弹窗并重置
const close = () => {
  // itemForm.resetFields()
  visible.value = false
}
// 提交 - 校验
const addDict = async formEl => {
  uploadLoading.value = true
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      editDictQuery()
    }
    uploadLoading.value = false
  })
}
// 提交请求
const editDictQuery = async () => {
  const res = await editItem({
    ...formInfo,
    dictCode: props.parentCode,
  })
  if (res.success) {
    ElMessage.success(res.message)
    emit('saveSuccessed')
    close()
  } else {
    ElMessage.warning(res.message || '操作失败！')
  }
}
</script>

<style lang="scss" scoped>
.amv-form {
  width: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .el-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .width-max {
    width: 100%;
  }
}
</style>
