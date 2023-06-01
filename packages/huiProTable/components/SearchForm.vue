<template>
  <!-- 查询表格组件的表格，通过cols及其配置渲染 -->
  <el-config-provider :locale="zhCn">
    <el-form ref="searchFormRef" :label-width="labelWidth" :model="formValues">
      <template v-for="item in paramsDataModel" :key="item.label">
        <el-form-item ref="formItemRef" v-if="item.searchable" :label="item.label" :prop="item.prop">
          <template v-if="item.searchType === 'input'">
            <HuiInput
              v-bind="item.searchOptions"
              v-model="formValues[`${item.prop}`]"
              :placeholder="`请输入${item.label}`"
            ></HuiInput>
          </template>
          <template v-if="item.searchType === 'textarea'">
            <HuiTextarea
              v-bind="item.searchOptions"
              v-model="formValues[`${item.prop}`]"
              :placeholder="`请输入${item.label}`"
            ></HuiTextarea>
          </template>
          <template v-if="item.searchType === 'number'">
            <el-input-number
              v-bind="item.searchOptions"
              v-model="formValues[`${item.prop}`]"
              :placeholder="`请输入${item.label}`"
            ></el-input-number>
          </template>
          <template v-if="item.searchType === 'select'">
            <el-select
              v-bind="item.searchOptions"
              v-model="formValues[`${item.prop}`]"
              :placeholder="`请选择${item.label}`"
            >
              <el-option
                :key="option.value"
                :value="option.value"
                :label="option.label"
                v-for="option in item.valueOptions"
              ></el-option>
            </el-select>
          </template>
          <template v-if="item.searchType === 'multi-select'">
            <el-select
              v-bind="item.searchOptions"
              v-model="formValues[`${item.prop}`]"
              :placeholder="`请选择${item.label}`"
            >
              <el-option
                :key="option.value"
                :value="option.value"
                :label="option.label"
                v-for="option in item.valueOptions"
              ></el-option>
            </el-select>
          </template>
          <template v-if="item.searchType === 'cascader'">
            <el-cascader
              v-bind="item.searchOptions"
              v-model="formValues[`${item.prop}`]"
              :options="item.valueOptions"
              :placeholder="`请选择${item.label}`"
            />
          </template>
          <template v-if="item.searchType === 'radio'">
            <el-radio-group v-bind="item.searchOptions" v-model="formValues[`${item.prop}`]">
              <el-radio v-for="option in item.valueOptions" :key="option.label" :label="option.label">{{
                option.value
              }}</el-radio>
            </el-radio-group>
          </template>
          <template v-if="item.searchType === 'time'">
            <el-time-picker v-bind="item.searchOptions" v-model="formValues[`${item.prop}`]" placeholder="请选择时间" />
          </template>
          <template v-if="item.searchType === 'date'">
            <el-date-picker v-model="formValues[`${item.prop}`]" v-bind="item.searchOptions" placeholder="请选择" />
          </template>
          <template v-if="item.searchType === 'date-time'">
            <el-date-picker
              v-model="formValues[`${item.prop}`]"
              v-bind="item.searchOptions"
              type="datetime"
              placeholder="请选择"
            />
          </template>
          <template v-if="item.searchType === 'person'">
            <el-input
              v-model="formValues[`${item.prop}Name`]"
              :placeholder="`请选择${item.label}`"
              :clearable="false"
              @focus="openSelectPerson(item.prop)"
              :suffix-icon="User"
            >
            </el-input>
          </template>
          <template v-if="item.searchType === 'organize'">
            <el-input
              v-model="formValues[`${item.prop}Name`]"
              :placeholder="`请选择${item.label}`"
              :clearable="false"
              @focus="openSelectOrganize(item.prop)"
            >
              <template #suffix>
                <HuiIcon icon-name="icon-zuzhijiagou" class="organize-icon"></HuiIcon>
              </template>
            </el-input>
          </template>
        </el-form-item>
      </template>
      <!-- 在这里处理一些额外的表单字段, 由用户自定义, 自己取值作为请求参数-->
      <slot name="otherForm"></slot>
    </el-form>
  </el-config-provider>
  <HuiPerson
    v-model="selectPersonVisible"
    v-bind="personArgs"
    @getCheckedData="getCheckedData"
    @closed="closeSelectPerson"
  ></HuiPerson>
  <HuiOrganize
    v-bind="organizeArgs"
    v-model="selectOrganizeVisible"
    @closed="onOrgClose"
    @getCheckedData="onOrgChecked"
  />
</template>

