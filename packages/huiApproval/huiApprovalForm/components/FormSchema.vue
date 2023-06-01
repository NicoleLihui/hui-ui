<template>
  <el-row v-if="hasMessage">
    <el-col class="history-message" v-bind="colLayout">
      <slot name="button"></slot>
    </el-col>
  </el-row>
  <el-form ref="validForm" :label-width="labelWidth" label-position="right" :model="formData" v-if="formFields">
    <el-col v-bind="colLayout">
      <el-form-item
        label="是否继续跟进"
        prop="keepFollow"
        v-if="formFields.keepFollow.enabled"
        :rules="formFields.keepFollow.required ? rules.keepFollow : [{ required: false }]"
      >
        <el-radio-group v-model="formData.keepFollow" @change="radioChange">
          <el-radio v-for="option in followOptions" :key="option.label" :label="option.label">{{
            option.value
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="noFollow">
        <el-form-item
          label="原因说明"
          prop="keepFollowCause"
          v-if="formFields.keepFollowCause.enabled"
          :rules="formFields.keepFollowCause.required ? rules.keepFollowCause : [{ required: false }]"
        >
          <el-input
            v-model="formData.keepFollowCause"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            show-word-limit
            maxlength="200"
            placeholder="请输入原因说明"
          />
        </el-form-item>
      </template>
      <template v-if="replyFollow">
        <el-form-item
          label="答复客户建议"
          prop="replyMessage"
          v-if="formFields.replyMessage.enabled"
          :rules="formFields.replyMessage.required ? rules.replyMessage : [{ required: false }]"
        >
          <el-input
            v-model="formData.replyMessage"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            show-word-limit
            maxlength="200"
            placeholder="请输入答复客户建议"
          />
        </el-form-item>
      </template>
      <template v-if="keepfollow">
        <el-form-item
          label="投资项目经理"
          prop="pmUserList"
          v-if="formFields.pmUserList.enabled"
          :rules="formFields.pmUserList.required ? rules.pmUserList : [{ required: false }]"
        >
          <el-input
            v-model="formData.pmUserNameList"
            :clearable="false"
            @focus="openSelectPerson('pm')"
            placeholder="请选择投资项目经理"
            :suffix-icon="User"
          ></el-input>
        </el-form-item>
      </template>
      <el-form-item
        label="抄送"
        prop="ccUserList"
        v-if="formFields.ccUserList.enabled"
        :rules="formFields.ccUserList.required ? rules.ccUserList : [{ required: false }]"
      >
        <el-input
          v-model="formData.ccUserNameList"
          :clearable="false"
          @focus="openSelectPerson('cc')"
          placeholder="请选择抄送人"
          :suffix-icon="User"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="审批结果"
        prop="projectJudgeResult"
        v-if="formFields.projectJudgeResult.enabled"
        :rules="formFields.projectJudgeResult.required ? rules.projectJudgeResult : [{ required: false }]"
      >
        <el-radio-group v-model="formData.projectJudgeResult">
          <el-radio v-for="option in judgeOptions" :label="option.label" :key="option.label">{{
            option.value
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="actionType === 'addPerson'">
        <el-form-item
          label="加签意见"
          prop="addPersonComments"
          v-if="formFields.addPersonComments && formFields.addPersonComments.enabled"
          :rules="formFields.addPersonComments.required ? rules.addPersonComments : [{ required: false }]"
        >
          <el-input
            type="textarea"
            v-model="formData.addPersonComments"
            :autosize="{ minRows: 2, maxRows: 5 }"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="加签意见历史"
          prop="addPersonCommentsReadonly"
          v-if="formFields.addPersonCommentsReadonly.enabled && Array.isArray(formValues.addPersonCommentsReadonly)"
        >
          <el-form-item v-for="(comment, index) in formValues.addPersonCommentsReadonly" :key="index">
            <el-input type="textarea" disabled :value="comment" :autosize="{ minRows: 2, maxRows: 5 }" />
          </el-form-item>
        </el-form-item>
      </template>
      <el-form-item
        label="审批意见"
        prop="approvalMessage"
        v-if="formFields.approvalMessage.enabled && actionType === 'approval'"
        :rules="formFields.approvalMessage.required ? rules.approvalMessage : [{ required: false }]"
      >
        <el-input
          type="textarea"
          v-model.trim="formData.approvalMessage"
          :autosize="{ minRows: 2, maxRows: 5 }"
          maxlength="200"
          placeholder="请输入审批意见"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="approvalRemark"
        v-if="formFields.approvalRemark.enabled"
        :rules="formFields.approvalRemark.required ? rules.approvalRemark : [{ required: false }]"
      >
        <el-input
          v-model.trim="formData.approvalRemark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          show-word-limit
          maxlength="200"
          placeholder="请输入备注"
        />
      </el-form-item>
      <el-form-item
        label="附件"
        prop="approvalAttachment"
        class="hui-upload"
        v-if="formFields.approvalAttachment.enabled"
        :rules="formFields.approvalAttachment.required ? rules.approvalAttachment : [{ required: false }]"
      >
        <el-upload
          ref="upload"
          multiple
          action="#"
          :auto-upload="false"
          :on-change="onChange"
          :on-remove="onRemove"
          :limit="limit"
          :on-exceed="masterFileMax"
          :file-list="fileList"
        >
          <el-button class="btn" slot="trigger">
            <HuiIcon class="icon" iconName="icon-shangchuan"></HuiIcon>上传附件
          </el-button>
          <template #tip>
            <span class="el-upload__tip">
              支持文件类型：{{ fileType ? fileType.join(',') : '' }}，大小不超过{{ limitSize }}MB
            </span>
          </template>
          <template #file="{ file }">
            <span class="file-name" :title="file.name">
              <el-icon class="blue" size="16"><Paperclip /></el-icon>
              <span>{{ file.name }}</span>
              <el-progress
                v-if="file.status === 'uploading'"
                type="line"
                :stroke-width="2"
                :percentage="Number(file.percentage)"
              />
            </span>
            <span class="file-operate">
              <el-icon class="green icon-success" size="16"><CircleCheck /></el-icon>
              <el-popconfirm
                :teleported="false"
                width="200px"
                title="是否删除此文件?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="onRemove(file)"
              >
                <template #reference>
                  <el-icon class="gray-1 delete" size="16" title="删除">
                    <Close />
                  </el-icon>
                </template>
              </el-popconfirm>
            </span>
          </template>
        </el-upload>
      </el-form-item>
    </el-col>
  </el-form>
  <HuiPerson
    v-model="selectPersonVisible"
    :title="currentTitle"
    :userId="userId"
    :departApi="departApi"
    :organizApi="organizApi"
    :slurUserApi="slurUserApi"
    :departByOrgIdApi="departByOrgIdApi"
    :mdmUserByDeptIdApi="mdmUserByDeptIdApi"
    @getCheckedData="getCheckedData"
    @closed="closeSelectPerson"
  ></HuiPerson>
</template>

<script lang="ts" setup>
import { FormFields } from '../types/types'
import rules from './rules'
import HuiPerson from '../../../huiPerson/index.vue'
import type { UploadFile, UploadFiles, ElUpload } from 'element-plus'
import { FormInstance } from 'element-plus'
import { Paperclip, CircleCheck, Close, User } from '@element-plus/icons-vue'
import HuiIcon from '../../../components/HuiIcon.vue'
import _ from 'lodash'
// 定义常量和枚举
import * as consts from './const'
const { labelWidth, colLayout, followOptions, judgeOptions, fileType, limit, limitSize } = consts
// keepfollow '0': 不跟进 '1': 跟进 '2': 驳回
enum KeepFollowEnum {
  notFollow = '0',
  follow = '1',
  reject = '2',
}
// 定义接口
interface FormData {
  ccUserList?: string
  selPerson?: string
  selPersonName?: string
  opinion?: string
  keepFollow?: string
  projectJudgeResult?: string
  approvalMessage?: string
  ccUserNameList?: string
  pmUserNameList?: string
  pmUserList?: string
  keepFollowCause?: string
  approvalRemark?: string
  addPersonComments?: string
  replyMessage?: string
  approvalAttachment?: File[]
}
// 定义外部传入的属性
const props = withDefaults(
  defineProps<{
    formFields: FormFields | null
    formValues?: any | null
    userId: string | number
    actionType: string | null
  }>(),
  {
    formValues: () => {},
    userId: '',
    actionType: '',
  }
)
// 定义inject
const radioChangeRes = inject<any>('radioChange')
const departApi = inject<any>('departApi')
const organizApi = inject<any>('organizApi')
const slurUserApi = inject<any>('slurUserApi')
const departByOrgIdApi = inject<any>('departByOrgIdApi')
const mdmUserByDeptIdApi = inject<any>('mdmUserByDeptIdApi')
const noNeedValid: any = inject('noNeedValidForm') || false
// 定义计算属性
const noFollow = computed(() => {
  return (
    formData.keepFollow &&
    [KeepFollowEnum.notFollow as string, KeepFollowEnum.reject as string].includes(formData.keepFollow)
  )
})
const hasMessage = computed(() => {
  const hasMessageValue = props.formValues && props.formValues?.approvalMessage
  const isApproval = props.actionType === 'approval'
  return hasMessageValue && isApproval
})
const replyFollow = computed(() => {
  return (
    formData.keepFollow &&
    [KeepFollowEnum.notFollow as string, KeepFollowEnum.follow as string].includes(formData.keepFollow)
  )
})
const keepfollow = computed(() => {
  return formData.keepFollow && [KeepFollowEnum.follow as string].includes(formData.keepFollow)
})
// 定义data
const formData = reactive<FormData>({
  ccUserList: '',
  selPerson: '',
  selPersonName: '',
  opinion: '',
  keepFollow: '',
  projectJudgeResult: '',
  approvalMessage: '',
  ccUserNameList: '',
  pmUserNameList: '',
  pmUserList: '',
  keepFollowCause: '',
  approvalRemark: '',
  addPersonComments: '',
  replyMessage: '',
  approvalAttachment: [],
})
let validForm = ref<FormInstance>()
let currentPerson = ref('')
let currentTitle = ref('')
let selectPersonVisible = ref(false)
let ArrayObj = reactive<{ fileList: UploadFiles; selectPersonArr: Person[] }>({
  selectPersonArr: [],
  fileList: [],
})
const { selectPersonArr, fileList } = toRefs(ArrayObj)
// 定义方法
const validateForm = async function () {
  const flag = await validFormFlag()
  const formValue = _.cloneDeep(formData)
  const files = toRaw(fileList.value)
  const data = { flag, formData: formValue, fileList: files }
  return data
}
async function validFormFlag() {
  let flag: null | boolean = null
  if (!noNeedValid.value && validForm.value) {
    await validForm.value
      .validate()
      .then(() => {
        flag = true
      })
      .catch(err => {
        ElMessage.warning(err[Object.keys(err)[0]][0].message)
        flag = false
      })
  }
  return flag
}
const radioChange = function (val: any) {
  radioChangeRes(val)
  resetFormData(val)
}
const resetFormData = function (val: any) {
  const keys = Object.keys(formData)
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i]
    if (k === 'keepFollow') continue
    if ([KeepFollowEnum.notFollow, KeepFollowEnum.follow].includes(val)) {
      formData.ccUserList = ''
      formData.ccUserNameList = ''
    }
    if (validForm.value) validForm.value.resetFields(k)
  }
}
const openSelectPerson = function (field: 'cc' | 'pm') {
  currentPerson.value = field
  switch (currentPerson.value) {
    case 'cc':
      currentTitle.value = '选择抄送人'
      selectPersonVisible.value = true
      break
    case 'pm':
      currentTitle.value = '投资项目经理'
      selectPersonVisible.value = true
      break
  }
}
function closeSelectPerson() {
  selectPersonVisible.value = false
  currentTitle.value = ''
  currentPerson.value = ''
}
// 保存当前选人弹窗的数据到formData里面，并清空选人弹窗的数据
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
  if (currentPerson.value === 'ccUserList') {
    formData.ccUserList = userStr
    formData.ccUserNameList = nameStr
  } else if (currentPerson.value === 'pmUserList') {
    formData.pmUserList = userStr
    formData.pmUserNameList = nameStr
  }
  selectPersonArr.value = []
}
function masterFileMax() {
  ElMessage.warning(`最多上传 ${limit} 个文件。`)
  return false
}
function onChange(file: UploadFile) {
  const valid = beforeFileUpload(file)
  if (valid) {
    fileList.value.push(file)
  } else {
    fileList.value.push(file)
    onRemove(file)
  }
}
function typeValid(file: UploadFile): boolean {
  const fileName = file.name
  const extensionNameArr = fileName.match(/\.(\w+)(#|\?|$)/) || []
  const extensionNameStr = (extensionNameArr && extensionNameArr[1]).toString().toLowerCase()
  const valid = fileType.includes(extensionNameStr)
  return valid
}
function sizeValid(file: UploadFile): boolean {
  const size = file?.size || 0
  const isLtM = size / 1024 / 1024 <= limitSize
  return isLtM
}
function beforeFileUpload(file: UploadFile) {
  if (file.size === 0) {
    ElMessage.warning(`上传的文件不能为空，请重新上传！`)
    return false
  }
  const type = typeValid(file)
  const size = sizeValid(file)
  if (!type) ElMessage.warning('注意上传文件的格式')
  if (!size) ElMessage.warning(`上传文件大小不能超出${limitSize}！MB`)
  return type && size
}

function onRemove(file: UploadFile) {
  const files = _.cloneDeep(fileList.value)
  fileList.value = []
  files.splice(
    files.findIndex(item => item.uid === file.uid),
    1
  )
  fileList.value = files
}
// 此处仅带入历史审批意见, 未来要改成带入所有的字段回显
function addMsg() {
  formData.approvalMessage = props.formValues.approvalMessage
}
// 暴露方法
defineExpose({ addMsg, validateForm })
</script>

<style lang="scss" scoped>
.history-message {
  margin: 12px -12px;
}
:deep(.el-upload-list) {
  width: 100%;
  margin: 12px 0 0 0;
  li {
    padding: 0 4px;
    height: 22px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 22px;
    font-size: 14px;
    color: #3c4658;
    font-weight: 400;
    margin-bottom: 10px;
    &:hover {
      color: $blue;
      background: $gray-7;
      .icon-success {
        transform: scale(0);
      }
      .file-operate .delete {
        transform: scale(1);
      }
    }
    .file-name {
      flex: 1;
      display: flex;
      align-items: center;
      margin: 0 20px 0 0;
      overflow: hidden;
      position: relative;
      .el-icon {
        margin-right: 8px;
      }
      & > span {
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .file-operate {
      position: relative;
      display: flex;
      align-items: center;
      .el-icon {
        cursor: pointer;
        margin-left: 12px;
        transition: 0.2s transform ease;
      }
      .delete {
        position: absolute;
        right: 0;
        transform: scale(0);
      }
    }
  }
  .el-upload-list__item {
    &:hover {
      .el-progress__text {
        display: block;
      }
    }
    .el-progress__text {
      top: -14px;
      text-align: right;
    }
    .el-popconfirm {
      font-size: 12px;
      .el-button {
        font-weight: 400;
        height: 22px;
        padding: 0 10px;
      }
    }
  }
}
.el-form {
  overflow: auto;
}
.blue {
  color: $blue;
}
.green {
  color: $green;
}
.gray-1 {
  color: $gray-1;
}
</style>
