import type { UploadFile } from 'element-plus'

export type Hash = string
export type ChunkFile = Blob
export interface FileChunk {
  fileName: string
  fileHash: Hash
  chunkIndex: number
  chunkHash: string
  chunkFile: ChunkFile
  chunkTotal: number
  percentage: number
  chunkSize: number
}
export interface Uploaded {
  isUploaded: boolean
  uploadedList: Hash[]
}
export interface UploadRefFile extends UploadFile {
  controller: AbortController
  downloadUrl?: string
  fileName: string
  [key: string]: any
}
