<template>
  <div class="hui-upload">
    <el-upload
      class="hui-upload-content"
      ref="uploadRef"
      :class="{
        'hui-upload__drag': drag,
        'hui-upload__disabled': uploadDisabled,
      }"
      :action="action"
      :headers="headers"
      :data="data"
      :accept="accept"
      :name="name"
      :drag="drag"
      :multiple="multiple"
      :with-credentials="withCredentials"
      :disabled="uploadDisabled"
      :show-file-list="showFileList"
      :file-list="defaultFileList"
      :limit="limit"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccessUpload"
      :on-error="handleErrorUpload"
      :on-exceed="handleExceedUpload"
    >
      <template #default>
        <slot>
          <p v-if="drag">
            拖拽文件到此处或<el-button type="primary" :disabled="uploadDisabled" link>点击{{ label }}</el-button>
          </p>
          <el-button v-else :icon="Upload" :disabled="uploadDisabled">{{ label }}</el-button>
        </slot>
      </template>
      <template #tip>
        <div v-if="showTips" class="el-upload__tip">
          <p :title="`单文件不超过${fileSize}MB，最多可上传${limit}个文件`">
            <span v-if="fileSize">单文件不超过{{ fileSize }}MB</span>
            <span v-if="limit">最多可上传{{ limit }}个文件</span>
          </p>
          <p v-if="suffix.length" :title="`支持扩展名：${suffix.join()}`">支持扩展名：{{ suffix.join() }}</p>
        </div>
      </template>
      <template #file="{ file }">
        <span class="file-name" :title="file.name">
          <el-icon class="blue" size="16"><Paperclip /></el-icon>
          <span>{{ file.name }}</span>
          <el-progress
            v-if="file.status === 'uploading'"
            type="line"
            :stroke-width="2"
            :percentage="Number(file.percentage)"
          />
        </span>
        <span class="file-operate">
          <el-icon v-if="file.status === 'success'" class="green icon-success" size="16"><CircleCheck /></el-icon>
          <el-popconfirm
            :teleported="false"
            width="200px"
            title="是否删除此文件?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDelete(file)"
          >
            <template #reference>
              <el-icon class="gray-1 delete" size="16" title="删除">
                <Close />
              </el-icon>
            </template>
          </el-popconfirm>
        </span>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { Paperclip, CircleCheck, Close, Upload } from '@element-plus/icons-vue'
import error from '../utils/error'
import type { UploadFile, UploadFiles, UploadRawFile, ElUpload } from 'element-plus'
import type { Awaitable } from 'element-plus/es/utils/typescript'
defineOptions({
  name: 'HuiUpload',
  inheritAttrs: false,
})
// ------------------------------定义Props----------------------------
const props = withDefaults(
  defineProps<{
    action: string
    label?: string
    name?: string
    headers?: Headers | Record<string, string | number | null | undefined>
    data?: Record<string, string | Blob | [string | Blob, string]>
    accept?: string
    showFileList?: boolean
    fileList?: UploadFiles
    limit?: number
    withCredentials?: boolean
    fileSize?: number
    suffix?: string[]
    drag?: boolean
    showTips?: boolean
    multiple?: boolean
    disabled?: boolean
  }>(),
  {
    action: '',
    label: '上传附件',
    name: 'file',
    drag: false,
    headers: () => {
      return {}
    },
    data: () => {
      return {}
    },
    showFileList: true,
    fileList: () => [],
    suffix: () => [],
    accept: '',
    limit: 10,
    withCredentials: false,
    fileSize: 200,
    showTips: false,
    multiple: false,
    disabled: false,
  }
)
// ------------------------------定义Emits----------------------------
const emits = defineEmits(['on-success', 'on-error', 'on-progress', 'on-remove'])

const defaultFileList = ref<UploadFiles>(props.fileList)
const uploadFileList = ref<UploadFiles>([])
const uploadRef = ref<InstanceType<typeof ElUpload>>()
const uploadDisabled = computed<boolean>(() => {
  return defaultFileList.value.length + uploadFileList.value.length >= props.limit || props.disabled
})

// ------------------------------定义Methods----------------------------
// 上传成功
function handleSuccessUpload(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles): void {
  if (response.success) {
    uploadFileList.value.push(uploadFile)
  } else {
    uploadRef.value!.handleRemove(uploadFile)
    error(response.message || response.msg || '上传失败', 'error')
  }
  error('触发on-success', 'warn')

  emits('on-success', {
    uploadFile,
    response,
  })
}
// 上传失败
function handleErrorUpload(err: Error, uploadFile: UploadFile, uploadFiles: UploadFiles): void {
  error('触发on-error', 'warn')
  error(err.message, 'error')
  emits('on-error', {
    error: err,
    uploadFile,
  })
}
// 上传之前
function handleBeforeUpload(rawFile: UploadRawFile): Awaitable<void | undefined | null | boolean | File | Blob> {
  if (uploadFileList.value.length >= props.limit) {
    ElMessage.warning(`最多上传${props.limit}个文件`)
    return false
  }
  const fileSize = Number(rawFile.size / 1024 / 1024)
  if (fileSize > props.fileSize) {
    ElMessage.warning(`文件大小不能超过${props.fileSize}MB，请重新上传！`)
    return false
  }
  const suffixStr = rawFile.name.substring(rawFile.name.lastIndexOf('.') + 1)
  // 扩展名
  if (props.suffix.length && !props.suffix.includes(suffixStr)) {
    ElMessage.warning(`不能上传扩展名为${suffixStr}的文件！`)
    return false
  }
}
// 超出限制
function handleExceedUpload() {
  ElMessage.warning(`最多上传${props.limit}个文件`)
}
// 删除回调
function handleDelete(file: UploadFile): void {
  error('触发on-remove', 'warn')
  emits('on-remove', file)
}
// 删除文件
function handleRemoveFile(file: UploadFile) {
  uploadRef.value!.handleRemove(file)
  uploadFileList.value = uploadFileList.value.filter((item: UploadFile) => item.uid !== file.uid)
}
// 暴露方法
defineExpose({
  handleRemoveFile,
})
</script>

<style scoped lang="scss">
@import './styles/index.scss';
</style>
