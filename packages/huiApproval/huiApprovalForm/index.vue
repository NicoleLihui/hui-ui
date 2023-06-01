<template>
  <div v-if="!isNoForm">
    <slot
      ref="componentDynamic"
      v-if="approvalData.formKey"
      :componentName="approvalData.formKey"
      :dataModel="approvalData.dataModel"
      :isFormEditable="isFormEditable"
      name="customContent"
    ></slot>
    <FormSchema
      ref="approvalForm"
      :formFields="approvalData.approvalFormFields"
      :formValues="approvalData.approvalFormValues"
      :userId="userId"
      :actionType="approvalData.actionType"
      v-if="approvalData.actionType === 'approval' || approvalData.actionType === 'addPerson'"
    >
      <template #button>
        <el-button type="primary" @click="addMsg" style="float: right; margin-bottom: 10px">
          带入历史审批意见
        </el-button>
      </template>
    </FormSchema>
    <FormMaker ref="formMaking" v-if="approvalData.actionType === 'handler'" :formList="approvalData.formList || []" />
    <div class="btns">
      <el-button
        :type="item.flag === 'abnormal' ? 'danger' : 'primary'"
        v-for="item in approvalData.formActionList"
        :key="item.code"
        @click="hanldeClick(item)"
      >
        {{ item.name }}
      </el-button>
    </div>
    <BackChooseNode v-model="dialogVisible" @save-back-node="backConfirm"></BackChooseNode>
    <HuiPerson
      v-model="selectPersonVisible"
      :title="title"
      :userId="userId"
      :departApi="departApi"
      :organizApi="organizApi"
      :slurUserApi="slurUserApi"
      :departByOrgIdApi="departByOrgIdApi"
      :mdmUserByDeptIdApi="mdmUserByDeptIdApi"
      @getCheckedData="getPersonData"
      @closed="closeSelectPerson"
    ></HuiPerson>
  </div>
  <div v-else class="no-form">当前用户暂无可操作表单</div>
</template>

