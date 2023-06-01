<template>
  <div class="dictionary-item">
    <el-drawer :title="title" v-model="visible" destroyOnClose size="70%" append-to-body>
      <HuiProTable
        ref="proTable"
        :paramsData="dictItemCols"
        :request="requestTableData"
        proTableId="testTable68"
        title="字典项列表"
        :multiOptions="multiItemOptions"
        :settingTable="true"
        @multiCommand="onMultiCommand"
        @command="onCommand"
      />
    </el-drawer>
    <EditDictItem
      ref="editForm"
      :parentCode="formInfo.dictCode"
      :parentList="parentList"
      @saveSuccessed="saveSuccessed"
    />
  </div>
</template>

<script lang="ts" setup>
import HuiProTable from '@packages/huiProTable'
import EditDictItem from './editDictItem.vue'
import { dictItemCols, multiItemOptions } from '../utils/dict.js'
import useDict from '../hooks/useDictionary'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'DictItemList',
  inheritAttrs: false,
})

const { getItemList, deleteDictItem } = useDict()
const title = '字典配置'
const visible = ref(false)
const editForm = ref()
const proTable = ref()
let parentList = reactive<any[]>([])
const formInfo = reactive<{
  dictCode: string
}>({
  dictCode: '',
})

const open = item => {
  if (item?.dictCode) {
    formInfo.dictCode = item.dictCode
  }
  visible.value = true
  getParentList()
}
defineExpose({
  open,
})
const saveSuccessed = () => {
  getParentList()
  proTable.value.getTableData()
}
const onMultiCommand = e => {
  if (e === 'add') {
    editForm.value.open(parentList)
  }
}
const onCommand = (e, item) => {
  if (e === 'edit') {
    editForm.value.open(parentList, item)
  } else if (e === 'delete') {
    ElMessageBox.confirm(`确定要删除字典项“${item.label}”吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const res = await deleteDictItem([item.id])
        if (res?.success) {
          saveSuccessed()
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
const getParentList = async () => {
  const res = await requestTableData({
    pageNo: 1,
    pageSize: 500,
    dictCode: formInfo.dictCode,
  })
  if (res) {
    parentList = res.records
  }
}

function requestTableData(params: any): Promise<{ current: number; total: number; records: any[] } | false> {
  return new Promise(async resolve => {
    const response = await getItemList({
      ...params,
      pageNo: params.currentPage,
      pageSize: params.pageSize,
      dictCode: formInfo.dictCode,
    })
    if (response) {
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
<style>
.el-overlay.is-message-box {
  z-index: 8000 !important;
}
</style>
