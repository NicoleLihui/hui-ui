<template>
  <div class="hui-upload">
    <el-upload
      class="hui-upload-content"
      ref="uploadRef"
      :class="{
        'hui-upload__drag': drag,
        'hui-upload__disabled': uploadDisabled,
      }"
      :accept="accept"
      :drag="drag"
      :disabled="uploadDisabled"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="handleUploadChange"
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
    </el-upload>
    <ul class="hui-upload-list">
      <li v-for="file in uploadFileList">
        <span class="file-name" :title="file.fileName">
          <el-icon class="blue" size="16">
            <Paperclip />
          </el-icon>
          <span>{{ file.fileName }}</span>
          <el-progress
            v-if="file.status === 'uploading'"
            type="line"
            :stroke-width="2"
            :percentage="Number(file.percentage) + Number(uploadPercentage)"
          />
        </span>
        <span class="file-operate">
          <span v-if="file.status === 'ready'" class="is-ready">正在计算中...</span>
          <el-icon v-if="file.status === 'uploading'" class="is-loading" color="#1775ff" :size="16">
            <Loading />
          </el-icon>
          <template v-if="file.status === 'success'">
            <el-icon @click="handleFileDownload(file)" class="blue is-download" size="16">
              <Download />
            </el-icon>
            <el-icon class="green is-success" size="16">
              <CircleCheck />
            </el-icon>
          </template>
          <el-popconfirm
            :teleported="false"
            width="200px"
            title="是否删除此文件?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDelete(file)"
          >
            <template #reference>
              <el-icon class="gray-1 is-remove" size="16" title="删除">
                <Close />
              </el-icon>
            </template>
          </el-popconfirm>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Paperclip, CircleCheck, Loading, Close, Upload, Download } from '@element-plus/icons-vue'
import type { UploadFile, UploadFiles, UploadRawFile, ElUpload } from 'element-plus'
import { FileChunk, Hash, ChunkFile, UploadRefFile } from './types/type'
import axios, { AxiosProgressEvent, AxiosResponse } from 'axios'
import { isNumber } from '@vueuse/core'
import error from '../utils/error'
defineOptions({
  name: 'HuiUploadSlice',
  inheritAttrs: false,
})

// ------------------------------定义Props----------------------------
const props = withDefaults(
  defineProps<{
    projectId?: string
    systemId?: string
    fileListApi: string
    fileCheckApi: string
    fileChunkApi: string
    fileDeleteApi: string
    // fileDownloadApi: string
    label?: string
    headers?: Headers | Record<string, string | number | null | undefined>
    accept?: string
    limit?: number
    withCredentials?: boolean
    suffix?: string[]
    fileSize?: number
    drag?: boolean
    showTips?: boolean
    disabled?: boolean
    chunkSize?: number
  }>(),
  {
    projectId: '',
    systemId: '',
    fileListApi: '',
    fileCheckApi: '',
    fileChunkApi: '',
    fileDeleteApi: '',
    // fileDownloadApi: '',
    label: '上传附件',
    drag: false,
    headers: () => {
      return {}
    },
    showFileList: true,
    accept: '',
    limit: undefined,
    suffix: () => [],
    chunkSize: 5,
    withCredentials: false,
    fileSize: undefined,
    showTips: false,
    disabled: false,
  }
)

// 新上传列表
const uploadFileList = ref<UploadRefFile[]>([])
// 当前文件Index
const fileIndex = ref<number>(0)
// uploadRef
const uploadRef = ref<InstanceType<typeof ElUpload>>()
// 当前文件需要上传的切片列表
const fileChunkList = ref<FileChunk[]>([])
// 初始化切片大小1MB
const initChunkSize: number = 1 * 1024 * 1024

const uploadDisabled = computed<boolean>(() => {
  return (isNumber(props.limit) && uploadFileList.value.length >= props.limit) || props.disabled
})

// 上传进度
const uploadPercentage = computed(() => {
  if (!fileChunkList.value.length) return 0
  const loaded = fileChunkList.value.map(item => item.chunkSize * item.percentage).reduce((acc, cur) => acc + cur)
  return Math.floor((loaded / uploadFileList.value[fileIndex.value].size!) * 100)
})

onMounted(() => {
  getUploadFileList()
})