<script lang="ts" setup>
import FormSchema from './components/FormSchema.vue'
import FormMaker from './components/FormMaker.vue'
import BackChooseNode from './components/BackChooseNode.vue'
import HuiPerson from '../../huiPerson/index.vue'
import { FormFields, Action, NodeItem, BackNode, FileItem, ApprovalData } from './types/types'
import $bus from '../../utils/bus'
import { parseTime } from '../../utils/timeFormat'
import { PersonTypes } from '@packages/huiPerson/types/type'
defineOptions({
  name: 'HuiApprovalForm',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    approvalData: ApprovalData
    processId: string
    userId: string | number
    departApi: PersonTypes.DepartApi
    organizApi: PersonTypes.OrganizApi
    slurUserApi: PersonTypes.SlurUserApi
    departByOrgIdApi: PersonTypes.DepartByOrgIdApi
    mdmUserByDeptIdApi: PersonTypes.MdmUserByDeptIdApi
  }>(),
  {
    processId: '',
    userId: '',
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
const emit = defineEmits(['getNodeList', 'submit'])
// ----- refs ------
let approvalForm = ref()
let componentDynamic = ref()
let formMaking = ref()
// -----------------
// ----- data -----
let isNoForm = ref(false)
let isFormEditable = ref(false)
let currentBtn = ref<Action>()
let btnName = ref('')
let keepFollow = ref('')
let formData = ref()
let isValid = ref(true)
let dialogVisible = ref(false)
let nodeList = reactive<NodeItem[]>([])
let dialogFormData = reactive<BackNode>({
  targetActivityId: '',
  targetActivityName: '',
})
let noNeedValidForm = ref(false)
let arrObject = reactive<{ fileList: FileItem[]; selectPersonArr: Person[] }>({ fileList: [], selectPersonArr: [] })
const { fileList, selectPersonArr } = toRefs(arrObject)
let customFormValue = reactive({})
let title = ref('选择人员')
let limit = ref('1')
let selectPersonVisible = ref(false)
// -----------------
// ----- watch -----
watch(
  () => props.approvalData,
  val => {
    if (val?.approvalFormFields) {
      const hasApprovalForm = val.approvalFormFields.toString() === '[object Object]'
      isNoForm.value = !hasApprovalForm

      const hasFormKey = !!val.formKey
      if (hasFormKey) {
        handleFormkeyValue()
      }
    }
  },
  { immediate: true }
)
// -----------------
// ----- provide -----
provide('radioChange', radioChange)
provide('noNeedValidForm', noNeedValidForm)
provide('userId', props.userId)
provide('departApi', props.departApi)
provide('organizApi', props.organizApi)
provide('slurUserApi', props.slurUserApi)
provide('departByOrgIdApi', props.departByOrgIdApi)
provide('mdmUserByDeptIdApi', props.mdmUserByDeptIdApi)
// -----------------
// ----- function -----
function handleFormkeyValue() {
  if (props.approvalData?.isFormModelEditable) {
    let configEditable = true
    if (typeof props.approvalData?.isFormModelEditable === 'boolean') {
      configEditable = props.approvalData.isFormModelEditable
    } else if (typeof props.approvalData?.isFormModelEditable === 'string') {
      configEditable = JSON.parse(props.approvalData.isFormModelEditable)
    }
    const isAddedHandler = props.approvalData.actionType === 'addPerson'
    isFormEditable.value = configEditable || !isAddedHandler
  }
  if (!props.approvalData?.dataModel) {
    props.approvalData.dataModel = {}
  } else if (typeof props.approvalData.dataModel === 'string') {
    props.approvalData.dataModel = JSON.parse(props.approvalData.dataModel)
  }
}
function radioChange(value: string): void {
  keepFollow.value = value
}
function addMsg() {
  approvalForm.value.addMsg()
}
function notVarifyBtn(btn: Action) {
  const notVarifyBtnList = ['ZB', 'QJQ', 'JQ']
  return notVarifyBtnList.some(b => b === btn.code)
}
function qjqNeedVarify(btn: Action) {
  return btn.code === 'QJQ' && props.approvalData.isFormModelEditable === 'false'
}
function handleResult(formFields: FormFields, data: any) {
  const keyArr = Object.keys(formFields)
  const selectkey = ['pmUserList', 'keepFollowCause', ['replyMessage', 'ccUserList', 'pmUserList']]
  const res: AnyObj = {}
  enum ifFollow {
    follow = '1',
    notFollow = '0',
    reject = '2',
  }
  for (let m = 0; m < keyArr.length; m++) {
    let key = keyArr[m]
    if (formFields[key].enabled) {
      if (keepFollow.value == ifFollow.follow && selectkey[keepFollow.value] === key) continue
      if (keepFollow.value != ifFollow.follow && selectkey[Number(keepFollow.value)].includes(key)) continue
      if (data[key]) {
        if (Array.isArray(data[key])) {
          res[key] = data[key]
        } else {
          res[key] = data[key].replace(/\s*/g, '').length ? data[key].replace(/\s*/g, '') : ''
        }
      } else {
        res[key] = ''
      }
    }
  }
  const resultData = handleAddPersonComments(res)
  return resultData
}
function handleAddPersonComments(data: AnyObj) {
  if (props.approvalData.actionType === 'addPerson' && currentBtn.value?.flag !== 'abnormal') {
    const commentsData: AnyObj = props.approvalData.approvalFormValues || '{}'
    const addPersonCommentsReadonly = commentsData?.addPersonCommentsReadonly || []
    if (data?.addPersonComments) {
      const handlePerson = localStorage.getItem('userName')
      const dateInfo = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}')
      addPersonCommentsReadonly.push(`${handlePerson}：(${data.addPersonComments} ${dateInfo})`)
    }
    data.addPersonCommentsReadonly = addPersonCommentsReadonly
  } else if (currentBtn.value?.flag === 'abnormal') {
    // 驳回操作清空加签历史意见
    data.addPersonCommentsReadonly = []
  }
  return data
}
function selectPerson(btn: Action) {
  btnName.value = btn.name
  if (btn.code === 'QJQ' || btn.code === 'HJQ') {
    limit.value = btn.headcount || '10'
    title.value = `${btn.name} - 选择加签人员，最多选择${limit.value}人`
  } else {
    title.value = '选择人员'
    limit.value = btn.headcount || '1'
  }
  openSelectPerson()
}
function openSelectPerson() {
  selectPersonVisible.value = true
}
function closeSelectPerson() {
  selectPersonVisible.value = false
  nextTick(() => {
    btnName.value = ''
    limit.value = '1'
    title.value = '选择人员'
  })
}
function getPersonData(val: Person[]) {
  selectPersonArr.value = val
  submit()
}
function handleApproval() {
  if (currentBtn.value?.backStrategy && currentBtn.value?.backStrategy.length > 0) {
    getBackStrategy()
  } else {
    submit()
  }
}
function submit() {
  dialogVisible.value = false
  const dataObj = getSubmitObj()
  emit('submit', {
    actionInfo: currentBtn.value,
    data: dataObj,
    fileList: fileList.value,
  })
}
function getSubmitObj() {
  const dataObj: AnyObj = {}
  const paramObj: AnyObj = {}
  if (props.approvalData?.formKey) {
    $bus.emit('getFormValue')
    dataObj['dataModel'] = JSON.stringify(customFormValue)
  }
  if (formData.value.backStrategy === 'BACK_ASSIGN') {
    paramObj.targetActivityId = dialogFormData.targetActivityId
    paramObj.targetActivityName = dialogFormData.targetActivityName
  }
  dataObj['formValuesJson'] = JSON.stringify(formData.value)
  dataObj['processInstanceId'] = props.processId
  if (selectPersonArr.value && selectPersonArr.value.length > 0) {
    dataObj['assignUserList'] = selectPersonArr
    const userCodes = selectPersonArr.value.reduce((pre: string[], item: Person) => {
      pre.push(item.userId)
      return pre
    }, [])
    paramObj.assignUserId = userCodes.join(',')
  }
  return { data: dataObj, params: paramObj }
}
function setValid(valid: any): void {
  isValid.value = valid
}
function getData(formValue: any) {
  customFormValue = formValue
}
function listen() {
  $bus.on('validFormResult', setValid)
  $bus.on('postFormResult', getData)
}
function getBackStrategy() {
  const defaultStrategy = 'BACK_PREV'
  let backStrategy = defaultStrategy
  if (currentBtn.value?.backStrategy && currentBtn.value.backStrategy.length === 1) {
    backStrategy = Object.keys(currentBtn.value.backStrategy[0])[0]
  }
  formData.value.backStrategy = backStrategy
  switch (backStrategy) {
    case 'BACK_PREV':
    case 'BACK_START':
      submit()
      break
    case 'BACK_ASSIGN':
      if (nodeList.length > 0) {
        dialogFormData = { targetActivityId: '', targetActivityName: '' }
        dialogVisible.value = true
      } else {
        // 这里直接调用父组件的异步方法获取nodeList, 需要使用回调的方式处理异步
        emit('getNodeList', (res: NodeItem[]) => {
          nodeList = res
          dialogFormData = { targetActivityId: '', targetActivityName: '' }
          dialogVisible.value = true
        })
      }
      break
  }
}
function backConfirm(data: BackNode) {
  dialogFormData = data
  submit()
}
interface FormMakingData {
  editable_form?: boolean
  isImpactCustomerRelation?: string | number
  impactComment?: any
  [key: string]: any
}
async function hanldeClick(btn: Action) {
  currentBtn.value = btn
  const formFields = props.approvalData.approvalFormFields
  if (props.approvalData.actionType !== 'handler') {
    // 处理自定义表单和审批表单是否需要校验：1. 根据按钮类型判断；2. 前加签时，被加签人不能编辑表单，需要校验；
    const noNeedValidBtn = notVarifyBtn(btn)
    const QJQNeedVarify = qjqNeedVarify(btn)
    noNeedValidForm.value = noNeedValidBtn && !QJQNeedVarify
    let data = await getApprovalFormData()
    if (props.approvalData?.formKey) {
      // 这里处理动态表单的校验
      $bus.emit('validFormValue', noNeedValidForm.value)
    }
    if (formFields) formData.value = handleResult(formFields, data.formData)
    fileList.value = data.fileList || []
    if ((data.flag && isValid.value) || noNeedValidForm.value) {
      switch (currentBtn.value.category) {
        case 'Collaboration':
          selectPerson(currentBtn.value)
          break
        case 'Approval':
          handleApproval()
          break
        default:
          submit()
      }
    }
  } else if (props.approvalData.actionType === 'handler') {
    // 获取表单生成器的提交数据
    const handleApi = btn.api || ''
    if (!handleApi) {
      ElMessage.warning({ message: '没有提交地址', showClose: true })
      return
    }
    formMaking.value.handleSubmit().then((res: boolean | FormMakingData) => {
      // 此处提交数据为
      if (typeof res === 'object') {
        if (res?.isImpactCustomerRelation == '0') delete res.impactComment
        formData.value = res
        currentBtn.value = btn
        submit()
      } else {
        ElMessage.warning('有未填项或填写有误，请检查。')
      }
    })
  }
}
interface ResultType {
  flag: boolean
  formData: {
    [propName: string]: any
  }
  fileList: FileItem[]
}
function getApprovalFormData(): Promise<ResultType> {
  return new Promise(resolve => {
    approvalForm.value.validateForm().then((res: ResultType) => {
      resolve(res)
    })
  })
}
onMounted(() => {
  listen()
})
onUnmounted(() => {
  $bus.off('validFormResult')
  $bus.off('postFormResult')
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
  color: #333;
  font-weight: 500;
  height: 24px;
  line-height: 24px;
  padding-left: 20px;
  margin-bottom: 30px;
}
.no-form {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  padding: 40px 0;
  color: #888888;
  background: #fff;
}

.btns {
  text-align: center;
  margin-top: 60px;

  .el-button {
    border-radius: 2px;
  }
}
</style>
