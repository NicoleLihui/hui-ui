import { FormItemRule } from 'element-plus'
interface FormRule {
  [key: string]: FormItemRule[]
}
const rules: FormRule = {
  ccUserList: [{ required: true, message: '请选择抄送人', trigger: 'blur' }],
  keepFollow: [{ required: true, message: '请选择是否继续跟进', trigger: 'change' }],
  keepFollowCause: [{ required: true, message: '请填写原因', trigger: 'blur' }],
  pmUserList: [{ required: true, message: '请选择投资项目经理', trigger: 'change' }],
  replyMessage: [{ required: true, message: '请填写答复客户建议', trigger: 'blur' }],
  approvalRemark: [{ required: true, message: '请填写备注', trigger: 'blur' }],
  projectJudgeResult: [{ required: true, message: '请填写审批结果', trigger: 'blur' }],
  approvalMessage: [{ required: true, message: '请填写审批意见', trigger: 'change' }],
  approvalAttachment: [{ required: true, message: '请添加附件', trigger: 'blur' }],
  addPersonComments: [{ required: true, message: '请填写加签意见', trigger: 'blur' }],
}
export default rules
