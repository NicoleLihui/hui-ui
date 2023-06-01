importScripts('/node_modules/spark-md5/spark-md5.min.js')

onmessage = event => {
  const { chunkList, fileName } = event.data
  const spark = new SparkMD5.ArrayBuffer()
  let currentChunk = 0
  function loadNext() {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(chunkList[currentChunk])
    fileReader.onload = function (e) {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunkList.length) {
        loadNext()
      } else {
        postMessage({
          hash: spark.end(),
        })
        // 关闭worker
        close()
      }
    }
    fileReader.onerror = function () {
      console.warn(`文件"${chunkList[currentChunk]}-${fileName}"读取出错，请检查该文件`)
    }
  }
  loadNext()
}
