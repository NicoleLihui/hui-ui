<template>
  <ul class="file-list">
    <li v-for="file in fileList" :key="file[defaultProps['fileId']]">
      <span class="file-name" :title="file[defaultProps['fileName']]" @click="handleFileClick(file)">
        <el-icon class="blue" size="16"><Paperclip /></el-icon>
        <span>{{ file[defaultProps['fileName']] }}</span>
      </span>
      <span class="file-operate">
        <el-icon class="blue" title="下载" size="16" @click.stop="handleDownload(file)"><Download /></el-icon>
        <template v-if="!readOnly">
          <el-icon class="green icon-success" size="16"><CircleCheck /></el-icon>
          <el-icon class="gray-1 is-delete" size="16" title="删除" @click.stop="handleDelete(file)">
            <Close />
          </el-icon>
        </template>
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { Paperclip, Download, CircleCheck, Close } from '@element-plus/icons-vue'
import useDownloadFile from '@/hooks/useDownloadFile'
import error from '../utils/error'
defineOptions({
  name: 'HuiFiles',
  inheritAttrs: false,
})
const { downloadFile, createSave } = useDownloadFile()

// ------------------------------定义Props----------------------------
const props = withDefaults(
  defineProps<{
    downloadUrl?: string // 下载地址
    spliceParam?: boolean // 是否拼接value在url上
    readOnly?: boolean // 只读
    fileList: any[] // 文件列表
    headers?: object // 下载请求头
    defaultProps?: {
      // 默认fileID和fileName
      fileId: string | number
      fileName: string
    }
  }>(),
  {
    downloadUrl: '',
    readOnly: false,
    spliceParam: false,
    fileList: () => [],
    headers: () => {
      return {}
    },
    defaultProps: () => {
      return {
        fileId: 'fileId',
        fileName: 'fileName',
      }
    },
  }
)
// ------------------------------定义Emits----------------------------
const emits = defineEmits(['on-remove', 'on-download', 'on-preview'])

// ------------------------------定义Methods----------------------------
// 处理url是否拼接fileId
function handleDownloadUrl(file: any): string {
  return props.spliceParam
    ? props.downloadUrl.endsWith('/')
      ? `${props.downloadUrl}${file[props.defaultProps['fileId']]}`
      : `${props.downloadUrl}/${file[props.defaultProps['fileId']]}`
    : props.downloadUrl
}
// 下载
async function handleDownload(file: any): Promise<void> {
  if (props.downloadUrl) {
    try {
      const fileBlob = await downloadFile({
        url: handleDownloadUrl(file),
        params: props.spliceParam ? null : { fileId: file[props.defaultProps['fileId']] },
        headers: props.headers,
      })
      createSave(fileBlob, file[props.defaultProps['fileName']])
    } catch (err) {
      error(err as string, 'error')
      ElMessage.error(err as string)
    }
  } else {
    error('省略了downloadUrl,触发on-download回调', 'warn')
    emits('on-download', file)
  }
}
function handleFileClick(file: any): void {
  error('触发on-preview回调', 'warn')
  emits('on-preview', file)
}
// 删除
function handleDelete(file: any): void {
  error('触发on-remove回调', 'warn')
  emits('on-remove', file)
}
</script>

<style scoped lang="scss">
@import './styles/index.scss';
</style>
