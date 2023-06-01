<template>
  <HuiProTable
    ref="proTable"
    :paramsData="dictCols"
    :request="requestTableData"
    proTableId="testTable68"
    title="字典列表"
    :multiOptions="multiOptions"
    :settingTable="true"
    @multiCommand="onMultiCommand"
    @command="onCommand"
  />
  <EditDict
    ref="editDictRef"
    :key="'addDictKey'"
    title="新增字典"
    :dictData="addDictData"
    @saveSuccessed="saveSuccessed"
  />
  <DictItemList ref="dictItemListRef" />
  <ImportXlsx ref="importXlsxRef" @saveSuccessed="saveSuccessed" />
</template>

<script lang="ts" setup>
import HuiProTable from '../huiProTable'
import EditDict from './components/editDict.vue'
import DictItemList from './components/dictItemList.vue'
import ImportXlsx from './components/importXlsx.vue'
import { dictCols, multiOptions } from './utils/dict.js'
import useDict from './hooks/useDictionary'
import { download } from '@packages/utils/download'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Result } from '@packages/huiRequest/index'
defineOptions({
  name: 'HuiDictionary',
  inheritAttrs: false,
})

type ApiResult = (data: any) => Promise<Result>

const props = withDefaults(
  defineProps<{
    urlPrefix: string
    headers?: { [key: string]: any }
  }>(),
  {}
)

const { getDictList, deleteDict, exportDictXls, importDictXls } = useDict(props.urlPrefix, props.headers || {})

provide<string>('urlPrefix', props.urlPrefix)
provide<{ [key: string]: any }>('headers', props.headers || {})
provide<ApiResult>('importDictXlsApi', importDictXls)
const proTable = ref()
const editDictRef = ref()
const dictItemListRef = ref()
const importXlsxRef = ref()
let paramsData: any = reactive({})
const addDictData = {}
const saveSuccessed = e => {
  proTable.value.getTableData()
}
const onCommand = (e, item) => {
  if (e === 'edit') {
    editDictRef.value.open(item)
  } else if (e === 'config') {
    dictItemListRef.value.open(item)
  } else if (e === 'delete') {
    ElMessageBox.confirm(`确定要删除字典“${item.dictName}”吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const res = await deleteDict([item.id])
        if (res?.success) {
          proTable.value.getTableData()
          ElMessage({
            type: 'success',
            message: res.message,
          })
        } else {
          ElMessage({
            type: 'warning',
            message: res.message,
          })
        }
      })
      .catch(() => {
        console.log('取消')
      })
  }
}
const onMultiCommand = e => {
  if (e === 'add') {
    // 新增
    editDictRef.value.open()
  } else if (e === 'export') {
    // 导出
    const time = new Date().getTime()
    let filename = `字典管理${time}.xls`;
    const params = {
      dictName: paramsData?.dictName || '',
      dictCode: paramsData?.dictCode || '',
    }
    exportDictXls(params).then(res => {
      // 这里需要判断下返回的信息的类型bolb还是规定的类型
      download(res, filename)
    })
  } else if (e === 'import') {
    // 导入
    importXlsxRef.value.open()
  }
}
const requestTableData = params => {
  paramsData = {...params}
  return new Promise(async resolve => {
    const response = await getDictList(params)
    if (response.success) {
      const { data } = response
      const result = {
        current: data.current,
        total: data.total,
        records: data.records,
      }
      resolve(result)
    } else {
      resolve(false)
    }
  })
}
</script>
