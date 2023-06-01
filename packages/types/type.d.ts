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