// ------------------------------定义Methods----------------------------
// 获取已上传文件列表
async function getUploadFileList(): Promise<void> {
  const params = {
    projectId: props.projectId,
    systemId: props.systemId,
  }
  try {
    const { data } = await axios.get(props.fileListApi, { params })
    uploadFileList.value = data.data
  } catch (error) {
    ElMessage.error('文件列表获取失败')
  }
}
// 上传文件change
async function handleUploadChange(uploadFile: UploadFile, uploadFiles: UploadFiles): Promise<any> {
  const file: UploadRawFile | undefined = uploadFile.raw
  if (!file) {
    return
  }
  // 取消，中断请求定义
  const Controller = new AbortController()
  // 限制
  await handleFileLimit(file!)
  uploadFileList.value.unshift({
    ...uploadFile,
    controller: Controller,
    fileName: file.name,
  })
  fileIndex.value = 0
  // 切片
  const chunkList: Blob[] = handleFileChunk(file)
  // 计算hash
  const fileHash: string = await handleFileHash(chunkList, file.name)
  // 如果在计算hash过程中删除了文件，就不继续了
  if (uploadFileList.value[fileIndex.value].uid !== file.uid) {
    return
  }
  // 校验文件或者切片存在
  const uploadedInfo: { status: string; uploadedList: any[] } | any = await checkFileUploaded(file, fileHash)
  if (uploadedInfo) {
    const { status, uploadedList } = uploadedInfo
    if (status === 'success') {
      uploadFileList.value[fileIndex.value].status = status
      ElMessage.success('文件已上传成功')
      return
    }
    // 文件名称提取
    const nameSubstring: string = file.name.substring(0, file.name.lastIndexOf('.'))
    // 补全fileChunkList所有字段, 过滤已有切片
    fileChunkList.value = chunkList
      .map((chunkFile: Blob, index: number) => {
        return {
          chunkFile,
          fileName: file.name,
          fileHash: fileHash,
          chunkIndex: index,
          chunkHash: `${nameSubstring}_${fileHash}_${index}`,
          chunkTotal: chunkList.length,
          percentage: 0,
          chunkSize: chunkFile.size,
        }
      })
      .filter((chunkItem: FileChunk) => !uploadedList.includes(chunkItem.chunkHash))
    // 如果在校验文件过程中删除了文件，就不上传切片了
    if (uploadFileList.value[fileIndex.value].uid === file.uid) {
      uploadFileList.value[fileIndex.value].status = 'uploading'
      uploadFileList.value[fileIndex.value].percentage = Math.floor((uploadedList.length / chunkList.length) * 100)
      // 上传切片
      await handleUploadChunk()
    }
  }
}
// 文件限制
function handleFileLimit(file: UploadRawFile): Promise<void> {
  return new Promise((resolve, reject): void => {
    if (uploadFileList.value.some(s => ['uploading', 'ready'].includes(s.status))) {
      ElMessage.warning(`目前已有文件在上传，请稍后上传`)
      reject()
    }
    const fileSize = Number(file.size / 1024 / 1024)
    const suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
    if (isNumber(props.limit) && uploadFileList.value.length >= props.limit) {
      ElMessage.warning(`最多上传${props.limit}个文件`)
      reject()
    }
    // 文件大小
    if (isNumber(props.fileSize) && fileSize > props.fileSize) {
      ElMessage.warning(`文件大小不能超过${props.fileSize}MB，请重新上传！`)
      reject()
    }
    // 扩展名
    if (props.suffix.length && !props.suffix.includes(suffix)) {
      ElMessage.warning(`不能上传扩展名为${suffix}的文件！`)
      reject()
    }
    resolve()
  })
}
// 生成切片
function handleFileChunk(file: UploadRawFile): ChunkFile[] {
  const chunkList: ChunkFile[] = []
  let currentChunk: number = 0
  const currentChunkSize: number = initChunkSize * props.chunkSize
  while (currentChunk < file.size) {
    chunkList.push(file.slice(currentChunk, currentChunk + currentChunkSize))
    currentChunk += currentChunkSize
  }
  return chunkList
}
// 生成hash
function handleFileHash(chunkList: ChunkFile[], fileName: string): Promise<Hash> {
  return new Promise(resolve => {
    // 创建一个worker对象
    const worker = new Worker(new URL('./uploadWorker.js', import.meta.url))
    // 向子线程发送消息
    worker.postMessage({ chunkList, fileName })
    // 接收worker消息
    worker.onmessage = (event: MessageEvent<any>): void => {
      const { hash } = event.data
      resolve(hash)
      //终止worker线程
      // worker.terminate()
    }
  })
}
// 校验服务器是否有此hash的文件
function checkFileUploaded(
  file: UploadRawFile,
  fileHash: Hash
): Promise<{ status: string; uploadedList: any[] } | void> {
  return axios
    .get(props.fileCheckApi, {
      params: {
        fileName: file.name,
        fileHash,
      },
    })
    .then(res => {
      return res.data.data
    })
    .catch((): void => {
      ElMessage.error('文件校验失败，请稍后重试')
      uploadFileList.value = uploadFileList.value.filter((item: UploadRefFile) => item.uid !== file.uid)
    })
}
// 上传切片
async function handleUploadChunk(): Promise<void> {
  let request_index: number = 0
  const success_results: any[] = []
  const error_results: any[] = []
  requestLimit(3)
  // 请求限制，这里用Promise.allSettled而不是Promise.all 完全是为了限制数量的接口（包括有切片上传报错）完事后能继续上传其余切片
  async function requestLimit(limit: number = 3): Promise<void> {
    const results: PromiseSettledResult<any>[] = await Promise.allSettled(
      fileChunkList.value
        .slice(
          request_index,
          request_index + limit >= fileChunkList.value.length ? fileChunkList.value.length : request_index + limit
        )
        .map(request)
    )
    results.forEach((result: PromiseSettledResult<any>) => {
      if (result.status === 'fulfilled') {
        success_results.push(result.value)
      }
      if (result.status === 'rejected') {
        error_results.push(result.reason)
      }
    })
    if (request_index >= fileChunkList.value.length) {
      success_results.length === request_index ? handleUploadSuccess(success_results) : handleUploadError(error_results)
    } else {
      request_index =
        request_index + limit >= fileChunkList.value.length ? fileChunkList.value.length : request_index + limit
      requestLimit(limit)
    }
  }
  // 请求
  function request(chunk: FileChunk): Promise<AxiosResponse<any, any>> {
    return axios.post(props.fileChunkApi, chunk, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: uploadFileList.value[fileIndex.value].controller.signal,
      onUploadProgress: handleChunkProgress(chunk),
    })
  }
}
// 计算切片进度
function handleChunkProgress(chunk: FileChunk): (e: AxiosProgressEvent) => void {
  return (e: AxiosProgressEvent): void => {
    chunk.percentage = Math.floor(e.loaded / e.total!)
  }
}
// 上传成功
function handleUploadSuccess(results: PromiseFulfilledResult<any>[]): void {
  ElMessage.success('文件上传成功')
  getUploadFileList()
}
// 上传失败
function handleUploadError(reasons: PromiseRejectedResult[]): void {
  uploadFileList.value[fileIndex.value].status = 'fail'
  uploadFileList.value.filter((f: UploadRefFile) => f.uid !== uploadFileList.value[fileIndex.value].uid)
  if (reasons.every((reason: any) => reason.code === 'ERR_CANCELED')) {
    error('中断请求')
  } else {
    ElMessage.error('有文件切片上传失败，请尝试重新上传')
  }
}
// 删除文件
async function handleDelete(file: UploadRefFile): Promise<void> {
  // 正在计算中的，删除直接过滤当前uid
  if (file.status === 'ready') {
    uploadFileList.value = uploadFileList.value.filter((item: UploadRefFile) => item.uid !== file.uid)
    return
  }
  // 正在上传中，取消请求
  if (file.status === 'uploading') {
    file.controller && file.controller.abort()
  }
  try {
    await axios.post(props.fileDeleteApi, { fileName: file.fileName, fileHash: file.fileHash })
    uploadFileList.value = uploadFileList.value.filter((item: UploadRefFile) => item.fileHash !== file.fileHash)
    ElMessage.success('文件删除成功')
  } catch (error) {
    console.log(error)
  }
}
// 下载
async function handleFileDownload(file: UploadRefFile): Promise<void> {
  if (file.downloadUrl) {
    window.open(file.downloadUrl, '_blank')
    // try {
    //   const fileBlob = await axios.get(props.fileDownloadApi, {
    //     params: {
    //       fileName: file.fileName,
    //       fileHash: file.fileHash,
    //     },
    //   })
    //   console.log(fileBlob)
    //   createSave(fileBlob, file.fileName)
    // } catch (err: any) {
    //   console.log(err)
    //   ElMessage.error(err.message)
    // }
  } else {
    ElMessage.warning('当前文件没有下载地址')
  }
}
// 获取已上传文件
// const getFiles = (): UploadFiles => toRaw(uploadFileList.value.filter((f: UploadRefFile) => f.status === 'success'))

// defineExpose({
//   getFiles,
// })
</script>

<style scoped lang="scss">
@import './styles/index.scss';
</style>
