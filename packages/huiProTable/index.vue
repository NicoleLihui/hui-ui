<template>
  <div height="100%">
    <div class="search-wrapper">
      <div :class="['search-form', showAll ? 'expand' : 'collapse']">
        <SearchForm ref="searchForm" v-if="searchTable" :paramsData="paramsData">
          <template #otherForm>
            <slot name="form" class="slot-form"></slot>
          </template>
        </SearchForm>
      </div>

      <el-button-group class="search-btns" v-if="searchTable">
        <el-button @click="getTableData" type="primary">查 询</el-button>
        <el-button @click="resetForm">重 置</el-button>
        <el-link type="primary" :underline="false" class="more-btn" @click="handleChange" v-if="searchMore">
          更 多 <span :class="['icon', showAll ? 'show-collapse' : '']"> </span>
        </el-link>
      </el-button-group>
    </div>
    <ProTableTitle
      :title="title"
      :multiOptions="multiOptions"
      :selectedRows="selectedRows"
      @multiCommand="handleMutilBtn"
    ></ProTableTitle>
    <HuiTable
      :tableData="tableData"
      :columns="paramsData"
      :options="tableOptions"
      :selectable="selectable"
      @selection-change="onSelectRows"
      @command="onCommand"
      @select-cols-change="onSelectColsChange"
    ></HuiTable>
    <HuiPager
      :list="tableData"
      :total="pagerProps.total"
      :currentPage="pagerProps.currentPage"
      :pageSize="pagerProps.pageSize"
      @update:currentPage="currentPageUpdate"
      @update:pageSize="pageSizeUpdate"
      @callback="getTableData"
    ></HuiPager>
  </div>
</template>

<script lang="ts" setup>
import SearchForm from './components/SearchForm.vue'
import ProTableTitle from './components/ProTableTitle.vue'
import HuiTable from '@packages/huiTable/index.vue'
import HuiPager from '@packages/huiPager/index.vue'
import { ProTable } from './types/type'
import { ComputedRef } from 'vue'
defineOptions({
  name: 'HuiProTable',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    request: ProTable.Request
    paramsData: ProTable.ParamsData[]
    title?: ProTable.Title
    multiOptions?: ProTable.ButtonItem[]
    proTableId: ProTable.ProTableId
    selectable?: (row: any, index: number) => boolean
    settingTable?: boolean
    reserveSelection?: boolean
    searchTable?: boolean
    personProps?: ProTable.PersonProps
    organizeProps?: ProTable.OrganizeProps
  }>(),
  {
    settingTable: true,
    reserveSelection: false,
    searchTable: true,
    request: (): Promise<any> => {
      return new Promise((): any => {})
    },
  }
)

provide('organizeProps', props.organizeProps)
provide('personProps', props.personProps)
const selectedRows = ref<ProTable.FlexObj[]>([])
const pagerProps = reactive<ProTable.PagerProps>({ currentPage: 1, pageSize: 20 })
const tableOptions: ComputedRef<ProTable.Options> = computed(() => {
  return {
    tableId: props.proTableId,
    paginationConfig: { ...pagerProps },
    highlightCurrentRow: false,
    settingTable: typeof props?.settingTable === 'undefined' ? true : props.settingTable,
    reserveSelection: props?.reserveSelection,
  }
})
const searchForm = ref()
let showAll = ref(false)
let searchMore = computed(() => {
  return searchForm.value?.searchMore
})
const tableData = ref<ProTable.FlexObj[]>([])
interface EmitEvent {
  (e: 'multiCommand', command: string, rows?: any[]): void
  (e: 'command', command: string, row?: any): void
  (e: 'searchFormReset'): void
  (e: 'select-cols-change', keys: string[]): void
} // 表格批量操作按钮点击事件
const emits = defineEmits<EmitEvent>()
function onSelectRows(val: ProTable.FlexObj[]) {
  selectedRows.value = val
}

function onCommand(command: string, row: any): void {
  emits('command', command, row)
}

function onSelectColsChange(selectedKeys: string[]) {
  emits('select-cols-change', selectedKeys)
}

function currentPageUpdate(val: number) {
  pagerProps.currentPage = val
}
function pageSizeUpdate(val: number) {
  pagerProps.pageSize = val
}
function getTableData() {
  const searchValue = searchForm.value.getFormValues()
  const params = Object.assign(searchValue || {}, pagerProps)
  props.request(params).then(res => {
    if (res) {
      // 请求成功
      const data = res
      tableData.value = data.records
      pagerProps.total = data.total
      pagerProps.currentPage = data.current
    }
  })
}
function handleMutilBtn(command: string) {
  emits('multiCommand', command, selectedRows.value)
}
function resetForm() {
  // 当重置表单的时候需要给父组件发送事件, 父组件插槽中的表单也要重置
  searchForm.value.resetFields()
  emits('searchFormReset')
}
function handleChange() {
  showAll.value = !showAll.value
}
onMounted(() => {
  getTableData()
})
// 暴露方法，用户调用来刷新表格数据、重置查询项
defineExpose({ getTableData, resetForm })
</script>

<style lang="scss" scoped>
.search-wrapper {
  display: flex;
  width: 100%;

  .search-form {
    flex: 1;
    &.collapse {
      height: 50px;
      overflow: hidden;
    }
    &.expand {
      height: auto;
    }
  }
  .search-btns {
    margin-left: 20px;
    display: flex;
    align-items: flex-start;
    float: right;

    .el-button {
      width: 70px;
      margin-left: 10px;
    }
    .more-btn {
      height: 32px;
      margin-left: 10px;
      .icon {
        margin-left: 5px;
        width: 12px;
        height: 12px;
        background-image: url('../../src/assets/images/arrow.png');
        background-repeat: no-repeat;
        background-size: 100%;
        vertical-align: middle;
        transition: transform 0.2s linear;
      }
      .show-collapse {
        transform: rotate(180deg);
        transition: transform 0.2s linear;
      }
    }
  }
}
.slot-form {
  width: calc(100% - 90px);
}
</style>
