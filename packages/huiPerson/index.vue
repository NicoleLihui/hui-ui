<template>
  <el-dialog
    v-if="showDialog"
    :model-value="showDialog"
    :title="title"
    :before-close="close"
    :draggable="draggable"
    :append-to-body="appendToBody"
    top="10vh"
    class="hui-person-dialog"
  >
    <div class="hui-person-body">
      <div class="hui-person-body_left">
        <!-- 公司组织类型 -->
        <el-radio-group class="hui-person-type" v-model="organizeType">
          <el-radio
            v-for="organizeItem in organizeTypeList"
            :key="organizeItem.value"
            :label="organizeItem.value"
            @change="handleOrganizeTypeChange"
            >{{ organizeItem.label }}</el-radio
          >
        </el-radio-group>
        <!-- tree结果 -->
        <el-scrollbar v-loading="treeLoading" element-loading-text="正在努力加载，请稍后..." always>
          <el-tree
            :class="isSingleTree && 'single-tree'"
            expand-on-click-node
            :show-checkbox="!isSingleTree"
            :default-expanded-keys="defaultExpandedKeys"
            :props="defaultProps"
            :load="loadNode"
            @check-change="handleNodeCheck"
            @node-click="handleNodeClick"
            ref="treeRef"
            class="hui-person-tree"
            lazy
            :highlight-current="isSingleTree"
            node-key="tempKey"
            empty-text="暂无数据"
          >
            <template #default="{ node, data }">
              <span :class="data.userId && 'single'" :title="node.label">
                <span>{{ node.label }}</span>
              </span>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="hui-person-body_right">
        <el-input ref="searchRef" v-model="searchText" placeholder="搜索">
          <template #prepend>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-popover
          :visible="popoverVisible"
          ref="popoverRef"
          :virtual-ref="searchRef"
          :show-arrow="false"
          placement="bottom-start"
          width="285px"
          :offset="0"
          popper-class="hui-person-result-popover"
          virtual-triggering
        >
          <div class="popover-result-box" v-loading="popoverLoading" element-loading-text="正在努力匹配数据，请稍后...">
            <template v-if="searchList.length">
              <p class="popover-result_title">你可能想找</p>
              <el-scrollbar always>
                <ul class="popover-result_body">
                  <li v-for="result in searchList" :key="result.userId" @click="handleSelectPerson(result)">
                    <label v-html="getShowText(result.userName, searchText)"></label>
                    <span v-if="result.job">{{ result.job }}</span>
                    <p
                      v-html="
                        `${getShowText(result.organization, searchText)}-${getShowText(result.department, searchText)}`
                      "
                      :title="`${getShowText(result.organization, searchText)}-${getShowText(
                        result.department,
                        searchText
                      )}`"
                    />
                  </li>
                </ul>
                <div v-if="showMore" class="more">
                  <el-icon>
                    <Search />
                  </el-icon>
                  <el-button link type="primary" @click="hanelMore" size="small">查看更多</el-button>
                </div>
              </el-scrollbar>
            </template>
            <template v-if="!popoverLoading && searchList.length === 0">
              <el-empty :image-size="100" description="未匹配到数据" />
            </template>
          </div>
        </el-popover>
        <div class="selected-list">
          <span v-for="person in selectedPersonList">
            {{ person.userName }}
            <el-icon @click.stop="handleDelPerson(person)">
              <Close />
            </el-icon>
          </span>
        </div>
      </div>
    </div>
    <!-- 底部按钮部分 -->
    <template #footer>
      <div class="hui-person-dialog_footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit" :disabled="selectedPersonList.length === 0">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type ElTree from 'element-plus/es/components/tree'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { watchDebounced } from '@vueuse/core'
import { Search, Close } from '@element-plus/icons-vue'
import { PersonTypes } from './types/type'
defineOptions({
  name: 'HuiPerson',
  inheritAttrs: false,
})
// ------------------------------定义Props----------------------------
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    userId: string | number
    draggable?: boolean
    appendToBody?: boolean
    limit?: number
    selectedData?: any[]
    departApi: PersonTypes.DepartApi
    organizApi: PersonTypes.OrganizApi
    slurUserApi: PersonTypes.SlurUserApi
    departByOrgIdApi: PersonTypes.DepartByOrgIdApi
    mdmUserByDeptIdApi: PersonTypes.MdmUserByDeptIdApi
  }>(),
  {
    modelValue: false, // 显示隐藏
    title: '项目经理', // 标题
    userId: '0001N610000000009054', // 接口userId
    draggable: false, // 是否拖拽
    appendToBody: true, // 是否添加到body上
    limit: 200, // 限制选择数量
    selectedData: () => [],
    departApi: (): Promise<any> => {
      return new Promise((): any => {})
    }, // 获取本公司组织接口
    organizApi: (): Promise<any> => {
      return new Promise((): any => {})
    }, // 获取本公司及以下组织接口
    slurUserApi: (): Promise<any> => {
      return new Promise((): any => {})
    }, // 根据名字搜索接口
    departByOrgIdApi: (): Promise<any> => {
      return new Promise((): any => {})
    }, // 根据公司获取部门信息
    mdmUserByDeptIdApi: (): Promise<any> => {
      return new Promise((): any => {})
    }, // 根据部门获取人员信息
  }
)
// ------------------------------定义Emits----------------------------
const emits = defineEmits(['update:modelValue', 'closed', 'getCheckedData'])
// 默认 '2' 本公司及以下
const organizeType = ref('2')
// tree Ref
const treeRef = ref<InstanceType<typeof ElTree>>()
// tree loading
const treeLoading = ref<boolean>(false)
// 初始化loadNode参数缓存Node
const cacheLoadNode = ref<Node | null>(null)
// 初始化loadNode参数缓存Resolve
const cahcheLoadResolve = ref<Function | null>(null)
// tree默认展开列表
const defaultExpandedKeys = ref<string[]>([])
// Dialog 显示隐藏
const showDialog = computed<boolean>(() => props.modelValue)
// 搜索文本
const searchText = ref<string>('')
// 已经选择数据
const selectedPersonList = ref<any[]>([])
// 搜索气泡popover loading
const popoverLoading = ref<boolean>(false)
// 搜索气泡popover 列表数据
const searchList = ref<any[]>([])
// 搜索气泡popover 显示隐藏
const popoverVisible = ref<boolean>(false)
// 搜索气泡popover 分页
const lastPage = ref<number>(1)
// 搜索气泡popover 查看更多
const showMore = ref<boolean>(false)
// 搜索输入框Ref 和 popover的虚拟关系引入
const searchRef = ref<HTMLElement | null>(null)
// 搜索输入框Ref 和 popover的虚拟关系引入
const popoverRef = ref<HTMLElement | null>(null)

// organize 类型
const organizeTypeList = ref<OrganizeTypeItem[]>([
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
  label: (data: any): string => {
    if (data.type) {
      return data.name
    } else {
      return data.userName
    }
  },
  isLeaf: (data: any): boolean => {
    return !data.type
  },
}

// 是否限制1个
const isSingleTree = computed<boolean>(() => props.limit === 1)

watch(
  () => props.selectedData,
  () => {
    selectedPersonList.value = JSON.parse(JSON.stringify(props.selectedData))
  },
  {
    deep: true,
    immediate: true,
  }
)

watch(selectedPersonList, val => {
  treeRef.value &&
    treeRef.value!.setCheckedKeys(
      selectedPersonList.value.map((checkedItem: any) => checkedItem.userId),
      false
    )
})

watchDebounced(
  searchText,
  () => {
    if (searchText.value === '') {
      popoverVisible.value = false
      return
    }
    if (/.*[\u4e00-\u9fa5]+.*$/.test(searchText.value)) {
      if (selectedPersonList.value.length < Number(props.limit)) {
        popoverVisible.value = true
        showMore.value = true
        lastPage.value = 1
        searchList.value = []
        fetchSearch()
        return
      } else {
        ElMessage.warning(`最大可选数量为${props.limit}`)
      }
    } else {
      ElMessage.error('请输入汉字')
    }
    popoverVisible.value = false
  },
  { debounce: 1000, maxWait: 5000 }
)

// ------------------------------定义Methods----------------------------
// 加载treeNode
async function loadNode(node: Node, resolve: Function): Promise<any> {
  if (node.level === 0) {
    cacheLoadNode.value = node
    cahcheLoadResolve.value = resolve
    treeLoading.value = true
    const data: PersonTypes.OrganizeType | false = await (organizeType.value === '1'
      ? props.departApi({ userId: props.userId })
      : props.organizApi({ userId: props.userId }))

    if (data) {
      treeLoading.value = false
      const treeData: PersonTypes.OrganizeType = {
        ...data,
        name: data.orgName || 'XX公司',
      }
      const initTreeData = modifyTreeKey([treeData])
      initTreeData.length && defaultExpandedKeys.value.push(initTreeData[0].tempKey)
      resolve(initTreeData)
    } else {
      treeLoading.value = false
      resolve([])
    }
  } else if (node.level > 0 && node.level < 4) {
    //默认展开的层级,需要默认几层就判断一下.
    if (node.data.children && node.data.children.length) {
      return resolve(node.data.children)
    } else {
      getTreeChildren(node, resolve)
    }
    //核心是这里,每次展开的时候loadNode方法就会调用一次,只需要把node.data.[这里是默认的child字段]  加载到resolve方法里就可以了.就可以实现默认加载N级,之后再使用懒加载
  } else {
    getTreeChildren(node, resolve)
  }
}
// 获取tree children
async function getTreeChildren(node: Node, resolve: Function): Promise<void> {
  const isDepartOrg = ['公司', '子公司'].includes(node.data.type)
  if (isDepartOrg) {
    const data = await props.departByOrgIdApi({ orgId: node.data.pkOrg })
    if (data) resolve(modifyTreeKey(data?.children))
    else resolve([])
  } else {
    const data = await props.mdmUserByDeptIdApi({ deptId: node.data.pkDept })
    if (data) resolve(modifyTreeKey(data))
    else resolve([])
  }
  nextTick(() => {
    treeRef.value!.setCheckedKeys(
      selectedPersonList.value.map((selected: any) => selected.tempKey),
      false
    )
  })
}
// 给tree增加统一的字段key
function modifyTreeKey(data: any): any {
  addKey(data)
  function addKey(data: any): void {
    if (data.length < 0) return
    data.forEach((x: any): void => {
      x.tempKey = x.pkDept || x.pkOrg || x.userId
      if (x.children) {
        addKey(x.children)
      }
    })
  }
  return data
}
// 切换组织类型，重新渲染treeData
function handleOrganizeTypeChange(val: string | number | boolean): void {
  if (cacheLoadNode.value && cahcheLoadResolve.value) {
    cacheLoadNode.value.childNodes = [] //把存起来的node的子节点清空，不然会界面会出现重复树
    loadNode(cacheLoadNode.value, cahcheLoadResolve.value)
  }
}
// tree 数据选中
function handleNodeCheck(data: TreeNodeData, isChecked: boolean): void {
  nextTick(() => {
    const checkedPersonList = treeRef.value!.getCheckedNodes().filter((node: any) => node.userId)
    let tempList = [
      ...JSON.parse(JSON.stringify(selectedPersonList.value)),
      ...JSON.parse(JSON.stringify(checkedPersonList)),
    ]
    let tempMap = new Map()
    for (let i of tempList) {
      if (!tempMap.has(i.userId)) {
        tempMap.set(i.userId, i)
      }
    }
    tempList = isChecked
      ? [...tempMap.values()]
      : [...tempMap.values()].filter((tempItem: any) => tempItem.userId !== data.userId)

    if (tempList.length > 0 && tempList.length <= props.limit) {
      selectedPersonList.value = tempList
    } else if (tempList.length > props.limit) {
      ElMessage.warning(`最大可选数量为${props.limit}`)
      treeRef.value!.setCheckedKeys(
        selectedPersonList.value.map((checkedItem: any) => checkedItem.userId),
        false
      )
    } else {
      selectedPersonList.value = []
      treeRef.value!.setCheckedKeys([], false)
    }
  })
}
// 如果限制一个 则点击选择
function handleNodeClick(data: TreeNodeData, node: Node, treeNode: TreeNodeData[]): void {
  if (isSingleTree.value && data.userId) {
    selectedPersonList.value = [data]
  }
}
// 搜索点击选择
function handleSelectPerson(person: any): void {
  if (!selectedPersonList.value.some((selected: any) => selected.userId === person.userId)) {
    // treeRef.value!.setChecked(person.tempKey, true, false)
    selectedPersonList.value.push(person)
    searchText.value = ''
  } else {
    ElMessage.warning(`${person.userName}已存在`)
  }
  popoverVisible.value = false
}
// 删除已选择的人员
function handleDelPerson(item: any): void {
  isSingleTree.value
    ? treeRef.value!.setCurrentKey(undefined, false)
    : treeRef.value!.setChecked(item.tempKey, false, false)
  selectedPersonList.value = selectedPersonList.value.filter((person: any) => person.userId !== item.userId)
}
// 查看更多
function hanelMore(): void {
  lastPage.value++
  fetchSearch()
}
// 搜索
async function fetchSearch(): Promise<void> {
  popoverLoading.value = true
  const data = await props.slurUserApi({
    currPage: lastPage.value,
    userName: searchText.value,
  })
  if (data) {
    popoverLoading.value = false
    const result = JSON.parse(JSON.stringify(data))
    if (result.length > 0) {
      searchList.value = lastPage.value > 1 ? [...searchList.value, ...result] : result
    } else {
      showMore.value = false
      lastPage.value > 1 && ElMessage.warning('没有更多了')
    }
  } else {
    popoverLoading.value = false
  }
}
//指定文字变色
function getShowText(showText: string, filterVal: string): string {
  const reg = new RegExp(filterVal, 'ig')
  return showText.replace(reg, substr => {
    return `<i class="highlight">${substr}</i>`
  })
}
// 关闭
function close(): void {
  emits('update:modelValue', false)
  emits('closed')
  nextTick(() => {
    resetData()
  })
}
// 重置字段
function resetData(): void {
  popoverVisible.value = false
  searchText.value = ''
  selectedPersonList.value = []
  searchList.value = []
  showMore.value = true
}
// 确定
function submit(): void {
  emits('getCheckedData', toRaw(selectedPersonList.value))
  close()
}
</script>

<style lang="scss">
@import './styles/index.scss';
</style>
