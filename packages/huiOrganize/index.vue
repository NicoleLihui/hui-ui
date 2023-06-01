<template>
  <el-dialog
    v-if="showDialog"
    :model-value="showDialog"
    :title="title"
    :before-close="close"
    :draggable="draggable"
    :append-to-body="appendToBody"
    top="10vh"
    class="hui-organize-dialog"
  >
    <div class="hui-organize-body">
      <!-- 公司组织类型 -->
      <el-radio-group class="hui-organize-type" v-model="organizeType">
        <el-radio
          v-for="organizeItem in includeDept ? organizeTypeList.filter(f => f.value !== '1') : organizeTypeList"
          :key="organizeItem.value"
          :label="organizeItem.value"
          @change="handleOrganizeTypeChange"
          >{{ organizeItem.label }}</el-radio
        >
      </el-radio-group>
      <!-- 关键字输入框 -->
      <el-input class="hui-organize-filter" v-model="filterText" placeholder="输入关键字进行过滤" />
      <!-- tree结果 -->
      <el-scrollbar v-loading="treeLoading" element-loading-text="正在努力加载，请稍后..." always>
        <el-tree
          ref="treeRef"
          class="hui-organize-tree"
          :data="treeData"
          :expand-on-click-node="multiple"
          :check-on-click-node="!multiple"
          :show-checkbox="multiple"
          :props="defaultProps"
          :default-checked-keys="handleCheckedKeys()"
          :current-node-key="handleCurrentNodeKey()"
          :default-expanded-keys="expandKeys"
          node-key="id"
          check-strictly
          highlight-current
          empty-text="暂无数据"
          @check-change="handleNodeCheckChange"
          @check="handleNodeCheck"
          :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <span v-if="multiple" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span v-if="node.childNodes.length" class="node-select-self">
                <el-button link size="small" @click.stop="handleNodeSelf(node)">{{
                  node.checked ? '只取消自己' : '只选择自己'
                }}</el-button>
              </span>
            </span>
            <span v-else class="single">
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <!-- 底部按钮部分 -->
    <template #footer>
      <div class="hui-organize-dialog_footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { ElTree } from 'element-plus'
import { OrganizeTypes } from './types/type'
defineOptions({
  name: 'HuiOrganize',
  inheritAttrs: false,
})

// ------------------------------定义Props----------------------------
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    draggable?: boolean
    appendToBody?: boolean
    includeDept?: boolean
    multiple?: boolean
    currentNodeKey?: TreeKey | any
    checkedKeysData?: any[]
    orgDeptTreeApi: OrganizeTypes.OrgDeptTreeApi
  }>(),
  {
    modelValue: false,
    title: '项目归属', // 标题
    draggable: false, // 是否拖拽
    appendToBody: true, // 是否添加到body上
    includeDept: false, // 是否仅包含部门、组织
    multiple: false, // 是否多选
    currentNodeKey: '',
    checkedKeysData: () => [], // 数据回显
    orgDeptTreeApi: (): Promise<any> => {
      return new Promise((): any => {})
    },
  }
)
// ------------------------------定义Emits----------------------------
const emits = defineEmits(['update:modelValue', 'closed', 'getCheckedData'])
// 默认 '2' 本公司及以下
const organizeType = ref<string>('2')
// 输入框过滤
const filterText = ref<string>('')
// tree Ref
const treeRef = ref<InstanceType<typeof ElTree>>()
// organize 类型
const organizeTypeList = ref<OrganizeTypeItem[]>([
  {
    label: '全部',
    value: '0',
  },
  {
    label: '本公司',
    value: '1',
  },
  {
    label: '本公司及以下',
    value: '2',
  },
])
// tree Props
const defaultProps = {
  children: 'children',
  label: 'name',
}
// 展开key[]
const expandKeys = ref<TreeKey[]>([])
// tree Data
const treeData = ref<OrganizeTypes.OrganizeType[]>([])
// tree loading
const treeLoading = ref<boolean>(false)
// Dialog 显示隐藏
const showDialog = computed<boolean>(() => props.modelValue)
// const hasCheckedData = ref<boolean>(false)
// 关键字改变过滤tree
watch(filterText, (val: string): void => {
  treeRef.value!.filter(val)
})
watch(showDialog, val => {
  if (val) {
    expandKeys.value = [...expandKeys.value, ...handleExpandedKeys()]
    // 处理传参数的半选中
    nextTick(() => {
      if (props.multiple) {
        expandKeys.value.forEach((key: TreeKey) => {
          const dataNode = treeRef.value!.getNode(key)
          handleHalfChecked(dataNode)
        })
      }
    })
  }
})