<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { paramsDataDefault } from './const'
import { ProTable } from '../types/type'
import { ComputedRef } from 'vue'
import { User } from '@element-plus/icons-vue'
import { FormInstance } from 'element-plus'
import HuiInput from '../../huiInput/index.vue'
import HuiTextarea from '../../huiTextarea/index.vue'
import HuiPerson from '@packages/huiPerson/index.vue'
import HuiOrganize from '@packages/huiOrganize/index.vue'
import HuiIcon from '@packages/components/HuiIcon.vue'
const props = withDefaults(
  defineProps<{
    paramsData: ProTable.ParamsData[]
  }>(),
  {}
)
const searchFormRef = ref<FormInstance>()
const formItemRef = ref()
let searchMore = ref(false)
const personProps = inject<ProTable.PersonProps>('personProps')
const organizeProps = inject<ProTable.OrganizeProps>('organizeProps')
const personArgs = reactive({
  userId: '',
  title: '人员选择',
  selectedData: [],
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
  ...personProps,
})
const organizeArgs = reactive({
  title: '组织选择',
  includeDept: false, // 是否仅包含部门、组织
  multiple: false, // 是否多选
  currentNodeKey: '',
  orgDeptTreeApi: (): Promise<any> => {
    return new Promise((): any => {})
  },
  ...organizeProps,
})

const paramsDataModel: ComputedRef<ProTable.ParamsData[]> = computed(() => {
  let result
  result = []
  props.paramsData.forEach(data => {
    if (data?.searchType) {
      const defaultOptions = paramsDataDefault[data.searchType] || {}
      data.searchOptions = Object.assign(defaultOptions, data.searchOptions || {})
    }
    result.push(data)
  })
  return result
})
let ArrayObj = reactive<{ selectPersonArr: Person[]; selectOrgArr: any[] }>({ selectPersonArr: [], selectOrgArr: [] })
const { selectPersonArr, selectOrgArr } = toRefs(ArrayObj)
const formValues = reactive({})
let currentPerson = ref('')
let currentOrganize = ref('')
let selectPersonVisible = ref(false)
let selectOrganizeVisible = ref(false)
watch(
  () => props.paramsData,
  val => {
    val.forEach(data => {
      if (data?.searchable) {
        // 给查询选项赋初始值
        formValues[data.prop] = data?.searchValue
      }
    })
  },
  { immediate: true }
)
let labelWidth = ref('120px')
const openSelectPerson = function (field: string) {
  currentPerson.value = field
  selectPersonVisible.value = true
}
const openSelectOrganize = function (field: string) {
  currentOrganize.value = field
  selectOrganizeVisible.value = true
}
// 保存当前选人弹窗的数据到formValue里面，并清空选人弹窗的数据
function getCheckedData(val: Person[]) {
  selectPersonArr.value = val
  let ids: string[] = []
  let names: string[] = []
  val.forEach(x => {
    ids.push(x.userId)
    names.push(x.userName)
  })
  let userStr = ids.join(',')
  let nameStr = names.join(',')
  formValues[`${currentPerson.value}`] = userStr
  formValues[`${currentPerson.value}Name`] = nameStr
  selectPersonArr.value = []
}
function onOrgChecked(val: any) {
  selectOrgArr.value = val
  let result: any = val
  let names: string[] = []
  if (Array.isArray(val)) {
    val.forEach(x => {
      names.push(x.name)
    })
  } else {
    names.push(val.name)
  }

  let nameStr = names.join(',')
  formValues[`${currentOrganize.value}`] = result
  formValues[`${currentOrganize.value}Name`] = nameStr
  selectOrgArr.value = []
}
function closeSelectPerson() {
  selectPersonVisible.value = false
  currentPerson.value = ''
}
function onOrgClose() {
  selectOrganizeVisible.value = false
  currentOrganize.value = ''
}
function getFormValues() {
  return formValues
}
function resetFields() {
  searchFormRef.value?.resetFields()
}

function searchMoreAdjust() {
  const formWidth = searchFormRef.value?.$el?.offsetWidth
  const formItemCounts = formItemRef.value.length
  const formItemWidth = formItemRef.value[0]?.$el?.offsetWidth
  const rowCount = Math.floor(formWidth / formItemWidth)
  if (formItemCounts > rowCount) {
    searchMore.value = true
  }
  window.addEventListener('resize', () => {
    searchMore.value = false
    const resizeFormWidth = searchFormRef.value?.$el.offsetWidth
    const resizeFormItemWidth = formItemRef.value[0]?.$el?.offsetWidth
    const resizeRowCount = Math.floor(resizeFormWidth / resizeFormItemWidth)
    if (formItemCounts > resizeRowCount) {
      searchMore.value = true
    }
  })
}

onMounted(() => {
  searchMoreAdjust()
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {
    searchMore.value = false
  })
})
// 暴露方法
defineExpose({ getFormValues, resetFields, searchMore })
</script>

<style lang="scss" scoped>
.search-form .el-form {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    .el-input {
      width: 100%;
    }
  }
}
.organize-icon {
  font-size: 14px;
  color: #c2c6ce;
}
.el-select {
  width: 100%;
}
@media screen and (max-width: 1920px) {
  .el-form-item {
    width: 25%;
  }
}

@media screen and (max-width: 1440px) {
  .el-form-item {
    width: 33.3%;
  }
}

@media screen and (max-width: 1080px) {
  .el-form-item {
    width: 33.3%;
  }
}

@media screen and (max-width: 768px) {
  .el-form-item {
    width: 50%;
  }
}
</style>
