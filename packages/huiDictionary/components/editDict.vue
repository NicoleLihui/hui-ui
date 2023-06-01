<template>
  <el-dialog
    :title="title"
    v-model="visible"
    :append-to-body="true"
    width="640px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form class="amv-form" label-position="right" label-width="100px" :rules="rules" ref="amvForm" :model="formInfo">
      <el-form-item label="字典名称:" prop="dictName">
        <el-input v-model="formInfo.dictName" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="字典编号:" prop="dictCode">
        <el-input v-model="formInfo.dictCode" placeholder="请输入字典编号" />
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input
          type="textarea"
          :rows="3"
          maxlength="200"
          show-word-limit
          v-model="formInfo.description"
          placeholder="请输入描述"
        />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button class="btn-pop" @click="close()">取消</el-button>
      <el-button class="btn-pop" type="primary" :loading="uploadLoading" @click="addDict(amvForm)">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
// import { editDict } from '../../api/dict'
import { ElMessage } from 'element-plus'
import useDict from '../hooks/useDictionary'
defineOptions({
  name: 'EditDict',
  inheritAttrs: false,
})
const emit = defineEmits(['saveSuccessed'])
// 编辑请求API
const { editDict } = useDict()
const visible = ref(false)
// 提交加载状态
const uploadLoading = ref(false)
const amvForm = ref()

const formInfo = reactive<{
  dictName: string
  dictCode: string
  description: string
  id: string | number
}>({
  dictName: '',
  dictCode: '',
  description: '',
  id: '',
})
// 打开弹窗
const open = (
  item:
    | {
        dictName: string
        dictCode: string
        description: string
        id: string | number
      }
    | undefined
) => {
  if (item) {
    formInfo.description = item.description
    formInfo.dictCode = item.dictCode
    formInfo.dictName = item.dictName
    formInfo.id = item.id
  } else {
    formInfo.description = ''
    formInfo.dictCode = ''
    formInfo.dictName = ''
    formInfo.id = ''
  }
  visible.value = true
}
// 导出方法
defineExpose({
  open,
})
const props = defineProps<{
  title: string
  id?: string | number
}>()
// 校验规则
const rules = reactive({
  dictName: [{ required: true, message: '请输入字典名称', trigger: 'change' }],
  dictCode: [{ required: true, message: '请输入字典编号', trigger: 'change' }],
})
// 关闭弹窗并重置
const close = () => {
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
  console.log(props.id)
  const res = await editDict({
    ...formInfo,
    queryType: formInfo.id ? 1 : 0,
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
}
</style>