onMounted(() => {
  getTreeData()
})
// ------------------------------定义Methods----------------------------
// 获取tree数据
async function getTreeData(): Promise<void> {
  if (!props.orgDeptTreeApi) {
    return
  }
  treeLoading.value = true
  const params = {
    type: organizeType.value,
    includeDept: props.includeDept,
  }
  const data = await props.orgDeptTreeApi(params)
  if (data) {
    treeLoading.value = false
    treeData.value = [data]
    Object.prototype.hasOwnProperty.call(data, 'id') && expandKeys.value.push(data.id)
  } else {
    treeLoading.value = false
  }
}
function handleOrganizeTypeChange(): void {
  getTreeData()
}
// tree 过滤
function filterNode(value: string, data: TreeNodeData): boolean {
  if (!value) return true
  return data.name.includes(value)
}
// 递归节点状态
function deepNodeStatus(nodes: OrganizeTypes.CheckOrganizeType[], checkStatus: boolean): void {
  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i]
    node.checked = checkStatus
    if (node.childNodes?.length && node.childNodes?.length > 0) {
      deepNodeStatus(node.childNodes, checkStatus)
    }
  }
}

// 递归 tree 转 arr
// function treeToArray (data:any): any {
//   return data.reduce((pre:any, cur:any) => {
//     const { childNodes = [], ...item } = cur;
//     return pre.concat([{ ...item }], treeToArray(childNodes))
//   }, []);
// }

// 处理接收的checkedKeys是string[]和object[]
function handleCheckedKeys(): TreeKey[] {
  if (!props.checkedKeysData || props.checkedKeysData.length === 0) {
    return []
  }
  return typeof props.checkedKeysData[0] === 'string'
    ? props.checkedKeysData
    : props.checkedKeysData.map((item: any): TreeKey => item.id)
}

// 处理接收的currentNodeKey是string和object
function handleCurrentNodeKey(): string {
  if (!props.currentNodeKey) {
    return ''
  }
  return typeof props.currentNodeKey === 'string' ? props.currentNodeKey : props.currentNodeKey.id
}

// 默认展开tree key
function handleExpandedKeys(): TreeKey[] {
  return props.multiple ? handleCheckedKeys() : props.currentNodeKey ? [handleCurrentNodeKey()] : []
}

// 处理节点check
function handleNodeCheck(data: OrganizeTypes.CheckOrganizeType, treeCheckObj: any): void {
  // 设置父节点状态
  if (data.parentId) {
    const parentNode = treeRef.value!.getNode(data.parentId)
    const allChecked = parentNode.childNodes.every(node => node.checked)
    allChecked && treeRef.value!.setChecked(data.parentId, allChecked, false)
    parentNode.indeterminate = !allChecked
  }
  // 设置子节点状态
  if (data.children && data.children.length) {
    const checkStatus = treeCheckObj.checkedKeys.find((key: string) => key === data.id)
    for (let i = 0, len = data.children.length; i < len; i++) {
      const id = data.children[i].id
      treeRef.value!.setChecked(id, !!checkStatus, false)
      const childrenNodes: OrganizeTypes.CheckOrganizeType[] = treeRef.value!.getNode(id)
        .childNodes as unknown as OrganizeTypes.CheckOrganizeType[]
      deepNodeStatus(childrenNodes, !!checkStatus)
    }
  }
}
// 处理节点check change
function handleNodeCheckChange(data: TreeNodeData, checked: boolean, childCheckNodes: TreeNodeData[]): void {
  const dataNode = treeRef.value!.getNode(data.id)
  handleHalfChecked(dataNode)
}
// 处理半选中
function handleHalfChecked(node: TreeNodeData): void {
  nextTick(() => {
    node.indeterminate = node.checked && !node.childNodes.every((childNode: TreeNodeData) => childNode.checked)
  })
}
// 只选择（取消）自己
function handleNodeSelf(node: TreeNodeData): void {
  nextTick(() => {
    node.checked = !node.checked
    handleHalfChecked(node)
    treeRef.value!.setChecked(node.id, !node.checked, false)
  })
}
// 关闭
function close(): void {
  emits('update:modelValue', false)
  emits('closed')
}
// 确定
function submit(): void {
  let checkedData: TreeNodeData | TreeNodeData[] = props.multiple
    ? treeRef.value!.getCheckedNodes()
    : treeRef.value!.getCurrentNode()
  const hasCheckedData = props.multiple ? checkedData.length > 0 : !!checkedData
  if (!hasCheckedData) {
    ElMessage.warning('请至少选中一条数据')
    return
  }
  if (props.multiple && checkedData.length > 0) {
    checkedData = checkedData.map((item: TreeNodeData) => {
      const { children = null, ...rest } = item
      return rest
    })
  }
  emits('getCheckedData', checkedData)
  close()
}
</script>

<style lang="scss">
@import './styles/index.scss';
</style>
