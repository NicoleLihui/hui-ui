<template>
  <el-table
    class="table-box"
    ref="tableRef"
    resizable
    style="width: 100%"
    show-overflow-tooltip
    :height="_options.height"
    :stripe="_options.stripe"
    :max-height="_options.maxHeight"
    :size="_options.size"
    :border="_options.border"
    :show-header="_options.showHeader"
    :tooltip-effect="_options.tooltipEffect"
    :row-style="_options.rowStyle"
    :row-class-name="_options.rowClassName"
    :cell-style="_options.cellStyle"
    :header-cell-style="_options.headerCellStyle"
    :default-sort="_options.defaultSort"
    :row-key="_options.rowKey"
    :highlight-current-row="_options.highlightCurrentRow"
    :data="tableData"
    @current-change="handleCurrentChange"
    @cell-click="handleCellClick"
    @row-dblclick="handleDbClick"
    @row-click="handleRowClick"
    @select="selectRow"
    @select-all="selectAll"
    @selection-change="handleSelectionChange"
    header-row-class-name="header-class"
  >
    <el-table-column
      v-if="showSelection"
      fixed="left"
      v-bind="selectionItem"
      :reserve-selection="_options.reserveSelection"
      :selectable="selectable || checkSelectable"
    >
    </el-table-column>
    <el-table-column v-if="_options.settingTable && _options.tableId" align="center" :width="indexWidth" fixed="left">
      <template #header>
        <el-button style="color: #888" text class="table-dialog-btn" @click="handleDialog">
          <HuiIcon iconName="icon-biaotoushezhi"></HuiIcon>
        </el-button>
      </template>
      <template #default="{ row, $index }">
        <span>
          {{ indexMethod($index) }}
        </span>
      </template>
    </el-table-column>
    <template v-for="(col, index) in selectedCols" :key="index">
      <el-table-column v-if="col.type === 'expand'" v-bind="col" fixed="left">
        <template #header>
          <span>{{ col.label }}</span>
        </template>
        <!-- 当type等于expand时， 配置通过h函数渲染、txs语法或者插槽自定义内容 -->
        <template #default="{ row, $index }">
          <!-- render函数 (START) : 使用内置的component组件可以支持h函数渲染和txs语法 -->
          <component v-if="col.render" :is="col.render" :row="row" :index="$index" />
          <!-- render函数 (END) -->
        </template>
      </el-table-column>
      <!---复选框, 序号 (START)-->
      <el-table-column
        v-else-if="col.type === 'index'"
        :index="indexMethod"
        fixed="left"
        :width="indexWidth"
        v-bind="col"
      >
        <template #header>
          <span>{{ col.label }}</span>
        </template>
      </el-table-column>
      <el-table-column v-else-if="col.type === 'actions'" align="center" fixed="right" v-bind="col">
        <template #header>
          <span>{{ col.label }}</span>
        </template>
        <template #default="{ row, $index }">
          <template v-for="(btn, index) in col.buttons" :key="index">
            <el-button
              v-if="!btn.children"
              link
              :type="btn.type"
              class="line"
              :disabled="btn.disabled"
              @click="handleAction(btn.command, { row, $index })"
              >{{ btn.name }}</el-button
            >
            <el-dropdown v-if="btn.children && btn.children.length > 0" @command="changeHandle" :key="$index">
              <span class="el-dropdown-link">
                {{ btn.name }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(child, childIndex) in btn.children"
                    :key="childIndex"
                    :command="beforeHandleCommand(child.command, row)"
                    :disabled="child.disabled"
                    >{{ child.name }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-else v-bind="col" :show-overflow-tooltip="true">
        <template #header>
          <span>{{ col.label }}</span>

          <ElTooltip
            :content="col.fixed ? '点击解锁列' : '点击锁定列'"
            :open-delay="500"
            effect="dark"
            :disabled="!isLock"
            v-if="isLock"
          >
            <HuiIcon
              v-if="isLock"
              class="lock"
              :iconName="col.fixed ? 'icon-jiesuo' : 'icon-locking'"
              @click="lockColumnLeft(col)"
            ></HuiIcon>
          </ElTooltip>
        </template>
        <template #default="scope">
          <div v-if="col.format" class="safari-oneline">
            <span v-html="col.format(scope.row, scope.column, scope)"></span>
          </div>
          <div v-else-if="col.prop" class="safari-oneline">
            <span>
              {{ scope.row[col.prop] }}
            </span>
          </div>
        </template>
      </el-table-column>
    </template>
    <!-- 表格其他插槽 -->
    <!-- <slot name="ctrl"></slot> -->
  </el-table>
  <!-- 表头设置弹窗 -->
  <ElDialog
    class="hui-table-pop-win"
    title="表格字段设置"
    :before-close="cancel"
    v-model="dialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <div class="display-tabs-wrapper">
      <div class="display-items">
        <div class="title">显示字段(可拖动排序)</div>
        <div class="display-items-dropable">
          <template v-for="(item, index) in selectedCols" :key="item.prop">
            <span @click="hiddenItem(index)" class="tab-item tab-list">
              <HuiIcon class="icon-display" iconName="icon-quxiaoxianshi"></HuiIcon>
              <span>{{ item.label }}</span>
            </span>
          </template>
        </div>
      </div>
      <div class="hidden-item">
        <div class="title">
          隐藏字段
          <span v-if="notSelectedCols.length" class="fr" @click.prevent="allDisplay">
            <HuiIcon iconName="icon-eye"></HuiIcon>
            显示全部字段
          </span>
        </div>
        <div class="hidden-items-list">
          <template v-for="(item, index) in notSelectedCols" :key="index + Math.random()">
            <span @click="displayItem(index)" class="tab-item">
              <HuiIcon class="icon-display" iconName="icon-tianjia"></HuiIcon>
              <span>{{ item.label }}</span>
            </span>
          </template>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer clearfix">
        <el-button class="btn-pop" @click="cancel">取 消</el-button>
        <el-button class="btn-pop" type="primary" @click="save">确 定</el-button>
      </div>
    </template>
  </ElDialog>
</template>

<script lang="ts" setup>
import { ComputedRef } from 'vue'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { Table } from './types/type'
import HuiIcon from '../components/HuiIcon.vue'
import Sortable from 'sortablejs'
import { ArrowDown } from '@element-plus/icons-vue'
import beuiError from '../utils/error'
import _ from 'lodash'
defineOptions({
  name: 'HuiTable',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    tableData: Array<AnyObj> // table的数据
    columns: Table.Column[] // 每列的配置项
    options?: Table.Options<any> // el-table 配置项
    isLock?: boolean // 是否提供锁定列功能
    selectable?: (row: any, index: number) => boolean
  }>(),
  {
    isLock: true,
  }
)
const tableRef = ref<Table.extendElTable>()

const _paginationConfig = computed(() => {
  return props?.options?.paginationConfig || { currentPage: 1, pageSize: 0, total: 0 }
})
let indexWidth = computed(() => {
  return _paginationConfig.value.total ? _paginationConfig.value.total?.toString().length * 10 + 20 : 50
})
interface EmitEvent {
  (e: 'selection-change', rows: any): void // 当选项发生变化时会触发该事件
  (e: 'current-change', row: any): void // 当单选某一行时会触发该事件
  (e: 'select-rows', selection: any, row: any): void // 当多选行发生变化时会触发该事件
  (e: 'select-all', selection: any): void // 当全选时会触发该事件
  (e: 'row-click', row: any, column: TableColumnCtx<any>, event: Event): void // 当某一行被点击时会触发该事件
  (e: 'cell-click', row: any, column: TableColumnCtx<any>, cell: any, event: Event): void // 当某个单元格被点击时会触发该事件
  (e: 'row-db-click', row: any): void // 当双击某一行时触发
  (e: 'command', command: Table.Command, row: any): void // 按钮组事件
  (e: 'select-cols-change', keys: string[]): void // 弹窗调整展示列事件，不需要后端接口保存时不用监听这个事件
}
const emit = defineEmits<EmitEvent>()
// --------- computed ----------
// 设置option默认值，如果传入自定义的配置则合并option配置项
const _options: ComputedRef<Table.Options<any>> = computed(() => {
  const option = {
    stripe: false,
    tooltipEffect: 'dark',
    showHeader: true,
    rowStyle: () => 'cursor:pointer', // 行样式
    rowClassName: () => {},
    height: 'auto',
    emptyText: '暂无数据',
    highlightCurrentRow: true,
    border: true,
  }
  return Object.assign(option, props?.options)
})

// --------- data ------------
let dialogVisible = ref(false)
interface ArrayObj {
  notSelectedCols: Table.Column[]
  selectedCols: Table.Column[]
  selectedKeysOrigin: string[]
  selectedKeys: string[]
  defaultSelectedKeys: string[]
}
const arrObj = reactive<ArrayObj>({
  notSelectedCols: [],
  selectedCols: [],
  selectedKeysOrigin: [],
  selectedKeys: [],
  defaultSelectedKeys: [],
})
const { notSelectedCols, selectedCols, selectedKeysOrigin, selectedKeys, defaultSelectedKeys } = toRefs(arrObj)
let showSelection = ref(false)
let selectionItem = reactive<Table.Column>({ prop: '' })
// --------- watch ---------
watch(
  () => props.tableData,
  val => {
    for (let i = 0; i < val.length; i++) {
      if (val[i]?.selected) {
        tableRef.value && tableRef.value.toggleRowSelection(props.tableData[i], true)
      }
    }
  }
)
// --------- methods ------------
const indexMethod = (index: number) => {
  const tabIndex = index + (_paginationConfig.value.currentPage - 1) * _paginationConfig.value.pageSize + 1
  return tabIndex
}
const handleAction = (command: Table.Command, scope: any) => {
  emit('command', command, scope.row)
}
const changeHandle = (val: { command: string; row: any }) => {
  emit('command', val.command, val.row)
}
const beforeHandleCommand = (flag: string, row: any) => {
  return {
    command: flag,
    row,
  }
}
// 复选框勾选改变时事件, 集中处理所有选中项
const handleSelectionChange = (val: any) => {
  emit('selection-change', val)
}
// 多选
const selectRow = (selection: any, row: any) => {
  emit('select-rows', selection, row)
}
// 全选
const selectAll = (selection: any) => {
  emit('select-all', selection)
}
// 单选事件
const handleCurrentChange = (val: any) => {
  emit('current-change', val)
}
// 某一行被双击时触发该事件
const handleDbClick = (row: any) => {
  emit('row-db-click', row)
}
// 当某一行被点击时会触发该事件
const handleRowClick = (row: any, column: any, event: Event) => {
  if (column.type === 'actions' || column.type === 'expand') {
    return false
  } else {
    emit('row-click', row, column, event)
  }
}
// 当某个单元格被点击时会触发该事件
const handleCellClick = (row: any, column: any, cell: any, event: Event) => {
  if (column.type === 'actions' || column.type === 'expand') {
    return false
  } else {
    emit('cell-click', row, column, cell, event)
  }
}
/**
 * @description 点击锁定列
 */
const lockColumnLeft = (col: Table.Column) => {
  if (props.isLock) {
    let locked = col?.fixed || false
    if (!locked) {
      col.fixed = true
    } else {
      col.fixed = false
    }
  }
}
/**
 * @description 显示设置弹窗
 */
const handleDialog = () => {
  dialogVisible.value = true
  initSortable()
}

const checkSelectable = (row: any) => {
  let flag = true
  if (row.cannotCheck) {
    flag = false
  }
  return flag
}
/**
 * @description 隐藏设置弹窗
 */
const cancel = () => {
  selectedCols.value = getColsByKeys(selectedKeysOrigin.value)
  notSelectedCols.value = notSelectedCols.value.filter((col, index) => {
    return selectedKeys.value.indexOf(col.prop) < 0
  })
  dialogVisible.value = false
  nextTick(() => {
    tableLayOut()
  })
}
const tableLayOut = () => {
  tableRef.value && tableRef.value.doLayout()
}
const hiddenItem = (index: number) => {
  const spliceItem = selectedCols.value[index]
  notSelectedCols.value[notSelectedCols.value.length] = spliceItem
  selectedCols.value.splice(index, 1)
}
const displayItem = (index: number) => {
  const spliceItem = notSelectedCols.value[index]
  selectedCols.value[selectedCols.value.length] = spliceItem
  notSelectedCols.value.splice(index, 1)
}
const save = () => {
  if (selectedCols.value.length) {
    selectedKeys.value = []
    selectedCols.value.forEach(col => {
      selectedKeys.value.push(col.prop)
    })
    selectedKeysOrigin.value = [...selectedKeys.value]
    localStorage.setItem(`filedJson${_options.value.tableId}`, JSON.stringify(selectedKeys.value))
    dialogVisible.value = false
    nextTick(() => {
      tableLayOut()
    })
    emit('select-cols-change', selectedKeys.value)
  } else {
    ElMessage.warning('表头至少需要保留一项。')
    return false
  }
}
const allDisplay = () => {
  const allHideCols = _.cloneDeep(notSelectedCols.value)
  allHideCols.forEach((col: any, index: number) => {
    selectedCols.value.push(col)
  })
  notSelectedCols.value.splice(0)
}
const getColsByKeys = (keys: string[]): Table.Column[] => {
  return keys
    .map(k => {
      return props.columns.find(col => {
        return col.prop === k
      })
    })
    .filter(item => {
      return item
    }) as Table.Column[]
}
const getConfig = () => {
  selectedKeys.value = defaultSelectedKeys.value
  selectedKeysOrigin.value = defaultSelectedKeys.value
  if (_options.value?.settingTable && !_options.value?.tableId) {
    beuiError('options.settingTable为true时必须提供options.tableId', 'warn')
    selectedCols.value = getColsByKeys(defaultSelectedKeys.value)
    notSelectedCols.value = getColsByKeys([])
    return false
  } else if (_options.value?.settingTable && _options.value?.tableId) {
    let filedJson = localStorage.getItem(`filedJson${_options.value.tableId}`)
    if (filedJson && filedJson.length > 0) {
      selectedKeys.value = JSON.parse(filedJson)
      selectedKeysOrigin.value = JSON.parse(filedJson)
      let notSelectedKeys: string[] = []
      defaultSelectedKeys.value.forEach(k => {
        if (k && selectedKeysOrigin.value.indexOf(k) === -1) {
          notSelectedKeys.push(k)
        }
      })
      notSelectedCols.value = getColsByKeys(notSelectedKeys)
    }
    selectedCols.value = getColsByKeys(selectedKeysOrigin.value)
    nextTick(() => {
      tableLayOut()
    })
  } else {
    selectedCols.value = getColsByKeys(defaultSelectedKeys.value)
    notSelectedCols.value = getColsByKeys([])
  }
}
const moveEl = (arr: any[], index: number, tindex: number) => {
  if (index > tindex) {
    //如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
    //我们再把数组之前的那个拖动的元素删除掉，所以要len+1
    arr.splice(tindex, 0, arr[index])
    arr.splice(index + 1, 1)
  } else {
    //如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
    //这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
    arr.splice(tindex + 1, 0, arr[index])
    arr.splice(index, 1)
  }
}
const initSortable = () => {
  nextTick(() => {
    const wrapperTr: HTMLElement | null = document.querySelector('.display-items-dropable')
    if (wrapperTr)
      Sortable.create(wrapperTr, {
        animation: 500,
        delay: 0,
        onEnd: (evt: any) => {
          if (evt.oldIndex !== evt.newIndex) {
            moveEl(selectedCols.value, evt.oldIndex, evt.newIndex)
          }
        },
      })
  })
}
function getDefaultKeys() {
  const selectItem = props.columns.filter(item => item.type === 'selection')
  if (selectItem && selectItem.length) {
    selectionItem = selectItem[selectItem.length - 1]
    showSelection.value = true
  }
  defaultSelectedKeys.value = props.columns
    .filter(col => col.type !== 'selection')
    .map(item => {
      return item.prop
    })
}
// 暴露给父组件参数和方法，如果外部需要更多的参数或者方法，都可以从这里暴露出去。
// userColums 用于有些系统希望把用户的表格操作设置在数据库中存储
defineExpose({ element: tableRef, tableLayOut, userColumns: selectedCols.value })
onMounted(() => {
  getDefaultKeys()
  getConfig()
})
</script>

<style lang="scss" scoped>
@import './styles/index.scss';

:deep(.el-table__inner-wrapper) {
  height: 100% !important;
}
.table-dialog-btn {
  padding: 0;
}
.el-table.table-box {
  :deep(.el-table__body-wrapper) {
    .el-scrollbar__bar {
      border-radius: 2em;
      -webkit-box-shadow: inset 0 0 3px rgba(22, 22, 24, 0.3);
      background-color: rgba(221, 222, 224, 0.3);
      background-clip: padding-box;
      background-color: #fff;
      right: 4px;
      bottom: 4px;
    }
    .el-scrollbar__bar.is-vertical {
      width: 8px;
    }
    .el-scrollbar__bar.is-horizontal {
      height: 8px;
    }
  }
  :deep(.el-table__cell:not(.is-center) .cell) {
    padding: 0 12px;
  }

  :deep(th) {
    height: 36px;
    line-height: 36px;
    font-weight: 400;
  }

  :deep(td) {
    height: 36px;
    line-height: 36px;
  }

  :deep(.el-table__header) {
    tr,
    th,
    thead {
      font-size: 14px;
    }

    .icon-jiesuo {
      font-size: 12px;
    }
  }
}
.lock {
  font-style: normal;
  opacity: 0;
  color: #5270e7;
  margin-left: 4px;

  &:hover {
    opacity: 0.8;
  }
}
:deep(.table-box:not(.el-table--border)) {
  border: 1px solid #dcdcdc;
  border-bottom: none;
}
:deep(.el-transfer) {
  margin-left: 100px;
}
.safari-oneline {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.el-button) {
  margin: 0;
  height: 36px;
  line-height: 36px;

  > sapn {
    padding: 0;
  }
}

:deep(.el-button + .el-button) {
  margin-left: 8px;
}

:deep(.el-dropdown) {
  height: 36px;
  line-height: 36px;
  margin-left: 10px;
  color: $blue;
}
</style>
