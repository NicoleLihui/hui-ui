import { ElLoading } from 'element-plus'
let loadingInstance: { close: () => void }
export function startLoading() {
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.1)',
  })
  setTimeout(function () {
    // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    loadingInstance.close() // 关闭遮罩层
  }, 60 * 1000)
}

export function closeLoading() {
  loadingInstance.close()
}
