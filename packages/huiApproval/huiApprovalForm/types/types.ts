export interface formFieldsItem {
  enabled: boolean
  label: string
  name: string
  required: boolean
  [propName: string]: any
}

export interface FormFields {
  addPersonComments: formFieldsItem
  addPersonCommentsReadonly: formFieldsItem
  approvalAttachment: formFieldsItem
  addPersonCommnts: formFieldsItem
  approvalMessage: formFieldsItem
  approvalRemark: formFieldsItem
  ccUserList: formFieldsItem
  keepFollow: formFieldsItem
  keepFollowCause: formFieldsItem
  projectJudgeResult: formFieldsItem
  replyMessage: formFieldsItem
  pmUserList: formFieldsItem
  [propName: string]: any
}
export interface Action {
  api: string
  category: string
  code: string
  flag: string | null
  name: string
  backStrategy?: AnyObj[]
  confirmTips?: string
  [propName: string]: any
}

export interface NodeItem {
  nodeId: string
  nodeName: string
  [propName: string]: any
}

export interface BackNode {
  targetActivityId: string
  targetActivityName: string
}

export interface FileItem {
  [propName: string]: any
}

export interface ApprovalData {
  actionType: string | null
  approvalFormFields: FormFields | null
  formActionList: Action[] | null
  approvalFormValues: {} | null
  formList: [] | null
  formKey?: string | null
  dataModel?: string | object | null
  isFormModelEditable?: boolean | string | null
  taskId?: string | null
}
