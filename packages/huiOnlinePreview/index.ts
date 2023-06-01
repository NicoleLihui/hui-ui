import { Base64 } from 'js-base64'
import { isUrl, isIpPort } from '../utils/is'
import error from '../utils/error'

export const OnlinePreview = (
  options: {
    previewOrigin: string
    downloadUrl: string
    params?: {
      [key: string]: string | number | boolean
    }
  } = {
    previewOrigin: '',
    downloadUrl: '',
    params: {},
  }
): void => {
  const { previewOrigin, downloadUrl, params } = options
  if (!isUrl(previewOrigin) || !isIpPort(previewOrigin)) {
    error(`参数「previewOrigin」不是一个合法的url`, 'error')
    return
  }
  if (!isUrl(downloadUrl) || !isIpPort(previewOrigin)) {
    error(`参数「downloadUrl」不是一个合法的url`, 'error')
    return
  }
  let UrlObj: URL = new URL(downloadUrl)
  let url: string = UrlObj.href
  if (params && Object.keys(params).length > 0) {
    const queryList: any[] = []
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        queryList.push(`${key}=${params[key]}`)
      }
    }
    url = `${url}&${queryList.join('&')}`
  }
  window.open(`${previewOrigin}/onlinePreview?url=${encodeURIComponent(Base64.encode(url))}`, '_blank')
}

export default OnlinePreview
