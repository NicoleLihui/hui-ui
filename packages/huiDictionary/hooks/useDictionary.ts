import { Request } from '@packages/huiRequest'
import type { UploadFile } from 'element-plus'
export default function useDict(prefix?: string, apiHeaders?: AnyObj) {
  const urlPrefix = prefix || (inject('urlPrefix') as string) || ''
  const headers = apiHeaders || (inject('headers') as AnyObj) || {}
  const request = new Request({
    baseURL: urlPrefix, // 可以获取环境变量中配置的地址、proxy/nginx代理的前缀等
    headers: headers,
    requestOptions: { repeatRequestCancel: true, loading: true }, // 初始化时给一个初始值, 可以在任意的实例中再修改这个配置
    // tokenKey: 'key',
    // interceptorHooks: noAuth,
  })
  // 获取字典列表
  const getDictList = (params: {
    pageNo: string | number
    pageSize?: string | number
    dictCode?: string
    dictName?: string
    [key: string]: any
  }) => {
    return request.request({ method: 'GET', url: '/dict/dictList', params })
  }
  // 新建、编辑字典
  const editDict = (params: {
    dictName: string
    dictCode: string
    description?: string
    id?: string | number
    [key: string]: any
  }) => {
    return request.post('dict/editDict', params)
  }
  // 删除字典
  const deleteDict = (params: (string | number)[]) => {
    return request.post('dict/deleteDict', params)
  }
  // 导出字典
  const exportDictXls = (params?: { [key: string]: any }) => {
    return request.request({ method: 'GET', url: '/dict/exportXls', params, responseType: 'blob' })
  }
  // 导入字典
  const importDictXls = (data: UploadFile) => {
    return request.request({ method: 'post', url: '/dict/importExcel', data })
  }
  const getItemList = (params: {
    pageNo: string | number
    pageSize?: string | number
    dictCode?: string
    [key: string]: any
  }) => {
    return request.request({ method: 'GET', url: '/dict/itemList', params })
  }

  // 新建、编辑字典项
  const editItem = (params: { label: string; value: string; id?: string | number; [key: string]: any }) => {
    return request.post('dict/editItem', params)
  }
  // 删除字典项
  const deleteDictItem = (params: (string | number)[]) => {
    return request.post('dict/deleteItem', params)
  }

  return {
    getDictList,
    editDict,
    deleteDict,
    exportDictXls,
    getItemList,
    editItem,
    deleteDictItem,
    importDictXls
  }
}
