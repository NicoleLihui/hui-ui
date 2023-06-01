
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
      :rules="rules"
      ref="fileFormRef"
      :model="formInfo"
    >
      <el-form-item label="" prop="file">
        <el-upload
          ref="uploadRef"
          class="my-upload"
          drag
          action=""
          :multiple="false"
          :auto-upload="false"
          :on-change="handleBeforeUpload"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽文件到此处或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              <p :title="`单文件不超过${fileSize}MB，最多可上传${limit}个文件`">
                <span v-if="fileSize">单文件不超过{{ fileSize }}MB</span>
                <span v-if="limit">最多可上传{{ limit }}个文件</span>
              </p>
              <p v-if="suffix.length" :title="`支持扩展名：${suffix.join()}`">支持扩展名：{{ suffix.join() }}</p>
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button class="btn-pop" @click="close()">取消</el-button>
      <el-button class="btn-pop" type="primary" :loading="uploadLoading" @click="importXlsx(fileFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { UploadFile, UploadFiles } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import type { Awaitable } from 'element-plus/es/utils/typescript'
import type { Result } from '@packages/beRequest/index'

interface FileForm {
  file: UploadFile | null
}
type ApiResult = (data: any) => Promise<Result>
const title = '上传字典文件'
const suffix = ['xlsx', 'xls']
const fileSize = 200
const limit = 1
const rules = { file: [ { required: true, message: '请上传字典文件', trigger: 'change' } ] }

let visible = ref(false)
const fileFormRef = ref()
const uploadRef = ref()
// 提交加载状态
const uploadLoading = ref(false)
const formInfo: FileForm = reactive({file: null})
const urlPrefix = inject<string>('urlPrefix')
const importDictXlsApi = inject<ApiResult>('importDictXlsApi')
const emit = defineEmits(['saveSuccessed'])
const open = () => {
  visible.value = true
}
// 关闭弹窗并重置
const close = () => {
  visible.value = false
}
// 导入字典的方法
const importXlsx = (refForm) => {
  refForm.validate(async (valid, fields) => {
    if (valid) {
      // uploadRef.value.submit()
      if (importDictXlsApi) {
        const res = await importDictXlsApi(formInfo.file)
        if(res.success) {
          close()
          emit('saveSuccessed')
        }
      }
    } else {
      console.log('error submit', fields)
    }
  })
}
defineExpose({
  open,
})
// 上传之前
function handleBeforeUpload(uploadFile: UploadFile, uploadFiles: UploadFiles): Awaitable<void | undefined | null | boolean | File | Blob> {
  formInfo.file = uploadFile
  const uploadFilesList = toRaw(uploadFiles)
  if (uploadFilesList.length > limit) {
    ElMessage.warning(`最多上传${limit}个文件`)
    handleRemove(uploadFile)
    return false
  }
  if (uploadFile.size) {
    const fileSize = Number(uploadFile.size / 1024 / 1024)
    if (fileSize > fileSize) {
      ElMessage.warning(`文件大小不能超过${fileSize}MB，请重新上传！`)
      handleRemove(uploadFile)
      return false
    }
  }
  const suffixStr = uploadFile.name.substring(uploadFile.name.lastIndexOf('.') + 1)
  // 扩展名
  if (suffix.length && !suffix.includes(suffixStr)) {
    ElMessage.warning(`不能上传扩展名为${suffixStr}的文件！`)
    handleRemove(uploadFile)
    return false
  }
}
function handleRemove(file) {
  uploadRef.value!.handleRemove(file)
  formInfo.file = null
}
</script>

<style lang="scss" scoped>
.my-upload {
  width: 100%;
}
</style>
