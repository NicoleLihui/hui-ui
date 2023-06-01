import axios from 'axios'

export default function useDownloadFile() {
  // const progressSize = ref<string>('0B');
  async function downloadFile(options: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!options.url) return console.error('Missing download path')
        const fileResult = await axios.get(`${options.url}`, {
          params: options.params || {},
          responseType: 'blob',
          headers: {
            ...options.headers,
          },
          // onDownloadProgress: (e) => {
          //   progressSize.value = formatFileSize(e.loaded)
          // }
        })
        resolve(await checkBlob(fileResult.data))
      } catch (error) {
        reject(error)
      }
    })
  }
  // 创建保存
  function createSave(blob: any, fileName: string, extension?: string): void {
    const nav = window.navigator as any
    if (nav.msSaveOrOpenBlob) {
      nav.msSaveBlob(blob, fileName)
    } else {
      let blobURL = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = blobURL
      link.setAttribute('download', fileName)
      // fix Firefox Safari thinks _blank anchor are pop ups. We only want to set _blank
      // target if the browser does not support the HTML5 download attribute.
      // This allows you to download files in oprs safari if pop up blocking is enabled.
      if (typeof link.download === 'undefined') {
        link.setAttribute('target', '_blank')
      }
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobURL)
    }
  }
  // 检测Blob是否异常
  function checkBlob(blob: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader() // FileReader可以读取Blob内容
      fr.readAsText(blob) // 二进制转换成text
      fr.onload = () => {
        // 转换完成后，调用onload方法
        try {
          const result = JSON.parse(fr.result as string) // result 转换的结果
          // 返回json就是异常
          if (result.success === false) {
            reject(result.message || result.msg || '文件流有误，请检查文件格式')
          } else {
            resolve(blob)
          }
        } catch (err) {
          resolve(blob)
        }
      }
    })
  }
  // 格式化文件大小
  function formatFileSize(num: number): string {
    if (num < 1024) {
      return `${num}B`
    } else if (num < 1024 * 1024) {
      return `${(num / 1024).toFixed(2)}KB`
    } else if (num < 1024 * 1024 * 1024) {
      return `${(num / (1024 * 1024)).toFixed(2)}MB`
    } else {
      return `${(num / (1024 * 1024 * 1024)).toFixed(2)}GB`
    }
  }

  return {
    downloadFile,
    createSave,
    checkBlob,
    formatFileSize,
  }
}
