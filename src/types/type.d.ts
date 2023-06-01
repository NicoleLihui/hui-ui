declare module 'spark-md5'
// OrganizeTypeItem
interface OrganizeTypeItem {
  value: string
  label: string
}

// TreeNodeData
interface TreeNodeData {
  [key: string]: any
}

interface Tree {
  name: string
  leaf?: boolean
}

declare type TreeKey = string | number

interface preivewFile {
  fileName: string
  previewUrl: string
  [key: string]: any
}

// 手动引入全局类型，解决打包时的warning
const ElMessage: typeof import('element-plus/es')['ElMessage']
const ElMessageBox: typeof import('element-plus/es')['ElMessageBox']
