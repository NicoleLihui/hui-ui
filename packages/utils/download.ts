export function download(data, fileName: string) {
  const blob = new Blob([data], {type:"application/vnd.ms-excel;charset=utf-8"})
  var a = document.createElement('a')
  a.style.display = 'none'
  var url = window.URL.createObjectURL(blob)
  a.href = url
  a.setAttribute('download', fileName)
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
}
